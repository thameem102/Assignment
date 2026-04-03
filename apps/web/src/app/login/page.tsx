'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import Link from 'next/link';
import { getUsers, setCurrentUser } from '@/lib/localStorage';

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ mode: 'onBlur' });

  const onSubmit = (data: LoginForm) => {
    const users = getUsers();
    const user = users.find(
      (u) =>
        u.email.toLowerCase() === data.email.toLowerCase() &&
        u.password === data.password
    );
    if (!user) {
      setError('Invalid email or password.');
      return;
    }
    setCurrentUser(user);
    router.push('/dashboard');
  };

  const inputClass = (hasError: boolean) =>
    `w-full px-4 py-3 border rounded-lg text-gray-800 placeholder-gray-400 bg-white outline-none transition-all ${
      hasError
        ? 'border-red-400 focus:ring-2 focus:ring-red-100'
        : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
    }`;

  return (
    <div
      className="fixed inset-0 z-50 flex"
      style={{ fontFamily: 'var(--font-body), Outfit, sans-serif' }}
    >
      {/* ── Left Panel: Form ──────────────────────────────────────────── */}
      <div className="w-full lg:w-1/2 bg-white overflow-y-auto">
        <div className="max-w-md mx-auto px-8 py-12 lg:px-12 lg:py-14 min-h-full flex flex-col justify-center">
          {/* Logo */}
          <div className="mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-400 flex items-center justify-center shadow-lg">
              <svg
                width="24"
                height="24"
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
          </div>

          {/* Heading */}
          <h1
            className="text-2xl font-bold text-gray-900 mb-8"
            style={{
              fontFamily: 'var(--font-display), Syne, sans-serif',
            }}
          >
            Sign in to your account
          </h1>

          {/* Error */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex justify-between items-center">
              {error}
              <button
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-600 ml-2 text-lg leading-none"
              >
                &times;
              </button>
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-5"
          >
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1.5">
                Email
              </label>
              <input
                type="email"
                placeholder="example@gmail.com"
                className={inputClass(!!errors.email)}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Enter a valid email',
                  },
                })}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Type password here"
                  className={`${inputClass(!!errors.password)} pr-12`}
                  {...register('password', {
                    required: 'Password is required',
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <path d="M8.12 8.12a3 3 0 1 0 4.24 4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Sign in
            </button>

            {/* Signup link */}
            <p className="text-center text-sm text-gray-500">
              Don&apos;t have an account?{' '}
              <Link
                href="/signup"
                className="text-blue-500 hover:underline font-medium"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* ── Right Panel: Branding ─────────────────────────────────────── */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col items-start justify-center"
        style={{
          background:
            'linear-gradient(145deg, #07070f 0%, #0c1a3a 30%, #163060 55%, #2563eb 85%, #3b82f6 100%)',
        }}
      >
        <div className="px-12 xl:px-16">
          <h2
            className="text-5xl xl:text-6xl font-bold text-white leading-tight"
            style={{
              fontFamily: 'var(--font-display), Syne, sans-serif',
            }}
          >
            Welcome
            <br />
            Back.
          </h2>
        </div>

        {/* Decorative gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 30% 110%, rgba(59,130,246,0.35) 0%, transparent 70%)',
          }}
        />
      </div>
    </div>
  );
}
