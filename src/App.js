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

// NEW IMPORTS
import { getTheme, StyledCard, StyledMetricCard, StyledCombinedCard, CardHeader, CardFooter } from './theme';
import { GAMES, CURRENCIES, CURRENCY_SYMBOLS, EXCHANGERATE_API_KEY, BACKEND_URL, PROXY_SERVER_URL, ITEMS_PER_PAGE, PIE_COLORS } from './constants';
import CommissionManagerDialog from './components/CommissionManagerDialog';
import ItemDetailsDialog from './components/ItemDetailsDialog';
import { getGameFromItemName, getNetProfit } from './utils';

// ALL CODE FOR GETTING THEME AND STYLED COMPONENTS REMOVED
// ALL CODE FOR COMMISSIONMANAGERDIALOG AND ITEMDETAILSDIALOG REMOVED
// ALL CODE FOR CONSTANTS REMOVED

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

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: '100vh', pb: 4 }}>
        <Container maxWidth="xl" sx={{ pt: 0, pb: 4 }}>
          <Paper elevation={0} sx={{ py: 2, px: 3, mb: 4, borderRadius: 2, background: theme.palette.background.paper, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', }}>
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
                <Menu anchorEl={settingsAnchorEl} open={settingsMenuOpen} onClose={handleSettingsMenuClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }} transformOrigin={{ vertical: 'top', horizontal: 'right', }} >
                  <MenuItem onClick={(e) => e.stopPropagation()}>
                    <FormGroup>
                      <FormControlLabel control={<Switch checked={themeMode === 'dark'} onChange={(e) => setThemeMode(e.target.checked ? 'dark' : 'light')} />} label="Темна тема" />
                    </FormGroup>
                  </MenuItem>
                  <MenuItem onClick={(e) => e.stopPropagation()}>
                    <FormGroup>
                      <FormControlLabel control={<Switch checked={autoUpdateEnabled} onChange={(e) => setAutoUpdateEnabled(e.target.checked)} />} label="Автооновлення цін (кожні 15 хв)" />
                    </FormGroup>
                  </MenuItem>
                  <Divider />
                  <Typography variant="subtitle2" color="text.secondary" sx={{ pl: 2, pt: 1, pb: 0.5 }}>Валюта відображення</Typography>
                  {CURRENCIES.map(curr => (
                    <MenuItem key={curr} onClick={() => { setDisplayCurrency(curr); handleSettingsMenuClose(); }}>
                      {curr}
                      {displayCurrency === curr && <Check size={16} style={{ marginLeft: 8 }} />}
                    </MenuItem>
                  ))}
                  <Divider />
                  <Typography variant="subtitle2" color="text.secondary" sx={{ pl: 2, pt: 1, pb: 0.5 }}>Мова</Typography>
                  <MenuItem onClick={() => { setLang('uk'); handleSettingsMenuClose(); }}>
                    Українська {lang === 'uk' && <Check size={16} style={{ marginLeft: 8 }} />}
                  </MenuItem>
                  <MenuItem onClick={() => { setLang('en'); handleSettingsMenuClose(); }}>
                    English {lang === 'en' && <Check size={16} style={{ marginLeft: 8 }} />}
                  </MenuItem>
                </Menu>
                <Button variant="contained" color="primary" startIcon={<Plus />} onClick={() => setAddDialog(true)} sx={{ borderRadius: 8 }}>
                  {t.add}
                </Button>
              </Box>
            </Box>
          </Paper>

          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} md={6} lg={3}>
              <StyledMetricCard bgcolor={theme.palette.background.paper}>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <TrendingUp size={32} color={theme.palette.primary.main} />
                  <Typography variant="subtitle2" color="text.secondary" mt={1}>Загальні вкладення</Typography>
                  <Typography variant="h5" fontWeight="bold" mt={1}>
                    {totalInvestment.toFixed(2)} {CURRENCY_SYMBOLS[displayCurrency]}
                  </Typography>
                </Box>
              </StyledMetricCard>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <StyledMetricCard bgcolor={theme.palette.background.paper}>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <DollarSign size={32} color={profitColor} />
                  <Typography variant="subtitle2" color="text.secondary" mt={1}>Реалізований прибуток</Typography>
                  <Typography variant="h5" fontWeight="bold" mt={1} color={profitColor}>
                    {totalSoldProfit.toFixed(2)} {CURRENCY_SYMBOLS[displayCurrency]}
                  </Typography>
                </Box>
              </StyledMetricCard>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <StyledMetricCard bgcolor={theme.palette.background.paper}>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <TrendingUp size={32} color={currentProfitColor} />
                  <Typography variant="subtitle2" color="text.secondary" mt={1}>Нереалізований прибуток</Typography>
                  <Typography variant="h5" fontWeight="bold" mt={1} color={currentProfitColor}>
                    {currentMarketProfit.toFixed(2)} {CURRENCY_SYMBOLS[displayCurrency]}
                  </Typography>
                </Box>
              </StyledMetricCard>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <StyledMetricCard bgcolor={theme.palette.background.paper}>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Percent size={32} color={realizedROIColor} />
                  <Typography variant="subtitle2" color="text.secondary" mt={1}>Реалізований ROI</Typography>
                  <Typography variant="h5" fontWeight="bold" mt={1} color={realizedROIColor}>
                    {realizedROI.toFixed(2)}%
                  </Typography>
                </Box>
              </StyledMetricCard>
            </Grid>
          </Grid>

          <Paper sx={{ mb: 4, borderRadius: 3, p: 3 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} aria-label="game tabs">
                {GAMES.map((gameName, index) => (
                  <Tab label={gameName} key={gameName} />
                ))}
              </Tabs>
            </Box>
            <Grid container spacing={3}>
              {paginatedInvestments.map(item => (
                <Grid item xs={12} sm={6} md={4} key={item.id}>
                  <StyledCard onClick={() => handleItemDetailsOpen(item)}>
                    <CardContent>
                      <CardHeader>
                        <Box display="flex" alignItems="center" gap={1}>
                          {item.image && <img src={item.image} alt={item.name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />}
                          <Typography variant="h6">{item.name.replace(/\*/g, '')}</Typography>
                        </Box>
                        <Tooltip title={t.updatePrice}>
                          <IconButton onClick={(e) => { e.stopPropagation(); handleCurrentPriceUpdate(item); }}>
                            <Zap size={18} />
                          </IconButton>
                        </Tooltip>
                      </CardHeader>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="body2" color="text.secondary">{t.count}</Typography>
                      <Typography variant="h5" fontWeight="bold">{item.count}</Typography>
                      <Box mt={2}>
                        <Typography variant="body2" color="text.secondary">
                          {t.buyPrice}
                        </Typography>
                        <Typography variant="h6" fontWeight="bold">
                          {convertCurrency(item.buyPrice, item.buyCurrency).toFixed(2)} {CURRENCY_SYMBOLS[displayCurrency]}
                        </Typography>
                      </Box>
                      <Box mt={2}>
                        <Typography variant="body2" color="text.secondary">
                          {t.currentPrice}
                        </Typography>
                        <Typography variant="h6" fontWeight="bold">
                          {item.currentPrice ? convertCurrency(item.currentPrice, 'EUR').toFixed(2) : '-'} {item.currentPrice ? CURRENCY_SYMBOLS[displayCurrency] : ''}
                        </Typography>
                      </Box>
                    </CardContent>
                    <CardFooter>
                      <Chip label={item.game} size="small" color="primary" />
                      <Box display="flex" gap={1}>
                        <Tooltip title="Управління комісіями">
                          <IconButton size="small" onClick={(e) => handleCommissionManagerOpen(e, item)}>
                            <Tag size={16} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t.delete}>
                          <IconButton size="small" onClick={(e) => { e.stopPropagation(); confirmDelete(item); }} color="error">
                            <Delete size={16} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </CardFooter>
                  </StyledCard>
                </Grid>
              ))}
            </Grid>
            <Box mt={4} display="flex" justifyContent="center">
              <Pagination
                count={pageCount}
                page={page}
                onChange={(event, value) => setPage(value)}
                color="primary"
                showFirstButton
                showLastButton
              />
            </Box>
          </Paper>

          {/* Dialogs and other components */}
          <Dialog open={addDialog} onClose={() => { setAddDialog(false); resetForm(); }} maxWidth="md" fullWidth PaperProps={{ style: { borderRadius: 16 } }}>
            <DialogTitle sx={{ textAlign: 'center' }}>
              <Typography variant="h5" fontWeight="bold" color="primary">{t.addDialogTitle}</Typography>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <Autocomplete
                      id="item-search-autocomplete"
                      options={itemOptions}
                      getOptionLabel={(option) => typeof option === 'string' ? option : option.label}
                      isOptionEqualToValue={(option, value) => option.label === value.label}
                      onInputChange={handleItemNameChange}
                      onChange={handleAutocompleteChange}
                      value={autocompleteValue}
                      loading={autocompleteLoading}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={t.itemName}
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
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label={t.itemCount}
                    type="number"
                    value={count}
                    onChange={(e) => setCount(e.target.value)}
                    fullWidth
                    required
                    InputProps={{ inputProps: { min: 1 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>{t.buyCurrency}</InputLabel>
                    <Select
                      value={buyCurrency}
                      label={t.buyCurrency}
                      onChange={(e) => setBuyCurrency(e.target.value)}
                    >
                      {CURRENCIES.map(curr => (
                        <MenuItem key={curr} value={curr}>{curr}</MenuItem>
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
                  <TextField
                    label={t.game}
                    value={game}
                    onChange={(e) => setGame(e.target.value)}
                    fullWidth
                    select
                  >
                    {GAMES.slice(1).map(gameName => (
                      <MenuItem key={gameName} value={gameName}>{gameName}</MenuItem>
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
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={() => { setAddDialog(false); resetForm(); }} color="secondary" variant="outlined" sx={{ borderRadius: 8 }}>
                {t.cancel}
              </Button>
              <Button onClick={addItem} color="primary" variant="contained" sx={{ borderRadius: 8 }}>
                {t.add}
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog open={editDialog} onClose={() => { setEditDialog(false); resetForm(); }} maxWidth="md" fullWidth PaperProps={{ style: { borderRadius: 16 } }}>
            <DialogTitle sx={{ textAlign: 'center' }}>
              <Typography variant="h5" fontWeight="bold" color="primary">{t.editDialogTitle}</Typography>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label={t.itemName}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    required
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label={t.itemCount}
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
                  <TextField
                    label={t.game}
                    value={game}
                    onChange={(e) => setGame(e.target.value)}
                    fullWidth
                    select
                    disabled
                  >
                    {GAMES.slice(1).map(gameName => (
                      <MenuItem key={gameName} value={gameName}>{gameName}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
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
            <DialogActions sx={{ p: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={() => { setEditDialog(false); resetForm(); }} color="secondary" variant="outlined" sx={{ borderRadius: 8 }}>
                {t.cancel}
              </Button>
              <Button onClick={saveEditedItem} color="primary" variant="contained" sx={{ borderRadius: 8 }}>
                {t.save}
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" PaperProps={{ style: { borderRadius: 16 } }}>
            <DialogTitle sx={{ textAlign: 'center' }}>
              <Typography variant="h5" fontWeight="bold" color="primary">{t.deleteDialogTitle}</Typography>
            </DialogTitle>
            <DialogContent dividers sx={{ textAlign: 'center' }}>
              <Typography>
                {t.deleteDialogText}
              </Typography>
              <Typography variant="body1" fontWeight="bold" mt={2}>
                **{itemToDelete?.name.replace(/\*/g, '')}**
              </Typography>
            </DialogContent>
            <DialogActions sx={{ p: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={() => setDeleteDialogOpen(false)} color="secondary" variant="outlined" sx={{ borderRadius: 8 }}>
                {t.cancel}
              </Button>
              <Button onClick={handleDelete} color="error" variant="contained" sx={{ borderRadius: 8 }}>
                {t.deleteConfirm}
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog open={sellDialog} onClose={() => { setSellDialog(false); resetForm(); }} maxWidth="xs" PaperProps={{ style: { borderRadius: 16 } }}>
            <DialogTitle sx={{ textAlign: 'center' }}>
              <Typography variant="h5" fontWeight="bold" color="primary">{t.sellDialogTitle}</Typography>
            </DialogTitle>
            <DialogContent dividers>
              <Typography variant="body1" color="text.secondary" textAlign="center" mb={2}>
                Закрити операцію для предмета:<br />**{itemToSell?.name.replace(/\*/g, '')}**
              </Typography>
              <TextField
                label={t.sellPrice}
                type="number"
                value={sellPrice}
                onChange={(e) => setSellPrice(e.target.value)}
                fullWidth
                required
                InputProps={{ inputProps: { min: 0 } }}
                sx={{ mb: 2 }}
              />
              <TextField
                label={t.sellDate}
                type="date"
                value={sellDate}
                onChange={(e) => setSellDate(e.target.value)}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
            </DialogContent>
            <DialogActions sx={{ p: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={() => { setSellDialog(false); resetForm(); }} color="secondary" variant="outlined" sx={{ borderRadius: 8 }}>
                {t.cancel}
              </Button>
              <Button onClick={markAsSold} color="success" variant="contained" sx={{ borderRadius: 8 }}>
                {t.sellConfirm}
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog open={analyticsOpen} onClose={() => setAnalyticsOpen(false)} maxWidth="lg" fullWidth PaperProps={{ style: { borderRadius: 16 } }}>
            <DialogTitle sx={{ textAlign: 'center', pb: 0 }}>
              <Typography variant="h5" fontWeight="bold" color="primary">{t.analyticsTitle}</Typography>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <StyledCombinedCard sx={{ p: 2, height: '100%' }}>
                    <Typography variant="h6" fontWeight="bold" mb={2} textAlign="center">
                      Загальна динаміка прибутку
                    </Typography>
                    {cumulativeProfit.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={cumulativeProfit}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <ChartTooltip />
                          <Legend />
                          <Line type="monotone" dataKey="profit" stroke="#4A148C" name="Сукупний прибуток" />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                        <Typography color="text.secondary">
                          Недостатньо даних для побудови графіку
                        </Typography>
                      </Box>
                    )}
                  </StyledCombinedCard>
                </Grid>
                <Grid item xs={12} md={6}>
                  <StyledCombinedCard sx={{ p: 2, height: '100%' }}>
                    <Typography variant="h6" fontWeight="bold" mb={2} textAlign="center">
                      Розподіл інвестицій по іграх
                    </Typography>
                    {investmentDistributionData.length > 0 ? (
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
                    ) : (
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                        <Typography color="text.secondary">
                          Недостатньо даних для побудови діаграми
                        </Typography>
                      </Box>
                    )}
                  </StyledCombinedCard>
                </Grid>
                <Grid item xs={12}>
                  <StyledCombinedCard sx={{ p: 2 }}>
                    <Typography variant="h6" fontWeight="bold" mb={2} textAlign="center">
                      Прибуток по іграх
                    </Typography>
                    {profitByGameData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <RechartsBarChart data={profitByGameData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <ChartTooltip />
                          <Legend />
                          <Bar dataKey="profit" name="Загальний прибуток" fill="#4A148C" />
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    ) : (
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                        <Typography color="text.secondary">
                          Недостатньо даних для побудови графіку
                        </Typography>
                      </Box>
                    )}
                  </StyledCombinedCard>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button
                onClick={() => setAnalyticsOpen(false)}
                color="secondary"
                variant="outlined"
                sx={{ borderRadius: 8 }}
              >
                Закрити
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog open={marketAnalysisDialog} onClose={() => setMarketAnalysisDialog(false)} maxWidth="sm" fullWidth PaperProps={{ style: { borderRadius: 16 } }}>
            <DialogTitle sx={{ textAlign: 'center' }}>
              <Typography variant="h5" fontWeight="bold" color="primary">Аналіз ринку</Typography>
            </DialogTitle>
            <DialogContent dividers>
              {analysisLoading ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
                  <CircularProgress color="primary" />
                  <Typography variant="body1" color="text.secondary" mt={2}>
                    Генеруємо аналіз для **{itemToAnalyze?.name}**...
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body2" component="div" sx={{ whiteSpace: 'pre-line' }}>
                  {analysisText}
                </Typography>
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
            t={t}
            theme={theme}
            convertCurrency={convertCurrency}
            displayCurrency={displayCurrency}
            confirmDelete={confirmDelete}
            handleCurrentPriceUpdate={handleCurrentPriceUpdate}
            handleEdit={handleEdit}
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