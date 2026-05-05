'use client';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { FALLBACK_COLLEGES, EXAMS, formatFees, formatPackage, calcCMScore } from '../../lib/api';
import {
  Calculator, ArrowLeft, ChevronDown, Info,
  CheckCircle, AlertCircle, XCircle, Star,
  TrendingUp, IndianRupee, MapPin, Award,
} from 'lucide-react';

interface PredictResult {
  college: typeof FALLBACK_COLLEGES[0];
  tier: 'safe' | 'moderate' | 'reach';
  probability: number;
  cmScore: number;
}

const EXAM_CONFIGS: Record<string, {
  label: string; placeholder: string; maxRank?: number; maxScore?: number;
  stream: string; description: string;
}> = {
  'JEE Main':     { label:'JEE Main Rank (CRL)', placeholder:'e.g. 5000', maxRank:1200000, stream:'Engineering', description:'All India rank from JEE Main result' },
  'JEE Advanced': { label:'JEE Advanced Rank', placeholder:'e.g. 500', maxRank:50000, stream:'Engineering', description:'All India rank from JEE Advanced' },
  'NEET':         { label:'NEET Score (out of 720)', placeholder:'e.g. 620', maxScore:720, stream:'Medical', description:'Your NEET UG score' },
  'CAT':          { label:'CAT Percentile', placeholder:'e.g. 98.5', maxScore:100, stream:'MBA', description:'Your overall CAT percentile' },
  'CLAT':         { label:'CLAT Rank (AIR)', placeholder:'e.g. 1000', maxRank:100000, stream:'Law', description:'All India rank from CLAT' },
  'GATE':         { label:'GATE Score', placeholder:'e.g. 750', maxScore:1000, stream:'Engineering', description:'Your GATE score out of 1000' },
};

const CATEGORIES = ['General', 'OBC', 'SC', 'ST', 'EWS', 'PH'];
const STATES = ['Any State', 'Maharashtra', 'Delhi', 'Tamil Nadu', 'Karnataka', 'Telangana', 'West Bengal', 'Rajasthan', 'Uttar Pradesh', 'Gujarat'];

function predictColleges(exam: string, rankOrScore: number, category: string, state: string): PredictResult[] {
  const config = EXAM_CONFIGS[exam];
  if (!config) return [];

  const eligibleColleges = FALLBACK_COLLEGES.filter(c => {
    if (config.stream && c.stream !== config.stream) return false;
    if (state && state !== 'Any State' && c.state !== state && c.type === 'Government') return false;
    return true;
  });

  const results: PredictResult[] = eligibleColleges.map(college => {
    const cmScore = calcCMScore(college);
    // Tier logic based on college quality vs user rank/score
    const colScore = cmScore;

    let probability = 0;
    let tier: 'safe' | 'moderate' | 'reach' = 'reach';

    // Normalize input
    let normalizedInput = 0;
    if (config.maxRank) {
      normalizedInput = Math.max(0, 100 - (rankOrScore / config.maxRank) * 100);
    } else if (config.maxScore) {
      normalizedInput = (rankOrScore / config.maxScore) * 100;
    }

    // Category boost
    const catBoost = category === 'SC' || category === 'ST' ? 15
      : category === 'OBC' ? 8 : category === 'EWS' ? 5 : 0;

    const effectiveInput = Math.min(100, normalizedInput + catBoost);

    if (effectiveInput >= colScore + 10) {
      tier = 'safe';
      probability = Math.min(95, 75 + (effectiveInput - colScore));
    } else if (effectiveInput >= colScore - 5) {
      tier = 'moderate';
      probability = Math.max(40, 55 + (effectiveInput - colScore) * 2);
    } else {
      tier = 'reach';
      probability = Math.max(10, 30 + (effectiveInput - colScore));
    }

    return { college, tier, probability: Math.round(Math.min(95, Math.max(5, probability))), cmScore };
  });

  return results.sort((a, b) => {
    const tierOrder = { safe: 0, moderate: 1, reach: 2 };
    if (tierOrder[a.tier] !== tierOrder[b.tier]) return tierOrder[a.tier] - tierOrder[b.tier];
    return b.probability - a.probability;
  });
}

const TIER_CONFIG = {
  safe:     { label: 'Safe', icon: <CheckCircle className="w-4 h-4" />, bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', bar: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700' },
  moderate: { label: 'Moderate', icon: <AlertCircle className="w-4 h-4" />, bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', bar: 'bg-amber-500', badge: 'bg-amber-100 text-amber-700' },
  reach:    { label: 'Reach', icon: <XCircle className="w-4 h-4" />, bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', bar: 'bg-red-400', badge: 'bg-red-100 text-red-700' },
};

function PredictorInner() {
  const params   = useSearchParams();
  const initExam = params.get('exam') || 'JEE Main';

  const [exam,         setExam]         = useState(initExam);
  const [rankOrScore,  setRankOrScore]  = useState('');
  const [category,     setCategory]     = useState('General');
  const [state,        setState]        = useState('Any State');
  const [results,      setResults]      = useState<PredictResult[] | null>(null);
  const [activeTab,    setActiveTab]    = useState<'safe' | 'moderate' | 'reach'>('safe');

  const config = EXAM_CONFIGS[exam] || EXAM_CONFIGS['JEE Main'];

  const handlePredict = () => {
    const val = parseFloat(rankOrScore);
    if (!val || val <= 0) return;
    const r = predictColleges(exam, val, category, state);
    setResults(r);
    setActiveTab('safe');
  };

  const filteredResults = results?.filter(r => r.tier === activeTab) || [];
  const counts = results ? {
    safe:     results.filter(r => r.tier === 'safe').length,
    moderate: results.filter(r => r.tier === 'moderate').length,
    reach:    results.filter(r => r.tier === 'reach').length,
  } : null;

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Navbar />

      {/* Header */}
      <div className="mesh-bg py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-xs font-semibold mb-6 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />Back to Colleges
          </Link>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 shrink-0">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white mb-1" style={{fontFamily:'Outfit,sans-serif'}}>College Predictor</h1>
              <p className="text-white/60 text-sm">Enter your rank/score to see your chances — Safe 🟢, Moderate 🟡, or Reach 🔴</p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8 w-full flex-1">

        {/* Form card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 mb-5 flex items-center gap-2">
            <Info className="w-4 h-4 text-indigo-500" />
            Enter Your Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Exam selector */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Select Exam</label>
              <div className="relative">
                <select value={exam} onChange={e => setExam(e.target.value)} className="input-base pr-8 appearance-none">
                  {Object.keys(EXAM_CONFIGS).map(e => <option key={e} value={e}>{e}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">{config.description}</p>
            </div>

            {/* Rank / Score */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">{config.label}</label>
              <input
                type="number"
                value={rankOrScore}
                onChange={e => setRankOrScore(e.target.value)}
                placeholder={config.placeholder}
                className="input-base"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Category</label>
              <div className="relative">
                <select value={category} onChange={e => setCategory(e.target.value)} className="input-base pr-8 appearance-none">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* State */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Home State</label>
              <div className="relative">
                <select value={state} onChange={e => setState(e.target.value)} className="input-base pr-8 appearance-none">
                  {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <button
            onClick={handlePredict}
            disabled={!rankOrScore}
            className="mt-6 btn-primary w-full justify-center py-3 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Calculator className="w-4 h-4" />
            Predict My Colleges
          </button>
        </div>

        {/* Results */}
        {results && counts && (
          <div className="animate-fade-up">
            {/* Summary row */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {(['safe', 'moderate', 'reach'] as const).map(tier => {
                const cfg = TIER_CONFIG[tier];
                return (
                  <div key={tier} className={`${cfg.bg} ${cfg.border} border rounded-2xl p-4 text-center cursor-pointer transition-all ${activeTab === tier ? 'ring-2 ring-offset-2 ' + (tier === 'safe' ? 'ring-emerald-400' : tier === 'moderate' ? 'ring-amber-400' : 'ring-red-400') : ''}`}
                    onClick={() => setActiveTab(tier)}>
                    <div className={`flex justify-center mb-1 ${cfg.text}`}>{cfg.icon}</div>
                    <p className={`text-2xl font-black ${cfg.text}`}>{counts[tier]}</p>
                    <p className="text-xs text-slate-600 font-semibold mt-0.5">{cfg.label} Colleges</p>
                  </div>
                );
              })}
            </div>

            {/* Tab legend */}
            <div className="flex items-center gap-3 mb-4 text-xs text-slate-500">
              <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-emerald-500" />Safe = 70%+ chance</span>
              <span className="flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5 text-amber-500" />Moderate = 40-70%</span>
              <span className="flex items-center gap-1"><XCircle className="w-3.5 h-3.5 text-red-400" />Reach = under 40%</span>
            </div>

            {/* Tab buttons */}
            <div className="flex gap-2 mb-5">
              {(['safe', 'moderate', 'reach'] as const).map(tier => {
                const cfg = TIER_CONFIG[tier];
                return (
                  <button key={tier} onClick={() => setActiveTab(tier)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      activeTab === tier ? `${cfg.badge} shadow-sm` : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}>
                    {cfg.icon}{cfg.label} ({counts[tier]})
                  </button>
                );
              })}
            </div>

            {/* Result cards */}
            {filteredResults.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
                <p className="text-3xl mb-2">🎯</p>
                <p className="text-sm font-semibold text-slate-600">No {activeTab} colleges found for your profile</p>
                <p className="text-xs text-slate-400 mt-1">Try checking the other tiers</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredResults.map(({ college, tier, probability, cmScore }) => {
                  const cfg = TIER_CONFIG[tier];
                  return (
                    <div key={college.id} className={`bg-white rounded-2xl border ${cfg.border} p-4 flex items-start gap-4 hover:shadow-md transition-all`}>
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-sm font-black text-slate-600 shrink-0">
                        {college.name.charAt(0)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <Link href={`/colleges/${college.id}`} className="font-bold text-slate-900 text-sm hover:text-indigo-700 transition-colors line-clamp-1">
                            {college.name}
                          </Link>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 ${cfg.badge}`}>
                            {cfg.label}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{college.city}</span>
                          <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400 fill-amber-400" />{college.rating}</span>
                          <span className="flex items-center gap-1"><IndianRupee className="w-3 h-3 text-blue-400" />{formatFees(college.fees)}</span>
                          <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3 text-emerald-400" />{college.placementRate}%</span>
                        </div>

                        {/* Probability bar */}
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full ${cfg.bar} rounded-full transition-all`} style={{width:`${probability}%`}} />
                          </div>
                          <span className={`text-xs font-black ${cfg.text} shrink-0`}>{probability}%</span>
                        </div>
                      </div>

                      <Link href={`/colleges/${college.id}`} className="btn-ghost text-xs px-3 py-1.5 shrink-0">
                        View →
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default function PredictorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>}>
      <PredictorInner />
    </Suspense>
  );
}
