'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { GraduationCap, GitCompare, BookOpen, Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { href: '/',        label: 'Colleges', icon: <BookOpen className="w-3.5 h-3.5" /> },
  { href: '/compare', label: 'Compare',  icon: <GitCompare className="w-3.5 h-3.5" /> },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Brand ── */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-md shadow-blue-200 group-hover:shadow-blue-300 transition-shadow">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-extrabold text-base text-slate-900 tracking-tight">CollegeMitra</span>
              <span className="text-[9px] font-semibold text-slate-400 tracking-widest uppercase">India's College Platform</span>
            </div>
          </Link>

          {/* ── Desktop nav — centered ── */}
          <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {NAV_LINKS.map(({ href, label, icon }) => {
              const active = pathname === href;
              return (
                <Link key={href} href={href}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${
                    active ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {icon}
                  {label}
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />}
                </Link>
              );
            })}
          </nav>

          {/* ── Desktop right side ── */}
          <div className="hidden md:flex items-center gap-3">
            <a href="https://careers360.com" target="_blank" rel="noopener noreferrer"
              className="text-xs font-semibold text-slate-500 hover:text-blue-700 transition-colors">
              College News ↗
            </a>
          </div>

          {/* ── Mobile hamburger ── */}
          <button className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {open && (
        <div className="md:hidden border-t border-slate-100 bg-white animate-slide-up">
          <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
            {NAV_LINKS.map(({ href, label, icon }) => (
              <Link key={href} href={href} onClick={() => setOpen(false)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  pathname === href ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-100'
                }`}>
                {icon}{label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}