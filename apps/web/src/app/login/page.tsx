'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import Link from 'next/link';
import { getUsers, setCurrentUser } from '@/lib/localStorage';

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ mode: 'onBlur' });

  const onSubmit = (data: LoginForm) => {
    const users = getUsers();
    const user = users.find(
      (u) => u.email.toLowerCase() === data.email.toLowerCase() && u.password === data.password
    );
    if (!user) {
      setError('Invalid email or password.');
      return;
    }
    setCurrentUser(user);
    router.push('/dashboard');
  };

  return (
    <Box
      sx={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'fadeUp 0.5s ease both',
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 440 }}>
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography variant="overline" sx={{ color: '#818cf8', display: 'block', mb: 0.5 }}>
            Welcome Back
          </Typography>
          <Typography variant="h4" sx={{ color: '#e2e2f0', fontWeight: 700 }}>
            Log In
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            position: 'relative',
            overflow: 'hidden',
            p: { xs: 3, sm: 4 },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, #22d3ee, #818cf8)',
              zIndex: 1,
            },
          }}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
          >
            <TextField
              label="Email"
              type="email"
              fullWidth
              required
              error={!!errors.email}
              helperText={errors.email?.message ?? ' '}
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
              })}
            />

            <TextField
              label="Password"
              type="password"
              fullWidth
              required
              error={!!errors.password}
              helperText={errors.password?.message ?? ' '}
              {...register('password', { required: 'Password is required' })}
            />

            <Divider />

            <Button type="submit" variant="contained" fullWidth disabled={isSubmitting}>
              Log In
            </Button>

            <Typography variant="body2" sx={{ color: '#6a6a88', textAlign: 'center' }}>
              Don&apos;t have an account?{' '}
              <Box
                component={Link}
                href="/signup"
                sx={{ color: '#818cf8', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                Sign up
              </Box>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
