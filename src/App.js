import React, { useState, useEffect, useRef, memo } from 'react';
import {
  Container, Typography, Box, TextField, Button, Table, TableHead, TableBody, TableRow, TableCell,
  Select, MenuItem, FormControl, InputLabel, Dialog, DialogTitle, DialogContent, DialogActions,
  Tabs, Tab, IconButton, Snackbar, Alert, Grid, Card, CardContent, Chip, Tooltip,
  Autocomplete, CircularProgress, Divider, LinearProgress, Paper, Fab, Menu,
  Pagination, Switch, FormGroup, FormControlLabel,
  TableSortLabel, List, ListItem, ListItemText, ListItemSecondaryAction, ListItemButton
} from '@mui/material';
import {
  TrendingUp, Delete, Check, BarChart, Plus, Globe, X, ArrowUp, Edit,
  History, Settings, Tag, Palette, Rocket, Zap, DollarSign, Percent, TrendingDown,
  ArrowDown, Menu as MenuIcon, Eye,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip as ChartTooltip, ResponsiveContainer, CartesianGrid, Legend, PieChart, Pie,
  Cell
} from 'recharts';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';

const getTheme = (mode) => createTheme({
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
    },
    secondary: {
      main: mode === 'dark' ? '#4FC3F7' : '#007BFF',
    },
    background: {
      default: mode === 'dark' ? '#292b2f' : '#e0e5ec',
      paper: mode === 'dark' ? '#292b2f' : '#e0e5ec',
    },
    text: {
      primary: mode === 'dark' ? '#c7c7c7' : '#575757',
      secondary: mode === 'dark' ? '#929292' : '#a0a0a0',
    },
    divider: mode === 'dark' ? '#3e3e3e' : '#cacaca',
    success: {
      main: mode === 'dark' ? '#4CAF50' : '#4CAF50',
      light: mode === 'dark' ? '#2f3b30' : '#E8F5E9',
    },
    error: {
      main: mode === 'dark' ? '#F44336' : '#F44336',
      light: mode === 'dark' ? '#3b2f2f' : '#FFEBEE',
    },
    warning: {
      main: mode === 'dark' ? '#FFC107' : '#FFC107',
      light: mode === 'dark' ? '#3b3a2f' : '#FFF8E1',
    }
  },
  typography: {
    fontFamily: ['"Poppins"', 'sans-serif'].join(','),
    h4: {
      fontWeight: 600,
      letterSpacing: -1,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          borderRadius: 16,
          textTransform: 'none',
          boxShadow: `6px 6px 12px ${theme.palette.mode === 'dark' ? '#222428' : '#b8c0cc'},
                       -6px -6px 12px ${theme.palette.mode === 'dark' ? '#303236' : '#ffffff'}`,
          transition: 'all 0.4s ease-in-out',
          '&:hover': {
            boxShadow: `inset 2px 2px 5px ${theme.palette.mode === 'dark' ? '#222428' : '#b8c0cc'},
                         inset -3px -3px 7px ${theme.palette.mode === 'dark' ? '#303236' : '#ffffff'}`,
            transform: 'scale(0.98)',
            backgroundColor: theme.palette.background.paper,
          },
          ...(ownerState.variant === 'contained' && ownerState.color === 'primary' && {
            background: `linear-gradient(45deg, ${theme.palette.primary.light} 30%, ${theme.palette.primary.main} 90%)`,
            color: '#fff',
          }),
        }),
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 20,
          background: theme.palette.background.paper,
          boxShadow: `9px 9px 18px ${theme.palette.mode === 'dark' ? '#222428' : '#b8c0cc'},
                       -9px -9px 18px ${theme.palette.mode === 'dark' ? '#303236' : '#ffffff'}`,
          transition: 'all 0.4s ease-in-out',
        }),
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: ({ theme }) => ({
          '& .MuiOutlinedInput-root': {
            borderRadius: 16,
            backgroundColor: theme.palette.background.default,
            boxShadow: `inset 3px 3px 6px ${theme.palette.mode === 'dark' ? '#222428' : '#b8c0cc'},
                         inset -3px -3px 6px ${theme.palette.mode === 'dark' ? '#303236' : '#ffffff'}`,
            transition: 'all 0.4s ease-in-out',
            '& fieldset': {
              border: 'none',
            },
            '&:hover fieldset': {
              border: 'none',
            },
            '&.Mui-focused fieldset': {
              border: `1px solid ${theme.palette.secondary.main}`,
              boxShadow: 'none',
            },
          },
        }),
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 20,
          boxShadow: `9px 9px 18px ${theme.palette.mode === 'dark' ? '#222428' : '#b8c0cc'},
                       -9px -9px 18px ${theme.palette.mode === 'dark' ? '#303236' : '#ffffff'}`,
          transition: 'all 0.4s ease-in-out',
          '&:hover': {
            boxShadow: `12px 12px 24px ${theme.palette.mode === 'dark' ? '#1e2023' : '#aab4c3'},
                         -12px -12px 24px ${theme.palette.mode === 'dark' ? '#34383f' : '#ffffff'}`,
            transform: 'translateY(-2px)',
          },
        }),
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: ({ theme }) => ({
          borderRadius: 24,
          background: theme.palette.background.paper,
          boxShadow: `9px 9px 18px ${theme.palette.mode === 'dark' ? '#222428' : '#b8c0cc'},
                       -9px -9px 18px ${theme.palette.mode === 'dark' ? '#303236' : '#ffffff'}`,
        }),
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: `inset 3px 3px 6px #b8c0cc,
                       inset -3px -3px 6px #ffffff`,
          backgroundColor: '#e0e5ec',
        },
        indicator: {
          display: 'none',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: ({ theme }) => ({
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 12,
          color: theme.palette.text.secondary,
          '&.Mui-selected': {
            color: theme.palette.primary.main,
            backgroundColor: theme.palette.background.default,
            boxShadow: `6px 6px 12px ${theme.palette.mode === 'dark' ? '#222428' : '#b8c0cc'},
                         -6px -6px 12px ${theme.palette.mode === 'dark' ? '#303236' : '#ffffff'}`,
          },
        }),
      },
    },
    MuiChip: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 8,
          boxShadow: `3px 3px 6px ${theme.palette.mode === 'dark' ? '#222428' : '#b8c0cc'},
                       -3px -3px 6px ${theme.palette.mode === 'dark' ? '#303236' : '#ffffff'}`,
        }),
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: ({ theme }) => ({
          backgroundColor: theme.palette.text.primary,
          color: theme.palette.background.paper,
          borderRadius: 12,
          boxShadow: `3px 3px 6px ${theme.palette.mode === 'dark' ? '#222428' : '#b8c0cc'},
                       -3px -3px 6px ${theme.palette.mode === 'dark' ? '#303236' : '#ffffff'}`,
          fontSize: '0.875rem',
        }),
      },
    },
    MuiFab: {
      styleOverrides: {
        root: ({ theme }) => ({
          boxShadow: `6px 6px 12px ${theme.palette.mode === 'dark' ? '#222428' : '#b8c0cc'},
                       -6px -6px 12px ${theme.palette.mode === 'dark' ? '#303236' : '#ffffff'}`,
          transition: 'all 0.4s ease-in-out',
          '&:hover': {
            boxShadow: `inset 2px 2px 5px ${theme.palette.mode === 'dark' ? '#222428' : '#b8c0cc'},
                         inset -3px -3px 7px ${theme.palette.mode === 'dark' ? '#303236' : '#ffffff'}`,
            transform: 'scale(0.98)',
            backgroundColor: theme.palette.background.paper,
          },
        }),
      },
    },
  },
});

const StyledCard = styled(Card)(({ theme }) => ({
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
    '& .MuiTypography-h6': {
      fontSize: '0.9rem',
    },
    '& .MuiTypography-body2': {
      fontSize: '0.7rem',
    }
  }
}));

const StyledMetricCard = styled(Card)(({ theme, bgcolor }) => ({
  padding: theme.spacing(3),
  borderRadius: 20,
  boxShadow: `9px 9px 18px ${theme.palette.mode === 'dark' ? '#222428' : '#b8c0cc'},
               -9px -9px 18px ${theme.palette.mode === 'dark' ? '#303236' : '#ffffff'}`,
  backgroundColor: bgcolor || theme.palette.background.paper,
  transition: 'all 0.4s ease-in-out',
  '&:hover': {
    boxShadow: `inset 2px 2px 5px ${theme.palette.mode === 'dark' ? '#222428' : '#b8c0cc'},
                 inset -3px -3px 7px ${theme.palette.mode === 'dark' ? '#303236' : '#ffffff'}`,
    transform: 'scale(0.98)',
  },
  textAlign: 'center',
  minHeight: 160,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
}));

const CardHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingBottom: theme.spacing(1),
  minHeight: '64px',
}));

const CardFooter = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingTop: theme.spacing(1),
}));


const GAMES = ["Усі", "CS2", "Dota 2", "PUBG"];
const CURRENCIES = ["EUR", "USD", "UAH"];
const CURRENCY_SYMBOLS = { "EUR": "€", "USD": "$", "UAH": "₴" };
const EXCHANGERATE_API_KEY = "61a8a12c18b1b14a645ebc37";

const BACKEND_URL = 'https://steam-proxy-server-lues.onrender.com';
const PROXY_SERVER_URL = "https://steam-proxy-server-lues.onrender.com";

const ITEMS_PER_PAGE = 9;

// ===== ВИПРАВЛЕННЯ 2: ПЕРЕМІЩЕННЯ КОМПОНЕНТА ЗА МЕЖІ ОСНОВНОГО КОМПОНЕНТА =====
const CommissionManagerDialog = ({ open, onClose, item, updateInvestment, showSnackbar, theme }) => {
  // ===== ВИПРАВЛЕННЯ: ПЕРЕМІЩЕННЯ ВИКЛИКІВ ХУКІВ НА ПОЧАТОК КОМПОНЕНТА =====
  const [newCommissionRate, setNewCommissionRate] = useState(0);
  const [newCommissionNote, setNewCommissionNote] = useState("");
  const [editingCommissionIndex, setEditingCommissionIndex] = useState(null);

  if (!item) {
    return null;
  }
  // =======================================================================
  
  const isEditing = editingCommissionIndex !== null;
  const totalCommissionRate = (item.commissions || []).reduce((sum, c) => sum + c.rate, 0);

  const handleAddCommission = () => {
    if (newCommissionRate <= 0) {
      showSnackbar("Комісія має бути більше 0", "error");
      return;
    }
    const updatedCommissions = [...(item.commissions || []), { id: Date.now(), rate: Number(newCommissionRate), note: newCommissionNote }];
    updateInvestment(item.id, { commissions: updatedCommissions });
    setNewCommissionRate(0);
    setNewCommissionNote("");
  };

  const handleEditCommission = (commission, index) => {
    setNewCommissionRate(commission.rate);
    setNewCommissionNote(commission.note);
    setEditingCommissionIndex(index);
  };

  const handleUpdateCommission = () => {
    if (newCommissionRate <= 0) {
      showSnackbar("Комісія має бути більше 0", "error");
      return;
    }
    if (editingCommissionIndex !== null) {
      const updatedCommissions = [...(item.commissions || [])];
      updatedCommissions[editingCommissionIndex] = { ...updatedCommissions[editingCommissionIndex], rate: Number(newCommissionRate), note: newCommissionNote };
      updateInvestment(item.id, { commissions: updatedCommissions });
      setNewCommissionRate(0);
      setNewCommissionNote("");
      setEditingCommissionIndex(null);
    }
  };

  const handleDeleteCommission = (id) => {
    const updatedCommissions = (item.commissions || []).filter(c => c.id !== id);
    updateInvestment(item.id, { commissions: updatedCommissions });
  };
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ style: { borderRadius: 16 } }}>
      <DialogTitle sx={{ textAlign: 'center', pb: 0 }}>
        <Typography variant="h6" fontWeight="bold" color="primary">Управління комісіями</Typography>
      </DialogTitle>
      <DialogContent dividers>
        <Box mb={2}>
          <Typography variant="body1" color="text.secondary" textAlign="center">
            Комісії для предмета: <br/> **{item.name}**
          </Typography>
          <Typography variant="h5" fontWeight="bold" textAlign="center" mt={1}>
            Загальна комісія: {totalCommissionRate.toFixed(2)}%
          </Typography>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body1" fontWeight="bold" mb={1}>Існуючі комісії:</Typography>
        {(item.commissions || []).length > 0 ? (
          <List dense>
            {(item.commissions || []).map((commission, index) => (
              <ListItem 
                key={commission.id || index} 
                disablePadding 
                secondaryAction={
                  <ListItemSecondaryAction>
                    <Tooltip title="Редагувати">
                      <IconButton 
                        edge="end" 
                        aria-label="edit" 
                        onClick={() => handleEditCommission(commission, index)}
                        size="small"
                      >
                        <Edit size={16} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Видалити">
                      <IconButton 
                        edge="end" 
                        aria-label="delete" 
                        onClick={() => handleDeleteCommission(commission.id)}
                        size="small"
                        color="error"
                      >
                        <Delete size={16} />
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                }
                sx={{ 
                  '&:hover': { backgroundColor: theme.palette.action.hover },
                  borderRadius: 8,
                  mb: 1,
                  backgroundColor: editingCommissionIndex === index ? theme.palette.action.selected : 'transparent'
                }}
              >
                <ListItemButton>
                  <ListItemText
                    primary={`${commission.rate}%`}
                    secondary={commission.note}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="text.secondary" align="center">
            Для цього предмета немає комісій.
          </Typography>
        )}
        <Divider sx={{ my: 2 }} />
        <Typography variant="body1" fontWeight="bold" mb={1}>{isEditing ? "Редагувати комісію" : "Додати нову комісію"}:</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Відсоток комісії (%)"
              type="number"
              value={newCommissionRate}
              onChange={(e) => setNewCommissionRate(e.target.value)}
              fullWidth
              required
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Примітка"
              value={newCommissionNote}
              onChange={(e) => setNewCommissionNote(e.target.value)}
              fullWidth
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Button 
          onClick={onClose} 
          color="secondary" 
          variant="outlined"
          sx={{ borderRadius: 8 }}
        >
          Закрити
        </Button>
        <Button 
          onClick={isEditing ? handleUpdateCommission : handleAddCommission} 
          color="primary" 
          variant="contained"
          sx={{ borderRadius: 8 }}
        >
          {isEditing ? "Зберегти зміни" : "Додати"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
// ======================================================================================


export default function App() {
  const [investments, setInvestments] = useState([]);
  const [name, setName] = useState("");
  const [count, setCount] = useState(1);
  const [buyPrice, setBuyPrice] = useState(0);
  const [buyCurrency, setBuyCurrency] = useState(CURRENCIES[0]);
  const [displayCurrency, setDisplayCurrency] = useState(CURRENCIES[0]);
  const [game, setGame] = useState(GAMES[1]);
  const [boughtDate, setBoughtDate] = useState(new Date().toISOString().split('T')[0]);
  const [tabValue, setTabValue] = useState(0);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [addDialog, setAddDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [sellDialog, setSellDialog] = useState(false);
  const [itemToSell, setItemToSell] = useState(null);
  const [sellPrice, setSellPrice] = useState(0);
  const [sellDate, setSellDate] = useState(new Date().toISOString().split('T')[0]);
  const [lang, setLang] = useState('uk');
  const [autocompleteLoading, setAutocompleteLoading] = useState(false);
  const [itemOptions, setItemOptions] = useState([]);
  const abortControllerRef = useRef(null);
  const [autocompleteValue, setAutocompleteValue] = useState(null);
  const [selectedItemDetails, setSelectedItemDetails] = useState(null);
  const [marketAnalysisDialog, setMarketAnalysisDialog] = useState(false);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisText, setAnalysisText] = useState("");
  const [itemToAnalyze, setItemToAnalyze] = useState(null);
  const [settingsAnchorEl, setSettingsAnchorEl] = useState(null);
  const settingsMenuOpen = Boolean(settingsAnchorEl);
  const [itemDetailsDialogOpen, setItemDetailsDialogOpen] = useState(false);
  const [itemToDisplayDetails, setItemToDisplayDetails] = useState(null);
  const [isUpdatingAllPrices, setIsUpdatingAllPrices] = useState(false);
  const [t, setT] = useState({});
  const [exchangeRates, setExchangeRates] = useState({});
  const [themeMode, setThemeMode] = useState('light');
  const [autoUpdateEnabled, setAutoUpdateEnabled] = useState(false);

  const [commissionManagerDialogOpen, setCommissionManagerDialogOpen] = useState(false);
  const [commissionItemToManage, setCommissionItemToManage] = useState(null);
  // States for commission manager are moved to the dialog component itself
  // const [newCommissionRate, setNewCommissionRate] = useState(0);
  // const [newCommissionNote, setNewCommissionNote] = useState("");
  // const [editingCommissionIndex, setEditingCommissionIndex] = useState(null);

  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortBy, setSortBy] = useState('boughtDate');

  const theme = getTheme(themeMode);

  useEffect(() => {
    async function loadTranslations() {
      try {
        const translations = await import(`./locales/${lang}.json`);
        setT(translations.default);
      } catch (error) {
        console.error('Failed to load translations:', error);
      }
    }
    loadTranslations();
  }, [lang]);

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${EXCHANGERATE_API_KEY}/latest/EUR`);
        const data = await response.json();
        if (data.result === "success") {
          setExchangeRates(data.conversion_rates);
          showSnackbar("Курси валют оновлено", "success");
        } else {
          showSnackbar("Не вдалося оновити курси валют. Використовуються застарілі дані.", "warning");
        }
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
        showSnackbar("Помилка підключення до API курсів валют.", "error");
      }
    };
    fetchExchangeRates();
  }, []);

  useEffect(() => {
    let intervalId;
    if (autoUpdateEnabled) {
      intervalId = setInterval(() => {
        fetchAndUpdateAllPrices();
      }, 15 * 60 * 1000);
    }
    return () => clearInterval(intervalId);
  }, [autoUpdateEnabled, investments]);

  const convertCurrency = (value, fromCurrency) => {
    if (fromCurrency === displayCurrency || !exchangeRates[fromCurrency] || !exchangeRates[displayCurrency]) {
      return value;
    }
    const rateToEUR = 1 / exchangeRates[fromCurrency];
    const rateFromEUR = exchangeRates[displayCurrency];
    return value * rateToEUR * rateFromEUR;
  };

  const getInvestments = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/investments`);
      if (!response.ok) {
        throw new Error('Failed to fetch investments from backend');
      }
      const data = await response.json();
      setInvestments(data);
    } catch (error) {
      console.error("Error fetching investments:", error);
      showSnackbar(t.fetchError, "error");
    }
  };

  useEffect(() => {
    getInvestments();
  }, []);

  const handleSettingsMenuClick = (event) => {
    setSettingsAnchorEl(event.currentTarget);
  };

  const handleSettingsMenuClose = () => {
    setSettingsAnchorEl(null);
  };

  const handleSort = (property) => {
    const isAsc = sortBy === property && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortBy(property);
  };

  const updateInvestment = async (id, data) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/investments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to update investment');
      }
      setInvestments(prev => prev.map(item => (item.id === id ? { ...item, ...data } : item)));
      showSnackbar(t.itemUpdated, 'success');
    } catch (error) {
      console.error("Error updating investment:", error);
      showSnackbar("Помилка при оновленні активу", "error");
    }
  };

  const deleteInvestment = async (id) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/investments/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete investment');
      }
      setInvestments(prev => prev.filter(item => item.id !== id));
      showSnackbar(t.itemDeleted, 'success');
    } catch (error) {
      console.error("Error deleting investment:", error);
      showSnackbar("Помилка при видаленні активу", "error");
    }
  };

  const getGameFromItemName = (itemName) => {
    const cs2Keywords = ["case", "sticker", "skin", "glove", "knife", "pin", "key", "capsule", "souvenir", "weapon"];
    const dota2Keywords = ["treasure", "immortal", "arcana", "set", "courier", "chest", "hero"];
    const pubgKeywords = ["crate", "box", "outfit", "skin", "key", "g-coin"];
  
    const lowerItemName = itemName.toLowerCase();
  
    if (cs2Keywords.some(keyword => lowerItemName.includes(keyword))) {
      return "CS2";
    }
    if (dota2Keywords.some(keyword => lowerItemName.includes(keyword))) {
      return "Dota 2";
    }
    if (pubgKeywords.some(keyword => lowerItemName.includes(keyword))) {
      return "PUBG";
    }
    return "CS2";
  };
  
  const handleItemNameChange = async (event, newInputValue) => {
    setName(newInputValue);
    if (newInputValue && newInputValue.length > 2) {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;
      setAutocompleteLoading(true);

      try {
        const selectedGame = tabValue === 0 ? game : GAMES[tabValue];
        const url = `${PROXY_SERVER_URL}/search?query=${encodeURIComponent(newInputValue)}&game=${encodeURIComponent(selectedGame)}`;
        const response = await fetch(url, { signal });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        if (Array.isArray(data)) {
            const formattedOptions = data.map(item => ({
                label: item.name,
                image: item.icon_url,
                market_hash_name: item.market_hash_name,
            }));
            setItemOptions(formattedOptions);
        } else {
            console.error('API did not return an array:', data);
            setItemOptions([]);
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('Fetch aborted');
        } else {
          console.error('Error fetching autocomplete options:', error);
          showSnackbar(t.fetchError, "error");
        }
      } finally {
        setAutocompleteLoading(false);
      }
    } else {
      setItemOptions([]);
      setAutocompleteLoading(false);
    }
  };

  const handleAutocompleteChange = (event, newValue) => {
    setAutocompleteValue(newValue);
    if (newValue && typeof newValue === 'object') {
      setName(newValue.label);
      setSelectedItemDetails({ ...newValue, image: newValue.image });
      const detectedGame = getGameFromItemName(newValue.label);
      setGame(detectedGame);
      setTabValue(GAMES.indexOf(detectedGame));
    } else {
      setName(newValue || '');
      setSelectedItemDetails(null);
    }
  };

  const handleCurrentPriceUpdate = async (item) => {
    try {
      const url = `${PROXY_SERVER_URL}/current_price?item_name=${encodeURIComponent(item.market_hash_name)}&game=${encodeURIComponent(item.game)}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.price) {
        const currentPrice = data.price;
        await updateInvestment(item.id, { currentPrice });
        showSnackbar(`Поточна ціна для ${item.name}: ${convertCurrency(currentPrice, "EUR").toFixed(2)} ${CURRENCY_SYMBOLS[displayCurrency]}`, 'info');
        getInvestments();
      } else {
        showSnackbar('Не вдалося отримати поточну ціну.', 'warning');
      }
    } catch (error) {
      console.error('Error fetching current price:', error);
      showSnackbar('Помилка при оновленні ціни.', 'error');
    }
  };

  const fetchAndUpdateAllPrices = async () => {
    setIsUpdatingAllPrices(true);
    showSnackbar(t.updateAllPrices, 'info');
    try {
      const activeInvestments = investments.filter(item => !item.sold);
      for (const item of activeInvestments) {
        const url = `${PROXY_SERVER_URL}/current_price?item_name=${encodeURIComponent(item.market_hash_name)}&game=${encodeURIComponent(item.game)}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.price) {
          const currentPrice = data.price;
          await fetch(`${BACKEND_URL}/api/investments/${item.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ currentPrice }),
          });
        }
      }
      showSnackbar("Усі ціни оновлено!", 'success');
      getInvestments();
    } catch (error) {
      console.error('Error fetching and updating all prices:', error);
      showSnackbar('Помилка при масовому оновленні цін.', 'error');
    } finally {
      setIsUpdatingAllPrices(false);
    }
  };

  const handleMarketAnalysis = async (item) => {
    setItemToAnalyze(item);
    setMarketAnalysisDialog(true);
    setAnalysisLoading(true);
    setAnalysisText("");

    try {
      const url = `${PROXY_SERVER_URL}/market_analysis`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemName: item.name,
          game: item.game,
        }),
      });
      const data = await response.json();

      if (data.analysis) {
        setAnalysisText(data.analysis);
      } else {
        setAnalysisText("Неможливо згенерувати аналіз. Спробуйте пізніше.");
        showSnackbar('Помилка генерації аналізу.', 'error');
      }
    } catch (error) {
      console.error('Error fetching market analysis:', error);
      setAnalysisText("Помилка зв'язку з системою аналізу. Перевірте з'єднання.");
      showSnackbar('Критична помилка аналізу.', 'error');
    } finally {
      setAnalysisLoading(false);
    }
  };

  const addItem = async () => {
    // ===== ВИПРАВЛЕННЯ 1: ПРАВИЛЬНА ПЕРЕВІРКА ІМЕНІ ПРЕДМЕТА =====
    const finalName = autocompleteValue?.label || name;
    if (!finalName || finalName.trim() === '' || count <= 0 || buyPrice <= 0 || !boughtDate) {
      showSnackbar("СИСТЕМНА ПОМИЛКА: ВВЕДІТЬ ПОВНІ ДАНІ", "error");
      return;
    }

    try {
      const newItem = {
        name: finalName, // Використовуємо виправлене значення
        market_hash_name: selectedItemDetails?.market_hash_name || finalName, // Використовуємо виправлене значення
        count: Number(count),
        buyPrice: Number(buyPrice),
        currentPrice: 0,
        game,
        boughtDate,
        buyCurrency,
        sold: false,
        sellPrice: 0,
        sellDate: null,
        image: selectedItemDetails?.image || null,
        createdAt: new Date().toISOString(),
        commissions: [
          { id: Date.now(), rate: 15, note: "Steam Market" }
        ],
      };

      const response = await fetch(`${BACKEND_URL}/api/investments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add investment');
      }

      showSnackbar(t.itemAdded, "success");
      resetForm();
      setAddDialog(false);
      getInvestments();
      
    } catch (error) {
      console.error("Error adding investment:", error);
      showSnackbar("Помилка при додаванні активу", "error");
    }
  };

  const markAsSold = async () => {
    if (!itemToSell || sellPrice <= 0 || !sellDate) {
      showSnackbar("СИСТЕМНА ПОМИЛКА: ВВЕДІТЬ ЦІНУ ВИХОДУ", "error");
      return;
    }

    try {
      await updateInvestment(itemToSell.id, {
        sold: true,
        sellPrice: Number(sellPrice),
        sellDate: sellDate,
      });
      setSellDialog(false);
      resetForm();
      getInvestments();
    } catch (error) {
      console.error("Error marking item as sold:", error);
      showSnackbar("Помилка при закритті операції", "error");
    }
  };

  const confirmDelete = (item) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteInvestment(itemToDelete.id);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error("Error in handleDelete:", error);
    }
  };

  const resetForm = () => {
    setName("");
    setCount(1);
    setBuyPrice(0);
    setGame(GAMES[1]);
    setBoughtDate(new Date().toISOString().split('T')[0]);
    setSellPrice(0);
    setSellDate(new Date().toISOString().split('T')[0]);
    setAutocompleteValue(null);
    setItemOptions([]);
    setSelectedItemDetails(null);
  };

  const handleEdit = (item) => {
    setItemToEdit(item);
    setName(item.name);
    setCount(item.count);
    setBuyPrice(item.buyPrice);
    setGame(item.game);
    setBoughtDate(item.boughtDate);
    setEditDialog(true);
  };

  const saveEditedItem = async () => {
    if (!itemToEdit || !name || count <= 0 || buyPrice <= 0 || !boughtDate) {
      showSnackbar("СИСТЕМНА ПОМИЛКА: ВВЕДІТЬ ПОВНІ ДАНІ", "error");
      return;
    }

    const updatedData = {
      name,
      count: Number(count),
      buyPrice: Number(buyPrice),
      game,
      boughtDate,
    };

    try {
      await updateInvestment(itemToEdit.id, updatedData);
      setEditDialog(false);
      resetForm();
      getInvestments();
    } catch (error) {
      console.error("Error saving edited item:", error);
      showSnackbar("Помилка при збереженні змін", "error");
    }
  };

  const handleCommissionManagerOpen = (event, item) => {
    event.stopPropagation();
    setCommissionItemToManage(item);
    setCommissionManagerDialogOpen(true);
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleAnalyticsOpen = () => {
    setAnalyticsOpen(true);
  };

  const handleItemDetailsOpen = async (item) => {
    setItemToDisplayDetails(item);
    setItemDetailsDialogOpen(true);
  };

  const filteredInvestments = tabValue === 0 ? investments : investments.filter((item) => item.game === GAMES[tabValue]);
  
  const sortedInvestments = [...filteredInvestments].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    if (aValue < bValue) {
      return sortOrder === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortOrder === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const pageCount = Math.ceil(sortedInvestments.length / ITEMS_PER_PAGE);
  const paginatedInvestments = sortedInvestments.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const getNetProfit = (grossProfit, totalValue, commissions) => {
    const totalRate = (commissions || []).reduce((sum, c) => sum + c.rate, 0);
    const totalCommission = totalValue * (totalRate / 100);
    return grossProfit - totalCommission;
  };
  
  const totalInvestment = investments.reduce((sum, item) => sum + convertCurrency(item.buyPrice * item.count, item.buyCurrency), 0);
  
  const totalSoldProfit = investments
    .filter(item => item.sold)
    .reduce((sum, item) => {
      const grossProfit = (convertCurrency(item.sellPrice, item.buyCurrency) - convertCurrency(item.buyPrice, item.buyCurrency)) * item.count;
      const totalSellValue = convertCurrency(item.sellPrice, item.buyCurrency) * item.count;
      const netProfit = getNetProfit(grossProfit, totalSellValue, item.commissions);
      return sum + netProfit;
    }, 0);
    
  const totalMarketValue = investments
    .filter(item => !item.sold)
    .reduce((sum, item) => sum + convertCurrency((item.currentPrice || item.buyPrice) * item.count, item.buyCurrency), 0);

  const currentMarketProfit = totalMarketValue - investments
    .filter(item => !item.sold)
    .reduce((sum, item) => sum + convertCurrency(item.buyPrice * item.count, item.buyCurrency), 0);

  const profitColor = totalSoldProfit >= 0 ? theme.palette.success.main : theme.palette.error.main;
  const percentageProfit = totalInvestment > 0 ? (totalSoldProfit / totalInvestment) * 100 : 0;
  const currentProfitColor = currentMarketProfit >= 0 ? theme.palette.success.main : theme.palette.error.main;
  const currentPercentageProfit = totalInvestment > 0 ? (currentMarketProfit / totalInvestment) * 100 : 0;

  const profitByDate = investments
    .filter(item => item.sold)
    .map(item => {
      const grossProfit = (convertCurrency(item.sellPrice, item.buyCurrency) - convertCurrency(item.buyPrice, item.buyCurrency)) * item.count;
      const totalSellValue = convertCurrency(item.sellPrice, item.buyCurrency) * item.count;
      const netProfit = getNetProfit(grossProfit, totalSellValue, item.commissions);
      return { date: item.sellDate, profit: netProfit };
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .reduce((acc, curr) => {
      const existing = acc.find(p => p.date === curr.date);
      if (existing) {
        existing.profit += curr.profit;
      } else {
        acc.push(curr);
      }
      return acc;
    }, []);

  const cumulativeProfit = profitByDate.reduce((acc, curr) => {
    const lastProfit = acc.length > 0 ? acc[acc.length - 1].profit : 0;
    acc.push({ ...curr, profit: lastProfit + curr.profit });
    return acc;
  }, []);

  const investmentDistributionData = Object.entries(investments.reduce((acc, item) => {
    if (!acc[item.game]) acc[item.game] = 0;
    acc[item.game] += convertCurrency(item.buyPrice * item.count, item.buyCurrency);
    return acc;
  }, {})).map(([game, value]) => ({ name: game, value }));

  const PIE_COLORS = ['#4A148C', '#007BFF', '#DC3545', '#FFC107', '#28A745'];

  const ItemDetailsDialog = ({ open, onClose, item }) => {
    if (!item) return null;

    const convertedTotalBuyPrice = convertCurrency(item.buyPrice * item.count, item.buyCurrency);
    const convertedCurrentPrice = item.currentPrice ? convertCurrency(item.currentPrice, "EUR") : null;
    const convertedTotalCurrentPrice = convertedCurrentPrice ? convertedCurrentPrice * item.count : convertedTotalBuyPrice;
    
    const itemGrossProfit = convertedTotalCurrentPrice - convertedTotalBuyPrice;
    const itemTotalValue = item.sold ? convertCurrency(item.sellPrice * item.count, item.buyCurrency) : convertedTotalCurrentPrice;
    const itemProfit = getNetProfit(itemGrossProfit, itemTotalValue, item.commissions);
    const profitColor = itemProfit >= 0 ? theme.palette.success.main : theme.palette.error.main;
    const profitPercentage = convertedTotalBuyPrice > 0 ? ((itemProfit / convertedTotalBuyPrice) * 100).toFixed(2) : '0.00';
    const totalCommissionRate = (item.commissions || []).reduce((sum, c) => sum + c.rate, 0);

    const handleOpenMarketLink = () => {
      let url = '';
      if (item.game === "CS2") {
        url = `https://steamcommunity.com/market/listings/730/${encodeURIComponent(item.market_hash_name)}`;
      } else if (item.game === "Dota 2") {
        url = `https://steamcommunity.com/market/listings/570/${encodeURIComponent(item.market_hash_name)}`;
      } else if (item.game === "PUBG") {
        url = `https://steamcommunity.com/market/listings/578080/${encodeURIComponent(item.market_hash_name)}`;
      }
      if (url) {
        window.open(url, '_blank');
      }
    };

    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ style: { borderRadius: 16 } }}>
        <DialogTitle sx={{ textAlign: 'center' }}>
          <Typography variant="h6" fontWeight="bold" color="primary">{t.itemDetails}</Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={5}>
              <Box display="flex" flexDirection="column" alignItems="center">
                {item.image && (
                  <img src={item.image} alt={item.name} style={{ width: '100%', maxWidth: 200, borderRadius: 8, marginBottom: 16 }} />
                )}
                <Typography variant="h5" fontWeight="bold" textAlign="center">{item.name}</Typography>
                <Chip label={item.sold ? t.sold : t.active} color={item.sold ? "success" : "primary"} size="small" sx={{ mt: 1, fontWeight: 'bold' }} />
              </Box>
            </Grid>
            <Grid item xs={12} md={7}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Ціна за одиницю</Typography>
                  <Typography variant="h6" fontWeight="bold">{convertCurrency(item.buyPrice, item.buyCurrency).toFixed(2)} {CURRENCY_SYMBOLS[displayCurrency]}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Поточна ціна</Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {item.currentPrice ? convertCurrency(item.currentPrice, 'EUR').toFixed(2) : 'N/A'} {CURRENCY_SYMBOLS[displayCurrency]}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Загальна вартість</Typography>
                  <Typography variant="h6" fontWeight="bold">{convertedTotalBuyPrice.toFixed(2)} {CURRENCY_SYMBOLS[displayCurrency]}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Поточна вартість</Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {convertedTotalCurrentPrice.toFixed(2)} {CURRENCY_SYMBOLS[displayCurrency]}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Прибуток</Typography>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: profitColor }}>
                    {itemProfit.toFixed(2)} {CURRENCY_SYMBOLS[displayCurrency]}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Відсоток прибутку</Typography>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: profitColor }}>
                    {profitPercentage}%
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">Комісії: {totalCommissionRate.toFixed(2)}%</Typography>
                  {(item.commissions || []).map((commission, index) => (
                    <Chip key={index} label={`${commission.note}: ${commission.rate}%`} sx={{ mr: 1, mt: 1 }} />
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, display: 'flex', justifyContent: 'space-between' }}>
          <Button onClick={handleOpenMarketLink} color="secondary" variant="outlined" startIcon={<Globe />}>
            На маркет
          </Button>
          <Box>
            <Button onClick={onClose} color="primary" variant="outlined" sx={{ mr: 1 }}>
              Закрити
            </Button>
            {item.sold ? (
              <Button onClick={() => confirmDelete(item)} color="error" variant="contained">
                Видалити
              </Button>
            ) : (
              <Button onClick={() => setSellDialog(true)} color="success" variant="contained">
                Продати
              </Button>
            )}
          </Box>
        </DialogActions>
      </Dialog>
    );
  };

  const getDayDifference = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2 - d1);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  
  const totalDaysHeld = investments.reduce((sum, item) => {
    if (item.sold) {
      return sum + getDayDifference(item.boughtDate, item.sellDate);
    }
    return sum;
  }, 0);
  const soldItemsCount = investments.filter(item => item.sold).length;
  const avgHoldingPeriod = soldItemsCount > 0 ? (totalDaysHeld / soldItemsCount).toFixed(2) : 0;
  
  const totalCommissions = investments.reduce((sum, item) => {
    const buyValue = convertCurrency(item.buyPrice * item.count, item.buyCurrency);
    const finalValue = item.sold ? convertCurrency(item.sellPrice * item.count, item.buyCurrency) : convertCurrency((item.currentPrice || item.buyPrice) * item.count, item.buyCurrency);
    const totalRate = (item.commissions || []).reduce((rateSum, c) => rateSum + c.rate, 0);
    const commissionValue = finalValue * (totalRate / 100);
    return sum + commissionValue;
  }, 0);

  const StatCard = ({ title, value, icon, color }) => (
    <StyledMetricCard>
      <Box sx={{ color: color }}>
        {icon}
      </Box>
      <Typography variant="h5" fontWeight="bold" sx={{ mt: 1, mb: 0.5 }}>{value}</Typography>
      <Typography variant="body2" color="text.secondary" noWrap>{title}</Typography>
    </StyledMetricCard>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{
        minHeight: '100vh',
        background: theme.palette.background.default,
        py: 4,
        color: theme.palette.text.primary,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="h4" fontWeight="bold" sx={{ mr: 2 }}>
                My Investments
              </Typography>
              <Tooltip title="Налаштування">
                <IconButton onClick={handleSettingsMenuClick} color="primary">
                  <Settings size={24} />
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={settingsAnchorEl}
                open={settingsMenuOpen}
                onClose={handleSettingsMenuClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
                PaperProps={{
                  sx: {
                    borderRadius: 16,
                  }
                }}
              >
                <Box sx={{ p: 2, minWidth: 200 }}>
                  <Typography variant="subtitle2" color="text.secondary">Тема</Typography>
                  <FormGroup>
                    <FormControlLabel control={
                      <Switch
                        checked={themeMode === 'dark'}
                        onChange={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
                      />}
                      label={themeMode === 'dark' ? "Темна" : "Світла"}
                    />
                  </FormGroup>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle2" color="text.secondary">Валюта</Typography>
                  <FormControl fullWidth size="small" sx={{ mt: 1 }}>
                    <InputLabel id="currency-select-label">Валюта</InputLabel>
                    <Select
                      labelId="currency-select-label"
                      value={displayCurrency}
                      label="Валюта"
                      onChange={(e) => setDisplayCurrency(e.target.value)}
                    >
                      {CURRENCIES.map((currency) => (
                        <MenuItem key={currency} value={currency}>{currency}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle2" color="text.secondary">Авто-оновлення</Typography>
                  <FormGroup>
                    <FormControlLabel control={
                      <Switch
                        checked={autoUpdateEnabled}
                        onChange={() => setAutoUpdateEnabled(!autoUpdateEnabled)}
                      />}
                      label="Увімкнути (кожні 15 хв)"
                    />
                  </FormGroup>
                </Box>
              </Menu>
            </Box>
            <Fab color="primary" aria-label="add" onClick={() => setAddDialog(true)}>
              <Plus />
            </Fab>
          </Box>
  
          <Grid container spacing={4} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Загальні інвестиції"
                value={`${totalInvestment.toFixed(2)} ${CURRENCY_SYMBOLS[displayCurrency]}`}
                icon={<DollarSign size={40} />}
                color={theme.palette.primary.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Прибуток (продано)"
                value={`${totalSoldProfit.toFixed(2)} ${CURRENCY_SYMBOLS[displayCurrency]}`}
                icon={totalSoldProfit >= 0 ? <TrendingUp size={40} /> : <TrendingDown size={40} />}
                color={profitColor}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Поточна вартість"
                value={`${totalMarketValue.toFixed(2)} ${CURRENCY_SYMBOLS[displayCurrency]}`}
                icon={<BarChart size={40} />}
                color={theme.palette.secondary.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Поточний прибуток"
                value={`${currentMarketProfit.toFixed(2)} ${CURRENCY_SYMBOLS[displayCurrency]}`}
                icon={currentMarketProfit >= 0 ? <TrendingUp size={40} /> : <TrendingDown size={40} />}
                color={currentProfitColor}
              />
            </Grid>
          </Grid>
  
          <Box sx={{ mb: 4 }}>
            <Paper sx={{ p: 4, borderRadius: 3 }}>
              <Grid container spacing={4}>
                <Grid item xs={12} md={7}>
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" fontWeight="bold">Прибуток за датою</Typography>
                    <IconButton onClick={handleAnalyticsOpen} color="primary" size="large">
                      <BarChart />
                    </IconButton>
                  </Box>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={cumulativeProfit}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <ChartTooltip />
                        <Legend />
                        <Line type="monotone" dataKey="profit" stroke={theme.palette.primary.main} activeDot={{ r: 8 }} name="Сукупний прибуток" />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Grid>
                <Grid item xs={12} md={5}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" fontWeight="bold">Розподіл інвестицій по іграх</Typography>
                  </Box>
                  <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {investmentDistributionData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={investmentDistributionData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {investmentDistributionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                            ))}
                          </Pie>
                          <ChartTooltip formatter={(value) => `${value.toFixed(2)} ${CURRENCY_SYMBOLS[displayCurrency]}`} />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <Typography variant="body1" color="text.secondary">Немає даних для відображення</Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Box>
  
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h5" fontWeight="bold">Інвестиції</Typography>
            {isUpdatingAllPrices && <CircularProgress size={24} sx={{ ml: 2 }} />}
            <Button
              onClick={fetchAndUpdateAllPrices}
              variant="outlined"
              size="small"
              startIcon={<ArrowUp />}
              sx={{ borderRadius: 8 }}
            >
              Оновити всі ціни
            </Button>
          </Box>
          
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 2 }}>
            {GAMES.map((game, index) => (
              <Tab key={index} label={game} />
            ))}
          </Tabs>
  
          <Grid container spacing={3}>
            {paginatedInvestments.length > 0 ? (
              paginatedInvestments.map(item => {
                const convertedBuyPrice = convertCurrency(item.buyPrice * item.count, item.buyCurrency);
                const convertedCurrentPrice = item.currentPrice ? convertCurrency(item.currentPrice * item.count, "EUR") : null;
                const profit = item.sold ? (convertCurrency(item.sellPrice * item.count, item.buyCurrency) - convertedBuyPrice) : (convertedCurrentPrice - convertedBuyPrice);
                const profitColor = profit >= 0 ? theme.palette.success.main : theme.palette.error.main;
                const profitPercentage = convertedBuyPrice > 0 ? ((profit / convertedBuyPrice) * 100).toFixed(2) : 0;
  
                return (
                  <Grid item key={item.id} xs={12} sm={6} md={4}>
                    <StyledCard onClick={() => handleItemDetailsOpen(item)}>
                      <CardHeader>
                        <Typography variant="h6" noWrap sx={{ fontWeight: 600 }}>{item.name}</Typography>
                        <Chip label={item.sold ? "Продано" : "Активний"} color={item.sold ? "success" : "primary"} size="small" sx={{ fontWeight: 'bold' }} />
                      </CardHeader>
                      <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                        {item.image && (
                          <img src={item.image} alt={item.name} style={{ width: '100%', maxHeight: '120px', objectFit: 'contain', marginBottom: 8 }} />
                        )}
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          {item.count} шт. | {item.game}
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                          <Grid container spacing={1}>
                            <Grid item xs={6}>
                              <Typography variant="body2" color="text.secondary">Вартість</Typography>
                              <Typography variant="body1" fontWeight="bold">
                                {convertedBuyPrice.toFixed(2)} {CURRENCY_SYMBOLS[displayCurrency]}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="body2" color="text.secondary">Прибуток</Typography>
                              <Typography variant="body1" fontWeight="bold" sx={{ color: profitColor }}>
                                {profit.toFixed(2)} {CURRENCY_SYMBOLS[displayCurrency]} ({profitPercentage}%)
                              </Typography>
                            </Grid>
                          </Grid>
                        </Box>
                      </CardContent>
                      <CardFooter>
                        <Button onClick={(e) => { e.stopPropagation(); handleCurrentPriceUpdate(item); }} size="small" startIcon={<Zap />} variant="text">
                          Ціна
                        </Button>
                        <Box>
                          {!item.sold && (
                            <Tooltip title="Редагувати">
                              <IconButton onClick={(e) => { e.stopPropagation(); handleEdit(item); }} size="small" color="primary">
                                <Edit size={16} />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title="Видалити">
                            <IconButton onClick={(e) => { e.stopPropagation(); confirmDelete(item); }} size="small" color="error">
                              <Delete size={16} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </CardFooter>
                    </StyledCard>
                  </Grid>
                );
              })
            ) : (
              <Grid item xs={12}>
                <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ mt: 4 }}>
                  Поки що немає інвестицій у цьому розділі.
                </Typography>
              </Grid>
            )}
          </Grid>
  
          {pageCount > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={pageCount}
                page={page}
                onChange={(e, value) => setPage(value)}
                variant="outlined"
                color="primary"
              />
            </Box>
          )}
  
          {/* Add Item Dialog */}
          <Dialog open={addDialog} onClose={() => setAddDialog(false)} fullWidth maxWidth="sm" PaperProps={{ style: { borderRadius: 16 } }}>
            <DialogTitle sx={{ textAlign: 'center', pb: 0 }}>
              <Typography variant="h6" fontWeight="bold" color="primary">Додати новий актив</Typography>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth sx={{ mt: 1 }}>
                    <Autocomplete
                      value={autocompleteValue}
                      onChange={handleAutocompleteChange}
                      inputValue={name}
                      onInputChange={handleItemNameChange}
                      options={itemOptions}
                      loading={autocompleteLoading}
                      getOptionLabel={(option) => option.label || ""}
                      isOptionEqualToValue={(option, value) => option.label === value.label}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Назва предмета"
                          fullWidth
                          required
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <React.Fragment>
                                {autocompleteLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                              </React.Fragment>
                            ),
                          }}
                        />
                      )}
                      renderOption={(props, option) => (
                        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                          {option.image && <img loading="lazy" width="20" src={option.image} alt="" />}
                          {option.label}
                        </Box>
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Кількість"
                    type="number"
                    value={count}
                    onChange={(e) => setCount(e.target.value)}
                    fullWidth
                    required
                    InputProps={{ inputProps: { min: 1 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Ціна покупки (за одиницю)"
                    type="number"
                    value={buyPrice}
                    onChange={(e) => setBuyPrice(e.target.value)}
                    fullWidth
                    required
                    InputProps={{ inputProps: { min: 0 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Валюта покупки</InputLabel>
                    <Select
                      value={buyCurrency}
                      label="Валюта покупки"
                      onChange={(e) => setBuyCurrency(e.target.value)}
                    >
                      {CURRENCIES.map((currency) => (
                        <MenuItem key={currency} value={currency}>{currency}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Дата покупки"
                    type="date"
                    value={boughtDate}
                    onChange={(e) => setBoughtDate(e.target.value)}
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Гра</InputLabel>
                    <Select
                      value={game}
                      label="Гра"
                      onChange={(e) => setGame(e.target.value)}
                    >
                      {GAMES.filter(g => g !== "Усі").map((game) => (
                        <MenuItem key={game} value={game}>{game}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={() => setAddDialog(false)} color="secondary" variant="outlined">
                Скасувати
              </Button>
              <Button onClick={addItem} color="primary" variant="contained">
                Додати актив
              </Button>
            </DialogActions>
          </Dialog>
  
          {/* Edit Item Dialog */}
          <Dialog open={editDialog} onClose={() => setEditDialog(false)} fullWidth maxWidth="sm" PaperProps={{ style: { borderRadius: 16 } }}>
            <DialogTitle sx={{ textAlign: 'center', pb: 0 }}>
              <Typography variant="h6" fontWeight="bold" color="primary">Редагувати актив</Typography>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField label="Назва предмета" value={name} onChange={(e) => setName(e.target.value)} fullWidth required />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Кількість"
                    type="number"
                    value={count}
                    onChange={(e) => setCount(e.target.value)}
                    fullWidth
                    required
                    InputProps={{ inputProps: { min: 1 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Ціна покупки (за одиницю)"
                    type="number"
                    value={buyPrice}
                    onChange={(e) => setBuyPrice(e.target.value)}
                    fullWidth
                    required
                    InputProps={{ inputProps: { min: 0 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Гра</InputLabel>
                    <Select
                      value={game}
                      label="Гра"
                      onChange={(e) => setGame(e.target.value)}
                    >
                      {GAMES.filter(g => g !== "Усі").map((game) => (
                        <MenuItem key={game} value={game}>{game}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Дата покупки"
                    type="date"
                    value={boughtDate}
                    onChange={(e) => setBoughtDate(e.target.value)}
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={() => setEditDialog(false)} color="secondary" variant="outlined">
                Скасувати
              </Button>
              <Button onClick={saveEditedItem} color="primary" variant="contained">
                Зберегти
              </Button>
            </DialogActions>
          </Dialog>
  
          {/* Delete Item Dialog */}
          <Dialog
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
            maxWidth="xs"
            fullWidth
            PaperProps={{ style: { borderRadius: 16 } }}
          >
            <DialogTitle sx={{ textAlign: 'center' }}>Підтвердження</DialogTitle>
            <DialogContent>
              <Typography>Ви впевнені, що хочете видалити цей актив? Цю дію не можна скасувати.</Typography>
            </DialogContent>
            <DialogActions sx={{ p: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={() => setDeleteDialogOpen(false)} color="primary" variant="outlined">
                Скасувати
              </Button>
              <Button onClick={handleDelete} color="error" variant="contained">
                Видалити
              </Button>
            </DialogActions>
          </Dialog>
  
          {/* Sell Item Dialog */}
          <Dialog open={sellDialog} onClose={() => setSellDialog(false)} fullWidth maxWidth="sm" PaperProps={{ style: { borderRadius: 16 } }}>
            <DialogTitle sx={{ textAlign: 'center', pb: 0 }}>
              <Typography variant="h6" fontWeight="bold" color="primary">Закрити операцію</Typography>
            </DialogTitle>
            <DialogContent dividers>
              <Typography variant="body1" color="text.secondary" textAlign="center" mb={2}>
                Предмет: **{itemToSell?.name}**
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Ціна продажу (за одиницю)"
                    type="number"
                    value={sellPrice}
                    onChange={(e) => setSellPrice(e.target.value)}
                    fullWidth
                    required
                    InputProps={{ inputProps: { min: 0 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Дата продажу"
                    type="date"
                    value={sellDate}
                    onChange={(e) => setSellDate(e.target.value)}
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={() => setSellDialog(false)} color="secondary" variant="outlined">
                Скасувати
              </Button>
              <Button onClick={markAsSold} color="success" variant="contained">
                Продати
              </Button>
            </DialogActions>
          </Dialog>
  
          {/* Market Analysis Dialog */}
          <Dialog open={marketAnalysisDialog} onClose={() => setMarketAnalysisDialog(false)} fullWidth maxWidth="md" PaperProps={{ style: { borderRadius: 16 } }}>
            <DialogTitle sx={{ textAlign: 'center' }}>
              <Typography variant="h6" fontWeight="bold" color="primary">Аналіз ринку для {itemToAnalyze?.name}</Typography>
            </DialogTitle>
            <DialogContent dividers>
              {analysisLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 5 }}>
                  <CircularProgress />
                  <Typography variant="body1" color="text.secondary" sx={{ ml: 2 }}>
                    Генеруємо аналіз...
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <Typography variant="body1" color="text.primary">
                    {analysisText}
                  </Typography>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button 
                onClick={() => setMarketAnalysisDialog(false)} 
                color="secondary" 
                variant="outlined"
                sx={{ borderRadius: 8 }}
              >
                {t.cancel}
              </Button>
            </DialogActions>
          </Dialog>
  
          <CommissionManagerDialog
            open={commissionManagerDialogOpen}
            onClose={() => setCommissionManagerDialogOpen(false)}
            item={commissionItemToManage}
            updateInvestment={updateInvestment}
            showSnackbar={showSnackbar}
            theme={theme}
          />
  
          <ItemDetailsDialog 
            open={itemDetailsDialogOpen} 
            onClose={() => setItemDetailsDialogOpen(false)} 
            item={itemToDisplayDetails}
          />
  
          <Snackbar 
            open={snackbar.open} 
            autoHideDuration={3500} 
            onClose={closeSnackbar} 
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert 
              onClose={closeSnackbar} 
              severity={snackbar.severity} 
              sx={{ 
                width: '100%',
                borderRadius: 8,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Container>
      </Box>
    </ThemeProvider>
  );
}