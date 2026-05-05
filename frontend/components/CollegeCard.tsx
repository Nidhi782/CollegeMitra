'use client';
import Link from 'next/link';
import { MapPin, Star, IndianRupee, TrendingUp, GitCompare, Check, Users, Award, Flame, Building2, Bookmark, BookmarkCheck } from 'lucide-react';
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

const STREAM_CONFIG: Record<string, {
  barGrad: string;
  badgeBg: string;
  badgeText: string;
  glow: string;
  accent: string;
  avatarGrad: string;
}> = {
  Engineering: {
    barGrad:    'from-blue-500 via-indigo-500 to-cyan-500',
    badgeBg:    'bg-blue-50',
    badgeText:  'text-blue-700',
    glow:       'hover:shadow-[0_8px_30px_rgba(59,130,246,0.25)]',
    accent:     'group-hover:text-blue-600',
    avatarGrad: 'from-blue-500 to-indigo-600',
  },
  MBA: {
    barGrad:    'from-violet-500 via-purple-500 to-fuchsia-500',
    badgeBg:    'bg-violet-50',
    badgeText:  'text-violet-700',
    glow:       'hover:shadow-[0_8px_30px_rgba(139,92,246,0.25)]',
    accent:     'group-hover:text-violet-600',
    avatarGrad: 'from-violet-500 to-purple-600',
  },
  Medical: {
    barGrad:    'from-rose-500 via-pink-500 to-red-400',
    badgeBg:    'bg-rose-50',
    badgeText:  'text-rose-700',
    glow:       'hover:shadow-[0_8px_30px_rgba(244,63,94,0.25)]',
    accent:     'group-hover:text-rose-600',
    avatarGrad: 'from-rose-500 to-pink-600',
  },
  Law: {
    barGrad:    'from-amber-500 via-orange-500 to-yellow-400',
    badgeBg:    'bg-amber-50',
    badgeText:  'text-amber-700',
    glow:       'hover:shadow-[0_8px_30px_rgba(245,158,11,0.25)]',
    accent:     'group-hover:text-amber-600',
    avatarGrad: 'from-amber-500 to-orange-500',
  },
  Design: {
    barGrad:    'from-pink-500 via-fuchsia-500 to-purple-400',
    badgeBg:    'bg-pink-50',
    badgeText:  'text-pink-700',
    glow:       'hover:shadow-[0_8px_30px_rgba(236,72,153,0.25)]',
    accent:     'group-hover:text-pink-600',
    avatarGrad: 'from-pink-500 to-fuchsia-600',
  },
  Science: {
    barGrad:    'from-teal-500 via-emerald-500 to-green-400',
    badgeBg:    'bg-teal-50',
    badgeText:  'text-teal-700',
    glow:       'hover:shadow-[0_8px_30px_rgba(20,184,166,0.25)]',
    accent:     'group-hover:text-teal-600',
    avatarGrad: 'from-teal-500 to-emerald-600',
  },
  Commerce: {
    barGrad:    'from-emerald-500 via-green-500 to-teal-400',
    badgeBg:    'bg-emerald-50',
    badgeText:  'text-emerald-700',
    glow:       'hover:shadow-[0_8px_30px_rgba(16,185,129,0.25)]',
    accent:     'group-hover:text-emerald-600',
    avatarGrad: 'from-emerald-500 to-green-600',
  },
  default: {
    barGrad:    'from-indigo-500 via-blue-500 to-cyan-500',
    badgeBg:    'bg-indigo-50',
    badgeText:  'text-indigo-700',
    glow:       'hover:shadow-[0_8px_30px_rgba(79,70,229,0.2)]',
    accent:     'group-hover:text-indigo-600',
    avatarGrad: 'from-indigo-500 to-blue-600',
  },
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} className={`w-3 h-3 ${i <= Math.round(rating) ? 'text-amber-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function CMScoreRing({ score }: { score: number }) {
  const tier = getCMTier(score);
  const circumference = 2 * Math.PI * 16;
  const progress = (score / 100) * circumference;
  const color = tier === 'high' ? '#10b981' : tier === 'medium' ? '#f59e0b' : '#ef4444';
  const bg = tier === 'high' ? 'bg-emerald-50' : tier === 'medium' ? 'bg-amber-50' : 'bg-red-50';
  const text = tier === 'high' ? 'text-emerald-700' : tier === 'medium' ? 'text-amber-700' : 'text-red-700';

  return (
    <div className={`relative w-12 h-12 flex items-center justify-center rounded-full ${bg} shrink-0`} title={`CM Score: ${score}/100`}>
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="16" fill="none" stroke="#e2e8f0" strokeWidth="3" />
        <circle
          cx="20" cy="20" r="16"
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeDasharray={`${progress} ${circumference}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="relative flex flex-col items-center justify-center">
        <span className={`text-[11px] font-black leading-none ${text}`}>{score}</span>
        <span className="text-[7px] font-bold text-slate-400 uppercase tracking-wide">CM</span>
      </div>
    </div>
  );
}

const HOT_IDS = [1, 2, 3, 13, 16]; // Simulated trending colleges

export default function CollegeCard({ college, compareList, onToggleCompare, onShortlist, shortlisted }: Props) {
  const isComparing = compareList.includes(college.id);
  const canAdd      = compareList.length < 3 || isComparing;
  const cmScore     = college.cmScore ?? calcCMScore(college);
  const cfg         = STREAM_CONFIG[college.stream || ''] ?? STREAM_CONFIG.default;
  const isHot       = HOT_IDS.includes(college.id) || (college.shortlistedBy && college.shortlistedBy > 4000);
  const initials    = college.name.split(' ').slice(0, 2).map(w => w[0]).join('');

  return (
    <div className={`group relative bg-white rounded-2xl border overflow-hidden college-card ${cfg.glow} ${
      isComparing
        ? 'border-indigo-400 ring-2 ring-indigo-100 shadow-lg shadow-indigo-100/50'
        : 'border-slate-200/80 hover:border-slate-300'
    }`}>

      {/* Stream gradient accent bar */}
      <div className={`h-1.5 bg-gradient-to-r ${cfg.barGrad}`} />

      {/* Hot badge */}
      {isHot && (
        <div className="absolute top-4 right-4 z-10">
          <span className="flex items-center gap-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full hot-badge shadow-sm">
            <Flame className="w-2.5 h-2.5" /> HOT
          </span>
        </div>
      )}

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          {/* Avatar with gradient */}
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-black shrink-0 bg-gradient-to-br ${cfg.avatarGrad} text-white shadow-md group-hover:scale-105 transition-transform duration-200`}>
            {initials}
          </div>

          <div className="flex-1 min-w-0 pr-6">
            <Link href={`/colleges/${college.id}`} className="block group/link">
              <h3 className={`font-bold text-slate-900 text-sm leading-snug line-clamp-2 transition-colors duration-150 ${cfg.accent}`} style={{ fontFamily: 'Outfit,sans-serif' }}>
                {college.name}
              </h3>
            </Link>
            <div className="flex items-center gap-1 mt-0.5 text-slate-400 text-xs">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">{college.location}</span>
            </div>
          </div>

          <CMScoreRing score={cmScore} />
        </div>

        {/* Rating + Badges row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <StarRating rating={college.rating} />
            <span className="text-xs font-bold text-slate-700">{college.rating}</span>
            <span className="text-[10px] text-slate-400">/5</span>
          </div>
          <div className="flex items-center gap-1">
            {college.accreditation && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-100">
                {college.accreditation}
              </span>
            )}
            {college.nirfRank && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                NIRF #{college.nirfRank}
              </span>
            )}
          </div>
        </div>

        {/* Type badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
            college.type === 'Government'
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-violet-50 text-violet-700'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full inline-block ${
              college.type === 'Government' ? 'bg-emerald-500' : 'bg-violet-500'
            }`} />
            {college.type === 'Government' ? 'Government' : 'Private'}
          </span>
          {college.stream && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.badgeBg} ${cfg.badgeText}`}>
              {college.stream}
            </span>
          )}
        </div>

        {/* Stats grid — 2×2 */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 group-hover:border-slate-200 transition-colors">
            <div className="flex items-center gap-1 mb-0.5">
              <IndianRupee className="w-3 h-3 text-blue-500 shrink-0" />
              <span className="text-xs font-extrabold text-slate-800">{formatFees(college.fees)}</span>
            </div>
            <p className="text-[9px] text-slate-400 font-medium">Annual Fees</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 group-hover:border-slate-200 transition-colors">
            <div className="flex items-center gap-1 mb-0.5">
              <TrendingUp className="w-3 h-3 text-emerald-500 shrink-0" />
              <span className="text-xs font-extrabold text-slate-800">{college.placementRate}%</span>
            </div>
            <p className="text-[9px] text-slate-400 font-medium">Placement</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 group-hover:border-slate-200 transition-colors">
            <div className="flex items-center gap-1 mb-0.5">
              <Award className="w-3 h-3 text-violet-500 shrink-0" />
              <span className="text-xs font-extrabold text-slate-800">
                {college.avgPackage >= 100000
                  ? `₹${(college.avgPackage / 100000).toFixed(1)}L`
                  : `₹${college.avgPackage}`}
              </span>
            </div>
            <p className="text-[9px] text-slate-400 font-medium">Avg Package</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 group-hover:border-slate-200 transition-colors">
            <div className="flex items-center gap-1 mb-0.5">
              <Building2 className="w-3 h-3 text-amber-500 shrink-0" />
              <span className="text-xs font-extrabold text-slate-800">{college.established}</span>
            </div>
            <p className="text-[9px] text-slate-400 font-medium">Est. Year</p>
          </div>
        </div>

        {/* Social proof */}
        {college.shortlistedBy && (
          <div className="flex items-center gap-1.5 mb-3 py-2 px-2.5 bg-indigo-50/60 rounded-xl border border-indigo-100/50">
            <Users className="w-3 h-3 text-indigo-400 shrink-0" />
            <span className="text-[11px] text-slate-500">
              <span className="font-bold text-indigo-600">{college.shortlistedBy.toLocaleString()}</span>
              {' '}students shortlisted this month
            </span>
          </div>
        )}

        {/* Course chips */}
        <div className="flex flex-wrap gap-1 mb-4">
          {college.courses.slice(0, 3).map(c => (
            <span key={c} className="text-[10px] font-semibold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md border border-slate-200/60">
              {c}
            </span>
          ))}
          {college.courses.length > 3 && (
            <span className="text-[10px] text-slate-400 px-1.5 py-0.5">
              +{college.courses.length - 3} more
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t border-slate-100">
          <Link
            href={`/colleges/${college.id}`}
            className={`card-cta flex-1 text-center text-xs font-bold border rounded-xl py-2.5 transition-all duration-200 ${
              `text-indigo-700 border-indigo-200 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 hover:shadow-md hover:shadow-indigo-200`
            }`}
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
            title={isComparing ? 'Remove from compare' : 'Add to compare'}
            className={`flex items-center gap-1 text-xs font-bold px-3 py-2.5 rounded-xl transition-all duration-150 ${
              isComparing
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 hover:bg-indigo-700'
                : canAdd
                ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                : 'bg-slate-50 text-slate-300 cursor-not-allowed'
            }`}
          >
            {isComparing
              ? <><Check className="w-3.5 h-3.5" />Added</>
              : <><GitCompare className="w-3.5 h-3.5" />Compare</>}
          </button>
          {onShortlist && (
            <button
              onClick={() => onShortlist(college.id)}
              title={shortlisted ? 'Saved' : 'Save college'}
              className={`p-2.5 rounded-xl transition-all duration-150 ${
                shortlisted
                  ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                  : 'bg-slate-100 text-slate-400 hover:text-rose-500 hover:bg-rose-50'
              }`}
            >
              {shortlisted ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}