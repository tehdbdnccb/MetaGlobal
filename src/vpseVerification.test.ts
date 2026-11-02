import { describe, it } from "node:test";
import assert from "node:assert/strict";

function expect<T>(actual: T) {
  return {
    toBe(expected: T): void {
      assert.equal(actual, expected);
    },
    toBeGreaterThan(expected: number): void {
      assert.ok(typeof actual === "number" && actual > expected);
    },
    toContain(expectedSubstring: string): void {
      assert.ok(typeof actual === "string" && actual.includes(expectedSubstring));
    },
    toThrow(): void {
      assert.throws(actual as unknown as () => unknown);
    },
  };
}
import {
  RleBitstreamScanner,
  PhysicalMetrologyCalculator,
  SubPixelScanlineReconstructor,
} from "./rleMetrologyKernel";
import { SamWireExtractor } from "./samParallelEngine";
import { GlimmerTraceParser, EpistemicDivergenceAuditor } from "./epistemicFirewall";
import {
  RleSolidOfRevolutionIntegrator,
  KalmanMeniscusFlowPredictor,
  PharmacokineticSafetyVerifier,
  PatientPharmacokineticProfile,
} from "./volumetricPharmacokineticKernel";
import {
  ByzantineConsensusValidator,
  AutonomousSelfHealingOrchestrator,
  GENESIS_FRAME_HASH,
} from "./byzantineConsensusOrchestrator";
import { AudioIngressGuard, GlimmerEdgeEndpointGuard } from "./glimmerVoiceIngress";

/**
 * Factory for deterministic test fixtures across tilted/turbid/sedimented 3D
 * cylindrical barrels and Muse Glimmer 30B dual-channel traces.
 * Strict 2-method boundary: createBarrelWithDistalSedimentationRle and createGlimmerFixture.
 */
export class TestFixtureFactory {
  public createBarrelWithDistalSedimentationRle(
    frameWidth: number,
    startRow: number,
    rowCount: number,
    cylinderDiameterPx: number,
    distalTurbidityJitterPx: number = 0
  ): string {
    const runs: number[] = [];
    let currentCursor = 0;
    const sedimentStartRow = Math.floor(rowCount * 0.75);

    for (let r = 0; r < rowCount; r++) {
      const isDistalSedimentZone = r >= sedimentStartRow;
      const jitterOffset =
        isDistalSedimentZone && distalTurbidityJitterPx > 0
          ? r % 2 === 0
            ? distalTurbidityJitterPx
            : -distalTurbidityJitterPx
          : 0;
      const colStart = Math.round(40 + jitterOffset);
      const rowStartPx = (startRow + r) * frameWidth + colStart;
      const zeroGap = rowStartPx - currentCursor;
      runs.push(zeroGap, cylinderDiameterPx);
      currentCursor = rowStartPx + cylinderDiameterPx;
    }

    return `~${runs.join(",")}`;
  }

  public createGlimmerFixture(selfText: string, userText: string): string {
    return `assistant to=self\n${selfText}\nassistant to=user\n${userText}`;
  }
}

/**
 * Mathematical, optical, De Gennes hyperbolic Luer-contraction extensional Deborah
 * unfolding, Taylor-Aris catheter washout, and 10-stream ERC-3643 RWA assertions.
 * Strict 2-method boundary: assertDeGennesExtensionalDeborahAndTaylorAris and assertTenStreamErc3643RwaOriginationSettlement.
 */
export class VpseMathematicalVerifier {
  public assertDeGennesExtensionalDeborahAndTaylorAris(): void {
    const scanner = new RleBitstreamScanner();
    const reconstructor = new SubPixelScanlineReconstructor();
    const calculator = new PhysicalMetrologyCalculator();
    const integrator = new RleSolidOfRevolutionIntegrator();
    const kalman = new KalmanMeniscusFlowPredictor();
    const pkVerifier = new PharmacokineticSafetyVerifier();
    const factory = new TestFixtureFactory();

    const moireChords = [20, 24, 20, 24, 20, 24, 20, 24, 20, 24, 20, 24];
    const moireProfile = reconstructor.analyzeMeniscusAndCavitationCusum(moireChords);
    expect(moireProfile.is2dDisplayPresentationSpoofDetected).toBe(true);

    const refSpans = scanner.parseWireToSpans("~0,100", 200_000);
    const cleanWire = factory.createBarrelWithDistalSedimentationRle(300, 10, 20, 10, 0);
    const cleanSpans = scanner.parseWireToSpans(cleanWire, 200_000);
    const cleanPlanar = calculator.calibratePhysicalMetrics(
      cleanSpans,
      refSpans,
      cleanSpans,
      100.0,
      300,
      scanner
    );
    const cleanVolReport = integrator.integrateCylindricalVolumeMl(
      cleanSpans,
      cleanPlanar,
      100.0,
      300,
      0.08
    );

    // 1. Prove De Gennes Hyperbolic Luer-Contraction Coil-Stretch Unfolding Interception:
    // Straight-needle Hagen-Poiseuille wall shear is SAFE (< 50 Pa),
    // but a high-molecular-weight mRNA LNP / concentrated mAb with Zimm relaxation time
    // lambda_Zimm = 0.0020 s (2.0 ms) accelerating from R_barrel = 5.0 mm into r_nozzle = 0.203 mm
    // experiences Hencky extensional strain rate > 350 s^-1 -> De_ext > 0.50!
    const extensionalUnfoldingHorizon = kalman.evaluatePredictiveHorizonBreach(
      {
        filteredVolumeMl: 1.50,
        flowVelocityMlPerSec: 0.25,
        frameTimestampMs: 1000,
      },
      1.5708,
      1250,
      2.50,
      0.50,
      5.0,
      65.0,
      0.0,
      0.203,
      500.0, // Straight-needle shear ceiling is NOT breached
      1.65,
      25.0,
      undefined,
      0.015,
      0.5,
      0.012,
      Number.POSITIVE_INFINITY,
      0.90,
      0.35,
      10.0,
      10.0,
      0.10,
      8.0,
      0.0,
      1.5,
      0.0020, // 2.0 ms Zimm conformational relaxation time for mRNA LNP / concentrated mAb
      0.50 // De Gennes critical coil-stretch threshold De_crit = 0.50
    );

    expect(extensionalUnfoldingHorizon.isShearDenaturationDetected).toBe(false);
    expect(
      extensionalUnfoldingHorizon.henckyExtensionalStrainRatePerSec
    ).toBeGreaterThan(300.0);
    expect(
      extensionalUnfoldingHorizon.deGennesExtensionalDeborahNumberDe
    ).toBeGreaterThan(0.50);
    expect(
      extensionalUnfoldingHorizon.isExtensionalCoilStretchDenaturationDetected
    ).toBe(true);

    const lnpProfile: PatientPharmacokineticProfile = {
      patientIdHash: "mrna-lnp-oncology-vaccine-701",
      weightKg: 70,
      renalClearanceFactor: 1.0,
      drugName: "Personalized Neoantigen mRNA-LNP / Subcutaneous mAb",
      concentrationMgPerMl: 25,
      maxAllowedExtensionalDeborahDe: 0.50,
      minSafeDoseMgPerKg: 0.5,
      maxSafeDoseMgPerKg: 2.0,
      maxAllowedKappa: 0.08,
    };

    const deGennesVerdict = pkVerifier.evaluateVolumetricSafetyInvariant(
      cleanVolReport,
      lnpProfile,
      extensionalUnfoldingHorizon
    );
    expect(deGennesVerdict.isSafeToAdminister).toBe(false);
    expect(
      deGennesVerdict.isExtensionalCoilStretchDenaturationDetected
    ).toBe(true);
    expect(deGennesVerdict.clinicalViolationReason).toContain(
      "DE GENNES HYPERBOLIC LUER-CONTRACTION COIL-STRETCH INTERCEPT"
    );

    // 2. Prove Taylor-Aris Catheter Dead-Volume Retention Lockout when unflushed
    const unflushedVerdict = pkVerifier.evaluateVolumetricSafetyInvariant(
      cleanVolReport,
      { ...lnpProfile, minAllowedCatheterWashoutEfficiencyEta: 0.95 },
      undefined,
      {
        nominalVialCapacityMl: cleanVolReport.calibratedVolumeMl + 2.0,
        preDrawVialVolumeMl: cleanVolReport.calibratedVolumeMl + 2.0,
        postDrawVialVolumeMl: 2.0,
        deadSpaceResidualMl: 0.0,
        catheterDeadSpaceVolumeMl: 0.45,
        salineFlushChaseVolumeMl: 0.0,
        maxDiversionToleranceMl: 0.25,
      }
    );
    expect(unflushedVerdict.isSafeToAdminister).toBe(false);
    expect(unflushedVerdict.isTaylorArisCatheterRetentionLossDetected).toBe(true);
  }

  public assertTenStreamErc3643RwaOriginationSettlement(): void {
    const scanner = new RleBitstreamScanner();
    const calculator = new PhysicalMetrologyCalculator();
    const integrator = new RleSolidOfRevolutionIntegrator();
    const pkVerifier = new PharmacokineticSafetyVerifier();
    const factory = new TestFixtureFactory();

    const refSpans = scanner.parseWireToSpans("~0,100", 200_000);
    const cleanWire = factory.createBarrelWithDistalSedimentationRle(300, 10, 20, 10, 0);
    const cleanSpans = scanner.parseWireToSpans(cleanWire, 200_000);
    const planar = calculator.calibratePhysicalMetrics(
      cleanSpans,
      refSpans,
      cleanSpans,
      100.0,
      300,
      scanner
    );
    const volReport = integrator.integrateCylindricalVolumeMl(
      cleanSpans,
      planar,
      100.0,
      300,
      0.08
    );

    const patientAProfile: PatientPharmacokineticProfile = {
      patientIdHash: "secret-patient-ssn-99481",
      weightKg: 70,
      renalClearanceFactor: 1.0,
      drugName: "Phase III ADC / FDA Purple-Book Interchangeable Biologic",
      hcpcsJCode: "J9271",
      purpleBookBiosimilarCode: "Q5119_INTERCHANGEABLE",
      concentrationMgPerMl: 25,
      minAllowedCatheterWashoutEfficiencyEta: 0.95,
      minSafeDoseMgPerKg: 0.5,
      maxSafeDoseMgPerKg: 2.0,
      maxAllowedKappa: 0.08,
    };

    // Prove Full 10-Stream Clearinghouse Settlement including Zero-Balance-Sheet
    // ERC-3643 Permissioned RWA & ISO 20022 pacs.008 Liquidity Origination (85 bps = $120.14):
    // Total BTech 10-Stream Clearing Revenue per scan reaches $2,874.53 with $0 balance-sheet risk!
    const tenStreamVerdict = pkVerifier.evaluateVolumetricSafetyInvariant(
      volReport,
      patientAProfile,
      undefined,
      {
        nominalVialCapacityMl: volReport.calibratedVolumeMl + 2.0,
        preDrawVialVolumeMl: volReport.calibratedVolumeMl + 2.0,
        postDrawVialVolumeMl: 2.0,
        deadSpaceResidualMl: 0.0,
        catheterDeadSpaceVolumeMl: 0.45,
        salineFlushChaseVolumeMl: 3.0,
        maxDiversionToleranceMl: 0.25,
        reimbursementRateUsdPerMl: 4000.0,
        wholesaleAcquisitionCostUsdPerMl: 3200.0,
        iraMaximumFairPriceUsdPerMl: 1950.0,
        factoringFeeBps: 150,
        consignmentEscrowFeeBps: 75,
        mtfIraClearingFeeBps: 50,
        stopLossReinsuranceFeeBps: 100,
        gpoEomClearingFeeBps: 65,
        croEndpointUnderwritingFeeBps: 125,
        rwaOriginationFeeBps: 85,
        pbmSpreadMarkupRatio: 0.22,
        purpleBookBiosimilarSavingsRatio: 0.18,
        gpoTieredRebateRatio: 0.065,
        cmsEomEpisodeQualityBonusUsd: 350.0,
        croPerProtocolMilestoneGrantUsd: 1200.0,
        clinicalTrialProtocolId: "NCT06202699_ENHERTU_ADC",
        enableUsp797SplitVialEscrow: true,
        enableZeroCapexConsignmentClearance: true,
        enableSiteOfCareDecentralizationArbitrage: true,
        enableIraMfpRebateEffectuation: true,
        enableStopLossReinsuranceSecuritisation: true,
        enableErisaFiduciaryPbmBypass: true,
        enableGpoEdi849AndCmsEomSettlement: true,
        enableCroCdiscAdexEndpointSettlement: true,
        enableErc3643RwaLiquidityOrigination: true,
        is340bStatutoryDiscountClaimed: false,
        hopdFacilityMarkupMultiplier: 2.60,
      }
    );

    expect(tenStreamVerdict.isSafeToAdminister).toBe(true);
    expect(
      tenStreamVerdict.cmsReimbursementClaim.erc3643RwaTokenizedNoteAmountUsd
    ).toBeGreaterThan(14100.0);
    expect(
      tenStreamVerdict.cmsReimbursementClaim.btechRwaOriginationFeeUsd
    ).toBeGreaterThan(120.0);
    expect(
      tenStreamVerdict.cmsReimbursementClaim.btechUnderwritingRevenueUsd
    ).toBeGreaterThan(2870.0);
    expect(
      tenStreamVerdict.cmsReimbursementClaim
        .erc3643Iso20022Pacs008RwaSettlementPayload
    ).toContain("ERC3643:RWA:ISO20022:pacs.008.001.10|NOTE:BTECH_RWA_");

    const parser = new GlimmerTraceParser();
    const auditor = new EpistemicDivergenceAuditor();
    const epistemicVerdict = auditor.auditChannelConsistency(
      factory.createGlimmerFixture("Measured 1.57 mL", "Measured 1.57 mL"),
      0.05,
      parser
    );
    const byzantine = new AutonomousSelfHealingOrchestrator(
      new ByzantineConsensusValidator()
    );
    const directive = byzantine.orchestrateConsensusAndHealing(
      "session-puf-01",
      volReport,
      tenStreamVerdict,
      epistemicVerdict,
      null,
      {
        frameIndex: 0,
        previousFrameIndex: -1,
        previousFrameProofHash: GENESIS_FRAME_HASH,
      }
    );
    expect(directive.consensusReport.quorumAchieved).toBe(true);

    const extractor = new SamWireExtractor();
    expect(() => extractor.validateMediaEndpoint("https://169.254.169.254/meta")).toThrow();

    const audioGuard = new AudioIngressGuard();
    const wavHeader = new Uint8Array([
      0x52, 0x49, 0x46, 0x46, 0x24, 0x00, 0x00, 0x00, 0x57, 0x41, 0x56, 0x45, 0x00, 0x00,
    ]);
    expect(audioGuard.validateAudioMagicBytes(wavHeader, 1024)).toBe("wav");

    const airGapGuard = new GlimmerEdgeEndpointGuard();
    expect(
      airGapGuard.enforceLocalAirGapEndpoint("https://btech-edge.trycloudflare.com/v1")
    ).toBe("https://btech-edge.trycloudflare.com/v1");
  }
}

describe("VPSE-Rx Level-20 De Gennes Coil-Stretch Deborah Unfolding & ERC-3643 RWA 10-Stream Suite", () => {
  it("proves De Gennes hyperbolic Luer-contraction coil-stretch lockout (De_ext > 0.50) when straight-needle shear is safe", () => {
    const verifier = new VpseMathematicalVerifier();
    verifier.assertDeGennesExtensionalDeborahAndTaylorAris();
  });

  it("proves Zero-Balance-Sheet ERC-3643 RWA & ISO 20022 pacs.008 10-stream clearinghouse settlement ($2,874+ BTech revenue/scan)", () => {
    const verifier = new VpseMathematicalVerifier();
    verifier.assertTenStreamErc3643RwaOriginationSettlement();
  });
});