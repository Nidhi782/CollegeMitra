import toast from 'react-hot-toast';

export const showToast = {
  compareAdded:   (name: string) => toast.success(`✅ ${name} added to compare`),
  compareRemoved: (name: string) => toast(`🗑️ ${name} removed`, { style: { background: '#fff7ed', color: '#9a3412', border: '1px solid #fed7aa' } }),
  compareMax:     ()             => toast.error('Max 3 colleges in compare'),
  compareClear:   ()             => toast(`🧹 Compare list cleared`, { style: { background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0' } }),
  copied:         ()             => toast.success('Link copied!'),
};