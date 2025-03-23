import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  UserIcon,
  BarChart,
  Settings,
  Activity,
  Users,
  FileText,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function AdminPage() {
  return (
    <div className='p-6 space-y-8'>
      <div className='flex flex-col md:flex-row justify-between items-start gap-4 md:items-center'>
        <h1 className='text-2xl font-bold'>Admin Dashboard</h1>
        <div className='flex flex-col sm:flex-row gap-2 w-full md:w-auto'>
          <Link
            href='/admin/users'
            className='w-full md:w-auto'
          >
            <Button className='w-full'>
              <Users className='h-4 w-4 mr-2' />
              Manage Users
            </Button>
          </Link>
          <Link
            href='/admin/analytics'
            className='w-full md:w-auto'
          >
            <Button
              variant='outline'
              className='w-full'
            >
              <BarChart className='h-4 w-4 mr-2' />
              View Analytics
            </Button>
          </Link>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium'>Total Users</CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>1,234</div>
            <p className='text-xs text-muted-foreground mt-1'>
              +20.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium'>Active Users</CardTitle>
            <Activity className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>892</div>
            <p className='text-xs text-muted-foreground mt-1'>
              +5.2% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium'>Total Entries</CardTitle>
            <FileText className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>4,567</div>
            <p className='text-xs text-muted-foreground mt-1'>
              +12.3% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card className='md:col-span-2'>
          <CardHeader>
            <CardTitle className='text-lg'>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className='flex items-center justify-between p-3 bg-muted/50 rounded-lg'
              >
                <div className='space-y-1'>
                  <p className='font-medium'>New User Registration</p>
                  <p className='text-sm text-muted-foreground'>2 minutes ago</p>
                </div>
                <Button
                  variant='ghost'
                  size='sm'
                >
                  View
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className='lg:col-span-1'>
          <CardHeader>
            <CardTitle className='text-lg'>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className='grid grid-cols-1 gap-3'>
            <Link href='/admin/users'>
              <Button
                variant='outline'
                className='w-full h-auto py-3'
              >
                <div className='flex items-center gap-3'>
                  <UserIcon className='h-5 w-5' />
                  <span>Manage Users</span>
                </div>
              </Button>
            </Link>
            <Link href='/admin/analytics'>
              <Button
                variant='outline'
                className='w-full h-auto py-3'
              >
                <div className='flex items-center gap-3'>
                  <BarChart className='h-5 w-5' />
                  <span>View Analytics</span>
                </div>
              </Button>
            </Link>
            <Button
              variant='outline'
              className='w-full h-auto py-3'
              disabled
            >
              <div className='flex items-center gap-3'>
                <Settings className='h-5 w-5' />
                <span>System Settings</span>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
