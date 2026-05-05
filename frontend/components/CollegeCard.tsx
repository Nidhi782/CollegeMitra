'use client';
import Link from 'next/link';
import { MapPin, Star, IndianRupee, TrendingUp, GitCompare, Check, Users, Award } from 'lucide-react';
import type { College } from '../lib/api';
import { formatFees, calcCMScore, getCMTier } from '../lib/api';
import toast from 'react-hot-toast';

interface Props {
  college: College;
  compareList: number[];
  onToggleCompare: (id: number, name: string) => void;
  onShortlist?: (id: number) => void;
  shortlisted?: boolean;
}

const STREAM_COLORS: Record<string, { bar: string; badge: string }> = {
  Engineering: { bar: 'from-blue-500 to-cyan-500',    badge: 'bg-blue-50 text-blue-700' },
  MBA:         { bar: 'from-violet-500 to-purple-500', badge: 'bg-violet-50 text-violet-700' },
  Medical:     { bar: 'from-rose-500 to-pink-500',     badge: 'bg-rose-50 text-rose-700' },
  Law:         { bar: 'from-amber-500 to-orange-500',  badge: 'bg-amber-50 text-amber-700' },
  Design:      { bar: 'from-pink-500 to-fuchsia-500',  badge: 'bg-pink-50 text-pink-700' },
  Science:     { bar: 'from-teal-500 to-emerald-500',  badge: 'bg-teal-50 text-teal-700' },
  default:     { bar: 'from-slate-400 to-slate-500',   badge: 'bg-slate-50 text-slate-700' },
};

function CMScoreBadge({ score }: { score: number }) {
  const tier = getCMTier(score);
  const cls = tier === 'high' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
             : tier === 'medium' ? 'bg-amber-50 text-amber-700 border-amber-200'
             : 'bg-red-50 text-red-700 border-red-200';
  return (
    <div className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl border ${cls} shrink-0`}>
      <span className="text-sm font-black leading-none">{score}</span>
      <span className="text-[8px] font-bold uppercase tracking-wide mt-0.5">CM</span>
    </div>
  );
}

export default function CollegeCard({ college, compareList, onToggleCompare, onShortlist, shortlisted }: Props) {
  const isComparing = compareList.includes(college.id);
  const canAdd      = compareList.length < 3 || isComparing;
  const cmScore     = college.cmScore ?? calcCMScore(college);
  const colors      = STREAM_COLORS[college.stream || ''] ?? STREAM_COLORS.default;
  const typeColors  = college.type === 'Government'
    ? { dot: 'bg-emerald-400', badge: 'bg-emerald-50 text-emerald-700' }
    : { dot: 'bg-violet-400',  badge: 'bg-violet-50 text-violet-700' };

  return (
    <div className={`group relative bg-white rounded-2xl border overflow-hidden transition-all duration-250 ease-out hover:shadow-xl hover:-translate-y-1 ${
      isComparing ? 'border-indigo-400 ring-2 ring-indigo-100 shadow-lg' : 'border-slate-200 hover:border-indigo-200'
    }`}>

      {/* Stream accent bar */}
      <div className={`h-1 bg-gradient-to-r ${colors.bar}`} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black shrink-0 bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 group-hover:from-indigo-50 group-hover:to-cyan-50 group-hover:text-indigo-700 transition-all">
            {college.name.charAt(0)}
          </div>

          <div className="flex-1 min-w-0">
            <Link href={`/colleges/${college.id}`} className="block group/link">
              <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 group-hover/link:text-indigo-700 transition-colors" style={{fontFamily:'Outfit,sans-serif'}}>
                {college.name}
              </h3>
            </Link>
            <div className="flex items-center gap-1 mt-0.5 text-slate-400 text-xs">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">{college.location}</span>
            </div>
          </div>

          <CMScoreBadge score={cmScore} />
        </div>

        {/* Badges */}
        <div className="flex items-center gap-1.5 mb-4 flex-wrap">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${typeColors.badge}`}>
            <span className={`inline-block w-1.5 h-1.5 rounded-full ${typeColors.dot} mr-1`} />
            {college.type === 'Government' ? 'Govt' : 'Private'}
          </span>
          {college.accreditation && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
              {college.accreditation}
            </span>
          )}
          {college.nirfRank && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
              NIRF #{college.nirfRank}
            </span>
          )}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-amber-50 rounded-xl p-2.5">
            <div className="flex items-center gap-1 mb-0.5">
              <Star className="w-3 h-3 text-amber-500 fill-amber-400" />
              <span className="text-xs font-extrabold text-slate-800">{college.rating}/5</span>
            </div>
            <p className="text-[9px] text-slate-500 font-medium">Rating</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-2.5">
            <div className="flex items-center gap-1 mb-0.5">
              <IndianRupee className="w-3 h-3 text-blue-500" />
              <span className="text-xs font-extrabold text-slate-800">{formatFees(college.fees)}</span>
            </div>
            <p className="text-[9px] text-slate-500 font-medium">Annual Fees</p>
          </div>
          <div className="bg-emerald-50 rounded-xl p-2.5">
            <div className="flex items-center gap-1 mb-0.5">
              <TrendingUp className="w-3 h-3 text-emerald-500" />
              <span className="text-xs font-extrabold text-slate-800">{college.placementRate}%</span>
            </div>
            <p className="text-[9px] text-slate-500 font-medium">Placement</p>
          </div>
          <div className="bg-violet-50 rounded-xl p-2.5">
            <div className="flex items-center gap-1 mb-0.5">
              <Award className="w-3 h-3 text-violet-500" />
              <span className="text-xs font-extrabold text-slate-800">
                {college.avgPackage >= 100000 ? `₹${(college.avgPackage/100000).toFixed(1)}L` : `₹${college.avgPackage}`}
              </span>
            </div>
            <p className="text-[9px] text-slate-500 font-medium">Avg Package</p>
          </div>
        </div>

        {/* Social proof */}
        {college.shortlistedBy && (
          <div className="flex items-center gap-1.5 mb-3 text-[11px] text-slate-500">
            <Users className="w-3 h-3 text-indigo-400" />
            <span><span className="font-bold text-indigo-600">{college.shortlistedBy.toLocaleString()}</span> students shortlisted this month</span>
          </div>
        )}

        {/* Course chips */}
        <div className="flex flex-wrap gap-1 mb-4">
          {college.courses.slice(0, 3).map(c => (
            <span key={c} className="text-[10px] font-semibold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">{c}</span>
          ))}
          {college.courses.length > 3 && (
            <span className="text-[10px] text-slate-400 px-1">+{college.courses.length - 3}</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t border-slate-100">
          <Link
            href={`/colleges/${college.id}`}
            className="flex-1 text-center text-xs font-bold text-indigo-700 border border-indigo-200 rounded-xl py-2 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all duration-150"
          >
            View Details →
          </Link>
          <button
            onClick={() => {
              onToggleCompare(college.id, college.name);
              if (!isComparing && canAdd) toast.success(`Added to compare`);
              else if (isComparing) toast(`Removed from compare`, { icon: '↩️' });
            }}
            disabled={!canAdd && !isComparing}
            className={`flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-xl transition-all duration-150 ${
              isComparing
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 hover:bg-indigo-700'
                : canAdd
                ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                : 'bg-slate-50 text-slate-300 cursor-not-allowed'
            }`}
          >
            {isComparing ? <><Check className="w-3.5 h-3.5" />Added</> : <><GitCompare className="w-3.5 h-3.5" />Compare</>}
          </button>
        </div>
      </div>
    </div>
  );
}