'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import axios from 'axios';

const profileSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
});

export function ProfileForm({
  user,
  onUpdate,
}: {
  user: any;
  onUpdate: () => void;
}) {
  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name || '',
      email: user.email || '',
    },
  });

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    console.log(values);
    try {
      await axios.put('/api/user', { ...values });
      await onUpdate();
      // Show success toast
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-6 max-w-2xl'
      >
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit'>Update Profile</Button>
      </form>
    </Form>
  );
}
