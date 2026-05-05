'use client';
import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Sparkles, ChevronDown } from 'lucide-react';
import { FALLBACK_COLLEGES, formatFees, formatPackage } from '../lib/api';

type Category = 'All' | 'Admissions' | 'Fees' | 'Placements' | 'Cutoffs';
interface Msg { role: 'user' | 'bot'; text: string; ts: string; }

const QUICK_Qs: Record<Category, string[]> = {
  All:        ['Best engineering colleges in India?', 'What is CM Score?', 'How does college predictor work?'],
  Admissions: ['How to apply for IIT Bombay?', 'What is the NEET cutoff for AIIMS?', 'Documents required for admission?'],
  Fees:       ['What are IIT fees per year?', 'Cheapest government medical college?', 'Scholarship options for private colleges?'],
  Placements: ['Best placement college for CS?', 'Average salary from IIM Ahmedabad?', 'Which NIT has best placements?'],
  Cutoffs:    ['JEE rank for IIT Delhi?', 'NEET cutoff for government MBBS?', 'CAT score for IIM Ahmedabad?'],
};

const CATEGORIES: Category[] = ['All', 'Admissions', 'Fees', 'Placements', 'Cutoffs'];

function generateResponse(q: string): string {
  const ql = q.toLowerCase();

  // College-specific lookup
  const mention = FALLBACK_COLLEGES.find(c =>
    ql.includes(c.name.toLowerCase()) ||
    ql.includes(c.city.toLowerCase())
  );
  if (mention) {
    if (ql.includes('fee')) return `💰 **${mention.name}** charges approximately **${formatFees(mention.fees)}** per year. It is a ${mention.type.toLowerCase()} institution accredited with **${mention.accreditation}**.`;
    if (ql.includes('placement') || ql.includes('salary') || ql.includes('package')) return `📊 **${mention.name}** has a placement rate of **${mention.placementRate}%** with an average package of **${formatPackage(mention.avgPackage)}/year**. Top recruiters include: ${mention.topRecruiters.slice(0,3).join(', ')}.`;
    if (ql.includes('rating') || ql.includes('rank')) return `⭐ **${mention.name}** has a rating of **${mention.rating}/5** on CollegeMitra. ${mention.nirfRank ? `It is ranked **#${mention.nirfRank}** in the NIRF rankings.` : ''} CM Score: **${Math.round((mention.rating/5)*30 + (mention.placementRate/100)*30)}**.`;
    return `🎓 **${mention.name}** is located in **${mention.location}**. It was established in **${mention.established}** and is ${mention.accreditation ? `accredited **${mention.accreditation}**` : 'a reputed institution'}. It offers: ${mention.courses.slice(0,3).join(', ')} and more.`;
  }

  // Generic answers
  if (ql.includes('cm score') || ql.includes('college mitra score')) return `📊 The **CM Score** is CollegeMitra's proprietary composite score (0-100) calculated from: Rating (30%), Placement Rate (30%), Average Package (20%), and NIRF Ranking (20%). Higher score = better overall value for students.`;
  if (ql.includes('predictor')) return `🔮 Our **College Predictor** tool uses your exam rank + category + state to predict colleges sorted as:\n🟢 **Safe** — very high admission chance\n🟡 **Moderate** — good chance\n🔴 **Reach** — competitive but possible\n\nVisit /predictor to try it!`;
  if (ql.includes('iit fee') || ql.includes('fees iit')) return `💰 **IIT Fees**: B.Tech at most IITs costs **₹2–2.5L per year** for general category. SC/ST students pay only **₹700-1000/year**. This includes tuition, hostel, and mess charges.`;
  if (ql.includes('neet cutoff') || ql.includes('aiims cutoff')) return `📋 **AIIMS Delhi NEET Cutoff** (2024): General — 99.99+ percentile (rank ~50). For other govt medical colleges, cutoffs range from 99.5+ percentile for top colleges to 90+ for state quota seats.`;
  if (ql.includes('cat score') || ql.includes('iim')) return `📋 **IIM CAT Cutoffs** (2024): IIM Ahmedabad & Bangalore require 99+ percentile. IIM Calcutta requires 98+. New IIMs accept from 85+. Final admission also depends on WAT-PI performance.`;
  if (ql.includes('jee rank') || ql.includes('jee cutoff')) return `📋 **JEE Main Cutoffs**: IIT Delhi CSE (Gen) needs **rank under 100**. Top NITs (CSE) require ranks **under 5,000**. BITS Pilani needs BITSAT **~340+**. JEE Advanced is needed for IITs.`;
  if (ql.includes('best') && ql.includes('placement')) {
    const top = [...FALLBACK_COLLEGES].sort((a,b) => b.avgPackage - a.avgPackage).slice(0,3);
    return `🏆 **Best Placement Colleges** (by avg package):\n1. ${top[0].name} — ${formatPackage(top[0].avgPackage)}/yr\n2. ${top[1].name} — ${formatPackage(top[1].avgPackage)}/yr\n3. ${top[2].name} — ${formatPackage(top[2].avgPackage)}/yr`;
  }
  if (ql.includes('cheap') || ql.includes('low fee') || ql.includes('affordable')) {
    const cheap = [...FALLBACK_COLLEGES].sort((a,b) => a.fees - b.fees).slice(0,3);
    return `💸 **Most Affordable Colleges**:\n1. ${cheap[0].name} — ${formatFees(cheap[0].fees)}\n2. ${cheap[1].name} — ${formatFees(cheap[1].fees)}\n3. ${cheap[2].name} — ${formatFees(cheap[2].fees)}`;
  }
  if (ql.includes('scholarship')) return `🎓 **Scholarships Available**:\n• Central Sector Scholarship (merit-based, ₹12,000/yr)\n• NSP portal for SC/ST/OBC\n• State government scholarships\n• Individual college scholarships (contact college directly)\n• Private scholarships via NSP portal`;
  if (ql.includes('document') || ql.includes('apply')) return `📋 **Common Documents for Admission**:\n• Class 10 & 12 marksheets\n• Entrance exam scorecard (JEE/NEET/CAT)\n• Aadhaar card\n• Passport-size photos\n• Category certificate (if applicable)\n• Income certificate (for fee waiver)`;

  return `👋 I'm **MitraAI**, your college discovery assistant! I can help with:\n• **College information** — fees, placements, rankings\n• **Admission cutoffs** — JEE, NEET, CAT and more\n• **Scholarship guidance**\n• **College comparison**\n\nTry asking: "What are the fees at IIT Bombay?" or "Best placement college for MBA?"`;
}

function formatText(text: string) {
  return text.split('\n').map((line, i) => {
    const bold = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return <p key={i} className="mb-1 last:mb-0" dangerouslySetInnerHTML={{ __html: bold }} />;
  });
}

export default function MitraAI() {
  const [open,     setOpen]     = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'bot', text: "👋 Hi! I'm **MitraAI** — ask me anything about colleges, fees, placements, or admissions!", ts: 'now' },
  ]);
  const [input,    setInput]    = useState('');
  const [typing,   setTyping]   = useState(false);
  const [category, setCategory] = useState<Category>('All');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const now = new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' });
    setMessages(p => [...p, { role: 'user', text, ts: now }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(p => [...p, { role: 'bot', text: generateResponse(text), ts: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }) }]);
    }, 800 + Math.random() * 500);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-indigo-600 to-cyan-500 rounded-full shadow-xl shadow-indigo-300/50 flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-transform animate-pulse-glow"
        aria-label="Open MitraAI chat"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 rounded-2xl shadow-2xl shadow-slate-900/30 overflow-hidden animate-slide-up border border-slate-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-cyan-600 p-4">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white text-sm font-bold">MitraAI</p>
                  <p className="text-white/70 text-[10px]">College Discovery Assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-emerald-400/20 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-[10px] text-white/80 font-medium">Online</span>
              </div>
            </div>
            <p className="text-white/60 text-[10px] flex items-center gap-1 mt-1">
              <Sparkles className="w-3 h-3" />
              Experimental — accuracy may vary
            </p>
          </div>

          {/* Category tabs */}
          <div className="flex gap-0.5 px-2 py-2 bg-slate-50 border-b border-slate-100 overflow-x-auto scrollbar-none">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg whitespace-nowrap transition-all ${
                  category === c ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-200'
                }`}>
                {c}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div className="h-72 overflow-y-auto bg-white p-3 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'bot' && (
                  <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center mr-2 shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5 text-indigo-600" />
                  </div>
                )}
                <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none'
                    : 'bg-slate-100 text-slate-700 rounded-bl-none'
                }`}>
                  {formatText(m.text)}
                  <p className={`text-[9px] mt-1 ${m.role === 'user' ? 'text-indigo-200' : 'text-slate-400'}`}>{m.ts}</p>
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center mr-2 shrink-0">
                  <Bot className="w-3.5 h-3.5 text-indigo-600" />
                </div>
                <div className="bg-slate-100 rounded-2xl rounded-bl-none px-3 py-2">
                  <div className="flex gap-1">
                    {[0,1,2].map(i => (
                      <div key={i} className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay:`${i*0.15}s`}} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick questions */}
          <div className="bg-slate-50 px-3 py-2 border-t border-slate-100 flex gap-1.5 overflow-x-auto scrollbar-none">
            {QUICK_Qs[category].map(q => (
              <button key={q} onClick={() => send(q)}
                className="text-[10px] text-indigo-600 bg-indigo-50 hover:bg-indigo-100 font-medium px-2.5 py-1 rounded-full whitespace-nowrap transition-colors shrink-0">
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="bg-white border-t border-slate-100 p-3 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send(input)}
              placeholder="Ask about colleges, exams..."
              className="flex-1 text-xs text-slate-700 placeholder:text-slate-400 outline-none bg-slate-50 rounded-xl px-3 py-2 border border-slate-200 focus:border-indigo-300 transition-colors"
            />
            <button onClick={() => send(input)}
              className="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 rounded-xl flex items-center justify-center text-white transition-colors shrink-0">
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
