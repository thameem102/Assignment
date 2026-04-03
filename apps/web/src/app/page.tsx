'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/localStorage';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const user = getCurrentUser();
    router.replace(user ? '/dashboard' : '/signup');
  }, [router]);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
      <CircularProgress />
    </Box>
  );
}
