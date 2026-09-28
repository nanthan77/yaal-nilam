import type { Metadata } from 'next';
import PublicListingHub from '@/components/PublicListingHub';
import { getBuildListings } from '@/lib/build-listings';

export const metadata: Metadata = {
  title: 'Northern Province Real Estate',
  description: 'Explore Jaffna and Northern Province property listings, area guides and overseas owner services.',
  alternates: { canonical: 'https://yaalnilam.com/real-estate/' },
};

export default async function Page() {
  return <PublicListingHub mode="region" initialProperties={await getBuildListings()} />;
}
