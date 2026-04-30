import Link from 'next/link';
import { GraduationCap, Mail, ExternalLink } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 py-12 border-b border-slate-800">

          {/* Brand column */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-3 group w-fit">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-white text-base tracking-tight">CollegeMitra</span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              India's college discovery and comparison platform. Make smarter decisions about your education.
            </p>
            <div className="flex items-center gap-1.5 mt-4 text-xs font-semibold text-emerald-400">
              
            </div>
          </div>

          {/* Quick links */}
          <div>
            <p className="text-xs font-black text-slate-300 uppercase tracking-widest mb-4">Explore</p>
            <div className="space-y-2.5">
              {[
                { href: '/',         label: 'Browse All Colleges' },
                { href: '/compare',  label: 'Compare Colleges' },
                { href: '/?type=Government', label: 'Government Colleges' },
                { href: '/?type=Private',    label: 'Private Colleges' },
              ].map(({ href, label }) => (
                <Link key={href} href={href}
                  className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-white transition-colors group">
                  <span className="w-1 h-1 rounded-full bg-slate-600 group-hover:bg-blue-400 transition-colors" />
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* About */}
          <div>
            <p className="text-xs font-black text-slate-300 uppercase tracking-widest mb-4">About</p>
            <div className="space-y-2.5">
              
              <div className="flex items-center gap-2 pt-1">
                <Mail className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                <span className="text-xs text-slate-600">Full-stack MVP · 2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="flex items-center gap-4">
  <span className="text-slate-700">
    © {new Date().getFullYear()} CollegeMitra · Discover & compare top colleges in India
  </span>
</div>
      </div>
    </footer>
  );
}