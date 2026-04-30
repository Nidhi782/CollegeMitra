'use client';
import { useState, useEffect, useCallback } from 'react';
import {
  Search, SlidersHorizontal, X, ChevronLeft, ChevronRight,
  GraduationCap, TrendingUp, Building2, Award, Sparkles
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CollegeCard from '../components/CollegeCard';
import CompareBar from '../components/CompareBar';
import { fetchColleges, fetchStates, FALLBACK_COLLEGES, type College, type CollegeFilters } from '../lib/api';
import { showToast } from '../components/Toast';

const COURSES = ['B.Tech', 'M.Tech', 'MBA', 'MCA', 'PhD', 'B.Sc', 'M.Sc'];
const TYPES   = ['Government', 'Private'];

const SUGGESTIONS = ['IIT Bombay', 'NIT Trichy', 'BITS Pilani', 'IIT Delhi', 'VIT Vellore', 'MBA colleges', 'Government colleges'];

const TOP_PICKS = FALLBACK_COLLEGES
  .filter((c) => ['IIT Bombay', 'IIT Delhi', 'IIT Madras', 'BITS Pilani', 'IIIT Hyderabad', 'NIT Trichy'].includes(c.name))
  .sort((a, b) => b.rating - a.rating);

// ─── Skeleton ──────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse">
      <div className="h-1 bg-slate-200" />
      <div className="p-5 space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-slate-200 rounded-xl shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3.5 bg-slate-200 rounded-lg w-3/4" />
            <div className="h-3 bg-slate-200 rounded-lg w-1/2" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[0,1,2].map((i) => <div key={i} className="h-14 bg-slate-100 rounded-xl" />)}
        </div>
        <div className="flex gap-1.5">
          <div className="h-4 bg-slate-100 rounded-md w-14" />
          <div className="h-4 bg-slate-100 rounded-md w-12" />
          <div className="h-4 bg-slate-100 rounded-md w-10" />
        </div>
        <div className="flex gap-2 pt-2">
          <div className="h-9 bg-slate-100 rounded-xl flex-1" />
          <div className="h-9 bg-slate-100 rounded-xl w-24" />
        </div>
      </div>
    </div>
  );
}

// ─── Active filter tag ─────────────────────────────────────────────────────────
function FilterTag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-blue-200">
      {label}
      <button onClick={onRemove} className="hover:text-red-500 transition-colors ml-0.5">
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}

// ─── Stats strip ───────────────────────────────────────────────────────────────
function StatsStrip() {
  const stats = [
    { icon: <GraduationCap className="w-4 h-4 text-blue-500" />,   value: '20+',  label: 'Colleges' },
    { icon: <Building2    className="w-4 h-4 text-emerald-500" />, value: '12',   label: 'States' },
    { icon: <TrendingUp   className="w-4 h-4 text-violet-500" />,  value: '95%',  label: 'Avg Placement' },
    { icon: <Award        className="w-4 h-4 text-amber-500" />,   value: '₹18L', label: 'Avg Package' },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-8 stagger">
      {stats.map(({ icon, value, label }) => (
        <div key={label} className="animate-slide-up bg-white rounded-2xl border border-slate-200 p-4 text-center hover:border-blue-200 hover:shadow-md transition-all duration-200 card-hover">
          <div className="flex justify-center mb-1.5">{icon}</div>
          <p className="text-xl font-extrabold text-slate-900">{value}</p>
          <p className="text-xs text-slate-500 font-medium mt-0.5">{label}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Top picks strip ───────────────────────────────────────────────────────────
function TopPicksStrip({ compareList, onToggle }: { compareList: number[]; onToggle: (id: number, name: string) => void }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-amber-500" />
        <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">Top Ranked</h2>
        <span className="text-xs text-slate-400 font-medium">· By NIRF 2024</span>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 stagger">
        {TOP_PICKS.map((c) => {
          const selected = compareList.includes(c.id);
          return (
            <button
              key={c.id}
              onClick={() => onToggle(c.id, c.name)}
              className={`animate-slide-up text-left bg-white rounded-xl border p-3 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
                selected ? 'border-blue-400 bg-blue-50 ring-2 ring-blue-100' : 'border-slate-200 hover:border-blue-200'
              }`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black mb-2 ${
                c.type === 'Government' ? 'bg-emerald-100 text-emerald-700' : 'bg-violet-100 text-violet-700'
              }`}>
                {c.name.charAt(0)}
              </div>
              <p className="text-[11px] font-bold text-slate-800 leading-tight line-clamp-2">{c.name}</p>
              <div className="flex items-center gap-0.5 mt-1.5">
                <span className="text-amber-400 text-[10px]">★</span>
                <span className="text-[10px] font-bold text-slate-600">{c.rating}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Build active-filter label ─────────────────────────────────────────────────
function activeLabel(search: string, state: string, type: string, course: string, maxFees: string) {
  const parts: string[] = [];
  if (search)  parts.push(`"${search}"`);
  if (state)   parts.push(state);
  if (type)    parts.push(type);
  if (course)  parts.push(course);
  if (maxFees) parts.push(`Under ₹${parseInt(maxFees) / 100000}L`);
  return parts.join(' · ');
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [colleges,    setColleges]    = useState<College[]>([]);
  const [total,       setTotal]       = useState(0);
  const [totalPages,  setTotalPages]  = useState(1);
  const [page,        setPage]        = useState(1);
  const [loading,     setLoading]     = useState(true);

  const [inputValue,     setInputValue]     = useState('');
  const [search,         setSearch]         = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedState,  setSelectedState]  = useState('');
  const [selectedType,   setSelectedType]   = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [maxFees,        setMaxFees]        = useState('');
  const [states,         setStates]         = useState<string[]>([]);
  const [showFilters,    setShowFilters]    = useState(false);
  const [compareList,    setCompareList]    = useState<number[]>([]);

  const filteredSugs = SUGGESTIONS.filter(
    (s) => inputValue.length > 0 && s.toLowerCase().includes(inputValue.toLowerCase())
  );

  useEffect(() => { fetchStates().then(setStates).catch(console.error); }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const f: CollegeFilters = { page, search, state: selectedState, type: selectedType, course: selectedCourse };
      if (maxFees) f.maxFees = maxFees;
      const d = await fetchColleges(f);
      setColleges(d.colleges);
      setTotal(d.total);
      setTotalPages(d.totalPages);
    } finally {
      setLoading(false);
    }
  }, [page, search, selectedState, selectedType, selectedCourse, maxFees]);

  useEffect(() => { const t = setTimeout(load, 300); return () => clearTimeout(t); }, [load]);
  useEffect(() => { setPage(1); }, [search, selectedState, selectedType, selectedCourse, maxFees]);

  const applySearch = (val: string) => { setSearch(val); setInputValue(val); setShowSuggestions(false); };

  const handleToggle = (id: number, name: string) => {
    setCompareList((prev) => {
      if (prev.includes(id)) { showToast.compareRemoved(name); return prev.filter((i) => i !== id); }
      if (prev.length >= 3)  { showToast.compareMax(); return prev; }
      showToast.compareAdded(name);
      return [...prev, id];
    });
  };

  const hasFilters  = !!(search || selectedState || selectedType || selectedCourse || maxFees);
  const filterLabel = hasFilters ? activeLabel(search, selectedState, selectedType, selectedCourse, maxFees) : '';
  const filterCount = [search, selectedState, selectedType, selectedCourse, maxFees].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <div className="relative bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white py-14 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-60 h-60 bg-indigo-500/20 rounded-full blur-2xl" />

        <div className="max-w-7xl mx-auto text-center relative z-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-1.5 rounded-full text-xs font-bold text-blue-100 mb-4">
            🎓 India's College Discovery Platform
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-3 tracking-tight leading-tight">
            Find Your Dream College
          </h1>
          <p className="text-blue-200 mb-8 text-sm sm:text-base max-w-lg mx-auto">
            Compare fees, placements & rankings from 20+ top colleges across India
          </p>

          {/* Search */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => { setInputValue(e.target.value); setShowSuggestions(true); }}
              onKeyDown={(e) => e.key === 'Enter' && applySearch(inputValue)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              placeholder="Search IIT, NIT, B.Tech, MBA..."
              className="w-full pl-10 pr-28 py-3.5 rounded-2xl text-slate-900 text-sm font-semibold shadow-2xl outline-none focus:ring-2 focus:ring-blue-300 placeholder:font-normal placeholder:text-slate-400"
            />
            <button
              onClick={() => applySearch(inputValue)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black px-4 py-2 rounded-xl transition-colors"
            >
              Search
            </button>

            {showSuggestions && filteredSugs.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-20 animate-slide-up">
                {filteredSugs.map((s) => (
                  <button
                    key={s}
                    onMouseDown={() => applySearch(s)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 text-left transition-colors"
                  >
                    <Search className="w-3 h-3 text-slate-400 shrink-0" />
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick chips */}
          <div className="flex flex-wrap justify-center gap-2 mt-5">
            {[
  { label: '🏛 IITs',       action: () => applySearch('IIT') },
  { label: '⚙️ B.Tech',     action: () => setSelectedCourse('B.Tech') },
  { label: '💼 MBA',        action: () => setSelectedCourse('MBA') },
  { label: '🏛 Government', action: () => setSelectedType('Government') },
  { label: '💰 Under ₹2L', action: () => setMaxFees('200000') },
  { label: '⭐ Top Rated',  action: () => applySearch('IIT') },
].map(({ label, action }) => (
  <button key={label} onClick={action}
    className="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-colors">
    {label}
  </button>
))}
          </div>
        </div>
      </div>

      {/* ── BODY ─────────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1">
        <StatsStrip />

        {!hasFilters && (
          <TopPicksStrip compareList={compareList} onToggle={handleToggle} />
        )}

        {/* ── Controls row ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Section title */}
            {hasFilters ? (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-sm font-bold text-slate-700">Results for:</span>
                {search       && <FilterTag label={`"${search}"`}                   onRemove={() => { setSearch(''); setInputValue(''); }} />}
                {selectedState && <FilterTag label={selectedState}                  onRemove={() => setSelectedState('')} />}
                {selectedType  && <FilterTag label={selectedType}                   onRemove={() => setSelectedType('')} />}
                {selectedCourse && <FilterTag label={selectedCourse}                onRemove={() => setSelectedCourse('')} />}
                {maxFees       && <FilterTag label={`Under ₹${parseInt(maxFees)/100000}L`} onRemove={() => setMaxFees('')} />}
              </div>
            ) : (
              <h2 className="text-base font-black text-slate-900">All Colleges</h2>
            )}

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border transition-all ${
                showFilters ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filters
              {filterCount > 0 && (
                <span className="bg-blue-500 text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                  {filterCount}
                </span>
              )}
            </button>
          </div>

          <p className="text-xs font-semibold text-slate-400">
            {loading ? 'Loading...' : `${total} colleges found`}
          </p>
        </div>

        {/* ── Filter panel ── */}
        {showFilters && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-5 grid grid-cols-2 sm:grid-cols-4 gap-4 animate-slide-up">
            {[
              { label: 'State',       value: selectedState,  set: setSelectedState,  opts: states.map((s) => ({ v: s, l: s })),                  ph: 'All States'  },
              { label: 'Type',        value: selectedType,   set: setSelectedType,   opts: TYPES.map((t) => ({ v: t, l: t })),                    ph: 'All Types'   },
              { label: 'Course',      value: selectedCourse, set: setSelectedCourse, opts: COURSES.map((c) => ({ v: c, l: c })),                  ph: 'All Courses' },
              { label: 'Max Fees/yr', value: maxFees,        set: setMaxFees,
                opts: [
                  { v: '100000', l: 'Under ₹1L' }, { v: '200000', l: 'Under ₹2L' },
                  { v: '300000', l: 'Under ₹3L' }, { v: '500000', l: 'Under ₹5L' },
                ], ph: 'Any' },
            ].map(({ label, value, set, opts, ph }) => (
              <div key={label}>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1.5 block">{label}</label>
                <select
                  value={value}
                  onChange={(e) => set(e.target.value)}
                  className="w-full text-sm font-medium border border-slate-200 rounded-xl px-3 py-2 bg-white outline-none focus:border-blue-400 transition-colors"
                >
                  <option value="">{ph}</option>
                  {opts.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            ))}
          </div>
        )}

        {/* ── Grid ── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array(9).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : colleges.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-slate-200 animate-fade-in">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-lg font-extrabold text-slate-700">No colleges match your filters</p>
            <p className="text-sm text-slate-400 mt-1 mb-5 max-w-xs mx-auto">
              Try removing a filter or broadening your search to see more results.
            </p>
            <button
              onClick={() => { setSearch(''); setInputValue(''); setSelectedState(''); setSelectedType(''); setSelectedCourse(''); setMaxFees(''); }}
              className="text-sm font-bold text-blue-700 border border-blue-200 px-5 py-2 rounded-xl hover:bg-blue-50 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
            {colleges.map((c) => (
              <CollegeCard
                key={c.id}
                college={c}
                compareList={compareList}
                onToggleCompare={handleToggle}
              />
            ))}
          </div>
        )}

        {/* ── Pagination ── */}
        {totalPages > 1 && !loading && (
          <div className="flex items-center justify-center gap-2 mt-10 mb-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:border-blue-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${
                  p === page
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:border-blue-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* bottom padding for compare bar */}
        {compareList.length > 0 && <div className="h-20" />}
      </div>

      <Footer />

      <CompareBar
        compareList={compareList}
        onRemove={(id) => {
          const c = FALLBACK_COLLEGES.find((x) => x.id === id);
          if (c) showToast.compareRemoved(c.name);
          setCompareList((prev) => prev.filter((i) => i !== id));
        }}
        onClear={() => { showToast.compareClear(); setCompareList([]); }}
      />
    </div>
  );
}