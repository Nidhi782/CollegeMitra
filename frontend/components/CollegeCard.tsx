'use client';
import Link from 'next/link';
import { MapPin, Star, IndianRupee, TrendingUp, GitCompare, Check, X } from 'lucide-react';
import type { College } from '../lib/api';
import { formatFees } from '../lib/api';
import { showToast } from './Toast';

interface Props {
  college: College;
  compareList: number[];
  onToggleCompare: (id: number, name: string) => void;
}

export default function CollegeCard({ college, compareList, onToggleCompare }: Props) {
  const isComparing = compareList.includes(college.id);
  const canAdd = compareList.length < 3 || isComparing;

  return (
    <div
      className={`
        bg-white rounded-2xl border overflow-hidden
        transition-all duration-200 ease-out
        hover:shadow-xl hover:-translate-y-1
        animate-slide-up
        ${isComparing
          ? 'border-blue-400 ring-2 ring-blue-100 shadow-blue-50 shadow-lg'
          : 'border-slate-200 hover:border-blue-200'}
      `}
    >
      {/* accent bar */}
      <div className={`h-1 ${
        college.type === 'Government'
          ? 'bg-gradient-to-r from-emerald-400 to-teal-500'
          : 'bg-gradient-to-r from-violet-400 to-purple-500'
      }`} />

      <div className="p-5">
        {/* header */}
        <div className="flex items-start gap-3 mb-4">
          {/* Avatar letter */}
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black shrink-0 ${
            college.type === 'Government' ? 'bg-emerald-50 text-emerald-700' : 'bg-violet-50 text-violet-700'
          }`}>
            {college.name.charAt(0)}
          </div>

          <div className="flex-1 min-w-0">
            <Link href={`/colleges/${college.id}`} className="block group/link">
              <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 group-hover/link:text-blue-700 transition-colors">
                {college.name}
              </h3>
            </Link>
            <div className="flex items-center gap-1 mt-0.5 text-slate-400 text-xs">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">{college.location}</span>
            </div>
          </div>

          <span className={`text-[10px] font-bold px-2 py-1 rounded-lg whitespace-nowrap shrink-0 ${
            college.type === 'Government' ? 'bg-emerald-50 text-emerald-700' : 'bg-violet-50 text-violet-700'
          }`}>
            {college.type === 'Government' ? 'Govt' : 'Pvt'}
          </span>
        </div>

        {/* stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <Stat color="amber"   icon={<Star className="w-3 h-3 fill-amber-400 text-amber-400" />}    label="Rating"   value={college.rating.toFixed(1)} />
          <Stat color="blue"    icon={<IndianRupee className="w-3 h-3 text-blue-500" />}              label="Fees/yr"  value={formatFees(college.fees)} />
          <Stat color="emerald" icon={<TrendingUp className="w-3 h-3 text-emerald-500" />}            label="Placed"   value={`${college.placementRate}%`} />
        </div>

        {/* courses */}
        <div className="flex flex-wrap gap-1 mb-4">
          {college.courses.slice(0, 3).map((c) => (
            <span key={c} className="text-[10px] font-semibold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">{c}</span>
          ))}
          {college.courses.length > 3 && (
            <span className="text-[10px] text-slate-400 px-1">+{college.courses.length - 3} more</span>
          )}
        </div>

        {/* actions */}
        <div className="flex gap-2 pt-3 border-t border-slate-100">
          <Link
            href={`/colleges/${college.id}`}
            className="flex-1 text-center text-xs font-bold text-blue-700 border border-blue-200 rounded-xl py-2 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-150"
          >
            View Details →
          </Link>

          <button
            onClick={() => onToggleCompare(college.id, college.name)}
            disabled={!canAdd}
            title={
              isComparing ? 'Remove from compare'
              : !canAdd   ? 'Maximum 3 colleges allowed'
              : 'Add to compare'
            }
            className={`flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-xl transition-all duration-150 ${
             isComparing
  ? 'bg-blue-600 text-white shadow-md shadow-blue-200 hover:bg-blue-700'
                : canAdd
                ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                : 'bg-slate-50 text-slate-300 cursor-not-allowed'
            }`}
          >
            {isComparing
              ? <><Check className="w-3.5 h-3.5" /> Added</>
              : <><GitCompare className="w-3.5 h-3.5" /> Compare</>
            }
          </button>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label, value, color }: {
  icon: React.ReactNode; label: string; value: string;
  color: 'amber' | 'blue' | 'emerald';
}) {
  const bg = { amber: 'bg-amber-50', blue: 'bg-blue-50', emerald: 'bg-emerald-50' }[color];
  return (
    <div className={`${bg} rounded-xl p-2 text-center`}>
      <div className="flex justify-center mb-0.5">{icon}</div>
      <p className="text-xs font-extrabold text-slate-800">{value}</p>
      <p className="text-[9px] text-slate-400 font-medium">{label}</p>
    </div>
  );
}