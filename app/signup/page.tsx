'use client';

import { useRouter } from 'next/navigation';
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema } from '@/lib/validators';
import { z } from 'zod';
import { signIn } from 'next-auth/react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion } from 'framer-motion';
import { AlertCircle, Lock } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof signupSchema>) => {
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Signup failed');
      }

      // Automatically log in after successful signup
      await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      router.push('/journal');
    } catch (error) {
      form.setError('root', {
        type: 'manual',
        message: error instanceof Error ? error.message : 'Signup failed',
      });
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <Form {...form}>
        {form.formState.errors.root && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className='mb-6'
          >
            <Alert variant='destructive'>
              <AlertCircle className='h-4 w-4' />
              <AlertDescription>
                {form.formState.errors.root.message}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md'
        >
          <h1 className='text-3xl font-bold text-center'>Create Account</h1>

          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type='email'
                    placeholder='user@example.com'
                    autoComplete='email'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type='password'
                    placeholder='••••••••'
                    autoComplete='new-password'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='flex justify-between'>
            <button
              type='button'
              className='text-sm text-neutral-600 hover:text-neutral-800'
              onClick={() => router.push('/signup')}
            >
              Homepage
            </button>
            <button
              type='button'
              className='text-sm text-neutral-600 hover:text-neutral-800'
              onClick={() => router.push('/login')}
            >
              Login.
            </button>
          </div>

          <Button
            type='submit'
            className='w-full'
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? 'Creating account...' : 'Sign Up'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
