'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
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

export default function DynamicForm({
  onSubmitSuccess,
}: {
  onSubmitSuccess?: () => void;
}) {
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
    <div style={{ animation: 'fadeUp 0.5s ease both' }}>
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          <span className="text-xs font-medium text-blue-500 tracking-wide uppercase">
            Dynamic Form Engine
          </span>
        </div>
        <h2
          className="text-xl font-bold text-gray-900"
          style={{ fontFamily: 'var(--font-display), Syne, sans-serif' }}
        >
          Signup Form
        </h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Fields are driven by{' '}
          <code className="text-xs font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
            formConfig.json
          </code>
        </p>
      </div>

      {/* Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
        {submitted && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm flex justify-between items-center animate-[fadeIn_0.3s_ease]">
            Form submitted and saved successfully!
            <button
              onClick={() => setSubmitted(false)}
              className="text-green-400 hover:text-green-600 ml-2 text-lg leading-none"
            >
              &times;
            </button>
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {config.data.map((field, idx) => (
              <div
                key={field.id}
                className={
                  field.fieldType === 'RADIO' ? 'sm:col-span-2' : ''
                }
                style={{
                  animation: 'fadeUp 0.4s ease both',
                  animationDelay: `${idx * 0.07}s`,
                }}
              >
                <FormField field={field} control={control} errors={errors} />
              </div>
            ))}
          </div>

          <hr className="border-gray-200 mt-2" />

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => reset(buildDefaults(config.data))}
              className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors disabled:opacity-50"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
