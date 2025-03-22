import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { MainNav } from '@/components/main-nav';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className='flex min-h-screen flex-col'>
      <MainNav />
      <main className='flex-1 p-4 md:p-8'>
        <div className='mx-auto max-w-7xl'>{children}</div>
      </main>
    </div>
  );
}
