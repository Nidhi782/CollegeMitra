'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import {
  GraduationCap, Search, Menu, X, ChevronDown,
  Cpu, Stethoscope, Briefcase, Scale, Palette, Globe,
  BookOpen, Trophy, Calculator, MapPin, Users,
} from 'lucide-react';

const STREAMS = [
  {
    label: 'Engineering',
    icon: <Cpu className="w-4 h-4" />,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    links: [
      { href: '/?stream=Engineering', label: 'Top Engineering Colleges' },
      { href: '/?stream=Engineering&course=B.Tech', label: 'B.Tech Colleges' },
      { href: '/predictor?exam=JEE Main', label: 'JEE Main Predictor' },
      { href: '/predictor?exam=JEE Advanced', label: 'JEE Advanced Predictor' },
      { href: '/?stream=Engineering&state=Maharashtra', label: 'Colleges in Maharashtra' },
    ],
  },
  {
    label: 'MBA',
    icon: <Briefcase className="w-4 h-4" />,
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    links: [
      { href: '/?stream=MBA', label: 'Top MBA Colleges' },
      { href: '/?stream=MBA&type=Government', label: 'IIMs & Top Govt B-Schools' },
      { href: '/predictor?exam=CAT', label: 'CAT College Predictor' },
      { href: '/predictor?exam=XAT', label: 'XAT College Predictor' },
      { href: '/?stream=MBA&state=Maharashtra', label: 'MBA in Mumbai/Pune' },
    ],
  },
  {
    label: 'Medical',
    icon: <Stethoscope className="w-4 h-4" />,
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    links: [
      { href: '/?stream=Medical', label: 'Top Medical Colleges' },
      { href: '/?stream=Medical&course=MBBS', label: 'MBBS Colleges' },
      { href: '/predictor?exam=NEET', label: 'NEET College Predictor' },
      { href: '/?stream=Medical&type=Government', label: 'Govt Medical Colleges' },
      { href: '/?stream=Medical&state=Tamil Nadu', label: 'Medical Colleges in Tamil Nadu' },
    ],
  },
  {
    label: 'Law',
    icon: <Scale className="w-4 h-4" />,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    links: [
      { href: '/?stream=Law', label: 'Top Law Colleges' },
      { href: '/predictor?exam=CLAT', label: 'CLAT Predictor' },
      { href: '/?stream=Law&course=LLB', label: 'LLB Colleges' },
      { href: '/?stream=Law&type=Government', label: 'NLUs & Govt Law Schools' },
      { href: '/?stream=Law&state=Delhi', label: 'Law Colleges in Delhi' },
    ],
  },
  {
    label: 'Design',
    icon: <Palette className="w-4 h-4" />,
    color: 'text-pink-600',
    bg: 'bg-pink-50',
    links: [
      { href: '/?stream=Design', label: 'Top Design Colleges' },
      { href: '/?stream=Design&course=B.Des', label: 'B.Des Programs' },
      { href: '/predictor?exam=NID', label: 'NID Entrance Predictor' },
      { href: '/?stream=Design&state=Maharashtra', label: 'Design Colleges in Mumbai' },
    ],
  },
  {
    label: 'Study Abroad',
    icon: <Globe className="w-4 h-4" />,
    color: 'text-cyan-600',
    bg: 'bg-cyan-50',
    links: [
      { href: '#', label: 'Universities in USA' },
      { href: '#', label: 'Universities in UK' },
      { href: '#', label: 'Universities in Canada' },
      { href: '#', label: 'Universities in Australia' },
      { href: '#', label: 'IELTS Preparation' },
    ],
  },
];

const QUICK_LINKS = [
  { href: '/predictor', label: 'Predictor', icon: <Calculator className="w-3.5 h-3.5" /> },
  { href: '/compare',   label: 'Compare',   icon: <BookOpen className="w-3.5 h-3.5" /> },
  { href: '/?sort=ranking', label: 'Rankings', icon: <Trophy className="w-3.5 h-3.5" /> },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeStream, setActiveStream] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const megaRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      window.location.href = `/?search=${encodeURIComponent(searchVal.trim())}`;
    }
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-md shadow-slate-200/60 border-b border-slate-100' : 'bg-white border-b border-slate-100'
    }`}>

      {/* ── Main bar ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-4">

          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:shadow-indigo-300 transition-shadow">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:flex flex-col leading-none">
              <span className="font-extrabold text-base text-slate-900 tracking-tight" style={{fontFamily:'Outfit,sans-serif'}}>CollegeMitra</span>
              <span className="text-[9px] font-semibold text-slate-400 tracking-widest uppercase">Smart College Discovery</span>
            </div>
          </Link>

          {/* Stream mega-menu trigger */}
          <nav className="hidden lg:flex items-center gap-0.5 ml-2" onMouseLeave={() => setActiveStream(null)}>
            {STREAMS.map(s => (
              <button
                key={s.label}
                onMouseEnter={() => setActiveStream(s.label)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  activeStream === s.label ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {s.label}
                <ChevronDown className={`w-3 h-3 transition-transform duration-150 ${activeStream === s.label ? 'rotate-180' : ''}`} />
              </button>
            ))}
          </nav>

          <div className="flex-1" />

          {/* Search toggle */}
          {searchOpen ? (
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 flex-1 max-w-xs animate-scale-in">
              <input
                ref={searchRef}
                type="text"
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                placeholder="Search colleges, exams..."
                className="input-base text-xs h-9 flex-1"
              />
              <button type="button" onClick={() => setSearchOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <button onClick={() => setSearchOpen(true)} className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
              <Search className="w-4.5 h-4.5" />
            </button>
          )}

          {/* Quick links */}
          <div className="hidden md:flex items-center gap-1">
            {QUICK_LINKS.map(l => (
              <Link key={l.href} href={l.href}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors">
                {l.icon}{l.label}
              </Link>
            ))}
          </div>

          {/* Counselling CTA */}
          <a href="#" className="hidden md:flex btn-primary text-xs py-2 px-4 shrink-0">
            <Users className="w-3.5 h-3.5" />
            Free Guidance
          </a>

          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── Mega menu dropdown ── */}
      {activeStream && (
        <div
          ref={megaRef}
          className="absolute top-full left-0 right-0 bg-white border-t border-slate-100 shadow-xl shadow-slate-200/50 mega-menu z-50"
          onMouseEnter={() => setActiveStream(activeStream)}
          onMouseLeave={() => setActiveStream(null)}
        >
          <div className="max-w-7xl mx-auto px-8 py-6">
            {STREAMS.filter(s => s.label === activeStream).map(stream => (
              <div key={stream.label} className="flex gap-8">
                <div className={`flex items-center gap-3 ${stream.color} shrink-0 w-36`}>
                  <div className={`p-3 rounded-xl ${stream.bg}`}>{stream.icon}</div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{stream.label}</p>
                    <p className="text-xs text-slate-500">Explore all</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-x-8 gap-y-2 flex-1">
                  {stream.links.map(l => (
                    <Link key={l.href} href={l.href} onClick={() => setActiveStream(null)}
                      className="flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 px-2 py-1.5 rounded-lg transition-colors">
                      <span className="w-1 h-1 bg-slate-300 rounded-full shrink-0" />
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 animate-slide-down">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {STREAMS.map(s => (
              <div key={s.label}>
                <button
                  onClick={() => setActiveStream(activeStream === s.label ? null : s.label)}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <span className="flex items-center gap-2">{s.icon}{s.label}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeStream === s.label ? 'rotate-180' : ''}`} />
                </button>
                {activeStream === s.label && (
                  <div className="ml-4 mt-1 space-y-1 animate-slide-down">
                    {s.links.map(l => (
                      <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                        className="block px-4 py-2 text-sm text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors">
                        {l.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              {QUICK_LINKS.map(l => (
                <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl transition-colors">
                  {l.icon}{l.label}
                </Link>
              ))}
              <a href="#" className="btn-primary justify-center mt-2">
                <Users className="w-4 h-4" />Get Free Guidance
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}