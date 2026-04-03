'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import rawConfig from '@/config/formConfig.json';
import { FormConfig, FormFieldConfig } from '@/lib/types';
import FormField, { fieldKey } from '@/components/FormField';
import { saveSubmission } from '@/lib/localStorage';

const config = rawConfig as FormConfig;

function buildDefaults(fields: FormFieldConfig[]): Record<string, string> {
  return Object.fromEntries(
    fields.map((f) => [fieldKey(f), f.defaultValue ?? ''])
  );
}

export default function DynamicForm({ onSubmitSuccess }: { onSubmitSuccess?: () => void }) {
  const [submitted, setSubmitted] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Record<string, string>>({
    defaultValues: buildDefaults(config.data),
    mode: 'onBlur',
  });

  const onSubmit = (data: Record<string, string>) => {
    saveSubmission(data);
    setSubmitted(true);
    reset(buildDefaults(config.data));
    onSubmitSuccess?.();
  };

  return (
    <Box sx={{ animation: 'fadeUp 0.5s ease both' }}>
      {/* Page section header */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="overline"
          sx={{ color: '#818cf8', display: 'block', mb: 0.5 }}
        >
          Dynamic Form Engine
        </Typography>
        <Typography
          variant="h4"
          sx={{ color: '#e2e2f0', fontWeight: 700, mb: 0.75 }}
        >
          Signup Form
        </Typography>
        <Typography variant="body2" sx={{ color: '#6a6a88' }}>
          Fields are driven by{' '}
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

      {/* Card */}
      <Paper
        elevation={0}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          p: { xs: 2, sm: 4 },
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
        {submitted && (
          <Alert
            severity="success"
            sx={{ mb: 3, animation: 'fadeIn 0.3s ease' }}
            onClose={() => setSubmitted(false)}
          >
            Form submitted and saved successfully!
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 3,
            }}
          >
            {config.data.map((field, idx) => (
              <Box
                key={field.id}
                sx={{
                  gridColumn: field.fieldType === 'RADIO' ? { sm: '1 / -1' } : undefined,
                  animation: 'fadeUp 0.4s ease both',
                  animationDelay: `${idx * 0.07}s`,
                }}
              >
                <FormField field={field} control={control} errors={errors} />
              </Box>
            ))}
          </Box>

          <Divider sx={{ mt: 1 }} />

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              type="button"
              variant="outlined"
              onClick={() => reset(buildDefaults(config.data))}
            >
              Reset
            </Button>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              Submit
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
