'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  MapPin, Star, IndianRupee, TrendingUp, Users, Building2,
  Award, ArrowLeft, BookOpen, Briefcase, GitCompare, Share2,
  ThumbsUp, ThumbsDown, Shield, Calendar, Zap, Trophy,
  CheckCircle, Calculator,
} from 'lucide-react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { fetchCollege, type College, formatFees, formatPackage, calcCMScore, getCMTier } from '../../../lib/api';
import toast from 'react-hot-toast';

const REVIEWS = [
  { name:'Rahul Sharma', course:'B.Tech CSE', year:'2023', rating:5, likes:['World-class research labs','Excellent placement cell','Strong alumni network'], dislikes:['High academic pressure','Limited seats'], helpful:142 },
  { name:'Priya Mehta', course:'MBA', year:'2022', rating:4, likes:['Industry exposure','Great internship opportunities','Competitive peer group'], dislikes:['Campus food could be better','Distance from city'], helpful:98 },
  { name:'Ankit Kumar', course:'M.Tech', year:'2024', rating:4, likes:['Top-notch professors','Research funding available','International collaborations'], dislikes:['Infrastructure needs upgrade in some depts'], helpful:67 },
];

const SCHOLARSHIPS = [
  { name:'Merit Scholarship', eligibility:'Top 10% of batch', amount:'₹50,000/yr', category:'Merit-based' },
  { name:'SC/ST Scholarship', eligibility:'SC/ST students', amount:'Full fee waiver', category:'Category-based' },
  { name:'EWS Financial Aid', eligibility:'Family income < ₹8L/yr', amount:'₹25,000/yr', category:'Income-based' },
];

type Tab = 'overview' | 'courses' | 'placements' | 'reviews' | 'cutoff' | 'scholarships';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} className={`w-3.5 h-3.5 ${i <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`} />
      ))}
    </div>
  );
}

export default function CollegeDetailPage() {
  const { id }   = useParams<{ id: string }>();
  const router   = useRouter();
  const [college, setCollege] = useState<College | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab,     setTab]     = useState<Tab>('overview');

  useEffect(() => {
    fetchCollege(Number(id))
      .then(setCollege)
      .catch(() => router.push('/'))
      .finally(() => setLoading(false));
  }, [id, router]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  if (loading) return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-10 w-full space-y-4">
        <div className="skeleton h-4 rounded-lg w-24" />
        <div className="skeleton h-48 rounded-2xl" />
        <div className="grid grid-cols-4 gap-3">
          {[0,1,2,3].map(i => <div key={i} className="skeleton h-20 rounded-xl" />)}
        </div>
      </div>
    </div>
  );

  if (!college) return null;

  const cmScore = calcCMScore(college);
  const cmTier  = getCMTier(cmScore);
  const scoreClass = cmTier === 'high' ? 'cm-score-high' : cmTier === 'medium' ? 'cm-score-medium' : 'cm-score-low';
  const typeColor = college.type === 'Government'
    ? { bar: 'from-emerald-500 to-teal-500', badge: 'bg-emerald-50 text-emerald-700' }
    : { bar: 'from-violet-500 to-purple-500', badge: 'bg-violet-50 text-violet-700' };

  const TABS: { id: Tab; label: string }[] = [
    { id: 'overview',     label: 'Overview' },
    { id: 'courses',      label: 'Courses & Fees' },
    { id: 'placements',   label: 'Placements' },
    { id: 'reviews',      label: `Reviews (${REVIEWS.length})` },
    { id: 'cutoff',       label: 'Cutoff' },
    { id: 'scholarships', label: 'Scholarships' },
  ];

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full animate-fade-in">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-700 mb-5 transition-colors group">
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to Colleges
        </Link>

        {/* ── Header card ── */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-5 shadow-sm">
          <div className={`h-1.5 bg-gradient-to-r ${typeColor.bar}`} />
          <div className="p-6">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-2xl font-black text-slate-600 shrink-0" style={{fontFamily:'Outfit,sans-serif'}}>
                  {college.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${typeColor.badge}`}>
                      {college.type.toUpperCase()}
                    </span>
                    {college.accreditation && (
                      <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">
                        {college.accreditation}
                      </span>
                    )}
                    {college.nirfRank && (
                      <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                        <Trophy className="w-2.5 h-2.5" />NIRF #{college.nirfRank}
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400 font-medium">Est. {college.established}</span>
                  </div>
                  <h1 className="text-2xl font-black text-slate-900 leading-tight" style={{fontFamily:'Outfit,sans-serif'}}>{college.name}</h1>
                  <div className="flex items-center gap-1.5 mt-1.5 text-slate-500 text-xs font-medium">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    {college.location}
                  </div>
                </div>
              </div>

              {/* CM Score + Actions */}
              <div className="flex items-start gap-3 shrink-0">
                <div className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl border ${scoreClass}`}>
                  <span className="text-lg font-black leading-none">{cmScore}</span>
                  <span className="text-[9px] font-bold uppercase tracking-wide mt-0.5">CM Score</span>
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={handleShare} className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-indigo-700 hover:border-indigo-200 transition-all" title="Share">
                    <Share2 className="w-4 h-4" />
                  </button>
                  <Link href={`/compare?ids=${college.id}`} className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-indigo-700 hover:border-indigo-200 transition-all" title="Compare">
                    <GitCompare className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed mb-5">{college.description}</p>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: <Star className="w-4 h-4 text-amber-500 fill-amber-400" />, label:'Rating',     value:`${college.rating}/5`,               bg:'bg-amber-50'   },
                { icon: <IndianRupee className="w-4 h-4 text-blue-600" />,          label:'Annual Fees', value:formatFees(college.fees),             bg:'bg-blue-50'    },
                { icon: <TrendingUp className="w-4 h-4 text-emerald-600" />,        label:'Placement',   value:`${college.placementRate}%`,           bg:'bg-emerald-50' },
                { icon: <Users className="w-4 h-4 text-violet-600" />,              label:'Students',    value:college.totalStudents.toLocaleString(), bg:'bg-violet-50'  },
              ].map(({ icon, label, value, bg }) => (
                <div key={label} className={`${bg} rounded-xl p-3.5 text-center`}>
                  <div className="flex justify-center mb-1">{icon}</div>
                  <p className="font-extrabold text-slate-900 text-sm">{value}</p>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Social proof + CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-5 pt-5 border-t border-slate-100">
              <div className="flex items-center gap-4 text-xs text-slate-500">
                {college.shortlistedBy && (
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="font-bold text-indigo-600">{college.shortlistedBy.toLocaleString()}</span> students shortlisted
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-emerald-600">
                  <Zap className="w-3.5 h-3.5" />
                  Admissions Open 2026
                </span>
              </div>
              <div className="flex gap-3">
                <Link href={`/predictor?stream=${college.stream}`} className="btn-secondary text-xs py-2 px-4">
                  <Calculator className="w-3.5 h-3.5" />Check Eligibility
                </Link>
                <button className="btn-primary text-xs py-2 px-4">
                  Apply Now →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          {/* Tab nav */}
          <div className="flex border-b border-slate-100 overflow-x-auto scrollbar-none">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex-shrink-0 px-5 py-3.5 text-xs font-bold transition-all whitespace-nowrap ${
                  tab === t.id
                    ? 'text-indigo-700 border-b-2 border-indigo-600 bg-indigo-50/50'
                    : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
                }`}>
                {t.label}
              </button>
            ))}
          </div>

          <div className="p-6 animate-fade-in" key={tab}>

            {/* OVERVIEW */}
            {tab === 'overview' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon: <Building2 className="w-4 h-4 text-blue-600" />,   label:'Established',  value:String(college.established) },
                  { icon: <Award className="w-4 h-4 text-amber-500" />,      label:'Avg Package',   value:formatPackage(college.avgPackage) },
                  { icon: <BookOpen className="w-4 h-4 text-emerald-600" />, label:'Programs',      value:`${college.courses.length} offered` },
                  { icon: <Shield className="w-4 h-4 text-violet-600" />,    label:'Accreditation', value:college.accreditation || 'N/A' },
                  { icon: <Trophy className="w-4 h-4 text-indigo-600" />,    label:'NIRF Rank',     value:college.nirfRank ? `#${college.nirfRank}` : 'N/A' },
                  { icon: <Users className="w-4 h-4 text-rose-500" />,       label:'Students',      value:college.totalStudents.toLocaleString() },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="bg-slate-50 rounded-xl p-4 flex items-center gap-3">
                    <div className="p-2 bg-white rounded-xl shadow-sm shrink-0">{icon}</div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">{label}</p>
                      <p className="font-bold text-slate-900 text-sm">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* COURSES */}
            {tab === 'courses' && (
              <div>
                <p className="text-xs text-slate-500 mb-4">Fees shown are approximate annual figures</p>
                <div className="space-y-2">
                  {college.courses.map(c => (
                    <div key={c} className="flex items-center justify-between bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-200 rounded-xl px-4 py-3 transition-colors">
                      <div className="flex items-center gap-2.5">
                        <BookOpen className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <span className="text-sm font-semibold text-slate-700">{c}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="font-semibold text-slate-700">{formatFees(college.fees)}</span>
                        <span className="bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full">Admissions Open</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PLACEMENTS */}
            {tab === 'placements' && (
              <div>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-5 text-center">
                    <p className="text-3xl font-black text-emerald-700" style={{fontFamily:'Outfit,sans-serif'}}>{college.placementRate}%</p>
                    <p className="text-xs font-semibold text-emerald-600 mt-1">Placement Rate</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5 text-center">
                    <p className="text-3xl font-black text-blue-700" style={{fontFamily:'Outfit,sans-serif'}}>{formatPackage(college.avgPackage)}</p>
                    <p className="text-xs font-semibold text-blue-600 mt-1">Average Package</p>
                  </div>
                  <div className="bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-100 rounded-2xl p-5 text-center">
                    <p className="text-3xl font-black text-violet-700" style={{fontFamily:'Outfit,sans-serif'}}>{formatPackage(college.avgPackage * 2.5)}</p>
                    <p className="text-xs font-semibold text-violet-600 mt-1">Highest Package</p>
                  </div>
                </div>
                <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5" />Top Recruiters
                </h4>
                <div className="flex flex-wrap gap-2">
                  {college.topRecruiters.map(r => (
                    <span key={r} className="bg-slate-100 hover:bg-indigo-100 hover:text-indigo-800 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-xl transition-colors cursor-default">{r}</span>
                  ))}
                </div>
              </div>
            )}

            {/* REVIEWS */}
            {tab === 'reviews' && (
              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-slate-50 rounded-xl p-4 mb-2">
                  <div className="text-center">
                    <p className="text-4xl font-black text-slate-900" style={{fontFamily:'Outfit,sans-serif'}}>{college.rating}</p>
                    <StarRating rating={Math.round(college.rating)} />
                    <p className="text-[10px] text-slate-400 mt-1">{REVIEWS.length} reviews</p>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {[5,4,3,2,1].map(r => (
                      <div key={r} className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 w-2">{r}</span>
                        <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full" style={{width: r === 5 ? '60%' : r === 4 ? '30%' : '10%'}} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {REVIEWS.map((r, i) => (
                  <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5 hover:border-indigo-100 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm font-bold text-slate-800">{r.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{r.course} · Batch {r.year}</p>
                      </div>
                      <StarRating rating={r.rating} />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <p className="font-bold text-emerald-700 flex items-center gap-1 mb-2"><ThumbsUp className="w-3.5 h-3.5" />Liked</p>
                        <ul className="space-y-1">
                          {r.likes.map((l,j) => <li key={j} className="flex items-start gap-1.5 text-slate-600"><CheckCircle className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />{l}</li>)}
                        </ul>
                      </div>
                      <div>
                        <p className="font-bold text-rose-600 flex items-center gap-1 mb-2"><ThumbsDown className="w-3.5 h-3.5" />Disliked</p>
                        <ul className="space-y-1">
                          {r.dislikes.map((d,j) => <li key={j} className="flex items-start gap-1.5 text-slate-600"><span className="w-3 h-3 shrink-0 mt-0.5 flex items-center justify-center text-rose-400">·</span>{d}</li>)}
                        </ul>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-3">{r.helpful} students found this helpful</p>
                  </div>
                ))}
              </div>
            )}

            {/* CUTOFF */}
            {tab === 'cutoff' && (
              <div>
                <p className="text-xs text-slate-500 mb-4 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />Cutoffs shown are approximate for 2024 admissions. Actual cutoffs may vary.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="text-left px-4 py-2.5 text-xs font-black text-slate-600 uppercase tracking-wide border-b border-slate-200">Category</th>
                        <th className="text-left px-4 py-2.5 text-xs font-black text-slate-600 uppercase tracking-wide border-b border-slate-200">Min Rank/Score</th>
                        <th className="text-left px-4 py-2.5 text-xs font-black text-slate-600 uppercase tracking-wide border-b border-slate-200">Max Rank/Score</th>
                        <th className="text-left px-4 py-2.5 text-xs font-black text-slate-600 uppercase tracking-wide border-b border-slate-200">Seats</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { cat:'General (CRL)', min: college.nirfRank ? college.nirfRank * 20 : 1000, max: college.nirfRank ? college.nirfRank * 60 : 5000, seats:60 },
                        { cat:'OBC-NCL',       min: college.nirfRank ? college.nirfRank * 50 : 2000, max: college.nirfRank ? college.nirfRank * 120 : 8000, seats:27 },
                        { cat:'SC',            min: college.nirfRank ? college.nirfRank * 100 : 5000,max: college.nirfRank ? college.nirfRank * 250 : 20000,seats:15 },
                        { cat:'ST',            min: college.nirfRank ? college.nirfRank * 150 : 8000,max: college.nirfRank ? college.nirfRank * 400 : 35000,seats:7 },
                      ].map((row, i) => (
                        <tr key={row.cat} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                          <td className="px-4 py-3 font-semibold text-slate-700 border-b border-slate-100">{row.cat}</td>
                          <td className="px-4 py-3 text-slate-600 border-b border-slate-100">{row.min.toLocaleString()}</td>
                          <td className="px-4 py-3 text-slate-600 border-b border-slate-100">{row.max.toLocaleString()}</td>
                          <td className="px-4 py-3 text-slate-600 border-b border-slate-100">{row.seats}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Link href={`/predictor`} className="mt-4 btn-primary inline-flex text-xs">
                  <Calculator className="w-3.5 h-3.5" />Check My Eligibility
                </Link>
              </div>
            )}

            {/* SCHOLARSHIPS */}
            {tab === 'scholarships' && (
              <div className="space-y-3">
                {SCHOLARSHIPS.map(s => (
                  <div key={s.name} className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-start gap-4">
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">
                      <Award className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="text-sm font-bold text-slate-800">{s.name}</p>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">{s.amount}</span>
                      </div>
                      <p className="text-xs text-slate-500 mb-1">{s.eligibility}</p>
                      <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{s.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Compare nudge */}
        <div className="mt-5 bg-gradient-to-r from-indigo-50 to-cyan-50 border border-indigo-100 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-slate-900">Ready to decide?</p>
            <p className="text-sm text-slate-500 mt-0.5">Compare {college.name} with other top colleges side by side.</p>
          </div>
          <Link href={`/compare?ids=${college.id}`} className="btn-primary shrink-0">
            <GitCompare className="w-4 h-4" />Compare This College
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
