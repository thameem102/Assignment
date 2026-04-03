'use client';

import { Controller, Control, FieldErrors } from 'react-hook-form';
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
      ? {
          minLength: {
            value: field.minLength,
            message: `Minimum ${field.minLength} characters`,
          },
        }
      : {}),
    ...(field.fieldType === 'TEXT' && field.maxLength !== undefined
      ? {
          maxLength: {
            value: field.maxLength,
            message: `Maximum ${field.maxLength} characters`,
          },
        }
      : {}),
  };

  const inputClass = (hasError: boolean) =>
    `w-full px-4 py-2.5 border rounded-lg text-gray-800 placeholder-gray-400 bg-white outline-none transition-all text-sm ${
      hasError
        ? 'border-red-400 focus:ring-2 focus:ring-red-100'
        : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
    }`;

  if (field.fieldType === 'TEXT') {
    return (
      <Controller
        name={key}
        control={control}
        rules={rules}
        render={({ field: { onChange, value, ref } }) => (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {field.name}
              {field.required && (
                <span className="text-red-400 ml-0.5">*</span>
              )}
            </label>
            <input
              ref={ref}
              type={field.name.toLowerCase().includes('email') ? 'email' : 'text'}
              value={value ?? ''}
              onChange={onChange}
              placeholder={field.defaultValue || `Enter ${field.name.toLowerCase()}`}
              className={inputClass(!!error)}
            />
            {error && (
              <p className="mt-1 text-xs text-red-500">{error.message}</p>
            )}
          </div>
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {field.name}
              {field.required && (
                <span className="text-red-400 ml-0.5">*</span>
              )}
            </label>
            <select
              value={value ?? ''}
              onChange={onChange}
              className={`${inputClass(!!error)} appearance-none cursor-pointer`}
            >
              <option value="">Select {field.name}</option>
              {(field.listOfValues1 ?? []).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {error && (
              <p className="mt-1 text-xs text-red-500">{error.message}</p>
            )}
          </div>
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
        render={({ field: { onChange, value, name } }) => (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.name}
              {field.required && (
                <span className="text-red-400 ml-0.5">*</span>
              )}
            </label>
            <div className="flex gap-4">
              {(field.listOfValues1 ?? []).map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
                >
                  <input
                    type="radio"
                    name={name}
                    value={option}
                    checked={value === option}
                    onChange={onChange}
                    className="w-4 h-4 accent-blue-500"
                  />
                  {option}
                </label>
              ))}
            </div>
            {error && (
              <p className="mt-1 text-xs text-red-500">{error.message}</p>
            )}
          </div>
        )}
      />
    );
  }

  return null;
}

export { fieldKey };
