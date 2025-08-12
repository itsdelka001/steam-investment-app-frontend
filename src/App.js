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
} from "@mui/material";
import { TrendingUp, Delete, Check, BarChart, Plus, Language } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip as ChartTooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";

// Визначення теми для Material UI
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
    h2: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 700,
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
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
  },
});

// Стилізовані компоненти з Material UI
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
  padding: theme.spacing(2),
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(4),
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
  color: theme.palette.common.white,
  textAlign: 'center',
  fontWeight: 'bold',
  padding: theme.spacing(2),
  borderRadius: '16px 16px 0 0',
}));

// Константи для гри, валют та мов
const GAMES = ["Усі", "CS2", "Dota 2", "PUBG"];
const CURRENCIES = ["EUR", "USD", "UAH"];
const CURRENCY_SYMBOLS = { "EUR": "€", "USD": "$", "UAH": "₴" };
const LANGUAGES = {
  uk: {
    portfolio: "Портфель інвестицій",
    name: "Назва предмета",
    count: "Кількість",
    buyPrice: "Ціна купівлі",
    game: "Гра",
    boughtDate: "Дата купівлі",
    action: "Дії",
    addItem: "Додати інвестицію",
    save: "Зберегти",
    cancel: "Скасувати",
    sold: "Продано",
    yes: "Так",
    no: "Ні",
    sellPrice: "Ціна продажу",
    sellDate: "Дата продажу",
    editItem: "Редагувати предмет",
    deleteConfirmation: "Ви впевнені, що хочете видалити цей предмет?",
    delete: "Видалити",
    totalInvestment: "Загальні інвестиції",
    profit: "Прибуток",
    percentageProfit: "Процентний прибуток",
    analytics: "Аналітика",
    noData: "Немає даних для відображення.",
    itemAdded: "Предмет успішно додано!",
    itemUpdated: "Предмет успішно оновлено!",
    itemDeleted: "Предмет успішно видалено!",
    fetchError: "Помилка при отриманні даних з API.",
    addInvestment: "Додати нову інвестицію",
    markAsSold: "Відмітити як продано",
    total: "Усі",
    currency: "Валюта",
    language: "Мова",
    priceHistory: "Історія ціни",
    noInvestmentsInCategory: "Немає інвестицій у цій категорії.",
    floatValue: "Float Value",
    stickers: "Наклейки (введіть через кому)",
    selectedItem: "Вибраний предмет",
    itemDetails: "Інформація про предмет",
  },
  en: {
    portfolio: "Investment Portfolio",
    name: "Item Name",
    count: "Count",
    buyPrice: "Buy Price",
    game: "Game",
    boughtDate: "Purchase Date",
    action: "Actions",
    addItem: "Add Investment",
    save: "Save",
    cancel: "Cancel",
    sold: "Sold",
    yes: "Yes",
    no: "No",
    sellPrice: "Sell Price",
    sellDate: "Sell Date",
    editItem: "Edit Item",
    deleteConfirmation: "Are you sure you want to delete this item?",
    delete: "Delete",
    totalInvestment: "Total Investments",
    profit: "Profit",
    percentageProfit: "Percentage Profit",
    analytics: "Analytics",
    noData: "No data to display.",
    itemAdded: "Item added successfully!",
    itemUpdated: "Item updated successfully!",
    itemDeleted: "Item deleted successfully!",
    fetchError: "Error fetching data from API.",
    addInvestment: "Add New Investment",
    markAsSold: "Mark as Sold",
    total: "All",
    currency: "Currency",
    language: "Language",
    priceHistory: "Price History",
    noInvestmentsInCategory: "No investments in this category.",
    floatValue: "Float Value",
    stickers: "Stickers (comma-separated)",
    selectedItem: "Selected Item",
    itemDetails: "Item Details",
  },
};

// URL для проксі-сервера та Steam CDN
const PROXY_SERVER_URL = "https://steam-proxy-server-lues.onrender.com";
const STEAM_CDN_URL = "https://community.akamai.steamstatic.com/economy/image/";

export default function App() {
  const [investments, setInvestments] = useState([]);
  const [name, setName] = useState("");
  const [count, setCount] = useState(1);
  const [buyPrice, setBuyPrice] = useState(0);
  const [buyCurrency, setBuyCurrency] = useState(CURRENCIES[2]);
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
  const [autocompleteLoading, setAutocompleteLoading] = useState(false);
  const [itemOptions, setItemOptions] = useState([]);
  const abortControllerRef = useRef(null);
  const [autocompleteValue, setAutocompleteValue] = useState(null);
  const [selectedItemDetails, setSelectedItemDetails] = useState(null);
  const t = LANGUAGES[lang];

  // Використання useEffect для завантаження та збереження даних
  useEffect(() => {
    const savedInvestments = localStorage.getItem("investments");
    if (savedInvestments) {
      setInvestments(JSON.parse(savedInvestments));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("investments", JSON.stringify(investments));
    updateAnalytics();
  }, [investments]);

  // Функція для оновлення аналітики
  const updateAnalytics = () => {
    const sold = investments.filter(item => item.sold);
    setSoldItems(sold);
    const totalInvest = sold.reduce((sum, item) => sum + item.buyPrice * item.count, 0);
    const totalProfitAmount = sold.reduce((sum, item) => sum + (item.sellPrice - item.buyPrice) * item.count, 0);
    setTotalInvestment(totalInvest);
    setTotalProfit(totalProfitAmount);
    const profitData = sold
      .map(item => ({ date: item.sellDate, profit: (item.sellPrice - item.buyPrice) * item.count, }))
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

  // Функції для обробки подій
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
        const formattedOptions = data.map(item => {
          const imageUrl = item.image || item.icon_url;
          return {
            label: item.name,
            image: imageUrl,
            float: item.float
          };
        });
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
      setSelectedItemDetails({ ...newValue, image: newValue.image });
    } else {
      setName('');
      setSelectedItemDetails(null);
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
      image: selectedItemDetails?.image || null,
      floatValue: selectedItemDetails?.float || null,
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
    setSelectedItemDetails(null);
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

  return (
    <ThemeProvider theme={theme}>
      <style jsx global>{`
        body {
          overflow-x: hidden;
        }
      `}</style>
      <Container maxWidth="lg" sx={{ pt: 4, pb: 8, backgroundColor: theme.palette.background.default, minHeight: '100vh', overflowX: 'hidden' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <GradientText variant="h4" component="h1">
            {t.portfolio}
          </GradientText>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="language-select-label">{t.language}</InputLabel>
              <Select labelId="language-select-label" value={lang} onChange={(e) => setLang(e.target.value)} label={t.language}>
                <MenuItem value="uk">Українська</MenuItem>
                <MenuItem value="en">English</MenuItem>
              </Select>
            </FormControl>
            <Button variant="outlined" startIcon={<BarChart />} onClick={handleAnalyticsOpen}>
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
                <Typography variant="h2" fontWeight="bold">{totalInvestment.toFixed(2)}€</Typography>
              </CardContent>
            </StyledCard>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StyledCard>
              <CardContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{t.profit}</Typography>
                <Typography variant="h2" fontWeight="bold" sx={{ color: profitColor }}>
                  {profit.toFixed(2)}€
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StyledCard>
              <CardContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{t.percentageProfit}</Typography>
                <Typography variant="h2" fontWeight="bold" sx={{ color: profitColor }}>
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
        {filteredInvestments.length === 0 ?
          (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
              <Typography variant="h5" color="text.secondary">{t.noInvestmentsInCategory}</Typography>
            </Box>
          ) : (
            <Box component={Card} sx={{ overflowX: 'auto' }}>
              <Table stickyHeader aria-label="investment table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>{t.name}</StyledTableCell>
                    <StyledTableCell align="right">{t.count}</StyledTableCell>
                    <StyledTableCell align="right">{t.buyPrice}</StyledTableCell>
                    <StyledTableCell align="center">{t.boughtDate}</StyledTableCell>
                    <StyledTableCell align="right">{t.game}</StyledTableCell>
                    <StyledTableCell align="right">{t.sold}</StyledTableCell>
                    <StyledTableCell align="right">{t.action}</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredInvestments.map((item) => (
                    <TableRow key={item.id} hover>
                      <StyledTableCell component="th" scope="row" sx={{ minWidth: 200, display: 'flex', alignItems: 'center' }}>
                        {/* Відображення зображення */}
                        {item.image && (
                          <Box
                            component="img"
                            src={item.image}
                            alt={item.name}
                            sx={{ width: 50, height: 50, mr: 2, borderRadius: 1 }}
                          />
                        )}
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>{item.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {CURRENCY_SYMBOLS[item.buyCurrency]}{item.buyPrice}
                          </Typography>
                        </Box>
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        <Tooltip title={t.count}>
                          <Chip label={item.count} color="primary" size="small" />
                        </Tooltip>
                      </StyledTableCell>
                      <StyledTableCell align="right">{CURRENCY_SYMBOLS[item.buyCurrency]}{item.buyPrice}</StyledTableCell>
                      <StyledTableCell align="center">{item.boughtDate}</StyledTableCell>
                      <StyledTableCell align="right">{item.game}</StyledTableCell>
                      <StyledTableCell align="right">
                        <Chip
                          label={item.sold ? t.yes : t.no}
                          color={item.sold ? "success" : "default"}
                          size="small"
                        />
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        <Box display="flex" gap={1} justifyContent="flex-end">
                          {!item.sold && (
                            <Tooltip title={t.markAsSold}>
                              <IconButton color="secondary" onClick={() => {
                                setItemToSell(item); setSellDialog(true);
                              }}>
                                <Check />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title={t.delete}>
                            <IconButton color="error" onClick={() => confirmDelete(item)}>
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </StyledTableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}

        {/* Dialog для додавання/редагування */}
        <Dialog open={addDialog} onClose={() => setAddDialog(false)} maxWidth="sm" fullWidth>
          <StyledDialogTitle>{t.addInvestment}</StyledDialogTitle>
          <StyledDialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Autocomplete
                  options={itemOptions}
                  getOptionLabel={(option) => option.label}
                  isOptionEqualToValue={(option, value) => option.label === value.label}
                  loading={autocompleteLoading}
                  onInputChange={handleItemNameChange}
                  onChange={handleAutocompleteChange}
                  value={autocompleteValue}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t.name}
                      variant="outlined"
                      fullWidth
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
                        width="40"
                        src={option.image}
                        alt={option.label}
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/40x40/EAEAEA/888888?text=no"; }}
                      />
                      {option.label}
                    </Box>
                  )}
                />
              </Grid>
              {selectedItemDetails && (
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6">{t.itemDetails}</Typography>
                      <Divider sx={{ my: 1 }} />
                      <Box display="flex" alignItems="center">
                        <Box
                          component="img"
                          src={selectedItemDetails.image}
                          alt={selectedItemDetails.label}
                          sx={{ width: 60, height: 60, mr: 2, borderRadius: 1 }}
                          onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/60x60/EAEAEA/888888?text=no"; }}
                        />
                        <Typography variant="body1">{selectedItemDetails.label}</Typography>
                      </Box>
                      {selectedItemDetails.float && (
                        <Typography variant="body2" color="text.secondary" mt={1}>
                          {t.floatValue}: {selectedItemDetails.float}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              )}
              <Grid item xs={12} sm={6}>
                <TextField
                  label={t.count}
                  type="number"
                  variant="outlined"
                  fullWidth
                  value={count}
                  onChange={(e) => setCount(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label={t.buyPrice}
                  type="number"
                  variant="outlined"
                  fullWidth
                  value={buyPrice}
                  onChange={(e) => setBuyPrice(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel>{t.currency}</InputLabel>
                  <Select value={buyCurrency} onChange={(e) => setBuyCurrency(e.target.value)} label={t.currency}>
                    {CURRENCIES.map(currency => (
                      <MenuItem key={currency} value={currency}>{currency}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel>{t.game}</InputLabel>
                  <Select value={game} onChange={(e) => setGame(e.target.value)} label={t.game}>
                    {GAMES.filter(g => g !== "Усі").map(gameName => (
                      <MenuItem key={gameName} value={gameName}>{gameName}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label={t.boughtDate}
                  type="date"
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{
                    shrink: true
                  }}
                  value={boughtDate}
                  onChange={(e) => setBoughtDate(e.target.value)}
                />
              </Grid>
            </Grid>
          </StyledDialogContent>
          <DialogActions>
            <Button onClick={() => setAddDialog(false)}>{t.cancel}</Button>
            <Button onClick={addItem} color="primary" variant="contained">{t.save}</Button>
          </DialogActions>
        </Dialog>

        {/* Dialog для відмітки як продано */}
        <Dialog open={sellDialog} onClose={() => setSellDialog(false)} maxWidth="sm" fullWidth>
          <StyledDialogTitle>{t.markAsSold}</StyledDialogTitle>
          <StyledDialogContent dividers>
            <Typography variant="h6" mb={2}>{t.selectedItem}: {itemToSell?.name}</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField label={t.sellPrice} type="number" variant="outlined" fullWidth value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label={t.sellDate} type="date" variant="outlined" fullWidth InputLabelProps={{ shrink: true }} value={sellDate} onChange={(e) => setSellDate(e.target.value)} />
              </Grid>
            </Grid>
          </StyledDialogContent>
          <DialogActions>
            <Button onClick={() => setSellDialog(false)}>{t.cancel}</Button>
            <Button onClick={markAsSold} color="primary" variant="contained">{t.save}</Button>
          </DialogActions>
        </Dialog>

        {/* Dialog для видалення */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="sm" fullWidth>
          <StyledDialogTitle>{t.delete}</StyledDialogTitle>
          <StyledDialogContent>
            <Typography>{t.deleteConfirmation}</Typography>
          </StyledDialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>{t.no}</Button>
            <Button onClick={deleteItem} color="error" variant="contained">{t.yes}</Button>
          </DialogActions>
        </Dialog>

        {/* Dialog для аналітики */}
        <Dialog open={analyticsOpen} onClose={() => setAnalyticsOpen(false)} maxWidth="md" fullWidth>
          <StyledDialogTitle>{t.analytics}</StyledDialogTitle>
          <StyledDialogContent dividers>
            <Typography variant="h6" gutterBottom>{t.profit}</Typography>
            {profitByDate.length === 0 ?
              (
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
          </StyledDialogContent>
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
