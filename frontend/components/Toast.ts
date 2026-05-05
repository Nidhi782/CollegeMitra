import toast from 'react-hot-toast';

export const showToast = {
  copied:        () => toast.success('Link copied!'),
  compareAdded:  (name: string) => toast.success(`${name} added to compare`),
  compareRemoved:(name: string) => toast(`${name} removed`, { icon: '↩️' }),
  compareFull:   () => toast.error('Maximum 3 colleges in compare'),
  compareClear:  () => toast(`Compare list cleared`, { icon: '🗑️' }),
  error:         (msg: string) => toast.error(msg),
  info:          (msg: string) => toast(msg, { icon: 'ℹ️' }),
};