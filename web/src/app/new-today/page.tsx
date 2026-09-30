import type { Metadata } from 'next';
import PublicListingHub from '@/components/PublicListingHub';
import { getBuildListings } from '@/lib/build-listings';

export const metadata: Metadata = {
  title: 'Current Jaffna Property Listings',
  description: 'Browse currently published homes, land and commercial property in Jaffna.',
  alternates: { canonical: 'https://yaalnilam.com/new-today/' },
};

export default async function Page() {
  return <PublicListingHub mode="latest" initialProperties={await getBuildListings()} />;
}
