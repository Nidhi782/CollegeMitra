'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  MapPin, Star, IndianRupee, TrendingUp, Users, Building2,
  Award, ArrowLeft, BookOpen, Briefcase, GitCompare, Share2
} from 'lucide-react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { fetchCollege, type College, formatFees, formatPackage } from '../../../lib/api';
import { showToast } from '../../../components/Toast';


const REVIEWS = [
  { name: 'Rahul Sharma', year: '2023', rating: 5, text: 'Exceptional faculty and world-class campus. The placement cell is incredibly proactive and helped me land at Google.' },
  { name: 'Priya Mehta',  year: '2022', rating: 4, text: 'Great exposure to industry through internships and live projects. Competitive environment that pushes you to grow.' },
  { name: 'Ankit Kumar',  year: '2024', rating: 4, text: 'Research facilities are top-notch. Professors with industry backgrounds make all the difference.' },
];

export default function CollegeDetailPage() {
  const { id }     = useParams<{ id: string }>();
  const router     = useRouter();
  const [college, setCollege]   = useState<College | null>(null);
  const [loading, setLoading]   = useState(true);
  const [tab,     setTab]       = useState<'courses' | 'placements' | 'reviews'>('courses');

  useEffect(() => {
    fetchCollege(Number(id))
      .then(setCollege)
      .catch(() => router.push('/'))
      .finally(() => setLoading(false));
  }, [id, router]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    console.log('Link copied!');
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-10 w-full">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-slate-200 rounded-lg w-24" />
          <div className="h-10 bg-slate-200 rounded-2xl w-2/3" />
          <div className="h-56 bg-slate-200 rounded-2xl" />
          <div className="grid grid-cols-4 gap-3">
            {[0,1,2,3].map((i) => <div key={i} className="h-24 bg-slate-200 rounded-2xl" />)}
          </div>
        </div>
      </div>
    </div>
  );

  if (!college) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full animate-fade-in">
        {/* Back */}
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-700 mb-6 transition-colors group">
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to Colleges
        </Link>

        {/* ── Header card ── */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-5">
          <div className={`h-2 ${college.type === 'Government' ? 'bg-gradient-to-r from-emerald-400 to-teal-500' : 'bg-gradient-to-r from-violet-400 to-purple-500'}`} />
          <div className="p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black shrink-0 ${
                  college.type === 'Government' ? 'bg-emerald-50 text-emerald-700' : 'bg-violet-50 text-violet-700'
                }`}>
                  {college.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${
                      college.type === 'Government' ? 'bg-emerald-50 text-emerald-700' : 'bg-violet-50 text-violet-700'
                    }`}>{college.type.toUpperCase()}</span>
                    <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-1 rounded-lg">{college.accreditation}</span>
                    <span className="text-[10px] text-slate-400 font-medium">Est. {college.established}</span>
                  </div>
                  <h1 className="text-2xl font-extrabold text-slate-900 leading-tight">{college.name}</h1>
                  <div className="flex items-center gap-1.5 mt-1 text-slate-500 text-xs font-medium">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    {college.location}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={handleShare}
                  className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-blue-700 hover:border-blue-200 transition-all"
                  title="Copy link"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <Link
                  href={`/compare?ids=${college.id}`}
                  className="flex items-center gap-1.5 text-xs font-bold text-blue-700 border border-blue-200 px-3 py-2 rounded-xl hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
                >
                  <GitCompare className="w-3.5 h-3.5" />
                  Compare
                </Link>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed mb-5">{college.description}</p>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: <Star className="w-4 h-4 text-amber-500 fill-amber-400" />, label: 'Rating',     value: `${college.rating}/5`,               bg: 'bg-amber-50'   },
                { icon: <IndianRupee className="w-4 h-4 text-blue-600" />,          label: 'Annual Fees', value: formatFees(college.fees),             bg: 'bg-blue-50'    },
                { icon: <TrendingUp className="w-4 h-4 text-emerald-600" />,        label: 'Placement',   value: `${college.placementRate}%`,           bg: 'bg-emerald-50' },
                { icon: <Users className="w-4 h-4 text-violet-600" />,              label: 'Students',    value: college.totalStudents.toLocaleString(), bg: 'bg-violet-50'  },
              ].map(({ icon, label, value, bg }) => (
                <div key={label} className={`${bg} rounded-xl p-3.5 text-center`}>
                  <div className="flex justify-center mb-1">{icon}</div>
                  <p className="font-extrabold text-slate-900 text-sm">{value}</p>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Info row ── */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { icon: <Building2 className="w-4 h-4 text-blue-600" />,   label: 'Established',  value: String(college.established) },
            { icon: <Award className="w-4 h-4 text-amber-500" />,      label: 'Avg Package',   value: formatPackage(college.avgPackage) },
            { icon: <BookOpen className="w-4 h-4 text-emerald-600" />, label: 'Programs',      value: `${college.courses.length} offered` },
          ].map(({ icon, label, value }) => (
            <div key={label} className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-3">
              <div className="p-2 bg-slate-50 rounded-xl shrink-0">{icon}</div>
              <div>
                <p className="text-[10px] text-slate-400 font-semibold">{label}</p>
                <p className="font-extrabold text-slate-900 text-sm">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="flex border-b border-slate-100">
            {(['courses', 'placements', 'reviews'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-3.5 text-xs font-black uppercase tracking-wider capitalize transition-all ${
                  tab === t
                    ? 'text-blue-700 border-b-2 border-blue-600 bg-blue-50/50'
                    : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="p-6 animate-fade-in">
            {tab === 'courses' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {college.courses.map((c) => (
                  <div key={c} className="flex items-center gap-2.5 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 border border-slate-100 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition-colors cursor-default">
                    <BookOpen className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    {c}
                  </div>
                ))}
              </div>
            )}

            {tab === 'placements' && (
              <div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-5 text-center">
                    <p className="text-3xl font-extrabold text-emerald-700">{college.placementRate}%</p>
                    <p className="text-xs font-semibold text-emerald-600 mt-1">Placement Rate</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5 text-center">
                    <p className="text-3xl font-extrabold text-blue-700">{formatPackage(college.avgPackage)}</p>
                    <p className="text-xs font-semibold text-blue-600 mt-1">Average Package</p>
                  </div>
                </div>
                <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5" /> Top Recruiters
                </h4>
                <div className="flex flex-wrap gap-2">
                  {college.topRecruiters.map((r) => (
                    <span key={r} className="bg-slate-100 hover:bg-blue-100 hover:text-blue-800 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-xl transition-colors cursor-default">{r}</span>
                  ))}
                </div>
              </div>
            )}

            {tab === 'reviews' && (
              <div className="space-y-3">
                {REVIEWS.map((r, i) => (
                  <div key={i} className="bg-slate-50 border border-slate-100 rounded-xl p-4 hover:border-blue-100 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-sm font-bold text-slate-800">{r.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium">Batch of {r.year}</p>
                      </div>
                      <div className="flex gap-0.5">
                        {Array(r.rating).fill(0).map((_, j) => (
                          <Star key={j} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">{r.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* ── Related colleges nudge ── */}
{college && (
  <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
    <div>
      <p className="font-extrabold text-slate-900">Ready to decide?</p>
      <p className="text-sm text-slate-500 mt-0.5">Compare {college.name} with other top colleges side by side.</p>
    </div>
    <Link
      href={`/compare?ids=${college.id}`}
      className="shrink-0 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors shadow-md shadow-blue-200"
    >
      <GitCompare className="w-4 h-4" />
      Compare This College
    </Link>
  </div>
)}

      <Footer />
    </div>
  );
}
