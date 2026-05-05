const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface College {
  id: number;
  name: string;
  location: string;
  city: string;
  state: string;
  fees: number;
  rating: number;
  placementRate: number;
  avgPackage: number;
  courses: string[];
  type: string;
  established: number;
  totalStudents: number;
  image: string | null;
  description: string;
  accreditation: string;
  topRecruiters: string[];
  stream?: string;
  nirfRank?: number;
  shortlistedBy?: number;
  cmScore?: number;
}

export interface CollegeListResponse {
  colleges: College[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CollegeFilters {
  search?: string;
  state?: string;
  type?: string;
  course?: string;
  stream?: string;
  minFees?: string;
  maxFees?: string;
  sort?: string;
  page?: number;
  limit?: string;
}

// ─── CM Score algorithm (composite 0–100) ─────────────────────────────────
export function calcCMScore(c: College): number {
  const r = (c.rating / 5) * 30;
  const p = (c.placementRate / 100) * 30;
  const pkg = Math.min((c.avgPackage / 3000000) * 20, 20);
  const nirf = c.nirfRank ? Math.max(0, 20 - (c.nirfRank / 10)) : 10;
  return Math.round(r + p + pkg + nirf);
}

export function getCMTier(score: number): 'high' | 'medium' | 'low' {
  if (score >= 70) return 'high';
  if (score >= 50) return 'medium';
  return 'low';
}

// ─── FALLBACK DATA ─────────────────────────────────────────────────────────
export const FALLBACK_COLLEGES: College[] = [
  { id:1,  name:'IIT Bombay',           location:'Mumbai, Maharashtra',      city:'Mumbai',        state:'Maharashtra',   fees:250000,  rating:4.8, placementRate:98.5, avgPackage:2200000, courses:['B.Tech','M.Tech','MBA','PhD'],           type:'Government', established:1958, totalStudents:10000, image:null, description:'India\'s premier engineering institution, renowned for excellence in technical education, research, and innovation.',accreditation:'NAAC A++', topRecruiters:['Google','Microsoft','Goldman Sachs','McKinsey','Amazon'], stream:'Engineering', nirfRank:3,  shortlistedBy:4821 },
  { id:2,  name:'IIT Delhi',            location:'New Delhi, Delhi',          city:'New Delhi',     state:'Delhi',         fees:240000,  rating:4.8, placementRate:97.8, avgPackage:2100000, courses:['B.Tech','M.Tech','MBA','PhD','M.Sc'],    type:'Government', established:1961, totalStudents:8500,  image:null, description:'Public technical university in South Delhi, producing world-class engineers and researchers for 60+ years.', accreditation:'NAAC A++', topRecruiters:['Google','Apple','JP Morgan','BCG','Flipkart'],            stream:'Engineering', nirfRank:2,  shortlistedBy:5103 },
  { id:3,  name:'IIT Madras',           location:'Chennai, Tamil Nadu',       city:'Chennai',       state:'Tamil Nadu',    fees:230000,  rating:4.9, placementRate:98.2, avgPackage:2300000, courses:['B.Tech','M.Tech','PhD','MBA'],           type:'Government', established:1959, totalStudents:9000,  image:null, description:'Consistently ranked #1 in India by NIRF. A research powerhouse with unmatched academic rigor.',             accreditation:'NAAC A++', topRecruiters:['Qualcomm','Texas Instruments','Microsoft','Samsung','Oracle'],  stream:'Engineering', nirfRank:1,  shortlistedBy:5892 },
  { id:4,  name:'NIT Trichy',           location:'Tiruchirappalli, Tamil Nadu',city:'Tiruchirappalli',state:'Tamil Nadu',  fees:145000,  rating:4.5, placementRate:92.0, avgPackage:1200000, courses:['B.Tech','M.Tech','MBA','MCA'],           type:'Government', established:1964, totalStudents:6000,  image:null, description:'One of India\'s top NITs, known for academic excellence and strong alumni network across industries.',       accreditation:'NAAC A+',  topRecruiters:['TCS','Infosys','Wipro','L&T','Honeywell'],               stream:'Engineering', nirfRank:9,  shortlistedBy:2341 },
  { id:5,  name:'BITS Pilani',          location:'Pilani, Rajasthan',         city:'Pilani',        state:'Rajasthan',     fees:500000,  rating:4.6, placementRate:95.0, avgPackage:1800000, courses:['B.Tech','B.Pharm','MBA','M.Tech','M.Sc'],type:'Private',    established:1964, totalStudents:7000,  image:null, description:'Premier private institution with industry-oriented curriculum, dual-degree flexibility, and exceptional campus life.',accreditation:'NAAC A',   topRecruiters:['Google','Microsoft','Amazon','Goldman Sachs','Uber'],    stream:'Engineering', nirfRank:26, shortlistedBy:3218 },
  { id:6,  name:'VIT Vellore',          location:'Vellore, Tamil Nadu',       city:'Vellore',       state:'Tamil Nadu',    fees:350000,  rating:4.2, placementRate:88.0, avgPackage:950000,  courses:['B.Tech','M.Tech','MBA','MCA','B.Sc'],   type:'Private',    established:1984, totalStudents:35000, image:null, description:'One of the largest private universities in India with excellent placement records and diverse programs.',     accreditation:'NAAC A++', topRecruiters:['TCS','Wipro','Infosys','HCL','Cognizant'],               stream:'Engineering', nirfRank:11, shortlistedBy:2987 },
  { id:7,  name:'Delhi Technological University',location:'New Delhi, Delhi', city:'New Delhi',     state:'Delhi',         fees:180000,  rating:4.3, placementRate:89.0, avgPackage:1100000, courses:['B.Tech','M.Tech','MBA','PhD'],           type:'Government', established:1941, totalStudents:8000,  image:null, description:'One of Delhi\'s premier technical universities. Formerly Delhi College of Engineering, with a 80-year legacy.',accreditation:'NAAC A',   topRecruiters:['Microsoft','Amazon','Samsung','Deloitte','Capgemini'],   stream:'Engineering', nirfRank:36, shortlistedBy:1876 },
  { id:8,  name:'IIIT Hyderabad',       location:'Hyderabad, Telangana',      city:'Hyderabad',     state:'Telangana',     fees:300000,  rating:4.6, placementRate:96.0, avgPackage:1950000, courses:['B.Tech','M.Tech','PhD','MS'],            type:'Private',    established:1998, totalStudents:3000,  image:null, description:'Research university focused on IT and related fields, with one of the highest median packages in India.',  accreditation:'NAAC A',   topRecruiters:['Google','Microsoft','Adobe','Qualcomm','Amazon'],        stream:'Engineering', nirfRank:30, shortlistedBy:2654 },
  { id:9,  name:'Jadavpur University',  location:'Kolkata, West Bengal',      city:'Kolkata',       state:'West Bengal',   fees:50000,   rating:4.4, placementRate:85.0, avgPackage:900000,  courses:['B.Tech','BE','M.Tech','MBA','PhD'],     type:'Government', established:1955, totalStudents:7500,  image:null, description:'Highly regarded public university in Kolkata, with exceptional STEM programs and affordable fees.',         accreditation:'NAAC A++', topRecruiters:['TCS','Wipro','IBM','Tata Steel','Infosys'],              stream:'Engineering', nirfRank:12, shortlistedBy:1432 },
  { id:10, name:'Manipal Institute of Technology',location:'Manipal, Karnataka',city:'Manipal',     state:'Karnataka',     fees:420000,  rating:4.1, placementRate:82.0, avgPackage:800000,  courses:['B.Tech','M.Tech','MBA','MCA','B.Pharm'],type:'Private',    established:1957, totalStudents:14000, image:null, description:'One of India\'s oldest private engineering colleges with strong industry connections and diverse campus.',  accreditation:'NAAC A+',  topRecruiters:['Infosys','Wipro','TCS','Accenture','Cisco'],             stream:'Engineering', nirfRank:40, shortlistedBy:1654 },
  { id:11, name:'IIT Kanpur',           location:'Kanpur, Uttar Pradesh',     city:'Kanpur',        state:'Uttar Pradesh', fees:220000,  rating:4.8, placementRate:97.0, avgPackage:2000000, courses:['B.Tech','M.Tech','MBA','PhD','M.Sc'],   type:'Government', established:1959, totalStudents:8200,  image:null, description:'Pioneer in computer science education in India. Known for cutting-edge research and innovation ecosystem.',  accreditation:'NAAC A++', topRecruiters:['Google','Microsoft','Facebook','Amazon','D.E. Shaw'],    stream:'Engineering', nirfRank:4,  shortlistedBy:4502 },
  { id:12, name:'IIT Kharagpur',        location:'Kharagpur, West Bengal',    city:'Kharagpur',     state:'West Bengal',   fees:210000,  rating:4.7, placementRate:96.5, avgPackage:1900000, courses:['B.Tech','M.Tech','MBA','PhD','BArch'],  type:'Government', established:1951, totalStudents:12000, image:null, description:'India\'s first IIT and one of the world\'s most respected engineering universities with a sprawling campus.',accreditation:'NAAC A++', topRecruiters:['Google','Microsoft','Goldman Sachs','Schlumberger','Samsung'],stream:'Engineering',nirfRank:5, shortlistedBy:4108 },
  { id:13, name:'IIM Ahmedabad',        location:'Ahmedabad, Gujarat',        city:'Ahmedabad',     state:'Gujarat',       fees:2300000, rating:4.9, placementRate:100,  avgPackage:3500000, courses:['MBA','PhD','Executive MBA'],            type:'Government', established:1961, totalStudents:1200,  image:null, description:'India\'s top business school. A cradle of corporate leaders and entrepreneurs with 100% placement record.',accreditation:'NAAC A++', topRecruiters:['McKinsey','BCG','Bain','Goldman Sachs','Amazon'],        stream:'MBA',         nirfRank:1,  shortlistedBy:8921 },
  { id:14, name:'IIM Bangalore',        location:'Bengaluru, Karnataka',      city:'Bengaluru',     state:'Karnataka',     fees:2400000, rating:4.9, placementRate:100,  avgPackage:3200000, courses:['MBA','PhD','Executive MBA'],            type:'Government', established:1973, totalStudents:1400,  image:null, description:'Second oldest IIM, consistently ranked top 3 in India. Known for entrepreneurship and strong alumni network.',accreditation:'NAAC A++',topRecruiters:['McKinsey','BCG','Amazon','Flipkart','Paytm'],           stream:'MBA',         nirfRank:2,  shortlistedBy:7843 },
  { id:15, name:'IIM Calcutta',         location:'Kolkata, West Bengal',      city:'Kolkata',       state:'West Bengal',   fees:2500000, rating:4.8, placementRate:100,  avgPackage:3100000, courses:['MBA','PhD','Executive MBA'],            type:'Government', established:1961, totalStudents:1100,  image:null, description:'One of the oldest and most prestigious IIMs, known for its rigorous curriculum and finance specialization.',accreditation:'NAAC A++', topRecruiters:['Goldman Sachs','JP Morgan','Bain','McKinsey','Citi'],    stream:'MBA',         nirfRank:3,  shortlistedBy:6543 },
  { id:16, name:'AIIMS Delhi',          location:'New Delhi, Delhi',          city:'New Delhi',     state:'Delhi',         fees:6000,    rating:4.9, placementRate:100,  avgPackage:1200000, courses:['MBBS','MD','MS','PhD','B.Sc Nursing'],  type:'Government', established:1956, totalStudents:3500,  image:null, description:'India\'s top medical institution. Extremely competitive NEET cutoff but unmatched medical education quality.',accreditation:'NAAC A++',topRecruiters:['AIIMS','PGI','Medanta','Apollo','Max Healthcare'],      stream:'Medical',     nirfRank:1,  shortlistedBy:12032 },
  { id:17, name:'CMC Vellore',          location:'Vellore, Tamil Nadu',       city:'Vellore',       state:'Tamil Nadu',    fees:50000,   rating:4.8, placementRate:98.0, avgPackage:900000,  courses:['MBBS','MD','MS','B.Sc Nursing'],        type:'Private',    established:1900, totalStudents:2800,  image:null, description:'One of the oldest and most reputed medical colleges in Asia. Known for compassionate care and research.',   accreditation:'NAAC A++', topRecruiters:['CMC Hospital','Apollo','Fortis','AIIMS','Government Hospitals'],stream:'Medical',  nirfRank:3,  shortlistedBy:5412 },
  { id:18, name:'NLS Bengaluru',        location:'Bengaluru, Karnataka',      city:'Bengaluru',     state:'Karnataka',     fees:300000,  rating:4.8, placementRate:95.0, avgPackage:1400000, courses:['LLB','LLM','PhD'],                      type:'Government', established:1987, totalStudents:800,   image:null, description:'India\'s top law school. NLSIU Bangalore is the gold standard for legal education in South Asia.',          accreditation:'NAAC A++', topRecruiters:['AZB','Trilegal','Cyril Amarchand','Khaitan','S&R'],      stream:'Law',         nirfRank:1,  shortlistedBy:3201 },
  { id:19, name:'NIT Warangal',         location:'Warangal, Telangana',       city:'Warangal',      state:'Telangana',     fees:140000,  rating:4.4, placementRate:91.0, avgPackage:1100000, courses:['B.Tech','M.Tech','MBA','PhD'],           type:'Government', established:1959, totalStudents:5500,  image:null, description:'Consistently ranked among the top NITs in India with strong industry tie-ups and excellent placements.',  accreditation:'NAAC A+',  topRecruiters:['Microsoft','Amazon','Deloitte','TCS','Samsung'],         stream:'Engineering', nirfRank:15, shortlistedBy:1987 },
  { id:20, name:'IIIT Bangalore',       location:'Bengaluru, Karnataka',      city:'Bengaluru',     state:'Karnataka',     fees:320000,  rating:4.5, placementRate:94.0, avgPackage:1700000, courses:['B.Tech','M.Tech','PhD','MS'],            type:'Private',    established:1999, totalStudents:2500,  image:null, description:'Autonomous institution focused on IT research, with some of the highest packages in the Bangalore ecosystem.', accreditation:'NAAC A', topRecruiters:['Google','Amazon','Flipkart','Adobe','Oracle'],           stream:'Engineering', nirfRank:55, shortlistedBy:2109 },
];

// ─── Client-side fallback filter ──────────────────────────────────────────
function filterFallback(colleges: College[], f: CollegeFilters): CollegeListResponse {
  let list = [...colleges];
  if (f.search)  list = list.filter(c => c.name.toLowerCase().includes(f.search!.toLowerCase()));
  if (f.state)   list = list.filter(c => c.state.toLowerCase() === f.state!.toLowerCase());
  if (f.type)    list = list.filter(c => c.type.toLowerCase() === f.type!.toLowerCase());
  if (f.course)  list = list.filter(c => c.courses.includes(f.course!));
  if (f.stream)  list = list.filter(c => c.stream?.toLowerCase() === f.stream!.toLowerCase());
  if (f.maxFees) list = list.filter(c => c.fees <= parseInt(f.maxFees!));
  if (f.minFees) list = list.filter(c => c.fees >= parseInt(f.minFees!));

  // Sort
  if (f.sort === 'fees_asc')       list.sort((a,b) => a.fees - b.fees);
  else if (f.sort === 'fees_desc') list.sort((a,b) => b.fees - a.fees);
  else if (f.sort === 'placement') list.sort((a,b) => b.placementRate - a.placementRate);
  else if (f.sort === 'package')   list.sort((a,b) => b.avgPackage - a.avgPackage);
  else                             list.sort((a,b) => b.rating - a.rating); // default

  // Attach CM Score
  list = list.map(c => ({ ...c, cmScore: calcCMScore(c) }));

  const page  = f.page || 1;
  const limit = parseInt(f.limit || '12');
  return {
    colleges:   list.slice((page-1)*limit, page*limit),
    total:      list.length,
    page,
    totalPages: Math.ceil(list.length / limit),
  };
}

// ─── API Functions ─────────────────────────────────────────────────────────
export async function fetchColleges(filters: CollegeFilters = {}): Promise<CollegeListResponse> {
  try {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k,v]) => { if (v !== undefined && v !== '') params.set(k, String(v)); });
    const res = await fetch(`${API_URL}/colleges?${params}`, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    return { ...data, colleges: data.colleges.map((c: College) => ({ ...c, cmScore: calcCMScore(c) })) };
  } catch {
    return filterFallback(FALLBACK_COLLEGES, filters);
  }
}

export async function fetchCollege(id: number): Promise<College> {
  try {
    const res = await fetch(`${API_URL}/colleges/${id}`, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) throw new Error('Not found');
    const c = await res.json();
    return { ...c, cmScore: calcCMScore(c) };
  } catch {
    const c = FALLBACK_COLLEGES.find(c => c.id === id);
    if (!c) throw new Error('College not found');
    return { ...c, cmScore: calcCMScore(c) };
  }
}

export async function compareColleges(ids: number[]): Promise<College[]> {
  try {
    const res = await fetch(`${API_URL}/colleges/compare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) throw new Error('API error');
    return res.json();
  } catch {
    return FALLBACK_COLLEGES.filter(c => ids.includes(c.id)).map(c => ({ ...c, cmScore: calcCMScore(c) }));
  }
}

export async function fetchStates(): Promise<string[]> {
  try {
    const res = await fetch(`${API_URL}/filters/states`, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) throw new Error('API error');
    return res.json();
  } catch {
    return [...new Set(FALLBACK_COLLEGES.map(c => c.state))].sort();
  }
}

export function formatFees(fees: number): string {
  if (fees >= 1000000) return `₹${(fees/100000).toFixed(0)}L/yr`;
  if (fees >= 100000)  return `₹${(fees/100000).toFixed(1)}L/yr`;
  if (fees >= 1000)    return `₹${(fees/1000).toFixed(0)}K/yr`;
  return `₹${fees}/yr`;
}

export function formatPackage(pkg: number): string {
  if (pkg >= 10000000) return `₹${(pkg/10000000).toFixed(1)}Cr`;
  if (pkg >= 100000)   return `₹${(pkg/100000).toFixed(1)}L`;
  return `₹${pkg}`;
}

export const STREAMS = ['Engineering', 'MBA', 'Medical', 'Law', 'Design', 'Science', 'Commerce'];
export const COURSES = ['B.Tech', 'M.Tech', 'MBA', 'MBBS', 'LLB', 'B.Sc', 'B.Com', 'BBA', 'MCA', 'PhD'];
export const EXAMS = [
  { name:'JEE Main',  stream:'Engineering', count:'~12 Lakh', date:'Jan/Apr' },
  { name:'JEE Advanced', stream:'Engineering', count:'~1.8 Lakh', date:'May' },
  { name:'NEET',      stream:'Medical',      count:'~24 Lakh', date:'May' },
  { name:'CAT',       stream:'MBA',          count:'~3.5 Lakh', date:'Nov' },
  { name:'CLAT',      stream:'Law',          count:'~80K',     date:'Dec' },
  { name:'GATE',      stream:'Engineering',  count:'~9 Lakh',  date:'Feb' },
  { name:'CUET',      stream:'Science/Arts', count:'~14 Lakh', date:'May' },
  { name:'XAT',       stream:'MBA',          count:'~1.1 Lakh', date:'Jan' },
  { name:'BITSAT',    stream:'Engineering',  count:'~3 Lakh',  date:'May' },
  { name:'NMAT',      stream:'MBA',          count:'~88K',     date:'Oct-Dec' },
  { name:'MAT',       stream:'MBA',          count:'~80K',     date:'Feb/May/Sep/Dec' },
  { name:'VITEEE',    stream:'Engineering',  count:'~2 Lakh',  date:'Apr' },
];