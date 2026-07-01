'use client';
import Link from 'next/link';
import { Construction } from 'lucide-react';
export default function Page() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center p-8">
      <Construction className="w-14 h-14 text-charcoal-300" />
      <h1 className="text-2xl font-bold text-charcoal-900">Roles Module</h1>
      <p className="text-charcoal-500">This module is coming soon.</p>
      <Link href="/" className="text-sm text-teal-600 hover:underline">Back to Dashboard</Link>
    </div>
  );
}
