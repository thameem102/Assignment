import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#07070f',
      paper: '#111120',
    },
    primary: {
      main: '#818cf8',
      dark: '#6366f1',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#22d3ee',
      contrastText: '#07070f',
    },
    text: {
      primary: '#e2e2f0',
      secondary: '#6a6a88',
      disabled: '#3a3a50',
    },
    divider: 'rgba(255,255,255,0.065)',
    success: {
      main: '#34d399',
    },
    warning: {
      main: '#fbbf24',
    },
    error: {
      main: '#f87171',
    },
    action: {
      hover: 'rgba(129,140,248,0.06)',
      selected: 'rgba(129,140,248,0.12)',
    },
  },
  typography: {
    fontFamily: 'var(--font-body), Outfit, sans-serif',
    h1: { fontFamily: 'var(--font-display), Syne, sans-serif', fontWeight: 800 },
    h2: { fontFamily: 'var(--font-display), Syne, sans-serif', fontWeight: 700 },
    h3: { fontFamily: 'var(--font-display), Syne, sans-serif', fontWeight: 700 },
    h4: { fontFamily: 'var(--font-display), Syne, sans-serif', fontWeight: 700 },
    h5: { fontFamily: 'var(--font-display), Syne, sans-serif', fontWeight: 700 },
    h6: { fontFamily: 'var(--font-display), Syne, sans-serif', fontWeight: 700 },
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
          backgroundColor: '#111120',
          border: '1px solid rgba(255,255,255,0.065)',
        },
      },
    },

    /* ── AppBar ─────────────────────────────────────────────────────── */
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(7,7,15,0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255,255,255,0.065)',
          boxShadow: 'none',
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

    /* ── TextField (filled variant default) ────────────────────────── */
    MuiTextField: {
      defaultProps: {
        variant: 'filled',
      },
      styleOverrides: {
        root: {
          '& .MuiFilledInput-root': {
            backgroundColor: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            '&::before': {
              display: 'none',
            },
            '&::after': {
              display: 'none',
            },
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.06)',
              borderColor: 'rgba(255,255,255,0.2)',
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(129,140,248,0.06)',
              borderColor: '#818cf8',
              boxShadow: '0 0 0 3px rgba(129,140,248,0.15)',
            },
            '&.Mui-error': {
              borderColor: '#f87171',
              '&.Mui-focused': {
                boxShadow: '0 0 0 3px rgba(248,113,113,0.15)',
              },
            },
          },
          '& .MuiInputLabel-root': {
            color: '#6a6a88',
            '&.Mui-focused': {
              color: '#818cf8',
            },
            '&.Mui-error': {
              color: '#f87171',
            },
          },
          '& .MuiInputLabel-filled.MuiInputLabel-shrink': {
            fontFamily: 'var(--font-mono), JetBrains Mono, monospace',
            fontSize: '0.68rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontWeight: 600,
            transform: 'translate(12px, 7px) scale(1)',
          },
          '& .MuiFilledInput-input': {
            paddingTop: '24px',
            paddingBottom: '8px',
          },
        },
      },
    },

    /* ── FormControl (for Select) ───────────────────────────────────── */
    MuiFormControl: {
      styleOverrides: {
        root: {
          '& .MuiFilledInput-root': {
            backgroundColor: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            '&::before': {
              display: 'none',
            },
            '&::after': {
              display: 'none',
            },
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.06)',
              borderColor: 'rgba(255,255,255,0.2)',
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(129,140,248,0.06)',
              borderColor: '#818cf8',
              boxShadow: '0 0 0 3px rgba(129,140,248,0.15)',
            },
            '&.Mui-error': {
              borderColor: '#f87171',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#6a6a88',
            '&.Mui-focused': {
              color: '#818cf8',
            },
            '&.Mui-error': {
              color: '#f87171',
            },
          },
          '& .MuiInputLabel-filled.MuiInputLabel-shrink': {
            fontFamily: 'var(--font-mono), JetBrains Mono, monospace',
            fontSize: '0.68rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontWeight: 600,
            transform: 'translate(12px, 7px) scale(1)',
          },
        },
      },
    },

    /* ── Select ─────────────────────────────────────────────────────── */
    MuiSelect: {
      defaultProps: {
        variant: 'filled',
      },
      styleOverrides: {
        filled: {
          paddingTop: '24px',
          paddingBottom: '8px',
        },
      },
    },

    /* ── InputLabel ─────────────────────────────────────────────────── */
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#6a6a88',
        },
      },
    },

    /* ── Button ─────────────────────────────────────────────────────── */
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          fontFamily: 'var(--font-mono), JetBrains Mono, monospace',
          fontSize: '0.72rem',
          fontWeight: 600,
          borderRadius: '6px',
        },
        contained: {
          background: 'linear-gradient(135deg, #818cf8, #6366f1)',
          color: '#ffffff',
          boxShadow: '0 0 20px rgba(99,102,241,0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #a5b4fc, #818cf8)',
            boxShadow: '0 0 28px rgba(99,102,241,0.5)',
          },
        },
        outlined: {
          borderColor: '#818cf8',
          color: '#818cf8',
          '&:hover': {
            borderColor: '#a5b4fc',
            backgroundColor: 'rgba(129,140,248,0.08)',
            color: '#a5b4fc',
          },
        },
      },
    },

    /* ── Chip ───────────────────────────────────────────────────────── */
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: 'var(--font-mono), JetBrains Mono, monospace',
          fontSize: '0.65rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          height: '22px',
          borderRadius: '4px',
        },
        colorSuccess: {
          backgroundColor: 'rgba(52,211,153,0.12)',
          color: '#34d399',
          border: '1px solid rgba(52,211,153,0.25)',
        },
        colorWarning: {
          backgroundColor: 'rgba(251,191,36,0.12)',
          color: '#fbbf24',
          border: '1px solid rgba(251,191,36,0.25)',
        },
        colorError: {
          backgroundColor: 'rgba(248,113,113,0.12)',
          color: '#f87171',
          border: '1px solid rgba(248,113,113,0.25)',
        },
        colorDefault: {
          backgroundColor: 'rgba(106,106,136,0.15)',
          color: '#6a6a88',
          border: '1px solid rgba(106,106,136,0.25)',
        },
      },
    },

    /* ── Alert ──────────────────────────────────────────────────────── */
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          border: '1px solid',
          backdropFilter: 'blur(8px)',
        },
        standardSuccess: {
          backgroundColor: 'rgba(52,211,153,0.08)',
          borderColor: 'rgba(52,211,153,0.25)',
          color: '#34d399',
        },
        standardError: {
          backgroundColor: 'rgba(248,113,113,0.08)',
          borderColor: 'rgba(248,113,113,0.25)',
          color: '#f87171',
        },
        standardWarning: {
          backgroundColor: 'rgba(251,191,36,0.08)',
          borderColor: 'rgba(251,191,36,0.25)',
          color: '#fbbf24',
        },
        standardInfo: {
          backgroundColor: 'rgba(34,211,238,0.08)',
          borderColor: 'rgba(34,211,238,0.25)',
          color: '#22d3ee',
        },
      },
    },

    /* ── Divider ────────────────────────────────────────────────────── */
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(255,255,255,0.065)',
        },
      },
    },

    /* ── Table Head ─────────────────────────────────────────────────── */
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-root': {
            fontFamily: 'var(--font-mono), JetBrains Mono, monospace',
            fontSize: '0.65rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: '#6a6a88',
            backgroundColor: 'rgba(13,13,26,0.8)',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            paddingTop: '10px',
            paddingBottom: '10px',
          },
        },
      },
    },

    /* ── Table Body ─────────────────────────────────────────────────── */
    MuiTableBody: {
      styleOverrides: {
        root: {
          '& .MuiTableRow-root': {
            borderBottom: '1px solid rgba(255,255,255,0.04)',
            transition: 'background-color 0.15s',
            '&:hover': {
              backgroundColor: 'rgba(129,140,248,0.04)',
            },
            '&:last-child td': {
              borderBottom: 0,
            },
          },
          '& .MuiTableCell-root': {
            borderBottom: '1px solid rgba(255,255,255,0.04)',
            color: '#e2e2f0',
            fontSize: '0.85rem',
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
            backgroundColor: 'rgba(129,140,248,0.08)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(129,140,248,0.15)',
            '&:hover': {
              backgroundColor: 'rgba(129,140,248,0.2)',
            },
          },
        },
      },
    },

    /* ── Menu Paper ─────────────────────────────────────────────────── */
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: '#0d0d1a',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
        },
      },
    },

    /* ── Radio ──────────────────────────────────────────────────────── */
    MuiRadio: {
      styleOverrides: {
        root: {
          color: '#3a3a50',
          '&.Mui-checked': {
            color: '#818cf8',
          },
        },
      },
    },

    /* ── CircularProgress ───────────────────────────────────────────── */
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: '#818cf8',
        },
      },
    },
  },
});

export default theme;
