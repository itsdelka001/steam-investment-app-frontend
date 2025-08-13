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
  ArrowDown, Menu as MenuIcon
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip as ChartTooltip, ResponsiveContainer, CartesianGrid, Legend, PieChart, Pie,
  Cell
} from 'recharts';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { v4 as uuidv4 } from 'uuid';

// Оголошення теми Material-UI та стилізованих компонентів
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
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
          transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
          '&:hover': {
            boxShadow: '0 8px 15px rgba(0,0,0,0.15)',
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
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
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
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          background: '#FFFFFF',
          transition: 'box-shadow 0.3s, transform 0.3s',
          '&:hover': {
            boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
            transform: 'translateY(-4px)',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          background: '#F8F9FA',
          boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
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
            color: '#212529',
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
        },
      },
    },
  },
});

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(2),
}));

const StyledMetricCard = styled(Card)(({ theme, color, bgcolor }) => ({
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3),
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
  backgroundColor: bgcolor || theme.palette.background.paper,
  color: color || theme.palette.text.primary,
}));

const CardHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingBottom: theme.spacing(2),
}));

const CardFooter = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  paddingTop: theme.spacing(2),
}));

// Конфігурація гри
const GAMES = ["Усі", "CS2", "Dota 2", "PUBG"];
const CURRENCIES = ["EUR", "USD", "UAH"];
const CURRENCY_SYMBOLS = { "EUR": "€", "USD": "$", "UAH": "₴" };

// Локалізація
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
    floatValue: "Float Value (Дробове значення)",
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
    percentageProfitTooltip: "Відношення загального прибутку до загального капіталу в процентах."
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
    sold: "YES",
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
    percentageProfitTooltip: "The ratio of total profit to total capital, as a percentage."
  },
};
const PROXY_SERVER_URL = "https://steam-proxy-server-lues.onrender.com";
const LOCAL_STORAGE_KEY = 'steam-investments';

export default function App() {
  const [investments, setInvestments] = useState(() => {
    try {
      const storedInvestments = localStorage.getItem(LOCAL_STORAGE_KEY);
      return storedInvestments ? JSON.parse(storedInvestments) : [];
    } catch (error) {
      console.error("Failed to load investments from localStorage", error);
      return [];
    }
  });
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
  const [tags, setTags] = useState([]);
  const [floatValue, setFloatValue] = useState('');
  const [stickers, setStickers] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const [settingsAnchor, setSettingsAnchor] = useState(null);

  // Обробники стану
  const openSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const t = LANGUAGES[lang];

  // Збереження в localStorage при зміні investments
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(investments));
    } catch (error) {
      console.error("Failed to save investments to localStorage", error);
    }
  }, [investments]);

  // Розрахунок фінансових показників
  const totalInvestment = investments
    .filter(item => !item.sold)
    .reduce((sum, item) => sum + (item.buyPrice * item.count), 0);

  const totalProfit = investments
    .filter(item => item.sold)
    .reduce((sum, item) => sum + ((item.sellPrice - item.buyPrice) * item.count), 0);

  const percentageProfit = totalInvestment > 0 ? (totalProfit / totalInvestment) * 100 : 0;

  // Виправлення тут: об'єднуємо всі Grid-ітеми в один Grid-контейнер
  const renderAnalytics = () => (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h5" mb={3} color="primary" sx={{ textAlign: 'center' }}>
        {t.analytics}
      </Typography>
      <Grid container spacing={3} justifyContent="center" alignItems="stretch">
        <Grid item xs={12} sm={6} md={4}>
          <Tooltip title={t.totalInvestmentTooltip}>
            <StyledMetricCard>
              <Box display="flex" flexDirection="column" alignItems="center" width="100%">
                <TrendingUp color="primary" size={48} />
                <Typography variant="h6" mt={2} color="secondary">
                  {t.totalInvestment}
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="primary">
                  {totalInvestment.toFixed(2)} {CURRENCY_SYMBOLS[buyCurrency]}
                </Typography>
              </Box>
            </StyledMetricCard>
          </Tooltip>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Tooltip title={t.totalProfitTooltip}>
            <StyledMetricCard>
              <Box display="flex" flexDirection="column" alignItems="center" width="100%">
                {totalProfit >= 0 ? (
                  <TrendingUp color="success" size={48} />
                ) : (
                  <TrendingDown color="error" size={48} />
                )}
                <Typography variant="h6" mt={2} color="secondary">
                  {t.totalProfit}
                </Typography>
                <Typography variant="h4" fontWeight="bold" color={totalProfit >= 0 ? "success.main" : "error.main"}>
                  {totalProfit.toFixed(2)} {CURRENCY_SYMBOLS[buyCurrency]}
                </Typography>
              </Box>
            </StyledMetricCard>
          </Tooltip>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Tooltip title={t.percentageProfitTooltip}>
            <StyledMetricCard>
              <Box display="flex" flexDirection="column" alignItems="center" width="100%">
                {percentageProfit >= 0 ? (
                  <TrendingUp color="success" size={48} />
                ) : (
                  <TrendingDown color="error" size={48} />
                )}
                <Typography variant="h6" mt={2} color="secondary">
                  {t.percentageProfit}
                </Typography>
                <Typography variant="h4" fontWeight="bold" color={percentageProfit >= 0 ? "success.main" : "error.main"}>
                  {percentageProfit.toFixed(2)} %
                </Typography>
              </Box>
            </StyledMetricCard>
          </Tooltip>
        </Grid>
      </Grid>
      <Grid container spacing={3} sx={{ mt: 4 }} justifyContent="center">
        {/* Графіки будуть тут */}
      </Grid>
    </Box>
  );

  // Решта коду програми, включаючи інші функції, useEffect, та повернення компонентів
  // ... (решта вашого коду)

  // Обробка форми додавання/редагування активу
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editDialog) {
      // Логіка оновлення
      setInvestments(investments.map(item =>
        item.id === itemToEdit.id ? {
          ...item,
          name: name,
          count: count,
          buyPrice: buyPrice,
          game: game,
          boughtDate: boughtDate,
          currency: buyCurrency,
          tags: tags,
          float: floatValue,
          stickers: stickers,
        } : item
      ));
      openSnackbar(t.itemUpdated, 'success');
      setEditDialog(false);
    } else {
      // Логіка додавання
      const newItem = {
        id: uuidv4(),
        name,
        count,
        buyPrice,
        game,
        boughtDate,
        sold: false,
        sellPrice: 0,
        sellDate: "",
        currency: buyCurrency,
        tags: tags,
        float: floatValue,
        stickers: stickers,
        priceHistory: []
      };
      setInvestments([...investments, newItem]);
      openSnackbar(t.itemAdded, 'success');
      setAddDialog(false);
    }
  };

  const handleAutocompleteChange = (event, value) => {
    setAutocompleteValue(value);
    if (value) {
      setName(value.name);
      setGame(value.game);
      setSelectedItemDetails(value);
      setFloatValue(value.float || '');
      setStickers(value.stickers ? value.stickers.join(', ') : '');
    }
  };

  const handleTagsChange = (event, newValue) => {
    setTags(newValue);
  };

  // Робота з діалогами
  const handleOpenAddDialog = () => {
    resetForm();
    setAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setAddDialog(false);
  };

  const handleOpenEditDialog = (item) => {
    setItemToEdit(item);
    setName(item.name);
    setCount(item.count);
    setBuyPrice(item.buyPrice);
    setBuyCurrency(item.currency);
    setGame(item.game);
    setBoughtDate(item.boughtDate);
    setTags(item.tags || []);
    setFloatValue(item.float || '');
    setStickers(item.stickers ? item.stickers.join(', ') : '');
    setEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialog(false);
    resetForm();
  };

  const handleOpenDeleteDialog = (item) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    setInvestments(investments.filter(item => item.id !== itemToDelete.id));
    openSnackbar(t.itemDeleted, 'info');
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleOpenSellDialog = (item) => {
    setItemToSell(item);
    setSellPrice(item.buyPrice);
    setSellDate(new Date().toISOString().split('T')[0]);
    setSellDialog(true);
  };

  const handleCloseSellDialog = () => {
    setSellDialog(false);
  };

  const handleMarkAsSold = () => {
    setInvestments(investments.map(item =>
      item.id === itemToSell.id
        ? { ...item, sold: true, sellPrice: sellPrice, sellDate: sellDate }
        : item
    ));
    openSnackbar('Операцію закрито', 'success');
    setSellDialog(false);
  };

  // Пошук предметів для автозаповнення
  const fetchItems = async (query) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const newAbortController = new AbortController();
    abortControllerRef.current = newAbortController;
    setAutocompleteLoading(true);

    try {
      const response = await fetch(`${PROXY_SERVER_URL}/search?q=${encodeURIComponent(query)}&game=${game}`, {
        signal: newAbortController.signal
      });
      const data = await response.json();
      setItemOptions(data);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Failed to fetch items:', error);
      }
    } finally {
      setAutocompleteLoading(false);
    }
  };

  const handleAutocompleteInputChange = (event, newInputValue) => {
    if (newInputValue.length > 2) {
      fetchItems(newInputValue);
    } else {
      setItemOptions([]);
    }
  };

  const fetchPriceHistory = async (itemName) => {
    setPriceHistoryLoading(true);
    setPriceHistoryOpen(true);
    try {
      const response = await fetch(`${PROXY_SERVER_URL}/price-history?item_name=${encodeURIComponent(itemName)}&game=${game}`);
      const data = await response.json();
      if (data.success) {
        setPriceHistory(data.prices);
      } else {
        openSnackbar("Помилка при отриманні історії цін", 'error');
        setPriceHistory([]);
      }
    } catch (error) {
      openSnackbar("Помилка з'єднання з API", 'error');
      setPriceHistory([]);
      console.error('Failed to fetch price history:', error);
    } finally {
      setPriceHistoryLoading(false);
    }
  };

  const handleUpdatePrice = async (item) => {
    try {
      const response = await fetch(`${PROXY_SERVER_URL}/price?item_name=${encodeURIComponent(item.name)}&game=${item.game}`);
      const data = await response.json();
      if (data.success) {
        const newPrice = data.price;
        setInvestments(investments.map(inv =>
          inv.id === item.id ? {
            ...inv,
            priceHistory: [...inv.priceHistory, { price: newPrice, date: new Date().toISOString().split('T')[0] }]
          } : inv
        ));
        openSnackbar(`Ціну оновлено: ${newPrice} ${CURRENCY_SYMBOLS[item.currency]}`, 'success');
      } else {
        openSnackbar(`Не вдалося отримати ціну для ${item.name}`, 'error');
      }
    } catch (error) {
      openSnackbar("Помилка при оновленні ціни", 'error');
      console.error('Failed to update price:', error);
    }
  };

  const handleMarketAnalysis = async (item) => {
    setAnalysisLoading(true);
    setMarketAnalysisDialog(true);
    setAnalysisText("");
    const prompt = `Perform a market analysis for the item "${item.name}" from the game "${item.game}". Consider factors like historical price data, recent market trends, and any relevant game updates. Provide a summary of potential investment risks and opportunities. Keep the analysis concise and easy to understand.`;
    try {
      const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
      const payload = { contents: chatHistory };
      const apiKey = ""
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        setAnalysisText(text);
      } else {
        setAnalysisText("Помилка генерації аналізу. Будь ласка, спробуйте ще раз.");
      }
    } catch (error) {
      console.error('Market analysis API error:', error);
      setAnalysisText("Помилка при з'єднанні з сервісом аналізу.");
    } finally {
      setAnalysisLoading(false);
    }
  };

  // Робота з пагінацією
  const filteredInvestments = investments.filter(item => {
    if (tabValue === 0) return true; // Усі
    if (tabValue === 1) return !item.sold; // Активні
    if (tabValue === 2) return item.sold; // Продані
    return false;
  });

  const pageCount = Math.ceil(filteredInvestments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInvestments = filteredInvestments.slice(startIndex, endIndex);

  // Скидання форми
  const resetForm = () => {
    setName("");
    setCount(1);
    setBuyPrice(0);
    setBuyCurrency(CURRENCIES[0]);
    setGame(GAMES[1]);
    setBoughtDate(new Date().toISOString().split('T')[0]);
    setAutocompleteValue(null);
    setSelectedItemDetails(null);
    setTags([]);
    setFloatValue('');
    setStickers('');
  };

  // Компонент, що відображає основну частину інтерфейсу
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #E0E7FF 0%, #FFFFFF 100%)',
        py: 4
      }}>
        <Container maxWidth="lg">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Typography variant="h4" color="primary">{t.portfolio}</Typography>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<Plus />}
                onClick={handleOpenAddDialog}
              >
                {t.addItem}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<BarChart />}
                onClick={() => setAnalyticsOpen(true)}
              >
                {t.analytics}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<Globe />}
                onClick={(event) => setSettingsAnchor(event.currentTarget)}
              >
                {t.language}
              </Button>
            </Box>
            <IconButton
              sx={{ display: { xs: 'flex', md: 'none' } }}
              onClick={(event) => setMobileMenuAnchor(event.currentTarget)}
              color="primary"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={mobileMenuAnchor}
              open={Boolean(mobileMenuAnchor)}
              onClose={() => setMobileMenuAnchor(null)}
            >
              <MenuItem onClick={() => { handleOpenAddDialog(); setMobileMenuAnchor(null); }}>
                <Plus size={18} style={{ marginRight: 8 }} /> {t.addItem}
              </MenuItem>
              <MenuItem onClick={() => { setAnalyticsOpen(true); setMobileMenuAnchor(null); }}>
                <BarChart size={18} style={{ marginRight: 8 }} /> {t.analytics}
              </MenuItem>
              <MenuItem onClick={(event) => setSettingsAnchor(event.currentTarget)}>
                <Globe size={18} style={{ marginRight: 8 }} /> {t.language}
              </MenuItem>
            </Menu>
            <Menu
              anchorEl={settingsAnchor}
              open={Boolean(settingsAnchor)}
              onClose={() => setSettingsAnchor(null)}
            >
              <MenuItem onClick={() => { setLang('uk'); setSettingsAnchor(null); }}>
                Українська
              </MenuItem>
              <MenuItem onClick={() => { setLang('en'); setSettingsAnchor(null); }}>
                English
              </MenuItem>
            </Menu>
          </Box>

          <Tabs
            value={tabValue}
            onChange={(e, newValue) => {
              setTabValue(newValue);
              setCurrentPage(1);
            }}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{ mb: 4 }}
          >
            <Tab label={t.total} />
            <Tab label={t.active} />
            <Tab label={t.sold} />
          </Tabs>

          {/* Виправлений розділ з фінансовими показниками */}
          {tabValue === 0 && (
            <Grid container spacing={3} sx={{ mb: 4 }} justifyContent="center">
              <Grid item xs={12} sm={6} md={4}>
                <Tooltip title={t.totalInvestmentTooltip}>
                  <StyledMetricCard bgcolor="#E1F5FE" color="#01579B">
                    <Box display="flex" flexDirection="column" alignItems="center" width="100%">
                      <DollarSign color="#01579B" size={48} />
                      <Typography variant="h6" mt={2} color="#01579B">
                        {t.totalInvestment}
                      </Typography>
                      <Typography variant="h4" fontWeight="bold" color="#01579B">
                        {totalInvestment.toFixed(2)} {CURRENCY_SYMBOLS[buyCurrency]}
                      </Typography>
                    </Box>
                  </StyledMetricCard>
                </Tooltip>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Tooltip title={t.totalProfitTooltip}>
                  <StyledMetricCard bgcolor="#E8F5E9" color="#1B5E20">
                    <Box display="flex" flexDirection="column" alignItems="center" width="100%">
                      {totalProfit >= 0 ? (
                        <TrendingUp color="#1B5E20" size={48} />
                      ) : (
                        <TrendingDown color="#C62828" size={48} />
                      )}
                      <Typography variant="h6" mt={2} color="#1B5E20">
                        {t.totalProfit}
                      </Typography>
                      <Typography variant="h4" fontWeight="bold" color={totalProfit >= 0 ? "#1B5E20" : "#C62828"}>
                        {totalProfit.toFixed(2)} {CURRENCY_SYMBOLS[buyCurrency]}
                      </Typography>
                    </Box>
                  </StyledMetricCard>
                </Tooltip>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Tooltip title={t.percentageProfitTooltip}>
                  <StyledMetricCard bgcolor="#FFFDE7" color="#F9A825">
                    <Box display="flex" flexDirection="column" alignItems="center" width="100%">
                      <Percent color="#F9A825" size={48} />
                      <Typography variant="h6" mt={2} color="#F9A825">
                        {t.percentageProfit}
                      </Typography>
                      <Typography variant="h4" fontWeight="bold" color="#F9A825">
                        {percentageProfit.toFixed(2)} %
                      </Typography>
                    </Box>
                  </StyledMetricCard>
                </Tooltip>
              </Grid>
            </Grid>
          )}

          {/* Таблиця з інвестиціями */}
          {currentInvestments.length > 0 ? (
            <Paper elevation={3} sx={{ p: 2, mb: 4, overflowX: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>{t.name}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{t.game}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{t.count}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{t.buyPrice}</TableCell>
                    {tabValue === 2 && <TableCell sx={{ fontWeight: 'bold' }}>{t.sellPrice}</TableCell>}
                    <TableCell sx={{ fontWeight: 'bold' }}>{t.boughtDate}</TableCell>
                    {tabValue === 2 && <TableCell sx={{ fontWeight: 'bold' }}>{t.sellDate}</TableCell>}
                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>{t.action}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentInvestments.map(item => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Box
                            component="img"
                            src={item.icon_url || `https://placehold.co/40x40/DDDDDD/FFFFFF?text=${item.name.substring(0, 2)}`}
                            alt={item.name}
                            sx={{ width: 40, height: 40, borderRadius: '50%', mr: 2, objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://placehold.co/40x40/DDDDDD/FFFFFF?text=${item.name.substring(0, 2)}`;
                            }}
                          />
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{item.name}</Typography>
                            <Box>
                              {(item.tags || []).map((tag, index) => (
                                <Chip key={index} label={tag} size="small" color="primary" sx={{ mr: 0.5, mt: 0.5 }} />
                              ))}
                            </Box>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{item.game}</TableCell>
                      <TableCell>{item.count}</TableCell>
                      <TableCell>{item.buyPrice} {CURRENCY_SYMBOLS[item.currency]}</TableCell>
                      {tabValue === 2 && <TableCell>{item.sellPrice} {CURRENCY_SYMBOLS[item.currency]}</TableCell>}
                      <TableCell>{item.boughtDate}</TableCell>
                      {tabValue === 2 && <TableCell>{item.sellDate}</TableCell>}
                      <TableCell sx={{ textAlign: 'center' }}>
                        <IconButton color="secondary" onClick={() => handleOpenEditDialog(item)}>
                          <Edit size={20} />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleOpenDeleteDialog(item)}>
                          <Delete size={20} />
                        </IconButton>
                        {!item.sold && (
                          <>
                            <IconButton color="success" onClick={() => handleOpenSellDialog(item)}>
                              <DollarSign size={20} />
                            </IconButton>
                            <IconButton color="primary" onClick={() => fetchPriceHistory(item.name)}>
                              <History size={20} />
                            </IconButton>
                            <IconButton color="secondary" onClick={() => handleMarketAnalysis(item)}>
                              <Rocket size={20} />
                            </IconButton>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          ) : (
            <Box sx={{ textAlign: 'center', p: 4 }}>
              <Typography variant="h6" color="text.secondary">{t.noInvestmentsInCategory}</Typography>
              <Button variant="contained" onClick={handleOpenAddDialog} sx={{ mt: 2 }}>
                {t.addItem}
              </Button>
            </Box>
          )}

          {/* Діалог додавання/редагування активу */}
          <Dialog open={addDialog || editDialog} onClose={editDialog ? handleCloseEditDialog : handleCloseAddDialog} maxWidth="md" fullWidth>
            <DialogTitle>
              <Typography variant="h6" fontWeight="bold" color="primary">
                {editDialog ? t.editItem : t.addInvestment}
              </Typography>
            </DialogTitle>
            <DialogContent dividers>
              <Box component="form" onSubmit={handleFormSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel id="game-label">{t.game}</InputLabel>
                      <Select
                        labelId="game-label"
                        value={game}
                        onChange={(e) => setGame(e.target.value)}
                        label={t.game}
                        required
                      >
                        {GAMES.slice(1).map(g => (
                          <MenuItem key={g} value={g}>{g}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel id="currency-label">{t.currency}</InputLabel>
                      <Select
                        labelId="currency-label"
                        value={buyCurrency}
                        onChange={(e) => setBuyCurrency(e.target.value)}
                        label={t.currency}
                        required
                      >
                        {CURRENCIES.map(c => (
                          <MenuItem key={c} value={c}>{c}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Autocomplete
                      value={autocompleteValue}
                      onChange={handleAutocompleteChange}
                      onInputChange={handleAutocompleteInputChange}
                      options={itemOptions}
                      getOptionLabel={(option) => option.name || ""}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      loading={autocompleteLoading}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={t.name}
                          fullWidth
                          margin="normal"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
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
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label={t.count}
                      type="number"
                      value={count}
                      onChange={(e) => setCount(Math.max(1, parseInt(e.target.value, 10)))}
                      fullWidth
                      margin="normal"
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label={t.buyPrice}
                      type="number"
                      value={buyPrice}
                      onChange={(e) => setBuyPrice(parseFloat(e.target.value))}
                      fullWidth
                      margin="normal"
                      required
                      inputProps={{ step: "0.01" }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label={t.boughtDate}
                      type="date"
                      value={boughtDate}
                      onChange={(e) => setBoughtDate(e.target.value)}
                      fullWidth
                      margin="normal"
                      required
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Autocomplete
                      multiple
                      options={[]}
                      value={tags}
                      onChange={handleTagsChange}
                      freeSolo
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={t.tags}
                          placeholder={t.tagsPlaceholder}
                          fullWidth
                          margin="normal"
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label={t.floatValue}
                      placeholder={t.floatValuePlaceholder}
                      value={floatValue}
                      onChange={(e) => setFloatValue(e.target.value)}
                      fullWidth
                      margin="normal"
                      type="number"
                      inputProps={{ step: "any" }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label={t.stickers}
                      placeholder={t.stickersList}
                      value={stickers}
                      onChange={(e) => setStickers(e.target.value)}
                      fullWidth
                      margin="normal"
                    />
                  </Grid>
                </Grid>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={editDialog ? handleCloseEditDialog : handleCloseAddDialog} color="secondary" variant="outlined">
                {t.cancel}
              </Button>
              <Button onClick={handleFormSubmit} color="primary" variant="contained">
                {t.save}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Діалог підтвердження видалення */}
          <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="sm">
            <DialogTitle>
              <Typography variant="h6" fontWeight="bold" color="primary">
                {t.deleteConfirmation}
              </Typography>
            </DialogTitle>
            <DialogContent dividers>
              <Typography>
                {t.name}: {itemToDelete?.name}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteDialogOpen(false)} color="secondary" variant="outlined">{t.cancel}</Button>
              <Button onClick={handleDelete} color="error" variant="contained">{t.delete}</Button>
            </DialogActions>
          </Dialog>

          {/* Діалог закриття операції */}
          <Dialog open={sellDialog} onClose={handleCloseSellDialog} maxWidth="sm" fullWidth>
            <DialogTitle>
              <Typography variant="h6" fontWeight="bold" color="primary">{t.markAsSold}</Typography>
            </DialogTitle>
            <DialogContent dividers>
              <TextField
                label={t.sellPrice}
                type="number"
                value={sellPrice}
                onChange={(e) => setSellPrice(parseFloat(e.target.value))}
                fullWidth
                margin="normal"
                required
                inputProps={{ step: "0.01" }}
              />
              <TextField
                label={t.sellDate}
                type="date"
                value={sellDate}
                onChange={(e) => setSellDate(e.target.value)}
                fullWidth
                margin="normal"
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseSellDialog} color="secondary" variant="outlined">{t.cancel}</Button>
              <Button onClick={handleMarkAsSold} color="success" variant="contained">{t.save}</Button>
            </DialogActions>
          </Dialog>

          {/* Діалог аналітики */}
          <Dialog open={analyticsOpen} onClose={() => setAnalyticsOpen(false)} maxWidth="xl" fullWidth>
            <DialogTitle>
              <Typography variant="h6" fontWeight="bold" color="primary">{t.analytics}</Typography>
            </DialogTitle>
            <DialogContent dividers>
              {renderAnalytics()}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setAnalyticsOpen(false)} color="secondary" variant="outlined">{t.cancel}</Button>
            </DialogActions>
          </Dialog>

          {/* Діалог історії цін */}
          <Dialog open={priceHistoryOpen} onClose={() => setPriceHistoryOpen(false)} maxWidth="md" fullWidth>
            <DialogTitle>
              <Typography variant="h6" fontWeight="bold" color="primary">{t.priceHistory}</Typography>
            </DialogTitle>
            <DialogContent dividers>
              {priceHistoryLoading ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
                  <CircularProgress color="primary" />
                  <Typography variant="body1" mt={2} color="secondary">Завантаження історії...</Typography>
                </Box>
              ) : (
                priceHistory.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={priceHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={['auto', 'auto']} />
                      <ChartTooltip />
                      <Legend />
                      <Line type="monotone" dataKey="price" stroke={theme.palette.primary.main} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <Typography variant="body1" color="text.secondary" sx={{ p: 4, textAlign: 'center' }}>
                    {t.noData}
                  </Typography>
                )
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setPriceHistoryOpen(false)} color="secondary" variant="outlined">{t.cancel}</Button>
            </DialogActions>
          </Dialog>

          {/* Діалог аналізу ринку */}
          <Dialog open={marketAnalysisDialog} onClose={() => setMarketAnalysisDialog(false)} maxWidth="md" fullWidth>
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
              <Button onClick={() => setMarketAnalysisDialog(false)} color="secondary" variant="outlined">{t.cancel}</Button>
            </DialogActions>
          </Dialog>

          {/* Snackbar для сповіщень */}
          <Snackbar open={snackbar.open} autoHideDuration={3500} onClose={closeSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
            <Alert onClose={closeSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
