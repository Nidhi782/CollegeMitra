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
  minFees?: string;
  maxFees?: string;
  page?: number;
  limit?: string;
}

// ─── FALLBACK DATA (used when backend is unreachable) ─────────────────────────
export const FALLBACK_COLLEGES: College[] = [
  { id: 1, name: "IIT Bombay", location: "Mumbai, Maharashtra", city: "Mumbai", state: "Maharashtra", fees: 250000, rating: 4.8, placementRate: 98.5, avgPackage: 2200000, courses: ["B.Tech", "M.Tech", "MBA", "PhD"], type: "Government", established: 1958, totalStudents: 10000, image: null, description: "IIT Bombay is one of India's premier engineering institutions, renowned for excellence in technical education and research.", accreditation: "NAAC A++", topRecruiters: ["Google", "Microsoft", "Goldman Sachs", "McKinsey", "Amazon"] },
  { id: 2, name: "IIT Delhi", location: "New Delhi, Delhi", city: "New Delhi", state: "Delhi", fees: 240000, rating: 4.8, placementRate: 97.8, avgPackage: 2100000, courses: ["B.Tech", "M.Tech", "MBA", "PhD", "M.Sc"], type: "Government", established: 1961, totalStudents: 8500, image: null, description: "IIT Delhi is a public technical university located in Hauz Khas area of South Delhi.", accreditation: "NAAC A++", topRecruiters: ["Google", "Apple", "JP Morgan", "BCG", "Flipkart"] },
  { id: 3, name: "IIT Madras", location: "Chennai, Tamil Nadu", city: "Chennai", state: "Tamil Nadu", fees: 230000, rating: 4.9, placementRate: 98.2, avgPackage: 2300000, courses: ["B.Tech", "M.Tech", "PhD", "MBA"], type: "Government", established: 1959, totalStudents: 9000, image: null, description: "IIT Madras is consistently ranked as India's top engineering institution by NIRF.", accreditation: "NAAC A++", topRecruiters: ["Qualcomm", "Texas Instruments", "Microsoft", "Samsung", "Oracle"] },
  { id: 4, name: "NIT Trichy", location: "Tiruchirappalli, Tamil Nadu", city: "Tiruchirappalli", state: "Tamil Nadu", fees: 145000, rating: 4.5, placementRate: 92.0, avgPackage: 1200000, courses: ["B.Tech", "M.Tech", "MBA", "MCA"], type: "Government", established: 1964, totalStudents: 6000, image: null, description: "NIT Trichy is one of the top National Institutes of Technology in India.", accreditation: "NAAC A+", topRecruiters: ["TCS", "Infosys", "Wipro", "L&T", "Honeywell"] },
  { id: 5, name: "BITS Pilani", location: "Pilani, Rajasthan", city: "Pilani", state: "Rajasthan", fees: 500000, rating: 4.6, placementRate: 95.0, avgPackage: 1800000, courses: ["B.Tech", "B.Pharm", "MBA", "M.Tech", "M.Sc"], type: "Private", established: 1964, totalStudents: 7000, image: null, description: "BITS Pilani is a premier private engineering institution known for its industry-oriented curriculum.", accreditation: "NAAC A", topRecruiters: ["Google", "Microsoft", "Amazon", "Goldman Sachs", "Uber"] },
  { id: 6, name: "VIT Vellore", location: "Vellore, Tamil Nadu", city: "Vellore", state: "Tamil Nadu", fees: 350000, rating: 4.2, placementRate: 88.0, avgPackage: 950000, courses: ["B.Tech", "M.Tech", "MBA", "MCA", "B.Sc"], type: "Private", established: 1984, totalStudents: 35000, image: null, description: "VIT Vellore is one of the largest private universities in India with excellent placement records.", accreditation: "NAAC A++", topRecruiters: ["TCS", "Wipro", "Infosys", "HCL", "Cognizant"] },
  { id: 7, name: "Delhi Technological University", location: "New Delhi, Delhi", city: "New Delhi", state: "Delhi", fees: 180000, rating: 4.3, placementRate: 89.0, avgPackage: 1100000, courses: ["B.Tech", "M.Tech", "MBA", "PhD"], type: "Government", established: 1941, totalStudents: 8000, image: null, description: "DTU is one of Delhi's premier technical universities, formerly known as Delhi College of Engineering.", accreditation: "NAAC A", topRecruiters: ["Microsoft", "Amazon", "Samsung", "Deloitte", "Capgemini"] },
  { id: 8, name: "IIIT Hyderabad", location: "Hyderabad, Telangana", city: "Hyderabad", state: "Telangana", fees: 300000, rating: 4.6, placementRate: 96.0, avgPackage: 1950000, courses: ["B.Tech", "M.Tech", "PhD", "MS"], type: "Private", established: 1998, totalStudents: 3000, image: null, description: "IIIT Hyderabad is a research university focusing on IT and related fields with strong industry ties.", accreditation: "NAAC A", topRecruiters: ["Google", "Microsoft", "Adobe", "Qualcomm", "Amazon"] },
  { id: 9, name: "Jadavpur University", location: "Kolkata, West Bengal", city: "Kolkata", state: "West Bengal", fees: 50000, rating: 4.4, placementRate: 85.0, avgPackage: 900000, courses: ["B.Tech", "BE", "M.Tech", "MBA", "PhD"], type: "Government", established: 1955, totalStudents: 7500, image: null, description: "Jadavpur University is a public university in Kolkata, highly regarded for engineering and sciences.", accreditation: "NAAC A++", topRecruiters: ["TCS", "Wipro", "IBM", "Tata Steel", "Infosys"] },
  { id: 10, name: "Manipal Institute of Technology", location: "Manipal, Karnataka", city: "Manipal", state: "Karnataka", fees: 420000, rating: 4.1, placementRate: 82.0, avgPackage: 800000, courses: ["B.Tech", "M.Tech", "MBA", "MCA", "B.Pharm"], type: "Private", established: 1957, totalStudents: 14000, image: null, description: "MIT Manipal is one of India's oldest and most respected private engineering colleges.", accreditation: "NAAC A+", topRecruiters: ["Infosys", "Wipro", "TCS", "Accenture", "Cisco"] },
  { id: 11, name: "IIT Kanpur", location: "Kanpur, Uttar Pradesh", city: "Kanpur", state: "Uttar Pradesh", fees: 220000, rating: 4.8, placementRate: 97.0, avgPackage: 2000000, courses: ["B.Tech", "M.Tech", "MBA", "PhD", "M.Sc"], type: "Government", established: 1959, totalStudents: 8200, image: null, description: "IIT Kanpur is among India's top technical institutions, known for pioneering research and innovation.", accreditation: "NAAC A++", topRecruiters: ["Google", "Microsoft", "Facebook", "Amazon", "D.E. Shaw"] },
  { id: 12, name: "IIT Kharagpur", location: "Kharagpur, West Bengal", city: "Kharagpur", state: "West Bengal", fees: 210000, rating: 4.7, placementRate: 96.5, avgPackage: 1900000, courses: ["B.Tech", "M.Tech", "MBA", "PhD", "BArch"], type: "Government", established: 1951, totalStudents: 12000, image: null, description: "IIT Kharagpur is India's first IIT and remains one of the world's most respected engineering universities.", accreditation: "NAAC A++", topRecruiters: ["Google", "Microsoft", "Goldman Sachs", "Schlumberger", "Samsung"] },
  { id: 13, name: "NIT Warangal", location: "Warangal, Telangana", city: "Warangal", state: "Telangana", fees: 140000, rating: 4.4, placementRate: 91.0, avgPackage: 1100000, courses: ["B.Tech", "M.Tech", "MBA", "PhD"], type: "Government", established: 1959, totalStudents: 5500, image: null, description: "NIT Warangal is consistently ranked among the top NITs in India.", accreditation: "NAAC A+", topRecruiters: ["Microsoft", "Amazon", "Deloitte", "TCS", "Samsung"] },
  { id: 14, name: "Thapar Institute of Engineering", location: "Patiala, Punjab", city: "Patiala", state: "Punjab", fees: 440000, rating: 4.1, placementRate: 83.0, avgPackage: 900000, courses: ["B.Tech", "M.Tech", "MBA", "PhD"], type: "Private", established: 1956, totalStudents: 10000, image: null, description: "Thapar Institute is a premier private engineering university with strong industry collaborations.", accreditation: "NAAC A", topRecruiters: ["Infosys", "TCS", "Amazon", "Deloitte", "HCL"] },
  { id: 15, name: "Anna University", location: "Chennai, Tamil Nadu", city: "Chennai", state: "Tamil Nadu", fees: 75000, rating: 4.2, placementRate: 80.0, avgPackage: 750000, courses: ["B.Tech", "BE", "M.Tech", "MBA", "PhD"], type: "Government", established: 1978, totalStudents: 12000, image: null, description: "Anna University is a technical university in Tamil Nadu, one of the largest in the country.", accreditation: "NAAC A+", topRecruiters: ["TCS", "CTS", "Infosys", "Wipro", "HCL"] },
  { id: 16, name: "SRM Institute of Science and Technology", location: "Chennai, Tamil Nadu", city: "Chennai", state: "Tamil Nadu", fees: 380000, rating: 4.0, placementRate: 78.0, avgPackage: 700000, courses: ["B.Tech", "M.Tech", "MBA", "MCA", "PhD"], type: "Private", established: 1985, totalStudents: 52000, image: null, description: "SRM IST is one of the top private universities in India with a large campus and diverse programs.", accreditation: "NAAC A++", topRecruiters: ["TCS", "Infosys", "Wipro", "HCL", "Capgemini"] },
  { id: 17, name: "COEP Technological University", location: "Pune, Maharashtra", city: "Pune", state: "Maharashtra", fees: 110000, rating: 4.3, placementRate: 87.0, avgPackage: 950000, courses: ["B.Tech", "BE", "M.Tech", "MBA"], type: "Government", established: 1854, totalStudents: 4000, image: null, description: "COEP is one of India's oldest and most prestigious engineering colleges.", accreditation: "NAAC A+", topRecruiters: ["Mercedes-Benz", "Cummins", "Infosys", "TCS", "Bosch"] },
  { id: 18, name: "PSG College of Technology", location: "Coimbatore, Tamil Nadu", city: "Coimbatore", state: "Tamil Nadu", fees: 120000, rating: 4.2, placementRate: 84.0, avgPackage: 800000, courses: ["B.Tech", "BE", "M.Tech", "MBA", "MCA"], type: "Private", established: 1951, totalStudents: 8000, image: null, description: "PSG College of Technology is a renowned autonomous institution in Coimbatore.", accreditation: "NAAC A+", topRecruiters: ["BOSCH", "TCS", "Cognizant", "Wipro", "L&T"] },
  { id: 19, name: "Amity University", location: "Noida, Uttar Pradesh", city: "Noida", state: "Uttar Pradesh", fees: 400000, rating: 3.8, placementRate: 72.0, avgPackage: 600000, courses: ["B.Tech", "MBA", "BBA", "LLB", "B.Sc", "MCA"], type: "Private", established: 2005, totalStudents: 125000, image: null, description: "Amity University is one of India's largest private universities offering diverse programs.", accreditation: "NAAC A+", topRecruiters: ["TCS", "Wipro", "HCL", "Cognizant", "Infosys"] },
  { id: 20, name: "IIIT Bangalore", location: "Bengaluru, Karnataka", city: "Bengaluru", state: "Karnataka", fees: 320000, rating: 4.5, placementRate: 94.0, avgPackage: 1700000, courses: ["B.Tech", "M.Tech", "PhD", "MS"], type: "Private", established: 1999, totalStudents: 2500, image: null, description: "IIIT Bangalore is an autonomous institution focused on IT research and education in Bengaluru.", accreditation: "NAAC A", topRecruiters: ["Google", "Amazon", "Flipkart", "Adobe", "Oracle"] },
];

// ─── CLIENT-SIDE FALLBACK FILTER ──────────────────────────────────────────────
function filterFallback(colleges: College[], filters: CollegeFilters): CollegeListResponse {
  let filtered = [...colleges];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter((c) => c.name.toLowerCase().includes(q));
  }
  if (filters.state) {
    filtered = filtered.filter((c) => c.state.toLowerCase() === filters.state!.toLowerCase());
  }
  if (filters.type) {
    filtered = filtered.filter((c) => c.type.toLowerCase() === filters.type!.toLowerCase());
  }
  if (filters.course) {
    filtered = filtered.filter((c) => c.courses.includes(filters.course!));
  }
  if (filters.maxFees) {
    filtered = filtered.filter((c) => c.fees <= parseInt(filters.maxFees!));
  }

  filtered.sort((a, b) => b.rating - a.rating);

  const page = filters.page || 1;
  const limit = parseInt(filters.limit || '9');
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const colleges2 = filtered.slice((page - 1) * limit, page * limit);

  return { colleges: colleges2, total, page, totalPages };
}

// ─── API FUNCTIONS ────────────────────────────────────────────────────────────
export async function fetchColleges(filters: CollegeFilters = {}): Promise<CollegeListResponse> {
  try {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') params.set(key, String(value));
    });
    const res = await fetch(`${API_URL}/colleges?${params}`, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) throw new Error('API error');
    return res.json();
  } catch {
    // Backend unreachable — use fallback
    return filterFallback(FALLBACK_COLLEGES, filters);
  }
}

export async function fetchCollege(id: number): Promise<College> {
  try {
    const res = await fetch(`${API_URL}/colleges/${id}`, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) throw new Error('Not found');
    return res.json();
  } catch {
    const college = FALLBACK_COLLEGES.find((c) => c.id === id);
    if (!college) throw new Error('College not found');
    return college;
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
    return FALLBACK_COLLEGES.filter((c) => ids.includes(c.id));
  }
}

export async function fetchStates(): Promise<string[]> {
  try {
    const res = await fetch(`${API_URL}/filters/states`, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) throw new Error('API error');
    return res.json();
  } catch {
    return [...new Set(FALLBACK_COLLEGES.map((c) => c.state))].sort();
  }
}

export function formatFees(fees: number): string {
  if (fees >= 100000) return `₹${(fees / 100000).toFixed(1)}L/yr`;
  return `₹${(fees / 1000).toFixed(0)}K/yr`;
}

export function formatPackage(pkg: number): string {
  if (pkg >= 10000000) return `₹${(pkg / 10000000).toFixed(1)}Cr`;
  if (pkg >= 100000) return `₹${(pkg / 100000).toFixed(1)}L`;
  return `₹${pkg}`;
}