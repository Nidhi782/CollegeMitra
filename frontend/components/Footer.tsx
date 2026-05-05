import Link from 'next/link';
import { GraduationCap, Mail, Phone, Globe, ArrowRight, Cpu, Briefcase, Stethoscope, Scale, BookOpen, MapPin } from 'lucide-react';

const FOOTER_LINKS = {
  Explore: [
    { href: '/', label: 'All Colleges' },
    { href: '/compare', label: 'Compare Colleges' },
    { href: '/predictor', label: 'College Predictor' },
    { href: '/?sort=rating', label: 'Top Ranked' },
  ],
  'By Stream': [
    { href: '/?stream=Engineering', label: 'Engineering Colleges' },
    { href: '/?stream=MBA', label: 'MBA Colleges' },
    { href: '/?stream=Medical', label: 'Medical Colleges' },
    { href: '/?stream=Law', label: 'Law Colleges' },
    { href: '/?stream=Design', label: 'Design Colleges' },
  ],
  'By Type': [
    { href: '/?type=Government', label: 'Government Colleges' },
    { href: '/?type=Private', label: 'Private Colleges' },
    { href: '/?stream=Engineering&type=Government', label: 'IITs & NITs' },
    { href: '/?stream=MBA&type=Government', label: 'IIMs' },
    { href: '/?stream=Medical&type=Government', label: 'AIIMS & Govt Medical' },
  ],
};

const TOP_CITIES = ['Mumbai', 'Delhi', 'Bengaluru', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata'];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-slate-900 text-slate-400 mt-auto">
      {/* CTA banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-cyan-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-white font-black text-lg" style={{fontFamily:'Outfit,sans-serif'}}>Not sure which college to choose?</p>
            <p className="text-white/70 text-sm">Get free personalized guidance from our expert counselors</p>
          </div>
          <a href="#" className="flex items-center gap-2 bg-white text-indigo-700 font-bold text-sm px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors shadow-lg shrink-0">
            Get Free Guidance <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 py-12 border-b border-slate-800">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group w-fit">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-white text-base tracking-tight" style={{fontFamily:'Outfit,sans-serif'}}>CollegeMitra</span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs mb-4">
              India's smartest college discovery platform. Make confident decisions about your education with data-driven insights.
            </p>
            <div className="flex flex-wrap gap-2">
              {TOP_CITIES.map(city => (
                <Link key={city} href={`/?city=${city}`}
                  className="flex items-center gap-1 text-[10px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white px-2 py-1 rounded-lg transition-colors">
                  <MapPin className="w-2.5 h-2.5" />{city}
                </Link>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <p className="text-xs font-black text-slate-300 uppercase tracking-widest mb-4">{title}</p>
              <div className="space-y-2.5">
                {links.map(({ href, label }) => (
                  <Link key={href} href={href}
                    className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-white transition-colors group">
                    <span className="w-1 h-1 rounded-full bg-slate-700 group-hover:bg-indigo-400 transition-colors" />
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-5 text-xs text-slate-600">
        
          <div className="flex items-center gap-1 text-emerald-500 font-semibold">
            
          </div>
        </div>
      </div>
    </footer>
  );
}