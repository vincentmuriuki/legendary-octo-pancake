'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X, ArrowLeftCircle } from 'lucide-react';

export function AdminLayoutClient({ children }: { children: ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className='min-h-screen'>
      <AdminHeader />
      <main className='container mx-auto py-8'>{children}</main>
    </div>
  );
}

function AdminHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className='bg-background border-b'>
      <nav className='container mx-auto px-4 py-4'>
        <div className='flex items-center justify-between'>
          <Link
            href='/admin'
            className='text-lg font-semibold'
          >
            Admin Dashboard
          </Link>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center gap-8'>
            <div className='flex items-center gap-4'>
              <Link href='/admin/users'>
                <Button variant='ghost'>Users</Button>
              </Link>
              <Link href='/admin/analytics'>
                <Button variant='ghost'>Analytics</Button>
              </Link>
            </div>
            <Link href='/journal'>
              <Button
                variant='outline'
                className='gap-2'
              >
                <ArrowLeftCircle className='h-4 w-4' />
                Journal
              </Button>
            </Link>
          </div>

          <Button
            variant='ghost'
            size='icon'
            className='md:hidden'
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className='h-6 w-6' />
            ) : (
              <Menu className='h-6 w-6' />
            )}
          </Button>
        </div>

        {isMenuOpen && (
          <div className='md:hidden mt-4 space-y-4 pb-4'>
            <div className='flex flex-col gap-2'>
              <Link href='/admin/users'>
                <Button
                  variant='ghost'
                  className='w-full justify-start'
                >
                  Users
                </Button>
              </Link>
              <Link href='/admin/analytics'>
                <Button
                  variant='ghost'
                  className='w-full justify-start'
                >
                  Analytics
                </Button>
              </Link>
            </div>
            <Link
              href='/journal'
              className='w-full'
            >
              <Button
                variant='outline'
                className='w-full gap-2'
              >
                <ArrowLeftCircle className='h-4 w-4' />
                Return to Journal
              </Button>
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
