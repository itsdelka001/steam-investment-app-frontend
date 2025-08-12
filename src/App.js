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
  Drawer,
} from "@mui/material";
import { TrendingUp, Delete, Check, BarChart, Plus, Language, X, ArrowUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip as ChartTooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";

// Оновлена, мінімалістична темна тема з посиленою типографікою
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#bb86fc', // М'який фіолетовий акцент
    },
    secondary: {
      main: '#03dac6', // Бірюзовий акцент
    },
    background: {
      default: '#121212', // Темний фон
      paper: '#1e1e1e', // Темніший фон для карток та модальних вікон
    },
    text: {
      primary: '#e0e0e0',
      secondary: '#b0b0b0',
    },
  },
  typography: {
    fontFamily: ['Inter', 'sans-serif'].join(','),
    h2: {
      fontWeight: 800, // Зроблено жирнішим для кращої читабельності
      letterSpacing: -1.5, // Зменшено міжбуквений інтервал
      fontSize: '2.5rem', // Збільшено розмір шрифту
    },
    h4: {
      fontWeight: 700, // Зроблено жирнішим
    },
    h6: {
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
            opacity: 0.9,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16, // Збільшено заокруглення кутів
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            transition: 'box-shadow 0.2s',
            '&.Mui-focused fieldset': {
              borderColor: '#bb86fc !important',
              boxShadow: '0 0 0 2px rgba(187, 134, 252, 0.4)',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16, // Збільшено заокруглення кутів
          boxShadow: '0 6px 20px rgba(0,0,0,0.5)',
          background: 'linear-gradient(145deg, #1e1e1e, #222222)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: '0 8px 25px rgba(0,0,0,0.6)',
          },
        },
      },
    },
  },
});

// Стиль для мінімалістичного заголовка
const MinimalistHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(3, 0), // Збільшено відступи
  borderBottom: `1px solid ${theme.palette.divider}`,
  marginBottom: theme.spacing(5), // Збільшено відступ знизу
}));

// Стиль для карток
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(3), // Збільшено відступи
}));

// Стиль для комірок таблиці
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(2), // Збільшено відступи в таблиці
}));

// Стиль для заголовка висувної панелі
const DrawerHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2, 3),
  background: theme.palette.background.paper,
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
  const [buyCurrency, setBuyCurrency] = useState(CURRENCIES[2]);
  const [game, setGame] = useState(GAMES[1]);
  const [detectedGame, setDetectedGame] = useState(GAMES[1]);
  const [boughtDate, setBoughtDate] = useState(new Date().toISOString().split('T')[0]);
  const [tabValue, setTabValue] = useState(0);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [profitByDate, setProfitByDate] = useState([]);
  const [addDrawerOpen, setAddDrawerOpen] = useState(false);
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

  // Збереження даних в localStorage і завантаження з нього
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
        const url = `${PROXY_SERVER_URL}/search?query=${encodeURIComponent(newInputValue)}&game=all`;
        const response = await fetch(url, { signal });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const formattedOptions = data.map(item => {
          return {
            label: item.name,
            image: item.icon_url,
            game: item.game,
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
    if (newValue && typeof newValue === 'object') {
      setName(newValue.label);
      setDetectedGame(newValue.game);
      setSelectedItemDetails({ ...newValue, image: newValue.image });
    } else {
      setName(newValue || '');
      setDetectedGame(GAMES[1]);
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
      game: detectedGame,
      boughtDate,
      buyCurrency,
      sold: false,
      sellPrice: 0,
      sellDate: null,
      image: selectedItemDetails?.image || null,
    };

    setInvestments([...investments, newItem]);
    showSnackbar(t.itemAdded, "success");
    resetForm();
    setAddDrawerOpen(false);
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
    setDetectedGame(GAMES[1]);
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
  const profitColor = profit >= 0 ? theme.palette.success.main : theme.palette.error.main;

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ pt: 6, pb: 8, backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
        <MinimalistHeader>
          <Typography variant="h2" component="h1" fontWeight="bold">
            {t.portfolio}
          </Typography>
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
            <Button variant="contained" color="primary" startIcon={<Plus />} onClick={() => setAddDrawerOpen(true)}>
              {t.addItem}
            </Button>
          </Box>
        </MinimalistHeader>

        <Grid container spacing={4} mb={5}>
          <Grid item xs={12} sm={6} md={4}>
            <StyledCard>
              <CardContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{t.totalInvestment}</Typography>
                <Typography variant="h4" fontWeight="bold" color="primary">{totalInvestment.toFixed(2)} {CURRENCY_SYMBOLS["EUR"]}</Typography>
              </CardContent>
            </StyledCard>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StyledCard>
              <CardContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{t.profit}</Typography>
                <Typography variant="h4" fontWeight="bold" sx={{ color: profitColor }}>
                  {totalProfit.toFixed(2)} {CURRENCY_SYMBOLS["EUR"]}
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StyledCard>
              <CardContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{t.percentageProfit}</Typography>
                <Typography variant="h4" fontWeight="bold" sx={{ color: profitColor }}>
                  {percentageProfit.toFixed(2)}%
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>

        <Box mb={4}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} aria-label="game tabs" TabIndicatorProps={{ style: { backgroundColor: theme.palette.primary.main } }}>
            {GAMES.map((gameName, index) => (
              <Tab key={index} label={gameName === "Усі" ? t.total : gameName} sx={{ color: theme.palette.text.secondary, '&.Mui-selected': { color: theme.palette.primary.main } }} />
            ))}
          </Tabs>
        </Box>

        <Box sx={{ overflowX: 'auto', mt: 3 }}>
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
                    {t.noInvestmentsInCategory}
                  </TableCell>
                </TableRow>
              ) : (
                filteredInvestments.map((item) => {
                  const itemProfit = item.sold ? (item.sellPrice - item.buyPrice) * item.count : 0;
                  const itemProfitColor = itemProfit >= 0 ? '#4CAF50' : '#F44336';
                  return (
                    <TableRow key={item.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <StyledTableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover', border: '1px solid #444' }}
                            />
                          )}
                          <Box>
                            <Typography variant="body1" fontWeight="medium">{item.name}</Typography>
                            {item.sold && (
                              <Chip label={t.sold} size="small" color="success" sx={{ mt: 0.5 }} />
                            )}
                          </Box>
                        </Box>
                      </StyledTableCell>
                      <StyledTableCell>{item.game}</StyledTableCell>
                      <StyledTableCell>{item.count}</StyledTableCell>
                      <StyledTableCell>{item.buyPrice.toFixed(2)} {CURRENCY_SYMBOLS[item.buyCurrency]}</StyledTableCell>
                      <StyledTableCell>{item.boughtDate}</StyledTableCell>
                      <StyledTableCell>
                        <Typography color={itemProfitColor}>
                          {item.sold ? `${itemProfit.toFixed(2)} ${CURRENCY_SYMBOLS[item.buyCurrency]}` : '—'}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Tooltip title={t.markAsSold}>
                          <IconButton
                            color="success"
                            onClick={() => {
                              setItemToSell(item);
                              setSellPrice(item.buyPrice);
                              setSellDialog(true);
                            }}
                            disabled={item.sold}
                          >
                            <TrendingUp size={20} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t.delete}>
                          <IconButton color="error" onClick={() => confirmDelete(item)}>
                            <Delete size={20} />
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

        {/* Висувна панель для додавання інвестиції */}
        <Drawer
          anchor="right"
          open={addDrawerOpen}
          onClose={() => setAddDrawerOpen(false)}
          PaperProps={{
            sx: {
              width: { xs: '100%', sm: 450 },
              borderTopLeftRadius: 16,
              borderBottomLeftRadius: 16,
              boxShadow: '0 0 20px rgba(0,0,0,0.5)',
              background: theme.palette.background.paper,
            }
          }}
        >
          <DrawerHeader>
            <Typography variant="h6" fontWeight="bold">
              {t.addInvestment}
            </Typography>
            <IconButton onClick={() => setAddDrawerOpen(false)} sx={{ color: theme.palette.text.secondary }}>
              <X />
            </IconButton>
          </DrawerHeader>
          <Box sx={{ p: 3, flexGrow: 1, overflowY: 'auto' }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
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
                        <img
                          loading="lazy"
                          width="30"
                          src={option.image}
                          alt={option.label}
                        />
                      )}
                      {`${option.label} (${option.game})`}
                    </Box>
                  )}
                />
              </Grid>
              {selectedItemDetails && (
                <Grid item xs={12}>
                  <Card sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h6" mb={2}>{t.selectedItem}</Typography>
                    <img
                      src={selectedItemDetails.image}
                      alt={selectedItemDetails.label}
                      style={{
                        width: 'auto',
                        maxHeight: '150px',
                        borderRadius: 12,
                        objectFit: 'contain',
                        border: '1px solid #444'
                      }}
                    />
                    <Box mt={2}>
                      <Typography variant="subtitle1" fontWeight="bold">{selectedItemDetails.label}</Typography>
                      <Chip label={selectedItemDetails.game} size="small" sx={{ mt: 1, backgroundColor: theme.palette.primary.dark }} />
                    </Box>
                  </Card>
                </Grid>
              )}
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
                  <InputLabel>{t.currency}</InputLabel>
                  <Select
                    value={buyCurrency}
                    label={t.currency}
                    onChange={(e) => setBuyCurrency(e.target.value)}
                  >
                    {CURRENCIES.map((currency, index) => (
                      <MenuItem key={index} value={currency}>{CURRENCY_SYMBOLS[currency]}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
          </Box>
          <Box sx={{ p: 3, borderTop: `1px solid ${theme.palette.divider}`, display: 'flex', justifyContent: 'space-between' }}>
            <Button onClick={() => setAddDrawerOpen(false)} color="secondary" variant="outlined">
              {t.cancel}
            </Button>
            <Button onClick={addItem} color="primary" variant="contained" endIcon={<ArrowUp />}>
              {t.save}
            </Button>
          </Box>
        </Drawer>


        {/* Dialog для відмічення як продано */}
        <Dialog open={sellDialog} onClose={() => setSellDialog(false)} PaperProps={{ style: { borderRadius: 16 } }}>
          <DialogTitle>{t.markAsSold}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label={t.sellPrice}
              type="number"
              fullWidth
              value={sellPrice}
              onChange={(e) => setSellPrice(e.target.value)}
              InputProps={{ inputProps: { min: 0 } }}
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
          <DialogActions>
            <Button onClick={() => setSellDialog(false)}>{t.cancel}</Button>
            <Button onClick={markAsSold} color="primary">{t.save}</Button>
          </DialogActions>
        </Dialog>

        {/* Dialog для підтвердження видалення */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} PaperProps={{ style: { borderRadius: 16 } }}>
          <DialogTitle>{t.deleteConfirmation}</DialogTitle>
          <DialogContent>
            <Typography>
              {t.deleteConfirmation}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>{t.no}</Button>
            <Button onClick={deleteItem} color="error">{t.yes}</Button>
          </DialogActions>
        </Dialog>

        {/* Dialog для аналітики */}
        <Dialog open={analyticsOpen} onClose={() => setAnalyticsOpen(false)} maxWidth="md" fullWidth PaperProps={{ style: { borderRadius: 16 } }}>
          <DialogTitle>{t.analytics}</DialogTitle>
          <DialogContent dividers>
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
                    stroke="#bb86fc"
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
