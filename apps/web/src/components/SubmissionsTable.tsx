'use client';

import { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
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
    <Box sx={{ mt: 4, animation: 'fadeUp 0.4s ease both' }}>
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
        {/* Header row */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 3,
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="h6" sx={{ color: '#e2e2f0' }}>
              Past Submissions
            </Typography>
            {/* Count badge */}
            <Box
              sx={{
                bgcolor: 'rgba(129,140,248,0.12)',
                color: '#818cf8',
                borderRadius: '4px',
                px: 1,
                py: 0.25,
                fontFamily: 'var(--font-mono), JetBrains Mono, monospace',
                fontSize: '0.7rem',
                fontWeight: 600,
                border: '1px solid rgba(129,140,248,0.2)',
                lineHeight: 1.6,
              }}
            >
              {submissions.length}
            </Box>
          </Box>
          <Button size="small" color="error" variant="outlined" onClick={handleClear}>
            Clear All
          </Button>
        </Box>

        {/* Table */}
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Submitted At</TableCell>
                {config.data.map((f) => (
                  <TableCell key={f.id}>{f.name}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {submissions.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell
                    sx={{
                      whiteSpace: 'nowrap',
                      fontFamily: 'var(--font-mono), JetBrains Mono, monospace',
                      fontSize: '0.75rem',
                      color: '#6a6a88',
                    }}
                  >
                    {new Date(row.timestamp).toLocaleString()}
                  </TableCell>
                  {config.data.map((f) => (
                    <TableCell key={f.id}>{row[fieldKey(f.id)] ?? '—'}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
