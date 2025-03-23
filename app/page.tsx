import Link from 'next/link';
import { PenTool, Lock, Smartphone, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 dark:from-stone-900 dark:to-stone-800'>
      <nav className='flex items-center justify-between px-6 py-4 sm:px-12'>
        <div className='flex items-center gap-2'>
          <PenTool className='h-6 w-6 text-stone-700 dark:text-stone-300' />
          <span className='text-xl font-semibold text-stone-800 dark:text-stone-200'>
            Inkwell
          </span>
        </div>
        <div className='flex gap-4'>
          <Link
            href='/login'
            className='px-4 py-2 text-stone-600 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200'
          >
            Sign In
          </Link>
          <Link
            href='/signup'
            className='rounded-full bg-stone-800 px-6 py-2 text-stone-50 hover:bg-stone-700 dark:bg-stone-300 dark:text-stone-900 dark:hover:bg-stone-200'
          >
            Get Started
          </Link>
        </div>
      </nav>

      <main className='mx-auto max-w-7xl px-6 sm:px-12 py-16'>
        <section className='mb-24 text-center'>
          <div className='mb-12 animate-fade-in'>
            <h1 className='text-5xl font-bold text-stone-900 mb-6 dark:text-stone-100'>
              Your Private Digital
              <span className='relative mx-4'>
                <span className='absolute -inset-4 bg-gradient-to-r from-stone-300 to-stone-400 dark:from-stone-500 dark:to-stone-600 rounded-full opacity-20 blur-xl' />
                <span className='relative'>Sanctuary</span>
              </span>
            </h1>
            <p className='text-xl text-stone-600 mb-8 max-w-2xl mx-auto dark:text-stone-400'>
              A secure, minimalist space for your thoughts. Experience writing
              that feels like breathing.
            </p>
            <div className='flex justify-center gap-4'>
              <Link
                href='/signup'
                className='rounded-full bg-stone-900 px-8 py-4 text-lg font-medium text-stone-50 hover:bg-stone-800 transition-all dark:bg-stone-300 dark:text-stone-900 dark:hover:bg-stone-200'
              >
                Start Journaling
              </Link>
            </div>
          </div>

          <div className='relative aspect-video rounded-3xl bg-stone-100/50 border border-stone-200 shadow-xl overflow-hidden dark:bg-stone-800/50 dark:border-stone-700'>
            <div className='absolute inset-0 bg-gradient-to-br from-white/30 to-transparent dark:from-stone-900/30' />
            <div className='absolute inset-0 flex items-center justify-center'>
              <div className='text-center space-y-4'>
                <PenTool className='h-12 w-12 text-stone-600 mx-auto animate-soft-bounce dark:text-stone-400' />
                <div className='font-mono text-sm text-stone-500 dark:text-stone-400'>
                  Your blank canvas awaits...
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className='grid md:grid-cols-3 gap-8 mb-24'>
          <div className='p-6 bg-white rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow dark:bg-stone-800 dark:border-stone-700'>
            <Lock className='h-8 w-8 text-stone-700 mb-4 dark:text-stone-300' />
            <h3 className='text-xl font-semibold mb-2 dark:text-stone-200'>
              Military-Grade Security
            </h3>
            <p className='text-stone-600 dark:text-stone-400'>
              End-to-end encryption ensures your deepest thoughts remain
              completely private.
            </p>
          </div>
          <div className='p-6 bg-white rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow dark:bg-stone-800 dark:border-stone-700'>
            <Smartphone className='h-8 w-8 text-stone-700 mb-4 dark:text-stone-300' />
            <h3 className='text-xl font-semibold mb-2 dark:text-stone-200'>
              Always With You
            </h3>
            <p className='text-stone-600 dark:text-stone-400'>
              Seamless sync across all devices. Write anywhere, continue
              everywhere.
            </p>
          </div>
          <div className='p-6 bg-white rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow dark:bg-stone-800 dark:border-stone-700'>
            <Sparkles className='h-8 w-8 text-stone-700 mb-4 dark:text-stone-300' />
            <h3 className='text-xl font-semibold mb-2 dark:text-stone-200'>
              Smart Insights
            </h3>
            <p className='text-stone-600 dark:text-stone-400'>
              AI-powered reflections help you discover patterns in your thoughts
              and growth.
            </p>
          </div>
        </section>

        <section className='text-center mb-24'>
          <h2 className='text-3xl font-bold mb-8 dark:text-stone-100'>
            Trusted By Thoughtful Minds
          </h2>
          <div className='grid md:grid-cols-2 gap-8 max-w-4xl mx-auto'>
            <div className='p-6 bg-white rounded-2xl border border-stone-100 text-left dark:bg-stone-800 dark:border-stone-700'>
              <p className='text-stone-600 mb-4 dark:text-stone-400'>
                "Inkwell has transformed how I process my thoughts. It's like
                having a conversation with my best self."
              </p>
              <div className='flex items-center gap-3'>
                <div className='h-10 w-10 rounded-full bg-stone-100 dark:bg-stone-700' />
                <div>
                  <div className='font-medium dark:text-stone-200'>
                    Dr. Sarah Lin
                  </div>
                  <div className='text-sm text-stone-500 dark:text-stone-400'>
                    Clinical Psychologist
                  </div>
                </div>
              </div>
            </div>
            <div className='p-6 bg-white rounded-2xl border border-stone-100 text-left dark:bg-stone-800 dark:border-stone-700'>
              <p className='text-stone-600 mb-4 dark:text-stone-400'>
                "Finally a journal that stays out of the way but is there when I
                need it. The perfect digital companion."
              </p>
              <div className='flex items-center gap-3'>
                <div className='h-10 w-10 rounded-full bg-stone-100 dark:bg-stone-700' />
                <div>
                  <div className='font-medium dark:text-stone-200'>
                    James Cooper
                  </div>
                  <div className='text-sm text-stone-500 dark:text-stone-400'>
                    Award-Winning Author
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className='border-t border-stone-100 dark:border-stone-800 py-8 text-center'>
        <p className='text-stone-600 dark:text-stone-400'>
          © Inkwell 2024 — Crafted with intention in Kenya
        </p>
      </footer>
    </div>
  );
}
