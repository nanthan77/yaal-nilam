import type { Metadata } from 'next';
import SafetyGuideClient from '@/components/SafetyGuideClient';

export const metadata: Metadata = {
  title: 'Buyer Safety and Anti-Fraud Guide',
  description: 'Independent title, survey, seller identity and payment checks for property buyers in Jaffna and Northern Sri Lanka.',
  alternates: { canonical: 'https://yaalnilam.com/safety/' },
};
export default function SafetyPage() { return <SafetyGuideClient />; }
