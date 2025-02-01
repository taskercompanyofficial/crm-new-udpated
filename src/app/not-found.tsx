import Link from 'next/link';
import { Metadata } from 'next';
import { AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
  return (
    <div className="relative flex h-full min-h-screen flex-col items-center justify-center p-8">
      {/* Background gradient effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 h-64 w-64 rounded-full bg-red-500/10 blur-[60px]" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-blue-500/10 blur-[60px]" />
      </div>

      {/* Content */}
      <div className="relative">
        <div className="flex items-center justify-center">
          <div className="relative">
            <div className="absolute -inset-1 animate-pulse rounded-full bg-red-500/20" />
            <AlertCircle className="relative h-16 w-16 text-red-500" />
          </div>
          <h1 className="ml-6 text-6xl font-bold tracking-tighter">404</h1>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xl font-medium text-muted-foreground">
            Oops! The page you are looking for does not exist.
          </p>
          <p className="mt-2 text-sm text-muted-foreground/80">
            The page might have been moved or deleted.
          </p>
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/crm"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-primary px-8 py-3 font-medium text-primary-foreground transition duration-300 hover:scale-105"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary opacity-0 transition-opacity group-hover:opacity-100" />
            <span className="relative flex items-center gap-2">
              Return to Dashboard
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
