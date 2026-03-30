'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import FirmProfile from '@/components/firms/FirmProfile';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function FirmDetailPage() {
  const params = useParams();
  const [firm, setFirm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params.id) return;

    fetch(`/api/firms/${params.id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Firm not found');
        return res.json();
      })
      .then(setFirm)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [params.id]);

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Back Navigation */}
        <Link
          href="/browse"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Browse
        </Link>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-500 mx-auto mb-4" />
              <p className="text-sm text-slate-400">Loading firm profile...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-4">
              <span className="text-2xl">!</span>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Firm Not Found</h2>
            <p className="text-slate-400 mb-6">{error}</p>
            <Link
              href="/browse"
              className="text-sm text-brand-400 hover:text-brand-300 transition-colors"
            >
              Return to Browse
            </Link>
          </div>
        )}

        {firm && <FirmProfile firm={firm} />}
      </div>
    </AppShell>
  );
}
