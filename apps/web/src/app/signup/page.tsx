'use client';

import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Link from 'next/link';
import rawConfig from '@/config/formConfig.json';
import { FormConfig, FormFieldConfig } from '@/lib/types';
import FormField, { fieldKey } from '@/components/FormField';
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
    const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
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
      <Box sx={{ width: '100%', maxWidth: 480 }}>
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography variant="overline" sx={{ color: '#818cf8', display: 'block', mb: 0.5 }}>
            Create Account
          </Typography>
          <Typography variant="h4" sx={{ color: '#e2e2f0', fontWeight: 700, mb: 0.75 }}>
            Sign Up
          </Typography>
          <Typography variant="body2" sx={{ color: '#6a6a88' }}>
            Fields driven by{' '}
            <Box
              component="span"
              sx={{
                fontFamily: 'var(--font-mono), JetBrains Mono, monospace',
                fontSize: '0.78rem',
                color: '#22d3ee',
                backgroundColor: 'rgba(34,211,238,0.08)',
                px: 0.75,
                py: 0.25,
                borderRadius: '4px',
                border: '1px solid rgba(34,211,238,0.2)',
              }}
            >
              formConfig.json
            </Box>
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
              background: 'linear-gradient(90deg, #818cf8, #22d3ee)',
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
            {config.data.map((field) => (
              <FormField key={field.id} field={field} control={control} errors={errors} />
            ))}

            <Controller
              name="password"
              control={control}
              rules={{
                required: 'Password is required',
                minLength: { value: 6, message: 'Minimum 6 characters' },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="password"
                  label="Password"
                  fullWidth
                  required
                  error={!!errors.password}
                  helperText={errors.password?.message ?? ' '}
                />
              )}
            />

            <Divider />

            <Button type="submit" variant="contained" fullWidth disabled={isSubmitting}>
              Create Account
            </Button>

            <Typography variant="body2" sx={{ color: '#6a6a88', textAlign: 'center' }}>
              Already have an account?{' '}
              <Box
                component={Link}
                href="/login"
                sx={{ color: '#818cf8', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                Log in
              </Box>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
