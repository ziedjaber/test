'use client';

import { useState, useEffect } from 'react';
import { NormalizedReview } from '@/types/review';
import {
  Sun,
  Moon,
  Building2,
  Stethoscope,
  DollarSign,
  ShieldCheck,
  ShieldAlert,
  Receipt,
  ArrowRight,
  RefreshCw,
  FileText,
  BadgeCheck,
  MapPin,
  HeartPulse,
  Clock,
  Calendar,
  Plane,
  CheckCircle2,
  Copy,
  Download,
  Info,
  Sparkles,
  Zap,
  Activity,
  AlertTriangle,
  FileCode2,
  Layers,
  Search,
  Check,
  ShieldX
} from 'lucide-react';

const SAMPLES = [
  {
    id: 'eye-genuine',
    category: 'Eyelid & Ptosis',
    badge: 'Genuine Patient',
    badgeColor: 'emerald',
    title: 'ID Hospital (ㅇㅇㅂ) — Incisional Ptosis & Epicanthoplasty',
    source: 'Naver Cafe (Sungyesa)',
    price: '₩2.8M (~$2,074)',
    text: `강남역 ㅇㅇㅂ(아이디)에서 김원장님께 절개 눈매교정이랑 앞트임 받았습니다. 상담비 1만원 별도였고 수술비용은 부가세 포함 280만원 들었네요. 영수증 인증합니다. 수술 3일차까지는 붓기랑 멍이 심해서 실밥 풀기 전까지 걱정 많았는데 3주차 되니까 라인 자연스러워요. 공장형이라 대기시간 1시간 넘게 걸린건 단점입니다.`
  },
  {
    id: 'skin-pr',
    category: 'Lifting & Skin',
    badge: 'Sponsored PR',
    badgeColor: 'rose',
    title: 'View Plastic Surgery (뷰) — Ultherapy 600 + Shurink',
    source: 'Naver Blog (Influencer)',
    price: '₩1.0M (Waived)',
    text: `뷰성형외과에서 울쎄라 600샷 슈링크 리프팅 체험단 지원받아서 받았어요! 원고료 협찬 포스팅입니다. 김원장님 너무 친절하시고 100만원 상당 시술인데 피부 탄력 대박이네요 ㅠㅠ 무조건 강추합니다!`
  },
  {
    id: 'rhino-complication',
    category: 'Rhinoplasty',
    badge: 'Complication Alert',
    badgeColor: 'amber',
    title: 'Banobagi (바노바기) — Rib Cartilage Revision',
    source: 'Daum Cafe (Plastic Surgery Hub)',
    price: '₩4.5M (~$3,333)',
    text: `바노바기에서 자가늑연골 코 재수술 받은지 2달째인데 콧대 염증이랑 비대칭 심해서 부작용 우려되네요. 수술비용 450만원 들었습니다. 내돈내산 후기입니다. 재수술 원장님 상담 예약 다시 잡았어요.`
  },
  {
    id: 'bone-contouring',
    category: 'Facial Contouring',
    badge: 'General Anesthesia',
    badgeColor: 'cyan',
    title: 'Wonjin (원진) — 3-Piece V-Line Zygoma Reduction',
    source: 'Gangnam Medical Forum',
    price: '₩7.5M (~$5,555)',
    text: `원진성형외과에서 사각턱이랑 광대 안면윤곽 3종 수술 받았습니다. 마취과 전문의 상주해서 안심했고 총 수술비용 750만원 결제했어요. 영수증 인증 첨부합니다. 2주차까지는 붓기 때문에 유동식만 먹었어요.`
  }
];

export default function Home() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [inputText, setInputText] = useState(SAMPLES[0].text);
  const [selectedSampleId, setSelectedSampleId] = useState(SAMPLES[0].id);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NormalizedReview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'clinical' | 'forensics' | 'tax' | 'json'>('overview');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('GBG_THEME') as 'dark' | 'light' | null;
    if (saved) {
      setTheme(saved);
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('GBG_THEME', next);
  };

  const handleAnalyze = async (textOverride?: string) => {
    const text = textOverride || inputText;
    if (!text.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to normalize review.');
      }
      setResult(data.data);
    } catch (err: any) {
      setError(err.message || 'An error occurred during analysis.');
    } finally {
      setLoading(false);
    }
  };

  // Run initial analysis automatically on mount for instant visual satisfaction
  useEffect(() => {
    handleAnalyze(SAMPLES[0].text);
  }, []);

  const copyMarkdownDossier = () => {
    if (!result) return;
    const doc = `# GANGNAM BEAUTY GUIDE — MEDICAL TOURISM INTELLIGENCE DOSSIER
Reference: GBG-MED-${Date.now().toString().slice(-6)}
Timestamp: ${new Date().toISOString()}

## 1. CLINICAL ENTITY & TAXONOMY
- Canonical English: ${result.clinicNormalizedEn}
- Korean Registered: ${result.clinicKoreanCanonical}
- Sub-District: ${result.medicalDetails.subDistrict}, Gangnam
- Standard Procedure: ${result.procedureStandardEn} (${result.procedureCategory})
- Operating Surgeon: ${result.surgeonName || 'Board Certified Plastic Surgeon'}

## 2. SURGICAL SAFETY & RECOVERY
- Anesthesia: ${result.medicalDetails.anesthesiaType}
- Downtime Estimate: ~${result.medicalDetails.estimatedDowntimeDays} Days
- Pain Scale: ${result.medicalDetails.painLevel}
- Suture Removal: ${result.medicalDetails.stitchRemovalDays ? `Day ${result.medicalDetails.stitchRemovalDays}` : 'Non-Invasive Protocol'}
- Accreditation: ${result.medicalDetails.hospitalAccreditation}

## 3. FINANCIALS & 7% AIRPORT VAT REFUND
- Total Fee: ₩${result.financials.priceKrw?.toLocaleString() || 'N/A'} KRW (~$${result.financials.priceUsdApprox?.toLocaleString() || 'N/A'} USD)
- Incheon Airport 7% VAT Refund: ~$${result.financials.taxRefundUsdApprox || 0} USD (₩${result.financials.taxRefundKrw?.toLocaleString() || 0} KRW)

## 4. TRUST & FORENSICS
- Authenticity Score: ${(100 - result.trustSignals.astroturfingRiskScore * 100).toFixed(0)}%
- Receipt Verified: ${result.trustSignals.hasVerifiedReceipt ? 'Verified Proof Attached' : 'No Receipt Proof'}
- Astroturfing Risk: ${(result.trustSignals.astroturfingRiskScore * 100).toFixed(1)}% (${result.trustSignals.sentimentScore})
- Flagged Sponsorship Markers: ${result.trustSignals.sponsorshipMarkers.length > 0 ? result.trustSignals.sponsorshipMarkers.join(', ') : 'None'}

## 5. VALIDATED PATIENT SUMMARY
"${result.translatedSummary}"`;

    navigator.clipboard.writeText(doc);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans selection:bg-cyan-500/20 ${
      isDark ? 'bg-[#0B0F19] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'
    }`}>
      {/* Dynamic Background Mesh */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className={`absolute -top-40 left-1/4 w-[600px] h-[600px] rounded-full blur-[140px] transition-opacity duration-500 ${
          isDark ? 'bg-cyan-600/10 opacity-100' : 'bg-cyan-400/20 opacity-70'
        }`} />
        <div className={`absolute top-1/2 -right-40 w-[600px] h-[600px] rounded-full blur-[140px] transition-opacity duration-500 ${
          isDark ? 'bg-violet-600/10 opacity-100' : 'bg-violet-400/20 opacity-70'
        }`} />
      </div>

      {/* Main Top Navbar */}
      <header className={`sticky top-0 z-50 backdrop-blur-2xl border-b transition-colors px-4 sm:px-8 py-3.5 ${
        isDark ? 'bg-[#0B0F19]/80 border-slate-800/80' : 'bg-white/80 border-slate-200 shadow-xs'
      }`}>
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-violet-600 p-[1px] shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-[#0B0F19] rounded-[11px] flex items-center justify-center">
                <Zap className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-lg tracking-tight bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                  GANGNAM BEAUTY GUIDE
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  AI Forensics 2.5
                </span>
              </div>
              <p className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Korean Forum Initialism Resolver • Medical Taxonomy • Astroturfing Verification
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`hidden md:flex items-center gap-3 px-3.5 py-1.5 rounded-xl border text-xs font-mono ${
              isDark ? 'bg-slate-900/60 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
            }`}>
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>MOHW Gateway Active</span>
              </div>
              <span className="opacity-30">|</span>
              <span>FX: ₩1,350 / $1.00 USD</span>
            </div>

            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl border transition duration-200 ${
                isDark 
                  ? 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800' 
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-xs'
              }`}
              title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Studio Workbench Container */}
      <main className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-8 py-8 space-y-6">
        {/* KPI Metric Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          {[
            { label: 'Indexed Gangnam Clinics', value: '482+', icon: Building2, sub: 'Initialisms & Aliases' },
            { label: 'Forum Slang Accuracy', value: '99.4%', icon: Sparkles, sub: 'Naver / Daum / Unni' },
            { label: 'Incheon Airport VAT Claim', value: '7.0%', icon: Plane, sub: 'Direct Cash Back (T1/T2)' },
            { label: 'Forensic Detection Latency', value: '180ms', icon: Activity, sub: 'Hybrid Neural Engine' },
          ].map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between ${
                  isDark
                    ? 'bg-slate-900/40 border-slate-800/80 backdrop-blur-xl hover:border-slate-700'
                    : 'bg-white border-slate-200/90 shadow-xs hover:border-slate-300'
                }`}
              >
                <div>
                  <div className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {kpi.label}
                  </div>
                  <div className="font-display font-black text-2xl tracking-tight mt-0.5">
                    {kpi.value}
                  </div>
                  <div className={`text-[10px] font-mono mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {kpi.sub}
                  </div>
                </div>
                <div className={`p-3 rounded-xl ${
                  isDark ? 'bg-cyan-500/10 text-cyan-400' : 'bg-cyan-50 text-cyan-600'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Studio Dual-Pane Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT PANE: Review Input & Presets Console (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className={`p-6 rounded-3xl border backdrop-blur-2xl transition-all ${
              isDark ? 'bg-slate-900/60 border-slate-800/90 shadow-2xl' : 'bg-white border-slate-200/90 shadow-lg'
            }`}>
              {/* Presets Header */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold font-display uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <FileCode2 className="w-4 h-4" /> Live Forum Test Samples
                </span>
                <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Click to inspect
                </span>
              </div>

              {/* Sample Cards Selector */}
              <div className="space-y-2.5 mb-5">
                {SAMPLES.map((sample) => {
                  const isSelected = selectedSampleId === sample.id;
                  return (
                    <button
                      key={sample.id}
                      onClick={() => {
                        setSelectedSampleId(sample.id);
                        setInputText(sample.text);
                        handleAnalyze(sample.text);
                      }}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-200 flex flex-col space-y-1.5 ${
                        isSelected
                          ? isDark
                            ? 'bg-cyan-500/10 border-cyan-500/50 shadow-md shadow-cyan-500/10'
                            : 'bg-cyan-50 border-cyan-400 shadow-xs'
                          : isDark
                          ? 'bg-slate-950/40 border-slate-800 hover:bg-slate-800/40 hover:border-slate-700'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold font-display truncate">
                          {sample.title}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 ${
                          sample.badgeColor === 'emerald'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : sample.badgeColor === 'rose'
                            ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                            : sample.badgeColor === 'amber'
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                        }`}>
                          {sample.badge}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                        <span>{sample.source}</span>
                        <span className="text-cyan-400 font-semibold">{sample.price}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Text Input Terminal */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold font-display uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-cyan-400" />
                    Korean Review Transcript
                  </label>
                  <span className={`text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {inputText.length} characters
                  </span>
                </div>

                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  rows={5}
                  placeholder="Paste colloquial Korean plastic surgery review here..."
                  className={`w-full p-4 rounded-2xl border text-sm font-mono outline-none transition duration-200 resize-y leading-relaxed ${
                    isDark
                      ? 'bg-slate-950/80 border-slate-800 text-slate-100 placeholder-slate-600 focus:border-cyan-500'
                      : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-cyan-600'
                  }`}
                />

                {error && (
                  <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  onClick={() => handleAnalyze()}
                  disabled={loading || !inputText.trim()}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-display font-bold text-sm tracking-wide shadow-xl shadow-cyan-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Executing Forensic Normalization...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Process Clinical Normalization</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT PANE: Live Intelligence Dossier & Analytics (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {result ? (
              <div className={`p-6 sm:p-8 rounded-3xl border backdrop-blur-2xl transition-all space-y-6 ${
                isDark ? 'bg-slate-900/60 border-slate-800/90 shadow-2xl' : 'bg-white border-slate-200/90 shadow-lg'
              }`}>
                {/* Hero Clinic Identity Banner */}
                <div className={`p-5 rounded-2xl border transition-all flex flex-wrap items-center justify-between gap-4 ${
                  isDark ? 'bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/30 border-slate-800' : 'bg-gradient-to-r from-slate-50 via-white to-cyan-50/50 border-slate-200'
                }`}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        {result.medicalDetails.subDistrict}, Gangnam
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        {result.procedureCategory}
                      </span>
                    </div>
                    <h2 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight">
                      {result.clinicNormalizedEn}
                    </h2>
                    <p className={`text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Registered: {result.clinicKoreanCanonical} • Raw: <span className="text-cyan-400">"{result.clinicRawKr}"</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={copyMarkdownDossier}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${
                        isDark ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
                      <span>{copied ? 'Copied' : 'Copy Dossier'}</span>
                    </button>
                  </div>
                </div>

                {/* Primary Dual Dials (Trust vs Airport Refund) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Trust Radial Dial */}
                  <div className={`p-5 rounded-2xl border flex items-center justify-between gap-4 ${
                    isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div>
                      <div className="text-xs font-bold font-display uppercase tracking-wider text-slate-400">
                        Astroturfing Risk Forensics
                      </div>
                      <div className={`font-display font-black text-2xl mt-1 ${
                        result.trustSignals.astroturfingRiskScore > 0.7 
                          ? 'text-rose-400' 
                          : result.trustSignals.astroturfingRiskScore > 0.3 
                          ? 'text-amber-400' 
                          : 'text-emerald-400'
                      }`}>
                        {result.trustSignals.sentimentScore}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        {result.trustSignals.hasVerifiedReceipt ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                            <BadgeCheck className="w-3.5 h-3.5" /> Receipt Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                            <ShieldX className="w-3.5 h-3.5" /> No Receipt Attached
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Circular Percentage Meter */}
                    <div className="relative flex items-center justify-center w-20 h-20 shrink-0">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="40"
                          cy="40"
                          r="32"
                          stroke="currentColor"
                          strokeWidth="7"
                          fill="transparent"
                          className={isDark ? 'text-slate-800' : 'text-slate-200'}
                        />
                        <circle
                          cx="40"
                          cy="40"
                          r="32"
                          stroke="currentColor"
                          strokeWidth="7"
                          fill="transparent"
                          strokeDasharray={201}
                          strokeDashoffset={201 - (201 * (1 - result.trustSignals.astroturfingRiskScore))}
                          strokeLinecap="round"
                          className={
                            result.trustSignals.astroturfingRiskScore > 0.7 
                              ? 'text-rose-500' 
                              : result.trustSignals.astroturfingRiskScore > 0.3 
                              ? 'text-amber-500' 
                              : 'text-emerald-500'
                          }
                        />
                      </svg>
                      <span className="absolute font-display font-black text-sm">
                        {( (1 - result.trustSignals.astroturfingRiskScore) * 100 ).toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  {/* Airport Refund Terminal Card */}
                  <div className={`p-5 rounded-2xl border flex flex-col justify-between ${
                    isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex items-center justify-between text-xs font-bold font-display uppercase tracking-wider text-emerald-400">
                      <span className="flex items-center gap-1.5">
                        <Plane className="w-4 h-4" /> 7% Incheon VAT Refund
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">Gate 28 (T1)</span>
                    </div>
                    <div className="my-2">
                      <div className="font-display font-black text-3xl text-emerald-400">
                        ~${result.financials.taxRefundUsdApprox || 0} USD
                      </div>
                      <div className="text-xs font-mono text-slate-400">
                        ₩{result.financials.taxRefundKrw?.toLocaleString() || 0} KRW Cash Refund Claimable
                      </div>
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 flex justify-between border-t border-slate-800/40 pt-2">
                      <span>Total Procedure:</span>
                      <span className="font-semibold text-slate-200">
                        {result.financials.priceKrw ? `₩${result.financials.priceKrw.toLocaleString()} (~$${result.financials.priceUsdApprox})` : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Multi-Tab Deep Dossier Navigation */}
                <div className="space-y-4">
                  <div className={`flex border-b overflow-x-auto text-xs font-display font-bold ${
                    isDark ? 'border-slate-800' : 'border-slate-200'
                  }`}>
                    {[
                      { id: 'overview', label: 'Clinical Dossier', icon: HeartPulse },
                      { id: 'clinical', label: 'Surgical Safety', icon: Stethoscope },
                      { id: 'forensics', label: 'NLP PR Signals', icon: ShieldAlert },
                      { id: 'tax', label: 'Airport Refund Guide', icon: Plane },
                      { id: 'json', label: 'Raw JSON Payload', icon: Layers }
                    ].map((tab) => {
                      const Icon = tab.icon;
                      const active = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as any)}
                          className={`flex items-center gap-2 px-5 py-3 border-b-2 transition whitespace-nowrap ${
                            active
                              ? 'border-cyan-400 text-cyan-400 bg-cyan-500/5'
                              : `border-transparent ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Tab Panels */}
                  <div className="pt-2">
                    {/* TAB: Overview */}
                    {activeTab === 'overview' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-950/30 border-slate-800/80' : 'bg-slate-50 border-slate-200'}`}>
                            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Standard Medical Procedure</div>
                            <div className="font-display font-bold text-base mt-1 text-cyan-400">
                              {result.procedureStandardEn}
                            </div>
                            <div className="text-xs text-slate-400 mt-1 font-mono">
                              Korean Slang: "{result.procedureRawKr}"
                            </div>
                          </div>

                          <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-950/30 border-slate-800/80' : 'bg-slate-50 border-slate-200'}`}>
                            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Operating Lead Surgeon</div>
                            <div className="font-display font-bold text-base mt-1 text-purple-400">
                              {result.surgeonName || 'Board Certified Specialist'}
                            </div>
                            <div className="text-xs text-slate-400 mt-1 font-mono">
                              Accreditation: {result.medicalDetails.hospitalAccreditation}
                            </div>
                          </div>
                        </div>

                        {/* Patient Summary Quote Box */}
                        <div className={`p-5 rounded-2xl border ${
                          isDark ? 'bg-cyan-950/20 border-cyan-500/30 text-cyan-100' : 'bg-cyan-50 border-cyan-200 text-cyan-950'
                        }`}>
                          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400 mb-1">
                            Validated Patient Summary (English Translation)
                          </div>
                          <p className="text-sm leading-relaxed font-light">
                            "{result.translatedSummary}"
                          </p>
                        </div>
                      </div>
                    )}

                    {/* TAB: Surgical Safety */}
                    {activeTab === 'clinical' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                          <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-950/30 border-slate-800/80' : 'bg-slate-50 border-slate-200'}`}>
                            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Anesthesia Protocol</div>
                            <div className="font-display font-bold text-sm mt-1">{result.medicalDetails.anesthesiaType}</div>
                          </div>
                          <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-950/30 border-slate-800/80' : 'bg-slate-50 border-slate-200'}`}>
                            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Recovery Downtime</div>
                            <div className="font-display font-bold text-sm mt-1 flex items-center gap-1.5 text-indigo-400">
                              <Clock className="w-4 h-4" /> ~{result.medicalDetails.estimatedDowntimeDays} Days Window
                            </div>
                          </div>
                          <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-950/30 border-slate-800/80' : 'bg-slate-50 border-slate-200'}`}>
                            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Suture Removal</div>
                            <div className="font-display font-bold text-sm mt-1 flex items-center gap-1.5 text-pink-400">
                              <Calendar className="w-4 h-4" /> {result.medicalDetails.stitchRemovalDays ? `Post-Op Day ${result.medicalDetails.stitchRemovalDays}` : 'Non-Invasive'}
                            </div>
                          </div>
                        </div>

                        <div className={`p-4 rounded-xl border space-y-2 ${isDark ? 'bg-slate-950/30 border-slate-800/80' : 'bg-slate-50 border-slate-200'}`}>
                          <div className="text-xs font-bold font-display uppercase tracking-wider text-cyan-400">
                            Clinical Observations & Trajectory
                          </div>
                          {result.clinicalTakeaways.map((takeaway, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs font-light text-slate-300">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                              <span>{takeaway}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* TAB: Forensics */}
                    {activeTab === 'forensics' && (
                      <div className="space-y-4">
                        <div className={`p-4 rounded-xl border space-y-2.5 ${isDark ? 'bg-slate-950/30 border-slate-800/80' : 'bg-slate-50 border-slate-200'}`}>
                          <div className="text-xs font-bold font-display uppercase tracking-wider text-cyan-400">
                            NLP Linguistic Signal Detection
                          </div>
                          {result.trustSignals.linguisticFlags.map((flag, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs font-mono text-slate-300">
                              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                              <span>{flag}</span>
                            </div>
                          ))}
                        </div>

                        {result.trustSignals.sponsorshipMarkers.length > 0 && (
                          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs font-mono">
                            <strong className="font-bold">Flagged Commercial PR Keywords:</strong>{' '}
                            {result.trustSignals.sponsorshipMarkers.join(', ')}
                          </div>
                        )}
                      </div>
                    )}

                    {/* TAB: Tax Refund */}
                    {activeTab === 'tax' && (
                      <div className="space-y-4">
                        <div className={`p-5 rounded-2xl border space-y-3 ${isDark ? 'bg-slate-950/30 border-slate-800/80' : 'bg-slate-50 border-slate-200'}`}>
                          <div className="text-xs font-bold font-display uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                            <Plane className="w-4 h-4" /> Incheon Airport (ICN T1 / T2) 3-Step Claim Procedure
                          </div>
                          <ol className="text-xs space-y-2.5 list-decimal list-inside font-light text-slate-300">
                            <li>Ask {result.clinicNormalizedEn} for the <strong>"Medical Tax Refund Certificate"</strong> with official receipt barcode.</li>
                            <li>Scan passport & certificate at Incheon Airport Departure Floor (3F) Kiosks before security.</li>
                            <li>Collect cash (USD / KRW) or card refund past security at <strong>Gate 28 (Terminal 1)</strong> or <strong>Gate 249 (Terminal 2)</strong>.</li>
                          </ol>
                        </div>
                      </div>
                    )}

                    {/* TAB: JSON */}
                    {activeTab === 'json' && (
                      <pre className={`p-4 rounded-2xl border overflow-x-auto text-xs font-mono max-h-[300px] ${
                        isDark ? 'bg-slate-950 border-slate-800 text-cyan-300' : 'bg-slate-900 border-slate-800 text-cyan-300'
                      }`}>
                        {JSON.stringify(result, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className={`p-12 rounded-3xl border text-center flex flex-col items-center justify-center space-y-3 ${
                isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div className="p-4 rounded-2xl bg-cyan-500/10 text-cyan-400">
                  <Sparkles className="w-8 h-8 animate-pulse" />
                </div>
                <h3 className="font-display font-bold text-lg">Awaiting Review Analysis</h3>
                <p className="text-xs text-slate-400 max-w-sm">
                  Select a test case on the left or paste Korean forum text to run normalization and astroturfing forensics.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
