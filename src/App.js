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
  ArrowDown, Menu as MenuIcon, Eye, Clock,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip as ChartTooltip, ResponsiveContainer, CartesianGrid, Legend, PieChart, Pie,
  Cell, BarChart as RechartsBarChart, Bar
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
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
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
  padding: theme.spacing(2),
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  backgroundColor: bgcolor || theme.palette.background.paper,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
  },
  textAlign: 'center',
  minHeight: 160,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
}));

const StyledCombinedCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  backgroundColor: theme.palette.background.paper,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
  },
  textAlign: 'left',
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

const CommissionManagerDialog = ({ open, onClose, item, updateInvestment, showSnackbar, theme }) => {
  const [newCommissionRate, setNewCommissionRate] = useState(0);
  const [newCommissionNote, setNewCommissionNote] = useState("");
  const [editingCommissionIndex, setEditingCommissionIndex] = useState(null);

  if (!item) {
    return null;
  }

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
  
  // Додавання useEffect для завантаження інвестицій з локального сховища
  useEffect(() => {
    const savedInvestments = localStorage.getItem('investments');
    if (savedInvestments) {
      setInvestments(JSON.parse(savedInvestments));
    }
  }, []);

  // Додавання useEffect для збереження інвестицій в локальне сховище
  useEffect(() => {
    localStorage.setItem('investments', JSON.stringify(investments));
  }, [investments]);
  
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
        const selectedGame = tabValue === 0 ? getGameFromItemName(newInputValue) : GAMES[tabValue];
        const response = await fetch(`${BACKEND_URL}/search?q=${newInputValue}&game=${selectedGame}`, { signal });
        const data = await response.json();
        setItemOptions(data);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error("Помилка автозаповнення:", error);
          showSnackbar("Помилка автозаповнення. Спробуйте пізніше.", "error");
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
    if (newValue) {
      setSelectedItemDetails(newValue);
      setName(newValue.name);
      setGame(getGameFromItemName(newValue.name));
      setBuyPrice(newValue.price);
    } else {
      setSelectedItemDetails(null);
      setName("");
      setBuyPrice(0);
    }
    setAutocompleteValue(newValue);
  };

  const calculateTotalValue = () => {
    return investments.reduce((sum, item) => sum + convertCurrency(item.price * item.count, item.currency), 0);
  };

  const calculateTotalProfitLoss = () => {
    const totalBuyValue = investments.reduce((sum, item) => sum + convertCurrency(item.buyPrice * item.count, item.buyCurrency), 0);
    const totalCurrentValue = calculateTotalValue();
    return totalCurrentValue - totalBuyValue;
  };

  const calculateTotalCommissions = () => {
    return investments.reduce((sum, item) => {
      const commissionAmount = item.commissions.reduce((total, comm) => total + (comm.rate / 100) * item.buyPrice * item.count, 0);
      return sum + convertCurrency(commissionAmount, item.buyCurrency);
    }, 0);
  };

  const calculateTotalDividends = () => {
    // В цьому додатку немає дивідендів, тому ця функція не потрібна
    return 0;
  };
  
  const addInvestment = async () => {
    if (!name || count <= 0 || buyPrice <= 0) {
      showSnackbar("Будь ласка, заповніть всі поля. Кількість і ціна мають бути більше 0.", "error");
      return;
    }

    const newInvestment = {
      name,
      count: Number(count),
      buyPrice: Number(buyPrice),
      buyCurrency,
      boughtDate,
      game,
      commissions: [],
    };

    try {
      const response = await fetch(`${BACKEND_URL}/api/investments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInvestment),
      });
      if (!response.ok) {
        throw new Error('Failed to add investment');
      }
      const addedInvestment = await response.json();
      setInvestments(prev => [...prev, addedInvestment]);
      showSnackbar(t.investmentAdded, 'success');
      setAddDialog(false);
      setName("");
      setCount(1);
      setBuyPrice(0);
      setBuyCurrency(CURRENCIES[0]);
      setGame(GAMES[1]);
      setBoughtDate(new Date().toISOString().split('T')[0]);
      setAutocompleteValue(null);
      setSelectedItemDetails(null);
    } catch (error) {
      console.error("Error adding investment:", error);
      showSnackbar("Помилка при додаванні інвестиції", "error");
    }
  };

  const handleEditInvestment = () => {
    if (!itemToEdit || name === "" || count <= 0 || buyPrice <= 0) {
      showSnackbar("Будь ласка, заповніть всі поля. Кількість і ціна мають бути більше 0.", "error");
      return;
    }
    const updatedInvestment = {
      ...itemToEdit,
      name,
      count: Number(count),
      buyPrice: Number(buyPrice),
      buyCurrency,
      game,
    };
    updateInvestment(updatedInvestment.id, updatedInvestment);
    setEditDialog(false);
    setItemToEdit(null);
  };

  const handleSellInvestment = async () => {
    if (!itemToSell || sellPrice <= 0) {
      showSnackbar("Будь ласка, введіть ціну продажу.", "error");
      return;
    }
  
    // Calculate commissions on sell
    const sellCommissionRate = itemToSell.commissions.reduce((sum, comm) => sum + comm.rate, 0);
    const sellCommissionAmount = (sellPrice * itemToSell.count * sellCommissionRate) / 100;
  
    const soldInvestment = {
      ...itemToSell,
      sellPrice: Number(sellPrice),
      sellDate,
      sellCommission: sellCommissionAmount
    };
  
    try {
      const response = await fetch(`${BACKEND_URL}/api/investments/${itemToSell.id}/sell`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(soldInvestment),
      });
      if (!response.ok) {
        throw new Error('Failed to sell investment');
      }
      const data = await response.json();
      setInvestments(prev => prev.map(item => (item.id === itemToSell.id ? data : item)));
      showSnackbar(t.itemSold, 'success');
      setSellDialog(false);
      setItemToSell(null);
    } catch (error) {
      console.error("Error selling investment:", error);
      showSnackbar("Помилка при продажу активу", "error");
    }
  };

  const getAnalytics = () => {
    setAnalyticsOpen(true);
  };
  
  const filteredInvestments = investments.filter(item => {
    const matchesGame = tabValue === 0 || item.game === GAMES[tabValue];
    const matchesSearch = item.name.toLowerCase().includes(name.toLowerCase());
    return matchesGame && matchesSearch;
  });

  const sortedInvestments = filteredInvestments.sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    if (aValue === undefined || bValue === undefined) {
      return 0; // Don't sort if values are missing
    }

    if (typeof aValue === 'string') {
      return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }
    return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
  });

  const paginatedInvestments = sortedInvestments.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const totalPages = Math.ceil(filteredInvestments.length / ITEMS_PER_PAGE);

  const fetchItemDetails = async (name) => {
    try {
      const response = await fetch(`${BACKEND_URL}/item_price?name=${encodeURIComponent(name)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch item details');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching item details:", error);
      return null;
    }
  };

  const fetchAndUpdateAllPrices = async () => {
    setIsUpdatingAllPrices(true);
    const updatedInvestments = [...investments];
    for (const item of updatedInvestments) {
      try {
        const itemDetails = await fetchItemDetails(item.name);
        if (itemDetails && itemDetails.price) {
          item.price = itemDetails.price;
        }
      } catch (error) {
        console.error(`Failed to update price for ${item.name}:`, error);
      }
    }
    setInvestments(updatedInvestments);
    setIsUpdatingAllPrices(false);
    showSnackbar("Всі ціни оновлено!", "success");
  };
  
  const handleAnalyzeItem = async (item) => {
    setItemToAnalyze(item);
    setMarketAnalysisDialog(true);
    setAnalysisLoading(true);
    setAnalysisText("");
  
    const prompt = `Високопрофесійний аналітик ринку Steam. Надайте повний аналіз ринку для предмета "${item.name}" у форматі 500-600 слів.
    Аналіз повинен містити:
    1.  **Опис предмета**: Короткий опис, до якої гри належить, тип, рідкість, зовнішній вигляд (якщо це скін), чи є кейсом.
    2.  **Історична динаміка цін**: Використовуйте історичні дані для аналізу тенденцій, зазначте ключові цінові піки та падіння, та можливі причини (наприклад, вихід нової колекції, оновлення гри, зміна мета).
    3.  **Поточний стан ринку**: Оцінка поточної вартості, обсягу торгів, попиту та пропозиції.
    4.  **Прогноз на майбутнє**: На основі аналізу історичних даних та поточних тенденцій, надайте короткий прогноз (зростання, падіння, стабільність) на 6-12 місяців.
    5.  **Фактори впливу**: Перелічіть та коротко опишіть фактори, які можуть вплинути на ціну предмета (наприклад, оновлення гри, зміна популярності гри, вихід нових кейсів/колекцій).
    `;
    
    try {
        const payload = {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                // Використовуємо gemini-2.5-flash-preview-05-20 для генерації тексту
                model: 'gemini-2.5-flash-preview-05-20',
            },
        };
        const apiKey = "";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const result = await response.json();
        
        if (result.candidates && result.candidates.length > 0 && result.candidates[0].content && result.candidates[0].content.parts && result.candidates[0].content.parts.length > 0) {
            setAnalysisText(result.candidates[0].content.parts[0].text);
        } else {
            setAnalysisText("Вибачте, не вдалося згенерувати аналіз. Спробуйте ще раз пізніше.");
        }
    } catch (error) {
        console.error("Error generating analysis:", error);
        setAnalysisText("Виникла помилка під час генерації аналізу. Будь ласка, перевірте ваше підключення до Інтернету.");
    } finally {
        setAnalysisLoading(false);
    }
  };
  
  const openItemDetailsDialog = (item) => {
    setItemToDisplayDetails(item);
    setItemDetailsDialogOpen(true);
  };
  
  const ItemDetailsDialog = ({ open, onClose, item }) => {
    if (!item) return null;
    const itemGame = getGameFromItemName(item.name);
    const profitLoss = (convertCurrency(item.price * item.count, item.currency) - convertCurrency(item.buyPrice * item.count, item.buyCurrency));
    const profitLossPercent = (profitLoss / convertCurrency(item.buyPrice * item.count, item.buyCurrency)) * 100;
  
    const isProfit = profitLoss >= 0;
    const profitLossColor = isProfit ? theme.palette.success.main : theme.palette.error.main;
  
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ style: { borderRadius: 16 } }}>
        <DialogTitle sx={{ textAlign: 'center' }}>
          <Typography variant="h5" fontWeight="bold">{item.name}</Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: '100%', maxWidth: '300px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/300x300"; }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="body1" color="text.secondary">Гра:</Typography>
                  <StyledChip label={itemGame} color="primary" />
                </Box>
                <Box>
                  <Typography variant="body1" color="text.secondary">Дата покупки:</Typography>
                  <Typography variant="body1">{new Date(item.boughtDate).toLocaleDateString()}</Typography>
                </Box>
                <Box>
                  <Typography variant="body1" color="text.secondary">Кількість:</Typography>
                  <Typography variant="body1">{item.count}</Typography>
                </Box>
                <Box>
                  <Typography variant="body1" color="text.secondary">Ціна покупки:</Typography>
                  <Typography variant="body1">{convertCurrency(item.buyPrice, item.buyCurrency).toFixed(2)} {CURRENCY_SYMBOLS[displayCurrency]}</Typography>
                </Box>
                <Box>
                  <Typography variant="body1" color="text.secondary">Поточна ціна:</Typography>
                  <Typography variant="body1">{convertCurrency(item.price, item.currency).toFixed(2)} {CURRENCY_SYMBOLS[displayCurrency]}</Typography>
                </Box>
                <Box>
                  <Typography variant="body1" color="text.secondary">Прибуток/Збиток:</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body1" fontWeight="bold" sx={{ color: profitLossColor }}>
                      {profitLoss.toFixed(2)} {CURRENCY_SYMBOLS[displayCurrency]} ({profitLossPercent.toFixed(2)}%)
                    </Typography>
                    {isProfit ? <TrendingUp color="success" size={20} /> : <TrendingDown color="error" size={20} />}
                  </Box>
                </Box>
                <Box>
                  <Typography variant="body1" color="text.secondary">Комісії:</Typography>
                  <Typography variant="body1">{item.commissions.reduce((sum, c) => sum + c.rate, 0).toFixed(2)}%</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'center' }}>
          <StyledButton onClick={onClose} variant="contained" color="primary">Закрити</StyledButton>
        </DialogActions>
      </Dialog>
    );
  };
  
  // Компонент SellDialog
  const SellDialog = ({ open, onClose, item, sellPrice, setSellPrice, handleSellInvestment, t, theme, convertCurrency, displayCurrency, CURRENCY_SYMBOLS, getGameFromItemName }) => {
    if (!item) return null;
    const profitLossOnSale = (convertCurrency(sellPrice * item.count, item.currency) - convertCurrency(item.buyPrice * item.count, item.buyCurrency));
    const profitLossPercentOnSale = (profitLossOnSale / convertCurrency(item.buyPrice * item.count, item.buyCurrency)) * 100;
  
    const isProfit = profitLossOnSale >= 0;
    const profitLossColor = isProfit ? theme.palette.success.main : theme.palette.error.main;
  
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ style: { borderRadius: 16 } }}>
        <DialogTitle sx={{ textAlign: 'center', pb: 0 }}>
          <Typography variant="h6" fontWeight="bold" color="primary">{t.sellItem}</Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Box mb={2}>
            <Typography variant="body1" color="text.secondary" textAlign="center">
              Продати предмет: <br/> **{item.name}**
            </Typography>
          </Box>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <TextField
                label={t.sellPrice}
                type="number"
                value={sellPrice}
                onChange={(e) => setSellPrice(e.target.value)}
                fullWidth
                required
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1" color="text.secondary">{t.buyPrice}:</Typography>
                  <Typography variant="body1">{convertCurrency(item.buyPrice, item.buyCurrency).toFixed(2)} {CURRENCY_SYMBOLS[displayCurrency]}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1" color="text.secondary">{t.currentPrice}:</Typography>
                  <Typography variant="body1">{convertCurrency(item.price, item.currency).toFixed(2)} {CURRENCY_SYMBOLS[displayCurrency]}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1" color="text.secondary">{t.profitLossOnSale}:</Typography>
                  <Typography variant="body1" fontWeight="bold" sx={{ color: profitLossColor }}>
                    {profitLossOnSale.toFixed(2)} {CURRENCY_SYMBOLS[displayCurrency]} ({profitLossPercentOnSale.toFixed(2)}%)
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, display: 'flex', justifyContent: 'space-between' }}>
          <StyledButton onClick={onClose} variant="outlined" color="secondary">
            {t.cancel}
          </StyledButton>
          <StyledButton onClick={handleSellInvestment} variant="contained" color="primary">
            {t.sell}
          </StyledButton>
        </DialogActions>
      </Dialog>
    );
  };
  
  // Додавання існуючих компонентів тут, оскільки вони були в оригінальному коді
  const ItemCard = ({ item, openItemDetails, handleEditClick, setItemToDelete, setDeleteDialogOpen, setItemToSell, setSellDialog, setCommissionItemToManage, setCommissionManagerDialogOpen, handleAnalyzeItem, theme, t, convertCurrency, displayCurrency, CURRENCY_SYMBOLS, getGameFromItemName }) => {
    const profitLoss = (convertCurrency(item.price, item.currency) * item.count) - (convertCurrency(item.buyPrice, item.buyCurrency) * item.count);
    const profitLossPercent = ((profitLoss / (convertCurrency(item.buyPrice, item.buyCurrency) * item.count)) * 100).toFixed(2);
    const profitLossColor = profitLoss >= 0 ? theme.palette.success.main : theme.palette.error.main;
    const commissionRate = item.commissions ? item.commissions.reduce((sum, c) => sum + c.rate, 0) : 0;
  
    const commissionAmount = (convertCurrency(item.buyPrice, item.buyCurrency) * item.count) * (commissionRate / 100);
  
    return (
      <StyledCard>
        <CardHeader>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <img src={item.image || "https://placehold.co/40x40"} alt={item.name} style={{ width: '40px', height: '40px', borderRadius: '4px' }} />
            <Box>
              <Typography variant="h6" component="h3" noWrap>
                {item.name}
              </Typography>
              <StyledChip label={getGameFromItemName(item.name)} size="small" color="secondary" />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Tooltip title={t.details}>
              <IconButton onClick={() => openItemDetails(item)}>
                <Eye size={18} />
              </IconButton>
            </Tooltip>
            <Tooltip title={t.edit}>
              <IconButton onClick={() => handleEditClick(item)}>
                <Edit size={18} />
              </IconButton>
            </Tooltip>
            <Tooltip title={t.delete}>
              <IconButton onClick={() => { setItemToDelete(item); setDeleteDialogOpen(true); }}>
                <Delete size={18} color="error" />
              </IconButton>
            </Tooltip>
          </Box>
        </CardHeader>
        <CardContent sx={{ flexGrow: 1, p: 1, '&:last-child': { pb: 1 } }}>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">{t.buyPrice}:</Typography>
              <Typography variant="body1" fontWeight="bold">
                {convertCurrency(item.buyPrice, item.buyCurrency).toFixed(2)} {CURRENCY_SYMBOLS[displayCurrency]}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">{t.currentPrice}:</Typography>
              <Typography variant="body1" fontWeight="bold">
                {convertCurrency(item.price, item.currency).toFixed(2)} {CURRENCY_SYMBOLS[displayCurrency]}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">{t.quantity}:</Typography>
              <Typography variant="body1" fontWeight="bold">{item.count}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">{t.commissions}:</Typography>
              <Typography variant="body1" fontWeight="bold">{commissionRate.toFixed(2)}%</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">{t.profitLoss}:</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body1" fontWeight="bold" sx={{ color: profitLossColor }}>
                  {profitLoss.toFixed(2)} {CURRENCY_SYMBOLS[displayCurrency]}
                </Typography>
                {profitLoss >= 0 ? <TrendingUp color="success" size={20} /> : <TrendingDown color="error" size={20} />}
                <Typography variant="body2" sx={{ color: profitLossColor, ml: 'auto' }}>
                  ({profitLossPercent}%)
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
        <CardFooter>
          <Box>
            <StyledButton
              variant="outlined"
              size="small"
              onClick={() => { setCommissionItemToManage(item); setCommissionManagerDialogOpen(true); }}
              startIcon={<Percent size={16} />}
              sx={{ mr: 1 }}
            >
              {t.commissions}
            </StyledButton>
            <StyledButton
              variant="outlined"
              size="small"
              onClick={() => handleAnalyzeItem(item)}
              startIcon={<BarChart size={16} />}
              sx={{ mr: 1 }}
            >
              {t.analyze}
            </StyledButton>
          </Box>
          <StyledButton
            variant="contained"
            color="secondary"
            size="small"
            startIcon={<DollarSign size={16} />}
            onClick={() => { setItemToSell(item); setSellDialog(true); }}
          >
            {t.sell}
          </StyledButton>
        </CardFooter>
      </StyledCard>
    );
  };
  
  const MarketAnalysisDialog = ({ open, onClose, analysisText, analysisLoading, t, theme, item }) => (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth PaperProps={{ style: { borderRadius: 16 } }}>
      <DialogTitle sx={{ textAlign: 'center', pb: 0 }}>
        <Typography variant="h5" fontWeight="bold" color="primary">{t.marketAnalysis}</Typography>
        <Typography variant="subtitle1" color="text.secondary">{item?.name}</Typography>
      </DialogTitle>
      <DialogContent dividers>
        {analysisLoading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
            <CircularProgress color="primary" />
            <Typography variant="body1" sx={{ mt: 2 }}>{t.generatingAnalysis}</Typography>
          </Box>
        ) : (
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {analysisText}
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 3, justifyContent: 'center' }}>
        <StyledButton onClick={onClose} variant="contained" color="primary">{t.close}</StyledButton>
      </DialogActions>
    </Dialog>
  );

  const getAnalyticsData = () => {
    // Дані для графіків
    // Ця частина коду є імітацією, оскільки немає реального бекенду для отримання історичних даних
    const today = new Date();
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const priceHistory = last30Days.map(date => {
      const value = Math.random() * 100 + 100; // Імітація ціни
      return { date, value };
    });

    const totalPortfolioValue = [{ name: 'Портфель', value: calculateTotalValue() }];
    const totalProfitLossData = [{ name: 'Прибуток/Збиток', value: calculateTotalProfitLoss() }];

    const gameDistribution = investments.reduce((acc, item) => {
      const game = item.game;
      const index = acc.findIndex(d => d.name === game);
      if (index > -1) {
        acc[index].value += convertCurrency(item.price * item.count, item.currency);
      } else {
        acc.push({ name: game, value: convertCurrency(item.price * item.count, item.currency) });
      }
      return acc;
    }, []);

    const investmentsPerGame = investments.reduce((acc, item) => {
      const game = item.game;
      const index = acc.findIndex(d => d.name === game);
      if (index > -1) {
        acc[index].investments += 1;
      } else {
        acc.push({ name: game, investments: 1 });
      }
      return acc;
    }, []);

    return {
      priceHistory,
      totalPortfolioValue,
      totalProfitLossData,
      gameDistribution,
      investmentsPerGame
    };
  };

  const AnalyticsDialog = ({ open, onClose, t, theme, data }) => {
    const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#FF8042', '#00C49F', '#0088FE'];
    return (
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth PaperProps={{ style: { borderRadius: 16 } }}>
        <DialogTitle sx={{ textAlign: 'center', pb: 0 }}>
          <Typography variant="h5" fontWeight="bold" color="primary">{t.analytics}</Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <StyledCombinedCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom>{t.portfolioValue}</Typography>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={data.priceHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <ChartTooltip />
                      <Legend />
                      <Line type="monotone" dataKey="value" stroke="#8884d8" name={t.portfolioValue} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </StyledCombinedCard>
            </Grid>
            <Grid item xs={12} md={6}>
              <StyledCombinedCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom>{t.profitLossDistribution}</Typography>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={data.totalProfitLossData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip />
                      <Legend />
                      <Bar dataKey="value" name={t.profitOrLoss} fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </StyledCombinedCard>
            </Grid>
            <Grid item xs={12} md={6}>
              <StyledCombinedCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom>{t.gameDistribution}</Typography>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={data.gameDistribution}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {data.gameDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </StyledCombinedCard>
            </Grid>
            <Grid item xs={12} md={6}>
              <StyledCombinedCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom>{t.investmentsPerGame}</Typography>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={data.investmentsPerGame}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip />
                      <Legend />
                      <Bar dataKey="investments" name={t.investments} fill="#ffc658" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </StyledCombinedCard>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'center' }}>
          <StyledButton onClick={onClose} variant="contained" color="primary">{t.close}</StyledButton>
        </DialogActions>
      </Dialog>
    );
  };

  const analyticsData = getAnalyticsData();
  
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: '100vh', py: 4, px: { xs: 2, sm: 4, md: 6 } }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Rocket size={48} color={theme.palette.primary.main} />
              <Typography variant="h4" component="h1" fontWeight="bold">
                {t.portfolio}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Tooltip title={isUpdatingAllPrices ? t.updatingPrices : t.updatePrices}>
                <IconButton onClick={fetchAndUpdateAllPrices} disabled={isUpdatingAllPrices}>
                  <Clock size={24} color={theme.palette.secondary.main} />
                </IconButton>
              </Tooltip>
              <Tooltip title={t.analytics}>
                <IconButton onClick={getAnalytics}>
                  <BarChart size={24} color={theme.palette.secondary.main} />
                </IconButton>
              </Tooltip>
              <Tooltip title={t.settings}>
                <IconButton onClick={handleSettingsMenuClick}>
                  <Settings size={24} color={theme.palette.secondary.main} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          <Menu
            anchorEl={settingsAnchorEl}
            open={settingsMenuOpen}
            onClose={handleSettingsMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Box sx={{ p: 2, minWidth: '200px' }}>
              <Typography variant="h6" mb={2}>{t.settings}</Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body1" color="text.secondary">{t.displayCurrency}</Typography>
              <FormControl fullWidth size="small" sx={{ mt: 1, mb: 2 }}>
                <InputLabel>{t.currency}</InputLabel>
                <Select value={displayCurrency} label={t.currency} onChange={(e) => setDisplayCurrency(e.target.value)}>
                  {CURRENCIES.map(curr => (
                    <MenuItem key={curr} value={curr}>{curr} {CURRENCY_SYMBOLS[curr]}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Typography variant="body1" color="text.secondary">{t.language}</Typography>
              <FormControl fullWidth size="small" sx={{ mt: 1, mb: 2 }}>
                <InputLabel>{t.language}</InputLabel>
                <Select value={lang} label={t.language} onChange={(e) => setLang(e.target.value)}>
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="uk">Українська</MenuItem>
                </Select>
              </FormControl>
              <Typography variant="body1" color="text.secondary" mb={1}>{t.theme}</Typography>
              <FormControlLabel
                control={<Switch checked={themeMode === 'dark'} onChange={() => setThemeMode(themeMode === 'light' ? 'dark' : 'light')} />}
                label={themeMode === 'dark' ? t.darkMode : t.lightMode}
                sx={{ mb: 2 }}
              />
              <Typography variant="body1" color="text.secondary" mb={1}>{t.autoUpdatePrices}</Typography>
              <FormControlLabel
                control={<Switch checked={autoUpdateEnabled} onChange={(e) => setAutoUpdateEnabled(e.target.checked)} />}
                label={autoUpdateEnabled ? t.enabled : t.disabled}
              />
            </Box>
          </Menu>

          <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 16 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <StyledMetricCard>
                  <Typography variant="h6" color="text.secondary" gutterBottom>{t.totalValue}</Typography>
                  <Typography variant="h4" fontWeight="bold" color="primary">
                    {calculateTotalValue().toFixed(2)} {CURRENCY_SYMBOLS[displayCurrency]}
                  </Typography>
                </StyledMetricCard>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StyledMetricCard>
                  <Typography variant="h6" color="text.secondary" gutterBottom>{t.totalProfitLoss}</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: calculateTotalProfitLoss() >= 0 ? theme.palette.success.main : theme.palette.error.main }}>
                      {calculateTotalProfitLoss().toFixed(2)} {CURRENCY_SYMBOLS[displayCurrency]}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Typography variant="body2" fontWeight="bold" sx={{ color: calculateTotalProfitLoss() >= 0 ? theme.palette.success.main : theme.palette.error.main }}>
                        ({((calculateTotalProfitLoss() / calculateTotalValue()) * 100).toFixed(2)}%)
                      </Typography>
                      {calculateTotalProfitLoss() >= 0 ? <TrendingUp color="success" size={20} /> : <TrendingDown color="error" size={20} />}
                    </Box>
                  </Box>
                </StyledMetricCard>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StyledMetricCard>
                  <Typography variant="h6" color="text.secondary" gutterBottom>{t.totalCommissions}</Typography>
                  <Typography variant="h4" fontWeight="bold" color="text.primary">
                    {calculateTotalCommissions().toFixed(2)} {CURRENCY_SYMBOLS[displayCurrency]}
                  </Typography>
                </StyledMetricCard>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StyledMetricCard>
                  <Typography variant="h6" color="text.secondary" gutterBottom>{t.totalInvestments}</Typography>
                  <Typography variant="h4" fontWeight="bold" color="text.primary">
                    {investments.length}
                  </Typography>
                </StyledMetricCard>
              </Grid>
            </Grid>
          </Paper>

          <Box sx={{ mb: 4 }}>
            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} variant="scrollable" scrollButtons="auto">
              {GAMES.map((gameName, index) => (
                <Tab key={index} label={gameName} />
              ))}
            </Tabs>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 2, md: 0 } }}>
            <Autocomplete
              freeSolo
              fullWidth
              options={itemOptions}
              getOptionLabel={(option) => option.name || ""}
              loading={autocompleteLoading}
              value={autocompleteValue}
              onChange={handleAutocompleteChange}
              onInputChange={handleItemNameChange}
              renderInput={(params) => (
                <StyledTextField
                  {...params}
                  label={t.searchItem}
                  placeholder={t.searchPlaceholder}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {autocompleteLoading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                  sx={{ width: { xs: '100%', md: '50%' } }}
                />
              )}
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <StyledButton
                variant="contained"
                startIcon={<Plus size={18} />}
                onClick={() => setAddDialog(true)}
              >
                {t.addInvestment}
              </StyledButton>
            </Box>
          </Box>

          <Grid container spacing={3}>
            {paginatedInvestments.length > 0 ? (
              paginatedInvestments.map(item => (
                <Grid item xs={12} sm={6} md={4} key={item.id}>
                  <ItemCard
                    item={item}
                    openItemDetails={openItemDetailsDialog}
                    handleEditClick={(i) => { setItemToEdit(i); setName(i.name); setCount(i.count); setBuyPrice(i.buyPrice); setBuyCurrency(i.buyCurrency); setEditDialog(true); }}
                    setItemToDelete={setItemToDelete}
                    setDeleteDialogOpen={setDeleteDialogOpen}
                    setItemToSell={setItemToSell}
                    setSellDialog={setSellDialog}
                    setCommissionItemToManage={setCommissionItemToManage}
                    setCommissionManagerDialogOpen={setCommissionManagerDialogOpen}
                    handleAnalyzeItem={handleAnalyzeItem}
                    theme={theme}
                    t={t}
                    convertCurrency={convertCurrency}
                    displayCurrency={displayCurrency}
                    CURRENCY_SYMBOLS={CURRENCY_SYMBOLS}
                    getGameFromItemName={getGameFromItemName}
                  />
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Box sx={{ textAlign: 'center', py: 5 }}>
                  <Typography variant="h6" color="text.secondary">{t.noInvestments}</Typography>
                  <Typography variant="body1" color="text.secondary">{t.addFirstInvestment}</Typography>
                </Box>
              </Grid>
            )}
          </Grid>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
              shape="rounded"
            />
          </Box>
          
          {/* Main Dialogs */}
          <Dialog open={addDialog} onClose={() => setAddDialog(false)} maxWidth="sm" fullWidth PaperProps={{ style: { borderRadius: 16 } }}>
            <DialogTitle sx={{ textAlign: 'center', pb: 0 }}>
              <Typography variant="h6" fontWeight="bold" color="primary">{t.addInvestment}</Typography>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Autocomplete
                    freeSolo
                    fullWidth
                    options={itemOptions}
                    getOptionLabel={(option) => option.name || ""}
                    loading={autocompleteLoading}
                    value={autocompleteValue}
                    onChange={handleAutocompleteChange}
                    onInputChange={handleItemNameChange}
                    renderInput={(params) => (
                      <StyledTextField
                        {...params}
                        label={t.itemName}
                        placeholder={t.searchPlaceholder}
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
                  />
                </Grid>
                <Grid item xs={12}>
                  <StyledTextField
                    label={t.quantity}
                    type="number"
                    value={count}
                    onChange={(e) => setCount(e.target.value)}
                    fullWidth
                    required
                    InputProps={{ inputProps: { min: 1 } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <StyledTextField
                    label={t.buyPrice}
                    type="number"
                    value={buyPrice}
                    onChange={(e) => setBuyPrice(e.target.value)}
                    fullWidth
                    required
                    InputProps={{ inputProps: { min: 0 } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>{t.buyCurrency}</InputLabel>
                    <Select
                      value={buyCurrency}
                      label={t.buyCurrency}
                      onChange={(e) => setBuyCurrency(e.target.value)}
                    >
                      {CURRENCIES.map(curr => (
                        <MenuItem key={curr} value={curr}>{curr} {CURRENCY_SYMBOLS[curr]}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <StyledTextField
                    label={t.boughtDate}
                    type="date"
                    value={boughtDate}
                    onChange={(e) => setBoughtDate(e.target.value)}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>{t.game}</InputLabel>
                    <Select
                      value={game}
                      label={t.game}
                      onChange={(e) => setGame(e.target.value)}
                    >
                      {GAMES.slice(1).map(gameName => (
                        <MenuItem key={gameName} value={gameName}>{gameName}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3, display: 'flex', justifyContent: 'space-between' }}>
              <StyledButton onClick={() => setAddDialog(false)} color="secondary" variant="outlined">{t.cancel}</StyledButton>
              <StyledButton onClick={addInvestment} color="primary" variant="contained">{t.add}</StyledButton>
            </DialogActions>
          </Dialog>

          <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth PaperProps={{ style: { borderRadius: 16 } }}>
            <DialogTitle sx={{ textAlign: 'center', pb: 0 }}>
              <Typography variant="h6" fontWeight="bold" color="primary">{t.editInvestment}</Typography>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <StyledTextField
                    label={t.itemName}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <StyledTextField
                    label={t.quantity}
                    type="number"
                    value={count}
                    onChange={(e) => setCount(e.target.value)}
                    fullWidth
                    required
                    InputProps={{ inputProps: { min: 1 } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <StyledTextField
                    label={t.buyPrice}
                    type="number"
                    value={buyPrice}
                    onChange={(e) => setBuyPrice(e.target.value)}
                    fullWidth
                    required
                    InputProps={{ inputProps: { min: 0 } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>{t.buyCurrency}</InputLabel>
                    <Select
                      value={buyCurrency}
                      label={t.buyCurrency}
                      onChange={(e) => setBuyCurrency(e.target.value)}
                    >
                      {CURRENCIES.map(curr => (
                        <MenuItem key={curr} value={curr}>{curr} {CURRENCY_SYMBOLS[curr]}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3, display: 'flex', justifyContent: 'space-between' }}>
              <StyledButton onClick={() => setEditDialog(false)} color="secondary" variant="outlined">{t.cancel}</StyledButton>
              <StyledButton onClick={handleEditInvestment} color="primary" variant="contained">{t.save}</StyledButton>
            </DialogActions>
          </Dialog>

          <Dialog
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
            maxWidth="xs"
            fullWidth
            PaperProps={{ style: { borderRadius: 16 } }}
          >
            <DialogTitle sx={{ textAlign: 'center', pb: 0 }}>
              <Typography variant="h6" fontWeight="bold" color="error">{t.confirmDeleteTitle}</Typography>
            </DialogTitle>
            <DialogContent dividers>
              <Typography variant="body1" align="center" color="text.secondary">
                {t.confirmDeleteMessage}
              </Typography>
            </DialogContent>
            <DialogActions sx={{ p: 3, display: 'flex', justifyContent: 'space-between' }}>
              <StyledButton onClick={() => setDeleteDialogOpen(false)} color="secondary" variant="outlined">{t.cancel}</StyledButton>
              <StyledButton onClick={() => { deleteInvestment(itemToDelete.id); setDeleteDialogOpen(false); }} color="error" variant="contained">{t.delete}</StyledButton>
            </DialogActions>
          </Dialog>
          
          <SellDialog
            open={sellDialog}
            onClose={() => setSellDialog(false)}
            item={itemToSell}
            sellPrice={sellPrice}
            setSellPrice={setSellPrice}
            handleSellInvestment={handleSellInvestment}
            t={t}
            theme={theme}
            convertCurrency={convertCurrency}
            displayCurrency={displayCurrency}
            CURRENCY_SYMBOLS={CURRENCY_SYMBOLS}
            getGameFromItemName={getGameFromItemName}
          />

          <MarketAnalysisDialog
            open={marketAnalysisDialog}
            onClose={() => setMarketAnalysisDialog(false)}
            analysisText={analysisText}
            analysisLoading={analysisLoading}
            t={t}
            theme={theme}
            item={itemToAnalyze}
          />
          
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
          
          <AnalyticsDialog
            open={analyticsOpen}
            onClose={() => setAnalyticsOpen(false)}
            t={t}
            theme={theme}
            data={analyticsData}
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

