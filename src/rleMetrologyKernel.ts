export interface RleSpan {
  readonly startPixel: number;
  readonly length: number;
}

export interface CalibratedMetrologyReport {
  readonly targetPixelCount: number;
  readonly referencePixelCount: number;
  readonly calibratedAreaMm2: number;
  readonly centroidX: number;
  readonly centroidY: number;
  readonly temporalIou: number;
}

export interface SubPixelMeniscusCusumProfile {
  readonly smoothedChordsPx: readonly number[];
  readonly graduationInkResidualPx: readonly number[];
  readonly detectedGraduationPitchPx: number;
  readonly observedGraduationTickCount: number;
  readonly meniscusTaperRowsPx: number;
  readonly maxInteriorCusumDrift: number;
  readonly quantizationNoiseReductionRatio: number;
  readonly opticalPufSignatureHex64: string;
  readonly nyquistMoireLivenessIndexUpsilon: number;
  readonly is2dDisplayPresentationSpoofDetected: boolean;
}

/**
 * Parses SAM 3.1 lossless `~` RLE wire payloads into immutable span intervals
 * and computes 2D spatial centroids in O(R) time without bitmap allocation.
 * Strict 2-method boundary: parseWireToSpans and computeCentroid.
 */
export class RleBitstreamScanner {
  public parseWireToSpans(rawRlePayload: string, totalPixels: number): readonly RleSpan[] {
    if (!rawRlePayload || rawRlePayload.trim().length === 0) {
      throw new Error("Fail-fast invariant violated: empty SAM 3.1 RLE payload.");
    }
    if (totalPixels <= 0 || !Number.isInteger(totalPixels)) {
      throw new Error("Fail-fast invariant violated: totalPixels must be a positive integer.");
    }

    const sanitized = rawRlePayload.startsWith("~") ? rawRlePayload.slice(1) : rawRlePayload;
    const tokens = sanitized.split(",").map((t, idx) => {
      const trimmed = t.trim();
      if (!/^\d+$/.test(trimmed)) {
        throw new Error(`Corrupted RLE wire token at index ${idx}.`);
      }
      return Number(trimmed);
    });
    const spans: RleSpan[] = [];
    let cursor = 0;

    for (let i = 0; i < tokens.length; i += 2) {
      const zeroRun = tokens[i];
      const oneRun = tokens[i + 1];
      if (zeroRun === undefined || !Number.isSafeInteger(zeroRun) || zeroRun < 0) {
        throw new Error(`Corrupted RLE wire token at index ${i}.`);
      }
      if (cursor + zeroRun > totalPixels) {
        throw new Error(`RLE zero-run bounds violation at cursor ${cursor}.`);
      }
      cursor += zeroRun;
      if (oneRun !== undefined) {
        if (!Number.isSafeInteger(oneRun) || oneRun < 0 || cursor + oneRun > totalPixels) {
          throw new Error(`RLE span bounds violation at cursor ${cursor}.`);
        }
        if (oneRun > 0) {
          spans.push({ startPixel: cursor, length: oneRun });
        }
        cursor += oneRun;
      }
    }
    return spans;
  }

  public computeCentroid(
    spans: readonly RleSpan[],
    frameWidth: number
  ): { readonly x: number; readonly y: number; readonly areaPx: number } {
    if (frameWidth <= 0 || !Number.isInteger(frameWidth)) {
      throw new Error("frameWidth must be a positive integer.");
    }

    let weightedX = 0;
    let weightedY = 0;
    let totalAreaPx = 0;

    for (const span of spans) {
      if (span.length <= 0) continue;
      totalAreaPx += span.length;
      let cur = span.startPixel;
      let remaining = span.length;
      while (remaining > 0) {
        const row = Math.floor(cur / frameWidth);
        const col = cur % frameWidth;
        const rowSegmentLen = Math.min(remaining, frameWidth - col);
        weightedX += rowSegmentLen * col + (rowSegmentLen * (rowSegmentLen - 1)) / 2;
        weightedY += rowSegmentLen * row;
        cur += rowSegmentLen;
        remaining -= rowSegmentLen;
      }
    }

    if (totalAreaPx === 0) {
      return { x: 0, y: 0, areaPx: 0 };
    }

    return {
      x: weightedX / totalAreaPx,
      y: weightedY / totalAreaPx,
      areaPx: totalAreaPx,
    };
  }
}

/**
 * Bridges external graduation-ink occlusions, applies 5-tap Savitzky-Golay smoothing,
 * locks onto the ISO 7886-1 graduation comb, extracts a 64-bit Optical PUF signature,
 * AND computes the Lag-1 Nyquist Moiré Liveness Index to block 2D OLED screen spoofs.
 * Strict 2-method boundary: reconstructSavitzkyGolayChords and analyzeMeniscusAndCavitationCusum.
 */
export class SubPixelScanlineReconstructor {
  public reconstructSavitzkyGolayChords(rawChordsPx: readonly number[]): readonly number[] {
    const n = rawChordsPx.length;
    if (n === 0) {
      throw new Error("Cannot apply Savitzky-Golay filter to empty scanline vector.");
    }
    if (n < 5) {
      return [...rawChordsPx];
    }

    const envelope: number[] = new Array<number>(n);
    envelope[0] = rawChordsPx[0]!;
    envelope[n - 1] = rawChordsPx[n - 1]!;
    for (let i = 1; i < n - 1; i++) {
      const prev = rawChordsPx[i - 1]!;
      const curr = rawChordsPx[i]!;
      const next = rawChordsPx[i + 1]!;
      const neighborMean = 0.5 * (prev + next);
      const isPeriodTwoMoireBeat =
        (i < 2 || rawChordsPx[i - 2]! < neighborMean * 0.96) &&
        (i + 2 >= n || rawChordsPx[i + 2]! < neighborMean * 0.96);
      const isNarrowTickNotch =
        !isPeriodTwoMoireBeat &&
        curr < neighborMean * 0.96 &&
        curr > neighborMean * 0.65 &&
        Math.abs(prev - next) <= 2.0;
      envelope[i] = isNarrowTickNotch ? neighborMean : curr;
    }

    const smoothed: number[] = new Array<number>(n);
    smoothed[0] = envelope[0]!;
    smoothed[1] = (envelope[0]! + envelope[1]! + envelope[2]!) / 3.0;
    smoothed[n - 2] = (envelope[n - 3]! + envelope[n - 2]! + envelope[n - 1]!) / 3.0;
    smoothed[n - 1] = envelope[n - 1]!;

    for (let i = 2; i < n - 2; i++) {
      const val =
        (-3.0 * envelope[i - 2]! +
          12.0 * envelope[i - 1]! +
          17.0 * envelope[i]! +
          12.0 * envelope[i + 1]! -
          3.0 * envelope[i + 2]!) /
        35.0;
      smoothed[i] = Math.max(0.0, val);
    }

    return smoothed;
  }

  public analyzeMeniscusAndCavitationCusum(
    rawChordsPx: readonly number[]
  ): SubPixelMeniscusCusumProfile {
    const smoothedChordsPx = this.reconstructSavitzkyGolayChords(rawChordsPx);
    const n = smoothedChordsPx.length;

    const graduationInkResidualPx: number[] = new Array<number>(n);
    const microStriationResidual: number[] = new Array<number>(n);
    for (let i = 0; i < n; i++) {
      graduationInkResidualPx[i] = Math.max(0, smoothedChordsPx[i]! - rawChordsPx[i]!);
      microStriationResidual[i] = rawChordsPx[i]! - smoothedChordsPx[i]!;
    }

    // 1. Lag-1 Nyquist Moiré Liveness Index (Upsilon) for 2D OLED Screen-Spoof Detection:
    // High-frequency 2-row sub-pixel beat aliasing produces strong negative lag-1 correlation (< -0.55)
    let lag1Cross = 0;
    let lag0Energy = 0;
    for (let i = 0; i < n; i++) {
      lag0Energy += microStriationResidual[i]! * microStriationResidual[i]!;
      if (i < n - 1) {
        lag1Cross += microStriationResidual[i]! * microStriationResidual[i + 1]!;
      }
    }
    const nyquistMoireLivenessIndexUpsilon =
      lag0Energy > 1e-6 ? lag1Cross / lag0Energy : 0.0;
    const is2dDisplayPresentationSpoofDetected =
      lag0Energy > 2.0 && nyquistMoireLivenessIndexUpsilon < -0.55;

    // 2. 64-Bit Daugman-Style 1D Haar Wavelet Phase Encoding for Optical PUF
    let high32 = 0;
    let low32 = 0;
    for (let bitIdx = 0; bitIdx < 64; bitIdx++) {
      const idxA = Math.min(n - 1, Math.floor((bitIdx * n) / 64));
      const idxB = Math.min(n - 1, Math.floor(((bitIdx + 1) * n) / 64));
      const haarWaveletDiff =
        microStriationResidual[idxA]! -
        microStriationResidual[idxB === idxA ? (idxA + 1) % n : idxB]!;
      const bit = haarWaveletDiff >= 0 ? 1 : 0;

      if (bitIdx < 32) {
        high32 = ((high32 << 1) | bit) >>> 0;
      } else {
        low32 = ((low32 << 1) | bit) >>> 0;
      }
    }
    const opticalPufSignatureHex64 =
      high32.toString(16).padStart(8, "0") + low32.toString(16).padStart(8, "0");

    let bestLagPx = 0;
    let maxAutocorr = 0;
    const maxLag = Math.min(20, Math.floor(n / 2));
    for (let lag = 3; lag <= maxLag; lag++) {
      let corr = 0;
      for (let i = 0; i < n - lag; i++) {
        corr += graduationInkResidualPx[i]! * graduationInkResidualPx[i + lag]!;
      }
      if (corr > maxAutocorr) {
        maxAutocorr = corr;
        bestLagPx = lag;
      }
    }

    const detectedGraduationPitchPx = maxAutocorr > 0.25 ? bestLagPx : 0;
    const observedGraduationTickCount =
      detectedGraduationPitchPx > 0 ? n / detectedGraduationPitchPx : 0;

    const startShaft = Math.floor(n * 0.25);
    const endShaft = Math.max(startShaft + 1, Math.floor(n * 0.75));
    let shaftSum = 0;
    for (let i = startShaft; i < endShaft; i++) {
      shaftSum += smoothedChordsPx[i]!;
    }
    const nominalDiameterPx = shaftSum / (endShaft - startShaft);

    let meniscusTaperRowsPx = 0;
    const maxSearchRows = Math.min(n, Math.floor(n * 0.25));
    for (let i = 0; i < maxSearchRows; i++) {
      if (smoothedChordsPx[i]! < nominalDiameterPx * 0.94) {
        meniscusTaperRowsPx++;
      } else {
        break;
      }
    }

    let cusumPos = 0;
    let maxInteriorCusumDrift = 0;
    const driftAllowance = nominalDiameterPx * 0.03;

    for (let i = meniscusTaperRowsPx; i < n; i++) {
      const deviation = Math.abs(smoothedChordsPx[i]! - nominalDiameterPx) - driftAllowance;
      cusumPos = Math.max(0, cusumPos + deviation);
      if (cusumPos > maxInteriorCusumDrift) {
        maxInteriorCusumDrift = cusumPos;
      }
    }

    let rawDiffSq = 0;
    let smoothDiffSq = 0;
    for (let i = startShaft + 1; i < endShaft; i++) {
      const dRaw = rawChordsPx[i]! - rawChordsPx[i - 1]!;
      const dSmooth = smoothedChordsPx[i]! - smoothedChordsPx[i - 1]!;
      rawDiffSq += dRaw * dRaw;
      smoothDiffSq += dSmooth * dSmooth;
    }

    const quantizationNoiseReductionRatio =
      rawDiffSq <= 1e-9 ? 1.0 : Math.max(1.0, rawDiffSq / Math.max(smoothDiffSq, 1e-6));

    return {
      smoothedChordsPx,
      graduationInkResidualPx,
      detectedGraduationPitchPx,
      observedGraduationTickCount,
      meniscusTaperRowsPx,
      maxInteriorCusumDrift:
        nominalDiameterPx <= 0 ? 0 : maxInteriorCusumDrift / nominalDiameterPx,
      quantizationNoiseReductionRatio,
      opticalPufSignatureHex64,
      nyquistMoireLivenessIndexUpsilon,
      is2dDisplayPresentationSpoofDetected,
    };
  }
}

/**
 * Computes physical area (mm^2) from reference fiducial spans and O(R_a + R_b)
 * temporal Intersection-over-Union (IoU) across sequential video frames.
 * Strict 2-method boundary: computeIntervalIou and calibratePhysicalMetrics.
 */
export class PhysicalMetrologyCalculator {
  public computeIntervalIou(
    currentSpans: readonly RleSpan[],
    previousSpans: readonly RleSpan[]
  ): number {
    let idxA = 0;
    let idxB = 0;
    let intersectionPx = 0;
    let areaA = 0;
    let areaB = 0;

    for (const s of currentSpans) areaA += s.length;
    for (const s of previousSpans) areaB += s.length;

    while (idxA < currentSpans.length && idxB < previousSpans.length) {
      const spanA = currentSpans[idxA]!;
      const spanB = previousSpans[idxB]!;
      const endA = spanA.startPixel + spanA.length;
      const endB = spanB.startPixel + spanB.length;

      const overlapStart = Math.max(spanA.startPixel, spanB.startPixel);
      const overlapEnd = Math.min(endA, endB);

      if (overlapStart < overlapEnd) {
        intersectionPx += overlapEnd - overlapStart;
      }

      if (endA < endB) {
        idxA++;
      } else {
        idxB++;
      }
    }

    const unionPx = areaA + areaB - intersectionPx;
    return unionPx === 0 ? 0 : intersectionPx / unionPx;
  }

  public calibratePhysicalMetrics(
    targetSpans: readonly RleSpan[],
    referenceSpans: readonly RleSpan[],
    previousTargetSpans: readonly RleSpan[],
    referenceAreaMm2: number,
    frameWidth: number,
    scanner: RleBitstreamScanner
  ): CalibratedMetrologyReport {
    if (referenceAreaMm2 <= 0) {
      throw new Error("referenceAreaMm2 must be strictly positive.");
    }

    const targetStats = scanner.computeCentroid(targetSpans, frameWidth);
    const refStats = scanner.computeCentroid(referenceSpans, frameWidth);

    if (refStats.areaPx === 0) {
      throw new Error("Calibration failure: reference fiducial object has 0 segmented pixels.");
    }

    const calibratedAreaMm2 =
      referenceAreaMm2 * (targetStats.areaPx / refStats.areaPx);
    const temporalIou = this.computeIntervalIou(targetSpans, previousTargetSpans);

    return {
      targetPixelCount: targetStats.areaPx,
      referencePixelCount: refStats.areaPx,
      calibratedAreaMm2,
      centroidX: targetStats.x,
      centroidY: targetStats.y,
      temporalIou,
    };
  }
}
