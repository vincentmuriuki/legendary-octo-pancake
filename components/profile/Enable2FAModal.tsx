'use client';

import { useState } from 'react';
import QRCode from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function Enable2FAModal({
  user,
  onClose,
}: {
  user: any;
  onClose: () => void;
}) {
  const [code, setCode] = useState('');
  const [secret, setSecret] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);

  const generate2FASecret = async () => {
    const res = await fetch('/api/auth/2fa/generate');
    const data = await res.json();
    setSecret(data.secret);
  };

  const verify2FA = async () => {
    const res = await fetch('/api/auth/2fa/verify', {
      method: 'POST',
      body: JSON.stringify({ code, secret }),
    });

    if (res.ok) {
      const { backupCodes } = await res.json();
      setBackupCodes(backupCodes);
    }
  };

  return (
    <Dialog
      open
      onOpenChange={onClose}
    >
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>
            {user.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
          </DialogTitle>
        </DialogHeader>

        {!secret ? (
          <div className='space-y-4'>
            <p>Click the button below to generate your QR code</p>
            <Button onClick={generate2FASecret}>Generate QR Code</Button>
          </div>
        ) : (
          <div className='space-y-4'>
            <p>Scan the QR code with your authenticator app</p>
            <QRCode
              value={`otpauth://totp/MyJournal:${user.email}?secret=${secret}&issuer=MyJournal`}
            />
            <p className='text-sm'>Or enter this code manually: {secret}</p>
            <Input
              placeholder='Enter 6-digit code'
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <Button onClick={verify2FA}>Verify Code</Button>

            {backupCodes.length > 0 && (
              <div className='bg-muted p-4 rounded'>
                <h4 className='font-medium mb-2'>Backup Codes</h4>
                <div className='grid grid-cols-2 gap-2'>
                  {backupCodes.map((code) => (
                    <code
                      key={code}
                      className='text-sm'
                    >
                      {code}
                    </code>
                  ))}
                </div>
                <p className='text-sm mt-2 text-muted-foreground'>
                  Save these codes in a secure place
                </p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
