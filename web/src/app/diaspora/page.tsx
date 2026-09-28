import type { Metadata } from 'next';
import DiasporaHomeClient from '@/components/DiasporaHomeClient';

export const metadata: Metadata = {
  title: 'Manage Your Jaffna Home from Abroad',
  description: 'Property care, rental management packages and enquiries for overseas owners of Jaffna homes and land.',
  alternates: { canonical: 'https://yaalnilam.com/diaspora/' },
};

export default function DiasporaPage() { return <DiasporaHomeClient />; }
