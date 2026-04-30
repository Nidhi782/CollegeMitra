'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, X, ArrowLeft, Star, IndianRupee, TrendingUp, Users, Award, BookOpen, MapPin, Building2 } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { fetchColleges, fetchCollege, type College, formatFees, formatPackage } from '../../lib/api';

// ─── inner component (uses useSearchParams) ─────────────────────────────────
function CompareInner() {
  const searchParams = useSearchParams();

  const [compareIds, setCompareIds] = useState<number[]>(() => {
    const raw = searchParams.get('ids');
    return raw ? raw.split(',').map(Number).filter(Boolean).slice(0, 3) : [];
  });
  const [colleges,    setColleges]    = useState<College[]>([]);
  const [allColleges, setAllColleges] = useState<College[]>([]);
  const [search,      setSearch]      = useState('');
  const [showSearch,  setShowSearch]  = useState(false);
  const [loading,     setLoading]     = useState(false);

  // load selected colleges
  useEffect(() => {
    if (compareIds.length === 0) { setColleges([]); return; }
    setLoading(true);
    Promise.all(compareIds.map((id) => fetchCollege(id)))
      .then(setColleges)
      .finally(() => setLoading(false));
  }, [compareIds]);

  // load all for picker
  useEffect(() => {
    fetchColleges({ limit: '100' } as any).then((d) => setAllColleges(d.colleges));
  }, []);

  const suggestions = search.trim()
    ? allColleges.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) && !compareIds.includes(c.id)).slice(0, 5)
    : [];

  const add    = (id: number) => { if (compareIds.length < 3) { setCompareIds((p) => [...p, id]); setSearch(''); setShowSearch(false); } };
  const remove = (id: number) => setCompareIds((p) => p.filter((i) => i !== id));

  // ─── comparison rows ─────────────────────────────────────────────────────
  const ROWS: { label: string; icon: React.ReactNode; get: (c: College) => string; higher?: boolean; lower?: boolean }[] = [
    { label: 'Location',      icon: <MapPin className="w-3.5 h-3.5 text-slate-400" />,       get: (c) => c.location },
    { label: 'Type',          icon: <Building2 className="w-3.5 h-3.5 text-slate-400" />,    get: (c) => c.type },
    { label: 'Established',   icon: <span className="text-xs">📅</span>,                      get: (c) => String(c.established) },
    { label: 'Accreditation', icon: <span className="text-xs">🎓</span>,                      get: (c) => c.accreditation },
    { label: 'Rating',        icon: <Star className="w-3.5 h-3.5 text-amber-500" />,         get: (c) => `${c.rating}/5`,                     higher: true },
    { label: 'Annual Fees',   icon: <IndianRupee className="w-3.5 h-3.5 text-blue-500" />,   get: (c) => formatFees(c.fees),                  lower: true },
    { label: 'Placement %',   icon: <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />, get: (c) => `${c.placementRate}%`,               higher: true },
    { label: 'Avg Package',   icon: <Award className="w-3.5 h-3.5 text-violet-500" />,       get: (c) => formatPackage(c.avgPackage),         higher: true },
    { label: 'Students',      icon: <Users className="w-3.5 h-3.5 text-orange-500" />,       get: (c) => c.totalStudents.toLocaleString() },
    { label: 'Courses',       icon: <BookOpen className="w-3.5 h-3.5 text-pink-500" />,      get: (c) => c.courses.slice(0, 3).join(', ') + (c.courses.length > 3 ? ` +${c.courses.length - 3}` : '') },
  ];

  const getBest = (key: keyof College): number | null => {
    if (colleges.length < 2) return null;
    return Math.max(...colleges.map((c) => Number(c[key])));
  };
  const getLowest = (key: keyof College): number | null => {
    if (colleges.length < 2) return null;
    return Math.min(...colleges.map((c) => Number(c[key])));
  };

  const isBest   = (c: College, row: typeof ROWS[0]) => row.higher && getBest('rating')   !== null && c.rating       === getBest('rating')      ||
                                                          row.higher && getBest('placementRate') !== null && c.placementRate === getBest('placementRate') ||
                                                          row.higher && getBest('avgPackage')    !== null && c.avgPackage    === getBest('avgPackage');
  const isCheap  = (c: College, row: typeof ROWS[0]) => row.lower  && getLowest('fees')   !== null && c.fees         === getLowest('fees');

  const cellHighlight = (c: College, row: typeof ROWS[0]) => {
    if (row.label === 'Rating'      && colleges.length > 1 && c.rating       === getBest('rating'))       return 'bg-emerald-50 text-emerald-700';
    if (row.label === 'Placement %' && colleges.length > 1 && c.placementRate === getBest('placementRate')) return 'bg-emerald-50 text-emerald-700';
    if (row.label === 'Avg Package' && colleges.length > 1 && c.avgPackage    === getBest('avgPackage'))    return 'bg-emerald-50 text-emerald-700';
    if (row.label === 'Annual Fees' && colleges.length > 1 && c.fees          === getLowest('fees'))        return 'bg-blue-50 text-blue-700';
    return 'text-slate-800';
  };

  const cols = colleges.length || 1;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full animate-fade-in">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-700 mb-6 transition-colors group">
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to Colleges
        </Link>

        {/* header */}
        <div className="flex items-start justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Compare Colleges</h1>
            <p className="text-sm text-slate-500 mt-0.5">Select 2–3 colleges to compare side by side</p>
          </div>
          {compareIds.length < 3 && (
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="flex items-center gap-2 text-xs font-black bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl transition-colors shadow-lg shadow-blue-200"
            >
              <Search className="w-3.5 h-3.5" />
              Add College
            </button>
          )}
        </div>

        {/* search picker */}
        {showSearch && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 animate-slide-up">
            <input
              autoFocus
              type="text"
              placeholder="Type college name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-sm font-medium border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-400 transition-colors"
            />
            {suggestions.length > 0 && (
              <div className="mt-2 border border-slate-100 rounded-xl overflow-hidden">
                {suggestions.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => add(c.id)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 text-left transition-colors border-b border-slate-50 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-bold text-slate-800">{c.name}</p>
                      <p className="text-xs text-slate-400">{c.location} · {c.type}</p>
                    </div>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">Add +</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* empty state */}
        {compareIds.length === 0 && (
          <div className="text-center py-24 bg-white rounded-2xl border border-slate-200">
            <p className="text-5xl mb-4">⚖️</p>
            <p className="text-lg font-extrabold text-slate-700">No colleges selected</p>
            <p className="text-sm text-slate-400 mt-1 mb-5">Add colleges using the button above, or select them from the listing page</p>
            <Link href="/" className="text-sm font-bold text-blue-700 border border-blue-200 px-5 py-2.5 rounded-xl hover:bg-blue-50 transition-colors">
              Browse Colleges →
            </Link>
          </div>
        )}

        {/* comparison table */}
        {colleges.length > 0 && !loading && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            {/* Legend */}
            {colleges.length >= 2 && (
              <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-center gap-4 text-[10px] font-semibold text-slate-500">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-100 border border-emerald-300 inline-block" /> Best value</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-blue-100 border border-blue-300 inline-block" /> Lowest fees</span>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    {/* label column */}
                    <th className="bg-slate-50 border-b border-r border-slate-100 p-4 text-left w-36 text-xs font-black text-slate-400 uppercase tracking-wider">
                      Feature
                    </th>
                    {colleges.map((c) => (
                      <th key={c.id} className="bg-slate-50 border-b border-r last:border-r-0 border-slate-100 p-4 text-left min-w-[180px]">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <Link href={`/colleges/${c.id}`} className="text-sm font-extrabold text-slate-900 hover:text-blue-700 transition-colors block leading-tight">
                              {c.name}
                            </Link>
                            <p className="text-[10px] text-slate-400 font-medium mt-0.5">{c.city} · {c.type}</p>
                          </div>
                          <button
                            onClick={() => remove(c.id)}
                            className="text-slate-300 hover:text-red-500 transition-colors shrink-0 mt-0.5"
                            title="Remove"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </th>
                    ))}
                    {/* empty add-college slots */}
                    {compareIds.length < 3 && Array(3 - compareIds.length).fill(0).map((_, i) => (
                      <th key={`empty-${i}`} className="bg-slate-50/50 border-b border-r last:border-r-0 border-slate-100 p-4 min-w-[160px]">
                        <button
                          onClick={() => setShowSearch(true)}
                          className="w-full h-12 border-2 border-dashed border-slate-200 hover:border-blue-300 rounded-xl text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors"
                        >
                          + Add College
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {ROWS.map((row, rowIdx) => (
                    <tr key={row.label} className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}>
                      {/* row label */}
                      <td className="border-r border-b border-slate-100 px-4 py-3">
                        <div className="flex items-center gap-2">
                          {row.icon}
                          <span className="text-xs font-bold text-slate-500">{row.label}</span>
                        </div>
                      </td>
                      {/* values */}
                      {colleges.map((c) => {
                        const highlight = cellHighlight(c, row);
                        const isHighlighted = highlight.includes('emerald') || highlight.includes('blue');
                        return (
                          <td key={c.id} className={`border-r last:border-r-0 border-b border-slate-100 px-4 py-3 ${isHighlighted ? highlight.split(' ')[0] : ''}`}>
                            <span className={`text-sm font-bold ${highlight}`}>
                              {row.get(c)}
                              {isHighlighted && <span className="ml-1.5 text-[10px] font-black">✓</span>}
                            </span>
                          </td>
                        );
                      })}
                      {/* empty cells */}
                      {compareIds.length < 3 && Array(3 - compareIds.length).fill(0).map((_, i) => (
                        <td key={`empty-${i}`} className="border-r last:border-r-0 border-b border-slate-100 px-4 py-3">
                          <span className="text-slate-200 text-sm">—</span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* footer action row */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
              <div className="w-36 shrink-0" />
              {colleges.map((c) => (
                <div key={c.id} className="flex-1 min-w-[180px]">
                  <Link
                    href={`/colleges/${c.id}`}
                    className="block text-center text-xs font-black text-blue-700 border border-blue-200 rounded-xl py-2.5 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
                  >
                    View Full Details →
                  </Link>
                </div>
              ))}
              {compareIds.length < 3 && Array(3 - compareIds.length).fill(0).map((_, i) => (
                <div key={i} className="flex-1 min-w-[160px]" />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

// ─── Page wrapper with Suspense (required for useSearchParams in Next.js 14) ──
export default function ComparePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    }>
      <CompareInner />
    </Suspense>
  );
}