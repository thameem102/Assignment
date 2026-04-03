'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/localStorage';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const user = getCurrentUser();
    router.replace(user ? '/dashboard' : '/signup');
  }, [router]);

  return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
