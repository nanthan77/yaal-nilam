import type { Metadata } from 'next';
import PublicListingHub from '@/components/PublicListingHub';
import { getBuildListings } from '@/lib/build-listings';

export const metadata: Metadata = {
  title: 'Jaffna Land Title Due Diligence',
  description: 'Browse published Jaffna land listings and arrange independent title, survey, seller and access checks before paying.',
  alternates: { canonical: 'https://yaalnilam.com/lands/clear-title-lands-jaffna/' },
};

export default async function Page() {
  return <PublicListingHub mode="land" initialProperties={await getBuildListings()} />;
}
