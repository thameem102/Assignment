import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    primary: {
      main: '#3b82f6',
      dark: '#2563eb',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#6366f1',
      contrastText: '#ffffff',
    },
    text: {
      primary: '#111827',
      secondary: '#6b7280',
      disabled: '#9ca3af',
    },
    divider: '#e5e7eb',
    success: {
      main: '#22c55e',
    },
    warning: {
      main: '#f59e0b',
    },
    error: {
      main: '#ef4444',
    },
    action: {
      hover: 'rgba(59,130,246,0.06)',
      selected: 'rgba(59,130,246,0.1)',
    },
  },
  typography: {
    fontFamily: 'var(--font-body), Outfit, sans-serif',
    h1: { fontFamily: 'var(--font-display), Syne, sans-serif', fontWeight: 800, color: '#111827' },
    h2: { fontFamily: 'var(--font-display), Syne, sans-serif', fontWeight: 700, color: '#111827' },
    h3: { fontFamily: 'var(--font-display), Syne, sans-serif', fontWeight: 700, color: '#111827' },
    h4: { fontFamily: 'var(--font-display), Syne, sans-serif', fontWeight: 700, color: '#111827' },
    h5: { fontFamily: 'var(--font-display), Syne, sans-serif', fontWeight: 700, color: '#111827' },
    h6: { fontFamily: 'var(--font-display), Syne, sans-serif', fontWeight: 600, color: '#111827' },
    overline: {
      fontFamily: 'var(--font-mono), JetBrains Mono, monospace',
      fontSize: '0.68rem',
      letterSpacing: '0.12em',
      fontWeight: 600,
    },
    caption: {
      fontFamily: 'var(--font-mono), JetBrains Mono, monospace',
      fontSize: '0.72rem',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    /* ── Paper ──────────────────────────────────────────────────────── */
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
        },
      },
    },

    /* ── AppBar ─────────────────────────────────────────────────────── */
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid #e5e7eb',
          boxShadow: 'none',
          color: '#111827',
        },
      },
    },

    /* ── Toolbar ────────────────────────────────────────────────────── */
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: '56px !important',
        },
      },
    },

    /* ── TextField (outlined variant default) ────────────────────── */
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            '& fieldset': {
              borderColor: '#e5e7eb',
            },
            '&:hover fieldset': {
              borderColor: '#d1d5db',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#3b82f6',
              borderWidth: '1.5px',
            },
            '&.Mui-error fieldset': {
              borderColor: '#ef4444',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#6b7280',
            '&.Mui-focused': {
              color: '#3b82f6',
            },
            '&.Mui-error': {
              color: '#ef4444',
            },
          },
        },
      },
    },

    /* ── FormControl (for Select) ───────────────────────────────────── */
    MuiFormControl: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            '& fieldset': {
              borderColor: '#e5e7eb',
            },
            '&:hover fieldset': {
              borderColor: '#d1d5db',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#3b82f6',
              borderWidth: '1.5px',
            },
            '&.Mui-error fieldset': {
              borderColor: '#ef4444',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#6b7280',
            '&.Mui-focused': {
              color: '#3b82f6',
            },
            '&.Mui-error': {
              color: '#ef4444',
            },
          },
        },
      },
    },

    /* ── Select ─────────────────────────────────────────────────────── */
    MuiSelect: {
      defaultProps: {
        variant: 'outlined',
      },
    },

    /* ── InputLabel ─────────────────────────────────────────────────── */
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#6b7280',
        },
      },
    },

    /* ── Button ─────────────────────────────────────────────────────── */
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontFamily: 'var(--font-body), Outfit, sans-serif',
          fontSize: '0.875rem',
          fontWeight: 600,
          borderRadius: '8px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#2563eb',
          },
        },
        outlined: {
          borderColor: '#e5e7eb',
          color: '#374151',
          '&:hover': {
            borderColor: '#d1d5db',
            backgroundColor: '#f9fafb',
          },
        },
      },
    },

    /* ── Chip ───────────────────────────────────────────────────────── */
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: 'var(--font-body), Outfit, sans-serif',
          fontSize: '0.75rem',
          fontWeight: 600,
          height: '24px',
          borderRadius: '6px',
        },
        colorSuccess: {
          backgroundColor: '#f0fdf4',
          color: '#16a34a',
          border: '1px solid #bbf7d0',
        },
        colorWarning: {
          backgroundColor: '#fffbeb',
          color: '#d97706',
          border: '1px solid #fde68a',
        },
        colorError: {
          backgroundColor: '#fef2f2',
          color: '#dc2626',
          border: '1px solid #fecaca',
        },
        colorDefault: {
          backgroundColor: '#f3f4f6',
          color: '#6b7280',
          border: '1px solid #e5e7eb',
        },
      },
    },

    /* ── Alert ──────────────────────────────────────────────────────── */
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          border: '1px solid',
        },
        standardSuccess: {
          backgroundColor: '#f0fdf4',
          borderColor: '#bbf7d0',
          color: '#16a34a',
        },
        standardError: {
          backgroundColor: '#fef2f2',
          borderColor: '#fecaca',
          color: '#dc2626',
        },
        standardWarning: {
          backgroundColor: '#fffbeb',
          borderColor: '#fde68a',
          color: '#d97706',
        },
        standardInfo: {
          backgroundColor: '#eff6ff',
          borderColor: '#bfdbfe',
          color: '#2563eb',
        },
      },
    },

    /* ── Divider ────────────────────────────────────────────────────── */
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#e5e7eb',
        },
      },
    },

    /* ── Table Head ─────────────────────────────────────────────────── */
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-root': {
            fontFamily: 'var(--font-body), Outfit, sans-serif',
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: '#6b7280',
            backgroundColor: '#f9fafb',
            borderBottom: '1px solid #e5e7eb',
            paddingTop: '12px',
            paddingBottom: '12px',
          },
        },
      },
    },

    /* ── Table Body ─────────────────────────────────────────────────── */
    MuiTableBody: {
      styleOverrides: {
        root: {
          '& .MuiTableRow-root': {
            borderBottom: '1px solid #f3f4f6',
            transition: 'background-color 0.15s',
            '&:hover': {
              backgroundColor: '#f9fafb',
            },
            '&:last-child td': {
              borderBottom: 0,
            },
          },
          '& .MuiTableCell-root': {
            borderBottom: '1px solid #f3f4f6',
            color: '#374151',
            fontSize: '0.875rem',
          },
        },
      },
    },

    /* ── MenuItem ───────────────────────────────────────────────────── */
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          '&:hover': {
            backgroundColor: '#eff6ff',
          },
          '&.Mui-selected': {
            backgroundColor: '#dbeafe',
            '&:hover': {
              backgroundColor: '#bfdbfe',
            },
          },
        },
      },
    },

    /* ── Menu Paper ─────────────────────────────────────────────────── */
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        },
      },
    },

    /* ── Radio ──────────────────────────────────────────────────────── */
    MuiRadio: {
      styleOverrides: {
        root: {
          color: '#d1d5db',
          '&.Mui-checked': {
            color: '#3b82f6',
          },
        },
      },
    },

    /* ── CircularProgress ───────────────────────────────────────────── */
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: '#3b82f6',
        },
      },
    },
  },
});

export default theme;
