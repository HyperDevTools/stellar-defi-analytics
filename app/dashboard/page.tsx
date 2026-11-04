import Link from 'next/link';
import { TVLCard } from '@/components/TVLCard';

export default function DashboardPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          &larr; Back to home
        </Link>

        <h1 className="mb-8 mt-4 text-3xl font-bold">Dashboard</h1>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <TVLCard />
        </div>
      </div>
    </main>
  );
}
