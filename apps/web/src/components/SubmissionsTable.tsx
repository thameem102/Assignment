'use client';

import { useEffect, useState } from 'react';
import { getSubmissions, clearSubmissions } from '@/lib/localStorage';
import { FormSubmission, FormConfig } from '@/lib/types';
import rawConfig from '@/config/formConfig.json';

const config = rawConfig as FormConfig;

function fieldKey(id: number): string {
  return `field_${id}`;
}

interface SubmissionsTableProps {
  refreshKey?: number;
}

export default function SubmissionsTable({ refreshKey }: SubmissionsTableProps) {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);

  useEffect(() => {
    setSubmissions(getSubmissions());
  }, [refreshKey]);

  if (submissions.length === 0) return null;

  const handleClear = () => {
    clearSubmissions();
    setSubmissions([]);
  };

  return (
    <div className="mt-6" style={{ animation: 'fadeUp 0.4s ease both' }}>
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {/* Header row */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <h3
              className="text-base font-bold text-gray-900"
              style={{
                fontFamily: 'var(--font-display), Syne, sans-serif',
              }}
            >
              Past Submissions
            </h3>
            <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-md">
              {submissions.length}
            </span>
          </div>
          <button
            onClick={handleClear}
            className="px-3 py-1.5 text-xs font-medium text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
          >
            Clear All
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Submitted At
                </th>
                {config.data.map((f) => (
                  <th
                    key={f.id}
                    className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide"
                  >
                    {f.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {submissions.map((row, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td
                    className="px-4 py-3 text-gray-400 whitespace-nowrap"
                    style={{
                      fontFamily:
                        'var(--font-mono), JetBrains Mono, monospace',
                      fontSize: '0.75rem',
                    }}
                  >
                    {new Date(row.timestamp).toLocaleString()}
                  </td>
                  {config.data.map((f) => (
                    <td key={f.id} className="px-4 py-3 text-gray-700">
                      {row[fieldKey(f.id)] ?? '—'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
