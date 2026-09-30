import type { Metadata } from 'next';
import DiasporaHomeClient from '@/components/DiasporaHomeClient';

export const metadata: Metadata = {
  title: 'Power of Attorney Guide for Overseas Property Owners',
  description: 'Questions to discuss with independent counsel about authority, signing, registration and validity before using a Power of Attorney for Sri Lanka property.',
  alternates: { canonical: 'https://yaalnilam.com/diaspora/power-of-attorney-guide/' },
};

export default function PowerOfAttorneyGuide() { return <DiasporaHomeClient guide />; }
