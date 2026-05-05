'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  GraduationCap, Search, Menu, X, ChevronDown,
  Cpu, Stethoscope, Briefcase, Scale, Palette, Globe,
  BookOpen, Trophy, Calculator, Zap, Bell,
  UserCircle, Bookmark, LogIn, ChevronRight,
  ArrowRight, LayoutGrid,
} from 'lucide-react';

/* ─── Data ───────────────────────────────────────────────────────────────── */
const STREAMS = [
  {
    label: 'Engineering', short: 'Engg',
    icon: <Cpu className="w-4 h-4" />,
    grad: 'from-blue-600 to-cyan-500', color: 'text-blue-600', bg: 'bg-blue-50',
    links: [
      { href: '/?stream=Engineering', label: 'All Engineering Colleges' },
      { href: '/?stream=Engineering&course=B.Tech', label: 'B.Tech Colleges' },
      { href: '/predictor?exam=JEE Main', label: 'JEE Main Predictor' },
      { href: '/predictor?exam=JEE Advanced', label: 'JEE Advanced Predictor' },
      { href: '/?stream=Engineering&type=Government', label: 'IITs & NITs' },
    ],
  },
  {
    label: 'MBA', short: 'MBA',
    icon: <Briefcase className="w-4 h-4" />,
    grad: 'from-violet-600 to-purple-500', color: 'text-violet-600', bg: 'bg-violet-50',
    links: [
      { href: '/?stream=MBA', label: 'All MBA Colleges' },
      { href: '/?stream=MBA&type=Government', label: 'IIMs & Top B-Schools' },
      { href: '/predictor?exam=CAT', label: 'CAT Predictor' },
      { href: '/predictor?exam=XAT', label: 'XAT Predictor' },
      { href: '/?stream=MBA&state=Maharashtra', label: 'MBA in Mumbai/Pune' },
    ],
  },
  {
    label: 'Medical', short: 'Medical',
    icon: <Stethoscope className="w-4 h-4" />,
    grad: 'from-rose-600 to-pink-500', color: 'text-rose-600', bg: 'bg-rose-50',
    links: [
      { href: '/?stream=Medical', label: 'All Medical Colleges' },
      { href: '/?stream=Medical&course=MBBS', label: 'MBBS Colleges' },
      { href: '/predictor?exam=NEET', label: 'NEET Predictor' },
      { href: '/?stream=Medical&type=Government', label: 'Govt Medical Colleges' },
      { href: '/?stream=Medical&state=Tamil Nadu', label: 'Medical in Tamil Nadu' },
    ],
  },
  {
    label: 'Law', short: 'Law',
    icon: <Scale className="w-4 h-4" />,
    grad: 'from-amber-600 to-orange-500', color: 'text-amber-600', bg: 'bg-amber-50',
    links: [
      { href: '/?stream=Law', label: 'All Law Colleges' },
      { href: '/predictor?exam=CLAT', label: 'CLAT Predictor' },
      { href: '/?stream=Law&course=LLB', label: 'LLB Colleges' },
      { href: '/?stream=Law&type=Government', label: 'NLUs & Govt Law Schools' },
    ],
  },
  {
    label: 'Design', short: 'Design',
    icon: <Palette className="w-4 h-4" />,
    grad: 'from-pink-600 to-fuchsia-500', color: 'text-pink-600', bg: 'bg-pink-50',
    links: [
      { href: '/?stream=Design', label: 'All Design Colleges' },
      { href: '/?stream=Design', label: 'NID & NIFT Programs' },
      { href: '/predictor?exam=UCEED', label: 'UCEED Predictor' },
      { href: '/?stream=Design&state=Maharashtra', label: 'Design in Mumbai' },
    ],
  },
  {
    label: 'Study Abroad', short: 'Abroad',
    icon: <Globe className="w-4 h-4" />,
    grad: 'from-cyan-600 to-teal-500', color: 'text-cyan-600', bg: 'bg-cyan-50',
    links: [
      { href: '/study-abroad', label: '🇺🇸 Universities in USA' },
      { href: '/study-abroad', label: '🇬🇧 Universities in UK' },
      { href: '/study-abroad', label: '🇨🇦 Universities in Canada' },
      { href: '/study-abroad', label: '🇦🇺 Universities in Australia' },
      { href: '/study-abroad', label: '🇩🇪 Universities in Germany' },
    ],
  },
];

const STRIP_TOOLS = [
  { href: '/predictor', label: 'Predictor', icon: <Calculator className="w-3.5 h-3.5" /> },
  { href: '/compare',   label: 'Compare',   icon: <BookOpen className="w-3.5 h-3.5" /> },
  { href: '/?sort=rating', label: 'Rankings', icon: <Trophy className="w-3.5 h-3.5" /> },
];

const ANNOUNCEMENTS = [
  '🔥 JEE Advanced 2026 results declared — Check your rank now!',
  '⚡ NEET UG 2026 counselling starts May 20 — Don\'t miss the deadline',
  '🎯 CAT 2026 registration opens August 1 — Start preparing now',
  '✨ CollegeMitra AI — Get personalized recommendations instantly',
];

const PROFILE_MENU = [
  { icon: <UserCircle className="w-4 h-4" />, label: 'My Profile',       href: '#' },
  { icon: <Bookmark className="w-4 h-4" />,    label: 'Saved Colleges',  href: '#' },
  { icon: <LayoutGrid className="w-4 h-4" />,  label: 'My Applications', href: '#' },
  { icon: <LogIn className="w-4 h-4" />,       label: 'Sign In / Sign Up', href: '#' },
];

/* ─── Component ──────────────────────────────────────────────────────────── */
export default function Navbar() {
  const router = useRouter();
  const [mobileOpen,          setMobileOpen]          = useState(false);
  const [activeStream,        setActiveStream]        = useState<string | null>(null);
  const [scrolled,            setScrolled]            = useState(false);
  const [searchFocused,       setSearchFocused]       = useState(false);
  const [searchVal,           setSearchVal]           = useState('');
  const [announcementIdx,     setAnnouncementIdx]     = useState(0);
  const [announcementVisible, setAnnouncementVisible] = useState(true);
  const [profileOpen,         setProfileOpen]         = useState(false);

  const megaRef    = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef  = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setAnnouncementIdx(i => (i + 1) % ANNOUNCEMENTS.length), 4000);
    return () => clearInterval(t);
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      router.push(`/?search=${encodeURIComponent(searchVal.trim())}`);
      setSearchFocused(false);
    }
  }, [searchVal, router]);

  return (
    <header className="sticky top-0 z-50">

      {/* ── Announcement strip ── */}
      {announcementVisible && (
        <div className="announcement-bar py-1.5 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Bell className="w-3 h-3 text-white/80 shrink-0" />
              <span key={announcementIdx} className="text-white text-xs font-medium truncate animate-fade-in">
                {ANNOUNCEMENTS[announcementIdx]}
              </span>
            </div>
            <button onClick={() => setAnnouncementVisible(false)}
              className="ml-3 shrink-0 text-white/60 hover:text-white transition-colors p-0.5">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ── Row 1: Main bar ── */}
      <div className={`transition-all duration-300 ${
        scrolled
          ? 'bg-white/97 backdrop-blur-xl shadow-md shadow-black/8 border-b border-slate-100'
          : 'bg-white border-b border-slate-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-[60px] gap-3">

            {/* Brand */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group mr-2">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-md shadow-indigo-200/60 group-hover:scale-105 transition-transform duration-200">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:flex flex-col leading-none">
                <span className="font-extrabold text-[15px] text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit,sans-serif' }}>
                  College<span style={{ background: 'linear-gradient(135deg,#818cf8,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Mitra</span>
                </span>
                <span className="text-[9px] font-semibold text-slate-400 tracking-widest uppercase">Smart Discovery</span>
              </div>
            </Link>

            {/* Search bar — grows to fill center */}
            <form onSubmit={handleSearch} className="flex-1 max-w-xl">
              <div className={`relative flex items-center transition-all duration-200 ${
                searchFocused ? 'ring-2 ring-indigo-300 rounded-xl' : ''
              }`}>
                <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchVal}
                  onChange={e => setSearchVal(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  placeholder="Search colleges, exams, courses..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-300 focus:bg-white transition-all duration-200"
                />
                {searchVal && (
                  <button type="button" onClick={() => setSearchVal('')}
                    className="absolute right-10 text-slate-400 hover:text-slate-600 p-1">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <button type="submit"
                  className="absolute right-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors shrink-0">
                  Go
                </button>
              </div>
            </form>

            {/* Right actions */}
            <div className="flex items-center gap-2 shrink-0 ml-auto">

              {/* User profile avatar */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-all duration-200 ${
                    profileOpen
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
                  aria-label="User profile"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-400 to-cyan-400 flex items-center justify-center shrink-0">
                    <UserCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="hidden sm:block text-xs font-semibold">Profile</span>
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 hidden sm:block ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Profile dropdown */}
                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/70 py-2 animate-scale-in z-50">
                    <div className="px-4 py-3 border-b border-slate-100 mb-1">
                      <p className="text-xs font-bold text-slate-800">Welcome!</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Sign in to save colleges & track applications</p>
                    </div>
                    {PROFILE_MENU.map(item => (
                      <Link key={item.label} href={item.href}
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 transition-colors mx-1 rounded-xl">
                        <span className="text-slate-400">{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Free Guidance CTA — always fully visible */}
              <a href="#"
                className="hidden sm:flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 px-4 rounded-xl transition-all duration-200 shrink-0 whitespace-nowrap shadow-sm shadow-indigo-200/80 hover:shadow-indigo-300/80 hover:-translate-y-0.5">
                <Zap className="w-3.5 h-3.5 shrink-0" />
                Free Guidance
              </a>

              {/* Mobile hamburger */}
              <button onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors shrink-0">
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 2: Stream strip ── */}
      <div className="bg-white border-b border-slate-100 shadow-sm hidden lg:block"
        onMouseLeave={() => setActiveStream(null)}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-10 gap-1">
            {/* Stream tabs */}
            {STREAMS.map(s => (
              <button
                key={s.label}
                onMouseEnter={() => setActiveStream(s.label)}
                onClick={() => { setActiveStream(null); router.push(`/?stream=${s.label}`); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-150 whitespace-nowrap group ${
                  activeStream === s.label
                    ? `${s.bg} ${s.color} font-semibold`
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className={`transition-colors ${activeStream === s.label ? s.color : 'text-slate-400 group-hover:text-slate-600'}`}>
                  {s.icon}
                </span>
                {s.label}
              </button>
            ))}

            {/* Divider */}
            <div className="w-px h-5 bg-slate-200 mx-2 shrink-0" />

            {/* Tool links */}
            {STRIP_TOOLS.map(t => (
              <Link key={t.href} href={t.href}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium text-slate-500 hover:text-indigo-700 hover:bg-indigo-50 transition-colors whitespace-nowrap">
                {t.icon}{t.label}
              </Link>
            ))}
          </div>
        </div>

        {/* ── Mega menu dropdown ── */}
        {activeStream && (
          <div
            ref={megaRef}
            className="absolute left-0 right-0 bg-white border-t border-slate-100 shadow-2xl shadow-slate-300/30 mega-menu z-50"
            onMouseEnter={() => setActiveStream(activeStream)}
            onMouseLeave={() => setActiveStream(null)}
          >
            <div className="max-w-7xl mx-auto px-8 py-6">
              {STREAMS.filter(s => s.label === activeStream).map(stream => (
                <div key={stream.label} className="flex gap-8">
                  {/* Stream card */}
                  <div className="shrink-0 w-48">
                    <div className={`bg-gradient-to-br ${stream.grad} rounded-2xl p-5 text-white h-full flex flex-col justify-between`}>
                      <div>
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                          {stream.icon}
                        </div>
                        <p className="font-black text-lg leading-tight">{stream.label}</p>
                        <p className="text-white/70 text-xs mt-1">Explore all colleges</p>
                      </div>
                      <Link
                        href={`/?stream=${stream.label}`}
                        onClick={() => setActiveStream(null)}
                        className="mt-4 flex items-center gap-1 text-xs font-bold text-white bg-white/20 hover:bg-white/30 transition-colors rounded-lg px-3 py-1.5 w-fit"
                      >
                        View all <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>

                  {/* Links grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 flex-1 content-start">
                    {stream.links.map(l => (
                      <Link
                        key={l.label} href={l.href} onClick={() => setActiveStream(null)}
                        className="flex items-center gap-2.5 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 px-3 py-2.5 rounded-xl transition-all duration-150 group"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${stream.grad} shrink-0 group-hover:scale-150 transition-transform duration-200`} />
                        {l.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 animate-slide-down shadow-xl max-h-[80vh] overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {/* Mobile search */}
            <form onSubmit={handleSearch} className="flex gap-2 mb-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" value={searchVal} onChange={e => setSearchVal(e.target.value)}
                  placeholder="Search colleges..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-indigo-300 transition-colors" />
              </div>
              <button type="submit" className="bg-indigo-600 text-white rounded-xl px-4 text-sm font-semibold">Go</button>
            </form>

            {/* Stream links */}
            {STREAMS.map(s => (
              <div key={s.label}>
                <button
                  onClick={() => setActiveStream(activeStream === s.label ? null : s.label)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    activeStream === s.label ? `${s.bg} ${s.color}` : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-2">{s.icon}{s.label}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${activeStream === s.label ? 'rotate-180' : ''}`} />
                </button>
                {activeStream === s.label && (
                  <div className="ml-4 mt-1 space-y-0.5 animate-slide-down">
                    {s.links.map(l => (
                      <Link key={l.label} href={l.href} onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors">
                        <ChevronRight className="w-3 h-3 text-slate-300" />{l.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Mobile tools + profile */}
            <div className="pt-3 border-t border-slate-100 space-y-1">
              {STRIP_TOOLS.map(t => (
                <Link key={t.href} href={t.href} onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl transition-colors">
                  {t.icon}{t.label}
                </Link>
              ))}
              {PROFILE_MENU.map(item => (
                <Link key={item.label} href={item.href} onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl transition-colors">
                  <span className="text-slate-400">{item.icon}</span>{item.label}
                </Link>
              ))}
              <a href="#" className="flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold text-sm px-4 py-3 rounded-xl mt-2 hover:bg-indigo-700 transition-colors">
                <Zap className="w-4 h-4" />Get Free Guidance
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}