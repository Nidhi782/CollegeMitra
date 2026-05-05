import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'CollegeMitra — India\'s Smart College Discovery Platform',
  description: 'Discover, compare, and shortlist top colleges in India. Get personalized recommendations, college predictor tools, and expert guidance. 20,000+ colleges, 1,000+ exams.',
  keywords: 'college admission India, best colleges India, college comparison, JEE colleges, NEET colleges, MBA colleges',
  openGraph: {
    title: 'CollegeMitra — Find Your Dream College',
    description: 'Smart college discovery with AI-powered recommendations',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface text-neutral-900 antialiased" suppressHydrationWarning>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#f1f5f9',
              borderRadius: '12px',
              border: '1px solid rgba(99,102,241,0.3)',
              fontSize: '13px',
              fontWeight: '600',
              padding: '12px 16px',
            },
            success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
            error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
      </body>
    </html>
  );
}
