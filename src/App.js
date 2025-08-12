import React, { useState, useEffect, useRef } from 'react';
import {
  Container, Typography, Box, TextField, Button, Table, TableHead, TableBody, TableRow, TableCell,
  Select, MenuItem, FormControl, InputLabel, Dialog, DialogTitle, DialogContent, DialogActions,
  Tabs, Tab, IconButton, Snackbar, Alert, Grid, Card, CardContent, Chip, Tooltip,
  Autocomplete, CircularProgress, Divider, LinearProgress, Paper
} from '@mui/material';
import {
  TrendingUp, Delete, Check, BarChart, Plus, Language, X, ArrowUp, Edit,
  History, Settings, Tag, Palette, Rocket, Zap
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip as ChartTooltip, ResponsiveContainer, CartesianGrid, Legend, PieChart, Pie,
  Cell
} from 'recharts';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import {
  getFirestore, collection, onSnapshot, doc, addDoc, updateDoc, deleteDoc,
  query, where, serverTimestamp
} from 'firebase/firestore';

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
    },
    error: {
      main: '#DC3545',
    },
  },
  typography: {
    fontFamily: ['"Inter"', 'sans-serif'].join(','),
    h4: {
      fontWeight: 700,
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
            }
        }
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
  },
};

const PROXY_SERVER_URL = "https://steam-proxy-server-lues.onrender.com";

const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

const InvestmentCard = styled(Card)(({ theme }) => ({
  background: theme.palette.background.paper,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'box-shadow 0.3s, transform 0.3s',
  '&:hover': {
    boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
    transform: 'translateY(-4px)',
  },
}));

const DetailChip = styled(Chip)(({ theme, colorName }) => ({
  backgroundColor: '#F1F3F5',
  color: theme.palette.text.primary,
  fontWeight: 'normal',
  marginRight: theme.spacing(1),
  marginBottom: theme.spacing(1),
  borderRadius: 6,
}));

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
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [priceHistory, setPriceHistory] = useState([]);
  const [priceHistoryOpen, setPriceHistoryOpen] = useState(false);
  const [priceHistoryLoading, setPriceHistoryLoading] = useState(false);
  const [marketAnalysisDialog, setMarketAnalysisDialog] = useState(false);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisText, setAnalysisText] = useState("");
  const [itemToAnalyze, setItemToAnalyze] = useState(null);

  const t = LANGUAGES[lang];

  useEffect(() => {
    try {
      const app = initializeApp(firebaseConfig);
      const authInstance = getAuth(app);
      const dbInstance = getFirestore(app);
      setAuth(authInstance);
      setDb(dbInstance);

      onAuthStateChanged(authInstance, async (user) => {
        if (user) {
          setUserId(user.uid);
        } else {
          try {
            await signInAnonymously(authInstance);
            setUserId(authInstance.currentUser.uid);
          } catch (error) {
            console.error("Error signing in anonymously:", error);
          }
        }
        setIsAuthReady(true);
      });

      if (initialAuthToken) {
        signInWithCustomToken(authInstance, initialAuthToken).catch((error) => {
          console.error("Error signing in with custom token:", error);
        });
      }
    } catch (e) {
      console.error("Firebase initialization failed. Check your config.", e);
    }
  }, []);

  useEffect(() => {
    if (isAuthReady && userId && db) {
      const investmentsCollection = collection(db, `artifacts/${appId}/users/${userId}/investments`);
      const q = query(investmentsCollection);

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setInvestments(items);
      }, (error) => {
        console.error("Error listening to investments:", error);
      });

      return () => unsubscribe();
    }
  }, [isAuthReady, userId, db]);

  const updateInvestment = async (id, data) => {
    if (!db) return;
    try {
      const investmentDoc = doc(db, `artifacts/${appId}/users/${userId}/investments`, id);
      await updateDoc(investmentDoc, data);
      showSnackbar(t.itemUpdated, 'success');
    } catch (error) {
      console.error("Error updating investment:", error);
      showSnackbar(t.fetchError, 'error');
    }
  };

  const deleteInvestment = async (id) => {
    if (!db) return;
    try {
      const investmentDoc = doc(db, `artifacts/${appId}/users/${userId}/investments`, id);
      await deleteDoc(investmentDoc);
      showSnackbar(t.itemDeleted, 'success');
    } catch (error) {
      console.error("Error deleting investment:", error);
      showSnackbar(t.fetchError, 'error');
    }
  };

  const getGameFromItemName = (itemName) => {
    const cs2Keywords = ["case", "sticker", "skin", "glove", "knife", "pin", "key", "capsule", "souvenir"];
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
    return "CS2"; // Default to CS2 if not found
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
        updateInvestment(item.id, { currentPrice });
        showSnackbar(`Поточна ціна для ${item.name}: ${currentPrice.toFixed(2)} ${CURRENCY_SYMBOLS[item.buyCurrency]}`, 'info');
      } else {
        showSnackbar('Не вдалося отримати поточну ціну.', 'warning');
      }
    } catch (error) {
      console.error('Error fetching current price:', error);
      showSnackbar('Помилка при оновленні ціни.', 'error');
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
    if (!name || count <= 0 || buyPrice <= 0 || !boughtDate || !db || !userId) {
      showSnackbar("СИСТЕМНА ПОМИЛКА: ВВЕДІТЬ ПОВНІ ДАНІ", "error");
      return;
    }

    const newItem = {
      name,
      market_hash_name: selectedItemDetails?.market_hash_name || name,
      count: Number(count),
      buyPrice: Number(buyPrice),
      game,
      boughtDate,
      buyCurrency,
      sold: false,
      sellPrice: 0,
      sellDate: null,
      image: selectedItemDetails?.image || null,
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, `artifacts/${appId}/users/${userId}/investments`), newItem);
      showSnackbar(t.itemAdded, "success");
      resetForm();
      setAddDialog(false);
    } catch (error) {
      console.error("Error adding investment:", error);
      showSnackbar(t.fetchError, "error");
    }
  };

  const markAsSold = () => {
    if (!itemToSell || sellPrice <= 0 || !sellDate) {
      showSnackbar("СИСТЕМНА ПОМИЛКА: ВВЕДІТЬ ЦІНУ ВИХОДУ", "error");
      return;
    }
    updateInvestment(itemToSell.id, {
      sold: true,
      sellPrice: Number(sellPrice),
      sellDate: sellDate,
    });
    setSellDialog(false);
    resetForm();
  };

  const confirmDelete = (item) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    deleteInvestment(itemToDelete.id);
    setDeleteDialogOpen(false);
    setItemToDelete(null);
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

  const saveEditedItem = () => {
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
    updateInvestment(itemToEdit.id, updatedData);
    setEditDialog(false);
    resetForm();
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

  const filteredInvestments = tabValue === 0 ? investments : investments.filter((item) => item.game === GAMES[tabValue]);

  const totalInvestment = investments.reduce((sum, item) => sum + item.buyPrice * item.count, 0);
  const totalSoldProfit = investments
    .filter(item => item.sold)
    .reduce((sum, item) => sum + (item.sellPrice - item.buyPrice) * item.count, 0);
  const profitColor = totalSoldProfit >= 0 ? theme.palette.success.main : theme.palette.error.main;
  const percentageProfit = totalInvestment > 0 ? (totalSoldProfit / totalInvestment) * 100 : 0;

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

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="xl" sx={{ pt: 4, pb: 8, backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Box/> {/* Empty box to balance the layout */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="language-select-label">{t.language}</InputLabel>
              <Select
                labelId="language-select-label"
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                label={t.language}
              >
                <MenuItem value="uk">Українська</MenuItem>
                <MenuItem value="en">English</MenuItem>
              </Select>
            </FormControl>
            <Button variant="contained" startIcon={<BarChart />} onClick={handleAnalyticsOpen}>
              {t.analytics}
            </Button>
            <Button variant="contained" color="primary" startIcon={<Plus />} onClick={() => setAddDialog(true)}>
              {t.addItem}
            </Button>
          </Box>
        </Box>

        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={4}>
            <StyledCard>
              <CardContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{t.totalInvestment}</Typography>
                <Typography variant="h4" component="div">{totalInvestment.toFixed(2)} {CURRENCY_SYMBOLS[buyCurrency]}</Typography>
              </CardContent>
            </StyledCard>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StyledCard>
              <CardContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{t.totalProfit}</Typography>
                <Typography variant="h4" component="div" sx={{ color: profitColor }}>
                  {totalSoldProfit.toFixed(2)} {CURRENCY_SYMBOLS[buyCurrency]}
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StyledCard>
              <CardContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{t.percentageProfit}</Typography>
                <Typography variant="h4" component="div" sx={{ color: profitColor }}>
                  {percentageProfit.toFixed(2)}%
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>

        <Paper sx={{ mb: 4, p: 1 }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} aria-label="game tabs" centered>
            {GAMES.map((gameName, index) => (
              <Tab key={index} label={gameName === "Усі" ? t.total : gameName} />
            ))}
          </Tabs>
        </Paper>

        <Grid container spacing={3}>
          {filteredInvestments.length === 0 ? (
            <Grid item xs={12}>
              <Box sx={{ p: 4, textAlign: 'center', color: theme.palette.text.secondary }}>
                <Typography variant="h6">{t.noInvestmentsInCategory}</Typography>
              </Box>
            </Grid>
          ) : (
            filteredInvestments.map((item) => {
              const itemProfit = item.sold ? (item.sellPrice - item.buyPrice) * item.count : 0;
              const profitColorForCard = itemProfit >= 0 ? theme.palette.success.main : theme.palette.error.main;
              return (
                <Grid item xs={12} sm={6} md={4} key={item.id}>
                  <InvestmentCard>
                    <CardContent>
                      <CardHeader>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, marginRight: 16 }}
                            />
                          )}
                          <Box>
                            <Typography variant="subtitle1" fontWeight="bold">{item.name}</Typography>
                            <Typography variant="body2" color="text.secondary">{item.game}</Typography>
                          </Box>
                        </Box>
                        <Box>
                          <Chip label={item.sold ? t.sold : t.active} color={item.sold ? "success" : "primary"} size="small" />
                        </Box>
                      </CardHeader>
                      <Divider sx={{ my: 1 }} />
                      <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                        <Box>
                          <Typography variant="body2" color="text.secondary">{t.count}:</Typography>
                          <Typography variant="h6" fontWeight="bold">{item.count}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" color="text.secondary">{t.buyPrice}:</Typography>
                          <Typography variant="h6" fontWeight="bold">{item.buyPrice.toFixed(2)} {CURRENCY_SYMBOLS[item.buyCurrency]}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" color="text.secondary">{t.profit}:</Typography>
                          <Typography variant="h6" fontWeight="bold" sx={{ color: profitColorForCard }}>
                            {item.sold ? `${itemProfit.toFixed(2)} ${CURRENCY_SYMBOLS[item.buyCurrency]}` : '—'}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" color="text.secondary">{t.boughtDate}:</Typography>
                          <Typography variant="h6" fontWeight="bold">{item.boughtDate}</Typography>
                        </Box>
                      </Box>
                    </CardContent>
                    <CardFooter>
                      <Tooltip title={t.edit}>
                        <IconButton color="secondary" onClick={() => handleEdit(item)}><Edit size={20} /></IconButton>
                      </Tooltip>
                      <Tooltip title={t.markAsSold}>
                        <IconButton color="success" onClick={() => { setItemToSell(item); setSellPrice(item.buyPrice); setSellDialog(true); }} disabled={item.sold}>
                          <TrendingUp size={20} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t.delete}>
                        <IconButton color="error" onClick={() => confirmDelete(item)}><Delete size={20} /></IconButton>
                      </Tooltip>
                      <Tooltip title={t.priceHistory}>
                        <IconButton color="primary" onClick={() => handlePriceHistory(item)}><History size={20} /></IconButton>
                      </Tooltip>
                      <Tooltip title={t.updatePrice}>
                        <IconButton color="secondary" onClick={() => handleCurrentPriceUpdate(item)}><Zap size={20} /></IconButton>
                      </Tooltip>
                      <Tooltip title={t.marketAnalysis}>
                        <IconButton color="primary" onClick={() => handleMarketAnalysis(item)}><BarChart size={20} /></IconButton>
                      </Tooltip>
                    </CardFooter>
                  </InvestmentCard>
                </Grid>
              );
            })
          )}
        </Grid>

        {/* Dialog для додавання інвестиції */}
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
                      <TextField label={t.count} type="number" value={count} onChange={(e) => setCount(e.target.value)} fullWidth required InputProps={{ inputProps: { min: 1 } }} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth required>
                        <InputLabel>{t.game}</InputLabel>
                        <Select value={game} label={t.game} onChange={(e) => setGame(e.target.value)}>
                          {GAMES.slice(1).map((gameName, index) => (
                            <MenuItem key={index} value={gameName}>{gameName}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField label={t.buyPrice} type="number" value={buyPrice} onChange={(e) => setBuyPrice(e.target.value)} fullWidth required InputProps={{ inputProps: { min: 0 } }} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth required>
                        <InputLabel>{t.currency}</InputLabel>
                        <Select value={buyCurrency} label={t.currency} onChange={(e) => setBuyCurrency(e.target.value)}>
                          {CURRENCIES.map((currency, index) => (
                            <MenuItem key={index} value={currency}>{CURRENCY_SYMBOLS[currency]}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField label={t.boughtDate} type="date" value={boughtDate} onChange={(e) => setBoughtDate(e.target.value)} fullWidth required InputLabelProps={{ shrink: true }} />
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              {selectedItemDetails && (
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3, background: '#F1F3F5', borderRadius: 8, height: '100%' }}>
                    <Typography variant="h6" mb={2} color="secondary">{t.selectedItem}</Typography>
                    <img src={selectedItemDetails.image} alt={selectedItemDetails.label} style={{ width: 'auto', maxHeight: '150px', objectFit: 'contain', borderRadius: 8 }} />
                    <Box mt={2} textAlign="center">
                      <Typography variant="h6" fontWeight="bold">{selectedItemDetails.label}</Typography>
                    </Box>
                  </Box>
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Button onClick={() => setAddDialog(false)} color="secondary" variant="outlined">{t.cancel}</Button>
            <Button onClick={addItem} color="primary" variant="contained" endIcon={<ArrowUp />}>{t.save}</Button>
          </DialogActions>
        </Dialog>

        {/* Dialog для редагування інвестиції */}
        <Dialog open={editDialog} onClose={() => setEditDialog(false)} PaperProps={{ style: { maxWidth: 'md', width: '90%' } }}>
          <DialogTitle>
            <Typography variant="h6" fontWeight="bold" color="primary">{t.editItem}</Typography>
          </DialogTitle>
          <DialogContent dividers sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField label={t.name} value={name} onChange={(e) => setName(e.target.value)} fullWidth required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label={t.count} type="number" value={count} onChange={(e) => setCount(e.target.value)} fullWidth required InputProps={{ inputProps: { min: 1 } }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label={t.buyPrice} type="number" value={buyPrice} onChange={(e) => setBuyPrice(e.target.value)} fullWidth required InputProps={{ inputProps: { min: 0 } }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>{t.game}</InputLabel>
                  <Select value={game} label={t.game} onChange={(e) => setGame(e.target.value)}>
                    {GAMES.slice(1).map((gameName, index) => (
                      <MenuItem key={index} value={gameName}>{gameName}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField label={t.boughtDate} type="date" value={boughtDate} onChange={(e) => setBoughtDate(e.target.value)} fullWidth required InputLabelProps={{ shrink: true }} />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setEditDialog(false)} color="secondary" variant="outlined">{t.cancel}</Button>
            <Button onClick={saveEditedItem} color="primary" variant="contained">{t.save}</Button>
          </DialogActions>
        </Dialog>

        {/* Dialog для відмічення як продано */}
        <Dialog open={sellDialog} onClose={() => setSellDialog(false)} PaperProps={{ style: { borderRadius: 16 } }}>
          <DialogTitle>
            <Typography variant="h6" fontWeight="bold" color="primary">{t.markAsSold}</Typography>
          </DialogTitle>
          <DialogContent dividers>
            <TextField autoFocus margin="dense" label={t.sellPrice} type="number" fullWidth value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} InputProps={{ inputProps: { min: 0 } }} />
            <TextField margin="dense" label={t.sellDate} type="date" fullWidth value={sellDate} onChange={(e) => setSellDate(e.target.value)} InputLabelProps={{ shrink: true }} />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setSellDialog(false)} color="secondary" variant="outlined">{t.cancel}</Button>
            <Button onClick={markAsSold} color="primary" variant="contained">{t.save}</Button>
          </DialogActions>
        </Dialog>

        {/* Dialog для підтвердження видалення */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} PaperProps={{ style: { borderRadius: 16 } }}>
          <DialogTitle>{t.deleteConfirmation}</DialogTitle>
          <DialogContent>
            <Typography>{t.deleteConfirmation}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)} color="secondary">{t.no}</Button>
            <Button onClick={handleDelete} color="error">{t.yes}</Button>
          </DialogActions>
        </Dialog>

        {/* Dialog для аналітики */}
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
            <Button onClick={() => setAnalyticsOpen(false)} color="secondary" variant="outlined">{t.cancel}</Button>
          </DialogActions>
        </Dialog>

        {/* Dialog для історії ціни */}
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
            <Button onClick={() => setPriceHistoryOpen(false)} color="secondary" variant="outlined">{t.cancel}</Button>
          </DialogActions>
        </Dialog>

        {/* Dialog для аналізу ринку */}
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
    </ThemeProvider>
  );
}
