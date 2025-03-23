import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import Entries from '@/components/journal/Entries';

export default async function JournalPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  return <Entries user={user} />;
}
