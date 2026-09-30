import type { Metadata } from 'next';
import DiasporaHomeClient from '@/components/DiasporaHomeClient';

export const metadata: Metadata = {
  title: 'Jaffna Property Inspections & Independent Document Checks | Yaal Nilam',
  description: 'Enquire about Jaffna property inspections, video walkthroughs, independent legal and survey checks, and property management for overseas owners.',
  alternates: { canonical: 'https://yaalnilam.com/diaspora/' },
};

export default function DiasporaPage() { return <DiasporaHomeClient />; }
