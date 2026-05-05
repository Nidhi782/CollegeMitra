'use client';
import { Suspense } from 'react';
import HomePageInner from './HomePageInner';
import Navbar from '../components/Navbar';

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-surface flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    }>
      <HomePageInner />
    </Suspense>
  );
}