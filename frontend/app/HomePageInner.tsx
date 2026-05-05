'use client';
import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CollegeCard from '../components/CollegeCard';
import CompareBar from '../components/CompareBar';
import MitraAI from '../components/MitraAI';
import { showToast } from '@/components/Toast';

import {
  fetchColleges, fetchStates, type College, type CollegeFilters,
  EXAMS,
} from '../lib/api';
import {
  Search, SlidersHorizontal, ChevronDown, X,
  Cpu, Briefcase, Stethoscope, Scale, Palette, BookOpen,
  TrendingUp, Star, Zap, Calculator, MapPin, Building2,
  FlameIcon,
} from 'lucide-react';

const STREAM_ICONS: Record<string, React.ReactNode> = {
  Engineering: <Cpu className="w-4 h-4" />,
  MBA:         <Briefcase className="w-4 h-4" />,
  Medical:     <Stethoscope className="w-4 h-4" />,
  Law:         <Scale className="w-4 h-4" />,
  Design:      <Palette className="w-4 h-4" />,
  Science:     <BookOpen className="w-4 h-4" />,
};

const SORT_OPTIONS = [
  { value:'rating',    label:'Top Rated' },
  { value:'placement', label:'Best Placement' },
  { value:'package',   label:'Highest Package' },
  { value:'fees_asc',  label:'Fees: Low → High' },
  { value:'fees_desc', label:'Fees: High → Low' },
];

const FEE_RANGES = [
  { label:'Under ₹1L',   min:'0',       max:'100000'  },
  { label:'₹1L – ₹5L',  min:'100000',  max:'500000'  },
  { label:'₹5L – ₹15L', min:'500000',  max:'1500000' },
  { label:'Above ₹15L', min:'1500000', max:'99999999' },
];

const STREAM_TOOLS: Record<string, { label:string; desc:string; href:string; icon:React.ReactNode; color:string }[]> = {
  Engineering: [
    { label:'College Predictor', desc:'JEE rank → colleges',   href:'/predictor?exam=JEE Main', icon:<Calculator className="w-5 h-5"/>, color:'bg-blue-50 text-blue-600' },
    { label:'Top IITs & NITs',   desc:'Ranked engineering',    href:'/?stream=Engineering&type=Government', icon:<Star className="w-5 h-5"/>, color:'bg-indigo-50 text-indigo-600' },
    { label:'B.Tech Colleges',   desc:'2026 admissions open',  href:'/?stream=Engineering&course=B.Tech', icon:<Cpu className="w-5 h-5"/>, color:'bg-cyan-50 text-cyan-600' },
    { label:'Placement Data',    desc:'Packages & recruiters', href:'/?stream=Engineering&sort=package', icon:<TrendingUp className="w-5 h-5"/>, color:'bg-emerald-50 text-emerald-600' },
  ],
  MBA: [
    { label:'CAT Predictor', desc:'CAT score → IIMs',   href:'/predictor?exam=CAT', icon:<Calculator className="w-5 h-5"/>, color:'bg-violet-50 text-violet-600' },
    { label:'Top IIMs',      desc:'Best B-schools',     href:'/?stream=MBA&type=Government', icon:<Star className="w-5 h-5"/>, color:'bg-purple-50 text-purple-600' },
    { label:'MBA Colleges',  desc:'All programs',       href:'/?stream=MBA', icon:<Briefcase className="w-5 h-5"/>, color:'bg-fuchsia-50 text-fuchsia-600' },
    { label:'Salary Data',   desc:'Post-MBA packages',  href:'/?stream=MBA&sort=package', icon:<TrendingUp className="w-5 h-5"/>, color:'bg-pink-50 text-pink-600' },
  ],
  Medical: [
    { label:'NEET Predictor', desc:'Score → medical colleges', href:'/predictor?exam=NEET', icon:<Calculator className="w-5 h-5"/>, color:'bg-rose-50 text-rose-600' },
    { label:'Top AIIMS',      desc:'Premier medical',          href:'/?stream=Medical&type=Government', icon:<Star className="w-5 h-5"/>, color:'bg-red-50 text-red-600' },
    { label:'MBBS Colleges',  desc:'2026 admissions',          href:'/?stream=Medical&course=MBBS', icon:<Stethoscope className="w-5 h-5"/>, color:'bg-orange-50 text-orange-600' },
    { label:'State Quota',    desc:'85% state seats',          href:'/?stream=Medical', icon:<MapPin className="w-5 h-5"/>, color:'bg-amber-50 text-amber-600' },
  ],
  Law: [
    { label:'CLAT Predictor', desc:'Rank → NLUs',          href:'/predictor?exam=CLAT', icon:<Calculator className="w-5 h-5"/>, color:'bg-amber-50 text-amber-600' },
    { label:'Top NLUs',       desc:'Best law schools',      href:'/?stream=Law&type=Government', icon:<Star className="w-5 h-5"/>, color:'bg-yellow-50 text-yellow-600' },
    { label:'LLB Colleges',   desc:'5-yr & 3-yr programs',  href:'/?stream=Law&course=LLB', icon:<Scale className="w-5 h-5"/>, color:'bg-lime-50 text-lime-600' },
    { label:'Private Law',    desc:'Top private colleges',  href:'/?stream=Law&type=Private', icon:<Building2 className="w-5 h-5"/>, color:'bg-green-50 text-green-600' },
  ],
};

export default function HomePageInner() {
  const params = useSearchParams();
  const [colleges,    setColleges]    = useState<College[]>([]);
  const [total,       setTotal]       = useState(0);
  const [totalPages,  setTotalPages]  = useState(1);
  const [states,      setStates]      = useState<string[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [compareList, setCompareList] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [activeStream,setActiveStream]= useState('Engineering');

  const [filters, setFilters] = useState<CollegeFilters>({
    search: params.get('search') || '',
    state:  params.get('state')  || '',
    type:   params.get('type')   || '',
    stream: params.get('stream') || '',
    sort:   params.get('sort')   || 'rating',
    page:   1,
    limit:  '12',
  });

  const applyFilters = useCallback((updates: Partial<CollegeFilters>) => {
    setFilters(prev => ({ ...prev, ...updates }));
  }, []);

  useEffect(() => { fetchStates().then(setStates); }, []);

  useEffect(() => {
    setLoading(true);
    fetchColleges(filters)
      .then(d => { setColleges(d.colleges); setTotal(d.total); setTotalPages(d.totalPages); })
      .finally(() => setLoading(false));
  }, [filters]);

  const handleToggleCompare = (id: number, name: string) => {
  setCompareList((prev) => {
    if (prev.includes(id)) { showToast.compareRemoved(name); return prev.filter((i) => i !== id); }
    if (prev.length >= 3)  { showToast.compareMax(); return prev; }
    showToast.compareAdded(name);
    return [...prev, id];
  });
};

  const clearFilters = () => setFilters({ search:'', state:'', type:'', stream:'', sort:'rating', page:1, limit:'12' });
  const activeCount  = [filters.state, filters.type, filters.stream, filters.maxFees].filter(Boolean).length;

  const STATS = [
    { val:'20,000+', label:'Colleges' },
    { val:'1,200+',  label:'Exams' },
    { val:'500+',    label:'Courses' },
    { val:'50L+',    label:'Students Helped' },
  ];

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Navbar />

      {/* ── HERO ── */}
      <section className="mesh-bg py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-cyan-500/15 blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 glass text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-6 animate-fade-up">
            <Zap className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            India's smartest college discovery platform
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 animate-fade-up leading-tight" style={{fontFamily:'Outfit,sans-serif',animationDelay:'0.1s'}}>
            Find Your{' '}
            <span style={{background:'linear-gradient(135deg,#67e8f9,#818cf8)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
              Dream College
            </span>
            <br />with Confidence
          </h1>
          <p className="text-slate-400 text-lg mb-8 animate-fade-up max-w-xl mx-auto" style={{animationDelay:'0.2s'}}>
            Compare colleges, predict your admission chances, and get personalized guidance — all in one place.
          </p>
          <form onSubmit={e => { e.preventDefault(); }} className="flex gap-2 bg-white rounded-2xl p-2 shadow-2xl shadow-black/30 animate-fade-up max-w-2xl mx-auto mb-4" style={{animationDelay:'0.3s'}}>
            <div className="flex-1 flex items-center gap-3 px-3">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input type="text" value={filters.search || ''} onChange={e => applyFilters({ search:e.target.value, page:1 })}
                placeholder="Search colleges, courses, exams..." className="flex-1 outline-none text-slate-800 text-sm font-medium placeholder:text-slate-400 bg-transparent" />
            </div>
            <button type="submit" className="btn-primary px-6 py-2.5 text-sm shrink-0">Search</button>
          </form>
          <div className="flex flex-wrap justify-center gap-2 mb-10 animate-fade-up" style={{animationDelay:'0.4s'}}>
            {['IIT Bombay','AIIMS Delhi','IIM Ahmedabad','NIT Trichy','BITS Pilani'].map(tag => (
              <button key={tag} onClick={() => applyFilters({ search:tag, page:1 })}
                className="glass text-slate-300 text-xs font-medium px-3 py-1.5 rounded-full hover:bg-white/15 transition-colors">{tag}</button>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-4 animate-fade-up" style={{animationDelay:'0.5s'}}>
            {STATS.map(({ val, label }) => (
              <div key={label} className="glass rounded-2xl p-4">
                <p className="text-2xl font-black text-white mb-0.5" style={{fontFamily:'Outfit,sans-serif'}}>{val}</p>
                <p className="text-xs text-slate-400 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Exam ticker ── */}
      <div className="bg-indigo-600 py-2.5 overflow-hidden">
        <div className="flex items-center gap-3 px-4">
          <span className="flex items-center gap-1.5 text-white text-xs font-black uppercase tracking-wider shrink-0 bg-indigo-700 px-2.5 py-1 rounded-full">
            <FlameIcon className="w-3 h-3 text-orange-300 fill-orange-300" />Trending Exams
          </span>
          <div className="ticker-wrap flex-1">
            <div className="ticker-inner">
              {[...EXAMS, ...EXAMS].map((e, i) => (
                <span key={i} className="inline-flex items-center gap-2 mx-4 text-white/90 text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />{e.name}
                  <span className="text-indigo-300">· {e.date}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Stream tools ── */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-1 mb-6 overflow-x-auto scrollbar-none">
            {Object.keys(STREAM_TOOLS).map(s => (
              <button key={s} onClick={() => { setActiveStream(s); applyFilters({ stream:s, page:1 }); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                  activeStream === s ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'text-slate-600 hover:bg-slate-100'
                }`}>
                {STREAM_ICONS[s]}{s}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {(STREAM_TOOLS[activeStream] || STREAM_TOOLS.Engineering).map(t => (
              <a key={t.label} href={t.href}
                className="flex items-start gap-3 p-4 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all group">
                <div className={`p-2.5 rounded-xl ${t.color} group-hover:scale-110 transition-transform shrink-0`}>{t.icon}</div>
                <div>
                  <p className="text-sm font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">{t.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{t.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Listing ── */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <div>
            <h2 className="text-xl font-black text-slate-900" style={{fontFamily:'Outfit,sans-serif'}}>
              {filters.stream ? `${filters.stream} Colleges` : 'All Colleges'}
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {loading ? 'Loading…' : `${total.toLocaleString()} colleges found`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <select value={filters.sort || 'rating'} onChange={e => applyFilters({ sort:e.target.value, page:1 })}
                className="input-base text-xs pl-3 pr-8 py-2 appearance-none cursor-pointer">
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>
            <button onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl border transition-all ${
                showFilters || activeCount > 0 ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
              }`}>
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filters {activeCount > 0 && <span className="bg-white text-indigo-700 rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-black">{activeCount}</span>}
            </button>
          </div>
        </div>

        {/* Search in listing */}
        <div className="relative mb-6">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" value={filters.search || ''} onChange={e => applyFilters({ search:e.target.value, page:1 })}
            placeholder="Search by college name..." className="input-base pl-10" />
          {filters.search && (
            <button onClick={() => applyFilters({ search:'', page:1 })} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex gap-6">
          {/* Filters sidebar */}
          {showFilters && (
            <aside className="w-56 shrink-0 animate-slide-up">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-black text-slate-900">Filters</p>
                  {activeCount > 0 && (
                    <button onClick={clearFilters} className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1">
                      <X className="w-3 h-3" />Clear ({activeCount})
                    </button>
                  )}
                </div>

                <div className="space-y-5">
                  {/* Type */}
                  <div>
                    <p className="text-xs font-black text-slate-600 uppercase tracking-wider mb-2">College Type</p>
                    {['', 'Government', 'Private'].map(t => (
                      <label key={t} className="flex items-center gap-2 mb-1.5 cursor-pointer">
                        <input type="radio" name="type" checked={filters.type === t}
                          onChange={() => applyFilters({ type: t || undefined, page:1 })} className="accent-indigo-600 w-3.5 h-3.5" />
                        <span className="text-sm text-slate-600">{t || 'All Types'}</span>
                      </label>
                    ))}
                  </div>
                  {/* Stream */}
                  <div>
                    <p className="text-xs font-black text-slate-600 uppercase tracking-wider mb-2">Stream</p>
                    {['', 'Engineering','MBA','Medical','Law','Design','Science'].map(s => (
                      <label key={s} className="flex items-center gap-2 mb-1.5 cursor-pointer">
                        <input type="radio" name="stream" checked={filters.stream === s}
                          onChange={() => applyFilters({ stream: s || undefined, page:1 })} className="accent-indigo-600 w-3.5 h-3.5" />
                        <span className="text-sm text-slate-600">{s || 'All Streams'}</span>
                      </label>
                    ))}
                  </div>
                  {/* State */}
                  <div>
                    <p className="text-xs font-black text-slate-600 uppercase tracking-wider mb-2">State</p>
                    <select value={filters.state || ''} onChange={e => applyFilters({ state: e.target.value || undefined, page:1 })}
                      className="input-base text-xs">
                      <option value="">All States</option>
                      {states.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  {/* Fees */}
                  <div>
                    <p className="text-xs font-black text-slate-600 uppercase tracking-wider mb-2">Annual Fees</p>
                    <label className="flex items-center gap-2 mb-1.5 cursor-pointer">
                      <input type="radio" name="fees" checked={!filters.maxFees}
                        onChange={() => applyFilters({ maxFees:undefined, minFees:undefined, page:1 })} className="accent-indigo-600 w-3.5 h-3.5" />
                      <span className="text-sm text-slate-600">Any Budget</span>
                    </label>
                    {FEE_RANGES.map(r => (
                      <label key={r.label} className="flex items-center gap-2 mb-1.5 cursor-pointer">
                        <input type="radio" name="fees" checked={filters.maxFees === r.max}
                          onChange={() => applyFilters({ minFees:r.min, maxFees:r.max, page:1 })} className="accent-indigo-600 w-3.5 h-3.5" />
                        <span className="text-sm text-slate-600">{r.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          )}

          {/* Grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
                {Array(9).fill(0).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 animate-slide-up">
                    <div className="flex gap-3"><div className="skeleton w-10 h-10 rounded-xl" /><div className="flex-1 space-y-2"><div className="skeleton h-4 rounded-lg w-3/4" /><div className="skeleton h-3 rounded-lg w-1/2" /></div></div>
                    <div className="grid grid-cols-2 gap-2">{[0,1,2,3].map(j => <div key={j} className="skeleton h-14 rounded-xl" />)}</div>
                    <div className="skeleton h-9 rounded-xl" />
                  </div>
                ))}
              </div>
            ) : colleges.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-2xl border border-slate-200">
                <p className="text-5xl mb-4">🔍</p>
                <p className="text-lg font-bold text-slate-700">No colleges found</p>
                <p className="text-sm text-slate-400 mt-1 mb-4">Try adjusting your filters</p>
                <button onClick={clearFilters} className="btn-primary mx-auto">Clear filters</button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger animate-fade-in">
                  {colleges.map(c => (
                    <CollegeCard key={c.id} college={c} compareList={compareList} onToggleCompare={(id) => handleToggleCompare(id, c.name)} />
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-3 mt-8">
                    <button disabled={filters.page === 1} onClick={() => applyFilters({ page:(filters.page||1)-1 })}
                      className="btn-secondary py-2 px-4 text-xs disabled:opacity-40">← Prev</button>
                    <span className="text-sm text-slate-600 font-medium">Page {filters.page} of {totalPages}</span>
                    <button disabled={filters.page === totalPages} onClick={() => applyFilters({ page:(filters.page||1)+1 })}
                      className="btn-secondary py-2 px-4 text-xs disabled:opacity-40">Next →</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <CompareBar compareList={compareList} onRemove={id => setCompareList(p => p.filter(i => i !== id))} onClear={() => setCompareList([])} />
      <MitraAI />
      <Footer />
    </div>
  );
}
