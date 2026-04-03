'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser, clearCurrentUser } from '@/lib/localStorage';
import { User } from '@/lib/types';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, [pathname]);

  const handleLogout = () => {
    clearCurrentUser();
    setUser(null);
    router.push('/login');
  };

  return (
    <nav
      className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-gray-200"
      style={{ fontFamily: 'var(--font-body), Outfit, sans-serif' }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link
            href={user ? '/dashboard' : '/login'}
            className="flex items-center gap-2.5 no-underline"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-400 flex items-center justify-center">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  fill="white"
                  opacity="0.9"
                />
                <path
                  d="M2 17L12 22L22 17"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 12L12 17L22 12"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span
              className="text-sm font-bold text-gray-900 hidden sm:block"
              style={{
                fontFamily: 'var(--font-display), Syne, sans-serif',
              }}
            >
              Dashboard
            </span>
          </Link>

          {/* Nav right */}
          <div className="flex items-center gap-1">
            {user ? (
              <>
                <NavLink
                  href="/dashboard"
                  active={pathname === '/dashboard'}
                  label="Dashboard"
                />
                <span className="hidden sm:block text-xs text-gray-400 px-2 font-medium">
                  {user.fullName}
                </span>
                <button
                  onClick={handleLogout}
                  className="ml-1 px-3 py-1.5 text-xs font-medium text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  href="/login"
                  active={pathname === '/login'}
                  label="Login"
                />
                <NavLink
                  href="/signup"
                  active={pathname === '/signup'}
                  label="Signup"
                />
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({
  href,
  active,
  label,
}: {
  href: string;
  active: boolean;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={`relative inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg border transition-all no-underline ${
        active
          ? 'text-blue-600 bg-blue-50 border-blue-200'
          : 'text-gray-500 bg-transparent border-transparent hover:text-gray-800 hover:bg-gray-50 hover:border-gray-200'
      }`}
    >
      {label}
      {active && (
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/5 h-0.5 rounded-t bg-blue-500" />
      )}
    </Link>
  );
}
