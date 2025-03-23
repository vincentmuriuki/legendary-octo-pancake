'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Enable2FAModal } from '@/components/profile/Enable2FAModal';
import axios from 'axios';
import { ChangePasswordForm } from '@/components/profile/ChangePasswordForm';

export function SecuritySettings({ user }: { user: any }) {
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await axios.get('/api/user');
      setUserData(response.data);
    };
    fetchUserData();
  }, [user]);

  return (
    <div className='space-y-8 max-w-2xl'>
      <div className='border p-4 rounded-lg'>
        <h3 className='font-medium mb-4'>Two-Factor Authentication</h3>
        <p className='text-sm text-muted-foreground mb-4'>
          {userData?.twoFactorEnabled
            ? '2FA is currently enabled for your account'
            : 'Add an extra layer of security to your account'}
        </p>
        <Button
          variant={userData?.twoFactorEnabled ? 'destructive' : 'default'}
          onClick={() => setShow2FAModal(true)}
        >
          {userData?.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
        </Button>
      </div>

      <ChangePasswordForm />

      {show2FAModal && (
        <Enable2FAModal
          user={user}
          onClose={() => setShow2FAModal(false)}
        />
      )}
    </div>
  );
}
