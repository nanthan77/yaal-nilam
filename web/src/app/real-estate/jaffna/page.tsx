import type { Metadata } from 'next';
import PublicListingHub from '@/components/PublicListingHub';
import { getBuildListings } from '@/lib/build-listings';

export const metadata: Metadata = {
  title: 'Jaffna District Real Estate',
  description: 'Browse Jaffna District homes, land and commercial property, with area guides and viewing enquiries.',
  alternates: { canonical: 'https://yaalnilam.com/real-estate/jaffna/' },
};

export default async function Page() {
  return <PublicListingHub mode="jaffna" initialProperties={await getBuildListings()} />;
}
