'use client';

import { Controller, Control, FieldErrors } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import FormLabel from '@mui/material/FormLabel';
import Box from '@mui/material/Box';
import { FormFieldConfig } from '@/lib/types';

type FormValues = Record<string, string>;

interface FormFieldProps {
  field: FormFieldConfig;
  control: Control<FormValues>;
  errors: FieldErrors<FormValues>;
}

function fieldKey(field: FormFieldConfig): string {
  return `field_${field.id}`;
}

export default function FormField({ field, control, errors }: FormFieldProps) {
  const key = fieldKey(field);
  const error = errors[key];
  const rules = {
    required: field.required ? `${field.name} is required` : false,
    ...(field.fieldType === 'TEXT' && field.minLength !== undefined
      ? { minLength: { value: field.minLength, message: `Minimum ${field.minLength} characters` } }
      : {}),
    ...(field.fieldType === 'TEXT' && field.maxLength !== undefined
      ? { maxLength: { value: field.maxLength, message: `Maximum ${field.maxLength} characters` } }
      : {}),
  };

  if (field.fieldType === 'TEXT') {
    return (
      <Controller
        name={key}
        control={control}
        rules={rules}
        render={({ field: { onChange, value, ref } }) => (
          <TextField
            fullWidth
            label={field.name}
            value={value ?? ''}
            onChange={onChange}
            inputRef={ref}
            error={!!error}
            helperText={error?.message ?? ' '}
            required={field.required}
          />
        )}
      />
    );
  }

  if (field.fieldType === 'LIST') {
    return (
      <Controller
        name={key}
        control={control}
        rules={rules}
        render={({ field: { onChange, value } }) => (
          <FormControl fullWidth error={!!error} required={field.required} variant="filled">
            <InputLabel>{field.name}</InputLabel>
            <Select value={value ?? ''} onChange={onChange}>
              {(field.listOfValues1 ?? []).map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{error?.message ?? ' '}</FormHelperText>
          </FormControl>
        )}
      />
    );
  }

  if (field.fieldType === 'RADIO') {
    return (
      <Controller
        name={key}
        control={control}
        rules={rules}
        render={({ field: { onChange, value } }) => (
          <Box
            sx={{
              p: 2,
              border: '1px solid rgba(255,255,255,0.065)',
              borderRadius: '8px',
              backgroundColor: 'rgba(255,255,255,0.02)',
            }}
          >
            <FormControl error={!!error} required={field.required}>
              <FormLabel
                sx={{
                  fontFamily: 'var(--font-mono), JetBrains Mono, monospace',
                  fontSize: '0.68rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  color: '#6a6a88',
                  mb: 1,
                  '&.Mui-focused': { color: '#818cf8' },
                  '&.Mui-error': { color: '#f87171' },
                }}
              >
                {field.name}
              </FormLabel>
              <RadioGroup value={value ?? ''} onChange={onChange} row>
                {(field.listOfValues1 ?? []).map((option) => (
                  <FormControlLabel
                    key={option}
                    value={option}
                    control={<Radio />}
                    label={option}
                    sx={{
                      '& .MuiFormControlLabel-label': {
                        fontSize: '0.875rem',
                        color: '#e2e2f0',
                      },
                    }}
                  />
                ))}
              </RadioGroup>
              <FormHelperText>{error?.message ?? ' '}</FormHelperText>
            </FormControl>
          </Box>
        )}
      />
    );
  }

  return null;
}

export { fieldKey };
