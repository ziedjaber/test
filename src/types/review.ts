export interface TrustSignals {
  hasVerifiedReceipt: boolean;
  complicationsMentioned: boolean;
  astroturfingRiskScore: number; // 0.0 to 1.0
  sponsorshipMarkers: string[];
  sentimentScore: 'Positive' | 'Neutral' | 'Mixed / Critical' | 'PR Over-Promotional';
  linguisticFlags: string[];
}

export interface MedicalDetails {
  anesthesiaType: string;
  estimatedDowntimeDays: number;
  painLevel: 'Mild' | 'Moderate' | 'High' | 'Severe';
  stitchRemovalDays: number | null;
  hospitalAccreditation: 'MOHW Approved (Foreign Patient Certified)' | 'Standard Clinic' | 'Unknown';
  subDistrict: 'Apgujeong' | 'Gangnam Station' | 'Sinsa / Garosugil' | 'Cheongdam' | 'Nonhyeon';
}

export interface FinancialBreakdown {
  priceKrw: number | null;
  priceUsdApprox: number | null;
  taxRefundKrw: number | null;
  taxRefundUsdApprox: number | null;
  consultationFeeKrw: number | null;
  surgeryFeeKrw: number | null;
}

export interface NormalizedReview {
  clinicRawKr: string;
  clinicNormalizedEn: string;
  clinicKoreanCanonical: string;
  procedureRawKr: string;
  procedureStandardEn: string;
  procedureCategory: 'Blepharoplasty' | 'Rhinoplasty' | 'Lifting & Anti-aging' | 'Contouring & Facial Bone' | 'Dermatology';
  surgeonName: string | null;
  financials: FinancialBreakdown;
  medicalDetails: MedicalDetails;
  translatedSummary: string;
  clinicalTakeaways: string[];
  trustSignals: TrustSignals;
  analyzedAt: string;
}
