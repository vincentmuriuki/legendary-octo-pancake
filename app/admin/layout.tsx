import { ReactNode } from 'react';
import { checkAdminAccess, getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AdminLayoutClient } from './AdminLayoutClient';

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();

  if (!checkAdminAccess(user)) redirect('/journal');

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
