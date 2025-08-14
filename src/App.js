import React, { useState, useEffect, useRef } from 'react';
import {
  Container, Typography, Box, TextField, Button, Table, TableHead, TableBody, TableRow, TableCell,
  Select, MenuItem, FormControl, InputLabel, Dialog, DialogTitle, DialogContent, DialogActions,
  Tabs, Tab, IconButton, Snackbar, Alert, Grid, Card, CardContent, Chip, Tooltip,
  Autocomplete, CircularProgress, Divider, LinearProgress, Paper, Fab, Menu
} from '@mui/material';
import {
  TrendingUp, Delete, Check, BarChart, Plus, Globe, X, ArrowUp, Edit,
  History, Settings, Tag, Palette, Rocket, Zap, DollarSign, Percent, TrendingDown,
  ArrowDown, Menu as MenuIcon, Eye
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip as ChartTooltip, ResponsiveContainer, CartesianGrid, Legend, PieChart, Pie,
  Cell
} from 'recharts';
import { createTheme, ThemeProvider, styled, useTheme } from '@mui/material/styles';

const theme = createTheme({
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
    mode: 'light',
    primary: {
      main: '#4A148C',
    },
    secondary: {
      main: '#007BFF',
    },
    background: {
      default: '#F8F9FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#212529',
      secondary: '#6C757D',
    },
    divider: '#DEE2E6',
    success: {
      main: '#28A745',
      light: '#D4EDDA',
    },
    error: {
      main: '#DC3545',
      light: '#F8D7DA',
    },
    warning: {
      main: '#FFC107',
      light: '#FFF3CD',
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
        root: {
          borderRadius: 8,
          textTransform: 'none',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transform: 'translateY(-2px)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #4A148C 30%, #4A148C 90%)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          background: '#FFFFFF',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: '#F1F3F5',
            '&.Mui-focused fieldset': {
              borderColor: '#007BFF',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          background: '#FFFFFF',
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
        paper: {
          borderRadius: 16,
          background: '#F8F9FA',
          boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 3,
          borderRadius: '4px 4px 0 0',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          color: '#6C757D',
          '&.Mui-selected': {
            color: '#4A148C',
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#212529',
          color: '#E0E0E0',
          borderRadius: 8,
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          fontSize: '0.875rem',
        },
      },
    },
  },
});

// Стилізована картка, яка тепер має бути завжди однакової висоти
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%', // Важливо, щоб картка заповнювала весь простір елемента Grid
  minHeight: '320px', // Мінімальна висота, щоб навіть порожні картки були достатньо великими
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between', // Розподіляє вміст вертикально
  padding: theme.spacing(1.5),
  overflow: 'hidden',
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

const BACKEND_URL = 'https://steam-proxy-server-lues.onrender.com';
const PROXY_SERVER_URL = "https://steam-proxy-server-lues.onrender.com";

export default function App() {
  const theme = useTheme(); // Виправлено: useTheme()
  const [investments, setInvestments] = useState([]);
  const [name, setName] = useState("");
  const [count, setCount] = useState(1);
  const [buyPrice, setBuyPrice] = useState(0);
  const [buyCurrency, setBuyCurrency] = useState(CURRENCIES[0]);
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
  const [priceHistory, setPriceHistory] = useState([]);
  const [priceHistoryOpen, setPriceHistoryOpen] = useState(false);
  const [priceHistoryLoading, setPriceHistoryLoading] = useState(false);
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

  const handlePriceHistory = async (item) => {
    setPriceHistoryOpen(true);
    setPriceHistoryLoading(true);
    try {
      const url = `${PROXY_SERVER_URL}/price_history?item_name=${encodeURIComponent(item.market_hash_name)}&game=${encodeURIComponent(item.game)}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        const historyData = data.prices.map(([date, price]) => ({
          date: new Date(date).toLocaleDateString(),
          price: parseFloat(price),
        })).sort((a, b) => new Date(a.date) - new Date(b.date));
        setPriceHistory(historyData);
      } else {
        setPriceHistory([]);
        showSnackbar('Не вдалося отримати історію ціни.', 'warning');
      }
    } catch (error) {
      console.error('Error fetching price history:', error);
      showSnackbar('Помилка при отриманні історії ціни.', 'error');
    } finally {
      setPriceHistoryLoading(false);
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
        showSnackbar(`Поточна ціна для ${item.name}: ${currentPrice.toFixed(2)} ${CURRENCY_SYMBOLS[item.buyCurrency]}`, 'info');
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
    if (!name || count <= 0 || buyPrice <= 0 || !boughtDate) {
      showSnackbar("СИСТЕМНА ПОМИЛКА: ВВЕДІТЬ ПОВНІ ДАНІ", "error");
      return;
    }

    try {
      const newItem = {
        name,
        market_hash_name: selectedItemDetails?.market_hash_name || name,
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

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleAnalyticsOpen = () => {
    setAnalyticsOpen(true);
  };

  const handleItemDetailsOpen = (item) => {
    setItemToDisplayDetails(item);
    setItemDetailsDialogOpen(true);
  };

  const filteredInvestments = tabValue === 0 ? investments : investments.filter((item) => item.game === GAMES[tabValue]);

  const totalInvestment = investments.reduce((sum, item) => sum + item.buyPrice * item.count, 0);
  const totalSoldProfit = investments
    .filter(item => item.sold)
    .reduce((sum, item) => sum + (item.sellPrice - item.buyPrice) * item.count, 0);
  
  const totalMarketValue = investments
    .filter(item => !item.sold)
    .reduce((sum, item) => sum + (item.currentPrice || item.buyPrice) * item.count, 0);
  
  const currentMarketProfit = totalMarketValue - investments
    .filter(item => !item.sold)
    .reduce((sum, item) => sum + item.buyPrice * item.count, 0);

  const profitColor = totalSoldProfit >= 0 ? theme.palette.success.main : theme.palette.error.main;
  const percentageProfit = totalInvestment > 0 ? (totalSoldProfit / totalInvestment) * 100 : 0;
  
  const currentProfitColor = currentMarketProfit >= 0 ? theme.palette.success.main : theme.palette.error.main;
  const currentPercentageProfit = totalInvestment > 0 ? (currentMarketProfit / totalInvestment) * 100 : 0;

  const profitByDate = investments
    .filter(item => item.sold)
    .map(item => ({ date: item.sellDate, profit: (item.sellPrice - item.buyPrice) * item.count }))
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
    acc[item.game] += item.buyPrice * item.count;
    return acc;
  }, {})).map(([game, value]) => ({ name: game, value }));

  const PIE_COLORS = ['#4A148C', '#007BFF', '#DC3545', '#FFC107', '#28A745'];

  const ItemDetailsDialog = ({ open, onClose, item }) => {
    if (!item) return null;
    const itemProfit = (item.currentPrice - item.buyPrice) * item.count;
    const profitColor = itemProfit >= 0 ? theme.palette.success.main : theme.palette.error.main;

    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ style: { borderRadius: 16 } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight="bold" color="primary">{t.itemDetails}</Typography>
          <IconButton onClick={onClose}>
            <X />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
            {item.image && (
              <img src={item.image} alt={item.name} style={{ width: '100%', maxWidth: 200, borderRadius: 8, marginBottom: 16 }} />
            )}
            <Typography variant="h5" fontWeight="bold" textAlign="center">{item.name}</Typography>
            <Chip label={item.game} color="secondary" size="small" sx={{ mt: 1 }} />
          </Box>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">{t.buyPrice}</Typography>
              <Typography variant="h6" fontWeight="bold">{item.buyPrice.toFixed(2)} {CURRENCY_SYMBOLS[item.buyCurrency]}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">{t.currentPrice}</Typography>
              <Typography variant="h6" fontWeight="bold">
                {item.currentPrice ? `${item.currentPrice.toFixed(2)} ${CURRENCY_SYMBOLS[item.buyCurrency]}` : '—'}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">{t.profit} ({t.currentMarketProfit})</Typography>
              <Typography variant="h6" fontWeight="bold" sx={{ color: profitColor }}>
                {item.currentPrice ? `${itemProfit.toFixed(2)} ${CURRENCY_SYMBOLS[item.buyCurrency]}` : '—'}
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: '100vh', pb: 4 }}>
        <Container maxWidth="xl" sx={{ pt: 0, pb: 4 }}>
          <Paper elevation={0} sx={{ 
            py: 2, 
            px: 3, 
            mb: 4, 
            borderRadius: 2,
            background: theme.palette.background.paper,
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h4" color="primary" fontWeight="bold">
                {t.portfolio}
              </Typography>
              <Box display="flex" gap={1}>
                <Tooltip title={t.updateAllPrices}>
                  <IconButton color="primary" onClick={fetchAndUpdateAllPrices} disabled={isUpdatingAllPrices}>
                    {isUpdatingAllPrices ? <CircularProgress size={24} /> : <Zap />}
                  </IconButton>
                </Tooltip>
                <Tooltip title={t.analytics}>
                  <IconButton color="secondary" onClick={handleAnalyticsOpen}>
                    <BarChart />
                  </IconButton>
                </Tooltip>
                <Tooltip title={t.settings}>
                  <IconButton color="secondary" onClick={handleSettingsMenuClick}>
                    <Settings />
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={settingsAnchorEl}
                  open={settingsMenuOpen}
                  onClose={handleSettingsMenuClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <MenuItem onClick={handleSettingsMenuClose}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Globe size={18} />
                      <FormControl variant="standard" size="small" sx={{ minWidth: 100 }}>
                        <Select
                          value={lang}
                          onChange={(e) => setLang(e.target.value)}
                          displayEmpty
                          inputProps={{ 'aria-label': 'Without label' }}
                        >
                          <MenuItem value="uk">Українська</MenuItem>
                          <MenuItem value="en">English</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </MenuItem>
                  <MenuItem onClick={handleSettingsMenuClose}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <DollarSign size={18} />
                      <FormControl variant="standard" size="small" sx={{ minWidth: 100 }}>
                        <Select
                          value={buyCurrency}
                          onChange={(e) => setBuyCurrency(e.target.value)}
                          displayEmpty
                          inputProps={{ 'aria-label': 'Without label' }}
                        >
                          {CURRENCIES.map((currency, index) => (
                            <MenuItem key={index} value={currency}>{CURRENCY_SYMBOLS[currency]}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </MenuItem>
                </Menu>
              </Box>
            </Box>
          </Paper>

          <Grid container spacing={2} mb={4} justifyContent="center" sx={{ px: { xs: 1, md: 0 } }}>
            <Grid item xs={12} sm={6} md={3}>
              <Tooltip title={t.totalInvestmentTooltip} arrow>
                <StyledMetricCard>
                  <DollarSign size={36} color={theme.palette.primary.main} sx={{ mb: 1 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    {t.totalInvestment}
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="primary">
                    {totalInvestment.toFixed(2)} {CURRENCY_SYMBOLS[buyCurrency]}
                  </Typography>
                </StyledMetricCard>
              </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Tooltip title={t.totalProfitTooltip} arrow>
                <StyledMetricCard bgcolor={profitColor === theme.palette.success.main ? theme.palette.success.light : theme.palette.error.light}>
                  {totalSoldProfit >= 0 ? <TrendingUp size={36} color={theme.palette.success.main} sx={{ mb: 1 }} /> : <TrendingDown size={36} color={theme.palette.error.main} sx={{ mb: 1 }} /> }
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    {t.totalProfit}
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: profitColor }}>
                    {totalSoldProfit.toFixed(2)} {CURRENCY_SYMBOLS[buyCurrency]}
                  </Typography>
                </StyledMetricCard>
              </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Tooltip title="Сумарна вартість усіх активних предметів за поточною ринковою ціною." arrow>
                <StyledMetricCard>
                  <TrendingUp size={36} color={theme.palette.secondary.main} sx={{ mb: 1 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    {t.currentMarketValue}
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="secondary">
                    {totalMarketValue.toFixed(2)} {CURRENCY_SYMBOLS[buyCurrency]}
                  </Typography>
                </StyledMetricCard>
              </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Tooltip title="Різниця між поточною ринковою вартістю та загальним капіталом." arrow>
                <StyledMetricCard bgcolor={currentProfitColor === theme.palette.success.main ? theme.palette.success.light : theme.palette.error.light}>
                  {currentMarketProfit >= 0 ? <TrendingUp size={36} color={theme.palette.success.main} sx={{ mb: 1 }} /> : <TrendingDown size={36} color={theme.palette.error.main} sx={{ mb: 1 }} /> }
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    {t.currentMarketProfit}
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: currentProfitColor }}>
                    {currentMarketProfit.toFixed(2)} {CURRENCY_SYMBOLS[buyCurrency]}
                  </Typography>
                </StyledMetricCard>
              </Tooltip>
            </Grid>
          </Grid>
          
          <Paper sx={{
            mb: 4,
            p: 0,
            mx: 0,
            borderRadius: '12px 12px 0 0',
            boxShadow: 'none' // Додано для видалення тіні, якщо потрібно
          }}>
            <Tabs
              value={tabValue}
              onChange={(e, newValue) => setTabValue(newValue)}
              sx={{
                px: 2,
                '& .MuiTabs-indicator': {
                  backgroundColor: theme.palette.primary.main,
                  height: 3
                }
              }}
            >
              {GAMES.map((gameName, index) => (
                <Tab
                  key={index}
                  label={gameName === "Усі" ? t.total : gameName}
                  sx={{
                    minWidth: 0,
                    padding: '6px 12px',
                    fontSize: '0.875rem',
                    '&.Mui-selected': {
                      color: theme.palette.primary.main,
                    }
                  }}
                />
              ))}
            </Tabs>
          </Paper>

          <Grid
            container
            spacing={0}
            sx={{
              width: '100%',
              margin: 0,
              '& .MuiGrid-item': {
                padding: '8px !important'
              }
            }}
          >
            {filteredInvestments.length === 0 ? (
              <Grid item xs={12}>
                <Box sx={{ p: 4, textAlign: 'center', color: theme.palette.text.secondary }}>
                  <Typography variant="h6" gutterBottom>
                    {t.noInvestments}
                  </Typography>
                  <Typography variant="body1">
                    {t.addFirstInvestment}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Plus size={20} />}
                    onClick={() => setAddDialog(true)}
                    sx={{ mt: 2 }}
                  >
                    {t.addInvestment}
                  </Button>
                </Box>
              </Grid>
            ) : (
              filteredInvestments.map((item) => {
                const profitColorForCard = item.sold ?
                  ((item.sellPrice - item.buyPrice) * item.count >= 0 ? theme.palette.success.main : theme.palette.error.main) :
                  (item.currentPrice && (item.currentPrice - item.buyPrice) * item.count >= 0 ? theme.palette.success.main : theme.palette.error.main);

                return (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    xl={2}
                    key={item.id}
                    sx={{
                      display: 'flex',
                      boxSizing: 'border-box'
                    }}
                  >
                    <StyledCard
                      onClick={() => handleItemDetailsOpen(item)}
                      sx={{
                        width: '100%',
                        m: 0,
                        borderRadius: 0
                      }}
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                        <CardContent sx={{
                          p: 1.5,
                          flexGrow: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          overflow: 'hidden',
                          minHeight: '200px',
                        }}>
                          <CardHeader>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, overflow: 'hidden' }}>
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6 }}
                                />
                              )}
                              <Box sx={{ overflow: 'hidden' }}>
                                <Typography variant="subtitle1" fontWeight="bold" noWrap sx={{ textOverflow: 'ellipsis' }}>
                                  {item.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" noWrap>
                                  {item.game}
                                </Typography>
                              </Box>
                            </Box>
                            <Chip
                              label={item.sold ? t.sold : t.active}
                              color={item.sold ? "success" : "primary"}
                              size="small"
                              sx={{ ml: 1 }}
                            />
                          </CardHeader>
                          <Divider sx={{ my: 1 }} />
                          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={1} sx={{ overflow: 'hidden' }}>
                            <Box>
                              <Typography variant="body2" color="text.secondary">{t.count}:</Typography>
                              <Typography variant="h6" fontWeight="bold">{item.count}</Typography>
                            </Box>
                            <Box>
                              <Typography variant="body2" color="text.secondary">{t.buyPrice}:</Typography>
                              <Typography variant="h6" fontWeight="bold">
                                {item.buyPrice.toFixed(2)} {CURRENCY_SYMBOLS[item.buyCurrency]}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="body2" color="text.secondary">{t.profit}:</Typography>
                              {item.sold ? (
                                <Typography variant="h6" fontWeight="bold" sx={{ color: profitColorForCard }}>
                                  {((item.sellPrice - item.buyPrice) * item.count).toFixed(2)} {CURRENCY_SYMBOLS[item.buyCurrency]}
                                </Typography>
                              ) : (
                                <Typography variant="h6" fontWeight="bold" sx={{ color: profitColorForCard }}>
                                  {item.currentPrice ? ((item.currentPrice - item.buyPrice) * item.count).toFixed(2) : 0} {CURRENCY_SYMBOLS[item.buyCurrency]}
                                </Typography>
                              )}
                            </Box>
                            <Box>
                              <Typography variant="body2" color="text.secondary">{t.boughtDate}:</Typography>
                              <Typography variant="h6" fontWeight="bold">{item.boughtDate}</Typography>
                            </Box>
                          </Box>
                        </CardContent>
                        <CardFooter>
                          <Box display="flex" gap={0.5} flexWrap="wrap">
                            <Tooltip title={t.edit}>
                              <IconButton color="secondary" onClick={(e) => { e.stopPropagation(); handleEdit(item); }} size="small">
                                <Edit size={16} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={t.markAsSold}>
                              <IconButton
                                color="success"
                                onClick={(e) => { e.stopPropagation(); setItemToSell(item); setSellPrice(item.buyPrice); setSellDialog(true); }}
                                disabled={item.sold}
                                size="small"
                              >
                                <TrendingUp size={16} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={t.delete}>
                              <IconButton color="error" onClick={(e) => { e.stopPropagation(); confirmDelete(item); }} size="small">
                                <Delete size={16} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={t.priceHistory}>
                              <IconButton color="primary" onClick={(e) => { e.stopPropagation(); handlePriceHistory(item); }} size="small">
                                <History size={16} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={t.updatePrice}>
                              <IconButton color="secondary" onClick={(e) => { e.stopPropagation(); handleCurrentPriceUpdate(item); }} size="small">
                                <Zap size={16} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={t.marketAnalysis}>
                              <IconButton color="primary" onClick={(e) => { e.stopPropagation(); handleMarketAnalysis(item); }} size="small">
                                <BarChart size={16} />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </CardFooter>
                      </Box>
                    </StyledCard>
                  </Grid>
                );
              })}
          </Grid>

          <Fab
            color="primary"
            aria-label="add"
            onClick={() => setAddDialog(true)}
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
              zIndex: 1000,
            }}
          >
            <Plus />
          </Fab>

          {/* Add Item Dialog */}
          <Dialog open={addDialog} onClose={() => setAddDialog(false)} maxWidth="sm" fullWidth PaperProps={{ style: { borderRadius: 16 } }}>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" fontWeight="bold" color="primary">{t.addInvestment}</Typography>
              <IconButton onClick={() => setAddDialog(false)}>
                <X />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <Autocomplete
                freeSolo
                value={autocompleteValue}
                onChange={handleAutocompleteChange}
                inputValue={name}
                onInputChange={handleItemNameChange}
                options={itemOptions}
                getOptionLabel={(option) => typeof option === 'string' ? option : option.label}
                loading={autocompleteLoading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t.itemName}
                    variant="outlined"
                    fullWidth
                    required
                    sx={{ mb: 2 }}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {autocompleteLoading ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <img
                        src={option.image}
                        alt={option.label}
                        style={{ width: 32, height: 32, borderRadius: 4, objectFit: 'cover' }}
                      />
                      <Typography>{option.label}</Typography>
                    </Box>
                  </li>
                )}
              />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>{t.game}</InputLabel>
                <Select
                  value={tabValue === 0 ? GAMES.indexOf(game) : tabValue}
                  label={t.game}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setTabValue(newValue);
                    setGame(GAMES[newValue]);
                  }}
                >
                  {GAMES.map((gameName, index) => (
                    <MenuItem key={index} value={index}>{gameName === "Усі" ? "Всі ігри" : gameName}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label={t.count}
                type="number"
                value={count}
                onChange={(e) => setCount(e.target.value)}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <Box display="flex" gap={2}>
                <TextField
                  label={t.buyPrice}
                  type="number"
                  value={buyPrice}
                  onChange={(e) => setBuyPrice(e.target.value)}
                  fullWidth
                  required
                  sx={{ mb: 2 }}
                />
                <FormControl fullWidth>
                  <InputLabel>{t.currency}</InputLabel>
                  <Select
                    value={buyCurrency}
                    label={t.currency}
                    onChange={(e) => setBuyCurrency(e.target.value)}
                  >
                    {CURRENCIES.map((currency) => (
                      <MenuItem key={currency} value={currency}>{currency}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <TextField
                label={t.boughtDate}
                type="date"
                value={boughtDate}
                onChange={(e) => setBoughtDate(e.target.value)}
                fullWidth
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setAddDialog(false)} color="secondary">
                {t.cancel}
              </Button>
              <Button onClick={addItem} color="primary" variant="contained">
                {t.add}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Edit Item Dialog */}
          <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth PaperProps={{ style: { borderRadius: 16 } }}>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" fontWeight="bold" color="primary">{t.editInvestment}</Typography>
              <IconButton onClick={() => setEditDialog(false)}>
                <X />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <TextField
                label={t.itemName}
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>{t.game}</InputLabel>
                <Select
                  value={GAMES.indexOf(game)}
                  label={t.game}
                  onChange={(e) => setGame(GAMES[e.target.value])}
                >
                  {GAMES.filter(gameName => gameName !== "Усі").map((gameName, index) => (
                    <MenuItem key={index} value={index + 1}>{gameName}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label={t.count}
                type="number"
                value={count}
                onChange={(e) => setCount(e.target.value)}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <TextField
                label={t.buyPrice}
                type="number"
                value={buyPrice}
                onChange={(e) => setBuyPrice(e.target.value)}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <TextField
                label={t.boughtDate}
                type="date"
                value={boughtDate}
                onChange={(e) => setBoughtDate(e.target.value)}
                fullWidth
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditDialog(false)} color="secondary">
                {t.cancel}
              </Button>
              <Button onClick={saveEditedItem} color="primary" variant="contained">
                {t.save}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Sell Dialog */}
          <Dialog open={sellDialog} onClose={() => setSellDialog(false)} maxWidth="sm" fullWidth PaperProps={{ style: { borderRadius: 16 } }}>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" fontWeight="bold" color="primary">{t.markAsSold}</Typography>
              <IconButton onClick={() => setSellDialog(false)}>
                <X />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {t.sellConfirmation} <strong>{itemToSell?.name}</strong>?
              </Typography>
              <TextField
                label={t.sellPrice}
                type="number"
                value={sellPrice}
                onChange={(e) => setSellPrice(e.target.value)}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <TextField
                label={t.sellDate}
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
            <DialogActions>
              <Button onClick={() => setSellDialog(false)} color="secondary">
                {t.cancel}
              </Button>
              <Button onClick={markAsSold} color="success" variant="contained">
                {t.confirm}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Delete Dialog */}
          <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ style: { borderRadius: 16 } }}>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" fontWeight="bold" color="error">{t.deleteInvestment}</Typography>
              <IconButton onClick={() => setDeleteDialogOpen(false)}>
                <X />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {t.deleteConfirmation} <strong>{itemToDelete?.name}</strong>?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteDialogOpen(false)} color="secondary">
                {t.cancel}
              </Button>
              <Button onClick={handleDelete} color="error" variant="contained">
                {t.delete}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Price History Dialog */}
          <Dialog open={priceHistoryOpen} onClose={() => setPriceHistoryOpen(false)} maxWidth="md" fullWidth PaperProps={{ style: { borderRadius: 16 } }}>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" fontWeight="bold" color="primary">{t.priceHistory}</Typography>
              <IconButton onClick={() => setPriceHistoryOpen(false)}>
                <X />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              {priceHistoryLoading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height={300}>
                  <CircularProgress />
                </Box>
              ) : priceHistory.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={priceHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis dataKey="price" />
                    <ChartTooltip />
                    <Legend />
                    <Line type="monotone" dataKey="price" stroke={theme.palette.primary.main} name={t.price} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <Box textAlign="center" py={4}>
                  <Typography variant="body1" color="text.secondary">{t.noPriceHistory}</Typography>
                </Box>
              )}
            </DialogContent>
          </Dialog>

          {/* Market Analysis Dialog */}
          <Dialog open={marketAnalysisDialog} onClose={() => setMarketAnalysisDialog(false)} maxWidth="md" fullWidth PaperProps={{ style: { borderRadius: 16 } }}>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" fontWeight="bold" color="primary">{t.marketAnalysis}</Typography>
              <IconButton onClick={() => setMarketAnalysisDialog(false)}>
                <X />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              {analysisLoading ? (
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={4}>
                  <CircularProgress sx={{ mb: 2 }} />
                  <Typography>{t.generatingAnalysis}</Typography>
                </Box>
              ) : (
                <Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {t.analysisFor} {itemToAnalyze?.name}
                  </Typography>
                  <Typography whiteSpace="pre-wrap">{analysisText}</Typography>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setMarketAnalysisDialog(false)} color="secondary">
                {t.close}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Analytics Dialog */}
          <Dialog open={analyticsOpen} onClose={() => setAnalyticsOpen(false)} maxWidth="lg" fullWidth PaperProps={{ style: { borderRadius: 16 } }}>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" fontWeight="bold" color="primary">{t.analytics}</Typography>
              <IconButton onClick={() => setAnalyticsOpen(false)}>
                <X />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Paper elevation={0} sx={{ p: 3, height: '100%' }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>{t.cumulativeProfit}</Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={cumulativeProfit}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <ChartTooltip />
                        <Legend />
                        <Line type="monotone" dataKey="profit" stroke={theme.palette.success.main} name={t.profit} />
                      </LineChart>
                    </ResponsiveContainer>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper elevation={0} sx={{ p: 3, height: '100%' }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>{t.investmentDistribution}</Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={investmentDistributionData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          label
                        >
                          {investmentDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <ChartTooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Paper>
                </Grid>
              </Grid>
            </DialogContent>
          </Dialog>

          {/* Item Details Dialog */}
          <ItemDetailsDialog
            open={itemDetailsDialogOpen}
            onClose={() => setItemDetailsDialogOpen(false)}
            item={itemToDisplayDetails}
          />
          
        </Container>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={closeSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );