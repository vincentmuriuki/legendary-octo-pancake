import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import EditEntryPage from '@/components/journal/Edit';

export default async function EditJournalPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  return <EditEntryPage user={user} />;
}
