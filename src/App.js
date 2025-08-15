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
    const finalName = autocompleteValue?.label || name;
    if (!finalName || finalName.trim() === '' || count <= 0 || buyPrice <= 0 || !boughtDate) {
      showSnackbar("СИСТЕМНА ПОМИЛКА: ВВЕДІТЬ ПОВНІ ДАНІ", "error");
      return;
    }

    try {
      const newItem = {
        name: finalName,
        market_hash_name: selectedItemDetails?.market_hash_name || finalName,
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

  // РОЗРАХУНОК НОВИХ ФІНАНСОВИХ ПОКАЗНИКІВ
  const soldInvestments = investments.filter(item => item.sold);
  const activeInvestments = investments.filter(item => !item.sold);
  
  const totalInvestment = investments.reduce((sum, item) => sum + convertCurrency(item.buyPrice * item.count, item.buyCurrency), 0);
  
  const totalInvestmentInSoldItems = soldInvestments.reduce((sum, item) => sum + convertCurrency(item.buyPrice * item.count, item.buyCurrency), 0);
  const totalInvestmentInActiveItems = activeInvestments.reduce((sum, item) => sum + convertCurrency(item.buyPrice * item.count, item.buyCurrency), 0);
  
  const totalSoldProfit = soldInvestments.reduce((sum, item) => {
      const grossProfit = (convertCurrency(item.sellPrice, item.buyCurrency) - convertCurrency(item.buyPrice, item.buyCurrency)) * item.count;
      const totalSellValue = convertCurrency(item.sellPrice, item.buyCurrency) * item.count;
      const netProfit = getNetProfit(grossProfit, totalSellValue, item.commissions);
      return sum + netProfit;
  }, 0);

  const totalMarketValue = activeInvestments.reduce((sum, item) => sum + convertCurrency((item.currentPrice || item.buyPrice) * item.count, item.buyCurrency), 0);
  
  const currentMarketProfit = totalMarketValue - totalInvestmentInActiveItems;

  const totalFeesPaid = soldInvestments.reduce((sum, item) => {
    const totalSellValue = convertCurrency(item.sellPrice, item.buyCurrency) * item.count;
    const totalRate = (item.commissions || []).reduce((rate, c) => rate + c.rate, 0);
    return sum + (totalSellValue * totalRate / 100);
  }, 0);
  
  const realizedROI = totalInvestmentInSoldItems > 0 ? (totalSoldProfit / totalInvestmentInSoldItems) * 100 : 0;
  const unrealizedROI = totalInvestmentInActiveItems > 0 ? (currentMarketProfit / totalInvestmentInActiveItems) * 100 : 0;
  
  const averageHoldingPeriod = soldInvestments.length > 0
    ? soldInvestments.reduce((sum, item) => {
        const bought = new Date(item.boughtDate);
        const sold = new Date(item.sellDate);
        const diffTime = Math.abs(sold - bought);
        return sum + Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }, 0) / soldInvestments.length
    : 0;
  
  const profitColor = totalSoldProfit >= 0 ? theme.palette.success.main : theme.palette.error.main;
  const currentProfitColor = currentMarketProfit >= 0 ? theme.palette.success.main : theme.palette.error.main;
  const realizedROIColor = realizedROI >= 0 ? theme.palette.success.main : theme.palette.error.main;
  const unrealizedROIColor = unrealizedROI >= 0 ? theme.palette.success.main : theme.palette.error.main;
  
  const profitByDate = soldInvestments
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

  const profitByGameData = Object.entries(investments.reduce((acc, item) => {
    if (!acc[item.game]) acc[item.game] = 0;
    if (item.sold) {
      const grossProfit = (convertCurrency(item.sellPrice, item.buyCurrency) - convertCurrency(item.buyPrice, item.buyCurrency)) * item.count;
      const totalSellValue = convertCurrency(item.sellPrice, item.buyCurrency) * item.count;
      const netProfit = getNetProfit(grossProfit, totalSellValue, item.commissions);
      acc[item.game] += netProfit;
    } else {
      const grossProfit = (convertCurrency(item.currentPrice || item.buyPrice, item.buyCurrency) - convertCurrency(item.buyPrice, item.buyCurrency)) * item.count;
      const totalCurrentValue = convertCurrency((item.currentPrice || item.buyPrice), item.buyCurrency) * item.count;
      const netProfit = getNetProfit(grossProfit, totalCurrentValue, item.commissions);
      acc[item.game] += netProfit;
    }
    return acc;
  }, {})).map(([game, value]) => ({ name: game, profit: value }));
  
  const PIE_COLORS = ['#4A148C', '#007BFF', '#DC3545', '#FFC107', '#28A745'];

  const ItemDetailsDialog = ({ open, onClose, item }) => {
    if (!item) return null;
    
    const convertedTotalBuyPrice = convertCurrency(item.buyPrice * item.count, item.buyCurrency);
    const convertedCurrentPrice = item.currentPrice ? convertCurrency(item.currentPrice, 'EUR') : null;
    const convertedTotalCurrentPrice = convertedCurrentPrice ? convertedCurrentPrice * item.count : convertedTotalBuyPrice;
    
    const itemGrossProfit = item.sold ? (convertCurrency(item.sellPrice, item.buyCurrency) * item.count) - convertedTotalBuyPrice : convertedTotalCurrentPrice - convertedTotalBuyPrice;
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
                <Typography variant="h5" fontWeight="bold" textAlign="center">{item.name.replace(/\*/g, '')}</Typography>
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
                    {item.currentPrice ? convertCurrency(item.currentPrice, 'EUR').toFixed(2) : '-'} {item.currentPrice ? CURRENCY_SYMBOLS[displayCurrency] : ''}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Ціна продажу</Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {item.sold ? convertCurrency(item.sellPrice, item.buyCurrency).toFixed(2) : '-'} {item.sold ? CURRENCY_SYMBOLS[displayCurrency] : ''}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">{t.profit}</Typography>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: profitColor }}>
                    {itemProfit.toFixed(2)} {CURRENCY_SYMBOLS[displayCurrency]}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">ROI</Typography>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: profitColor }}>
                    {profitPercentage}%
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Загальна комісія</Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {totalCommissionRate.toFixed(2)}%
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'space-between' }}>
          <Button onClick={handleOpenMarketLink} color="secondary" variant="outlined" startIcon={<Globe />} sx={{ borderRadius: 8 }}>
            Перейти на ринок
          </Button>
          <Button onClick={onClose} color="primary" variant="contained" sx={{ borderRadius: 8 }}>
            Закрити
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  const AnalyticsDialog = memo(({ open, onClose, theme }) => {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth PaperProps={{ style: { borderRadius: 16 } }}>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight="bold" color="primary">Аналітика та звіти</Typography>
            <IconButton onClick={onClose}>
              <X />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            {/* Графік кумулятивного прибутку */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>Зміна кумулятивного прибутку</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={cumulativeProfit}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                    <XAxis dataKey="date" stroke={theme.palette.text.secondary} />
                    <YAxis stroke={theme.palette.text.secondary} />
                    <ChartTooltip 
                      contentStyle={{ backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, borderRadius: 8 }}
                      labelStyle={{ color: theme.palette.text.primary }}
                      itemStyle={{ color: theme.palette.text.secondary }}
                      formatter={(value) => `${value.toFixed(2)} ${CURRENCY_SYMBOLS[displayCurrency]}`}
                    />
                    <Line type="monotone" dataKey="profit" stroke={theme.palette.primary.main} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            
            {/* Кругова діаграма розподілу інвестицій */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h6" gutterBottom>Розподіл інвестицій по іграх</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={investmentDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {investmentDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip 
                      contentStyle={{ backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, borderRadius: 8 }}
                      labelStyle={{ color: theme.palette.text.primary }}
                      itemStyle={{ color: theme.palette.text.secondary }}
                      formatter={(value) => `${value.toFixed(2)} ${CURRENCY_SYMBOLS[displayCurrency]}`}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Стовпчикова діаграма прибутку по іграх */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>Прибуток по іграх</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsBarChart data={profitByGameData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip />
                    <Legend />
                    <Bar dataKey="profit" name="Загальний прибуток" fill="#8884d8" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose} color="primary" variant="contained" sx={{ borderRadius: 8 }}>
            Закрити
          </Button>
        </DialogActions>
      </Dialog>
    );
  });
  
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        py: 4,
      }}>
        <Container maxWidth="xl">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Typography variant="h4" fontWeight="bold">Управління інвестиціями</Typography>
            <Box>
              <Tooltip title="Налаштування">
                <IconButton onClick={handleSettingsMenuClick} color="primary" sx={{ mr: 1 }}>
                  <Settings />
                </IconButton>
              </Tooltip>
              <Tooltip title="Додати актив">
                <Fab color="primary" size="medium" onClick={() => setAddDialog(true)}>
                  <Plus />
                </Fab>
              </Tooltip>
            </Box>
            <Menu
              anchorEl={settingsAnchorEl}
              open={settingsMenuOpen}
              onClose={handleSettingsMenuClose}
              PaperProps={{
                sx: { borderRadius: 3, minWidth: 200 }
              }}
            >
              <MenuItem>
                <FormControlLabel
                  control={
                    <Switch
                      checked={themeMode === 'dark'}
                      onChange={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
                    />
                  }
                  label="Темна тема"
                />
              </MenuItem>
              <MenuItem>
                <FormControlLabel
                  control={
                    <Switch
                      checked={autoUpdateEnabled}
                      onChange={(e) => setAutoUpdateEnabled(e.target.checked)}
                    />
                  }
                  label="Автооновлення цін"
                />
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => {
                fetchAndUpdateAllPrices();
                handleSettingsMenuClose();
              }} disabled={isUpdatingAllPrices}>
                {isUpdatingAllPrices ? <CircularProgress size={24} /> : <TrendingUp />}
                <Typography ml={1}>Оновити всі ціни</Typography>
              </MenuItem>
              <MenuItem onClick={handleSettingsMenuClose}>
                <History />
                <Typography ml={1}>Історія змін</Typography>
              </MenuItem>
              <Divider />
              <MenuItem>
                <FormControl fullWidth>
                  <InputLabel id="currency-select-label">Валюта</InputLabel>
                  <Select
                    labelId="currency-select-label"
                    value={displayCurrency}
                    label="Валюта"
                    onChange={(e) => setDisplayCurrency(e.target.value)}
                  >
                    {CURRENCIES.map(c => (
                      <MenuItem key={c} value={c}>{c}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </MenuItem>
            </Menu>
          </Box>

          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} md={4}>
              <StyledMetricCard>
                <DollarSign size={32} color={theme.palette.primary.main} />
                <Typography variant="body2" color="text.secondary" mt={1}>Загальний обсяг інвестицій</Typography>
                <Typography variant="h5" fontWeight="bold" mt={1}>
                  {totalInvestment.toFixed(2)} {CURRENCY_SYMBOLS[displayCurrency]}
                </Typography>
              </StyledMetricCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <StyledMetricCard>
                <TrendingUp size={32} color={currentProfitColor} />
                <Typography variant="body2" color="text.secondary" mt={1}>Нереалізований прибуток</Typography>
                <Typography variant="h5" fontWeight="bold" sx={{ color: currentProfitColor }} mt={1}>
                  {currentMarketProfit.toFixed(2)} {CURRENCY_SYMBOLS[displayCurrency]}
                </Typography>
              </StyledMetricCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <StyledMetricCard>
                <Percent size={32} color={unrealizedROIColor} />
                <Typography variant="body2" color="text.secondary" mt={1}>Нереалізований ROI</Typography>
                <Typography variant="h5" fontWeight="bold" sx={{ color: unrealizedROIColor }} mt={1}>
                  {unrealizedROI.toFixed(2)}%
                </Typography>
              </StyledMetricCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <StyledMetricCard>
                <TrendingUp size={32} color={profitColor} />
                <Typography variant="body2" color="text.secondary" mt={1}>Реалізований прибуток</Typography>
                <Typography variant="h5" fontWeight="bold" sx={{ color: profitColor }} mt={1}>
                  {totalSoldProfit.toFixed(2)} {CURRENCY_SYMBOLS[displayCurrency]}
                </Typography>
              </StyledMetricCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <StyledMetricCard>
                <Percent size={32} color={realizedROIColor} />
                <Typography variant="body2" color="text.secondary" mt={1}>Реалізований ROI</Typography>
                <Typography variant="h5" fontWeight="bold" sx={{ color: realizedROIColor }} mt={1}>
                  {realizedROI.toFixed(2)}%
                </Typography>
              </StyledMetricCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <StyledMetricCard>
                <Clock size={32} color={theme.palette.text.secondary} />
                <Typography variant="body2" color="text.secondary" mt={1}>Середній період очікування</Typography>
                <Typography variant="h5" fontWeight="bold" mt={1}>
                  {averageHoldingPeriod.toFixed(1)} днів
                </Typography>
              </StyledMetricCard>
            </Grid>
          </Grid>
          <Box mb={4} textAlign="center">
            <Button
              variant="contained"
              color="secondary"
              startIcon={<BarChart />}
              onClick={handleAnalyticsOpen}
              sx={{ borderRadius: 8, px: 4, py: 1.5, fontWeight: 'bold' }}
            >
              Перейти до аналітики
            </Button>
          </Box>
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => {
              setTabValue(newValue);
              setPage(1);
            }}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{ mb: 3 }}
          >
            {GAMES.map((gameName, index) => (
              <Tab label={gameName} key={gameName} />
            ))}
          </Tabs>

          <Grid container spacing={3}>
            {paginatedInvestments.map((item) => (
              <Grid item key={item.id} xs={12} sm={6} md={4} lg={3}>
                <StyledCard onClick={() => handleItemDetailsOpen(item)}>
                  <Box>
                    <Box sx={{
                      height: 180,
                      backgroundColor: theme.palette.background.default,
                      borderRadius: 8,
                      mb: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative'
                    }}>
                      {item.image && (
                        <img src={item.image} alt={item.name} style={{
                          maxWidth: '80%',
                          maxHeight: '100%',
                          objectFit: 'contain'
                        }} />
                      )}
                      <Chip
                        label={item.sold ? "Продано" : "Активний"}
                        color={item.sold ? "success" : "primary"}
                        size="small"
                        sx={{ position: 'absolute', top: 8, right: 8, fontWeight: 'bold' }}
                      />
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight="bold" noWrap>
                        {item.name}
                      </Typography>
                      <Box mt={1}>
                        <Chip
                          label={item.game}
                          color="secondary"
                          size="small"
                          sx={{ fontWeight: 'bold' }}
                        />
                      </Box>
                      <Box display="flex" justifyContent="space-between" mt={1}>
                        <Box>
                          <Typography variant="body2" color="text.secondary">Кількість</Typography>
                          <Typography variant="body1" fontWeight="bold">{item.count}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" color="text.secondary">Ціна покупки</Typography>
                          <Typography variant="body1" fontWeight="bold">
                            {convertCurrency(item.buyPrice, item.buyCurrency).toFixed(2)} {CURRENCY_SYMBOLS[displayCurrency]}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                  <CardActions sx={{ px: 0, pt: 1, justifyContent: 'space-between' }}>
                    <Box>
                      <Tooltip title="Редагувати">
                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleEdit(item); }}>
                          <Edit size={18} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Видалити">
                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); confirmDelete(item); }}>
                          <Delete size={18} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Управління комісіями">
                        <IconButton size="small" onClick={(e) => handleCommissionManagerOpen(e, item)}>
                          <Percent size={18} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Button
                      variant="contained"
                      color="secondary"
                      size="small"
                      onClick={(e) => { e.stopPropagation(); setItemToSell(item); setSellDialog(true); }}
                      disabled={item.sold}
                      sx={{ borderRadius: 2 }}
                    >
                      Продати
                    </Button>
                  </CardActions>
                </StyledCard>
              </Grid>
            ))}
          </Grid>

          <Box mt={4} display="flex" justifyContent="center">
            <Pagination
              count={pageCount}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
              variant="outlined"
              shape="rounded"
            />
          </Box>

          <Dialog open={addDialog} onClose={() => setAddDialog(false)} maxWidth="sm" fullWidth PaperProps={{ style: { borderRadius: 16 } }}>
            <DialogTitle sx={{ textAlign: 'center' }}><Typography variant="h6" fontWeight="bold" color="primary">Додати новий актив</Typography></DialogTitle>
            <DialogContent dividers>
              <Autocomplete
                options={itemOptions}
                getOptionLabel={(option) => option.label || ""}
                isOptionEqualToValue={(option, value) => option.market_hash_name === value.market_hash_name}
                onInputChange={handleItemNameChange}
                onChange={handleAutocompleteChange}
                value={autocompleteValue}
                loading={autocompleteLoading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Назва предмета"
                    margin="normal"
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
                  <li {...props}>
                    {option.image && (
                      <img src={option.image} alt={option.label} style={{ width: 40, height: 40, marginRight: 8, borderRadius: 4 }} />
                    )}
                    {option.label}
                  </li>
                )}
                sx={{ mb: 2 }}
              />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Кількість"
                    type="number"
                    value={count}
                    onChange={(e) => setCount(Number(e.target.value))}
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
                    onChange={(e) => setBuyPrice(Number(e.target.value))}
                    fullWidth
                    required
                    InputProps={{ inputProps: { min: 0 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel id="game-select-label">Гра</InputLabel>
                    <Select
                      labelId="game-select-label"
                      value={game}
                      label="Гра"
                      onChange={(e) => setGame(e.target.value)}
                    >
                      {GAMES.slice(1).map(g => (
                        <MenuItem key={g} value={g}>{g}</MenuItem>
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
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={() => setAddDialog(false)} color="secondary" variant="outlined" sx={{ borderRadius: 8 }}>
                Відмінити
              </Button>
              <Button onClick={addItem} color="primary" variant="contained" sx={{ borderRadius: 8 }}>
                Додати
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth PaperProps={{ style: { borderRadius: 16 } }}>
            <DialogTitle sx={{ textAlign: 'center' }}><Typography variant="h6" fontWeight="bold" color="primary">Редагувати актив</Typography></DialogTitle>
            <DialogContent dividers>
              <TextField
                label="Назва предмета"
                value={name}
                onChange={(e) => setName(e.target.value)}
                margin="normal"
                fullWidth
                required
              />
              <Grid container spacing={2} mt={1}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Кількість"
                    type="number"
                    value={count}
                    onChange={(e) => setCount(Number(e.target.value))}
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
                    onChange={(e) => setBuyPrice(Number(e.target.value))}
                    fullWidth
                    required
                    InputProps={{ inputProps: { min: 0 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel id="game-select-label">Гра</InputLabel>
                    <Select
                      labelId="game-select-label"
                      value={game}
                      label="Гра"
                      onChange={(e) => setGame(e.target.value)}
                    >
                      {GAMES.slice(1).map(g => (
                        <MenuItem key={g} value={g}>{g}</MenuItem>
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
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={() => setEditDialog(false)} color="secondary" variant="outlined" sx={{ borderRadius: 8 }}>
                Відмінити
              </Button>
              <Button onClick={saveEditedItem} color="primary" variant="contained" sx={{ borderRadius: 8 }}>
                Зберегти
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog open={sellDialog} onClose={() => setSellDialog(false)} maxWidth="sm" fullWidth PaperProps={{ style: { borderRadius: 16 } }}>
            <DialogTitle sx={{ textAlign: 'center' }}><Typography variant="h6" fontWeight="bold" color="primary">Продати актив</Typography></DialogTitle>
            <DialogContent dividers>
              {itemToSell && (
                <Box textAlign="center" mb={2}>
                  <Typography variant="body1">Ви продаєте **{itemToSell.name}**</Typography>
                </Box>
              )}
              <TextField
                label="Ціна продажу (за одиницю)"
                type="number"
                value={sellPrice}
                onChange={(e) => setSellPrice(Number(e.target.value))}
                fullWidth
                required
                InputProps={{ inputProps: { min: 0 } }}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Дата продажу"
                type="date"
                value={sellDate}
                onChange={(e) => setSellDate(e.target.value)}
                fullWidth
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </DialogContent>
            <DialogActions sx={{ p: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={() => setSellDialog(false)} color="secondary" variant="outlined" sx={{ borderRadius: 8 }}>
                Відмінити
              </Button>
              <Button onClick={markAsSold} color="primary" variant="contained" sx={{ borderRadius: 8 }}>
                Підтвердити продаж
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth PaperProps={{ style: { borderRadius: 16 } }}>
            <DialogTitle sx={{ textAlign: 'center' }}><Typography variant="h6" fontWeight="bold" color="error">Підтвердження видалення</Typography></DialogTitle>
            <DialogContent>
              <Typography align="center">
                Ви впевнені, що хочете видалити **{itemToDelete?.name}**?
              </Typography>
            </DialogContent>
            <DialogActions sx={{ p: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={() => setDeleteDialogOpen(false)} color="secondary" variant="outlined" sx={{ borderRadius: 8 }}>
                Відмінити
              </Button>
              <Button onClick={handleDelete} color="error" variant="contained" sx={{ borderRadius: 8 }}>
                Видалити
              </Button>
            </DialogActions>
          </Dialog>

          <AnalyticsDialog open={analyticsOpen} onClose={() => setAnalyticsOpen(false)} theme={theme} />

          <Dialog open={marketAnalysisDialog} onClose={() => setMarketAnalysisDialog(false)} maxWidth="sm" fullWidth PaperProps={{ style: { borderRadius: 16 } }}>
            <DialogTitle><Typography variant="h6" fontWeight="bold">Аналіз ринку для {itemToAnalyze?.name}</Typography></DialogTitle>
            <DialogContent dividers>
              {analysisLoading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
                  <CircularProgress color="primary" />
                </Box>
              ) : (
                <Typography whiteSpace="pre-line">{analysisText}</Typography>
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