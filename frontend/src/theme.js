import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#ef4444', light: '#f87171', dark: '#dc2626' },
    secondary: { main: '#b91c1c', light: '#ef4444', dark: '#7f1d1d' },
    success: { main: '#10b981', light: '#34d399', dark: '#059669' },
    warning: { main: '#f59e0b', light: '#fbbf24', dark: '#d97706' },
    error: { main: '#ef4444', light: '#f87171', dark: '#dc2626' },
    background: { default: '#0a0000', paper: '#130000' },
    text: { primary: '#f9f4f4', secondary: '#a89090' },
    divider: 'rgba(239, 68, 68, 0.1)',
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(20, 0, 0, 0.85)',
          border: '1px solid rgba(239, 68, 68, 0.08)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, borderRadius: 8 },
        contained: {
          boxShadow: '0 4px 14px rgba(239,68,68,0.3)',
          '&:hover': { boxShadow: '0 6px 20px rgba(239,68,68,0.45)', transform: 'translateY(-1px)' },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#ef4444' },
          },
          '& label.Mui-focused': { color: '#ef4444' },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderBottom: '1px solid rgba(239,68,68,0.08)' },
        head: { fontWeight: 600, color: '#a89090', backgroundColor: 'rgba(20,0,0,0.6)' },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: { backgroundColor: '#ef4444' },
      },
    },
    MuiChip: {
      styleOverrides: { root: { fontWeight: 500 } },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(10, 0, 0, 0.97)',
          borderRight: '1px solid rgba(239,68,68,0.12)',
        },
      },
    },
  },
});

export default theme;
