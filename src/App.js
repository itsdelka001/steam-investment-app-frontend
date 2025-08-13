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
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';

const theme = createTheme({
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

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: theme.spacing(1.5),
  [theme.breakpoints.down('sm')]: {
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

const LANGUAGES = {
  uk: {
    portfolio: "STEAM ІНВЕСТИЦІЇ",
    name: "НАЗВА ПРЕДМЕТА",
    count: "КІЛЬКІСТЬ",
    buyPrice: "ЦІНА ВХОДУ",
    game: "ГРА",
    boughtDate: "ДАТА ВХОДУ",
    action: "ДІЇ",
    addItem: "ДОДАТИ АКТИВ",
    save: "ЗБЕРЕГТИ",
    cancel: "СКАСУВАТИ",
    sold: "ПРОДАНО",
    yes: "ТАК",
    no: "НІ",
    sellPrice: "ЦІНА ВИХОДУ",
    sellDate: "ДАТА ВИХОДУ",
    editItem: "РЕДАГУВАННЯ АКТИВУ",
    deleteConfirmation: "ПІДТВЕРДЖЕННЯ: ВИДАЛИТИ АКТИВ?",
    delete: "ВИДАЛИТИ",
    totalInvestment: "ЗАГАЛЬНИЙ КАПІТАЛ",
    profit: "ПРИБУТОК",
    percentageProfit: "ПРОЦЕНТНИЙ ДОХІД",
    analytics: "АНАЛІТИКА",
    noData: "ДАНІ ВІДСУТНІ...",
    itemAdded: "АКТИВ ЗАРАХОВАНО У ПОРТФОЛІО",
    itemUpdated: "АКТИВ ОНОВЛЕНО",
    itemDeleted: "АКТИВ ВИДАЛЕНО",
    fetchError: "ПОМИЛКА ЗВ'ЯЗКУ З АРХІВОМ...",
    addInvestment: "ДОДАВАННЯ НОВОГО АКТИВУ",
    markAsSold: "ЗАКРИТИ ОПЕРАЦІЮ",
    total: "ВСІ",
    currency: "ВАЛЮТА",
    language: "МОВА",
    priceHistory: "ІСТОРІЯ ЦІНИ",
    noInvestmentsInCategory: "У ЦІЙ КАТЕГОРІЇ ДАНІ ВІДСУТНІ.",
    floatValue: "Float Value",
    stickers: "НАКЛЕЙКИ",
    selectedItem: "ВИБРАНИЙ АКТИВ",
    itemDetails: "ДЕТАЛІЗАЦІЯ АКТИВУ",
    settings: "НАЛАШТУВАННЯ СИСТЕМИ",
    totalProfit: "ЗАГАЛЬНИЙ ПРИБУТОК",
    investmentDistribution: "РОЗПОДІЛ КАПІТАЛУ",
    edit: "РЕДАГУВАТИ",
    tags: "ТЕГИ",
    tagsPlaceholder: "НАПРИКЛАД: 'КЕЙС', 'СТІКЕР', 'ЗБРОЯ'",
    floatValuePlaceholder: "НАПРИКЛАД: '0.12345'",
    stickersList: "НАКЛЕЙКИ (ЧЕРЕЗ КОМУ)",
    updatePrice: "ОНОВИТИ ЦІНУ",
    currentPrice: "ПОТОЧНА ЦІНА",
    marketAnalysis: "АНАЛІЗ РИНКУ (AI)",
    marketAnalysisTitle: "ІМІТАЦІЯ АНАЛІЗУ РИНКУ",
    marketAnalysisGenerating: "ГЕНЕРАЦІЯ АНАЛІЗУ...",
    active: "АКТИВНИЙ",
    totalInvestmentTooltip: "Сума, вкладена в усі активи, що зараз знаходяться в портфоліо.",
    totalProfitTooltip: "Чистий прибуток від усіх закритих операцій (проданих активів).",
    percentageProfitTooltip: "Відношення загального прибутку до загального капіталу в процентах.",
    currentMarketValue: "ПОТОЧНА РИНКОВА ВАРТІСТЬ",
    currentMarketProfit: "ПОТОЧНИЙ ПРИБУТОК",
    details: "ДЕТАЛЬНА ІНФОРМАЦІЯ",
    updateAllPrices: "ОНОВИТИ ВСІ ЦІНИ"
  },
  en: {
    portfolio: "STEAM INVESTMENTS",
    name: "ITEM NAME",
    count: "COUNT",
    buyPrice: "BUY PRICE",
    game: "GAME",
    boughtDate: "BUY DATE",
    action: "ACTIONS",
    addItem: "ADD ASSET",
    save: "SAVE",
    cancel: "CANCEL",
    sold: "SOLD",
    yes: "YES",
    no: "NO",
    sellPrice: "SELL PRICE",
    sellDate: "SELL DATE",
    editItem: "EDIT ASSET",
    deleteConfirmation: "CONFIRMATION: DELETE ASSET?",
    delete: "DELETE",
    totalInvestment: "TOTAL CAPITAL",
    profit: "PROFIT",
    percentageProfit: "PERCENTAGE PROFIT",
    analytics: "ANALYTICS",
    noData: "DATA UNAVAILABLE...",
    itemAdded: "ASSET ADDED TO PORTFOLIO",
    itemUpdated: "ASSET UPDATED",
    itemDeleted: "ASSET DELETED",
    fetchError: "ARCHIVE CONNECTION ERROR...",
    addInvestment: "ADDING NEW ASSET",
    markAsSold: "CLOSE OPERATION",
    total: "ALL",
    currency: "CURRENCY",
    language: "LANGUAGE",
    priceHistory: "PRICE HISTORY",
    noInvestmentsInCategory: "NO DATA IN THIS CATEGORY.",
    floatValue: "Float Value",
    stickers: "STICKERS",
    selectedItem: "SELECTED ASSET",
    itemDetails: "ASSET DETAILS",
    settings: "SYSTEM SETTINGS",
    totalProfit: "TOTAL PROFIT",
    investmentDistribution: "CAPITAL DISTRIBUTION",
    edit: "EDIT",
    tags: "TAGS",
    tagsPlaceholder: "E.G. 'CASE', 'STICKER', 'WEAPON'",
    floatValuePlaceholder: "E.G. '0.12345'",
    stickersList: "STICKERS (COMMA-SEPARATED)",
    updatePrice: "UPDATE PRICE",
    currentPrice: "CURRENT PRICE",
    marketAnalysis: "MARKET ANALYSIS (AI)",
    marketAnalysisTitle: "MARKET ANALYSIS SIMULATION",
    marketAnalysisGenerating: "GENERATING ANALYSIS...",
    active: "ACTIVE",
    totalInvestmentTooltip: "The sum of money invested in all assets currently in the portfolio.",
    totalProfitTooltip: "Net profit from all closed operations (sold assets).",
    percentageProfitTooltip: "The ratio of total profit to total capital, as a percentage.",
    currentMarketValue: "CURRENT MARKET VALUE",
    currentMarketProfit: "CURRENT PROFIT",
    details: "DETAILS",
    updateAllPrices: "UPDATE ALL PRICES"
  },
};

const BACKEND_URL = 'https://steam-proxy-server-lues.onrender.com';
const PROXY_SERVER_URL = "https://steam-proxy-server-lues.onrender.com";

export default function App() {
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

  const t = LANGUAGES[lang];

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
        const formattedOptions = data.map(item => ({
          label: item.name,
          image: item.icon_url,
          market_hash_name: item.market_hash_name,
        }));
        setItemOptions(formattedOptions);
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
      showSnackbar("Усі ціни оновлено.", 'success');
      getInvestments();
    } catch (error) {
      console.error('Error updating all prices:', error);
      showSnackbar('Помилка при оновленні всіх цін.', 'error');
    } finally {
      setIsUpdatingAllPrices(false);
    }
  };

  const addInvestment = async () => {
    if (!name || count <= 0 || buyPrice <= 0 || !game) {
      showSnackbar("Будь ласка, заповніть усі поля коректно.", "warning");
      return;
    }
    try {
      const url = `${PROXY_SERVER_URL}/current_price?item_name=${encodeURIComponent(name)}&game=${encodeURIComponent(game)}`;
      const response = await fetch(url);
      const data = await response.json();
      const currentPrice = data.price ? data.price : buyPrice;

      const newInvestment = {
        name,
        market_hash_name: autocompleteValue?.market_hash_name || name,
        image: selectedItemDetails?.image,
        count,
        buyPrice,
        buyCurrency,
        game,
        boughtDate,
        sold: false,
        currentPrice,
      };

      const res = await fetch(`${BACKEND_URL}/api/investments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInvestment),
      });

      if (!res.ok) throw new Error('Failed to add investment');
      showSnackbar(t.itemAdded, "success");
      setInvestments(prev => [...prev, { ...newInvestment, id: investments.length + 1 }]);
      setAddDialog(false);
      resetForm();
      getInvestments();

    } catch (error) {
      console.error("Error adding investment:", error);
      showSnackbar("Помилка при додаванні активу", "error");
    }
  };

  const handleEditInvestment = (item) => {
    setItemToEdit(item);
    setName(item.name);
    setCount(item.count);
    setBuyPrice(item.buyPrice);
    setBuyCurrency(item.buyCurrency);
    setGame(item.game);
    setBoughtDate(item.boughtDate);
    setEditDialog(true);
  };

  const saveEditedInvestment = async () => {
    if (!name || count <= 0 || buyPrice <= 0 || !game) {
      showSnackbar("Будь ласка, заповніть усі поля коректно.", "warning");
      return;
    }
    const updatedInvestment = {
      name,
      market_hash_name: itemToEdit.market_hash_name,
      image: itemToEdit.image,
      count,
      buyPrice,
      buyCurrency,
      game,
      boughtDate,
      sold: itemToEdit.sold,
      currentPrice: itemToEdit.currentPrice,
    };
    await updateInvestment(itemToEdit.id, updatedInvestment);
    setEditDialog(false);
    resetForm();
  };

  const handleSellInvestment = (item) => {
    setItemToSell(item);
    setSellPrice(item.currentPrice);
    setSellDate(new Date().toISOString().split('T')[0]);
    setSellDialog(true);
  };

  const confirmSellInvestment = async () => {
    if (sellPrice <= 0) {
      showSnackbar("Ціна продажу має бути більшою за 0.", "warning");
      return;
    }
    const updatedInvestment = {
      sold: true,
      sellPrice: sellPrice,
      sellDate: sellDate,
    };
    await updateInvestment(itemToSell.id, updatedInvestment);
    setSellDialog(false);
    resetForm();
  };

  const resetForm = () => {
    setName("");
    setCount(1);
    setBuyPrice(0);
    setGame(GAMES[1]);
    setBoughtDate(new Date().toISOString().split('T')[0]);
    setAutocompleteValue(null);
    setSelectedItemDetails(null);
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    await deleteInvestment(itemToDelete.id);
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const totalInvestment = investments
    .filter(inv => !inv.sold)
    .reduce((sum, inv) => sum + (inv.buyPrice * inv.count), 0);
  const totalProfit = investments
    .filter(inv => inv.sold)
    .reduce((sum, inv) => sum + ((inv.sellPrice - inv.buyPrice) * inv.count), 0);

  const totalMarketValue = investments
    .filter(inv => !inv.sold)
    .reduce((sum, inv) => sum + (inv.currentPrice * inv.count), 0);

  const totalCurrentProfit = totalMarketValue - totalInvestment;

  const percentageProfit = totalInvestment > 0 ? (totalCurrentProfit / totalInvestment) * 100 : 0;

  const getProfitColor = (profit) => {
    if (profit > 0) return theme.palette.success.main;
    if (profit < 0) return theme.palette.error.main;
    return theme.palette.text.primary;
  };

  const getAnalyticsData = () => {
    const activeInvestments = investments.filter(inv => !inv.sold);
    const profitByGame = activeInvestments.reduce((acc, inv) => {
      acc[inv.game] = (acc[inv.game] || 0) + ((inv.currentPrice - inv.buyPrice) * inv.count);
      return acc;
    }, {});

    const investmentDistribution = activeInvestments.reduce((acc, inv) => {
      acc[inv.game] = (acc[inv.game] || 0) + (inv.buyPrice * inv.count);
      return acc;
    }, {});

    const lineChartData = activeInvestments.map(inv => ({
      name: inv.name,
      buyPrice: inv.buyPrice,
      currentPrice: inv.currentPrice,
    }));

    return { profitByGame, investmentDistribution, lineChartData };
  };

  const { profitByGame, investmentDistribution, lineChartData } = getAnalyticsData();

  const handleMarketAnalysis = async (item) => {
    setItemToAnalyze(item);
    setMarketAnalysisDialog(true);
    setAnalysisLoading(true);
    setAnalysisText("");

    try {
      const prompt = `Give a concise market analysis for the item named "${item.name}" from the game ${item.game}. Mention recent trends, price volatility, and potential future value. The analysis should be in Ukrainian.`;
      const chatHistory = [];
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });

      const payload = { contents: chatHistory };
      const apiKey = "";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

      let response;
      let result;
      let retries = 0;
      const maxRetries = 5;
      const initialDelay = 1000;

      while (retries < maxRetries) {
        try {
          response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

          if (response.status === 429) {
            const delay = initialDelay * Math.pow(2, retries);
            retries++;
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }

          result = await response.json();
          break;
        } catch (error) {
          console.error("API call failed, retrying...", error);
          const delay = initialDelay * Math.pow(2, retries);
          retries++;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }

      if (result && result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const text = result.candidates[0].content.parts[0].text;
        setAnalysisText(text);
      } else {
        setAnalysisText('Вибачте, не вдалося згенерувати аналіз. Спробуйте пізніше.');
      }
    } catch (error) {
      setAnalysisText('Вибачте, сталася помилка під час генерації аналізу.');
    } finally {
      setAnalysisLoading(false);
    }
  };

  const handleDetailsClick = (item) => {
    setItemToDisplayDetails(item);
    setItemDetailsDialogOpen(true);
  };

  const ItemDetailsDialog = ({ open, onClose, item }) => {
    if (!item) return null;
    return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>{t.itemDetails}</DialogTitle>
        <DialogContent dividers>
          <Box display="flex" flexDirection="column" alignItems="center" p={2}>
            {item.image && (
              <Box component="img" src={item.image} alt={item.name} sx={{ width: 120, height: 120, objectFit: 'contain', mb: 2 }} />
            )}
            <Typography variant="h5" color="primary" gutterBottom>{item.name}</Typography>
            <Typography variant="body1" color="text.secondary">
              <strong>{t.game}:</strong> {item.game}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              <strong>{t.count}:</strong> {item.count}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              <strong>{t.buyPrice}:</strong> {item.buyPrice} {CURRENCY_SYMBOLS[item.buyCurrency]}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              <strong>{t.boughtDate}:</strong> {item.boughtDate}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              <strong>{t.currentPrice}:</strong> {item.currentPrice} {CURRENCY_SYMBOLS[item.buyCurrency]}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary" variant="outlined">{t.cancel}</Button>
        </DialogActions>
      </Dialog>
    );
  };

  const totalClosedProfit = investments
    .filter(item => item.sold)
    .reduce((sum, item) => sum + (item.sellPrice - item.buyPrice) * item.count, 0);

  const totalClosedInvestment = investments
    .filter(item => item.sold)
    .reduce((sum, item) => sum + item.buyPrice * item.count, 0);

  const totalClosedPercentage = totalClosedInvestment > 0 ? (totalClosedProfit / totalClosedInvestment) * 100 : 0;

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default,
        py: 4,
        px: 2,
      }}>
        <Container maxWidth="lg">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap">
            <Typography variant="h4" component="h1" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
              {t.portfolio}
            </Typography>
            <Box display="flex" gap={1}>
              <Button
                variant="contained"
                startIcon={<Plus />}
                onClick={() => {
                  setAddDialog(true);
                  resetForm();
                }}
              >
                {t.addItem}
              </Button>
              <IconButton
                onClick={handleSettingsMenuClick}
                color="primary"
                sx={{ borderRadius: 2 }}
              >
                <Settings />
              </IconButton>
              <Menu
                anchorEl={settingsAnchorEl}
                open={settingsMenuOpen}
                onClose={handleSettingsMenuClose}
              >
                <MenuItem onClick={() => { setLang('uk'); handleSettingsMenuClose(); }}>
                  <Typography variant="body2" sx={{ mr: 1 }}>{LANGUAGES.uk.language}</Typography>
                  <Box component="img" src="https://flagcdn.com/ua.svg" alt="Ukrainian flag" width={24} />
                </MenuItem>
                <MenuItem onClick={() => { setLang('en'); handleSettingsMenuClose(); }}>
                  <Typography variant="body2" sx={{ mr: 1 }}>{LANGUAGES.en.language}</Typography>
                  <Box component="img" src="https://flagcdn.com/gb.svg" alt="UK flag" width={24} />
                </MenuItem>
              </Menu>
            </Box>
          </Box>

          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Box mb={3}>
              <Tabs
                value={tabValue}
                onChange={(e, newValue) => setTabValue(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
              >
                {GAMES.map((gameName, index) => (
                  <Tab key={index} label={gameName} />
                ))}
              </Tabs>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <StyledMetricCard bgcolor={theme.palette.background.default}>
                  <Tooltip title={t.totalInvestmentTooltip}>
                    <Box>
                      <Typography variant="h6" color="text.secondary">{t.totalInvestment}</Typography>
                      <Typography variant="h4" sx={{ color: theme.palette.primary.main, mt: 1 }}>
                        {CURRENCY_SYMBOLS[buyCurrency]}{totalInvestment.toFixed(2)}
                      </Typography>
                    </Box>
                  </Tooltip>
                </StyledMetricCard>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StyledMetricCard bgcolor={theme.palette.background.default}>
                  <Tooltip title={t.currentMarketValue}>
                    <Box>
                      <Typography variant="h6" color="text.secondary">{t.currentMarketValue}</Typography>
                      <Typography variant="h4" sx={{ color: getProfitColor(totalCurrentProfit), mt: 1 }}>
                        {CURRENCY_SYMBOLS[buyCurrency]}{totalMarketValue.toFixed(2)}
                      </Typography>
                    </Box>
                  </Tooltip>
                </StyledMetricCard>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StyledMetricCard bgcolor={theme.palette.background.default}>
                  <Tooltip title={t.currentMarketProfit}>
                    <Box>
                      <Typography variant="h6" color="text.secondary">{t.currentMarketProfit}</Typography>
                      <Box display="flex" alignItems="center" justifyContent="center" mt={1}>
                        <Typography variant="h4" sx={{ color: getProfitColor(totalCurrentProfit) }}>
                          {CURRENCY_SYMBOLS[buyCurrency]}{totalCurrentProfit.toFixed(2)}
                        </Typography>
                        <Chip
                          icon={totalCurrentProfit > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                          label={`${percentageProfit.toFixed(2)}%`}
                          sx={{
                            ml: 1,
                            backgroundColor: getProfitColor(totalCurrentProfit),
                            color: 'white',
                            fontWeight: 'bold',
                          }}
                        />
                      </Box>
                    </Box>
                  </Tooltip>
                </StyledMetricCard>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StyledMetricCard bgcolor={theme.palette.background.default}>
                  <Tooltip title={t.totalProfitTooltip}>
                    <Box>
                      <Typography variant="h6" color="text.secondary">{t.totalProfit}</Typography>
                      <Typography variant="h4" sx={{ color: getProfitColor(totalClosedProfit), mt: 1 }}>
                        {CURRENCY_SYMBOLS[buyCurrency]}{totalClosedProfit.toFixed(2)}
                      </Typography>
                      <Typography variant="caption" sx={{ color: getProfitColor(totalClosedProfit) }}>
                        ({totalClosedPercentage.toFixed(2)}%)
                      </Typography>
                    </Box>
                  </Tooltip>
                </StyledMetricCard>
              </Grid>
            </Grid>
          </Paper>

          <Box sx={{
            backgroundColor: theme.palette.background.paper,
            borderRadius: 3,
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            p: 3,
            mb: 4
          }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h5" sx={{ color: theme.palette.primary.main }}>
                {t.active} {t.portfolio}
              </Typography>
              <Button
                variant="outlined"
                startIcon={isUpdatingAllPrices ? <CircularProgress size={20} color="inherit" /> : <Zap />}
                onClick={fetchAndUpdateAllPrices}
                disabled={isUpdatingAllPrices}
              >
                {t.updateAllPrices}
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={3}>
              {investments.filter(inv => !inv.sold && (tabValue === 0 || inv.game === GAMES[tabValue])).length > 0 ? (
                investments.filter(inv => !inv.sold && (tabValue === 0 || inv.game === GAMES[tabValue])).map(item => {
                  const profitLoss = (item.currentPrice - item.buyPrice) * item.count;
                  const profitLossPercentage = ((item.currentPrice - item.buyPrice) / item.buyPrice) * 100;
                  const profitColor = getProfitColor(profitLoss);

                  return (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                      <StyledCard>
                        <CardHeader>
                          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            {item.name}
                          </Typography>
                          <Chip
                            label={item.game}
                            size="small"
                            sx={{
                              backgroundColor: theme.palette.secondary.main,
                              color: 'white',
                            }}
                          />
                        </CardHeader>
                        <CardContent sx={{ p: 1 }}>
                          {item.image && (
                            <Box sx={{
                              width: '100%',
                              height: 120,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mb: 1,
                            }}>
                              <Box component="img" src={item.image} alt={item.name} sx={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                            </Box>
                          )}
                          <Typography variant="body2" color="text.secondary">
                            {t.count}: {item.count}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {t.buyPrice}: {item.buyPrice} {CURRENCY_SYMBOLS[item.buyCurrency]}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {t.currentPrice}: {item.currentPrice} {CURRENCY_SYMBOLS[item.buyCurrency]}
                          </Typography>
                          <Typography variant="body2" sx={{ color: profitColor, fontWeight: 'bold' }}>
                            <Box display="flex" alignItems="center">
                              {profitLoss > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                              <Box component="span" sx={{ ml: 0.5 }}>
                                {profitLoss.toFixed(2)} {CURRENCY_SYMBOLS[item.buyCurrency]} ({profitLossPercentage.toFixed(2)}%)
                              </Box>
                            </Box>
                          </Typography>
                        </CardContent>
                        <CardFooter>
                          <Box display="flex" gap={1}>
                            <Tooltip title={t.updatePrice}>
                              <IconButton size="small" onClick={() => handleCurrentPriceUpdate(item)}><Zap size={18} /></IconButton>
                            </Tooltip>
                            <Tooltip title={t.marketAnalysis}>
                              <IconButton size="small" onClick={() => handleMarketAnalysis(item)}><BarChart size={18} /></IconButton>
                            </Tooltip>
                            <Tooltip title={t.details}>
                              <IconButton size="small" onClick={() => handleDetailsClick(item)}><Eye size={18} /></IconButton>
                            </Tooltip>
                          </Box>
                          <Box>
                            <Tooltip title={t.markAsSold}>
                              <IconButton size="small" color="secondary" onClick={() => handleSellInvestment(item)}><DollarSign size={18} /></IconButton>
                            </Tooltip>
                            <Tooltip title={t.edit}>
                              <IconButton size="small" onClick={() => handleEditInvestment(item)}><Edit size={18} /></IconButton>
                            </Tooltip>
                          </Box>
                        </CardFooter>
                      </StyledCard>
                    </Grid>
                  );
                })
              ) : (
                <Grid item xs={12}>
                  <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
                    <Typography variant="h6" color="text.secondary">
                      {t.noInvestmentsInCategory}
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>

          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" sx={{ color: theme.palette.primary.main, mb: 2 }}>
              {t.analytics}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>{t.investmentDistribution}</Typography>
                  <Box height={300} display="flex" justifyContent="center" alignItems="center">
                    {Object.keys(investmentDistribution).length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={Object.keys(investmentDistribution).map(key => ({ name: key, value: investmentDistribution[key] }))}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            label
                          >
                            {Object.keys(investmentDistribution).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={['#4A148C', '#007BFF', '#FFC107', '#28A745'][index % 4]} />
                            ))}
                          </Pie>
                          <ChartTooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <Typography variant="body1" color="text.secondary">{t.noData}</Typography>
                    )}
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>{t.priceHistory}</Typography>
                  <Box height={300}>
                    {lineChartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={lineChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <ChartTooltip />
                          <Legend />
                          <Line type="monotone" dataKey="buyPrice" stroke="#8884d8" name="Ціна входу" />
                          <Line type="monotone" dataKey="currentPrice" stroke="#82ca9d" name="Поточна ціна" />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                        <Typography variant="body1" color="text.secondary">{t.noData}</Typography>
                      </Box>
                    )}
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Paper>

          {/* Dialogs */}
          <Dialog open={addDialog} onClose={() => setAddDialog(false)} maxWidth="sm" fullWidth>
            <DialogTitle>{t.addInvestment}</DialogTitle>
            <DialogContent>
              <Autocomplete
                options={itemOptions}
                getOptionLabel={(option) => option.label || ""}
                isOptionEqualToValue={(option, value) => option.label === value.label}
                onInputChange={handleItemNameChange}
                onChange={handleAutocompleteChange}
                loading={autocompleteLoading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t.name}
                    variant="outlined"
                    fullWidth
                    margin="dense"
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
              <TextField
                label={t.count}
                type="number"
                fullWidth
                value={count}
                onChange={(e) => setCount(e.target.value)}
                margin="dense"
              />
              <TextField
                label={t.buyPrice}
                type="number"
                fullWidth
                value={buyPrice}
                onChange={(e) => setBuyPrice(e.target.value)}
                margin="dense"
              />
              <FormControl fullWidth margin="dense">
                <InputLabel>{t.currency}</InputLabel>
                <Select value={buyCurrency} label={t.currency} onChange={(e) => setBuyCurrency(e.target.value)}>
                  {CURRENCIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="dense">
                <InputLabel>{t.game}</InputLabel>
                <Select value={game} label={t.game} onChange={(e) => setGame(e.target.value)}>
                  {GAMES.slice(1).map(g => <MenuItem key={g} value={g}>{g}</MenuItem>)}
                </Select>
              </FormControl>
              <TextField
                label={t.boughtDate}
                type="date"
                fullWidth
                value={boughtDate}
                onChange={(e) => setBoughtDate(e.target.value)}
                margin="dense"
                InputLabelProps={{ shrink: true }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setAddDialog(false)} color="secondary">{t.cancel}</Button>
              <Button onClick={addInvestment} color="primary" variant="contained">{t.save}</Button>
            </DialogActions>
          </Dialog>

          <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth>
            <DialogTitle>{t.editItem}</DialogTitle>
            <DialogContent>
              <TextField
                label={t.name}
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                margin="dense"
                disabled
              />
              <TextField
                label={t.count}
                type="number"
                fullWidth
                value={count}
                onChange={(e) => setCount(e.target.value)}
                margin="dense"
              />
              <TextField
                label={t.buyPrice}
                type="number"
                fullWidth
                value={buyPrice}
                onChange={(e) => setBuyPrice(e.target.value)}
                margin="dense"
              />
              <FormControl fullWidth margin="dense">
                <InputLabel>{t.currency}</InputLabel>
                <Select value={buyCurrency} label={t.currency} onChange={(e) => setBuyCurrency(e.target.value)}>
                  {CURRENCIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="dense">
                <InputLabel>{t.game}</InputLabel>
                <Select value={game} label={t.game} onChange={(e) => setGame(e.target.value)}>
                  {GAMES.slice(1).map(g => <MenuItem key={g} value={g}>{g}</MenuItem>)}
                </Select>
              </FormControl>
              <TextField
                label={t.boughtDate}
                type="date"
                fullWidth
                value={boughtDate}
                onChange={(e) => setBoughtDate(e.target.value)}
                margin="dense"
                InputLabelProps={{ shrink: true }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditDialog(false)} color="secondary">{t.cancel}</Button>
              <Button onClick={saveEditedInvestment} color="primary" variant="contained">{t.save}</Button>
            </DialogActions>
          </Dialog>

          <Dialog open={sellDialog} onClose={() => setSellDialog(false)} maxWidth="xs" fullWidth>
            <DialogTitle>{t.markAsSold}</DialogTitle>
            <DialogContent>
              <Typography variant="body1" gutterBottom>{itemToSell?.name}</Typography>
              <TextField
                label={t.sellPrice}
                type="number"
                fullWidth
                value={sellPrice}
                onChange={(e) => setSellPrice(e.target.value)}
                margin="dense"
              />
              <TextField
                label={t.sellDate}
                type="date"
                fullWidth
                value={sellDate}
                onChange={(e) => setSellDate(e.target.value)}
                margin="dense"
                InputLabelProps={{ shrink: true }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSellDialog(false)} color="secondary">{t.cancel}</Button>
              <Button onClick={confirmSellInvestment} color="primary" variant="contained">{t.save}</Button>
            </DialogActions>
          </Dialog>

          <Dialog open={deleteDialogOpen} onClose={handleCancelDelete} maxWidth="xs" fullWidth>
            <DialogTitle>{t.deleteConfirmation}</DialogTitle>
            <DialogContent>
              <Typography>{itemToDelete?.name}</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCancelDelete} color="secondary">{t.cancel}</Button>
              <Button onClick={handleConfirmDelete} color="error" variant="contained">{t.delete}</Button>
            </DialogActions>
          </Dialog>

          <Dialog open={priceHistoryOpen} onClose={() => setPriceHistoryOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>{t.priceHistory}</DialogTitle>
            <DialogContent>
              {priceHistoryLoading ? (
                <Box display="flex" justifyContent="center" py={4}>
                  <CircularProgress />
                </Box>
              ) : (
                <Box height={400}>
                  {priceHistory.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={priceHistory}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <ChartTooltip />
                        <Line type="monotone" dataKey="price" stroke="#8884d8" />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                      <Typography variant="body1" color="text.secondary">{t.noData}</Typography>
                    </Box>
                  )}
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setPriceHistoryOpen(false)} color="secondary">{t.cancel}</Button>
            </DialogActions>
          </Dialog>

          <Dialog open={marketAnalysisDialog} onClose={() => setMarketAnalysisDialog(false)} fullWidth maxWidth="sm">
            <DialogTitle>{t.marketAnalysisTitle}</DialogTitle>
            <DialogContent>
              {analysisLoading ? (
                <Box display="flex" flexDirection="column" alignItems="center" py={4}>
                  <CircularProgress />
                  <Typography sx={{ mt: 2 }}>{t.marketAnalysisGenerating}</Typography>
                </Box>
              ) : (
                <Typography sx={{ whiteSpace: 'pre-wrap' }}>{analysisText}</Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setMarketAnalysisDialog(false)} color="secondary">{t.cancel}</Button>
            </DialogActions>
          </Dialog>
          
          <ItemDetailsDialog open={itemDetailsDialogOpen} onClose={() => setItemDetailsDialogOpen(false)} item={itemToDisplayDetails} />

          <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar}>
            <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
