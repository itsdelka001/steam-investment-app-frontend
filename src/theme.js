import { createTheme, styled } from '@mui/material/styles';
import { Card, Box } from '@mui/material';

export const getTheme = (mode) => createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1920,
    },
  },
  palette: {
    mode: mode,
    primary: {
      main: mode === 'dark' ? '#9575CD' : '#4A148C',
      dark: mode === 'dark' ? '#7E57C2' : '#311B92', 
    },
    secondary: {
      main: mode === 'dark' ? '#4FC3F7' : '#007BFF',
    },
    background: {
      default: mode === 'dark' ? '#121212' : '#F8F9FA',
      paper: mode === 'dark' ? '#1E1E1E' : '#FFFFFF',
    },
    text: {
      primary: mode === 'dark' ? '#E0E0E0' : '#212529',
      secondary: mode === 'dark' ? '#A0A0A0' : '#6C757D',
    },
    divider: mode === 'dark' ? '#333333' : '#DEE2E6',
    success: {
      main: '#28A745',
      light: mode === 'dark' ? '#213324' : '#D4EDDA',
    },
    error: {
      main: '#DC3545',
      light: mode === 'dark' ? '#3B2022' : '#F8D7DA',
    },
    warning: {
      main: '#FFC107',
      light: mode === 'dark' ? '#3B331A' : '#FFF3CD',
    }
  },
  typography: {
    fontFamily: ['"Inter"', 'sans-serif'].join(','),
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          borderRadius: 8,
          textTransform: 'none',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transform: 'translateY(-2px)',
          },
          ...(ownerState.variant === 'contained' && ownerState.color === 'primary' && {
            background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
            color: '#fff',
          }),
        }),
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 12,
          background: theme.palette.background.paper,
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        }),
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: ({ theme }) => ({
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#F1F3F5',
            '&.Mui-focused fieldset': {
              borderColor: theme.palette.secondary.main,
            },
            '&:hover fieldset': {
              borderColor: theme.palette.secondary.main,
            },
          },
        }),
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          transition: 'box-shadow 0.3s, transform 0.3s',
          '&:hover': {
            boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
            transform: 'scale(1.01)',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: ({ theme }) => ({
          borderRadius: 16,
          background: theme.palette.background.paper,
          boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
        }),
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: ({ theme }) => ({
          height: 3,
          borderRadius: '4px 4px 0 0',
          backgroundColor: theme.palette.primary.main,
        }),
      },
    },
    MuiTab: {
      styleOverrides: {
        root: ({ theme }) => ({
          textTransform: 'none',
          fontWeight: 600,
          color: theme.palette.text.secondary,
          '&.Mui-selected': {
            color: theme.palette.primary.main,
          },
        }),
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: ({ theme }) => ({
          backgroundColor: theme.palette.text.primary,
          color: theme.palette.background.paper,
          borderRadius: 8,
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          fontSize: '0.875rem',
        }),
      },
    },
  },
});

export const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  minHeight: '320px',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: theme.spacing(1.5),
  overflow: 'visible',
  cursor: 'pointer',
  position: 'relative',
  [theme.breakpoints.down('sm')]: {
    minHeight: '280px',
    padding: theme.spacing(1),
    '& .MuiTypography-h6': { fontSize: '0.9rem' },
    '& .MuiTypography-body2': { fontSize: '0.7rem' }
  }
}));

export const StyledMetricCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2.5),
  borderRadius: 16,
  boxShadow: 'none',
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: `0 8px 24px rgba(0,0,0,0.08)`,
    borderColor: theme.palette.primary.main,
  },
  minHeight: 160,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
}));

export const StyledCombinedMetricCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  minHeight: 160,
  // height: '100%', // ---> ВИДАЛЕНО: Це виправляє проблему розтягування
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  position: 'relative',
  overflow: 'hidden',
  color: theme.palette.mode === 'dark' ? '#fff' : theme.palette.text.primary,
  background: theme.palette.mode === 'dark' 
    ? `linear-gradient(135deg, #2a223a 0%, #1e1e1e 70%)` 
    : `linear-gradient(135deg, #f3e5f5 0%, #ffffff 70%)`,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  
  '&:hover': {
    transform: 'translateY(-5px) scale(1.02)',
    boxShadow: `0 12px 28px ${theme.palette.mode === 'dark' ? 'rgba(149, 117, 205, 0.2)' : 'rgba(74, 20, 140, 0.2)'}`,
  },
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -50,
    right: -50,
    width: 150,
    height: 150,
    background: theme.palette.primary.main,
    opacity: 0.1,
    borderRadius: '50%',
    filter: 'blur(40px)',
    transition: 'opacity 0.3s ease',
  },
  
  '&:hover::before': {
    opacity: 0.2,
  }
}));


export const CardHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingBottom: theme.spacing(1),
  minHeight: '64px',
}));

export const CardFooter = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingTop: theme.spacing(1),
}));