import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  IconButton,
  Snackbar,
  Alert,
  Grid,
  Card,
  CardContent,
  Chip,
  Tooltip,
  Autocomplete,
  CircularProgress,
  Divider,
  AppBar,
  Toolbar,
} from "@mui/material";
import { TrendingUp, Delete, Check, BarChart, Plus, Language, Euro, AttachMoney, CurrencyExchange } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip as ChartTooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";

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
  },
  typography: {
    fontFamily: ['Poppins', 'Inter', 'sans-serif'].join(','),
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
      fontSize: '2.5rem',
    },
    h6: {
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: theme.spacing(2),
        },
      },
    },
  },
});

// Стилізовані компоненти
const GradientText = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 700,
}));

const StyledCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, rgba(255,255,255,0.8) 100%)`,
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255,255,255,0.2)',
  transition: 'all 0.3s ease-in-out',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  padding: theme.spacing(2),
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const GAMES = ["Усі", "CS2", "Dota 2", "PUBG"];
const CURRENCIES = ["EUR", "USD", "UAH"];
const CURRENCY_SYMBOLS = { "EUR": "€", "USD": "$", "UAH": "₴" };

const LANGUAGES = {
  uk: {
    portfolio: "Портфель інвестицій",
    name: "Назва предмета",
    count: "Кількість",
    buyPrice: "Ціна купівлі (за шт.)",
    game: "Гра",
    boughtDate: "Дата купівлі",
    action: "Дії",
    addItem: "Додати інвестицію",
    save: "Зберегти",
    cancel: "Скасувати",
    sold: "Продано",
    yes: "Так",
    no: "Ні",
    sellPrice: "Ціна продажу (за шт.)",
    sellDate: "Дата продажу",
    editItem: "Редагувати предмет",
    deleteConfirmation: "Ви впевнені, що хочете видалити цей предмет?",
    delete: "Видалити",
    totalInvestment: "Загальні інвестиції",
    profit: "Прибуток",
    percentageProfit: "Процентний прибуток",
    analytics: "Аналітика",
    noData: "Немає даних для відображення.",
    noInvestments: "Немає інвестицій у цій категорії.",
    itemAdded: "Предмет успішно додано!",
    itemUpdated: "Предмет успішно оновлено!",
    itemDeleted: "Предмет успішно видалено!",
    fetchError: "Помилка при отриманні даних з API.",
    addInvestment: "Додати нову інвестицію",
    markAsSold: "Відмітити як продано",
    total: "Усі",
    currency: "Валюта",
    displayCurrency: "Валюта відображення",
    language: "Мова",
    priceHistory: "Історія ціни",
    loadingData: "Завантаження даних...",
  },
  en: {
    portfolio: "Investment Portfolio",
    name: "Item Name",
    count: "Count",
    buyPrice: "Buy Price (per item)",
    game: "Game",
    boughtDate: "Purchase Date",
    action: "Actions",
    addItem: "Add Investment",
    save: "Save",
    cancel: "Cancel",
    sold: "Sold",
    yes: "Yes",
    no: "No",
    sellPrice: "Sell Price (per item)",
    sellDate: "Sell Date",
    editItem: "Edit Item",
    deleteConfirmation: "Are you sure you want to delete this item?",
    delete: "Delete",
    totalInvestment: "Total Investments",
    profit: "Profit",
    percentageProfit: "Percentage Profit",
    analytics: "Analytics",
    noData: "No data to display.",
    noInvestments: "No investments in this category.",
    itemAdded: "Item added successfully!",
    itemUpdated: "Item updated successfully!",
    itemDeleted: "Item deleted successfully!",
    fetchError: "Error fetching data from API.",
    addInvestment: "Add New Investment",
    markAsSold: "Mark as Sold",
    total: "All",
    currency: "Currency",
    displayCurrency: "Display Currency",
    language: "Language",
    priceHistory: "Price History",
    loadingData: "Loading data...",
  },
};

const PROXY_SERVER_URL = "https://steam-proxy-server-lues.onrender.com";
const EXCHANGE_RATE_API_KEY = "61a8a12c18b1b14a645ebc37";

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
  const [profitByDate, setProfitByDate] = useState([]);
  const [addDialog, setAddDialog] = useState(false);
  const [sellDialog, setSellDialog] = useState(false);
  const [itemToSell, setItemToSell] = useState(null);
  const [sellPrice, setSellPrice] = useState(0);
  const [sellDate, setSellDate] = useState(new Date().toISOString().split('T')[0]);
  const [totalProfit, setTotalProfit] = useState(0);
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [soldItems, setSoldItems] = useState([]);
  const [lang, setLang] = useState('uk');
  const [displayCurrency, setDisplayCurrency] = useState('EUR');
  const [currencyRates, setCurrencyRates] = useState(null);
  const [autocompleteLoading, setAutocompleteLoading] = useState(false);
  const [itemOptions, setItemOptions] = useState([]);
  const abortControllerRef = useRef(null);
  const [autocompleteValue, setAutocompleteValue] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const t = LANGUAGES[lang];

  useEffect(() => {
    const savedInvestments = localStorage.getItem("investments");
    if (savedInvestments) {
      setInvestments(JSON.parse(savedInvestments));
    }
    const savedLang = localStorage.getItem("lang");
    if (savedLang) {
        setLang(savedLang);
    }
    const savedDisplayCurrency = localStorage.getItem("displayCurrency");
    if (savedDisplayCurrency) {
        setDisplayCurrency(savedDisplayCurrency);
    }

    fetchCurrencyRates(savedDisplayCurrency || 'EUR');
  }, []);

  useEffect(() => {
    if (currencyRates) {
      localStorage.setItem("investments", JSON.stringify(investments));
      updateAnalytics();
    }
  }, [investments, displayCurrency, currencyRates]);

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  useEffect(() => {
    if (displayCurrency) {
      localStorage.setItem("displayCurrency", displayCurrency);
      fetchCurrencyRates(displayCurrency);
    }
  }, [displayCurrency]);

  const fetchCurrencyRates = async (baseCurrency) => {
    if (!EXCHANGE_RATE_API_KEY) {
        console.error("Exchange Rate API Key is missing.");
        setIsLoading(false);
        return;
    }
    setIsLoading(true);
    try {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${EXCHANGE_RATE_API_KEY}/latest/${baseCurrency}`);
        const data = await response.json();
        if (data.result === 'success') {
            setCurrencyRates(data.conversion_rates);
        } else {
            console.error("Error fetching currency rates:", data['error-type']);
            showSnackbar(t.fetchError, "error");
        }
    } catch (error) {
        console.error("Failed to fetch currency rates:", error);
        showSnackbar(t.fetchError, "error");
    } finally {
        setIsLoading(false);
    }
  };

  const convertCurrency = (amount, fromCurrency, toCurrency) => {
    if (!currencyRates || !currencyRates[fromCurrency] || !currencyRates[toCurrency]) {
      return amount; // Fallback to original amount if rates are not available
    }
    if (fromCurrency === toCurrency) {
      return amount;
    }
    const rateToDisplay = currencyRates[toCurrency] / currencyRates[fromCurrency];
    return amount * rateToDisplay;
  };

  const updateAnalytics = () => {
    const sold = investments.filter(item => item.sold);
    setSoldItems(sold);
    
    if (!currencyRates) {
      setTotalInvestment(0);
      setTotalProfit(0);
      setProfitByDate([]);
      return;
    }

    const totalInvest = investments.reduce((sum, item) => {
        const convertedPrice = convertCurrency(item.buyPrice * item.count, item.buyCurrency, displayCurrency);
        return sum + convertedPrice;
    }, 0);

    const totalProfitAmount = sold.reduce((sum, item) => {
        const convertedBuyPrice = convertCurrency(item.buyPrice, item.buyCurrency, displayCurrency);
        const convertedSellPrice = convertCurrency(item.sellPrice, item.buyCurrency, displayCurrency);
        return sum + (convertedSellPrice - convertedBuyPrice) * item.count;
    }, 0);

    setTotalInvestment(totalInvest);
    setTotalProfit(totalProfitAmount);

    const profitData = sold
      .map(item => {
          const convertedBuyPrice = convertCurrency(item.buyPrice, item.buyCurrency, displayCurrency);
          const convertedSellPrice = convertCurrency(item.sellPrice, item.buyCurrency, displayCurrency);
          const profit = (convertedSellPrice - convertedBuyPrice) * item.count;
          return { date: item.sellDate, profit };
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    const aggregatedProfit = profitData.reduce((acc, curr) => {
      const existing = acc.find(p => p.date === curr.date);
      if (existing) {
        existing.profit += curr.profit;
      } else {
        acc.push(curr);
      }
      return acc;
    }, []);

    let runningTotal = 0;
    const cumulativeProfit = aggregatedProfit.map(p => {
      runningTotal += p.profit;
      return { ...p, profit: runningTotal };
    });
    setProfitByDate(cumulativeProfit);
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
        const formattedOptions = data.map(item => ({ label: item.name, value: item.name }));
        
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
    if (newValue) {
        setName(newValue.label);
    } else {
        setName('');
    }
  };

  const addItem = () => {
    if (!name || count <= 0 || buyPrice <= 0 || !boughtDate) {
      showSnackbar("Будь ласка, заповніть всі обов'язкові поля.", "error");
      return;
    }

    const newItem = {
      id: Date.now(),
      name,
      count: Number(count),
      buyPrice: Number(buyPrice),
      game: tabValue === 0 ? game : GAMES[tabValue],
      boughtDate,
      buyCurrency,
      sold: false,
      sellPrice: 0,
      sellDate: null,
    };

    setInvestments([...investments, newItem]);
    showSnackbar(t.itemAdded, "success");
    resetForm();
    setAddDialog(false);
  };

  const markAsSold = () => {
    if (!itemToSell || sellPrice <= 0 || !sellDate) {
      showSnackbar("Будь ласка, заповніть всі поля.", "error");
      return;
    }

    const updatedInvestments = investments.map(item =>
      item.id === itemToSell.id
        ? { ...item, sold: true, sellPrice: Number(sellPrice), sellDate: sellDate }
        : item
    );

    setInvestments(updatedInvestments);
    showSnackbar(t.itemUpdated, "success");
    setSellDialog(false);
    resetForm();
  };
  
  const confirmDelete = (item) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const deleteItem = () => {
    setInvestments(investments.filter((item) => item.id !== itemToDelete.id));
    setDeleteDialogOpen(false);
    setItemToDelete(null);
    showSnackbar(t.itemDeleted, "success");
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
  const profit = totalProfit;
  const percentageProfit = totalInvestment > 0 ? (profit / totalInvestment) * 100 : 0;
  const profitColor = profit >= 0 ? '#28A745' : '#DC3545';
  const displaySymbol = CURRENCY_SYMBOLS[displayCurrency];

  if (isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh', 
            flexDirection: 'column',
            gap: 2
          }}
        >
          <CircularProgress color="primary" />
          <Typography variant="h6" color="text.secondary">
            {t.loadingData}
          </Typography>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static" color="transparent" elevation={0} sx={{ py: 1, borderBottom: '1px solid #e0e0e0' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <GradientText variant="h6" component="div">
            {t.portfolio}
          </GradientText>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <FormControl variant="outlined" size="small" sx={{ minWidth: 100 }}>
                <InputLabel>{t.language}</InputLabel>
                <Select
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  label={t.language}
                >
                  <MenuItem value="uk">Українська</MenuItem>
                  <MenuItem value="en">English</MenuItem>
                </Select>
            </FormControl>
            <FormControl variant="outlined" size="small" sx={{ minWidth: 100 }}>
                <InputLabel>{t.displayCurrency}</InputLabel>
                <Select
                  value={displayCurrency}
                  onChange={(e) => setDisplayCurrency(e.target.value)}
                  label={t.displayCurrency}
                >
                  {CURRENCIES.map((currency) => (
                      <MenuItem key={currency} value={currency}>{currency}</MenuItem>
                  ))}
                </Select>
            </FormControl>
            <Button variant="outlined" startIcon={<BarChart />} onClick={handleAnalyticsOpen}>
              {t.analytics}
            </Button>
            <Button variant="contained" color="primary" startIcon={<Plus />} onClick={() => setAddDialog(true)}>
              {t.addItem}
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ pt: 4, pb: 8, backgroundColor: theme.palette.background.default, minHeight: 'calc(100vh - 64px)' }}>
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={4}>
            <StyledCard>
              <CardContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{t.totalInvestment}</Typography>
                <Typography variant="h5" fontWeight="bold">{totalInvestment.toFixed(2)}{displaySymbol}</Typography>
              </CardContent>
            </StyledCard>
          </Grid>
          <Grid item xs={12} sm={4}>
            <StyledCard>
              <CardContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{t.profit}</Typography>
                <Typography variant="h5" fontWeight="bold" sx={{ color: profitColor }}>
                  {profit.toFixed(2)}{displaySymbol}
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
          <Grid item xs={12} sm={4}>
            <StyledCard>
              <CardContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{t.percentageProfit}</Typography>
                <Typography variant="h5" fontWeight="bold" sx={{ color: profitColor }}>
                  {percentageProfit.toFixed(2)}%
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>
        <Box mb={4}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} aria-label="game tabs">
            {GAMES.map((gameName, index) => (
              <Tab key={index} label={gameName === "Усі" ? t.total : gameName} />
            ))}
          </Tabs>
        </Box>
        <Box sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>{t.name}</StyledTableCell>
                <StyledTableCell>{t.game}</StyledTableCell>
                <StyledTableCell>{t.count}</StyledTableCell>
                <StyledTableCell>{t.buyPrice}</StyledTableCell>
                <StyledTableCell>{t.boughtDate}</StyledTableCell>
                <StyledTableCell>{t.profit}</StyledTableCell>
                <StyledTableCell>{t.action}</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredInvestments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body1" color="text.secondary">
                      {t.noInvestments}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredInvestments.map((item) => {
                  const buyPriceInDisplayCurrency = convertCurrency(item.buyPrice, item.buyCurrency, displayCurrency);
                  const sellPriceInDisplayCurrency = item.sold ? convertCurrency(item.sellPrice, item.buyCurrency, displayCurrency) : 0;
                  const itemProfit = item.sold ? ((sellPriceInDisplayCurrency - buyPriceInDisplayCurrency) * item.count) : 0;
                  const itemProfitColor = itemProfit >= 0 ? 'success' : 'error';

                  return (
                    <TableRow key={item.id} hover>
                      <StyledTableCell>
                        <Tooltip title={item.name}>
                          <Typography noWrap sx={{ maxWidth: 200 }}>
                            {item.name}
                          </Typography>
                        </Tooltip>
                      </StyledTableCell>
                      <StyledTableCell>{item.game}</StyledTableCell>
                      <StyledTableCell>{item.count}</StyledTableCell>
                      <StyledTableCell>
                        <Tooltip title={`${item.buyPrice}${CURRENCY_SYMBOLS[item.buyCurrency]}`}>
                          <Typography noWrap>
                            {buyPriceInDisplayCurrency.toFixed(2)}{displaySymbol}
                          </Typography>
                        </Tooltip>
                      </StyledTableCell>
                      <StyledTableCell>{item.boughtDate}</StyledTableCell>
                      <StyledTableCell>
                        <Chip
                          label={
                            item.sold
                              ? `${itemProfit.toFixed(2)}${displaySymbol}`
                              : "---"
                          }
                          color={item.sold ? itemProfitColor : 'default'}
                          variant={item.sold ? 'filled' : 'outlined'}
                        />
                      </StyledTableCell>
                      <StyledTableCell>
                        {!item.sold && (
                          <Tooltip title={t.markAsSold}>
                            <IconButton onClick={() => { setItemToSell(item); setSellDialog(true); }}>
                              <Check color="success" />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title={t.delete}>
                          <IconButton onClick={() => confirmDelete(item)}>
                            <Delete color="error" />
                          </IconButton>
                        </Tooltip>
                      </StyledTableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Box>

        {/* Dialog для додавання інвестиції */}
        <Dialog open={addDialog} onClose={() => { setAddDialog(false); resetForm(); }} maxWidth="sm" fullWidth>
          <DialogTitle>{t.addInvestment}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Autocomplete
                  freeSolo
                  options={itemOptions}
                  loading={autocompleteLoading}
                  value={autocompleteValue}
                  onChange={handleAutocompleteChange}
                  onInputChange={handleItemNameChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t.name}
                      variant="outlined"
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
                />
              </Grid>
              {tabValue === 0 && (
                <Grid item xs={12}>
                  <FormControl variant="outlined" fullWidth required>
                    <InputLabel>{t.game}</InputLabel>
                    <Select
                      value={game}
                      onChange={(e) => setGame(e.target.value)}
                      label={t.game}
                    >
                      {GAMES.slice(1).map((gameOption) => (
                        <MenuItem key={gameOption} value={gameOption}>
                          {gameOption}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}
              <Grid item xs={12} sm={6}>
                <TextField
                  label={t.count}
                  type="number"
                  variant="outlined"
                  fullWidth
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  required
                  inputProps={{ min: 1 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center">
                  <TextField
                    label={t.buyPrice}
                    type="number"
                    variant="outlined"
                    fullWidth
                    value={buyPrice}
                    onChange={(e) => setBuyPrice(Number(e.target.value))}
                    required
                    inputProps={{ min: 0 }}
                  />
                  <FormControl variant="outlined" sx={{ minWidth: 80, ml: 1 }}>
                      <InputLabel>{t.currency}</InputLabel>
                      <Select
                        value={buyCurrency}
                        onChange={(e) => setBuyCurrency(e.target.value)}
                        label={t.currency}
                      >
                        {CURRENCIES.map((currency) => (
                            <MenuItem key={currency} value={currency}>{currency}</MenuItem>
                        ))}
                      </Select>
                  </FormControl>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label={t.boughtDate}
                  type="date"
                  variant="outlined"
                  fullWidth
                  value={boughtDate}
                  onChange={(e) => setBoughtDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { setAddDialog(false); resetForm(); }}>{t.cancel}</Button>
            <Button onClick={addItem} color="primary" variant="contained">{t.addItem}</Button>
          </DialogActions>
        </Dialog>

        {/* Dialog для відмітки "Продано" */}
        <Dialog open={sellDialog} onClose={() => { setSellDialog(false); resetForm(); }} maxWidth="sm" fullWidth>
          <DialogTitle>{t.markAsSold}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6">Предмет: {itemToSell?.name}</Typography>
                <Typography variant="body1" color="text.secondary">
                  Ціна купівлі: {itemToSell?.buyPrice}{CURRENCY_SYMBOLS[itemToSell?.buyCurrency]}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label={t.sellPrice}
                  type="number"
                  variant="outlined"
                  fullWidth
                  value={sellPrice}
                  onChange={(e) => setSellPrice(Number(e.target.value))}
                  required
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label={t.sellDate}
                  type="date"
                  variant="outlined"
                  fullWidth
                  value={sellDate}
                  onChange={(e) => setSellDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { setSellDialog(false); resetForm(); }}>{t.cancel}</Button>
            <Button onClick={markAsSold} color="success" variant="contained">{t.save}</Button>
          </DialogActions>
        </Dialog>

        {/* Dialog для підтвердження видалення */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle>{t.deleteConfirmation}</DialogTitle>
          <DialogContent>
            <Typography variant="body1" mb={2}>
              Ви дійсно хочете видалити інвестицію "{itemToDelete?.name}"?
            </Typography>
            <Divider />
            <Box mt={2}>
              <Typography variant="body2" color="text.secondary">
                Ця дія незворотня.
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>{t.cancel}</Button>
            <Button onClick={deleteItem} color="error" variant="contained">{t.delete}</Button>
          </DialogActions>
        </Dialog>

        {/* Dialog для аналітики */}
        <Dialog open={analyticsOpen} onClose={() => setAnalyticsOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>{t.analytics}</DialogTitle>
          <DialogContent>
            <Typography variant="h6" mb={1}>{t.totalInvestment} ({t.sold}): {totalInvestment.toFixed(2)}{displaySymbol}</Typography>
            <Typography variant="h6" mb={1}>{t.profit} ({t.sold}): {totalProfit.toFixed(2)}{displaySymbol}</Typography>
            <Box mt={4}>
              <Typography variant="h6" mb={2}>{t.priceHistory}</Typography>
            </Box>
            {profitByDate.length === 0 ? (
              <Typography variant="body1" align="center" color="text.secondary">
                {t.noData}
              </Typography>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={profitByDate}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="#4A148C"
                    activeDot={{ r: 8 }}
                    name={t.profit}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAnalyticsOpen(false)}>{t.cancel}</Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar для сповіщень */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3500}
          onClose={closeSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={closeSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
}
