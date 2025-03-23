'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '../ui/input';

const preferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  dateFormat: z.string(),
});

export function PreferencesForm({ user }: { user: any }) {
  const form = useForm({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      theme: user.theme || 'system',
      dateFormat: user.dateFormat || 'MM/dd/yyyy',
    },
  });

  const onSubmit = async (values: z.infer<typeof preferencesSchema>) => {
    await fetch('/api/user/preferences', {
      method: 'PUT',
      body: JSON.stringify(values),
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-6 max-w-2xl'
      >
        <FormField
          control={form.control}
          name='theme'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Theme</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select theme' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='light'>Light</SelectItem>
                  <SelectItem value='dark'>Dark</SelectItem>
                  <SelectItem value='system'>System</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='dateFormat'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date Format</FormLabel>
              <Input {...field} />
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit'>Save Preferences</Button>
      </form>
    </Form>
  );
}
