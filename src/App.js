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
        body: JSON.stringify({ itemName: item.name, game: item.game }),
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
      };

      const response = await fetch(`${BACKEND_URL}/api/investments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });

      if (!response.ok) {
        throw new Error('Failed to add new investment');
      }
      const addedItem = await response.json();
      setInvestments(prev => [...prev, addedItem]);
      showSnackbar(t.itemAdded, 'success');
      resetForm();
      setAddDialog(false);
    } catch (error) {
      console.error("Error adding investment:", error);
      showSnackbar("Помилка при додаванні активу", "error");
    }
  };

  const handleEditItem = (item) => {
    setItemToEdit(item);
    setName(item.name);
    setCount(item.count);
    setBuyPrice(item.buyPrice);
    setGame(item.game);
    setBoughtDate(item.boughtDate);
    setAutocompleteValue({ label: item.name, image: item.image, market_hash_name: item.market_hash_name });
    setEditDialog(true);
  };

  const editItem = async () => {
    if (!itemToEdit || !name || count <= 0 || buyPrice <= 0 || !boughtDate) {
      showSnackbar("СИСТЕМНА ПОМИЛКА: ВВЕДІТЬ ПОВНІ ДАНІ", "error");
      return;
    }

    try {
      const updatedItem = {
        ...itemToEdit,
        name,
        count: Number(count),
        buyPrice: Number(buyPrice),
        game,
        boughtDate,
        image: selectedItemDetails?.image || itemToEdit.image,
        market_hash_name: selectedItemDetails?.market_hash_name || itemToEdit.market_hash_name
      };

      await updateInvestment(itemToEdit.id, updatedItem);
      resetForm();
      setEditDialog(false);
    } catch (error) {
      console.error("Error editing investment:", error);
      showSnackbar("Помилка при редагуванні активу", "error");
    }
  };

  const handleSellItem = (item) => {
    setItemToSell(item);
    setSellPrice(0);
    setSellDate(new Date().toISOString().split('T')[0]);
    setSellDialog(true);
  };

  const sellItem = async () => {
    if (!itemToSell || sellPrice <= 0 || !sellDate) {
      showSnackbar("СИСТЕМНА ПОМИЛКА: ВВЕДІТЬ ПОВНІ ДАНІ", "error");
      return;
    }
    const sellItemData = {
      ...itemToSell,
      sold: true,
      sellPrice: Number(sellPrice),
      sellDate,
      profit: Number(sellPrice) * Number(itemToSell.count) - Number(itemToSell.buyPrice) * Number(itemToSell.count)
    };
    await updateInvestment(itemToSell.id, sellItemData);
    setSellDialog(false);
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const resetForm = () => {
    setName("");
    setCount(1);
    setBuyPrice(0);
    setBoughtDate(new Date().toISOString().split('T')[0]);
    setAutocompleteValue(null);
    setSelectedItemDetails(null);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const filteredInvestments = tabValue === 0
    ? investments
    : investments.filter(item => item.game === GAMES[tabValue]);

  const totalInvestment = filteredInvestments
    .filter(item => !item.sold)
    .reduce((sum, item) => sum + item.buyPrice * item.count, 0);

  const totalProfit = filteredInvestments
    .filter(item => item.sold)
    .reduce((sum, item) => sum + item.profit, 0);

  const totalCurrentMarketValue = filteredInvestments
    .filter(item => !item.sold)
    .reduce((sum, item) => sum + item.currentPrice * item.count, 0);
  
  const totalCurrentProfit = totalCurrentMarketValue - totalInvestment;

  const percentageProfit = totalInvestment > 0 ? (totalProfit / totalInvestment) * 100 : 0;
  
  const pieChartData = Object.entries(
    filteredInvestments.filter(item => !item.sold).reduce((acc, item) => {
      acc[item.game] = (acc[item.game] || 0) + item.buyPrice * item.count;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const PieChartColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF'];

  const handleOpenItemDetails = (item) => {
    setItemToDisplayDetails(item);
    setItemDetailsDialogOpen(true);
  };

  const renderTooltipIcon = (iconName) => {
    const icons = {
      TrendingUp: <TrendingUp size={20} />,
      TrendingDown: <TrendingDown size={20} />,
      Check: <Check size={20} />,
      Delete: <Delete size={20} />,
      Eye: <Eye size={20} />,
      Edit: <Edit size={20} />,
      BarChart: <BarChart size={20} />,
      DollarSign: <DollarSign size={20} />,
    };
    return icons[iconName] || null;
  };
  
  // Компонент для відображення деталей активу
  const ItemDetailsDialog = ({ open, onClose, item }) => {
    if (!item) return null;
  
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>{t.itemDetails}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} md={5} display="flex" alignItems="center" justifyContent="center">
              <Box 
                component="img" 
                src={item.image} 
                alt={item.name} 
                sx={{ 
                  width: '100%', 
                  height: 'auto', 
                  maxWidth: '300px', 
                  borderRadius: 2, 
                  boxShadow: 3 
                }} 
              />
            </Grid>
            <Grid item xs={12} md={7}>
              <Box>
                <Typography variant="h5" color="primary" gutterBottom>{item.name}</Typography>
                <Divider sx={{ my: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" color="text.secondary">
                      {t.game}: <Chip label={item.game} size="small" color="primary" />
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" color="text.secondary">
                      {t.buyPrice}: <Chip label={`${item.buyPrice} ${CURRENCY_SYMBOLS[item.buyCurrency]}`} size="small" />
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" color="text.secondary">
                      {t.count}: <Chip label={item.count} size="small" />
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" color="text.secondary">
                      {t.boughtDate}: <Chip label={item.boughtDate} size="small" />
                    </Typography>
                  </Grid>
                  {item.sold && (
                    <>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1" color="text.secondary">
                          {t.sellPrice}: <Chip label={`${item.sellPrice} ${CURRENCY_SYMBOLS[item.buyCurrency]}`} size="small" />
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1" color="text.secondary">
                          {t.sellDate}: <Chip label={item.sellDate} size="small" />
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle1" color="text.secondary">
                          {t.profit}: <Chip label={`${item.profit.toFixed(2)} ${CURRENCY_SYMBOLS[item.buyCurrency]}`} size="small" color={item.profit > 0 ? 'success' : 'error'} />
                        </Typography>
                      </Grid>
                    </>
                  )}
                  {!item.sold && item.currentPrice > 0 && (
                    <>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1" color="text.secondary">
                          {t.currentMarketValue}: <Chip label={`${(item.currentPrice * item.count).toFixed(2)} ${CURRENCY_SYMBOLS[item.buyCurrency]}`} size="small" />
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1" color="text.secondary">
                          {t.currentMarketProfit}: <Chip label={`${(item.currentPrice * item.count - item.buyPrice * item.count).toFixed(2)} ${CURRENCY_SYMBOLS[item.buyCurrency]}`} size="small" color={(item.currentPrice * item.count - item.buyPrice * item.count) > 0 ? 'success' : 'error'} />
                        </Typography>
                      </Grid>
                    </>
                  )}
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary" variant="outlined" sx={{ borderRadius: 8 }}>
            {t.cancel}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };


  return (
    <ThemeProvider theme={theme}>
      <Box sx={{
        minHeight: '100vh',
        backgroundColor: 'background.default',
        py: 4,
        px: 2
      }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" color="primary">
              {t.portfolio}
            </Typography>
            <Box>
              <Fab
                color="primary"
                aria-label="add"
                onClick={() => setAddDialog(true)}
                sx={{
                  mr: 2,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                  },
                }}
              >
                <Plus />
              </Fab>
              <Fab
                color="secondary"
                aria-label="settings"
                onClick={handleSettingsMenuClick}
                sx={{
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                  },
                }}
              >
                <MenuIcon />
              </Fab>
              <Menu
                anchorEl={settingsAnchorEl}
                open={settingsMenuOpen}
                onClose={handleSettingsMenuClose}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem onClick={() => { setAnalyticsOpen(true); handleSettingsMenuClose(); }}>
                  <BarChart size={20} style={{ marginRight: 8 }} /> {t.analytics}
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => { setLang('uk'); handleSettingsMenuClose(); }}>
                  <Globe size={20} style={{ marginRight: 8 }} /> {LANGUAGES.uk.language}
                </MenuItem>
                <MenuItem onClick={() => { setLang('en'); handleSettingsMenuClose(); }}>
                  <Globe size={20} style={{ marginRight: 8 }} /> {LANGUAGES.en.language}
                </MenuItem>
              </Menu>
            </Box>
          </Box>

          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              centered
              variant="fullWidth"
              sx={{ mb: 3 }}
            >
              {GAMES.map((game, index) => (
                <Tab key={index} label={game} />
              ))}
            </Tabs>

            <Grid container spacing={3} alignItems="stretch">
              <Grid item xs={12} sm={6} md={3}>
                <StyledMetricCard>
                  <Tooltip title={t.totalInvestmentTooltip}>
                    <Typography variant="h6" color="text.secondary">{t.totalInvestment}</Typography>
                  </Tooltip>
                  <Typography variant="h5" color="primary" sx={{ my: 1, fontWeight: 700 }}>
                    {totalInvestment.toFixed(2)} {CURRENCY_SYMBOLS[buyCurrency]}
                  </Typography>
                </StyledMetricCard>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StyledMetricCard>
                  <Tooltip title={t.totalProfitTooltip}>
                    <Typography variant="h6" color="text.secondary">{t.totalProfit}</Typography>
                  </Tooltip>
                  <Typography variant="h5" sx={{ my: 1, fontWeight: 700 }} color={totalProfit >= 0 ? 'success.main' : 'error.main'}>
                    {totalProfit.toFixed(2)} {CURRENCY_SYMBOLS[buyCurrency]}
                  </Typography>
                </StyledMetricCard>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StyledMetricCard>
                  <Tooltip title={t.percentageProfitTooltip}>
                    <Typography variant="h6" color="text.secondary">{t.percentageProfit}</Typography>
                  </Tooltip>
                  <Typography variant="h5" sx={{ my: 1, fontWeight: 700 }} color={percentageProfit >= 0 ? 'success.main' : 'error.main'}>
                    {percentageProfit.toFixed(2)}%
                  </Typography>
                </StyledMetricCard>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StyledMetricCard>
                  <Tooltip title={t.currentMarketProfit}>
                    <Typography variant="h6" color="text.secondary">{t.currentMarketProfit}</Typography>
                  </Tooltip>
                  <Typography variant="h5" sx={{ my: 1, fontWeight: 700 }} color={totalCurrentProfit >= 0 ? 'success.main' : 'error.main'}>
                    {totalCurrentProfit.toFixed(2)} {CURRENCY_SYMBOLS[buyCurrency]}
                  </Typography>
                </StyledMetricCard>
              </Grid>
            </Grid>
          </Paper>

          <Grid container spacing={3} alignItems="stretch">
            {filteredInvestments.length === 0 ? (
              <Grid item xs={12}>
                <Typography variant="h6" color="text.secondary" align="center" sx={{ mt: 4 }}>
                  {t.noInvestmentsInCategory}
                </Typography>
              </Grid>
            ) : (
              filteredInvestments.map((item, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <StyledCard elevation={3}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box
                          component="img"
                          src={item.image}
                          alt={item.name}
                          sx={{
                            width: 64,
                            height: 64,
                            borderRadius: 1,
                            mr: 2,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          }}
                        />
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" component="div" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                            {item.name}
                          </Typography>
                          <Chip
                            label={item.game}
                            size="small"
                            color="primary"
                            sx={{ mt: 0.5, bgcolor: theme.palette.primary.main, color: '#fff' }}
                          />
                        </Box>
                      </Box>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          {t.buyPrice}: <Typography component="span" sx={{ fontWeight: 'bold' }}>{item.buyPrice} {CURRENCY_SYMBOLS[item.buyCurrency]}</Typography>
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {t.count}: <Typography component="span" sx={{ fontWeight: 'bold' }}>{item.count}</Typography>
                        </Typography>
                        {!item.sold && item.currentPrice > 0 && (
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            {t.currentPrice}: <Typography component="span" sx={{ fontWeight: 'bold' }}>{item.currentPrice.toFixed(2)} {CURRENCY_SYMBOLS[item.buyCurrency]}</Typography>
                            <Chip
                              label={`${(item.currentPrice - item.buyPrice).toFixed(2)} ${CURRENCY_SYMBOLS[item.buyCurrency]} (${(((item.currentPrice - item.buyPrice) / item.buyPrice) * 100).toFixed(2)}%)`}
                              color={(item.currentPrice - item.buyPrice) > 0 ? 'success' : 'error'}
                              size="small"
                              sx={{ ml: 1 }}
                            />
                          </Typography>
                        )}
                        {item.sold && (
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            {t.sellPrice}: <Typography component="span" sx={{ fontWeight: 'bold' }}>{item.sellPrice.toFixed(2)} {CURRENCY_SYMBOLS[item.buyCurrency]}</Typography>
                            <Chip
                              label={`${item.profit.toFixed(2)} ${CURRENCY_SYMBOLS[item.buyCurrency]}`}
                              color={item.profit > 0 ? 'success' : 'error'}
                              size="small"
                              sx={{ ml: 1 }}
                            />
                          </Typography>
                        )}
                      </Box>
                    </CardContent>
                    <CardFooter>
                      <Box>
                        <Tooltip title={t.details}>
                          <IconButton onClick={() => handleOpenItemDetails(item)}>
                            <Eye size={20} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t.edit}>
                          <IconButton onClick={() => handleEditItem(item)}>
                            <Edit size={20} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t.delete}>
                          <IconButton onClick={() => setDeleteDialogOpen(true)}>
                            <Delete size={20} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                      <Box>
                        <Tooltip title={t.marketAnalysis}>
                          <IconButton onClick={() => handleMarketAnalysis(item)}>
                            <BarChart size={20} />
                          </IconButton>
                        </Tooltip>
                        {!item.sold && (
                          <>
                            <Tooltip title={t.updatePrice}>
                              <IconButton onClick={() => handleCurrentPriceUpdate(item)} disabled={item.sold}>
                                <ArrowUp size={20} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={t.markAsSold}>
                              <IconButton onClick={() => handleSellItem(item)} disabled={item.sold}>
                                <DollarSign size={20} />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </Box>
                    </CardFooter>
                  </StyledCard>
                </Grid>
              ))
            )}
          </Grid>

          {/* Dialogs and Snackbars - без змін */}
          <Dialog open={addDialog} onClose={() => setAddDialog(false)}>
            <DialogTitle>{t.addInvestment}</DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Autocomplete
                    options={itemOptions}
                    getOptionLabel={(option) => option.label || ''}
                    isOptionEqualToValue={(option, value) => option.label === value.label}
                    inputValue={name}
                    onInputChange={handleItemNameChange}
                    onChange={handleAutocompleteChange}
                    value={autocompleteValue}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={t.name}
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
                        <img
                          loading="lazy"
                          width="20"
                          src={option.image}
                          alt=""
                        />
                        {option.label}
                      </Box>
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label={t.count}
                    type="number"
                    fullWidth
                    margin="dense"
                    value={count}
                    onChange={(e) => setCount(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label={t.buyPrice}
                    type="number"
                    fullWidth
                    margin="dense"
                    value={buyPrice}
                    onChange={(e) => setBuyPrice(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="dense">
                    <InputLabel id="buy-currency-label">{t.currency}</InputLabel>
                    <Select
                      labelId="buy-currency-label"
                      value={buyCurrency}
                      onChange={(e) => setBuyCurrency(e.target.value)}
                    >
                      {CURRENCIES.map(currency => (
                        <MenuItem key={currency} value={currency}>{currency}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="dense">
                    <InputLabel id="game-label">{t.game}</InputLabel>
                    <Select
                      labelId="game-label"
                      value={game}
                      onChange={(e) => setGame(e.target.value)}
                    >
                      {GAMES.slice(1).map(gameName => (
                        <MenuItem key={gameName} value={gameName}>{gameName}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label={t.boughtDate}
                    type="date"
                    fullWidth
                    margin="dense"
                    value={boughtDate}
                    onChange={(e) => setBoughtDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setAddDialog(false)} color="secondary">{t.cancel}</Button>
              <Button onClick={addItem} color="primary" variant="contained">{t.save}</Button>
            </DialogActions>
          </Dialog>

          <Dialog open={editDialog} onClose={() => setEditDialog(false)}>
            <DialogTitle>{t.editItem}</DialogTitle>
            <DialogContent dividers>
              {itemToEdit && (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Autocomplete
                      options={itemOptions}
                      getOptionLabel={(option) => option.label || ''}
                      isOptionEqualToValue={(option, value) => option.label === value.label}
                      inputValue={name}
                      onInputChange={handleItemNameChange}
                      onChange={handleAutocompleteChange}
                      value={autocompleteValue}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={t.name}
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
                          <img
                            loading="lazy"
                            width="20"
                            src={option.image}
                            alt=""
                          />
                          {option.label}
                        </Box>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label={t.count}
                      type="number"
                      fullWidth
                      margin="dense"
                      value={count}
                      onChange={(e) => setCount(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label={t.buyPrice}
                      type="number"
                      fullWidth
                      margin="dense"
                      value={buyPrice}
                      onChange={(e) => setBuyPrice(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth margin="dense">
                      <InputLabel id="game-label">{t.game}</InputLabel>
                      <Select
                        labelId="game-label"
                        value={game}
                        onChange={(e) => setGame(e.target.value)}
                      >
                        {GAMES.slice(1).map(gameName => (
                          <MenuItem key={gameName} value={gameName}>{gameName}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label={t.boughtDate}
                      type="date"
                      fullWidth
                      margin="dense"
                      value={boughtDate}
                      onChange={(e) => setBoughtDate(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                </Grid>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditDialog(false)} color="secondary">{t.cancel}</Button>
              <Button onClick={editItem} color="primary" variant="contained">{t.save}</Button>
            </DialogActions>
          </Dialog>

          <Dialog open={sellDialog} onClose={() => setSellDialog(false)}>
            <DialogTitle>{t.markAsSold}</DialogTitle>
            <DialogContent dividers>
              {itemToSell && (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">{t.selectedItem}: {itemToSell.name}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label={t.sellPrice}
                      type="number"
                      fullWidth
                      margin="dense"
                      value={sellPrice}
                      onChange={(e) => setSellPrice(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label={t.sellDate}
                      type="date"
                      fullWidth
                      margin="dense"
                      value={sellDate}
                      onChange={(e) => setSellDate(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                </Grid>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSellDialog(false)} color="secondary">{t.cancel}</Button>
              <Button onClick={sellItem} color="primary" variant="contained">{t.save}</Button>
            </DialogActions>
          </Dialog>

          <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
            <DialogTitle>{t.deleteConfirmation}</DialogTitle>
            <DialogContent>
              <Typography>{t.deleteConfirmation}</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteDialogOpen(false)} color="secondary">{t.no}</Button>
              <Button onClick={() => { deleteInvestment(itemToDelete.id); setDeleteDialogOpen(false); }} color="error" variant="contained">{t.yes}</Button>
            </DialogActions>
          </Dialog>

          <Dialog open={analyticsOpen} onClose={() => setAnalyticsOpen(false)} maxWidth="md" fullWidth>
            <DialogTitle>{t.analytics}</DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, height: '100%' }}>
                    <Typography variant="h6" gutterBottom>{t.investmentDistribution}</Typography>
                    <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {pieChartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={pieChartData}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label
                            >
                              {pieChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={PieChartColors[index % PieChartColors.length]} />
                              ))}
                            </Pie>
                            <ChartTooltip formatter={(value) => `${value.toFixed(2)} ${CURRENCY_SYMBOLS[buyCurrency]}`} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <Typography color="text.secondary">{t.noData}</Typography>
                      )}
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" gutterBottom>{t.priceHistory}</Typography>
                    <Box sx={{ flexGrow: 1, height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {priceHistory.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={priceHistory}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis domain={['auto', 'auto']} />
                            <ChartTooltip />
                            <Legend />
                            <Line type="monotone" dataKey="price" stroke="#4A148C" activeDot={{ r: 8 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <Typography color="text.secondary">{t.noData}</Typography>
                      )}
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setAnalyticsOpen(false)} color="secondary" variant="outlined" sx={{ borderRadius: 8 }}>
                {t.cancel}
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog open={marketAnalysisDialog} onClose={() => setMarketAnalysisDialog(false)} maxWidth="sm" fullWidth>
            <DialogTitle>{t.marketAnalysisTitle}</DialogTitle>
            <DialogContent dividers>
              {analysisLoading ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
                  <CircularProgress color="primary" sx={{ mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">{t.marketAnalysisGenerating}</Typography>
                </Box>
              ) : (
                <Box>
                  <Typography variant="h6" color="secondary">{itemToAnalyze?.name}</Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', color: 'text.secondary' }}>
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

