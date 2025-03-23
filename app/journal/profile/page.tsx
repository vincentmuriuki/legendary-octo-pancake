'use client';

import { useSession } from 'next-auth/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { SecuritySettings } from '@/components/profile/SecuritySettings';
import { PreferencesForm } from '@/components/profile/PreferencesForm';

export default function SettingsPage() {
  const { data: session, update } = useSession();

  if (!session?.user) {
    return <div className='p-8'>Please sign in to access settings</div>;
  }

  return (
    <div className='p-6 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-bold mb-8'>Account Settings</h1>

      <Tabs
        defaultValue='profile'
        className='w-full'
      >
        <TabsList className='grid w-full grid-cols-3'>
          <TabsTrigger value='profile'>Profile</TabsTrigger>
          <TabsTrigger value='security'>Security</TabsTrigger>
          <TabsTrigger value='preferences'>Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value='profile'>
          <ProfileForm
            user={session.user}
            onUpdate={update}
          />
        </TabsContent>

        <TabsContent value='security'>
          <SecuritySettings user={session.user} />
        </TabsContent>

        <TabsContent value='preferences'>
          <PreferencesForm user={session.user} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
