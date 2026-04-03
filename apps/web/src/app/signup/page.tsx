'use client';

import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { useState } from 'react';
import Link from 'next/link';
import rawConfig from '@/config/formConfig.json';
import { FormConfig, FormFieldConfig } from '@/lib/types';
import { fieldKey } from '@/components/FormField';
import { getUsers, saveUser, setCurrentUser } from '@/lib/localStorage';

const config = rawConfig as FormConfig;

function buildDefaults(fields: FormFieldConfig[]): Record<string, string> {
  return Object.fromEntries(
    fields.map((f) => [fieldKey(f), f.defaultValue ?? ''])
  );
}

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Record<string, string>>({
    defaultValues: { ...buildDefaults(config.data), password: '' },
    mode: 'onBlur',
  });

  const onSubmit = (data: Record<string, string>) => {
    const users = getUsers();
    const emailField = config.data.find((f) => f.name === 'Email');
    const emailKey = emailField ? fieldKey(emailField) : 'field_2';
    const fullNameField = config.data.find((f) => f.name === 'Full Name');
    const fullNameKey = fullNameField ? fieldKey(fullNameField) : 'field_1';
    const genderField = config.data.find((f) => f.name === 'Gender');
    const genderKey = genderField ? fieldKey(genderField) : 'field_6';

    const email = data[emailKey] ?? '';
    const exists = users.some(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (exists) {
      setError('An account with this email already exists.');
      return;
    }

    const user = {
      fullName: data[fullNameKey] ?? '',
      email,
      password: data.password,
      gender: data[genderKey] ?? '',
    };

    saveUser(user);
    setCurrentUser(user);
    router.push('/dashboard');
  };

  const inputClass = (hasError: boolean) =>
    `w-full px-4 py-3 border rounded-lg text-gray-800 placeholder-gray-400 bg-white outline-none transition-all ${
      hasError
        ? 'border-red-400 focus:ring-2 focus:ring-red-100'
        : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
    }`;

  const renderField = (field: FormFieldConfig) => {
    const key = fieldKey(field);
    const fieldError = errors[key]?.message as string | undefined;

    if (field.fieldType === 'TEXT') {
      return (
        <Controller
          key={field.id}
          name={key}
          control={control}
          rules={{
            required: field.required ? `${field.name} is required` : false,
            ...(field.name === 'Email' && {
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Enter a valid email',
              },
            }),
            ...(field.minLength && {
              minLength: {
                value: field.minLength,
                message: `Min ${field.minLength} chars`,
              },
            }),
            ...(field.maxLength && {
              maxLength: {
                value: field.maxLength,
                message: `Max ${field.maxLength} chars`,
              },
            }),
          }}
          render={({ field: f }) => (
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1.5">
                {field.name}
              </label>
              <input
                {...f}
                type={field.name === 'Email' ? 'email' : 'text'}
                placeholder={
                  field.name === 'Email'
                    ? 'example@gmail.com'
                    : field.name === 'Full Name'
                      ? 'Type your name here'
                      : `Enter ${field.name.toLowerCase()}`
                }
                className={inputClass(!!fieldError)}
              />
              {fieldError && (
                <p className="mt-1 text-xs text-red-500">{fieldError}</p>
              )}
            </div>
          )}
        />
      );
    }

    if (field.fieldType === 'LIST') {
      return (
        <Controller
          key={field.id}
          name={key}
          control={control}
          rules={{
            required: field.required ? `${field.name} is required` : false,
          }}
          render={({ field: f }) => (
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1.5">
                {field.name}
              </label>
              <select
                {...f}
                className={`${inputClass(!!fieldError)} appearance-none cursor-pointer`}
              >
                <option value="">Select {field.name}</option>
                {field.listOfValues1?.map((v, i) => (
                  <option key={i} value={String(i + 1)}>
                    {v}
                  </option>
                ))}
              </select>
              {fieldError && (
                <p className="mt-1 text-xs text-red-500">{fieldError}</p>
              )}
            </div>
          )}
        />
      );
    }

    if (field.fieldType === 'RADIO') {
      return (
        <Controller
          key={field.id}
          name={key}
          control={control}
          rules={{
            required: field.required ? `${field.name} is required` : false,
          }}
          render={({ field: f }) => (
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1.5">
                {field.name}
              </label>
              <div className="flex gap-5">
                {field.listOfValues1?.map((v) => (
                  <label
                    key={v}
                    className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={f.name}
                      value={v}
                      checked={f.value === v}
                      onChange={f.onChange}
                      onBlur={f.onBlur}
                      className="w-4 h-4 accent-blue-500"
                    />
                    {v}
                  </label>
                ))}
              </div>
              {fieldError && (
                <p className="mt-1 text-xs text-red-500">{fieldError}</p>
              )}
            </div>
          )}
        />
      );
    }

    return null;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex"
      style={{ fontFamily: 'var(--font-body), Outfit, sans-serif' }}
    >
      {/* ── Left Panel: Form ──────────────────────────────────────────── */}
      <div className="w-full lg:w-1/2 bg-white overflow-y-auto">
        <div className="max-w-md mx-auto px-8 py-12 lg:px-12 lg:py-14">
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
            Create an account
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
            {config.data.map((field) => renderField(field))}

            {/* Password */}
            <Controller
              name="password"
              control={control}
              rules={{
                required: 'Password is required',
                minLength: { value: 6, message: 'Minimum 6 characters' },
              }}
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      {...field}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Type password here"
                      className={`${inputClass(!!errors.password)} pr-12`}
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
              )}
            />

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Create an account
            </button>

            {/* Login link */}
            <p className="text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-blue-500 hover:underline font-medium"
              >
                Login here
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* ── Right Panel: Branding ─────────────────────────────────────── */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between"
        style={{
          background:
            'linear-gradient(145deg, #07070f 0%, #0c1a3a 30%, #163060 55%, #2563eb 85%, #3b82f6 100%)',
        }}
      >
        {/* Language selector (decorative) */}
        <div className="flex justify-end px-8 pt-6">
          <span className="text-xs text-white/60 tracking-wider uppercase flex items-center gap-1 cursor-default">
            English
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="opacity-60"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </div>

        {/* Top headline */}
        <div className="px-12 xl:px-16 flex-1 flex flex-col justify-center -mt-12">
          <h2
            className="text-5xl xl:text-6xl font-bold text-white leading-tight"
            style={{
              fontFamily: 'var(--font-display), Syne, sans-serif',
            }}
          >
            Build.
            <br />
            Connect.
            <br />
            Scale.
          </h2>
        </div>

        {/* Bottom hint: dynamic form from JSON */}
        <div className="px-12 pb-10 xl:px-16">
          <div className="flex items-center gap-2 mb-2">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
            <span className="text-xs text-white/50 uppercase tracking-wider font-medium">
              Dynamic Forms
            </span>
          </div>
          <p className="text-sm text-blue-200/50 max-w-md leading-relaxed">
            Form fields are generated dynamically from{' '}
            <code className="text-blue-300/70 bg-white/5 px-1.5 py-0.5 rounded text-xs">
              formConfig.json
            </code>
            . Add, remove, or reorder fields by simply editing the JSON — no code changes needed.
          </p>
        </div>

        {/* Decorative gradient overlay at bottom */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 70% 110%, rgba(59,130,246,0.35) 0%, transparent 70%)',
          }}
        />
      </div>
    </div>
  );
}
