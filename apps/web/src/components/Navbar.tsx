'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
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
    <AppBar position="sticky" sx={{ zIndex: 50 }}>
      <Toolbar sx={{ minHeight: '56px !important', px: { xs: 2, sm: 3 } }}>
        {/* Logo */}
        <Box
          component={Link}
          href={user ? '/dashboard' : '/login'}
          sx={{ display: 'flex', alignItems: 'center', gap: 1.25, textDecoration: 'none', flexGrow: 1 }}
        >
          <Box
            sx={{
              width: 26,
              height: 26,
              background: 'linear-gradient(135deg, #818cf8, #22d3ee)',
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
              flexShrink: 0,
            }}
          />
        </Box>

        {/* Nav right */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {user ? (
            <>
              <NavLink href="/dashboard" active={pathname === '/dashboard'} label="Dashboard" />
              <Typography
                variant="caption"
                sx={{
                  color: '#6a6a88',
                  fontFamily: 'var(--font-mono), JetBrains Mono, monospace',
                  fontSize: '0.7rem',
                  px: 1,
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                {user.fullName}
              </Typography>
              <Button
                size="small"
                variant="outlined"
                color="error"
                onClick={handleLogout}
                sx={{ fontSize: '0.65rem', py: 0.5, px: 1.5 }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <NavLink href="/login" active={pathname === '/login'} label="Login" />
              <NavLink href="/signup" active={pathname === '/signup'} label="Signup" />
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

function NavLink({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Box
      component={Link}
      href={href}
      sx={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        px: 1.5,
        py: 0.75,
        textDecoration: 'none',
        fontFamily: 'var(--font-body), Outfit, sans-serif',
        fontSize: '0.78rem',
        fontWeight: 500,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        borderRadius: '6px',
        border: '1px solid',
        transition: 'all 0.15s',
        ...(active
          ? {
              color: '#ffffff',
              backgroundColor: 'rgba(129,140,248,0.1)',
              borderColor: 'rgba(129,140,248,0.25)',
            }
          : {
              color: '#6a6a88',
              backgroundColor: 'transparent',
              borderColor: 'transparent',
              '&:hover': {
                color: '#e2e2f0',
                backgroundColor: 'rgba(255,255,255,0.04)',
                borderColor: 'rgba(255,255,255,0.08)',
              },
            }),
      }}
    >
      {label}
      {active && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60%',
            height: '2px',
            borderRadius: '1px 1px 0 0',
            background: 'linear-gradient(90deg, #818cf8, #22d3ee)',
          }}
        />
      )}
    </Box>
  );
}
