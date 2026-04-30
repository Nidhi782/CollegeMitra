'use client';
import Link from 'next/link';
import { X, GitCompare, ArrowRight } from 'lucide-react';
import { FALLBACK_COLLEGES } from '../lib/api';
import { showToast } from './Toast';

interface Props {
  compareList: number[];
  onRemove: (id: number) => void;
  onClear: () => void;
}

export default function CompareBar({ compareList, onRemove, onClear }: Props) {
  if (compareList.length === 0) return null;

  const names = compareList.map((id) => {
    const c = FALLBACK_COLLEGES.find((c) => c.id === id);
    return c ? c.name.split(' ').slice(0, 3).join(' ') : `#${id}`;
  });

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
      {/* Backdrop blur bar */}
      <div className="bg-blue-700/95 backdrop-blur-sm border-t border-blue-500/50 shadow-2xl shadow-blue-900/40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center">
              <GitCompare className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white text-xs font-black leading-none">{compareList.length}/3 Selected</p>
              <p className="text-blue-300 text-[10px]">
                {compareList.length < 2 ? 'Select 1 more to compare' : 'Ready to compare!'}
              </p>
            </div>
          </div>

          {/* College chips */}
          <div className="flex gap-2 flex-1 overflow-x-auto scrollbar-none">
            {names.map((name, i) => (
              <div key={compareList[i]} className="flex items-center gap-1.5 bg-blue-600/60 border border-blue-500/40 rounded-xl px-3 py-1.5 text-xs font-semibold text-white whitespace-nowrap">
                <span className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-[9px] font-black shrink-0">{i + 1}</span>
                {name}
                <button
                  onClick={() => {
                    onRemove(compareList[i]);
                    showToast.compareRemoved(name);
                  }}
                  className="ml-0.5 hover:text-red-300 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            {/* Empty slots */}
            {Array(3 - compareList.length).fill(0).map((_, i) => (
              <div key={`empty-${i}`} className="flex items-center gap-1.5 border border-blue-500/30 border-dashed rounded-xl px-3 py-1.5 text-xs text-blue-400 whitespace-nowrap">
                <span className="w-4 h-4 border border-blue-500/40 rounded-full flex items-center justify-center text-[9px]">{compareList.length + i + 1}</span>
                Add college
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => { onClear(); showToast.compareClear(); }}
              className="text-xs text-blue-300 hover:text-white transition-colors font-semibold"
            >
              Clear
            </button>

            {compareList.length >= 2 ? (
              <Link
                href={`/compare?ids=${compareList.join(',')}`}
                className="flex items-center gap-1.5 bg-white text-blue-700 font-black text-xs px-4 py-2 rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
              >
                Compare Now
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <div className="flex items-center gap-1.5 bg-blue-600/40 text-blue-300 font-black text-xs px-4 py-2 rounded-xl cursor-not-allowed select-none">
                Compare Now
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}