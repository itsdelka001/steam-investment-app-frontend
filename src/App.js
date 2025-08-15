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
import { ThemeProvider } from '@mui/material/styles';
import { getTheme, StyledCard, StyledMetricCard, StyledCombinedCard, CardHeader, CardFooter } from './theme';
import CommissionManagerDialog from './components/CommissionManagerDialog';
import ItemDetailsDialog from './components/ItemDetailsDialog';
import {
  GAMES, CURRENCIES, CURRENCY_SYMBOLS,
  EXCHANGERATE_API_KEY, BACKEND_URL, PROXY_SERVER_URL,
  ITEMS_PER_PAGE, PIE_COLORS
} from './constants';
import { convertCurrency, getNetProfit } from './utils';

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

  // useEffect для завантаження перекладів
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

  // useEffect для отримання курсів валют
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

  // useEffect для автоматичного оновлення цін
  useEffect(() => {
    let intervalId;
    if (autoUpdateEnabled) {
      intervalId = setInterval(() => {
        fetchAndUpdateAllPrices();
      }, 15 * 60 * 1000);
    }
    return () => clearInterval(intervalId);
  }, [autoUpdateEnabled, investments]);

  // Функція для отримання інвестицій з бекенду
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
        // Corrected call to convertCurrency with exchangeRates
        showSnackbar(`Поточна ціна для ${item.name}: ${convertCurrency(currentPrice, "EUR", displayCurrency, exchangeRates).toFixed(2)} ${CURRENCY_SYMBOLS[displayCurrency]}`, 'info');
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

  // РОЗРАХУНОК НОВИХ ФІНАНСОВИХ ПОКАЗНИКІВ
  const soldInvestments = investments.filter(item => item.sold);
  const activeInvestments = investments.filter(item => !item.sold);
  
  // Правильний виклик convertCurrency з передачею exchangeRates
  const totalInvestment = filteredInvestments.reduce((sum, item) => sum + convertCurrency(item.buyPrice * item.count, item.buyCurrency, displayCurrency, exchangeRates), 0);
  
  // Правильний виклик convertCurrency з передачею exchangeRates
  const totalInvestmentInSoldItems = soldInvestments.reduce((sum, item) => sum + convertCurrency(item.buyPrice * item.count, item.buyCurrency, displayCurrency, exchangeRates), 0);
  
  // Правильний виклик convertCurrency з передачею exchangeRates
  const totalInvestmentInActiveItems = activeInvestments.reduce((sum, item) => sum + convertCurrency(item.buyPrice * item.count, item.buyCurrency, displayCurrency, exchangeRates), 0);
  
  const totalSoldProfit = soldInvestments.reduce((sum, item) => {
    // Правильний виклик convertCurrency з передачею exchangeRates
    const buyPriceInDisplayCurrency = convertCurrency(item.buyPrice, item.buyCurrency, displayCurrency, exchangeRates);
    const sellPriceInDisplayCurrency = convertCurrency(item.sellPrice, item.buyCurrency, displayCurrency, exchangeRates);
    const grossProfit = (sellPriceInDisplayCurrency - buyPriceInDisplayCurrency) * item.count;
    const totalSellValue = sellPriceInDisplayCurrency * item.count;
    const netProfit = getNetProfit(grossProfit, totalSellValue, item.commissions);
    return sum + netProfit;
  }, 0);
  
  const totalMarketValue = activeInvestments.reduce((sum, item) => {
    // Правильний виклик convertCurrency з передачею exchangeRates
    const currentPriceInDisplayCurrency = convertCurrency(item.currentPrice || item.buyPrice, item.buyCurrency, displayCurrency, exchangeRates);
    return sum + currentPriceInDisplayCurrency * item.count;
  }, 0);
  
  const currentMarketProfit = totalMarketValue - totalInvestmentInActiveItems;

  const totalFeesPaid = soldInvestments.reduce((sum, item) => {
    // Правильний виклик convertCurrency з передачею exchangeRates
    const sellPriceInDisplayCurrency = convertCurrency(item.sellPrice, item.buyCurrency, displayCurrency, exchangeRates);
    const totalSellValue = sellPriceInDisplayCurrency * item.count;
    const totalRate = (item.commissions || []).reduce((rate, c) => rate + c.rate, 0);
    return sum + (totalSellValue * totalRate / 100);
  }, 0);

  const realizedROI = totalInvestmentInSoldItems > 0 ? (totalSoldProfit / totalInvestmentInSoldItems) * 100 : 0;
  const unrealizedROI = totalInvestmentInActiveItems > 0 ? (currentMarketProfit / totalInvestmentInActiveItems) * 100 : 0;

  const averageHoldingPeriod = soldInvestments.length > 0 ? soldInvestments.reduce((sum, item) => { 
    const bought = new Date(item.boughtDate); 
    const sold = new Date(item.sellDate); 
    const diffTime = Math.abs(sold - bought); 
    return sum + Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  }, 0) / soldInvestments.length : 0;
  
  const profitColor = totalSoldProfit >= 0 ? theme.palette.success.main : theme.palette.error.main;
  const currentProfitColor = currentMarketProfit >= 0 ? theme.palette.success.main : theme.palette.error.main;
  const realizedROIColor = realizedROI >= 0 ? theme.palette.success.main : theme.palette.error.main;
  const unrealizedROIColor = unrealizedROI >= 0 ? theme.palette.success.main : theme.palette.error.main;
  
  const profitByDate = soldInvestments
    .map(item => {
      // Правильний виклик convertCurrency з передачею exchangeRates
      const buyPriceInDisplayCurrency = convertCurrency(item.buyPrice, item.buyCurrency, displayCurrency, exchangeRates);
      const sellPriceInDisplayCurrency = convertCurrency(item.sellPrice, item.buyCurrency, displayCurrency, exchangeRates);
      const grossProfit = (sellPriceInDisplayCurrency - buyPriceInDisplayCurrency) * item.count;
      const totalSellValue = sellPriceInDisplayCurrency * item.count;
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
    // Правильний виклик convertCurrency з передачею exchangeRates
    acc[item.game] += convertCurrency(item.buyPrice * item.count, item.buyCurrency, displayCurrency, exchangeRates);
    return acc;
  }, {})).map(([game, value]) => ({ name: game, value }));

  const profitByGameData = Object.entries(investments.reduce((acc, item) => {
    if (!acc[item.game]) acc[item.game] = 0;
    if (item.sold) {
      // Правильний виклик convertCurrency з передачею exchangeRates
      const buyPriceInDisplayCurrency = convertCurrency(item.buyPrice, item.buyCurrency, displayCurrency, exchangeRates);
      const sellPriceInDisplayCurrency = convertCurrency(item.sellPrice, item.buyCurrency, displayCurrency, exchangeRates);
      const grossProfit = (sellPriceInDisplayCurrency - buyPriceInDisplayCurrency) * item.count;
      const totalSellValue = sellPriceInDisplayCurrency * item.count;
      const netProfit = getNetProfit(grossProfit, totalSellValue, item.commissions);
      acc[item.game] += netProfit;
    } else {
      // Правильний виклик convertCurrency з передачею exchangeRates
      const buyPriceInDisplayCurrency = convertCurrency(item.buyPrice, item.buyCurrency, displayCurrency, exchangeRates);
      const currentPriceInDisplayCurrency = convertCurrency(item.currentPrice || item.buyPrice, item.buyCurrency, displayCurrency, exchangeRates);
      const currentGrossProfit = (currentPriceInDisplayCurrency - buyPriceInDisplayCurrency) * item.count;
      acc[item.game] += currentGrossProfit;
    }
    return acc;
  }, {})).map(([name, value]) => ({ name, value }));

  const totalValueByGameData = Object.entries(investments.reduce((acc, item) => {
    if (!acc[item.game]) acc[item.game] = 0;
    // Правильний виклик convertCurrency з передачею exchangeRates
    const price = item.sold ? item.sellPrice : (item.currentPrice || item.buyPrice);
    const value = convertCurrency(price * item.count, item.buyCurrency, displayCurrency, exchangeRates);
    acc[item.game] += value;
    return acc;
  }, {})).map(([name, value]) => ({ name, value }));

  const handleDisplayCurrencyChange = (event) => {
    setDisplayCurrency(event.target.value);
  };
  
  const renderValueInDisplayCurrency = (value, fromCurrency) => {
    if (!exchangeRates || Object.keys(exchangeRates).length === 0) {
      return `${value.toFixed(2)} ${CURRENCY_SYMBOLS[fromCurrency]}`;
    }
    const convertedValue = convertCurrency(value, fromCurrency, displayCurrency, exchangeRates);
    return `${convertedValue.toFixed(2)} ${CURRENCY_SYMBOLS[displayCurrency]}`;
  };

  const renderValueInDisplayCurrencyWithColor = (value, fromCurrency) => {
    const convertedValue = convertCurrency(value, fromCurrency, displayCurrency, exchangeRates);
    const color = convertedValue >= 0 ? theme.palette.success.main : theme.palette.error.main;
    return (
      <Typography variant="body2" sx={{ color }}>
        {convertedValue.toFixed(2)} {CURRENCY_SYMBOLS[displayCurrency]}
      </Typography>
    );
  };

  const renderTable = () => (
    <Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                active={sortBy === 'name'}
                direction={sortBy === 'name' ? sortOrder : 'asc'}
                onClick={() => handleSort('name')}
              >
                {t.table.itemName}
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 'count'}
                direction={sortBy === 'count' ? sortOrder : 'asc'}
                onClick={() => handleSort('count')}
              >
                {t.table.count}
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 'buyPrice'}
                direction={sortBy === 'buyPrice' ? sortOrder : 'asc'}
                onClick={() => handleSort('buyPrice')}
              >
                {t.table.buyPrice}
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 'buyCurrency'}
                direction={sortBy === 'buyCurrency' ? sortOrder : 'asc'}
                onClick={() => handleSort('buyCurrency')}
              >
                {t.table.buyCurrency}
              </TableSortLabel>
            </TableCell>
            <TableCell>{t.table.currentPrice}</TableCell>
            <TableCell>{t.table.profit}</TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 'game'}
                direction={sortBy === 'game' ? sortOrder : 'asc'}
                onClick={() => handleSort('game')}
              >
                {t.table.game}
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 'boughtDate'}
                direction={sortBy === 'boughtDate' ? sortOrder : 'asc'}
                onClick={() => handleSort('boughtDate')}
              >
                {t.table.boughtDate}
              </TableSortLabel>
            </TableCell>
            <TableCell>{t.table.actions}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedInvestments.map((item) => (
            <TableRow key={item.id} sx={{ '&:hover': { backgroundColor: 'action.hover' } }}>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {item.image && (
                    <img src={item.image} alt={item.name} style={{ width: 32, height: 32, marginRight: 8, borderRadius: 4 }} />
                  )}
                  <Tooltip title={t.viewDetails}>
                    <Typography 
                      variant="body2" 
                      onClick={() => handleItemDetailsOpen(item)}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': {
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      {item.name}
                    </Typography>
                  </Tooltip>
                </Box>
              </TableCell>
              <TableCell>{item.count}</TableCell>
              <TableCell>{renderValueInDisplayCurrency(item.buyPrice, item.buyCurrency)}</TableCell>
              <TableCell>{item.buyCurrency}</TableCell>
              <TableCell>
                {item.sold ? (
                  <Chip label={t.sold} color="info" size="small" />
                ) : item.currentPrice > 0 ? (
                  renderValueInDisplayCurrency(item.currentPrice, 'EUR')
                ) : (
                  <Chip label={t.pending} color="warning" size="small" />
                )}
              </TableCell>
              <TableCell>
                <Typography
                  variant="body2"
                  sx={{
                    color: item.sold 
                      ? (getNetProfit((convertCurrency(item.sellPrice, item.buyCurrency, exchangeRates) - convertCurrency(item.buyPrice, item.buyCurrency, exchangeRates)) * item.count, convertCurrency(item.sellPrice, item.buyCurrency, exchangeRates) * item.count, item.commissions) >= 0 ? theme.palette.success.main : theme.palette.error.main)
                      : (convertCurrency((item.currentPrice || 0) * item.count, 'EUR', displayCurrency, exchangeRates) - convertCurrency(item.buyPrice * item.count, item.buyCurrency, displayCurrency, exchangeRates) >= 0 ? theme.palette.success.main : theme.palette.error.main)
                  }}
                >
                  {item.sold 
                    ? `${getNetProfit((convertCurrency(item.sellPrice, item.buyCurrency, exchangeRates) - convertCurrency(item.buyPrice, item.buyCurrency, exchangeRates)) * item.count, convertCurrency(item.sellPrice, item.buyCurrency, exchangeRates) * item.count, item.commissions).toFixed(2)} ${CURRENCY_SYMBOLS[displayCurrency]}`
                    : `${(convertCurrency((item.currentPrice || 0) * item.count, 'EUR', displayCurrency, exchangeRates) - convertCurrency(item.buyPrice * item.count, item.buyCurrency, displayCurrency, exchangeRates)).toFixed(2)} ${CURRENCY_SYMBOLS[displayCurrency]}`
                  }
                </Typography>
              </TableCell>
              <TableCell>{item.game}</TableCell>
              <TableCell>{item.boughtDate}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleEdit(item)} size="small" color="primary">
                  <Edit size={20} />
                </IconButton>
                <IconButton onClick={() => confirmDelete(item)} size="small" color="error">
                  <Delete size={20} />
                </IconButton>
                {!item.sold && (
                  <IconButton onClick={() => { setItemToSell(item); setSellDialog(true); }} size="small" color="success">
                    <DollarSign size={20} />
                  </IconButton>
                )}
                {!item.sold && (
                  <IconButton onClick={() => handleCurrentPriceUpdate(item)} size="small" color="info">
                    <TrendingUp size={20} />
                  </IconButton>
                )}
                <IconButton onClick={() => handleMarketAnalysis(item)} size="small" color="secondary">
                  <BarChart size={20} />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Pagination count={pageCount} page={page} onChange={(event, value) => setPage(value)} color="primary" />
      </Box>
    </Box>
  );

  const totalSoldProfitInDisplayCurrency = convertCurrency(totalSoldProfit, 'EUR', displayCurrency, exchangeRates);
  const currentMarketProfitInDisplayCurrency = convertCurrency(currentMarketProfit, 'EUR', displayCurrency, exchangeRates);
  const totalInvestmentInDisplayCurrency = convertCurrency(totalInvestment, 'EUR', displayCurrency, exchangeRates);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary', p: 3 }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              {t.title}
            </Typography>
            <Box>
              <FormControl variant="outlined" sx={{ minWidth: 120, mr: 2 }}>
                <InputLabel>{t.displayCurrency}</InputLabel>
                <Select
                  value={displayCurrency}
                  onChange={handleDisplayCurrencyChange}
                  label={t.displayCurrency}
                >
                  {CURRENCIES.map((currency) => (
                    <MenuItem key={currency} value={currency}>
                      {currency}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <IconButton color="primary" onClick={handleAnalyticsOpen}>
                <BarChart />
              </IconButton>
              <IconButton
                color="primary"
                onClick={handleSettingsMenuClick}
              >
                <Settings />
              </IconButton>
              <Menu
                anchorEl={settingsAnchorEl}
                open={settingsMenuOpen}
                onClose={handleSettingsMenuClose}
              >
                <MenuItem onClick={() => setThemeMode(themeMode === 'light' ? 'dark' : 'light')}>
                  {t.toggleTheme}
                </MenuItem>
                <MenuItem>
                  <FormControlLabel
                    control={<Switch checked={autoUpdateEnabled} onChange={(e) => setAutoUpdateEnabled(e.target.checked)} />}
                    label={t.autoUpdatePrices}
                  />
                </MenuItem>
                <MenuItem onClick={fetchAndUpdateAllPrices}>
                  {t.updateAllPrices}
                </MenuItem>
              </Menu>
            </Box>
          </Box>

          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} sm={6} md={3}>
              <StyledMetricCard>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <DollarSign color={theme.palette.info.main} />
                    <Typography variant="h6" sx={{ ml: 1 }}>
                      {t.totalInvestment}
                    </Typography>
                  </Box>
                  <Typography variant="h5" fontWeight="bold">
                    {totalInvestmentInDisplayCurrency.toFixed(2)} {CURRENCY_SYMBOLS[displayCurrency]}
                  </Typography>
                </CardContent>
              </StyledMetricCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StyledMetricCard>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rocket color={theme.palette.primary.main} />
                    <Typography variant="h6" sx={{ ml: 1 }}>
                      {t.totalMarketValue}
                    </Typography>
                  </Box>
                  <Typography variant="h5" fontWeight="bold">
                    {totalMarketValue.toFixed(2)} {CURRENCY_SYMBOLS[displayCurrency]}
                  </Typography>
                </CardContent>
              </StyledMetricCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StyledMetricCard>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    {currentMarketProfit >= 0 ? <TrendingUp color={theme.palette.success.main} /> : <TrendingDown color={theme.palette.error.main} />}
                    <Typography variant="h6" sx={{ ml: 1 }}>
                      {t.currentMarketProfit}
                    </Typography>
                  </Box>
                  <Typography variant="h5" fontWeight="bold" sx={{ color: currentProfitColor }}>
                    {currentMarketProfitInDisplayCurrency.toFixed(2)} {CURRENCY_SYMBOLS[displayCurrency]}
                  </Typography>
                </CardContent>
              </StyledMetricCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StyledMetricCard>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    {realizedROI >= 0 ? <TrendingUp color={theme.palette.success.main} /> : <TrendingDown color={theme.palette.error.main} />}
                    <Typography variant="h6" sx={{ ml: 1 }}>
                      {t.realizedROI}
                    </Typography>
                  </Box>
                  <Typography variant="h5" fontWeight="bold" sx={{ color: realizedROIColor }}>
                    {realizedROI.toFixed(2)} %
                  </Typography>
                </CardContent>
              </StyledMetricCard>
            </Grid>
          </Grid>

          <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 4 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} aria-label="game tabs">
                <Tab label={t.all} value={0} />
                {GAMES.map((game, index) => (
                  <Tab label={game} value={index + 1} key={game} />
                ))}
              </Tabs>
            </Box>
            {renderTable()}
          </Paper>

          <Fab
            color="primary"
            aria-label="add"
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
            }}
            onClick={() => setAddDialog(true)}
          >
            <Plus />
          </Fab>

          <Dialog open={addDialog} onClose={() => setAddDialog(false)} PaperProps={{ sx: { borderRadius: 8 } }}>
            <DialogTitle>{t.addInvestment}</DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Autocomplete
                    value={autocompleteValue}
                    onChange={handleAutocompleteChange}
                    inputValue={name}
                    onInputChange={handleItemNameChange}
                    options={itemOptions}
                    loading={autocompleteLoading}
                    getOptionLabel={(option) => option.label || ""}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={t.itemName}
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
                        <img loading="lazy" width="20" src={option.image} alt="" />
                        {option.label}
                      </Box>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label={t.count}
                    type="number"
                    value={count}
                    onChange={(e) => setCount(e.target.value)}
                    fullWidth
                    margin="dense"
                    variant="outlined"
                    inputProps={{ min: 1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label={t.buyPrice}
                    type="number"
                    value={buyPrice}
                    onChange={(e) => setBuyPrice(e.target.value)}
                    fullWidth
                    margin="dense"
                    variant="outlined"
                    inputProps={{ min: 0 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="dense" variant="outlined">
                    <InputLabel>{t.buyCurrency}</InputLabel>
                    <Select
                      value={buyCurrency}
                      onChange={(e) => setBuyCurrency(e.target.value)}
                      label={t.buyCurrency}
                    >
                      {CURRENCIES.map(currency => (
                        <MenuItem key={currency} value={currency}>{currency}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label={t.game}
                    select
                    value={game}
                    onChange={(e) => setGame(e.target.value)}
                    fullWidth
                    margin="dense"
                    variant="outlined"
                  >
                    {GAMES.map(game => (
                      <MenuItem key={game} value={game}>{game}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label={t.boughtDate}
                    type="date"
                    value={boughtDate}
                    onChange={(e) => setBoughtDate(e.target.value)}
                    fullWidth
                    margin="dense"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setAddDialog(false)} color="secondary" variant="outlined" sx={{ borderRadius: 8 }}>
                {t.cancel}
              </Button>
              <Button onClick={addItem} color="primary" variant="contained" sx={{ borderRadius: 8 }}>
                {t.add}
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog open={editDialog} onClose={() => setEditDialog(false)} PaperProps={{ sx: { borderRadius: 8 } }}>
            <DialogTitle>{t.editInvestment}</DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label={t.itemName}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    margin="dense"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label={t.count}
                    type="number"
                    value={count}
                    onChange={(e) => setCount(e.target.value)}
                    fullWidth
                    margin="dense"
                    variant="outlined"
                    inputProps={{ min: 1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label={t.buyPrice}
                    type="number"
                    value={buyPrice}
                    onChange={(e) => setBuyPrice(e.target.value)}
                    fullWidth
                    margin="dense"
                    variant="outlined"
                    inputProps={{ min: 0 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label={t.game}
                    select
                    value={game}
                    onChange={(e) => setGame(e.target.value)}
                    fullWidth
                    margin="dense"
                    variant="outlined"
                  >
                    {GAMES.map(game => (
                      <MenuItem key={game} value={game}>{game}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label={t.boughtDate}
                    type="date"
                    value={boughtDate}
                    onChange={(e) => setBoughtDate(e.target.value)}
                    fullWidth
                    margin="dense"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditDialog(false)} color="secondary" variant="outlined" sx={{ borderRadius: 8 }}>
                {t.cancel}
              </Button>
              <Button onClick={saveEditedItem} color="primary" variant="contained" sx={{ borderRadius: 8 }}>
                {t.save}
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog open={sellDialog} onClose={() => setSellDialog(false)} PaperProps={{ sx: { borderRadius: 8 } }}>
            <DialogTitle>{t.markAsSold}</DialogTitle>
            <DialogContent dividers>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {t.confirmSell} <span style={{ fontWeight: 'bold' }}>{itemToSell?.name}</span>?
              </Typography>
              <TextField
                label={t.sellPrice}
                type="number"
                value={sellPrice}
                onChange={(e) => setSellPrice(e.target.value)}
                fullWidth
                margin="dense"
                variant="outlined"
                inputProps={{ min: 0 }}
              />
              <TextField
                label={t.sellDate}
                type="date"
                value={sellDate}
                onChange={(e) => setSellDate(e.target.value)}
                fullWidth
                margin="dense"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSellDialog(false)} color="secondary" variant="outlined" sx={{ borderRadius: 8 }}>
                {t.cancel}
              </Button>
              <Button onClick={markAsSold} color="success" variant="contained" sx={{ borderRadius: 8 }}>
                {t.confirm}
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} PaperProps={{ sx: { borderRadius: 8 } }}>
            <DialogTitle>{t.deleteInvestment}</DialogTitle>
            <DialogContent dividers>
              <Typography>{t.confirmDelete} <span style={{ fontWeight: 'bold' }}>{itemToDelete?.name}</span>?</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteDialogOpen(false)} color="secondary" variant="outlined" sx={{ borderRadius: 8 }}>
                {t.cancel}
              </Button>
              <Button onClick={handleDelete} color="error" variant="contained" sx={{ borderRadius: 8 }}>
                {t.delete}
              </Button>
            </DialogActions>
          </Dialog>
          
          <Dialog open={analyticsOpen} onClose={() => setAnalyticsOpen(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 8 } }}>
            <DialogTitle>{t.analyticsTitle}</DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <StyledCombinedCard>
                    <CardHeader title={t.totalProfitByDate} />
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={cumulativeProfit}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <ChartTooltip formatter={(value) => `${value.toFixed(2)} ${CURRENCY_SYMBOLS[displayCurrency]}`} />
                          <Legend />
                          <Line type="monotone" dataKey="profit" stroke={theme.palette.success.main} activeDot={{ r: 8 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </StyledCombinedCard>
                </Grid>
                <Grid item xs={12} md={6}>
                  <StyledCombinedCard>
                    <CardHeader title={t.profitByGame} />
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <RechartsBarChart data={profitByGameData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <ChartTooltip formatter={(value) => `${value.toFixed(2)} ${CURRENCY_SYMBOLS[displayCurrency]}`} />
                          <Legend />
                          <Bar dataKey="value" name={t.totalProfit}>
                            {
                              profitByGameData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.value >= 0 ? theme.palette.success.main : theme.palette.error.main} />
                              ))
                            }
                          </Bar>
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </StyledCombinedCard>
                </Grid>
                <Grid item xs={12} md={6}>
                  <StyledCombinedCard>
                    <CardHeader title={t.totalValueByGame} />
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={totalValueByGameData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            label
                          >
                            {
                              totalValueByGameData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                              ))
                            }
                          </Pie>
                          <ChartTooltip formatter={(value) => `${value.toFixed(2)} ${CURRENCY_SYMBOLS[displayCurrency]}`} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </StyledCombinedCard>
                </Grid>
                <Grid item xs={12} md={6}>
                  <StyledCombinedCard>
                    <CardHeader title={t.keyMetrics} />
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <TrendingUp size={20} color={theme.palette.success.main} />
                              <Typography variant="subtitle1" sx={{ ml: 1 }}>{t.totalSoldProfit}:</Typography>
                            </Box>
                            <Typography variant="body1" fontWeight="bold" sx={{ color: profitColor }}>
                              {totalSoldProfitInDisplayCurrency.toFixed(2)} {CURRENCY_SYMBOLS[displayCurrency]}
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={12}>
                          <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <TrendingUp size={20} color={theme.palette.success.main} />
                              <Typography variant="subtitle1" sx={{ ml: 1 }}>{t.unrealizedProfit}:</Typography>
                            </Box>
                            <Typography variant="body1" fontWeight="bold" sx={{ color: currentProfitColor }}>
                              {currentMarketProfitInDisplayCurrency.toFixed(2)} {CURRENCY_SYMBOLS[displayCurrency]}
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={12}>
                          <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Percent size={20} color={theme.palette.info.main} />
                              <Typography variant="subtitle1" sx={{ ml: 1 }}>{t.realizedROI}:</Typography>
                            </Box>
                            <Typography variant="body1" fontWeight="bold" sx={{ color: realizedROIColor }}>
                              {realizedROI.toFixed(2)} %
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={12}>
                          <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Percent size={20} color={theme.palette.info.main} />
                              <Typography variant="subtitle1" sx={{ ml: 1 }}>{t.unrealizedROI}:</Typography>
                            </Box>
                            <Typography variant="body1" fontWeight="bold" sx={{ color: unrealizedROIColor }}>
                              {unrealizedROI.toFixed(2)} %
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={12}>
                          <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Clock size={20} color={theme.palette.warning.main} />
                              <Typography variant="subtitle1" sx={{ ml: 1 }}>{t.averageHoldingPeriod}:</Typography>
                            </Box>
                            <Typography variant="body1" fontWeight="bold">
                              {averageHoldingPeriod.toFixed(1)} {t.days}
                            </Typography>
                          </Paper>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </StyledCombinedCard>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setAnalyticsOpen(false)} color="secondary" variant="outlined" sx={{ borderRadius: 8 }}>
                {t.close}
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog open={marketAnalysisDialog} onClose={() => setMarketAnalysisDialog(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 8 } }}>
            <DialogTitle>
              {t.marketAnalysisTitle} - {itemToAnalyze?.name}
              {analysisLoading && <LinearProgress sx={{ mt: 1 }} />}
            </DialogTitle>
            <DialogContent dividers>
              <Typography variant="body2" component="div" sx={{ whiteSpace: 'pre-wrap' }}>
                {analysisText}
              </Typography>
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
