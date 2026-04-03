'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';

const AUTH_ROUTES = ['/login', '/signup'];

export default function ConditionalNavbar() {
  const pathname = usePathname();
  if (AUTH_ROUTES.includes(pathname)) return null;
  return <Navbar />;
}
