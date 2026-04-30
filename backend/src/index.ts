import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(cors({
  origin: [
    'http://localhost:3000',
    /\.vercel\.app$/,
  ],
  methods: ['GET', 'POST'],
}));
app.use(express.json());

// Health check
app.get('/', (_req, res) => {
  res.json({ status: 'ok', message: 'CollegeMitra API running' });
});

// GET /colleges
app.get('/colleges', async (req, res) => {
  try {
    const {
      search,
      state,
      type,
      course,
      minFees,
      maxFees,
      page = '1',
      limit = '9',
    } = req.query as Record<string, string>;

    const where: any = {};
    if (search) where.name = { contains: search, mode: 'insensitive' };
    if (state)  where.state = { equals: state, mode: 'insensitive' };
    if (type)   where.type = { equals: type, mode: 'insensitive' };
    if (course) where.courses = { has: course };
    if (minFees || maxFees) {
      where.fees = {};
      if (minFees) where.fees.gte = parseInt(minFees);
      if (maxFees) where.fees.lte = parseInt(maxFees);
    }

    const pageNum  = parseInt(page);
    const limitNum = parseInt(limit);
    const skip     = (pageNum - 1) * limitNum;

    const [colleges, total] = await Promise.all([
      prisma.college.findMany({ where, skip, take: limitNum, orderBy: { rating: 'desc' } }),
      prisma.college.count({ where }),
    ]);

    res.json({ colleges, total, page: pageNum, totalPages: Math.ceil(total / limitNum) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /colleges/:id
app.get('/colleges/:id', async (req, res) => {
  try {
    const college = await prisma.college.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!college) return res.status(404).json({ error: 'College not found' });
    res.json(college);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /colleges/compare
app.post('/colleges/compare', async (req, res) => {
  try {
    const { ids } = req.body as { ids: number[] };
    if (!ids || ids.length < 2 || ids.length > 3) {
      return res.status(400).json({ error: 'Provide 2 or 3 college IDs' });
    }
    const colleges = await prisma.college.findMany({ where: { id: { in: ids } } });
    res.json(colleges);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /filters/states
app.get('/filters/states', async (_req, res) => {
  const states = await prisma.college.findMany({
    select: { state: true },
    distinct: ['state'],
    orderBy: { state: 'asc' },
  });
  res.json(states.map((s) => s.state));
});

// ── Single listen — no clustering ──────────────────────────────────────────────
const PORT = process.env.PORT || '5000';

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;