import { createHash } from "crypto";
import {
  CalibratedMetrologyReport,
  RleSpan,
  SubPixelScanlineReconstructor,
} from "./rleMetrologyKernel";

export interface OpticalCompensationConfig {
  readonly fiducialObservedBbox: readonly [number, number, number, number];
  readonly liquidRefractiveIndex: number;
  readonly barrelWallThicknessRatio: number;
  readonly outerBarrelDiameterPx?: number;
  readonly luerLockTipWidthPx?: number;
  readonly explicitMeniscusHeightMm?: number;
  readonly solventBaselineRefractiveIndexN0?: number;
  readonly gladstoneDaleDnDcMlPerMg?: number;
  readonly diluentBaselineOsmolarityMosmPerLiter?: number;
  readonly soluteSpecificOsmolarityCoefficient?: number;
}

export interface YoungLaplaceMeniscusReport {
  readonly meniscusCapillaryVoidMl: number;
  readonly estimatedContactAngleDeg: number;
  readonly capillaryAspectRatioXi: number;
  readonly measuredRefractiveIndexN: number;
  readonly assayedOpticalConcentrationMgPerMl: number;
  readonly vanTHoffOsmolarityMosmPerLiter: number;
  readonly youngLippmannIonicStrengthMolPerLiter: number;
  readonly hasSurfaceTensionAdulteration: boolean;
}

export interface ScanlineChordProfile {
  readonly activeScanlineCount: number;
  readonly chordWidthsPx: readonly number[];
  readonly smoothedChordsPx: readonly number[];
  readonly meanChordWidthPx: number;
  readonly radialDistortionIndexKappa: number;
  readonly axialSchlierenGradientXi: number;
  readonly requiredMixingInversionsCount: number;
  readonly inPlaneRollCosinePsi: number;
  readonly tyndallAllanVarianceLambda: number;
  readonly distalLuerAllanVarianceLambda: number;
  readonly stokesSedimentationIndexZ: number;
  readonly meniscusTaperRowsPx: number;
  readonly detectedGraduationPitchPx: number;
  readonly observedGraduationTickCount: number;
  readonly opticalPufSignatureHex64: string;
  readonly nyquistMoireLivenessIndexUpsilon: number;
  readonly is2dDisplayPresentationSpoofDetected: boolean;
}

export interface VolumetricMetrologyReport {
  readonly calibratedVolumeMl: number;
  readonly uncompensatedVolumeMl: number;
  readonly meniscusCapillaryVoidMl: number;
  readonly estimatedContactAngleDeg: number;
  readonly measuredRefractiveIndexN: number;
  readonly assayedOpticalConcentrationMgPerMl: number;
  readonly assayedTotalDrugMassMg: number;
  readonly vanTHoffOsmolarityMosmPerLiter: number;
  readonly youngLippmannIonicStrengthMolPerLiter: number;
  readonly axialSchlierenGradientXi: number;
  readonly requiredMixingInversionsCount: number;
  readonly isAxialSchlierenStratificationDetected: boolean;
  readonly hasSurfaceTensionAdulteration: boolean;
  readonly linearScaleMmPerPx: number;
  readonly zDepthParallaxRatioZeta: number;
  readonly inPlaneRollCosinePsi: number;
  readonly tyndallAllanVarianceLambda: number;
  readonly distalLuerAllanVarianceLambda: number;
  readonly stokesSedimentationIndexZ: number;
  readonly isStokesGravitationalSedimentationDetected: boolean;
  readonly isProteinAggregationOrTurbidityDetected: boolean;
  readonly isZeroCardLuerFallbackActive: boolean;
  readonly tiltForeshorteningGamma: number;
  readonly snellRadialContractionEta: number;
  readonly activeScanlineCount: number;
  readonly meanDiameterMm: number;
  readonly radialDistortionIndexKappa: number;
  readonly detectedGraduationPitchPx: number;
  readonly observedGraduationTickCount: number;
  readonly opticalPufSignatureHex64: string;
  readonly nyquistMoireLivenessIndexUpsilon: number;
  readonly is2dDisplayPresentationSpoofDetected: boolean;
  readonly hasCavitationOrTamperAnomaly: boolean;
}

export interface CommittedSyringePufRecord {
  readonly opticalPufSignatureHex64: string;
  readonly patientIdHash: string;
  readonly claimTimestampMs: number;
}

export interface VialMassBalanceAuditInput {
  readonly nominalVialCapacityMl: number;
  readonly preDrawVialVolumeMl: number;
  readonly postDrawVialVolumeMl: number;
  readonly deadSpaceResidualMl: number;
  readonly catheterDeadSpaceVolumeMl?: number;
  readonly salineFlushChaseVolumeMl?: number;
  readonly maxDiversionToleranceMl: number;
  readonly reimbursementRateUsdPerMl?: number;
  readonly wholesaleAcquisitionCostUsdPerMl?: number;
  readonly iraMaximumFairPriceUsdPerMl?: number;
  readonly factoringFeeBps?: number;
  readonly consignmentEscrowFeeBps?: number;
  readonly mtfIraClearingFeeBps?: number;
  readonly stopLossReinsuranceFeeBps?: number;
  readonly gpoEomClearingFeeBps?: number;
  readonly croEndpointUnderwritingFeeBps?: number;
  readonly rwaOriginationFeeBps?: number;
  readonly pbmSpreadMarkupRatio?: number;
  readonly purpleBookBiosimilarSavingsRatio?: number;
  readonly gpoTieredRebateRatio?: number;
  readonly cmsEomEpisodeQualityBonusUsd?: number;
  readonly croPerProtocolMilestoneGrantUsd?: number;
  readonly clinicalTrialProtocolId?: string;
  readonly enableUsp797SplitVialEscrow?: boolean;
  readonly enableZeroCapexConsignmentClearance?: boolean;
  readonly enableSiteOfCareDecentralizationArbitrage?: boolean;
  readonly enableIraMfpRebateEffectuation?: boolean;
  readonly enableStopLossReinsuranceSecuritisation?: boolean;
  readonly enableErisaFiduciaryPbmBypass?: boolean;
  readonly enableGpoEdi849AndCmsEomSettlement?: boolean;
  readonly enableCroCdiscAdexEndpointSettlement?: boolean;
  readonly enableErc3643RwaLiquidityOrigination?: boolean;
  readonly is340bStatutoryDiscountClaimed?: boolean;
  readonly hopdFacilityMarkupMultiplier?: number;
  readonly expectedAutologousCoiHash?: string;
  readonly parentVialEscrowHash?: string;
  readonly gtin14LotSerial?: string;
  readonly fdaUdiDeviceIdentifier?: string;
  readonly clinicPrivacySalt?: string;
  readonly priorCommittedSyringePufs?: readonly CommittedSyringePufRecord[];
}

export interface KalmanKinematicState {
  readonly filteredVolumeMl: number;
  readonly flowVelocityMlPerSec: number;
  readonly frameTimestampMs: number;
  readonly staticContactAngleRad?: number;
}

export interface PredictiveHorizonAssessment {
  readonly updatedState: KalmanKinematicState;
  readonly projectedVolumeAtHorizonMl: number;
  readonly timeToOverdoseBreachSec: number;
  readonly isPreemptiveBreachImminent: boolean;
  readonly axialPlungerVelocityMmPerSec: number;
  readonly coxVoinovCapillaryNumberCa: number;
  readonly dynamicViscosityModulusSecPerMeter: number;
  readonly isRheologicalSwapDetected: boolean;
  readonly hagenPoiseuilleWallShearPa: number;
  readonly maxShearSafeInfusionRateMlPerHr: number;
  readonly isShearDenaturationDetected: boolean;
  readonly henckyExtensionalStrainRatePerSec: number;
  readonly deGennesExtensionalDeborahNumberDe: number;
  readonly isExtensionalCoilStretchDenaturationDetected: boolean;
  readonly inferredLiquidTemperatureCelsius: number;
  readonly isThermalExcursionDetected: boolean;
  readonly compressibleGasVoidFractionPhi: number;
  readonly isMicroAirEmbolismOrSealLeakDetected: boolean;
  readonly stribeckTribologicalJerkIndex: number;
  readonly isStribeckSiliconeLeachingOrStictionDetected: boolean;
  readonly arrheniusEyringActivePotencyFractionPhi: number;
  readonly isKineticPotencyDecayBreachDetected: boolean;
  readonly lameIntraluminalPressureKpa: number;
  readonly starlingVenousBackPressureKpa: number;
  readonly starlingOcclusionImpedanceRatioOmega: number;
  readonly isVesicantExtravasationOrOcclusionDetected: boolean;
  readonly usp800HeadspaceOverpressureKpa: number;
  readonly isUsp800HazardousAerosolBlowbackDetected: boolean;
}

export interface PatientPharmacokineticProfile {
  readonly patientIdHash: string;
  readonly weightKg: number;
  readonly renalClearanceFactor: number;
  readonly drugName: string;
  readonly ndc11Code?: string;
  readonly hcpcsJCode?: string;
  readonly purpleBookBiosimilarCode?: string;
  readonly concentrationMgPerMl: number;
  readonly enforceGladstoneDaleMolarAssay?: boolean;
  readonly vascularAccessRoute?: "PERIPHERAL_PIV" | "CENTRAL_PICC_PORT";
  readonly maxPeripheralOsmolarityMosmPerLiter?: number;
  readonly minAllowedIonicStrengthMolPerLiter?: number;
  readonly maxAllowedIonicStrengthMolPerLiter?: number;
  readonly maxAllowedStarlingBackPressureKpa?: number;
  readonly maxAllowedUsp800HeadspaceKpa?: number;
  readonly maxAllowedExtensionalDeborahDe?: number;
  readonly minAllowedCatheterWashoutEfficiencyEta?: number;
  readonly minSafeDoseMgPerKg: number;
  readonly maxSafeDoseMgPerKg: number;
  readonly maxAllowedKappa: number;
  readonly maxAllowedSchlierenXi?: number;
  readonly maxAllowedTyndallLambda?: number;
  readonly maxAllowedStokesSedimentationZ?: number;
  readonly maxAllowedGasVoidFractionPhi?: number;
  readonly maxAllowedStribeckJerkIndex?: number;
  readonly minAllowedBioactivePotencyFractionPhi?: number;
  readonly expectedRefractiveIndexMin?: number;
  readonly expectedRefractiveIndexMax?: number;
  readonly expectedMinViscosityModulus?: number;
  readonly expectedVolumePerGraduationTickMl?: number;
  readonly maxAllowedWallShearPa?: number;
  readonly maxAllowedLiquidTempCelsius?: number;
}

export interface CmsJwJzOpticalClaimPayload {
  readonly hcpcsJCode: string;
  readonly ndc11Code: string;
  readonly modifierCode:
    | "JW_WASTE_REPORTED"
    | "JZ_ZERO_WASTE"
    | "RMA_COLD_CHAIN_SPOILAGE"
    | "USP797_SPLIT_VIAL_ESCROW";
  readonly administeredVolumeMl: number;
  readonly degassedTrueLiquidVolumeMl: number;
  readonly compressibleGasVoidFractionPhi: number;
  readonly arrheniusEyringActivePotencyFractionPhi: number;
  readonly stokesSedimentationIndexZ: number;
  readonly youngLippmannIonicStrengthMolPerLiter: number;
  readonly starlingVenousBackPressureKpa: number;
  readonly usp800HeadspaceOverpressureKpa: number;
  readonly deGennesExtensionalDeborahNumberDe: number;
  readonly taylorArisCatheterWashoutEfficiencyEta: number;
  readonly requiredSalineChaseFlushVolumeMl: number;
  readonly assayedDeliveredMassMg: number;
  readonly bioactivePotencyAdjustedMassMg: number;
  readonly veinDeliveredBioactiveMassMg: number;
  readonly thermoCompensatedConcentrationMgPerMl: number;
  readonly vanTHoffOsmolarityMosmPerLiter: number;
  readonly vanTHoffOsmoticPressureKpa: number;
  readonly inferredLiquidTemperatureCelsius: number;
  readonly reconstitutionStoichiometryRatioTheta: number;
  readonly billableWasteVolumeMl: number;
  readonly escrowedSplitVialResidualMl: number;
  readonly pbmPreventedWasteSavingsUsd: number;
  readonly clinicSharedSavingsBonusUsd: number;
  readonly btechWastePreventionContingencyUsd: number;
  readonly payerSiteOfCareArbitrageSavingsUsd: number;
  readonly clinicDecentralizationBonusUsd: number;
  readonly btechSiteArbitrageFeeUsd: number;
  readonly iraMfpStandardDefaultRefundUsd: number;
  readonly btechMtfClearingFeeUsd: number;
  readonly stopLossReinsuranceSecuritisedTrancheUsd: number;
  readonly btechReinsuranceSecuritisationFeeUsd: number;
  readonly erisaEmployerTrustNetSavingsUsd: number;
  readonly clinicErisaDirectContractBonusUsd: number;
  readonly btechErisaFiduciaryClearingFeeUsd: number;
  readonly gpoContractChargebackRebateUsd: number;
  readonly cmsEomExtravasationSafeHarborBonusUsd: number;
  readonly btechGpoEomClearingFeeUsd: number;
  readonly croPerProtocolMilestoneGrantUsd: number;
  readonly btechCroEndpointUnderwritingFeeUsd: number;
  readonly erc3643RwaTokenizedNoteAmountUsd: number;
  readonly btechRwaOriginationFeeUsd: number;
  readonly erc3643Iso20022Pacs008RwaSettlementPayload: string;
  readonly cdiscAdex21CfrPart11ProofPayload: string;
  readonly edi849GpoChargebackAndCmsEomSegment: string;
  readonly erisa408b2RxDcSafeHarborProofPayload: string;
  readonly autologousChainOfIdentityHash: string;
  readonly isAutologousCoiMismatchDetected: boolean;
  readonly isIra340bDuplicateDiscountDetected: boolean;
  readonly cmsMtfIra340bNullifierHash: string;
  readonly edi844IraMfpRebateSegment: string;
  readonly iso20022Setr012CgtAnnuityBondPayload: string;
  readonly maxShearSafeInfusionRateMlPerHr: number;
  readonly protectedReimbursementUsd: number;
  readonly distributorConsignmentWacPayoutUsd: number;
  readonly clinicZeroCapexNetMarginWireUsd: number;
  readonly instantClinicFactoringAdvanceUsd: number;
  readonly btechUnderwritingRevenueUsd: number;
  readonly actuarialPremiumRebateBps: number;
  readonly opticalPufSignatureHex64: string;
  readonly minObservedPufHammingDistance: number;
  readonly isPhysicalSyringeReplayDetected: boolean;
  readonly zeroItHidBarcodePayload: string;
  readonly smartPumpAutoProgramBarcodePayload: string;
  readonly zeroPiiBiopharmaWarrantyProof: string;
  readonly hrsa340bAuditPedigreeProof: string;
  readonly edi867ConsignmentTitleTransferSegment: string;
  readonly fhirHospitalAtHomeSitePassportPayload: string;
  readonly iso20022InstantFactoringTriggerPayload: string;
  readonly edi278PriorAuthAutoApprovalSegment: string;
  readonly edi837pOr180RmaSegment: string;
  readonly dscsa340bEpcisClearinghouseProof: string;
  readonly parametricActuarialJwsToken: string;
}

export interface VolumetricSafetyVerdict {
  readonly isSafeToAdminister: boolean;
  readonly measuredVolumeMl: number;
  readonly degassedTrueLiquidVolumeMl: number;
  readonly compressibleGasVoidFractionPhi: number;
  readonly isMicroAirEmbolismOrSealLeakDetected: boolean;
  readonly stribeckTribologicalJerkIndex: number;
  readonly isStribeckSiliconeLeachingOrStictionDetected: boolean;
  readonly arrheniusEyringActivePotencyFractionPhi: number;
  readonly bioactivePotencyAdjustedMassMg: number;
  readonly veinDeliveredBioactiveMassMg: number;
  readonly taylorArisCatheterWashoutEfficiencyEta: number;
  readonly requiredSalineChaseFlushVolumeMl: number;
  readonly isTaylorArisCatheterRetentionLossDetected: boolean;
  readonly usp800HeadspaceOverpressureKpa: number;
  readonly isUsp800HazardousAerosolBlowbackDetected: boolean;
  readonly deGennesExtensionalDeborahNumberDe: number;
  readonly isExtensionalCoilStretchDenaturationDetected: boolean;
  readonly isKineticPotencyDecayBreachDetected: boolean;
  readonly stokesSedimentationIndexZ: number;
  readonly isStokesGravitationalSedimentationDetected: boolean;
  readonly youngLippmannIonicStrengthMolPerLiter: number;
  readonly isDiluentBufferIonicIncompatibilityDetected: boolean;
  readonly starlingVenousBackPressureKpa: number;
  readonly isVesicantExtravasationOrOcclusionDetected: boolean;
  readonly isAutologousCoiMismatchDetected: boolean;
  readonly vanTHoffOsmolarityMosmPerLiter: number;
  readonly vanTHoffOsmoticPressureKpa: number;
  readonly isVascularOsmolarityNecrosisRiskDetected: boolean;
  readonly isIra340bDuplicateDiscountDetected: boolean;
  readonly assayedOpticalConcentrationMgPerMl: number;
  readonly assayedTotalDrugMassMg: number;
  readonly inferredLiquidTemperatureCelsius: number;
  readonly isThermalExcursionDetected: boolean;
  readonly axialSchlierenGradientXi: number;
  readonly requiredMixingInversionsCount: number;
  readonly isAxialSchlierenStratificationDetected: boolean;
  readonly reconstitutionStoichiometryRatioTheta: number;
  readonly isReconstitutionConcentrationErrorDetected: boolean;
  readonly isShearDenaturationDetected: boolean;
  readonly is2dDisplayPresentationSpoofDetected: boolean;
  readonly printedScaleImpliedVolumeMl: number;
  readonly barrelScaleIntegrityRatioOmega: number;
  readonly isBarrelScaleMismatchDetected: boolean;
  readonly isColdChainProteinAggregationDetected: boolean;
  readonly isPhysicalSyringeReplayDetected: boolean;
  readonly minObservedPufHammingDistance: number;
  readonly minSafeVolumeMl: number;
  readonly maxSafeVolumeMl: number;
  readonly overdoseRatio: number;
  readonly measuredRefractiveIndexN: number;
  readonly isChemicalSwapDetected: boolean;
  readonly divertedNarcoticVolumeMl: number;
  readonly isNarcoticDiversionDetected: boolean;
  readonly cmsReimbursementClaim: CmsJwJzOpticalClaimPayload;
  readonly recommendedUiAction: "COMMIT_VERIFIED_DOSE" | "TRIGGER_EMERGENCY_LOCKOUT";
  readonly clinicalViolationReason: string;
}

const ISO_7810_ASPECT_RATIO = 85.60 / 53.98;
const ISO_80369_7_LUER_DIAMETER_MM = 4.00;
const COX_VOINOV_LOG_SLIP_FACTOR = 9.21034;
const DEFAULT_WATER_BASELINE_N0 = 1.3330;
const DEFAULT_GLADSTONE_DALE_DN_DC = 0.000185;
const DEFAULT_THERMO_OPTIC_DN_DT = -0.00010;
const DEFAULT_SALINE_OSMOLARITY_MOSM_L = 308.0;
const DEFAULT_SOLUTE_OSMOLARITY_COEFF = 4.20;
const IDEAL_GAS_CONSTANT_R_J_MOL_K = 8.3144626;
const FOWKES_NEUTRAL_D5W_COS_THETA0 = 0.5504;
const YOUNG_LIPPMANN_EDL_KAPPA = 0.5855;
const LAME_EFFECTIVE_HOOP_MODULUS_KPA = 42_000.0;
const DEFAULT_NEEDLE_LENGTH_METERS = 0.025;
const TAYLOR_ARIS_DISPERSION_BETA = 1.35;
const USP800_STOPPER_BREAKLOOSE_KPA = 0.85;
const DEFAULT_SURFACE_TENSION_N_PER_M = 0.00102; // Polysorbate-80 / LNP surfactant-stabilized effective interfacial scale (1.65 -> 1.68 mPa*s)
const ARRHENIUS_ACTIVATION_B_KELVIN = 1850.0;
const EYRING_DEGRADATION_B_KELVIN = 8500.0;
const REFERENCE_TEMP_KELVIN_20C = 293.15;

/**
 * Computes projective camera-tilt (SE(3)), ISO 80369-7 Luer-Lok Z-depth parallax,
 * scale-invariant Bouguer optical refractometry (n_liq), Gladstone-Dale solute
 * concentration (mg/mL), Van 't Hoff Osmolarity (mOsm/L), Young-Lippmann Ionic
 * Buffer Strength (mol/L), and Young-Laplace meniscus void.
 * Strict 2-method boundary: computeTiltSnellAndDepthParallax and computeYoungLaplaceAndRefractometry.
 */
export class RefractiveProjectiveCompensator {
  public computeTiltSnellAndDepthParallax(
    fiducialBbox: readonly [number, number, number, number],
    liquidRefractiveIndex: number,
    barrelWallThicknessRatio: number,
    cardScaleMmPerPx: number,
    luerLockTipWidthPx?: number
  ): {
    readonly tiltGamma: number;
    readonly snellEta: number;
    readonly zDepthParallaxRatioZeta: number;
    readonly coplanarScaleMmPerPx: number;
    readonly isZeroCardLuerFallbackActive: boolean;
  } {
    const [xMin, yMin, xMax, yMax] = fiducialBbox;
    const widthSpan = Math.abs(xMax - xMin);
    const heightSpan = Math.abs(yMax - yMin);

    if (liquidRefractiveIndex < 1.0 || liquidRefractiveIndex > 2.0) {
      throw new Error("Physical invariant violation: liquidRefractiveIndex must be in [1.0, 2.0].");
    }
    if (barrelWallThicknessRatio < 0.0 || barrelWallThicknessRatio >= 0.5) {
      throw new Error("Physical invariant violation: barrelWallThicknessRatio must be in [0.0, 0.5).");
    }

    const hasValidCardBbox = widthSpan > 1e-6 && heightSpan > 1e-6 && cardScaleMmPerPx > 0;
    const observedAspect = hasValidCardBbox
      ? Math.max(widthSpan, heightSpan) / Math.min(widthSpan, heightSpan)
      : ISO_7810_ASPECT_RATIO;

    const rawGamma = Math.min(
      observedAspect / ISO_7810_ASPECT_RATIO,
      ISO_7810_ASPECT_RATIO / observedAspect
    );
    const tiltGamma = Math.max(0.5, Math.min(1.0, rawGamma));

    const opticalMagnification =
      1.0 + (liquidRefractiveIndex - 1.0) * (1.0 - barrelWallThicknessRatio);
    const snellEta = 1.0 / opticalMagnification;

    if (luerLockTipWidthPx !== undefined && luerLockTipWidthPx > 1.0) {
      const luerCoplanarScaleMmPerPx = ISO_80369_7_LUER_DIAMETER_MM / luerLockTipWidthPx;
      const tiltCorrectedCardScale = hasValidCardBbox
        ? cardScaleMmPerPx * Math.sqrt(tiltGamma)
        : luerCoplanarScaleMmPerPx;

      const zDepthParallaxRatioZeta =
        tiltCorrectedCardScale > 0
          ? luerCoplanarScaleMmPerPx / tiltCorrectedCardScale
          : 1.0;

      return {
        tiltGamma,
        snellEta,
        zDepthParallaxRatioZeta,
        coplanarScaleMmPerPx: luerCoplanarScaleMmPerPx,
        isZeroCardLuerFallbackActive: !hasValidCardBbox,
      };
    }

    if (!hasValidCardBbox) {
      throw new Error(
        "Calibration failure: neither ISO-7810 fiducial card nor ISO-80369 Luer-Lok nozzle present."
      );
    }

    return {
      tiltGamma,
      snellEta,
      zDepthParallaxRatioZeta: 1.0,
      coplanarScaleMmPerPx: cardScaleMmPerPx * Math.sqrt(tiltGamma),
      isZeroCardLuerFallbackActive: false,
    };
  }

  public computeYoungLaplaceAndRefractometry(
    internalRadiusMm: number,
    meniscusHeightMm: number,
    meanLiquidChordPx: number,
    barrelWallThicknessRatio: number,
    nominalRefractiveIndex: number,
    outerBarrelDiameterPx?: number,
    solventBaselineN0: number = DEFAULT_WATER_BASELINE_N0,
    gladstoneDaleDnDc: number = DEFAULT_GLADSTONE_DALE_DN_DC,
    diluentBaselineOsmolarityMosmL: number = DEFAULT_SALINE_OSMOLARITY_MOSM_L,
    soluteSpecificOsmolarityCoeff: number = DEFAULT_SOLUTE_OSMOLARITY_COEFF
  ): YoungLaplaceMeniscusReport {
    if (internalRadiusMm <= 0 || meniscusHeightMm < 0) {
      throw new Error("Young-Laplace invariant violation: radius must be > 0 and height >= 0.");
    }

    const measuredRefractiveIndexN =
      outerBarrelDiameterPx !== undefined &&
      outerBarrelDiameterPx > meanLiquidChordPx &&
      barrelWallThicknessRatio < 0.5
        ? meanLiquidChordPx /
          (outerBarrelDiameterPx * (1.0 - barrelWallThicknessRatio))
        : nominalRefractiveIndex;

    const assayedOpticalConcentrationMgPerMl =
      gladstoneDaleDnDc > 1e-7
        ? Math.max(0, (measuredRefractiveIndexN - solventBaselineN0) / gladstoneDaleDnDc)
        : 0;

    const vanTHoffOsmolarityMosmPerLiter =
      diluentBaselineOsmolarityMosmL +
      soluteSpecificOsmolarityCoeff * assayedOpticalConcentrationMgPerMl;

    if (meniscusHeightMm === 0) {
      return {
        meniscusCapillaryVoidMl: 0,
        estimatedContactAngleDeg: 90.0,
        capillaryAspectRatioXi: 0,
        measuredRefractiveIndexN,
        assayedOpticalConcentrationMgPerMl,
        vanTHoffOsmolarityMosmPerLiter,
        youngLippmannIonicStrengthMolPerLiter: 0.0,
        hasSurfaceTensionAdulteration: false,
      };
    }

    const voidMm3 =
      ((Math.PI * meniscusHeightMm) / 6.0) *
      (3.0 * internalRadiusMm * internalRadiusMm + meniscusHeightMm * meniscusHeightMm);
    const meniscusCapillaryVoidMl = voidMm3 / 1000.0;

    const rSq = internalRadiusMm * internalRadiusMm;
    const hSq = meniscusHeightMm * meniscusHeightMm;
    const sinTheta = Math.max(-1.0, Math.min(1.0, (rSq - hSq) / (rSq + hSq)));
    const cosTheta = Math.sqrt(Math.max(0.0, 1.0 - sinTheta * sinTheta));
    const estimatedContactAngleDeg = (Math.asin(sinTheta) * 180.0) / Math.PI;

    const deltaCosLippmann = Math.max(0.0, cosTheta - FOWKES_NEUTRAL_D5W_COS_THETA0);
    const youngLippmannIonicStrengthMolPerLiter = Math.pow(
      deltaCosLippmann / YOUNG_LIPPMANN_EDL_KAPPA,
      2
    );

    const capillaryAspectRatioXi = meniscusHeightMm / internalRadiusMm;
    const hasSurfaceTensionAdulteration = capillaryAspectRatioXi > 0.85;

    return {
      meniscusCapillaryVoidMl,
      estimatedContactAngleDeg,
      capillaryAspectRatioXi,
      measuredRefractiveIndexN,
      assayedOpticalConcentrationMgPerMl,
      vanTHoffOsmolarityMosmPerLiter,
      youngLippmannIonicStrengthMolPerLiter,
      hasSurfaceTensionAdulteration,
    };
  }
}

/**
 * Integrates 2D SAM 3.1 RLE bitstreams into Savitzky-Golay smoothed, In-Plane Roll
 * Jacobian (cos psi), Z-parallax, Snell, Young-Laplace, Gladstone-Dale Molar Mass,
 * Young-Lippmann Ionic Strength, Axial Schlieren Stratification, and Stokes-Richardson-Zaki
 * Gravitational Sedimentation Localization.
 * Strict 2-method boundary: extractScanlineChords and integrateCylindricalVolumeMl.
 */
export class RleSolidOfRevolutionIntegrator {
  public extractScanlineChords(
    spans: readonly RleSpan[],
    frameWidth: number,
    reconstructor?: SubPixelScanlineReconstructor
  ): ScanlineChordProfile {
    if (frameWidth <= 0 || !Number.isInteger(frameWidth)) {
      throw new Error("Fail-fast invariant violated: frameWidth must be a positive integer.");
    }
    if (spans.length === 0) {
      throw new Error("Fail-fast invariant violated: cannot integrate empty RLE span set.");
    }

    const rowWidthMap = new Map<number, number>();
    const rowLeftEdgeMap = new Map<number, number>();
    const rowRightEdgeMap = new Map<number, number>();

    for (const span of spans) {
      let remaining = span.length;
      let cursor = span.startPixel;

      while (remaining > 0) {
        const rowY = Math.floor(cursor / frameWidth);
        const colX = cursor % frameWidth;
        const pixelsInCurrentRow = Math.min(remaining, frameWidth - colX);

        rowWidthMap.set(rowY, (rowWidthMap.get(rowY) ?? 0) + pixelsInCurrentRow);
        const prevLeft = rowLeftEdgeMap.get(rowY);
        if (prevLeft === undefined || colX < prevLeft) {
          rowLeftEdgeMap.set(rowY, colX);
        }
        const rightX = colX + pixelsInCurrentRow;
        const prevRight = rowRightEdgeMap.get(rowY);
        if (prevRight === undefined || rightX > prevRight) {
          rowRightEdgeMap.set(rowY, rightX);
        }

        cursor += pixelsInCurrentRow;
        remaining -= pixelsInCurrentRow;
      }
    }

    const sortedRows = Array.from(rowWidthMap.keys()).sort((a, b) => a - b);
    const activeScanlineCount = sortedRows.length;
    const chordWidthsPx: number[] = new Array<number>(activeScanlineCount);
    const leftEdgesPx: number[] = new Array<number>(activeScanlineCount);
    const rightEdgesPx: number[] = new Array<number>(activeScanlineCount);

    for (let i = 0; i < activeScanlineCount; i++) {
      const r = sortedRows[i];
      chordWidthsPx[i] = rowWidthMap.get(r) ?? 0;
      leftEdgesPx[i] = rowLeftEdgeMap.get(r) ?? 0;
      rightEdgesPx[i] = rowRightEdgeMap.get(r) ?? 0;
    }

    let sumY = 0;
    let sumXc = 0;
    let sumYXc = 0;
    let sumY2 = 0;
    for (let i = 0; i < activeScanlineCount; i++) {
      const yVal = sortedRows[i];
      const xcVal = 0.5 * (leftEdgesPx[i] + rightEdgesPx[i]);
      sumY += yVal;
      sumXc += xcVal;
      sumYXc += yVal * xcVal;
      sumY2 += yVal * yVal;
    }
    const denomY = activeScanlineCount * sumY2 - sumY * sumY;
    const slopeMAxis =
      activeScanlineCount >= 3 && Math.abs(denomY) > 1e-6
        ? (activeScanlineCount * sumYXc - sumY * sumXc) / denomY
        : 0.0;
    const inPlaneRollCosinePsi = Math.max(
      0.5,
      1.0 / Math.sqrt(1.0 + slopeMAxis * slopeMAxis)
    );

    let allanSumLeft = 0;
    let allanSumRight = 0;
    let proxAllanSum = 0;
    let proxAllanCount = 0;
    let distalAllanSum = 0;
    let distalAllanCount = 0;
    const midInteriorIdx = Math.floor(activeScanlineCount / 2);
    const interiorCount = Math.max(0, activeScanlineCount - 2);

    for (let i = 1; i < activeScanlineCount - 1; i++) {
      const d2Left = leftEdgesPx[i + 1] - 2.0 * leftEdgesPx[i] + leftEdgesPx[i - 1];
      const d2Right = rightEdgesPx[i + 1] - 2.0 * rightEdgesPx[i] + rightEdgesPx[i - 1];
      const rowMaxSq = Math.max(d2Left * d2Left, d2Right * d2Right);
      allanSumLeft += d2Left * d2Left;
      allanSumRight += d2Right * d2Right;
      if (i < midInteriorIdx) {
        proxAllanSum += rowMaxSq;
        proxAllanCount++;
      } else {
        distalAllanSum += rowMaxSq;
        distalAllanCount++;
      }
    }
    const allanVarLeft = interiorCount > 0 ? allanSumLeft / (2.0 * interiorCount) : 0;
    const allanVarRight = interiorCount > 0 ? allanSumRight / (2.0 * interiorCount) : 0;
    const tyndallAllanVarianceLambda = Math.max(allanVarLeft, allanVarRight);
    const proximalAllanLambda =
      proxAllanCount > 0 ? proxAllanSum / (2.0 * proxAllanCount) : 0;
    const distalLuerAllanVarianceLambda =
      distalAllanCount > 0 ? distalAllanSum / (2.0 * distalAllanCount) : 0;
    const stokesSedimentationIndexZ =
      distalLuerAllanVarianceLambda + proximalAllanLambda > 1e-5
        ? (distalLuerAllanVarianceLambda - proximalAllanLambda) /
          (distalLuerAllanVarianceLambda + proximalAllanLambda + 1e-6)
        : 0.0;

    const activeReconstructor = reconstructor ?? new SubPixelScanlineReconstructor();
    const cusumProfile = activeReconstructor.analyzeMeniscusAndCavitationCusum(chordWidthsPx);
    const smoothedChordsPx = cusumProfile.smoothedChordsPx;

    let sumWidth = 0;
    for (const w of smoothedChordsPx) {
      sumWidth += w;
    }
    const meanChordWidthPx = sumWidth / activeScanlineCount;

    let varianceSum = 0;
    for (const w of smoothedChordsPx) {
      const diff = w - meanChordWidthPx;
      varianceSum += diff * diff;
    }
    const stdDevPx = Math.sqrt(varianceSum / activeScanlineCount);
    const radialDistortionIndexKappa =
      meanChordWidthPx === 0 ? 0 : stdDevPx / meanChordWidthPx;

    const shaftStartIdx = Math.min(
      activeScanlineCount - 1,
      cusumProfile.meniscusTaperRowsPx
    );
    const shaftLength = activeScanlineCount - shaftStartIdx;
    let axialSchlierenGradientXi = 0.0;
    if (shaftLength >= 6 && meanChordWidthPx > 1e-6) {
      const midIdx = shaftStartIdx + Math.floor(shaftLength / 2);
      let proxSum = 0;
      let proxCount = 0;
      for (let i = shaftStartIdx; i < midIdx; i++) {
        proxSum += smoothedChordsPx[i];
        proxCount++;
      }
      let distalSum = 0;
      let distalCount = 0;
      for (let i = midIdx; i < activeScanlineCount; i++) {
        distalSum += smoothedChordsPx[i];
        distalCount++;
      }
      const meanProxPx = proxCount > 0 ? proxSum / proxCount : meanChordWidthPx;
      const meanDistalPx = distalCount > 0 ? distalSum / distalCount : meanChordWidthPx;
      axialSchlierenGradientXi =
        Math.abs(meanDistalPx - meanProxPx) / meanChordWidthPx;
    }

    const requiredMixingInversionsCount =
      axialSchlierenGradientXi > 0.03
        ? Math.min(20, Math.ceil(axialSchlierenGradientXi * 250))
        : 0;

    return {
      activeScanlineCount,
      chordWidthsPx,
      smoothedChordsPx,
      meanChordWidthPx,
      radialDistortionIndexKappa,
      axialSchlierenGradientXi,
      requiredMixingInversionsCount,
      inPlaneRollCosinePsi,
      tyndallAllanVarianceLambda,
      distalLuerAllanVarianceLambda,
      stokesSedimentationIndexZ,
      meniscusTaperRowsPx: cusumProfile.meniscusTaperRowsPx,
      detectedGraduationPitchPx: cusumProfile.detectedGraduationPitchPx,
      observedGraduationTickCount: cusumProfile.observedGraduationTickCount,
      opticalPufSignatureHex64: cusumProfile.opticalPufSignatureHex64,
      nyquistMoireLivenessIndexUpsilon: cusumProfile.nyquistMoireLivenessIndexUpsilon,
      is2dDisplayPresentationSpoofDetected:
        cusumProfile.is2dDisplayPresentationSpoofDetected,
    };
  }

  public integrateCylindricalVolumeMl(
    liquidColumnSpans: readonly RleSpan[],
    metrologyReport: CalibratedMetrologyReport,
    referenceAreaMm2: number,
    frameWidth: number,
    maxAllowedKappa: number = 0.08,
    opticalConfig?: OpticalCompensationConfig,
    compensator?: RefractiveProjectiveCompensator,
    maxAllowedTyndallLambda: number = 1.25,
    maxAllowedSchlierenXi: number = 0.03,
    maxAllowedStokesSedimentationZ: number = 0.55
  ): VolumetricMetrologyReport {
    const hasCardRef =
      referenceAreaMm2 > 0 && metrologyReport.referencePixelCount > 0;
    const uncompensatedAlpha = hasCardRef
      ? Math.sqrt(referenceAreaMm2 / metrologyReport.referencePixelCount)
      : opticalConfig?.luerLockTipWidthPx
        ? ISO_80369_7_LUER_DIAMETER_MM / opticalConfig.luerLockTipWidthPx
        : 0;

    if (uncompensatedAlpha <= 0) {
      throw new Error("Invalid fiducial and Luer-Lok reference calibration parameters.");
    }

    const activeCompensator = compensator ?? new RefractiveProjectiveCompensator();
    const {
      tiltGamma,
      snellEta,
      zDepthParallaxRatioZeta,
      coplanarScaleMmPerPx,
      isZeroCardLuerFallbackActive,
    } = opticalConfig
      ? activeCompensator.computeTiltSnellAndDepthParallax(
          opticalConfig.fiducialObservedBbox,
          opticalConfig.liquidRefractiveIndex,
          opticalConfig.barrelWallThicknessRatio,
          uncompensatedAlpha,
          opticalConfig.luerLockTipWidthPx
        )
      : {
          tiltGamma: 1.0,
          snellEta: 1.0,
          zDepthParallaxRatioZeta: 1.0,
          coplanarScaleMmPerPx: uncompensatedAlpha,
          isZeroCardLuerFallbackActive: false,
        };

    const chordProfile = this.extractScanlineChords(liquidColumnSpans, frameWidth);

    let sumSquaredSmoothedPx2 = 0;
    for (const widthPx of chordProfile.smoothedChordsPx) {
      sumSquaredSmoothedPx2 += widthPx * widthPx;
    }

    const uncompensatedVolumeMl =
      (Math.PI * Math.pow(uncompensatedAlpha, 3) * sumSquaredSmoothedPx2) / 4000.0;

    const alphaCubed = Math.pow(coplanarScaleMmPerPx, 3);
    const etaSquared = snellEta * snellEta;
    const rawCompensatedVolumeMl =
      ((Math.PI * alphaCubed * etaSquared * sumSquaredSmoothedPx2) / 4000.0) *
      chordProfile.inPlaneRollCosinePsi;

    const meanDiameterMm =
      chordProfile.meanChordWidthPx *
      chordProfile.inPlaneRollCosinePsi *
      coplanarScaleMmPerPx *
      snellEta;
    const internalRadiusMm = Math.max(0.1, meanDiameterMm / 2.0);
    const meniscusHeightMm =
      opticalConfig?.explicitMeniscusHeightMm ??
      (chordProfile.meniscusTaperRowsPx * coplanarScaleMmPerPx) /
        chordProfile.inPlaneRollCosinePsi;

    const meniscusReport = activeCompensator.computeYoungLaplaceAndRefractometry(
      internalRadiusMm,
      meniscusHeightMm,
      chordProfile.meanChordWidthPx * chordProfile.inPlaneRollCosinePsi,
      opticalConfig?.barrelWallThicknessRatio ?? 0.1,
      opticalConfig?.liquidRefractiveIndex ?? 1.333,
      opticalConfig?.outerBarrelDiameterPx,
      opticalConfig?.solventBaselineRefractiveIndexN0 ?? DEFAULT_WATER_BASELINE_N0,
      opticalConfig?.gladstoneDaleDnDcMlPerMg ?? DEFAULT_GLADSTONE_DALE_DN_DC,
      opticalConfig?.diluentBaselineOsmolarityMosmPerLiter ??
        DEFAULT_SALINE_OSMOLARITY_MOSM_L,
      opticalConfig?.soluteSpecificOsmolarityCoefficient ??
        DEFAULT_SOLUTE_OSMOLARITY_COEFF
    );

    const calibratedVolumeMl = Math.max(
      0,
      rawCompensatedVolumeMl - meniscusReport.meniscusCapillaryVoidMl
    );

    const assayedTotalDrugMassMg =
      calibratedVolumeMl * meniscusReport.assayedOpticalConcentrationMgPerMl;

    const isProteinAggregationOrTurbidityDetected =
      chordProfile.tyndallAllanVarianceLambda > maxAllowedTyndallLambda;
    const isStokesGravitationalSedimentationDetected =
      chordProfile.distalLuerAllanVarianceLambda > 0.60 &&
      chordProfile.stokesSedimentationIndexZ > maxAllowedStokesSedimentationZ;
    const isAxialSchlierenStratificationDetected =
      chordProfile.axialSchlierenGradientXi > maxAllowedSchlierenXi;

    return {
      calibratedVolumeMl,
      uncompensatedVolumeMl,
      meniscusCapillaryVoidMl: meniscusReport.meniscusCapillaryVoidMl,
      estimatedContactAngleDeg: meniscusReport.estimatedContactAngleDeg,
      measuredRefractiveIndexN: meniscusReport.measuredRefractiveIndexN,
      assayedOpticalConcentrationMgPerMl:
        meniscusReport.assayedOpticalConcentrationMgPerMl,
      assayedTotalDrugMassMg,
      vanTHoffOsmolarityMosmPerLiter:
        meniscusReport.vanTHoffOsmolarityMosmPerLiter,
      youngLippmannIonicStrengthMolPerLiter:
        meniscusReport.youngLippmannIonicStrengthMolPerLiter,
      axialSchlierenGradientXi: chordProfile.axialSchlierenGradientXi,
      requiredMixingInversionsCount: chordProfile.requiredMixingInversionsCount,
      isAxialSchlierenStratificationDetected,
      hasSurfaceTensionAdulteration: meniscusReport.hasSurfaceTensionAdulteration,
      linearScaleMmPerPx: coplanarScaleMmPerPx,
      zDepthParallaxRatioZeta,
      inPlaneRollCosinePsi: chordProfile.inPlaneRollCosinePsi,
      tyndallAllanVarianceLambda: chordProfile.tyndallAllanVarianceLambda,
      distalLuerAllanVarianceLambda: chordProfile.distalLuerAllanVarianceLambda,
      stokesSedimentationIndexZ: chordProfile.stokesSedimentationIndexZ,
      isStokesGravitationalSedimentationDetected,
      isProteinAggregationOrTurbidityDetected,
      isZeroCardLuerFallbackActive,
      tiltForeshorteningGamma: tiltGamma,
      snellRadialContractionEta: snellEta,
      activeScanlineCount: chordProfile.activeScanlineCount,
      meanDiameterMm,
      radialDistortionIndexKappa: chordProfile.radialDistortionIndexKappa,
      detectedGraduationPitchPx: chordProfile.detectedGraduationPitchPx,
      observedGraduationTickCount: chordProfile.observedGraduationTickCount,
      opticalPufSignatureHex64: chordProfile.opticalPufSignatureHex64,
      nyquistMoireLivenessIndexUpsilon: chordProfile.nyquistMoireLivenessIndexUpsilon,
      is2dDisplayPresentationSpoofDetected:
        chordProfile.is2dDisplayPresentationSpoofDetected,
      hasCavitationOrTamperAnomaly:
        chordProfile.radialDistortionIndexKappa > maxAllowedKappa ||
        meniscusReport.hasSurfaceTensionAdulteration ||
        isProteinAggregationOrTurbidityDetected ||
        isStokesGravitationalSedimentationDetected ||
        chordProfile.is2dDisplayPresentationSpoofDetected,
    };
  }
}

/**
 * Tracks multi-frame SAM 3.1 meniscus kinematics ([V_k, dV/dt]) via an alpha-beta
 * Kalman filter, extracts Cox-Voinov Viscometry, Hagen-Poiseuille Wall-Shear,
 * De Gennes Hyperbolic Luer-Contraction Extensional Deborah Number (De_ext),
 * Andrade-Arrhenius Temperature, Boyle-Mariotte Gas Compressibility, Stribeck
 * Jerk, Arrhenius-Eyring Potency Decay, Lamé-Starling Extravasation, and USP <800> Blowback.
 * Strict 2-method boundary: stepAlphaBetaKalman and evaluatePredictiveHorizonBreach.
 */
export class KalmanMeniscusFlowPredictor {
  public stepAlphaBetaKalman(
    previousState: KalmanKinematicState,
    measuredVolumeMl: number,
    currentTimestampMs: number,
    gainAlpha: number = 0.65,
    gainBeta: number = 0.25
  ): KalmanKinematicState {
    const dtSec = (currentTimestampMs - previousState.frameTimestampMs) / 1000.0;
    if (dtSec <= 0) {
      throw new Error("Kalman temporal invariant violation: dtSec must be strictly positive.");
    }
    if (gainAlpha <= 0 || gainAlpha > 1 || gainBeta <= 0 || gainBeta > 1) {
      throw new Error("Kalman filter gains alpha and beta must reside in (0, 1].");
    }

    const predictedVolumeMl =
      previousState.filteredVolumeMl + previousState.flowVelocityMlPerSec * dtSec;
    const innovationResidualMl = measuredVolumeMl - predictedVolumeMl;

    const filteredVolumeMl =
      predictedVolumeMl + gainAlpha * innovationResidualMl;
    const flowVelocityMlPerSec =
      previousState.flowVelocityMlPerSec + (gainBeta / dtSec) * innovationResidualMl;

    return {
      filteredVolumeMl: Math.max(0, filteredVolumeMl),
      flowVelocityMlPerSec,
      frameTimestampMs: currentTimestampMs,
      ...(previousState.staticContactAngleRad !== undefined
        ? { staticContactAngleRad: previousState.staticContactAngleRad }
        : {}),
    };
  }

  public evaluatePredictiveHorizonBreach(
    previousState: KalmanKinematicState,
    measuredVolumeMl: number,
    currentTimestampMs: number,
    maxSafeVolumeMl: number,
    actuationHorizonSec: number = 0.50,
    internalRadiusMm: number = 5.0,
    dynamicContactAngleDeg: number = 65.0,
    expectedMinViscosityModulus: number = 0.0,
    needleInternalRadiusMm: number = 0.203,
    maxAllowedWallShearPa: number = 50.0,
    referenceViscosityModulusAt20C: number = 1.65,
    maxAllowedLiquidTempCelsius: number = 25.0,
    commandedPlungerPistonVelocityMmPerSec?: number,
    maxAllowedGasVoidFractionPhi: number = 0.015,
    dwellTimeSinceReconstitutionHours: number = 0.0,
    referenceDegradationRatePerHourAt20C: number = 0.012,
    radioactiveHalfLifeHours: number = Number.POSITIVE_INFINITY,
    minAllowedBioactivePotencyFractionPhi: number = 0.90,
    maxAllowedStribeckJerkIndex: number = 0.35,
    unpressurizedBaselineChordPx: number = 10.0,
    observedPressurizedChordPx: number = 10.0,
    barrelWallThicknessRatio: number = 0.10,
    maxAllowedStarlingBackPressureKpa: number = 8.0,
    passiveVialBackCreepVelocityMlPerSec: number = 0.0,
    maxAllowedUsp800HeadspaceKpa: number = 1.5,
    zimmMacromolecularRelaxationTimeSec: number = 0.00001,
    maxAllowedExtensionalDeborahDe: number = 0.50
  ): PredictiveHorizonAssessment {
    const updatedState = this.stepAlphaBetaKalman(
      previousState,
      measuredVolumeMl,
      currentTimestampMs
    );

    const projectedVolumeAtHorizonMl =
      updatedState.filteredVolumeMl +
      updatedState.flowVelocityMlPerSec * actuationHorizonSec;

    const remainingMarginMl = maxSafeVolumeMl - updatedState.filteredVolumeMl;
    const timeToOverdoseBreachSec =
      updatedState.flowVelocityMlPerSec > 1e-6
        ? Math.max(0, remainingMarginMl / updatedState.flowVelocityMlPerSec)
        : Number.POSITIVE_INFINITY;

    const isPreemptiveBreachImminent =
      updatedState.filteredVolumeMl > maxSafeVolumeMl ||
      (updatedState.flowVelocityMlPerSec > 0.05 &&
        timeToOverdoseBreachSec <= actuationHorizonSec);

    const crossSectionMm2 = Math.PI * Math.max(0.25, internalRadiusMm * internalRadiusMm);
    const axialPlungerVelocityMmPerSec =
      (Math.abs(updatedState.flowVelocityMlPerSec) * 1000.0) / crossSectionMm2;
    const axialVelocityMetersPerSec = axialPlungerVelocityMmPerSec * 1e-3;

    const velocityDenom = Math.max(
      0.02,
      Math.abs(updatedState.flowVelocityMlPerSec) +
        Math.abs(previousState.flowVelocityMlPerSec)
    );
    const stribeckTribologicalJerkIndex = Math.min(
      1.0,
      Math.abs(
        updatedState.flowVelocityMlPerSec - previousState.flowVelocityMlPerSec
      ) / velocityDenom
    );
    const isStribeckSiliconeLeachingOrStictionDetected =
      stribeckTribologicalJerkIndex > maxAllowedStribeckJerkIndex;

    let compressibleGasVoidFractionPhi = 0.0;
    if (
      commandedPlungerPistonVelocityMmPerSec !== undefined &&
      commandedPlungerPistonVelocityMmPerSec > 1e-3
    ) {
      const sweptPistonVolumeRateMlPerSec =
        (crossSectionMm2 * commandedPlungerPistonVelocityMmPerSec) / 1000.0;
      const observedMeniscusRateMlPerSec = Math.abs(updatedState.flowVelocityMlPerSec);
      compressibleGasVoidFractionPhi = Math.max(
        0.0,
        Math.min(
          0.99,
          1.0 - observedMeniscusRateMlPerSec / sweptPistonVolumeRateMlPerSec
        )
      );
    }
    const isMicroAirEmbolismOrSealLeakDetected =
      compressibleGasVoidFractionPhi > maxAllowedGasVoidFractionPhi;

    const thetaStaticRad = previousState.staticContactAngleRad ?? (50.0 * Math.PI) / 180.0;
    const thetaDynamicRad = (dynamicContactAngleDeg * Math.PI) / 180.0;
    const deltaThetaCubed = Math.max(
      0,
      Math.pow(thetaDynamicRad, 3) - Math.pow(thetaStaticRad, 3)
    );

    const coxVoinovCapillaryNumberCa =
      deltaThetaCubed / (9.0 * COX_VOINOV_LOG_SLIP_FACTOR);

    const dynamicViscosityModulusSecPerMeter =
      axialVelocityMetersPerSec > 1e-5
        ? coxVoinovCapillaryNumberCa / axialVelocityMetersPerSec
        : referenceViscosityModulusAt20C;

    const isRheologicalSwapDetected =
      expectedMinViscosityModulus > 0 &&
      axialVelocityMetersPerSec > 1e-4 &&
      dynamicViscosityModulusSecPerMeter < expectedMinViscosityModulus;

    const safePsiRatio = Math.max(
      0.2,
      Math.min(
        5.0,
        dynamicViscosityModulusSecPerMeter / Math.max(1e-5, referenceViscosityModulusAt20C)
      )
    );
    const inverseTempKelvin =
      1.0 / REFERENCE_TEMP_KELVIN_20C +
      Math.log(safePsiRatio) / ARRHENIUS_ACTIVATION_B_KELVIN;
    const inferredTempKelvin = 1.0 / inverseTempKelvin;
    const inferredLiquidTemperatureCelsius = inferredTempKelvin - 273.15;
    const isThermalExcursionDetected =
      inferredLiquidTemperatureCelsius > maxAllowedLiquidTempCelsius;

    const isotopeDecayRatePerHr =
      Number.isFinite(radioactiveHalfLifeHours) && radioactiveHalfLifeHours > 1e-4
        ? Math.LN2 / radioactiveHalfLifeHours
        : 0.0;
    const eyringThermalDegradationRatePerHr =
      Math.max(0, referenceDegradationRatePerHourAt20C) *
      Math.exp(
        EYRING_DEGRADATION_B_KELVIN *
          (1.0 / REFERENCE_TEMP_KELVIN_20C - 1.0 / inferredTempKelvin)
      );
    const totalDecayRatePerHr =
      isotopeDecayRatePerHr + eyringThermalDegradationRatePerHr;
    const arrheniusEyringActivePotencyFractionPhi =
      dwellTimeSinceReconstitutionHours > 0
        ? Math.exp(-totalDecayRatePerHr * dwellTimeSinceReconstitutionHours)
        : 1.0;
    const isKineticPotencyDecayBreachDetected =
      arrheniusEyringActivePotencyFractionPhi < minAllowedBioactivePotencyFractionPhi;

    const estimatedViscosityPaSec = Math.max(
      0.001,
      dynamicViscosityModulusSecPerMeter * DEFAULT_SURFACE_TENSION_N_PER_M
    );
    const flowRateM3PerSec = Math.abs(updatedState.flowVelocityMlPerSec) * 1e-6;
    const barrelRadiusMeters = Math.max(0.5e-3, internalRadiusMm * 1e-3);
    const needleRadiusMeters = Math.max(0.05e-3, needleInternalRadiusMm * 1e-3);
    const needleRadiusCubedM3 = Math.pow(needleRadiusMeters, 3);
    const needleRadiusFourthM4 = Math.pow(needleRadiusMeters, 4);

    const hagenPoiseuilleWallShearPa =
      (4.0 * estimatedViscosityPaSec * flowRateM3PerSec) /
      (Math.PI * needleRadiusCubedM3);

    // De Gennes Hyperbolic Luer-Contraction Extensional Strain Rate & Deborah Number:
    // epsilon_dot_ext = (Q / (pi * R_barrel)) * (1 / r_needle^2 - 1 / R_barrel^2) [s^-1]
    const invRadiusDiffM2 = Math.max(
      0.0,
      1.0 / (needleRadiusMeters * needleRadiusMeters) -
        1.0 / (barrelRadiusMeters * barrelRadiusMeters)
    );
    const henckyExtensionalStrainRatePerSec =
      (flowRateM3PerSec / (Math.PI * barrelRadiusMeters)) * invRadiusDiffM2;
    const deGennesExtensionalDeborahNumberDe =
      Math.max(0.0, zimmMacromolecularRelaxationTimeSec) *
      henckyExtensionalStrainRatePerSec;
    const isExtensionalCoilStretchDenaturationDetected =
      deGennesExtensionalDeborahNumberDe > maxAllowedExtensionalDeborahDe;

    const maxShearSafeRateM3PerSec =
      (Math.PI * needleRadiusCubedM3 * maxAllowedWallShearPa) /
      (4.0 * estimatedViscosityPaSec);
    const maxExtensionalSafeRateM3PerSec =
      zimmMacromolecularRelaxationTimeSec > 1e-9 && invRadiusDiffM2 > 1e-6
        ? (maxAllowedExtensionalDeborahDe * Math.PI * barrelRadiusMeters) /
          (zimmMacromolecularRelaxationTimeSec * invRadiusDiffM2)
        : Number.POSITIVE_INFINITY;
    const maxShearSafeInfusionRateMlPerHr =
      3.6e9 * Math.min(maxShearSafeRateM3PerSec, maxExtensionalSafeRateM3PerSec);

    const isShearDenaturationDetected =
      hagenPoiseuilleWallShearPa > maxAllowedWallShearPa;

    const safeBaselineChordPx = Math.max(1.0, unpressurizedBaselineChordPx);
    const hoopStrainEpsilon = Math.max(
      0.0,
      (observedPressurizedChordPx - safeBaselineChordPx) / safeBaselineChordPx
    );
    const clampedTauWall = Math.max(0.02, Math.min(0.45, barrelWallThicknessRatio));
    const lameIntraluminalPressureKpa =
      LAME_EFFECTIVE_HOOP_MODULUS_KPA *
      hoopStrainEpsilon *
      (clampedTauWall / (1.0 - clampedTauWall));

    const hagenPoiseuillePressureDropKpa =
      ((8.0 *
        estimatedViscosityPaSec *
        DEFAULT_NEEDLE_LENGTH_METERS *
        flowRateM3PerSec) /
        (Math.PI * needleRadiusFourthM4)) *
      1e-3;

    const starlingVenousBackPressureKpa = Math.max(
      0.0,
      lameIntraluminalPressureKpa - hagenPoiseuillePressureDropKpa
    );
    const starlingOcclusionImpedanceRatioOmega =
      lameIntraluminalPressureKpa /
      Math.max(1.2, hagenPoiseuillePressureDropKpa);
    const isVesicantExtravasationOrOcclusionDetected =
      starlingVenousBackPressureKpa > maxAllowedStarlingBackPressureKpa;

    const creepFlowM3PerSec = Math.max(0.0, passiveVialBackCreepVelocityMlPerSec) * 1e-6;
    const creepHpPressureKpa =
      ((8.0 *
        estimatedViscosityPaSec *
        DEFAULT_NEEDLE_LENGTH_METERS *
        creepFlowM3PerSec) /
        (Math.PI * needleRadiusFourthM4)) *
      1e-3;
    const usp800HeadspaceOverpressureKpa =
      passiveVialBackCreepVelocityMlPerSec > 1e-4
        ? USP800_STOPPER_BREAKLOOSE_KPA + creepHpPressureKpa
        : 0.0;
    const isUsp800HazardousAerosolBlowbackDetected =
      usp800HeadspaceOverpressureKpa > maxAllowedUsp800HeadspaceKpa;

    return {
      updatedState,
      projectedVolumeAtHorizonMl,
      timeToOverdoseBreachSec,
      isPreemptiveBreachImminent,
      axialPlungerVelocityMmPerSec,
      coxVoinovCapillaryNumberCa,
      dynamicViscosityModulusSecPerMeter,
      isRheologicalSwapDetected,
      hagenPoiseuilleWallShearPa,
      maxShearSafeInfusionRateMlPerHr,
      isShearDenaturationDetected,
      henckyExtensionalStrainRatePerSec,
      deGennesExtensionalDeborahNumberDe,
      isExtensionalCoilStretchDenaturationDetected,
      inferredLiquidTemperatureCelsius,
      isThermalExcursionDetected,
      compressibleGasVoidFractionPhi,
      isMicroAirEmbolismOrSealLeakDetected,
      stribeckTribologicalJerkIndex,
      isStribeckSiliconeLeachingOrStictionDetected,
      arrheniusEyringActivePotencyFractionPhi,
      isKineticPotencyDecayBreachDetected,
      lameIntraluminalPressureKpa,
      starlingVenousBackPressureKpa,
      starlingOcclusionImpedanceRatioOmega,
      isVesicantExtravasationOrOcclusionDetected,
      usp800HeadspaceOverpressureKpa,
      isUsp800HazardousAerosolBlowbackDetected,
    };
  }
}

/**
 * Evaluates all 20 physical-metrology invariants—including De Gennes Hyperbolic
 * Luer-Contraction Extensional Deborah Unfolding (De_ext), Taylor-Aris Catheter
 * Washout, USP <800> Blowback, Lamé-Starling Extravasation, Young-Lippmann Ionic
 * Assay, and 64-bit Optical PUF—while minting the Zero-Balance-Sheet ERC-3643
 * Permissioned RWA & ISO 20022 pacs.008 Institutional Liquidity Origination Note.
 * Strict 2-method boundary: computeSafeDoseAndJwJzClaim and evaluateVolumetricSafetyInvariant.
 */
export class PharmacokineticSafetyVerifier {
  public computeSafeDoseAndJwJzClaim(
    profile: PatientPharmacokineticProfile,
    measuredVolumeMl: number,
    measuredRefractiveIndexN: number,
    assayedOpticalConcentrationMgPerMl: number,
    opticalPufSignatureHex64: string,
    isColdChainSpoilage: boolean = false,
    vialMassBalance?: VialMassBalanceAuditInput,
    maxShearSafeInfusionRateMlPerHr: number = 120.0,
    inferredLiquidTemperatureCelsius: number = 20.0,
    compressibleGasVoidFractionPhi: number = 0.0,
    arrheniusEyringActivePotencyFractionPhi: number = 1.0,
    rawVanTHoffOsmolarityMosmL: number = DEFAULT_SALINE_OSMOLARITY_MOSM_L,
    stokesSedimentationIndexZ: number = 0.0,
    youngLippmannIonicStrengthMolPerLiter: number = 0.154,
    starlingVenousBackPressureKpa: number = 1.2,
    usp800HeadspaceOverpressureKpa: number = 0.0,
    deGennesExtensionalDeborahNumberDe: number = 0.0
  ): {
    readonly minSafeVolumeMl: number;
    readonly maxSafeVolumeMl: number;
    readonly cmsReimbursementClaim: CmsJwJzOpticalClaimPayload;
  } {
    if (
      profile.weightKg <= 0 ||
      profile.concentrationMgPerMl <= 0 ||
      profile.renalClearanceFactor <= 0 ||
      profile.renalClearanceFactor > 1.0 ||
      profile.minSafeDoseMgPerKg <= 0 ||
      profile.maxSafeDoseMgPerKg < profile.minSafeDoseMgPerKg
    ) {
      throw new Error("Invalid pharmacokinetic profile parameters.");
    }

    const minSafeMg =
      profile.weightKg * profile.minSafeDoseMgPerKg * profile.renalClearanceFactor;
    const maxSafeMg =
      profile.weightKg * profile.maxSafeDoseMgPerKg * profile.renalClearanceFactor;

    const minSafeVolumeMl = minSafeMg / profile.concentrationMgPerMl;
    const maxSafeVolumeMl = maxSafeMg / profile.concentrationMgPerMl;

    const degassedTrueLiquidVolumeMl =
      measuredVolumeMl * Math.max(0, 1.0 - compressibleGasVoidFractionPhi);

    const deltaTempC = inferredLiquidTemperatureCelsius - 20.0;
    const n20Isotherm =
      measuredRefractiveIndexN - DEFAULT_THERMO_OPTIC_DN_DT * deltaTempC;
    const thermoCompensatedConcentrationMgPerMl = profile.enforceGladstoneDaleMolarAssay
      ? Math.max(0, (n20Isotherm - DEFAULT_WATER_BASELINE_N0) / DEFAULT_GLADSTONE_DALE_DN_DC)
      : assayedOpticalConcentrationMgPerMl;

    const effectiveConcentrationMgPerMl = profile.enforceGladstoneDaleMolarAssay
      ? thermoCompensatedConcentrationMgPerMl
      : profile.concentrationMgPerMl;
    const assayedDeliveredMassMg =
      degassedTrueLiquidVolumeMl * effectiveConcentrationMgPerMl;
    const bioactivePotencyAdjustedMassMg =
      assayedDeliveredMassMg * Math.max(0, arrheniusEyringActivePotencyFractionPhi);
    const reconstitutionStoichiometryRatioTheta =
      profile.enforceGladstoneDaleMolarAssay && thermoCompensatedConcentrationMgPerMl > 0
        ? thermoCompensatedConcentrationMgPerMl / profile.concentrationMgPerMl
        : 1.0;

    const catheterDeadSpaceMl = Math.max(
      0.0,
      vialMassBalance?.catheterDeadSpaceVolumeMl ?? 0.0
    );
    const salineFlushMl = Math.max(
      0.0,
      vialMassBalance?.salineFlushChaseVolumeMl ?? 0.0
    );
    const retainedCatheterFraction =
      catheterDeadSpaceMl > 1e-4 && degassedTrueLiquidVolumeMl > 1e-4
        ? Math.min(1.0, catheterDeadSpaceMl / degassedTrueLiquidVolumeMl) *
          Math.exp(
            -salineFlushMl / (catheterDeadSpaceMl * TAYLOR_ARIS_DISPERSION_BETA)
          )
        : 0.0;
    const taylorArisCatheterWashoutEfficiencyEta = Math.max(
      0.0,
      Math.min(1.0, 1.0 - retainedCatheterFraction)
    );
    const requiredSalineChaseFlushVolumeMl =
      catheterDeadSpaceMl > 1e-4
        ? catheterDeadSpaceMl * TAYLOR_ARIS_DISPERSION_BETA * Math.log(100.0)
        : 0.0;
    const veinDeliveredBioactiveMassMg =
      bioactivePotencyAdjustedMassMg * taylorArisCatheterWashoutEfficiencyEta;

    const vanTHoffOsmolarityMosmPerLiter = profile.enforceGladstoneDaleMolarAssay
      ? DEFAULT_SALINE_OSMOLARITY_MOSM_L +
        DEFAULT_SOLUTE_OSMOLARITY_COEFF * thermoCompensatedConcentrationMgPerMl
      : rawVanTHoffOsmolarityMosmL;
    const tempKelvin = Math.max(273.15, inferredLiquidTemperatureCelsius + 273.15);
    const vanTHoffOsmoticPressureKpa =
      1e-3 * vanTHoffOsmolarityMosmPerLiter * IDEAL_GAS_CONSTANT_R_J_MOL_K * tempKelvin;

    let minObservedPufHammingDistance = 1.0;
    let isPhysicalSyringeReplayDetected = false;
    const currentHigh = Number.parseInt(opticalPufSignatureHex64.slice(0, 8), 16) >>> 0;
    const currentLow = Number.parseInt(opticalPufSignatureHex64.slice(8, 16), 16) >>> 0;

    for (const prior of vialMassBalance?.priorCommittedSyringePufs ?? []) {
      if (prior.opticalPufSignatureHex64.length === 16) {
        const priorHigh = Number.parseInt(prior.opticalPufSignatureHex64.slice(0, 8), 16) >>> 0;
        const priorLow = Number.parseInt(prior.opticalPufSignatureHex64.slice(8, 16), 16) >>> 0;

        let xorHigh = (currentHigh ^ priorHigh) >>> 0;
        let xorLow = (currentLow ^ priorLow) >>> 0;
        let bitDiffCount = 0;
        while (xorHigh > 0) {
          xorHigh &= xorHigh - 1;
          bitDiffCount++;
        }
        while (xorLow > 0) {
          xorLow &= xorLow - 1;
          bitDiffCount++;
        }

        const fractionalHamming = bitDiffCount / 64.0;
        if (fractionalHamming < minObservedPufHammingDistance) {
          minObservedPufHammingDistance = fractionalHamming;
        }
        if (fractionalHamming <= 0.15625 && prior.patientIdHash !== profile.patientIdHash) {
          isPhysicalSyringeReplayDetected = true;
        }
      }
    }

    const hcpcsJCode = profile.hcpcsJCode ?? "J9271";
    const ndc11Code = profile.ndc11Code ?? "00006426101";
    const gtinSerial = vialMassBalance?.gtin14LotSerial ?? `003${ndc11Code}0001`;
    const udiTag = vialMassBalance?.fdaUdiDeviceIdentifier ?? `00801902${ndc11Code}`;
    const trialProtocolId =
      vialMassBalance?.clinicalTrialProtocolId ?? "NCT06202699_PHASE3_ADC";
    const rawRemainingVialMl = vialMassBalance
      ? Math.max(
          0,
          vialMassBalance.nominalVialCapacityMl -
            measuredVolumeMl -
            vialMassBalance.deadSpaceResidualMl
        )
      : 0;

    const autologousChainOfIdentityHash = createHash("sha256")
      .update(`${profile.patientIdHash}:${gtinSerial}`)
      .digest("hex")
      .slice(0, 16)
      .toUpperCase();
    const isAutologousCoiMismatchDetected =
      vialMassBalance?.expectedAutologousCoiHash !== undefined &&
      vialMassBalance.expectedAutologousCoiHash !== autologousChainOfIdentityHash;

    const isIraMfpRequested = vialMassBalance?.enableIraMfpRebateEffectuation === true;
    const is340bClaimed = vialMassBalance?.is340bStatutoryDiscountClaimed === true;
    const isIra340bDuplicateDiscountDetected = isIraMfpRequested && is340bClaimed;

    const isCleanClaim =
      !isColdChainSpoilage &&
      !isPhysicalSyringeReplayDetected &&
      !isIra340bDuplicateDiscountDetected &&
      !isAutologousCoiMismatchDetected;

    const isSplitVialEscrowActive =
      isCleanClaim &&
      vialMassBalance?.enableUsp797SplitVialEscrow === true &&
      rawRemainingVialMl >= 0.05;

    const escrowedSplitVialResidualMl = isSplitVialEscrowActive ? rawRemainingVialMl : 0;
    const billableWasteVolumeMl = isSplitVialEscrowActive ? 0 : rawRemainingVialMl;

    const modifierCode = isColdChainSpoilage
      ? "RMA_COLD_CHAIN_SPOILAGE"
      : isSplitVialEscrowActive
        ? "USP797_SPLIT_VIAL_ESCROW"
        : billableWasteVolumeMl >= 0.01
          ? "JW_WASTE_REPORTED"
          : "JZ_ZERO_WASTE";
    const ediModifier = modifierCode === "JW_WASTE_REPORTED" ? "JW" : "JZ";
    const rateUsd = vialMassBalance?.reimbursementRateUsdPerMl ?? 1250.0;

    const preventedWasteValueUsd = escrowedSplitVialResidualMl * rateUsd;
    const pbmPreventedWasteSavingsUsd = preventedWasteValueUsd * 0.60;
    const clinicSharedSavingsBonusUsd = preventedWasteValueUsd * 0.25;
    const btechWastePreventionContingencyUsd = preventedWasteValueUsd * 0.15;

    const baseAmbulatoryDrugClaimUsd =
      (measuredVolumeMl + billableWasteVolumeMl) * rateUsd;
    const isSiteArbitrageActive =
      isCleanClaim &&
      vialMassBalance?.enableSiteOfCareDecentralizationArbitrage === true;
    const hopdMarkup = Math.max(
      1.0,
      vialMassBalance?.hopdFacilityMarkupMultiplier ?? 2.60
    );
    const grossHopdSpreadUsd = isSiteArbitrageActive
      ? baseAmbulatoryDrugClaimUsd * (hopdMarkup - 1.0)
      : 0;
    const payerSiteOfCareArbitrageSavingsUsd = grossHopdSpreadUsd * 0.77;
    const clinicDecentralizationBonusUsd = grossHopdSpreadUsd * 0.15;
    const btechSiteArbitrageFeeUsd = grossHopdSpreadUsd * 0.08;

    const wacRateUsdPerMl =
      vialMassBalance?.wholesaleAcquisitionCostUsdPerMl ?? rateUsd * 0.88;
    const mfpRateUsdPerMl =
      vialMassBalance?.iraMaximumFairPriceUsdPerMl ?? wacRateUsdPerMl * 0.62;
    const iraMfpStandardDefaultRefundUsd =
      isIraMfpRequested && !is340bClaimed && isCleanClaim
        ? Math.max(
            0,
            (wacRateUsdPerMl - mfpRateUsdPerMl) *
              (measuredVolumeMl + billableWasteVolumeMl)
          )
        : 0;
    const mtfFeeBps = vialMassBalance?.mtfIraClearingFeeBps ?? 50;
    const btechMtfClearingFeeUsd =
      iraMfpStandardDefaultRefundUsd * (mtfFeeBps / 10_000.0);

    const isErisaDirectActive =
      isCleanClaim && vialMassBalance?.enableErisaFiduciaryPbmBypass === true;
    const pbmSpreadRatio = vialMassBalance?.pbmSpreadMarkupRatio ?? 0.22;
    const biosimilarRatio = vialMassBalance?.purpleBookBiosimilarSavingsRatio ?? 0.0;
    const grossErisaSpreadEliminatedUsd = isErisaDirectActive
      ? baseAmbulatoryDrugClaimUsd * (pbmSpreadRatio + biosimilarRatio)
      : 0;
    const erisaEmployerTrustNetSavingsUsd = grossErisaSpreadEliminatedUsd * 0.70;
    const clinicErisaDirectContractBonusUsd = grossErisaSpreadEliminatedUsd * 0.20;
    const btechErisaFiduciaryClearingFeeUsd = grossErisaSpreadEliminatedUsd * 0.10;

    const isGpoEomActive =
      isCleanClaim &&
      vialMassBalance?.enableGpoEdi849AndCmsEomSettlement === true;
    const gpoRebateRatio = vialMassBalance?.gpoTieredRebateRatio ?? 0.065;
    const gpoContractChargebackRebateUsd = isGpoEomActive
      ? (measuredVolumeMl + billableWasteVolumeMl) * wacRateUsdPerMl * gpoRebateRatio
      : 0;
    const cmsEomExtravasationSafeHarborBonusUsd = isGpoEomActive
      ? (vialMassBalance?.cmsEomEpisodeQualityBonusUsd ?? 350.0)
      : 0;
    const gpoEomFeeBps = vialMassBalance?.gpoEomClearingFeeBps ?? 65;
    const btechGpoEomClearingFeeUsd =
      (gpoContractChargebackRebateUsd + cmsEomExtravasationSafeHarborBonusUsd) *
      (gpoEomFeeBps / 10_000.0);

    const isCroEndpointActive =
      isCleanClaim &&
      vialMassBalance?.enableCroCdiscAdexEndpointSettlement === true;
    const croPerProtocolMilestoneGrantUsd = isCroEndpointActive
      ? (vialMassBalance?.croPerProtocolMilestoneGrantUsd ?? 1200.0)
      : 0;
    const croFeeBps = vialMassBalance?.croEndpointUnderwritingFeeBps ?? 125;
    const btechCroEndpointUnderwritingFeeUsd = isCroEndpointActive
      ? (baseAmbulatoryDrugClaimUsd + croPerProtocolMilestoneGrantUsd) *
        (croFeeBps / 10_000.0)
      : 0;

    const protectedReimbursementUsd =
      baseAmbulatoryDrugClaimUsd +
      clinicSharedSavingsBonusUsd +
      clinicDecentralizationBonusUsd +
      iraMfpStandardDefaultRefundUsd +
      clinicErisaDirectContractBonusUsd +
      gpoContractChargebackRebateUsd +
      cmsEomExtravasationSafeHarborBonusUsd +
      croPerProtocolMilestoneGrantUsd;

    const isStopLossSecuritised =
      isCleanClaim &&
      vialMassBalance?.enableStopLossReinsuranceSecuritisation === true;
    const stopLossReinsuranceSecuritisedTrancheUsd = isStopLossSecuritised
      ? protectedReimbursementUsd
      : 0;
    const reinsuranceFeeBps = vialMassBalance?.stopLossReinsuranceFeeBps ?? 100;
    const btechReinsuranceSecuritisationFeeUsd =
      stopLossReinsuranceSecuritisedTrancheUsd * (reinsuranceFeeBps / 10_000.0);

    // Zero-Balance-Sheet ERC-3643 Permissioned RWA & ISO 20022 pacs.008 Liquidity Origination:
    const isRwaOriginationActive =
      isCleanClaim &&
      vialMassBalance?.enableErc3643RwaLiquidityOrigination === true;
    const erc3643RwaTokenizedNoteAmountUsd = isRwaOriginationActive
      ? protectedReimbursementUsd
      : 0;
    const rwaFeeBps = vialMassBalance?.rwaOriginationFeeBps ?? 85; // 85 bps RWA Origination Fee
    const btechRwaOriginationFeeUsd =
      erc3643RwaTokenizedNoteAmountUsd * (rwaFeeBps / 10_000.0);

    const isConsignmentActive =
      isCleanClaim &&
      vialMassBalance?.enableZeroCapexConsignmentClearance === true;
    const grossDistributorWacUsd = isConsignmentActive
      ? (measuredVolumeMl + billableWasteVolumeMl) * wacRateUsdPerMl
      : 0;
    const consignmentEscrowFeeBps = vialMassBalance?.consignmentEscrowFeeBps ?? 75;
    const btechConsignmentFeeUsd =
      grossDistributorWacUsd * (consignmentEscrowFeeBps / 10_000.0);
    const distributorConsignmentWacPayoutUsd =
      grossDistributorWacUsd - btechConsignmentFeeUsd;

    const factoringFeeBps = vialMassBalance?.factoringFeeBps ?? 150;
    const baseFactoringFeeUsd = isCleanClaim
      ? protectedReimbursementUsd * (factoringFeeBps / 10_000.0)
      : 0;
    const btechUnderwritingRevenueUsd =
      baseFactoringFeeUsd +
      btechWastePreventionContingencyUsd +
      btechConsignmentFeeUsd +
      btechSiteArbitrageFeeUsd +
      btechMtfClearingFeeUsd +
      btechReinsuranceSecuritisationFeeUsd +
      btechErisaFiduciaryClearingFeeUsd +
      btechGpoEomClearingFeeUsd +
      btechCroEndpointUnderwritingFeeUsd +
      btechRwaOriginationFeeUsd;
    const instantClinicFactoringAdvanceUsd = isCleanClaim
      ? protectedReimbursementUsd -
        baseFactoringFeeUsd -
        btechMtfClearingFeeUsd -
        btechReinsuranceSecuritisationFeeUsd -
        btechGpoEomClearingFeeUsd -
        btechCroEndpointUnderwritingFeeUsd -
        btechRwaOriginationFeeUsd
      : 0;
    const clinicZeroCapexNetMarginWireUsd = isConsignmentActive
      ? Math.max(0, instantClinicFactoringAdvanceUsd - grossDistributorWacUsd)
      : instantClinicFactoringAdvanceUsd;

    const claimDigest = createHash("sha256")
      .update(
        `${profile.patientIdHash}:${gtinSerial}:${hcpcsJCode}:${degassedTrueLiquidVolumeMl.toFixed(3)}:${veinDeliveredBioactiveMassMg.toFixed(2)}:${opticalPufSignatureHex64}:${modifierCode}:${autologousChainOfIdentityHash}`
      )
      .digest("hex")
      .slice(0, 16)
      .toUpperCase();

    const exclusiveRailTag = is340bClaimed
      ? "RAIL_340B_STATUTORY_ONLY"
      : isIraMfpRequested
        ? "RAIL_CMS_MTF_IRA_MFP_ONLY"
        : "RAIL_COMMERCIAL_ASP";
    const cmsMtfIra340bNullifierHash = createHash("sha256")
      .update(`${gtinSerial}:${opticalPufSignatureHex64}:${exclusiveRailTag}`)
      .digest("hex")
      .slice(0, 24)
      .toUpperCase();

    const edi844IraMfpRebateSegment = `CON*MTF*IRA2026_${claimDigest}*${exclusiveRailTag}~PAD*${ndc11Code}*${degassedTrueLiquidVolumeMl.toFixed(2)}*ML*SDRA*${iraMfpStandardDefaultRefundUsd.toFixed(2)}~REF*NUL*${cmsMtfIra340bNullifierHash}~`;

    const edi849GpoChargebackAndCmsEomSegment = `CON*GPO*EDI849_${claimDigest}*CMS_EOM_SAFE_HARBOR~PAD*${ndc11Code}*${degassedTrueLiquidVolumeMl.toFixed(2)}*ML*GPO_REBATE*${gpoContractChargebackRebateUsd.toFixed(2)}*EOM_BONUS*${cmsEomExtravasationSafeHarborBonusUsd.toFixed(2)}~REF*UDI*${udiTag}_STARLING_${starlingVenousBackPressureKpa.toFixed(2)}KPA~`;

    const cdiscAdex21CfrPart11ProofPayload = `CDISC:ODM:1.3.2:ADEX|PROTOCOL:${trialProtocolId}|WASHOUT_ETA:${taylorArisCatheterWashoutEfficiencyEta.toFixed(4)}|VEIN_MASS_MG:${veinDeliveredBioactiveMassMg.toFixed(2)}|USP800_KPA:${usp800HeadspaceOverpressureKpa.toFixed(2)}|CRO_GRANT_USD:${croPerProtocolMilestoneGrantUsd.toFixed(2)}|21CFR11_SIG:${claimDigest}`;

    // ERC-3643 Permissioned RWA & ISO 20022 pacs.008 Institutional Liquidity Origination Payload
    const erc3643Iso20022Pacs008RwaSettlementPayload = `ERC3643:RWA:ISO20022:pacs.008.001.10|NOTE:BTECH_RWA_${claimDigest}|PRINCIPAL_USD:${erc3643RwaTokenizedNoteAmountUsd.toFixed(2)}|DE_EXT:${deGennesExtensionalDeborahNumberDe.toFixed(3)}|ORIG_FEE_USD:${btechRwaOriginationFeeUsd.toFixed(2)}|PUF:${opticalPufSignatureHex64}`;

    const iso20022Setr012CgtAnnuityBondPayload = `ISO20022:setr.012.001.04|BOND:CMS_CGT_REINS_${claimDigest}|COI:${autologousChainOfIdentityHash}|STOKES_Z:${stokesSedimentationIndexZ.toFixed(3)}|TRANCHE_USD:${stopLossReinsuranceSecuritisedTrancheUsd.toFixed(2)}|REINS_FEE_USD:${btechReinsuranceSecuritisationFeeUsd.toFixed(2)}`;

    const biosimTag = profile.purpleBookBiosimilarCode ?? hcpcsJCode;
    const erisa408b2RxDcSafeHarborProofPayload = `ERISA:408B2:CAA_RXDC_D2|BIOSIM:${biosimTag}|IONIC_M:${youngLippmannIonicStrengthMolPerLiter.toFixed(3)}|PBM_SPREAD_USD:0.00|EMPLOYER_SAVED_USD:${erisaEmployerTrustNetSavingsUsd.toFixed(2)}|BTECH_FEE_USD:${btechErisaFiduciaryClearingFeeUsd.toFixed(2)}|SIG:${claimDigest}`;

    const zeroItHidBarcodePayload = `^VPSE|${hcpcsJCode}|${modifierCode}|ADM:${degassedTrueLiquidVolumeMl.toFixed(2)}mL|VEIN_MASS:${veinDeliveredBioactiveMassMg.toFixed(1)}mg|DE_EXT:${deGennesExtensionalDeborahNumberDe.toFixed(3)}|PUF:${opticalPufSignatureHex64}|SIG:${claimDigest}$`;

    const clampedSafeRateMlHr = Math.min(999.0, Math.max(1.0, maxShearSafeInfusionRateMlPerHr));
    const smartPumpAutoProgramBarcodePayload = `^PUMP_GUARD|DRUG:${hcpcsJCode}|VTBI:${degassedTrueLiquidVolumeMl.toFixed(2)}mL|FLUSH_REQ:${requiredSalineChaseFlushVolumeMl.toFixed(2)}mL|DE_EXT:${deGennesExtensionalDeborahNumberDe.toFixed(3)}|MAX_RATE:${clampedSafeRateMlHr.toFixed(1)}mL/hr|PUF:${opticalPufSignatureHex64}|SIG:${claimDigest}$`;

    const clinicSalt = vialMassBalance?.clinicPrivacySalt ?? "btech-airgap-hipaa-salt-2026";
    const blindedEncounterId = createHash("sha256")
      .update(`${profile.patientIdHash}:${clinicSalt}`)
      .digest("hex")
      .slice(0, 24);
    const warrantyCommitmentHash = createHash("sha256")
      .update(
        `${blindedEncounterId}:${gtinSerial}:${opticalPufSignatureHex64}:${veinDeliveredBioactiveMassMg.toFixed(2)}:${arrheniusEyringActivePotencyFractionPhi.toFixed(4)}:${!isColdChainSpoilage}`
      )
      .digest("hex")
      .slice(0, 24)
      .toUpperCase();
    const zeroPiiBiopharmaWarrantyProof = `zkp:biopharma:warranty:v1:blindId:${blindedEncounterId}:gtin:${gtinSerial}:puf:${opticalPufSignatureHex64}:veinMassMg:${veinDeliveredBioactiveMassMg.toFixed(1)}:coi:${autologousChainOfIdentityHash}:proof:${warrantyCommitmentHash}`;

    const hrsa340bAuditPedigreeProof = `urn:hrsa:340b:audit:pedigree:v1:gtin:${gtinSerial}:puf:${opticalPufSignatureHex64}:rail:${exclusiveRailTag}:nullifier:${cmsMtfIra340bNullifierHash}:merkle:${claimDigest}`;

    const edi867ConsignmentTitleTransferSegment = `PTD*SS***IV*${gtinSerial}~QTY*32*${degassedTrueLiquidVolumeMl.toFixed(2)}*ML~AMT*1*${distributorConsignmentWacPayoutUsd.toFixed(2)}~ZA*QA*${escrowedSplitVialResidualMl.toFixed(2)}*ML~REF*PUF*${opticalPufSignatureHex64}_${claimDigest}~`;

    const fhirHospitalAtHomeSitePassportPayload = `FHIR:R5:MedicationAdministration|POS:12_HOME_OR_AIS|OSM:${vanTHoffOsmolarityMosmPerLiter.toFixed(0)}mOsm/L|POTENCY_PHI:${arrheniusEyringActivePotencyFractionPhi.toFixed(3)}|PAYER_SAVED_USD:${payerSiteOfCareArbitrageSavingsUsd.toFixed(2)}|SIG:${claimDigest}`;

    const iso20022InstantFactoringTriggerPayload = `ISO20022:pain.001.001.11|MSG:BTECH-${claimDigest}|DIST_WAC_USD:${distributorConsignmentWacPayoutUsd.toFixed(2)}|IRA_MFP_SDRA_USD:${iraMfpStandardDefaultRefundUsd.toFixed(2)}|CLINIC_NET_USD:${clinicZeroCapexNetMarginWireUsd.toFixed(2)}|BTECH_REV_USD:${btechUnderwritingRevenueUsd.toFixed(2)}|PUF:${opticalPufSignatureHex64}`;

    const edi278PriorAuthAutoApprovalSegment = `TRN*1*VPSE278_${claimDigest}*9BTECH0001~HCR*A1*PA_AUTO_${claimDigest}*0G~REF*BB*USP797_ESCROW_${escrowedSplitVialResidualMl.toFixed(2)}ML_SAVED_${pbmPreventedWasteSavingsUsd.toFixed(2)}USD~`;

    const edi837pOr180RmaSegment = isColdChainSpoilage
      ? `BLI*N4*${ndc11Code}*${(measuredVolumeMl + billableWasteVolumeMl).toFixed(2)}*ML*RMA*TYNDALL_COLD_CHAIN_AGGREGATION_${claimDigest}~`
      : [
          `LIN**N4*${ndc11Code}~`,
          `CTP****${degassedTrueLiquidVolumeMl.toFixed(2)}*ML~`,
          `SV1*HC:${hcpcsJCode}:${ediModifier}*${protectedReimbursementUsd.toFixed(2)}*UN*${degassedTrueLiquidVolumeMl.toFixed(2)}~`,
          `NTE*ADD*VPSE_VEINMASS_${veinDeliveredBioactiveMassMg.toFixed(1)}MG_PUF_${opticalPufSignatureHex64}_SHA256_${claimDigest}~`,
        ].join("");

    const dscsa340bEpcisClearinghouseProof = `urn:epc:id:sgtin:${gtinSerial}:puf:${opticalPufSignatureHex64}:veinMassMg:${veinDeliveredBioactiveMassMg.toFixed(2)}:nullifier:${cmsMtfIra340bNullifierHash}:sha256:${claimDigest}`;

    const actuarialPremiumRebateBps = isCleanClaim ? 2250 : 0;
    const jwsHeader = Buffer.from(JSON.stringify({ alg: "HS256", typ: "VPSE-JWS" })).toString("base64url");
    const jwsPayload = Buffer.from(
      JSON.stringify({
        ndc: ndc11Code,
        puf: opticalPufSignatureHex64,
        coi: autologousChainOfIdentityHash,
        volMl: Number(degassedTrueLiquidVolumeMl.toFixed(3)),
        veinMassMg: Number(veinDeliveredBioactiveMassMg.toFixed(2)),
        deExt: Number(deGennesExtensionalDeborahNumberDe.toFixed(4)),
        rwaNoteUsd: Number(erc3643RwaTokenizedNoteAmountUsd.toFixed(2)),
        clinicNetUsd: Number(clinicZeroCapexNetMarginWireUsd.toFixed(2)),
        feeUsd: Number(btechUnderwritingRevenueUsd.toFixed(2)),
        rebateBps: actuarialPremiumRebateBps,
        mod: modifierCode,
      })
    ).toString("base64url");
    const parametricActuarialJwsToken = `${jwsHeader}.${jwsPayload}.${claimDigest}`;

    return {
      minSafeVolumeMl,
      maxSafeVolumeMl,
      cmsReimbursementClaim: {
        hcpcsJCode,
        ndc11Code,
        modifierCode,
        administeredVolumeMl: measuredVolumeMl,
        degassedTrueLiquidVolumeMl,
        compressibleGasVoidFractionPhi,
        arrheniusEyringActivePotencyFractionPhi,
        stokesSedimentationIndexZ,
        youngLippmannIonicStrengthMolPerLiter,
        starlingVenousBackPressureKpa,
        usp800HeadspaceOverpressureKpa,
        deGennesExtensionalDeborahNumberDe,
        taylorArisCatheterWashoutEfficiencyEta,
        requiredSalineChaseFlushVolumeMl,
        assayedDeliveredMassMg,
        bioactivePotencyAdjustedMassMg,
        veinDeliveredBioactiveMassMg,
        thermoCompensatedConcentrationMgPerMl,
        vanTHoffOsmolarityMosmPerLiter,
        vanTHoffOsmoticPressureKpa,
        inferredLiquidTemperatureCelsius,
        reconstitutionStoichiometryRatioTheta,
        billableWasteVolumeMl,
        escrowedSplitVialResidualMl,
        pbmPreventedWasteSavingsUsd,
        clinicSharedSavingsBonusUsd,
        btechWastePreventionContingencyUsd,
        payerSiteOfCareArbitrageSavingsUsd,
        clinicDecentralizationBonusUsd,
        btechSiteArbitrageFeeUsd,
        iraMfpStandardDefaultRefundUsd,
        btechMtfClearingFeeUsd,
        stopLossReinsuranceSecuritisedTrancheUsd,
        btechReinsuranceSecuritisationFeeUsd,
        erisaEmployerTrustNetSavingsUsd,
        clinicErisaDirectContractBonusUsd,
        btechErisaFiduciaryClearingFeeUsd,
        gpoContractChargebackRebateUsd,
        cmsEomExtravasationSafeHarborBonusUsd,
        btechGpoEomClearingFeeUsd,
        croPerProtocolMilestoneGrantUsd,
        btechCroEndpointUnderwritingFeeUsd,
        erc3643RwaTokenizedNoteAmountUsd,
        btechRwaOriginationFeeUsd,
        erc3643Iso20022Pacs008RwaSettlementPayload,
        cdiscAdex21CfrPart11ProofPayload,
        edi849GpoChargebackAndCmsEomSegment,
        erisa408b2RxDcSafeHarborProofPayload,
        autologousChainOfIdentityHash,
        isAutologousCoiMismatchDetected,
        isIra340bDuplicateDiscountDetected,
        cmsMtfIra340bNullifierHash,
        edi844IraMfpRebateSegment,
        iso20022Setr012CgtAnnuityBondPayload,
        maxShearSafeInfusionRateMlPerHr: clampedSafeRateMlHr,
        protectedReimbursementUsd,
        distributorConsignmentWacPayoutUsd,
        clinicZeroCapexNetMarginWireUsd,
        instantClinicFactoringAdvanceUsd,
        btechUnderwritingRevenueUsd,
        actuarialPremiumRebateBps,
        opticalPufSignatureHex64,
        minObservedPufHammingDistance,
        isPhysicalSyringeReplayDetected,
        zeroItHidBarcodePayload,
        smartPumpAutoProgramBarcodePayload,
        zeroPiiBiopharmaWarrantyProof,
        hrsa340bAuditPedigreeProof,
        edi867ConsignmentTitleTransferSegment,
        fhirHospitalAtHomeSitePassportPayload,
        iso20022InstantFactoringTriggerPayload,
        edi278PriorAuthAutoApprovalSegment,
        edi837pOr180RmaSegment,
        dscsa340bEpcisClearinghouseProof,
        parametricActuarialJwsToken,
      },
    };
  }

  public evaluateVolumetricSafetyInvariant(
    volumetricReport: VolumetricMetrologyReport,
    profile: PatientPharmacokineticProfile,
    predictiveHorizon?: PredictiveHorizonAssessment,
    vialMassBalance?: VialMassBalanceAuditInput
  ): VolumetricSafetyVerdict {
    const measured = volumetricReport.calibratedVolumeMl;
    const nMeasured = volumetricReport.measuredRefractiveIndexN;
    const inferredTempC =
      predictiveHorizon?.inferredLiquidTemperatureCelsius ?? 20.0;
    const gasPhi = predictiveHorizon?.compressibleGasVoidFractionPhi ?? 0.0;
    const stribeckJerk = predictiveHorizon?.stribeckTribologicalJerkIndex ?? 0.0;
    const potencyPhi =
      predictiveHorizon?.arrheniusEyringActivePotencyFractionPhi ?? 1.0;
    const ionicM = volumetricReport.youngLippmannIonicStrengthMolPerLiter;
    const starlingKpa =
      predictiveHorizon?.starlingVenousBackPressureKpa ?? 1.2;
    const usp800Kpa =
      predictiveHorizon?.usp800HeadspaceOverpressureKpa ?? 0.0;
    const deExt =
      predictiveHorizon?.deGennesExtensionalDeborahNumberDe ?? 0.0;

    const isExtensionalCoilStretchDenaturationDetected =
      predictiveHorizon?.isExtensionalCoilStretchDenaturationDetected === true ||
      (profile.maxAllowedExtensionalDeborahDe !== undefined &&
        deExt > profile.maxAllowedExtensionalDeborahDe);

    const isUsp800HazardousAerosolBlowbackDetected =
      predictiveHorizon?.isUsp800HazardousAerosolBlowbackDetected === true ||
      (profile.maxAllowedUsp800HeadspaceKpa !== undefined &&
        usp800Kpa > profile.maxAllowedUsp800HeadspaceKpa);

    const isVesicantExtravasationOrOcclusionDetected =
      predictiveHorizon?.isVesicantExtravasationOrOcclusionDetected === true ||
      (profile.maxAllowedStarlingBackPressureKpa !== undefined &&
        starlingKpa > profile.maxAllowedStarlingBackPressureKpa);

    const isDiluentBufferIonicIncompatibilityDetected =
      (profile.minAllowedIonicStrengthMolPerLiter !== undefined &&
        ionicM < profile.minAllowedIonicStrengthMolPerLiter) ||
      (profile.maxAllowedIonicStrengthMolPerLiter !== undefined &&
        ionicM > profile.maxAllowedIonicStrengthMolPerLiter);

    const isStokesGravitationalSedimentationDetected =
      volumetricReport.isStokesGravitationalSedimentationDetected ||
      (profile.maxAllowedStokesSedimentationZ !== undefined &&
        volumetricReport.distalLuerAllanVarianceLambda > 0.60 &&
        volumetricReport.stokesSedimentationIndexZ >
          profile.maxAllowedStokesSedimentationZ);

    const isStribeckSiliconeLeachingOrStictionDetected =
      predictiveHorizon?.isStribeckSiliconeLeachingOrStictionDetected === true ||
      (profile.maxAllowedStribeckJerkIndex !== undefined &&
        stribeckJerk > profile.maxAllowedStribeckJerkIndex);

    const isKineticPotencyDecayBreachDetected =
      predictiveHorizon?.isKineticPotencyDecayBreachDetected === true ||
      (profile.minAllowedBioactivePotencyFractionPhi !== undefined &&
        potencyPhi < profile.minAllowedBioactivePotencyFractionPhi);

    const isMicroAirEmbolismOrSealLeakDetected =
      predictiveHorizon?.isMicroAirEmbolismOrSealLeakDetected === true ||
      (profile.maxAllowedGasVoidFractionPhi !== undefined &&
        gasPhi > profile.maxAllowedGasVoidFractionPhi);

    const isThermalExcursionDetected =
      predictiveHorizon?.isThermalExcursionDetected === true ||
      (profile.maxAllowedLiquidTempCelsius !== undefined &&
        inferredTempC > profile.maxAllowedLiquidTempCelsius);

    const isAxialSchlierenStratificationDetected =
      volumetricReport.isAxialSchlierenStratificationDetected ||
      (profile.maxAllowedSchlierenXi !== undefined &&
        volumetricReport.axialSchlierenGradientXi > profile.maxAllowedSchlierenXi);

    const isColdChainProteinAggregationDetected =
      volumetricReport.isProteinAggregationOrTurbidityDetected ||
      (profile.maxAllowedTyndallLambda !== undefined &&
        volumetricReport.tyndallAllanVarianceLambda > profile.maxAllowedTyndallLambda);

    const { minSafeVolumeMl, maxSafeVolumeMl, cmsReimbursementClaim } =
      this.computeSafeDoseAndJwJzClaim(
        profile,
        measured,
        nMeasured,
        volumetricReport.assayedOpticalConcentrationMgPerMl,
        volumetricReport.opticalPufSignatureHex64,
        isColdChainProteinAggregationDetected ||
          isStokesGravitationalSedimentationDetected ||
          isDiluentBufferIonicIncompatibilityDetected ||
          isVesicantExtravasationOrOcclusionDetected ||
          isUsp800HazardousAerosolBlowbackDetected ||
          isExtensionalCoilStretchDenaturationDetected ||
          isThermalExcursionDetected ||
          isKineticPotencyDecayBreachDetected,
        vialMassBalance,
        predictiveHorizon?.maxShearSafeInfusionRateMlPerHr ?? 120.0,
        inferredTempC,
        gasPhi,
        potencyPhi,
        volumetricReport.vanTHoffOsmolarityMosmPerLiter,
        volumetricReport.stokesSedimentationIndexZ,
        ionicM,
        starlingKpa,
        usp800Kpa,
        deExt
      );

    const minWashoutEta =
      profile.minAllowedCatheterWashoutEfficiencyEta ?? 0.95;
    const isTaylorArisCatheterRetentionLossDetected =
      (vialMassBalance?.catheterDeadSpaceVolumeMl ?? 0) > 1e-4 &&
      cmsReimbursementClaim.taylorArisCatheterWashoutEfficiencyEta < minWashoutEta;

    const maxPeripheralOsm =
      profile.maxPeripheralOsmolarityMosmPerLiter ?? 900.0;
    const isVascularOsmolarityNecrosisRiskDetected =
      profile.vascularAccessRoute === "PERIPHERAL_PIV" &&
      cmsReimbursementClaim.vanTHoffOsmolarityMosmPerLiter > maxPeripheralOsm;

    const isReconstitutionConcentrationErrorDetected =
      profile.enforceGladstoneDaleMolarAssay === true &&
      Math.abs(cmsReimbursementClaim.reconstitutionStoichiometryRatioTheta - 1.0) > 0.10;

    const isShearDenaturationDetected =
      predictiveHorizon?.isShearDenaturationDetected === true ||
      (profile.maxAllowedWallShearPa !== undefined &&
        (predictiveHorizon?.hagenPoiseuilleWallShearPa ?? 0) > profile.maxAllowedWallShearPa);

    const effectiveOverdoseRatio = profile.enforceGladstoneDaleMolarAssay
      ? (cmsReimbursementClaim.degassedTrueLiquidVolumeMl *
          cmsReimbursementClaim.reconstitutionStoichiometryRatioTheta *
          potencyPhi *
          cmsReimbursementClaim.taylorArisCatheterWashoutEfficiencyEta) /
        maxSafeVolumeMl
      : (cmsReimbursementClaim.degassedTrueLiquidVolumeMl *
          potencyPhi *
          cmsReimbursementClaim.taylorArisCatheterWashoutEfficiencyEta) /
        maxSafeVolumeMl;

    const hasExpectedTickScale =
      profile.expectedVolumePerGraduationTickMl !== undefined &&
      profile.expectedVolumePerGraduationTickMl > 0 &&
      volumetricReport.observedGraduationTickCount > 0;

    const printedScaleImpliedVolumeMl = hasExpectedTickScale
      ? volumetricReport.observedGraduationTickCount *
        (profile.expectedVolumePerGraduationTickMl ?? 0)
      : measured;

    const barrelScaleIntegrityRatioOmega =
      measured > 1e-6 ? printedScaleImpliedVolumeMl / measured : 1.0;

    const isBarrelScaleMismatchDetected =
      hasExpectedTickScale &&
      Math.abs(barrelScaleIntegrityRatioOmega - 1.0) > 0.12;

    const isRefractiveSwap =
      (profile.expectedRefractiveIndexMin !== undefined &&
        nMeasured < profile.expectedRefractiveIndexMin) ||
      (profile.expectedRefractiveIndexMax !== undefined &&
        nMeasured > profile.expectedRefractiveIndexMax);

    const isRheologicalSwap = predictiveHorizon?.isRheologicalSwapDetected ?? false;

    const vialDepletionMl = vialMassBalance
      ? Math.max(0, vialMassBalance.preDrawVialVolumeMl - vialMassBalance.postDrawVialVolumeMl)
      : measured;
    const expectedVialDepletionMl = vialMassBalance
      ? measured + vialMassBalance.deadSpaceResidualMl
      : measured;
    const divertedNarcoticVolumeMl = vialMassBalance
      ? Math.max(0, Math.abs(vialDepletionMl - expectedVialDepletionMl))
      : 0;
    const isNarcoticDiversionDetected = vialMassBalance
      ? divertedNarcoticVolumeMl > vialMassBalance.maxDiversionToleranceMl
      : false;

    const buildBaseVerdict = (
      overrides: Partial<VolumetricSafetyVerdict> & {
        readonly isSafeToAdminister: boolean;
        readonly recommendedUiAction: "COMMIT_VERIFIED_DOSE" | "TRIGGER_EMERGENCY_LOCKOUT";
        readonly clinicalViolationReason: string;
      }
    ): VolumetricSafetyVerdict => ({
      measuredVolumeMl: measured,
      degassedTrueLiquidVolumeMl: cmsReimbursementClaim.degassedTrueLiquidVolumeMl,
      compressibleGasVoidFractionPhi: gasPhi,
      isMicroAirEmbolismOrSealLeakDetected: false,
      stribeckTribologicalJerkIndex: stribeckJerk,
      isStribeckSiliconeLeachingOrStictionDetected: false,
      arrheniusEyringActivePotencyFractionPhi: potencyPhi,
      bioactivePotencyAdjustedMassMg:
        cmsReimbursementClaim.bioactivePotencyAdjustedMassMg,
      veinDeliveredBioactiveMassMg:
        cmsReimbursementClaim.veinDeliveredBioactiveMassMg,
      taylorArisCatheterWashoutEfficiencyEta:
        cmsReimbursementClaim.taylorArisCatheterWashoutEfficiencyEta,
      requiredSalineChaseFlushVolumeMl:
        cmsReimbursementClaim.requiredSalineChaseFlushVolumeMl,
      isTaylorArisCatheterRetentionLossDetected: false,
      usp800HeadspaceOverpressureKpa: usp800Kpa,
      isUsp800HazardousAerosolBlowbackDetected: false,
      deGennesExtensionalDeborahNumberDe: deExt,
      isExtensionalCoilStretchDenaturationDetected: false,
      isKineticPotencyDecayBreachDetected: false,
      stokesSedimentationIndexZ: volumetricReport.stokesSedimentationIndexZ,
      isStokesGravitationalSedimentationDetected: false,
      youngLippmannIonicStrengthMolPerLiter: ionicM,
      isDiluentBufferIonicIncompatibilityDetected: false,
      starlingVenousBackPressureKpa: starlingKpa,
      isVesicantExtravasationOrOcclusionDetected: false,
      isAutologousCoiMismatchDetected:
        cmsReimbursementClaim.isAutologousCoiMismatchDetected,
      vanTHoffOsmolarityMosmPerLiter:
        cmsReimbursementClaim.vanTHoffOsmolarityMosmPerLiter,
      vanTHoffOsmoticPressureKpa:
        cmsReimbursementClaim.vanTHoffOsmoticPressureKpa,
      isVascularOsmolarityNecrosisRiskDetected: false,
      isIra340bDuplicateDiscountDetected:
        cmsReimbursementClaim.isIra340bDuplicateDiscountDetected,
      assayedOpticalConcentrationMgPerMl:
        cmsReimbursementClaim.thermoCompensatedConcentrationMgPerMl,
      assayedTotalDrugMassMg: cmsReimbursementClaim.assayedDeliveredMassMg,
      inferredLiquidTemperatureCelsius: inferredTempC,
      isThermalExcursionDetected: false,
      axialSchlierenGradientXi: volumetricReport.axialSchlierenGradientXi,
      requiredMixingInversionsCount: volumetricReport.requiredMixingInversionsCount,
      isAxialSchlierenStratificationDetected: false,
      reconstitutionStoichiometryRatioTheta:
        cmsReimbursementClaim.reconstitutionStoichiometryRatioTheta,
      isReconstitutionConcentrationErrorDetected: false,
      isShearDenaturationDetected: false,
      is2dDisplayPresentationSpoofDetected: false,
      printedScaleImpliedVolumeMl,
      barrelScaleIntegrityRatioOmega,
      isBarrelScaleMismatchDetected: false,
      isColdChainProteinAggregationDetected: false,
      isPhysicalSyringeReplayDetected: false,
      minObservedPufHammingDistance: cmsReimbursementClaim.minObservedPufHammingDistance,
      minSafeVolumeMl,
      maxSafeVolumeMl,
      overdoseRatio: effectiveOverdoseRatio,
      measuredRefractiveIndexN: nMeasured,
      isChemicalSwapDetected: false,
      divertedNarcoticVolumeMl,
      isNarcoticDiversionDetected: false,
      cmsReimbursementClaim,
      ...overrides,
    });

    if (volumetricReport.is2dDisplayPresentationSpoofDetected) {
      return buildBaseVerdict({
        isSafeToAdminister: false,
        is2dDisplayPresentationSpoofDetected: true,
        recommendedUiAction: "TRIGGER_EMERGENCY_LOCKOUT",
        clinicalViolationReason: `2D OLED/LCD SCREEN PRESENTATION SPOOF INTERCEPT: Lag-1 Nyquist Moiré autocorrelation (Upsilon=${volumetricReport.nyquistMoireLivenessIndexUpsilon.toFixed(3)}) detected sub-pixel display beat aliasing.`,
      });
    }

    if (cmsReimbursementClaim.isAutologousCoiMismatchDetected) {
      return buildBaseVerdict({
        isSafeToAdminister: false,
        isAutologousCoiMismatchDetected: true,
        recommendedUiAction: "TRIGGER_EMERGENCY_LOCKOUT",
        clinicalViolationReason: `AUTOLOGOUS CHAIN-OF-IDENTITY (COI) MISMATCH INTERCEPT: Patient-lot COI commitment (${cmsReimbursementClaim.autologousChainOfIdentityHash}) does not match expected CAR-T / Gene-Therapy donor cassette (${vialMassBalance?.expectedAutologousCoiHash}).`,
      });
    }

    if (cmsReimbursementClaim.isIra340bDuplicateDiscountDetected) {
      return buildBaseVerdict({
        isSafeToAdminister: false,
        isIra340bDuplicateDiscountDetected: true,
        recommendedUiAction: "TRIGGER_EMERGENCY_LOCKOUT",
        clinicalViolationReason: `CMS MTF IRA-MFP vs. 340B DUPLICATE-DISCOUNT INTERCEPT: Statutory violation attempting to claim both HRSA 340B discount and 2026 IRA Maximum Fair Price (EDI 844) refund on Optical PUF ${cmsReimbursementClaim.opticalPufSignatureHex64}.`,
      });
    }

    if (isExtensionalCoilStretchDenaturationDetected) {
      return buildBaseVerdict({
        isSafeToAdminister: false,
        isExtensionalCoilStretchDenaturationDetected: true,
        recommendedUiAction: "TRIGGER_EMERGENCY_LOCKOUT",
        clinicalViolationReason: `DE GENNES HYPERBOLIC LUER-CONTRACTION COIL-STRETCH INTERCEPT: Extensional Deborah number (De_ext=${deExt.toFixed(3)}, strain rate=${predictiveHorizon?.henckyExtensionalStrainRatePerSec.toFixed(0)} s^-1) exceeds 0.50 conformational unfolding ceiling at barrel-to-nozzle throat.`,
      });
    }

    if (isUsp800HazardousAerosolBlowbackDetected) {
      return buildBaseVerdict({
        isSafeToAdminister: false,
        isUsp800HazardousAerosolBlowbackDetected: true,
        recommendedUiAction: "TRIGGER_EMERGENCY_LOCKOUT",
        clinicalViolationReason: `USP <800> HAZARDOUS DRUG HEADSPACE OVER-PRESSURE / AEROSOL BLOWBACK INTERCEPT: Passive plunger back-creep indicates vial headspace gauge pressure of +${usp800Kpa.toFixed(2)} kPa (exceeding +${profile.maxAllowedUsp800HeadspaceKpa ?? 1.5} kPa closed-system limit).`,
      });
    }

    if (isTaylorArisCatheterRetentionLossDetected) {
      return buildBaseVerdict({
        isSafeToAdminister: false,
        isTaylorArisCatheterRetentionLossDetected: true,
        recommendedUiAction: "TRIGGER_EMERGENCY_LOCKOUT",
        clinicalViolationReason: `TAYLOR-ARIS CATHETER DEAD-VOLUME RETENTION INTERCEPT: Laminar wall dispersion across ${vialMassBalance?.catheterDeadSpaceVolumeMl?.toFixed(2)} mL catheter dead-space traps ${((1.0 - cmsReimbursementClaim.taylorArisCatheterWashoutEfficiencyEta) * 100).toFixed(1)}% of dose. Attach >= ${cmsReimbursementClaim.requiredSalineChaseFlushVolumeMl.toFixed(2)} mL saline chase flush.`,
      });
    }

    if (isVesicantExtravasationOrOcclusionDetected) {
      return buildBaseVerdict({
        isSafeToAdminister: false,
        isVesicantExtravasationOrOcclusionDetected: true,
        recommendedUiAction: "TRIGGER_EMERGENCY_LOCKOUT",
        clinicalViolationReason: `LAMÉ-STARLING VESICANT EXTRAVASATION / CATHETER OCCLUSION INTERCEPT: Intraluminal hoop-strain piezometry measures Starling interstitial back-pressure at ${starlingKpa.toFixed(1)} kPa (exceeding ${profile.maxAllowedStarlingBackPressureKpa ?? 8.0} kPa patent-vein ceiling).`,
      });
    }

    if (isDiluentBufferIonicIncompatibilityDetected) {
      return buildBaseVerdict({
        isSafeToAdminister: false,
        isDiluentBufferIonicIncompatibilityDetected: true,
        isChemicalSwapDetected: true,
        recommendedUiAction: "TRIGGER_EMERGENCY_LOCKOUT",
        clinicalViolationReason: `YOUNG-LIPPMANN DILUENT-BUFFER IONIC INCOMPATIBILITY INTERCEPT (0.9% NaCl vs. D5W): Electro-capillary meniscus wetting assays ionic strength at I=${ionicM.toFixed(3)} mol/L, violating required diluent buffer window [${profile.minAllowedIonicStrengthMolPerLiter ?? 0}, ${profile.maxAllowedIonicStrengthMolPerLiter ?? 1.0}] mol/L for ${profile.drugName}.`,
      });
    }

    if (isStokesGravitationalSedimentationDetected) {
      return buildBaseVerdict({
        isSafeToAdminister: false,
        isStokesGravitationalSedimentationDetected: true,
        isChemicalSwapDetected: true,
        recommendedUiAction: "TRIGGER_EMERGENCY_LOCKOUT",
        clinicalViolationReason: `STOKES-RICHARDSON-ZAKI GRAVITATIONAL SEDIMENTATION INTERCEPT: Distal Luer-tip Allan variance (Lambda_distal=${volumetricReport.distalLuerAllanVarianceLambda.toFixed(3)} px^2, Z_Stokes=${volumetricReport.stokesSedimentationIndexZ.toFixed(3)}) indicates settled CAR-T cell sludge or micro-precipitate plug at the needle nozzle.`,
      });
    }

    if (isVascularOsmolarityNecrosisRiskDetected) {
      return buildBaseVerdict({
        isSafeToAdminister: false,
        isVascularOsmolarityNecrosisRiskDetected: true,
        recommendedUiAction: "TRIGGER_EMERGENCY_LOCKOUT",
        clinicalViolationReason: `VAN 'T HOFF HYPER-OSMOLAR PERIPHERAL VEIN NECROSIS INTERCEPT: Assayed solution osmolarity (${cmsReimbursementClaim.vanTHoffOsmolarityMosmPerLiter.toFixed(0)} mOsm/L, P_osm=${cmsReimbursementClaim.vanTHoffOsmoticPressureKpa.toFixed(0)} kPa) exceeds INS ${maxPeripheralOsm.toFixed(0)} mOsm/L ceiling for PERIPHERAL_PIV access.`,
      });
    }

    if (isStribeckSiliconeLeachingOrStictionDetected) {
      return buildBaseVerdict({
        isSafeToAdminister: false,
        isStribeckSiliconeLeachingOrStictionDetected: true,
        recommendedUiAction: "TRIGGER_EMERGENCY_LOCKOUT",
        clinicalViolationReason: `STRIBECK TRIBOLOGICAL STICK-SLIP / SILICONE-OIL LEACHING INTERCEPT: Plunger velocity jerk index (J_Stribeck=${stribeckJerk.toFixed(3)}) exceeds PDMS lubrication stability threshold.`,
      });
    }

    if (isKineticPotencyDecayBreachDetected) {
      return buildBaseVerdict({
        isSafeToAdminister: false,
        isKineticPotencyDecayBreachDetected: true,
        isChemicalSwapDetected: true,
        recommendedUiAction: "TRIGGER_EMERGENCY_LOCKOUT",
        clinicalViolationReason: `ARRHENIUS-EYRING / BATEMAN KINETIC POTENCY DECAY INTERCEPT: Surviving bioactive potency fraction (${(potencyPhi * 100).toFixed(1)}%, active mass=${cmsReimbursementClaim.bioactivePotencyAdjustedMassMg.toFixed(1)} mg) degraded below USP 90.0% floor.`,
      });
    }

    if (isMicroAirEmbolismOrSealLeakDetected) {
      return buildBaseVerdict({
        isSafeToAdminister: false,
        isMicroAirEmbolismOrSealLeakDetected: true,
        recommendedUiAction: "TRIGGER_EMERGENCY_LOCKOUT",
        clinicalViolationReason: `BOYLE-MARIOTTE MICRO-AIR EMBOLISM / SEAL LEAK INTERCEPT: Plunger-to-meniscus kinematic compressibility detects ${(gasPhi * 100).toFixed(2)}% dispersed micro-bubble void fraction.`,
      });
    }

    if (isAxialSchlierenStratificationDetected) {
      return buildBaseVerdict({
        isSafeToAdminister: false,
        isAxialSchlierenStratificationDetected: true,
        isChemicalSwapDetected: true,
        recommendedUiAction: "TRIGGER_EMERGENCY_LOCKOUT",
        clinicalViolationReason: `AXIAL SCHLIEREN BOLUS STRATIFICATION INTERCEPT: Unmixed concentration gradient (Xi=${volumetricReport.axialSchlierenGradientXi.toFixed(4)}) detected. Invert syringe ${volumetricReport.requiredMixingInversionsCount}x to homogenize.`,
      });
    }

    if (isThermalExcursionDetected) {
      return buildBaseVerdict({
        isSafeToAdminister: false,
        isThermalExcursionDetected: true,
        isChemicalSwapDetected: true,
        recommendedUiAction: "TRIGGER_EMERGENCY_LOCKOUT",
        clinicalViolationReason: `ARRHENIUS OPTICAL THERMOMETRY EXCURSION INTERCEPT: Non-contact meniscus viscometry measures internal liquid temperature at ${inferredTempC.toFixed(1)} C (exceeding USP <797> ${profile.maxAllowedLiquidTempCelsius ?? 25.0} C ceiling).`,
      });
    }

    if (isShearDenaturationDetected) {
      return buildBaseVerdict({
        isSafeToAdminister: false,
        isShearDenaturationDetected: true,
        recommendedUiAction: "TRIGGER_EMERGENCY_LOCKOUT",
        clinicalViolationReason: `HAGEN-POISEUILLE HYDRODYNAMIC SHEAR DENATURATION INTERCEPT: Needle wall shear stress (${predictiveHorizon?.hagenPoiseuilleWallShearPa.toFixed(1)} Pa) exceeds biologic unfolding ceiling.`,
      });
    }

    if (isReconstitutionConcentrationErrorDetected) {
      return buildBaseVerdict({
        isSafeToAdminister: false,
        isReconstitutionConcentrationErrorDetected: true,
        isChemicalSwapDetected: true,
        recommendedUiAction: "TRIGGER_EMERGENCY_LOCKOUT",
        clinicalViolationReason: `LYOPHILIZED RECONSTITUTION CONCENTRATION ERROR: Drawn volume (${measured.toFixed(2)} mL) is nominal, but thermo-compensated Gladstone-Dale assay measures ${cmsReimbursementClaim.thermoCompensatedConcentrationMgPerMl.toFixed(1)} mg/mL (${cmsReimbursementClaim.reconstitutionStoichiometryRatioTheta.toFixed(2)}x target ${profile.concentrationMgPerMl} mg/mL).`,
      });
    }

    if (isColdChainProteinAggregationDetected) {
      return buildBaseVerdict({
        isSafeToAdminister: false,
        isColdChainProteinAggregationDetected: true,
        isChemicalSwapDetected: true,
        recommendedUiAction: "TRIGGER_EMERGENCY_LOCKOUT",
        clinicalViolationReason: `COLD-CHAIN BIOLOGIC SPOILAGE / PROTEIN AGGREGATION INTERCEPT: Tilt-invariant Rayleigh-Tyndall Allan variance (Lambda=${volumetricReport.tyndallAllanVarianceLambda.toFixed(3)} px^2) indicates sub-visible oligomer turbidity. Auto-generated EDI 180 RMA (${cmsReimbursementClaim.edi837pOr180RmaSegment}).`,
      });
    }

    if (cmsReimbursementClaim.isPhysicalSyringeReplayDetected) {
      return buildBaseVerdict({
        isSafeToAdminister: false,
        isPhysicalSyringeReplayDetected: true,
        recommendedUiAction: "TRIGGER_EMERGENCY_LOCKOUT",
        clinicalViolationReason: `OPTICAL PUF SYRINGE REPLAY / DOUBLE-BILLING INTERCEPT: Barrel micro-striation PUF (${cmsReimbursementClaim.opticalPufSignatureHex64}) matches a previously billed syringe with Fractional Hamming Distance d_H=${cmsReimbursementClaim.minObservedPufHammingDistance.toFixed(4)} <= 0.15625.`,
      });
    }

    if (isBarrelScaleMismatchDetected) {
      return buildBaseVerdict({
        isSafeToAdminister: false,
        isBarrelScaleMismatchDetected: true,
        recommendedUiAction: "TRIGGER_EMERGENCY_LOCKOUT",
        clinicalViolationReason: `SYRINGE BARREL SCALE MISMATCH (U-40/U-100 OR COUNTERFEIT BARREL): Printed graduation marks imply ${printedScaleImpliedVolumeMl.toFixed(2)} mL, but true 3D lumen geometry contains ${measured.toFixed(2)} mL (Omega=${barrelScaleIntegrityRatioOmega.toFixed(2)}x discrepancy).`,
      });
    }

    if (isRheologicalSwap) {
      return buildBaseVerdict({
        isSafeToAdminister: false,
        isChemicalSwapDetected: true,
        recommendedUiAction: "TRIGGER_EMERGENCY_LOCKOUT",
        clinicalViolationReason: `COX-VOINOV RHEOLOGICAL VISCOMETRY INTERCEPT: Dynamic meniscus relaxation modulus (Psi=${predictiveHorizon?.dynamicViscosityModulusSecPerMeter.toFixed(4)} s/m) below biologic floor (${profile.expectedMinViscosityModulus} s/m).`,
      });
    }

    if (isRefractiveSwap) {
      return buildBaseVerdict({
        isSafeToAdminister: false,
        isChemicalSwapDetected: true,
        recommendedUiAction: "TRIGGER_EMERGENCY_LOCKOUT",
        clinicalViolationReason: `OPTICAL REFRACTOMETRY SWAP INTERCEPT: Measured Bouguer refractive index (n=${nMeasured.toFixed(4)}) outside [${profile.expectedRefractiveIndexMin?.toFixed(4)}, ${profile.expectedRefractiveIndexMax?.toFixed(4)}] for ${profile.drugName}.`,
      });
    }

    if (isNarcoticDiversionDetected) {
      return buildBaseVerdict({
        isSafeToAdminister: false,
        isNarcoticDiversionDetected: true,
        recommendedUiAction: "TRIGGER_EMERGENCY_LOCKOUT",
        clinicalViolationReason: `DEA CONTROLLED-SUBSTANCE DIVERSION INTERCEPT: Vial lost ${vialDepletionMl.toFixed(2)} mL but syringe contains ${measured.toFixed(2)} mL. Unaccounted narcotic discrepancy: ${divertedNarcoticVolumeMl.toFixed(2)} mL.`,
      });
    }

    if (volumetricReport.hasSurfaceTensionAdulteration) {
      return buildBaseVerdict({
        isSafeToAdminister: false,
        isChemicalSwapDetected: true,
        recommendedUiAction: "TRIGGER_EMERGENCY_LOCKOUT",
        clinicalViolationReason: `CHEMICAL ADULTERATION INTERCEPT: Young-Laplace meniscus contact angle (${volumetricReport.estimatedContactAngleDeg.toFixed(1)} deg) violates pharmacopeia surface-tension bounds.`,
      });
    }

    if (volumetricReport.hasCavitationOrTamperAnomaly) {
      return buildBaseVerdict({
        isSafeToAdminister: false,
        recommendedUiAction: "TRIGGER_EMERGENCY_LOCKOUT",
        clinicalViolationReason: `CRITICAL PHYSICAL ANOMALY: Radial distortion/cavitation index (kappa=${volumetricReport.radialDistortionIndexKappa.toFixed(3)}) exceeds barrel tolerance (${profile.maxAllowedKappa}).`,
      });
    }

    if (cmsReimbursementClaim.degassedTrueLiquidVolumeMl > maxSafeVolumeMl) {
      return buildBaseVerdict({
        isSafeToAdminister: false,
        recommendedUiAction: "TRIGGER_EMERGENCY_LOCKOUT",
        clinicalViolationReason: `LETHAL OVERDOSE INTERCEPT: Physically measured meniscus volume (${measured.toFixed(2)} mL) is ${effectiveOverdoseRatio.toFixed(2)}x above renal-adjusted ceiling (${maxSafeVolumeMl.toFixed(2)} mL) for ${profile.drugName}.`,
      });
    }

    if (predictiveHorizon?.isPreemptiveBreachImminent) {
      return buildBaseVerdict({
        isSafeToAdminister: false,
        overdoseRatio: predictiveHorizon.projectedVolumeAtHorizonMl / maxSafeVolumeMl,
        recommendedUiAction: "TRIGGER_EMERGENCY_LOCKOUT",
        clinicalViolationReason: `PRE-EMPTIVE KALMAN FLOW INTERCEPT: Plunger velocity (+${predictiveHorizon.updatedState.flowVelocityMlPerSec.toFixed(2)} mL/s) will breach ${maxSafeVolumeMl.toFixed(2)} mL ceiling in ${(predictiveHorizon.timeToOverdoseBreachSec * 1000).toFixed(0)} ms.`,
      });
    }

    if (cmsReimbursementClaim.degassedTrueLiquidVolumeMl < minSafeVolumeMl) {
      return buildBaseVerdict({
        isSafeToAdminister: false,
        recommendedUiAction: "TRIGGER_EMERGENCY_LOCKOUT",
        clinicalViolationReason: `SUB-THERAPEUTIC UNDERDOSE: Degassed liquid volume (${cmsReimbursementClaim.degassedTrueLiquidVolumeMl.toFixed(2)} mL) is below minimum therapeutic threshold (${minSafeVolumeMl.toFixed(2)} mL).`,
      });
    }

    return buildBaseVerdict({
      isSafeToAdminister: true,
      recommendedUiAction: "COMMIT_VERIFIED_DOSE",
      clinicalViolationReason: `ERC-3643 RWA & 10-STREAM CLEARING SETTLED ($0 BTech Balance-Sheet Risk | RWA Note: $${cmsReimbursementClaim.erc3643RwaTokenizedNoteAmountUsd.toFixed(2)} | BTech 10-Stream Revenue: $${cmsReimbursementClaim.btechUnderwritingRevenueUsd.toFixed(2)}): ${cmsReimbursementClaim.erc3643Iso20022Pacs008RwaSettlementPayload}`,
    });
  }
}