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
  Autocomplete,
  CircularProgress,
  Tooltip,
} from "@mui/material";

import { TrendingUp, Delete, Edit, BarChart, Info } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip as ChartTooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";

// Примітка: Ключ API для валют все ще потрібен, якщо ви хочете реальні курси
// Якщо ви не вводили ключ, додаток використає фіксовані курси
const API_KEY_EXCHANGE = "5hdOphZYGTxUMPdKDA1vvVubd9KReUIQ";
const GAMES = ["CS2", "Dota 2", "PUBG", "Інші"];

const LANGUAGES = {
  uk: {
    portfolio: "Портфель інвестицій",
    name: "Назва предмета",
    count: "Кількість",
    buyPrice: "Ціна купівлі",
    buyDate: "Дата купівлі",
    sellPrice: "Ціна продажу",
    sellDate: "Дата продажу",
    sold: "Продано",
    add: "Додати",
    filters: "Фільтри",
    gameFilter: "Фільтр по грі",
    statusFilter: "Статус",
    all: "Усі",
    soldText: "Продано",
    notSoldText: "Не продано",
    noItems: "Немає предметів",
    profit: "Прибуток по фільтру",
    editItem: "Редагувати предмет",
    cancel: "Скасувати",
    save: "Зберегти",
    deleteConfirmTitle: "Видалити предмет?",
    deleteConfirmText: "Ви впевнені, що хочете видалити цей предмет? Це не можна буде скасувати.",
    delete: "Видалити",
    analytics: "Аналітика",
    currency: "Валюта",
    language: "Мова",
    noData: "Немає даних для графіку",
    confirmDeleteText: "Видалити",
    cancelDelete: "Скасувати",
    actions: "Дії",
    currentPrice: "Поточна ціна",
    itemStatus: "Статус",
    deleteItemConfirmation: (itemName) => `Ви впевнені, що хочете видалити "${itemName}"?`,
    itemDetails: "Деталі предмета",
    itemPhoto: "Фото предмета",
    profitStatusText: "Прибуток",
    lossStatusText: "Збиток",
    neutralStatusText: "0",
    notSoldStatusText: "Не продано",
    fetchingItems: "Отримання предметів...",
    errorFetchingItems: "Помилка при отриманні предметів. Переконайтеся, що сервер працює.",
    searchPlaceholder: "Пошук предметів...",
  },
  en: {
    portfolio: "Investment Portfolio",
    name: "Item Name",
    count: "Quantity",
    buyPrice: "Buy Price",
    buyDate: "Buy Date",
    sellPrice: "Sell Price",
    sellDate: "Sell Date",
    sold: "Sold",
    add: "Add",
    filters: "Filters",
    gameFilter: "Filter by Game",
    statusFilter: "Status",
    all: "All",
    soldText: "Sold",
    notSoldText: "Not Sold",
    noItems: "No items",
    profit: "Profit by filter",
    editItem: "Edit item",
    cancel: "Cancel",
    save: "Save",
    deleteConfirmTitle: "Delete item?",
    deleteConfirmText: "Are you sure you want to delete this item? This cannot be undone.",
    delete: "Delete",
    analytics: "Analytics",
    currency: "Currency",
    language: "Language",
    noData: "No data for chart",
    confirmDeleteText: "Delete",
    cancelDelete: "Cancel",
    actions: "Actions",
    currentPrice: "Current Price",
    itemStatus: "Status",
    deleteItemConfirmation: (itemName) => `Are you sure you want to delete "${itemName}"?`,
    itemDetails: "Item Details",
    itemPhoto: "Item Photo",
    profitStatusText: "Profit",
    lossStatusText: "Loss",
    neutralStatusText: "0",
    notSoldStatusText: "Not Sold",
    fetchingItems: "Fetching items...",
    errorFetchingItems: "Error fetching items. Make sure the server is running.",
    searchPlaceholder: "Search items...",
  },
};

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#4ade80", // Неоново-зелений
    },
    secondary: {
      main: "#a855f7", // Фіолетовий
    },
    background: {
      default: "#0a0a0a",
      paper: "#1e1e1e",
    },
    text: {
      primary: "#e5e7eb",
      secondary: "#9ca3af",
    },
    success: {
      main: '#22c55e',
    },
    error: {
      main: '#ef4444',
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h4: {
      fontWeight: 700,
      fontFamily: "'Montserrat', sans-serif",
    },
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: "8px",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0px 10px 20px rgba(0,0,0,0.4)",
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          cursor: "pointer",
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          backgroundColor: '#333',
        }
      }
    }
  },
});

const NeonButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #a855f7 30%, #ec4899 90%)',
  border: 0,
  borderRadius: 8,
  color: 'white',
  padding: '0 30px',
  boxShadow: '0 3px 5px 2px rgba(168, 85, 247, .3)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    boxShadow: '0 5px 15px 5px rgba(168, 85, 247, .5)',
    transform: 'scale(1.05)',
  },
}));

export default function App() {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("portfolio");
    return saved ? JSON.parse(saved) : [];
  });

  const [currency, setCurrency] = useState("UAH");
  const [exchangeRates, setExchangeRates] = useState({ UAH: 1, USD: 1, EUR: 1 });
  const [language, setLanguage] = useState("uk");
  const [tabGame, setTabGame] = useState("CS2");
  const [itemSuggestions, setItemSuggestions] = useState([]);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [form, setForm] = useState({
    name: "",
    count: 1,
    buyPrice: "",
    sellPrice: "",
    buyDate: "",
    sellDate: "",
    sold: false,
    game: "CS2",
  });

  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [itemToDelete, setItemToDelete] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const [analyticsOpen, setAnalyticsOpen] = useState(false);

  // Зберігаємо зміни в локальному сховищі
  useEffect(() => {
    localStorage.setItem("portfolio", JSON.stringify(items));
  }, [items]);

  // Завантаження курсів валют
  useEffect(() => {
    const fallbackRates = {
      UAH: 1,
      USD: 0.025,
      EUR: 0.024,
    };

    if (!API_KEY_EXCHANGE || API_KEY_EXCHANGE === "5hdOphZYGTxUMPdKDA1vvVubd9KReUIQ") {
      setExchangeRates(fallbackRates);
      return;
    }

    fetch(`https://api.apilayer.com/exchangerates_data/latest?base=UAH&apikey=${API_KEY_EXCHANGE}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.rates) {
          setExchangeRates({
            UAH: 1,
            USD: data.rates.USD || fallbackRates.USD,
            EUR: data.rates.EUR || fallbackRates.EUR,
          });
          setSnackbar({ open: true, message: "Курси валют успішно завантажено.", severity: "success" });
        } else {
          setExchangeRates(fallbackRates);
        }
      })
      .catch(() => {
        setExchangeRates(fallbackRates);
      });
  }, []);

  const fetchItemSuggestions = async (gameName, query = "") => {
    if (gameName === 'Інші' || !query) {
      setItemSuggestions([]);
      return;
    }

    setIsSuggestionsLoading(true);
    // Звертаємося до нашого локального проксі-сервера
    const proxyUrl = `http://localhost:3001/api/steam-items?game=${gameName}&query=${encodeURIComponent(query)}`;

    try {
      const response = await fetch(proxyUrl);
      if (!response.ok) {
        throw new Error('Server response was not ok');
      }
      const data = await response.json();
      setItemSuggestions(data);
    } catch (error) {
      console.error(t.errorFetchingItems, error);
      setSnackbar({ open: true, message: t.errorFetchingItems, severity: "error" });
      setItemSuggestions([]);
    } finally {
      setIsSuggestionsLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.length > 2) { // Запит відправляємо, якщо введено 3 або більше символів
      fetchItemSuggestions(tabGame, value);
    } else {
      setItemSuggestions([]);
    }
  };

  const firstUpdate = useRef(true);
  useEffect(() => {
    if (firstUpdate.current) {
        firstUpdate.current = false;
        return;
    }
    // Скидаємо пошук при зміні вкладки
    setSearchQuery("");
    setItemSuggestions([]);
    setForm((f) => ({ ...f, name: "" }));
  }, [tabGame]);

  const convertAmountToSelectedCurrency = (amountInUAH, targetCurrency) => {
    if (amountInUAH === "" || amountInUAH === null || amountInUAH === undefined) return "";
    const numAmount = Number(amountInUAH);
    if (isNaN(numAmount)) return "";

    const rate =
      exchangeRates && exchangeRates.hasOwnProperty(targetCurrency) ? exchangeRates[targetCurrency] : 1;

    return (numAmount * rate).toFixed(2);
  };

  const getProfitLossStatus = (item) => {
    if (!item.sold || !item.sellPrice) return null;
    const profit = (Number(item.sellPrice) - Number(item.buyPrice)) * item.count;
    if (profit > 0) return 'profit';
    if (profit < 0) return 'loss';
    return 'neutral';
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFormSoldChange = (e) => {
    const isSold = e.target.value === 'Продано' || e.target.value === 'Sold';
    setForm((f) => ({
        ...f,
        sold: isSold,
        ...(isSold ? {} : { sellPrice: "", sellDate: "" })
    }));
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEditSoldChange = (e) => {
    const isSold = e.target.value === 'Продано' || e.target.value === 'Sold';
    setEditForm((f) => ({
        ...f,
        sold: isSold,
        ...(isSold ? {} : { sellPrice: "", sellDate: "" })
    }));
  };

  const addItem = () => {
    if (!form.name || !form.buyPrice || !form.buyDate || !form.game) {
      setSnackbar({ open: true, message: "Будь ласка, заповніть усі обов'язкові поля", severity: "error" });
      return;
    }

    const rate = exchangeRates[currency] || 1;
    const buyPriceInUAH = Number(form.buyPrice) / rate;
    const sellPriceInUAH = form.sold ? Number(form.sellPrice) / rate : "";

    const selectedItemDetails = itemSuggestions.find(item => item.name === form.name);

    setItems([
      ...items,
      {
        ...form,
        id: Date.now(),
        count: Number(form.count),
        buyPrice: buyPriceInUAH,
        sellPrice: sellPriceInUAH,
        photoUrl: selectedItemDetails ? selectedItemDetails.photoUrl : null,
        currentPrice: selectedItemDetails ? selectedItemDetails.currentPriceUAH : 0,
      },
    ]);
    setForm({
      name: "",
      count: 1,
      buyPrice: "",
      sellPrice: "",
      buyDate: "",
      sellDate: "",
      sold: false,
      game: tabGame,
    });
    setSearchQuery("");
    setItemSuggestions([]);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setEditForm({
      ...item,
      buyPrice: convertAmountToSelectedCurrency(item.buyPrice, currency),
      sellPrice: item.sellPrice ? convertAmountToSelectedCurrency(item.sellPrice, currency) : "",
    });
  };

  const saveEdit = () => {
    if (!editForm.name || !editForm.buyPrice || !editForm.buyDate || !editForm.game) {
      setSnackbar({ open: true, message: "Будь ласка, заповніть усі обов'язкові поля", severity: "error" });
      return;
    }

    const rate = exchangeRates[currency] || 1;
    const buyPriceInUAH = Number(editForm.buyPrice) / rate;
    const sellPriceInUAH = editForm.sold && editForm.sellPrice ? Number(editForm.sellPrice) / rate : "";

    setItems((prev) =>
      prev.map((item) => {
        if (item.id === editingItem.id) {
          return {
            ...editForm,
            count: Number(editForm.count),
            buyPrice: buyPriceInUAH,
            sellPrice: sellPriceInUAH,
          };
        }
        return item;
      })
    );
    setEditingItem(null);
    setSnackbar({ open: true, message: "Зміни збережено", severity: "success" });
  };

  const confirmDelete = (item) => {
    setItemToDelete(item);
  };

  const cancelDelete = () => {
    setItemToDelete(null);
  };

  const deleteItem = () => {
    if (itemToDelete) {
      setItems((prev) => prev.filter((i) => i.id !== itemToDelete.id));
      setSnackbar({ open: true, message: "Предмет видалено", severity: "info" });
    }
    setItemToDelete(null);
  };

  const openDetails = (item) => {
    setSelectedItem(item);
  };

  const closeDetails = () => {
    setSelectedItem(null);
  };

  const closeEdit = () => {
    setEditingItem(null);
  };

  const closeSnackbar = () => {
    setSnackbar({ open: false, message: "", severity: "info" });
  };

  const handleChangeTab = (e, newValue) => {
    setTabGame(newValue);
    setForm((f) => ({ ...f, game: newValue }));
  };

  const filteredItems = items.filter((item) => item.game === tabGame);

  const totalProfitUAH = filteredItems.reduce((sum, item) => {
    if (item.sold && item.sellPrice) {
      return sum + item.count * (Number(item.sellPrice) - Number(item.buyPrice));
    }
    return sum;
  }, 0);

  const totalProfit = convertAmountToSelectedCurrency(totalProfitUAH, currency);

  const profitByDateMap = {};
  filteredItems.forEach((item) => {
    if (item.sold && item.sellPrice && item.sellDate) {
      if (!profitByDateMap[item.sellDate]) profitByDateMap[item.sellDate] = 0;
      profitByDateMap[item.sellDate] +=
        item.count * (Number(item.sellPrice) - Number(item.buyPrice));
    }
  });
  const profitByDate = Object.entries(profitByDateMap)
    .map(([date, profit]) => ({
      date,
      profit: convertAmountToSelectedCurrency(profit, currency),
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const t = LANGUAGES[language];

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          bgcolor: "background.default",
          minHeight: "100vh",
          py: 4,
          fontFamily: theme.typography.fontFamily,
          background: "radial-gradient(circle at top left, #1a0a33 0%, #0a0a0a 100%)",
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            {/* Оновлений, більш футуристичний блок заголовка */}
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              p: 2,
              borderRadius: 3,
              background: 'linear-gradient(90deg, rgba(26,10,51,0.5) 0%, rgba(10,10,10,0.5) 100%)',
              border: '1px solid #4a148c',
              boxShadow: '0 0 20px rgba(168, 85, 247, 0.2)',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                boxShadow: '0 0 30px rgba(168, 85, 247, 0.4)',
              }
            }}>
              <TrendingUp size={48} color={theme.palette.secondary.main} strokeWidth={1.5} />
              <Typography
                variant="h4"
                sx={{
                  fontFamily: theme.typography.h4.fontFamily,
                  background: 'linear-gradient(90deg, #4ade80 0%, #a855f7 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: { xs: '2rem', md: '3.5rem' },
                  letterSpacing: '5px',
                  fontWeight: 900, // Жирний шрифт
                  textShadow: '0 0 10px rgba(168, 85, 247, 0.5)',
                  transition: 'text-shadow 0.3s ease-in-out',
                  '&:hover': {
                    textShadow: '0 0 20px rgba(168, 85, 247, 0.8)',
                  }
                }}
              >
                {t.portfolio}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
              <FormControl sx={{ minWidth: 100 }}>
                <InputLabel>{t.currency}</InputLabel>
                <Select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  label={t.currency}
                  size="small"
                >
                  <MenuItem value="UAH">₴ UAH</MenuItem>
                  <MenuItem value="USD">$ USD</MenuItem>
                  <MenuItem value="EUR">€ EUR</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>{t.language}</InputLabel>
                <Select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  label={t.language}
                  size="small"
                >
                  <MenuItem value="uk">Українська</MenuItem>
                  <MenuItem value="en">English</MenuItem>
                </Select>
              </FormControl>
              <IconButton
                color="secondary"
                onClick={() => setAnalyticsOpen(true)}
                aria-label={t.analytics}
                size="large"
                sx={{
                  border: '1px solid',
                  borderColor: theme.palette.secondary.main,
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    boxShadow: '0 0 15px rgba(168, 85, 247, 0.6)',
                    bgcolor: 'rgba(168, 85, 247, 0.1)',
                  }
                }}
              >
                <BarChart />
              </IconButton>
            </Box>
          </Box>

          <Tabs
            value={tabGame}
            onChange={handleChangeTab}
            textColor="primary"
            indicatorColor="primary"
            sx={{ mb: 3 }}
            variant="scrollable"
            scrollButtons="auto"
          >
            {GAMES.map((game) => (
              <Tab key={game} label={game} value={game} />
            ))}
          </Tabs>

          <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 6, backgroundColor: 'rgba(30, 30, 30, 0.7)' }}>
            <CardContent>
              <Box
                component="form"
                noValidate
                autoComplete="off"
                onSubmit={(e) => {
                  e.preventDefault();
                  addItem();
                }}
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '16px',
                  alignItems: 'center',
                  '& .MuiFormControl-root, & .MuiButton-root': {
                    flexGrow: 1,
                  }
                }}
              >
                <FormControl sx={{ minWidth: 120, flex: '1 1 20%' }}>
                  <Autocomplete
                    id="item-name-autocomplete"
                    options={itemSuggestions.map(item => item.name) || []}
                    value={form.name}
                    onChange={(event, newValue) => {
                      const selectedItem = itemSuggestions.find(item => item.name === newValue);
                      setForm((f) => ({
                        ...f,
                        name: newValue || "",
                        buyPrice: selectedItem ? convertAmountToSelectedCurrency(selectedItem.currentPriceUAH, currency) : "",
                      }));
                    }}
                    onInputChange={(event, newInputValue) => {
                        setSearchQuery(newInputValue);
                        if (newInputValue.length > 2) {
                            fetchItemSuggestions(tabGame, newInputValue);
                        } else {
                            setItemSuggestions([]);
                        }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={t.name}
                        name="name"
                        required
                        fullWidth
                        size="small"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <React.Fragment>
                              {isSuggestionsLoading ? <CircularProgress color="inherit" size={20} /> : null}
                              {params.InputProps.endAdornment}
                            </React.Fragment>
                          ),
                        }}
                      />
                    )}
                  />
                </FormControl>
                <TextField
                  label={t.count}
                  name="count"
                  type="number"
                  inputProps={{ min: 1 }}
                  value={form.count}
                  onChange={handleChange}
                  sx={{ flex: '1 1 10%' }}
                  size="small"
                />
                <TextField
                  label={`${t.buyPrice} (${currency})`}
                  name="buyPrice"
                  type="number"
                  inputProps={{ min: 0 }}
                  value={form.buyPrice}
                  onChange={handleChange}
                  sx={{ flex: '1 1 15%' }}
                  size="small"
                />
                <TextField
                  label={t.buyDate}
                  name="buyDate"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={form.buyDate}
                  onChange={handleChange}
                  sx={{ flex: '1 1 15%' }}
                  size="small"
                />
                <FormControl sx={{ flex: '1 1 15%' }} size="small">
                  <InputLabel>{t.sold}</InputLabel>
                  <Select
                    name="sold"
                    value={form.sold ? t.soldText : t.notSoldText}
                    onChange={handleFormSoldChange}
                    label={t.sold}
                  >
                    <MenuItem value={t.notSoldText}>{t.notSoldText}</MenuItem>
                    <MenuItem value={t.soldText}>{t.soldText}</MenuItem>
                  </Select>
                </FormControl>
                {form.sold && (
                  <>
                    <TextField
                      label={`${t.sellPrice} (${currency})`}
                      name="sellPrice"
                      type="number"
                      inputProps={{ min: 0 }}
                      value={form.sellPrice}
                      onChange={handleChange}
                      sx={{ flex: '1 1 15%' }}
                      size="small"
                    />
                    <TextField
                      label={t.sellDate}
                      name="sellDate"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      value={form.sellDate}
                      onChange={handleChange}
                      sx={{ flex: '1 1 15%' }}
                      size="small"
                    />
                  </>
                )}
                <NeonButton variant="contained" type="submit" sx={{ flex: '0 0 100px' }}>
                  {t.add}
                </NeonButton>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ mb: 2, borderRadius: 2, boxShadow: 6, backgroundColor: 'rgba(30, 30, 30, 0.7)' }}>
            <Box sx={{ overflowX: "auto" }}>
              <Table sx={{ mb: 0 }} stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>{t.name}</TableCell>
                    <TableCell>{t.count}</TableCell>
                    <TableCell>{t.buyPrice} ({currency})</TableCell>
                    <TableCell>{t.currentPrice} ({currency})</TableCell>
                    <TableCell>{t.itemStatus}</TableCell>
                    <TableCell>{t.buyDate}</TableCell>
                    <TableCell>{t.sold}</TableCell>
                    <TableCell>{t.sellPrice} ({currency})</TableCell>
                    <TableCell>{t.sellDate}</TableCell>
                    <TableCell>{t.actions}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredItems.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={10} align="center" sx={{ py: 3 }}>
                        {t.noItems}
                      </TableCell>
                    </TableRow>
                  )}
                  {filteredItems.map((item) => (
                    <TableRow key={item.id} hover onClick={() => openDetails(item)}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.count}</TableCell>
                      <TableCell>{convertAmountToSelectedCurrency(item.buyPrice, currency)}</TableCell>
                      <TableCell>
                        {item.sold ? "-" : (convertAmountToSelectedCurrency(item.currentPrice, currency))}
                      </TableCell>
                      <TableCell>
                        {item.sold && getProfitLossStatus(item) === 'profit' && <Chip label={t.profitStatusText} color="success" size="small" />}
                        {item.sold && getProfitLossStatus(item) === 'loss' && <Chip label={t.lossStatusText} color="error" size="small" />}
                        {item.sold && getProfitLossStatus(item) === 'neutral' && <Chip label={t.neutralStatusText} color="primary" size="small" />}
                        {!item.sold && '-'}
                      </TableCell>
                      <TableCell>{item.buyDate}</TableCell>
                      <TableCell>{item.sold ? t.soldText : t.notSoldText}</TableCell>
                      <TableCell>
                        {item.sold && item.sellPrice
                          ? convertAmountToSelectedCurrency(item.sellPrice, currency)
                          : "-"}
                      </TableCell>
                      <TableCell>{item.sellDate || "-"}</TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <IconButton
                          aria-label="edit"
                          size="small"
                          color="primary"
                          onClick={() => openEdit(item)}
                          sx={{ mr: 1 }}
                        >
                          <Edit size={18} />
                        </IconButton>
                        <IconButton
                          aria-label="delete"
                          size="small"
                          color="error"
                          onClick={() => confirmDelete(item)}
                        >
                          <Delete size={18} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Card>

          <Card sx={{ mt: 3, p: 2, borderRadius: 2, boxShadow: 6, backgroundColor: 'rgba(30, 30, 30, 0.7)' }}>
            <Typography sx={{ fontWeight: 700, fontSize: "1.1rem" }}>
              {t.profit}: {Number(totalProfit).toFixed(2)} {currency}
            </Typography>
          </Card>

          {/* Модалка редагування */}
          <Dialog open={!!editingItem} onClose={closeEdit} maxWidth="sm" fullWidth>
            <DialogTitle>{t.editItem}</DialogTitle>
            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
              <TextField
                label={t.name}
                name="name"
                value={editForm.name || ""}
                onChange={handleEditChange}
                required
                size="small"
              />
              <TextField
                label={t.count}
                name="count"
                type="number"
                inputProps={{ min: 1 }}
                value={editForm.count || 1}
                onChange={handleEditChange}
                size="small"
              />
              <TextField
                label={`${t.buyPrice} (${currency})`}
                name="buyPrice"
                type="number"
                inputProps={{ min: 0 }}
                value={editForm.buyPrice || ""}
                onChange={handleEditChange}
                size="small"
              />
              <TextField
                label={t.buyDate}
                name="buyDate"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={editForm.buyDate || ""}
                onChange={handleEditChange}
                size="small"
              />
              <FormControl size="small" sx={{ mt: 1 }}>
                <InputLabel>{t.sold}</InputLabel>
                <Select
                  name="sold"
                  value={editForm.sold ? t.soldText : t.notSoldText}
                  onChange={handleEditSoldChange}
                  label={t.sold}
                >
                  <MenuItem value={t.notSoldText}>{t.notSoldText}</MenuItem>
                  <MenuItem value={t.soldText}>{t.soldText}</MenuItem>
                </Select>
              </FormControl>
              {editForm.sold && (
                <>
                  <TextField
                    label={`${t.sellPrice} (${currency})`}
                    name="sellPrice"
                    type="number"
                    inputProps={{ min: 0 }}
                    value={editForm.sellPrice || ""}
                    onChange={handleEditChange}
                    size="small"
                  />
                  <TextField
                    label={t.sellDate}
                    name="sellDate"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={editForm.sellDate || ""}
                    onChange={handleEditChange}
                    size="small"
                  />
                </>
              )}
              <FormControl size="small">
                <InputLabel>{t.gameFilter}</InputLabel>
                <Select
                  name="game"
                  value={editForm.game || tabGame}
                  onChange={handleEditChange}
                  label={t.gameFilter}
                >
                  {GAMES.map((g) => (
                    <MenuItem key={g} value={g}>
                      {g}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeEdit}>{t.cancel}</Button>
              <Button variant="contained" onClick={saveEdit}>
                {t.save}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Модалка підтвердження видалення */}
          <Dialog open={!!itemToDelete} onClose={cancelDelete} maxWidth="xs" fullWidth>
            <DialogTitle>{t.deleteConfirmTitle}</DialogTitle>
            <DialogContent>
              <Typography variant="body1">
                {itemToDelete && t.deleteItemConfirmation(itemToDelete.name)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {t.deleteConfirmText}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={cancelDelete}>{t.cancelDelete}</Button>
              <Button onClick={deleteItem} color="error" variant="contained">
                {t.confirmDeleteText}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Модалка деталей предмета */}
          <Dialog open={!!selectedItem} onClose={closeDetails} maxWidth="sm" fullWidth>
            <DialogTitle>{t.itemDetails}</DialogTitle>
            <DialogContent>
              {selectedItem && (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box
                      component="img"
                      src={selectedItem.photoUrl || "https://placehold.co/300x200/1e1e1e/9ca3af?text=No+Image"}
                      alt={selectedItem.name}
                      sx={{
                        width: "100%",
                        height: "auto",
                        borderRadius: 2,
                        objectFit: "cover",
                        mb: 2,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="h6" gutterBottom>{selectedItem.name}</Typography>
                    <Typography variant="body1">
                      **{t.count}:** {selectedItem.count}
                    </Typography>
                    <Typography variant="body1">
                      **{t.buyPrice}:** {convertAmountToSelectedCurrency(selectedItem.buyPrice, currency)} {currency}
                    </Typography>
                    <Typography variant="body1">
                      **{t.buyDate}:** {selectedItem.buyDate}
                    </Typography>
                    <Typography variant="body1">
                      **{t.sold}:** {selectedItem.sold ? t.soldText : t.notSoldText}
                    </Typography>
                    {selectedItem.sold && (
                      <>
                        <Typography variant="body1">
                          **{t.sellPrice}:** {convertAmountToSelectedCurrency(selectedItem.sellPrice, currency)} {currency}
                        </Typography>
                        <Typography variant="body1">
                          **{t.sellDate}:** {selectedItem.sellDate}
                        </Typography>
                      </>
                    )}
                    <Typography variant="body1">
                      **{t.itemStatus}:** {
                        selectedItem.sold
                          ? getProfitLossStatus(selectedItem) === 'profit'
                            ? t.profitStatusText
                            : getProfitLossStatus(selectedItem) === 'loss'
                            ? t.lossStatusText
                            : t.neutralStatusText
                          : t.notSoldStatusText
                      }
                    </Typography>
                  </Grid>
                </Grid>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={closeDetails}>{t.cancel}</Button>
            </DialogActions>
          </Dialog>

          {/* Модалка аналітики */}
          <Dialog open={analyticsOpen} onClose={() => setAnalyticsOpen(false)} maxWidth="md" fullWidth>
            <DialogTitle>{t.analytics}</DialogTitle>
            <DialogContent sx={{ height: 400 }}>
              {profitByDate.length === 0 ? (
                <Typography sx={{ mt: 3 }} align="center">
                  {t.noData}
                </Typography>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
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
                      stroke="#4ade80"
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

          <Snackbar
            open={snackbar.open}
            autoHideDuration={3500}
            onClose={closeSnackbar}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert onClose={closeSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
