import EditorialHome from '@/components/EditorialHome';
import { getBuildListings } from '@/lib/build-listings';

export default async function HomePage() {
  return <EditorialHome initialProperties={await getBuildListings()} />;
}
