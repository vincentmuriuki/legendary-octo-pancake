import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import NewEntryPage from '@/components/journal/NewJournal';

export default async function NewJournalPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  return <NewEntryPage user={user} />;
}
