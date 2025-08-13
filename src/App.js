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

const HW = 'Hello World';

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
  padding: theme.spacing(2),
}));

const StyledMetricCard = styled(Card)(({ theme, bgcolor }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  backgroundColor: bgcolor || theme.palette.background.paper,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
  },
  textAlign: 'center',
  minHeight: 180,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
}));

const CardHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingBottom: theme.spacing(2),
}));

const CardFooter = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingTop: theme.spacing(2),
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
      setInvestments(prev => prev.map(item => (item.id === id ? { ...item, ...data } : item));
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
  
          <Grid container spacing={3} mb={4} justifyContent="center" sx={{ px: { xs: 2, md: 0 } }}>
            <Grid item xs={12} md={3}>
              <Tooltip title={t.totalInvestmentTooltip} arrow>
                <StyledMetricCard>
                  <DollarSign size={48} color={theme.palette.primary.main} sx={{ mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    {t.totalInvestment}
                  </Typography>
                  <Typography variant="h3" fontWeight="bold" color="primary">
                    {totalInvestment.toFixed(2)} {CURRENCY_SYMBOLS[buyCurrency]}
                  </Typography>
                </StyledMetricCard>
              </Tooltip>
            </Grid>
            <Grid item xs={12} md={3}>
              <Tooltip title={t.totalProfitTooltip} arrow>
                <StyledMetricCard bgcolor={profitColor === theme.palette.success.main ? theme.palette.success.light : theme.palette.error.light}>
                  {totalSoldProfit >= 0 ? 
                    <TrendingUp size={48} color={theme.palette.success.main} sx={{ mb: 2 }} /> : 
                    <TrendingDown size={48} color={theme.palette.error.main} sx={{ mb: 2 }} />
                  }
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    {t.totalProfit}
                  </Typography>
                  <Typography variant="h3" fontWeight="bold" sx={{ color: profitColor }}>
                    {totalSoldProfit.toFixed(2)} {CURRENCY_SYMBOLS[buyCurrency]}
                  </Typography>
                </StyledMetricCard>
              </Tooltip>
            </Grid>
            <Grid item xs={12} md={3}>
              <Tooltip title="Сумарна вартість усіх активних предметів за поточною ринковою ціною." arrow>
                <StyledMetricCard>
                  <TrendingUp size={48} color={theme.palette.secondary.main} sx={{ mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    {t.currentMarketValue}
                  </Typography>
                  <Typography variant="h3" fontWeight="bold" color="secondary">
                    {totalMarketValue.toFixed(2)} {CURRENCY_SYMBOLS[buyCurrency]}
                  </Typography>
                </StyledMetricCard>
              </Tooltip>
            </Grid>
            <Grid item xs={12} md={3}>
              <Tooltip title="Різниця між поточною ринковою вартістю та загальним капіталом." arrow>
                <StyledMetricCard bgcolor={currentProfitColor === theme.palette.success.main ? theme.palette.success.light : theme.palette.error.light}>
                  {currentMarketProfit >= 0 ?
                    <TrendingUp size={48} color={theme.palette.success.main} sx={{ mb: 2 }} /> :
                    <TrendingDown size={48} color={theme.palette.error.main} sx={{ mb: 2 }} />
                  }
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    {t.currentMarketProfit}
                  </Typography>
                  <Typography variant="h3" fontWeight="bold" sx={{ color: currentProfitColor }}>
                    {currentMarketProfit.toFixed(2)} {CURRENCY_SYMBOLS[buyCurrency]}
                  </Typography>
                </StyledMetricCard>
              </Tooltip>
            </Grid>
          </Grid>
  
          <Paper sx={{ mb: 4, p: 1, mx: { xs: 2, md: 0 } }}>
            <Tabs 
              value={tabValue} 
              onChange={(e, newValue) => setTabValue(newValue)} 
              aria-label="game tabs" 
              centered
              sx={{
                '& .MuiTabs-indicator': {
                  backgroundColor: theme.palette.primary.main,
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
  
          <Grid container spacing={3} sx={{ px: { xs: 2, md: 0 } }}>
            {filteredInvestments.length === 0 ? (
              <Grid item xs={12}>
                <Box sx={{ p: 4, textAlign: 'center', color: theme.palette.text.secondary }}>
                  <Typography variant="h6">{t.noInvestmentsInCategory}</Typography>
                </Box>
              </Grid>
            ) : (
              filteredInvestments.map((item) => {
                const itemProfit = item.sold ? (item.sellPrice - item.buyPrice) * item.count : ((item.currentPrice || item.buyPrice) - item.buyPrice) * item.count;
                const profitColorForCard = itemProfit >= 0 ? theme.palette.success.main : theme.palette.error.main;
                return (
                  <Grid item xs={12} sm={6} md={4} key={item.id}>
                    <StyledCard onClick={() => handleItemDetailsOpen(item)}>
                      <CardContent>
                        <CardHeader>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name}
                                style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 8 }}
                              />
                            )}
                            <Box sx={{ overflow: 'hidden' }}>
                              <Typography variant="subtitle1" fontWeight="bold" noWrap>
                                {item.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
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
                        <Divider sx={{ my: 2 }} />
                        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
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
                            <Typography variant="body2" color="text.secondary">{item.sold ? t.profit : t.currentMarketProfit}:</Typography>
                            <Typography variant="h6" fontWeight="bold" sx={{ color: profitColorForCard }}>
                              {item.sold ? `${itemProfit.toFixed(2)} ${CURRENCY_SYMBOLS[item.buyCurrency]}` : (item.currentPrice ? `${itemProfit.toFixed(2)} ${CURRENCY_SYMBOLS[item.buyCurrency]}` : '—')}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="body2" color="text.secondary">{t.boughtDate}:</Typography>
                            <Typography variant="h6" fontWeight="bold">{item.boughtDate}</Typography>
                          </Box>
                        </Box>
                      </CardContent>
                      <CardFooter>
                        <Box display="flex" gap={1}>
                          <Tooltip title={t.edit}>
                            <IconButton color="secondary" onClick={(e) => { e.stopPropagation(); handleEdit(item); }} size="small">
                              <Edit size={18} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t.markAsSold}>
                            <IconButton 
                              color="success" 
                              onClick={(e) => { e.stopPropagation(); setItemToSell(item); setSellPrice(item.buyPrice); setSellDialog(true); }} 
                              disabled={item.sold}
                              size="small"
                            >
                              <TrendingUp size={18} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t.delete}>
                            <IconButton color="error" onClick={(e) => { e.stopPropagation(); confirmDelete(item); }} size="small">
                              <Delete size={18} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t.priceHistory}>
                            <IconButton color="primary" onClick={(e) => { e.stopPropagation(); handlePriceHistory(item); }} size="small">
                              <History size={18} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t.updatePrice}>
                            <IconButton color="secondary" onClick={(e) => { e.stopPropagation(); handleCurrentPriceUpdate(item); }} size="small">
                              <Zap size={18} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t.marketAnalysis}>
                            <IconButton color="primary" onClick={(e) => { e.stopPropagation(); handleMarketAnalysis(item); }} size="small">
                              <BarChart size={18} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </CardFooter>
                    </StyledCard>
                  </Grid>
                );
              })
            )}
          </Grid>
  
          <Tooltip title={t.addItem} arrow>
            <Fab
              color="primary"
              aria-label="add"
              sx={{ 
                position: 'fixed', 
                bottom: 32, 
                right: 32,
                width: 64,
                height: 64,
                boxShadow: '0 8px 20px rgba(74, 20, 140, 0.3)',
                '&:hover': {
                  transform: 'scale(1.1) rotate(90deg)',
                  boxShadow: '0 12px 24px rgba(74, 20, 140, 0.4)',
                },
                transition: 'all 0.3s ease',
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              }}
              onClick={() => setAddDialog(true)}
            >
              <Plus size={32} />
            </Fab>
          </Tooltip>
  
          <Dialog
            open={addDialog}
            onClose={() => setAddDialog(false)}
            PaperProps={{ style: { maxWidth: 'md', width: '90%', margin: 16 } }}
          >
            <DialogTitle>
              <Typography variant="h6" fontWeight="bold" color="primary">{t.addInvestment}</Typography>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={selectedItemDetails ? 6 : 12}>
                  <Autocomplete
                    options={itemOptions}
                    getOptionLabel={(option) => option.label || ""}
                    value={autocompleteValue}
                    onInputChange={handleItemNameChange}
                    onChange={handleAutocompleteChange}
                    loading={autocompleteLoading}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={t.name}
                        variant="outlined"
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
                      <Box component="li" {...props} sx={{ '& > img': { mr: 2, flexShrink: 0 } }}>
                        {option.image && (
                          <img loading="lazy" width="30" src={option.image} alt={option.label} style={{borderRadius: 4}} />
                        )}
                        {option.label}
                      </Box>
                    )}
                  />
                  <Box mt={2}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField 
                          label={t.count} 
                          type="number" 
                          value={count} 
                          onChange={(e) => setCount(e.target.value)} 
                          fullWidth 
                          required 
                          InputProps={{ inputProps: { min: 1 } }} 
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth required>
                          <InputLabel>{t.game}</InputLabel>
                          <Select 
                            value={game} 
                            label={t.game} 
                            onChange={(e) => setGame(e.target.value)}
                            sx={{ borderRadius: 8 }}
                          >
                            {GAMES.slice(1).map((gameName, index) => (
                              <MenuItem key={index} value={gameName}>{gameName}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField 
                          label={t.buyPrice} 
                          type="number" 
                          value={buyPrice} 
                          onChange={(e) => setBuyPrice(e.target.value)} 
                          fullWidth 
                          required 
                          InputProps={{ inputProps: { min: 0 } }} 
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth required>
                          <InputLabel>{t.currency}</InputLabel>
                          <Select 
                            value={buyCurrency} 
                            label={t.currency} 
                            onChange={(e) => setBuyCurrency(e.target.value)}
                            sx={{ borderRadius: 8 }}
                          >
                            {CURRENCIES.map((currency, index) => (
                              <MenuItem key={index} value={currency}>{CURRENCY_SYMBOLS[currency]}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <TextField 
                          label={t.boughtDate} 
                          type="date" 
                          value={boughtDate} 
                          onChange={(e) => setBoughtDate(e.target.value)} 
                          fullWidth 
                          required 
                          InputLabelProps={{ shrink: true }} 
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
                {selectedItemDetails && (
                  <Grid item xs={12} md={6}>
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      p: 3, 
                      background: '#F1F3F5', 
                      borderRadius: 8, 
                      height: '100%',
                      gap: 2
                    }}>
                      <Typography variant="h6" color="secondary">{t.selectedItem}</Typography>
                      <img 
                        src={selectedItemDetails.image} 
                        alt={selectedItemDetails.label} 
                        style={{ 
                          width: 'auto', 
                          maxHeight: '150px', 
                          objectFit: 'contain', 
                          borderRadius: 8 
                        }} 
                      />
                      <Box textAlign="center">
                        <Typography variant="h6" fontWeight="bold">{selectedItemDetails.label}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Button 
                onClick={() => setAddDialog(false)} 
                color="secondary" 
                variant="outlined"
                sx={{ borderRadius: 8 }}
              >
                {t.cancel}
              </Button>
              <Button 
                onClick={addItem} 
                color="primary" 
                variant="contained" 
                endIcon={<ArrowUp />}
                sx={{ borderRadius: 8 }}
              >
                {t.save}
              </Button>
            </DialogActions>
          </Dialog>
  
          <Dialog open={editDialog} onClose={() => setEditDialog(false)} PaperProps={{ style: { maxWidth: 'md', width: '90%' } }}>
            <DialogTitle>
              <Typography variant="h6" fontWeight="bold" color="primary">{t.editItem}</Typography>
            </DialogTitle>
            <DialogContent dividers sx={{ p: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    label={t.name} 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    fullWidth 
                    required 
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    label={t.count} 
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
                    label={t.buyPrice} 
                    type="number" 
                    value={buyPrice} 
                    onChange={(e) => setBuyPrice(e.target.value)} 
                    fullWidth 
                    required 
                    InputProps={{ inputProps: { min: 0 } }} 
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>{t.game}</InputLabel>
                    <Select 
                      value={game} 
                      label={t.game} 
                      onChange={(e) => setGame(e.target.value)}
                      sx={{ borderRadius: 8 }}
                    >
                      {GAMES.slice(1).map((gameName, index) => (
                        <MenuItem key={index} value={gameName}>{gameName}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField 
                    label={t.boughtDate} 
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
            <DialogActions sx={{ p: 3 }}>
              <Button 
                onClick={() => setEditDialog(false)} 
                color="secondary" 
                variant="outlined"
                sx={{ borderRadius: 8 }}
              >
                {t.cancel}
              </Button>
              <Button 
                onClick={saveEditedItem} 
                color="primary" 
                variant="contained"
                sx={{ borderRadius: 8 }}
              >
                {t.save}
              </Button>
            </DialogActions>
          </Dialog>
  
          <Dialog open={sellDialog} onClose={() => setSellDialog(false)} PaperProps={{ style: { borderRadius: 16 } }}>
            <DialogTitle>
              <Typography variant="h6" fontWeight="bold" color="primary">{t.markAsSold}</Typography>
            </DialogTitle>
            <DialogContent dividers>
              <TextField 
                autoFocus 
                margin="dense" 
                label={t.sellPrice} 
                type="number" 
                fullWidth 
                value={sellPrice} 
                onChange={(e) => setSellPrice(e.target.value)} 
                InputProps={{ inputProps: { min: 0 } }} 
                sx={{ mb: 2 }}
              />
              <TextField 
                margin="dense" 
                label={t.sellDate} 
                type="date" 
                fullWidth 
                value={sellDate} 
                onChange={(e) => setSellDate(e.target.value)} 
                InputLabelProps={{ shrink: true }} 
              />
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button 
                onClick={() => setSellDialog(false)} 
                color="secondary" 
                variant="outlined"
                sx={{ borderRadius: 8 }}
              >
                {t.cancel}
              </Button>
              <Button 
                onClick={markAsSold} 
                color="primary" 
                variant="contained"
                sx={{ borderRadius: 8 }}
              >
                {t.save}
              </Button>
            </DialogActions>
          </Dialog>
  
          <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} PaperProps={{ style: { borderRadius: 16 } }}>
            <DialogTitle>{t.deleteConfirmation}</DialogTitle>
            <DialogContent>
              <Typography>{t.deleteConfirmation}</Typography>
            </DialogContent>
            <DialogActions>
              <Button 
                onClick={() => setDeleteDialogOpen(false)} 
                color="secondary"
                sx={{ borderRadius: 8 }}
              >
                {t.no}
              </Button>
              <Button 
                onClick={handleDelete} 
                color="error"
                sx={{ borderRadius: 8 }}
              >
                {t.yes}
              </Button>
            </DialogActions>
          </Dialog>
  
          <Dialog open={analyticsOpen} onClose={() => setAnalyticsOpen(false)} maxWidth="md" fullWidth PaperProps={{ style: { borderRadius: 16 } }}>
            <DialogTitle>
              <Typography variant="h6" fontWeight="bold" color="primary">{t.analytics}</Typography>
            </DialogTitle>
            <DialogContent dividers>
              <Typography variant="h6" mb={2} color="secondary">{t.totalProfit} ({CURRENCY_SYMBOLS[buyCurrency]})</Typography>
              {cumulativeProfit.length === 0 ? (
                <Typography variant="body1" align="center" color="text.secondary">{t.noData}</Typography>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={cumulativeProfit} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                    <XAxis dataKey="date" stroke="#666" />
                    <YAxis stroke="#666" />
                    <ChartTooltip contentStyle={{ backgroundColor: '#F8F9FA', border: '1px solid #ccc', borderRadius: 8 }} />
                    <Legend />
                    <Line type="monotone" dataKey="profit" stroke={theme.palette.primary.main} activeDot={{ r: 8 }} name={t.profit} />
                  </LineChart>
                </ResponsiveContainer>
              )}
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" mb={2} color="secondary">{t.investmentDistribution}</Typography>
              {investmentDistributionData.length === 0 ? (
                <Typography variant="body1" align="center" color="text.secondary">{t.noData}</Typography>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={investmentDistributionData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill={theme.palette.primary.main} label>
                      {investmentDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip contentStyle={{ backgroundColor: '#F8F9FA', border: '1px solid #ccc', borderRadius: 8 }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </DialogContent>
            <DialogActions>
              <Button 
                onClick={() => setAnalyticsOpen(false)} 
                color="secondary" 
                variant="outlined"
                sx={{ borderRadius: 8 }}
              >
                {t.cancel}
              </Button>
            </DialogActions>
          </Dialog>
  
          <Dialog open={priceHistoryOpen} onClose={() => setPriceHistoryOpen(false)} maxWidth="md" fullWidth PaperProps={{ style: { borderRadius: 16 } }}>
            <DialogTitle>
              <Typography variant="h6" fontWeight="bold" color="primary">{t.priceHistory}</Typography>
            </DialogTitle>
            <DialogContent dividers>
              {priceHistoryLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : priceHistory.length === 0 ? (
                <Typography variant="body1" align="center" color="text.secondary">{t.noData}</Typography>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={priceHistory} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                    <XAxis dataKey="date" stroke="#666" />
                    <YAxis stroke="#666" />
                    <ChartTooltip contentStyle={{ backgroundColor: '#F8F9FA', border: '1px solid #ccc', borderRadius: 8 }} />
                    <Legend />
                    <Line type="monotone" dataKey="price" stroke={theme.palette.secondary.main} activeDot={{ r: 8 }} name="Ціна" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </DialogContent>
            <DialogActions>
              <Button 
                onClick={() => setPriceHistoryOpen(false)} 
                color="secondary" 
                variant="outlined"
                sx={{ borderRadius: 8 }}
              >
                {t.cancel}
              </Button>
            </DialogActions>
          </Dialog>
  
          <Dialog open={marketAnalysisDialog} onClose={() => setMarketAnalysisDialog(false)} maxWidth="sm" fullWidth PaperProps={{ style: { borderRadius: 16 } }}>
            <DialogTitle>
              <Typography variant="h6" fontWeight="bold" color="primary">{t.marketAnalysisTitle}</Typography>
            </DialogTitle>
            <DialogContent dividers>
              {analysisLoading ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
                  <CircularProgress color="primary" />
                  <Typography variant="body1" mt={2} color="secondary">{t.marketAnalysisGenerating}</Typography>
                </Box>
              ) : (
                <Box>
                  <Typography variant="h6" mb={1} color="secondary">{itemToAnalyze?.name}</Typography>
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