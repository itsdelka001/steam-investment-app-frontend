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

const PROXY_SERVER_URL = "https://steam-proxy-server-lues.onrender.com";

export default function App() {
  const [investments, setInvestments] = useState([]);
  const [name, setName] = useState("");
  const [count, setCount] = useState(1);
  const [buyPrice, setBuyPrice] = useState(0);
  const [buyCurrency, setBuyCurrency] = useState(CURRENCIES[2]); // Змінено на UAH за замовчуванням
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
        const formattedOptions = data.map(item => ({ label: item.name, image: item.icon_url, float: item.float })); // FIX: змінено item.image на item.icon_url

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
      setSelectedItemDetails(newValue); // Зберігаємо повні дані про вибраний предмет
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
      <Container maxWidth="lg" sx={{ pt: 4, pb: 8, backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <GradientText variant="h4" component="h1">
            {t.portfolio}
          </GradientText>
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
                      {t.noInvestmentsInCategory}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredInvestments.map((item) => (
                  <TableRow key={item.id} hover>
                    <StyledTableCell>{item.name}</StyledTableCell>
                    <StyledTableCell>{item.game}</StyledTableCell>
                    <StyledTableCell>{item.count}</StyledTableCell>
                    <StyledTableCell>{item.buyPrice}{CURRENCY_SYMBOLS[item.buyCurrency]}</StyledTableCell>
                    <StyledTableCell>{item.boughtDate}</StyledTableCell>
                    <StyledTableCell>
                      <Chip
                        label={
                          item.sold
                            ? `${((item.sellPrice - item.buyPrice) * item.count).toFixed(2)}${CURRENCY_SYMBOLS[item.buyCurrency]}`
                            : "---"
                        }
                        color={
                          item.sold && (item.sellPrice - item.buyPrice) * item.count >= 0
                            ? 'success'
                            : item.sold ? 'error' : 'default'
                        }
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
                ))
              )}
            </TableBody>
          </Table>
        </Box>

        {/* Dialog для додавання інвестиції */}
        <Dialog open={addDialog} onClose={() => { setAddDialog(false); resetForm(); }} maxWidth="lg" fullWidth PaperProps={{ style: { overflowY: 'visible' } }}>
          <StyledDialogTitle>{t.addInvestment}</StyledDialogTitle>
          <DialogContent sx={{ position: 'relative', overflowY: 'visible', p: 4 }}>
            <Grid container spacing={4} alignItems="flex-start" sx={{ justifyContent: 'center' }}>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Autocomplete
                    fullWidth
                    freeSolo
                    options={itemOptions}
                    loading={autocompleteLoading}
                    value={autocompleteValue}
                    onChange={handleAutocompleteChange}
                    onInputChange={handleItemNameChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={<GradientText variant="subtitle1">{t.name}</GradientText>}
                        placeholder="Введіть назву предмета або скіна..."
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
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    {tabValue === 0 && (
                      <FormControl variant="outlined" sx={{ flexGrow: 1 }} required>
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
                    )}
                    <TextField
                      label={t.count}
                      type="number"
                      variant="outlined"
                      sx={{ width: '30%' }}
                      value={count}
                      onChange={(e) => setCount(Number(e.target.value))}
                      required
                      inputProps={{ min: 1 }}
                    />
                    <TextField
                      label={t.buyPrice}
                      type="number"
                      variant="outlined"
                      sx={{ flexGrow: 1 }}
                      value={buyPrice}
                      onChange={(e) => setBuyPrice(Number(e.target.value))}
                      required
                      inputProps={{ min: 0 }}
                      InputProps={{
                        endAdornment: (
                          <InputLabel>{CURRENCY_SYMBOLS[buyCurrency]}</InputLabel>
                        )
                      }}
                    />
                  </Box>
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
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    minHeight: '250px',
                    backgroundColor: 'rgba(255,255,255,0.7)',
                    borderRadius: '16px',
                    p: 3,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                  }}
                >
                  {selectedItemDetails ? (
                    <Box sx={{ width: '100%' }}>
                      <Typography variant="h6" gutterBottom align="center">
                        <GradientText variant="h6">{t.itemDetails}</GradientText>
                      </Typography>
                      <Box display="flex" flexDirection="column" alignItems="center">
                        <img src={selectedItemDetails.image} alt={selectedItemDetails.label} style={{ maxWidth: '100%', height: 'auto', maxHeight: '150px', marginBottom: '16px', borderRadius: '8px' }} />
                        <Typography variant="h6" align="center" mb={2}>{selectedItemDetails.label}</Typography>
                        <Grid container spacing={2}>
                           <Grid item xs={12} sm={6}>
                              <TextField
                                label={t.floatValue}
                                type="number"
                                variant="outlined"
                                fullWidth
                                value={selectedItemDetails.float}
                                disabled
                                sx={{
                                  '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(74,20,140,0.5) !important',
                                  },
                                  '& .MuiInputBase-input.Mui-disabled': {
                                    WebkitTextFillColor: '#4A148C',
                                  }
                                }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                label={t.stickers}
                                variant="outlined"
                                fullWidth
                                placeholder="Назва, Назва2, Назва3"
                                sx={{
                                  '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(74,20,140,0.5) !important',
                                  },
                                }}
                              />
                            </Grid>
                        </Grid>
                      </Box>
                    </Box>
                  ) : (
                    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                      <Typography variant="h6" color="text.secondary">{t.selectedItem}</Typography>
                      <Typography variant="body2" color="text.secondary">Виберіть предмет, щоб побачити деталі</Typography>
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ padding: '16px 24px', justifyContent: 'space-between', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
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
            <Typography variant="h6" mb={1}>{t.totalInvestment} ({t.sold}): {totalInvestment.toFixed(2)}€</Typography>
            <Typography variant="h6" mb={1}>{t.profit} ({t.sold}): {totalProfit.toFixed(2)}€</Typography>
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
