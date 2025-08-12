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

// Визначення теми для Material UI
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6F42C1',
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
      color: '#212529',
    },
    body1: {
      color: '#495057',
    },
  },
});

// Стилізований контейнер
const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  backdropFilter: 'blur(4px)',
  webkitBackdropFilter: 'blur(4px)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  padding: theme.spacing(4),
}));

// Стилізована картка для інвестиції
const InvestmentCard = styled(Card)(({ theme }) => ({
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 20px 0 rgba(0,0,0,0.1)',
  },
}));

// Масив ігор для випадаючого списку
const games = [
  { label: 'CS2', value: 'CS2' },
  { label: 'Dota 2', value: 'Dota 2' },
  { label: 'PUBG', value: 'PUBG' },
];

const backendUrl = "https://steam-investment-app-proxy.onrender.com";

const App = () => {
  const [investments, setInvestments] = useState([]);
  const [name, setName] = useState("");
  const [count, setCount] = useState(1);
  const [buyPrice, setBuyPrice] = useState(0);
  const [boughtDate, setBoughtDate] = useState("");
  const [game, setGame] = useState("CS2");
  const [sold, setSold] = useState(false);
  const [sellPrice, setSellPrice] = useState(0);
  const [sellDate, setSellDate] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [editingItem, setEditingItem] = useState(null);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [analyticsData, setAnalyticsData] = useState({});
  const [profitByDate, setProfitByDate] = useState([]);
  const [isFetchingPrice, setIsFetchingPrice] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [filteredInvestments, setFilteredInvestments] = useState([]);
  const [filterGame, setFilterGame] = useState("All");

  const t = { // Це для зручності, в реальному додатку краще використовувати бібліотеку для i18n
    appTitle: "Менеджер інвестицій Steam",
    addItem: "Додати предмет",
    updateItem: "Оновити предмет",
    name: "Назва предмета",
    count: "Кількість",
    buyPrice: "Ціна купівлі (за шт.)",
    boughtDate: "Дата купівлі",
    game: "Гра",
    sold: "Продано",
    sellPrice: "Ціна продажу (за шт.)",
    sellDate: "Дата продажу",
    totalProfit: "Загальний прибуток",
    currentProfit: "Поточний прибуток",
    totalInvested: "Загальні інвестиції",
    itemAdded: "Предмет успішно додано!",
    itemUpdated: "Предмет успішно оновлено!",
    itemDeleted: "Предмет успішно видалено!",
    fetchPriceError: "Не вдалося отримати ціну предмета.",
    analyticsTitle: "Аналітика",
    cancel: "Скасувати",
    all: "Всі",
    totalProfitLoss: "Загальний прибуток/збиток:",
    profit: "Прибуток",
    dataNotAvailable: "Дані аналітики недоступні.",
    noInvestments: "Немає інвестицій. Додайте свій перший предмет!",
    confirmDelete: "Ви впевнені, що хочете видалити цей предмет?",
  };

  const getProfit = (item) => {
    let profit = 0;
    if (item.sold) {
      profit = (item.sellPrice - item.buyPrice) * item.count;
    } else if (item.currentPrice) {
      profit = (item.currentPrice - item.buyPrice) * item.count;
    }
    return profit;
  };

  const calculateTotalProfit = () => {
    const total = investments.reduce((sum, item) => sum + getProfit(item), 0);
    setTotalProfit(total);
  };

  const fetchCurrentPrice = async (itemName, gameName) => {
    setIsFetchingPrice(true);
    try {
      const response = await fetch(`${backendUrl}/price?game=${encodeURIComponent(gameName)}&itemName=${encodeURIComponent(itemName)}`);
      if (!response.ok) {
        throw new Error("Price not found or server error");
      }
      const data = await response.json();
      setIsFetchingPrice(false);
      return parseFloat(data.price);
    } catch (error) {
      setIsFetchingPrice(false);
      console.error("Помилка при отриманні ціни:", error);
      showSnackbar(t.fetchPriceError, "error");
      return null;
    }
  };

  const addItem = async () => {
    try {
      if (!name || count <= 0 || buyPrice <= 0 || !boughtDate || !game) {
        showSnackbar("Будь ласка, заповніть всі обов'язкові поля.", "error");
        return;
      }
      // Отримуємо поточну ціну
      const currentPriceFromApi = await fetchCurrentPrice(name, game);
      if (currentPriceFromApi === null) {
        return; // Якщо ціна не знайдена, не додаємо предмет
      }

      const newItem = {
        id: editingItem ? editingItem.id : Date.now(),
        name,
        count: parseFloat(count),
        buyPrice: parseFloat(buyPrice),
        currentPrice: currentPriceFromApi,
        game,
        boughtDate,
        sold,
        sellPrice: sold ? parseFloat(sellPrice) : 0,
        sellDate: sold ? sellDate : null,
      };

      if (editingItem) {
        setInvestments(
          investments.map((item) => (item.id === newItem.id ? newItem : item))
        );
        setEditingItem(null);
        showSnackbar(t.itemUpdated, "success");
      } else {
        setInvestments([...investments, newItem]);
        showSnackbar(t.itemAdded, "success");
      }
      resetForm();
    } catch (error) {
      console.error("Помилка при додаванні/редагуванні предмета:", error);
      showSnackbar("Виникла несподівана помилка. Спробуйте ще раз.", "error");
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setName(item.name);
    setCount(item.count);
    setBuyPrice(item.buyPrice);
    setBoughtDate(item.boughtDate);
    setGame(item.game);
    setSold(item.sold);
    setSellPrice(item.sellPrice);
    setSellDate(item.sellDate || "");
    setTabValue(0);
  };

  const handleDelete = (id) => {
    if (window.confirm(t.confirmDelete)) {
      setInvestments(investments.filter((item) => item.id !== id));
      showSnackbar(t.itemDeleted, "success");
    }
  };

  const resetForm = () => {
    setName("");
    setCount(1);
    setBuyPrice(0);
    setBoughtDate("");
    setGame("CS2");
    setSold(false);
    setSellPrice(0);
    setSellDate("");
    setEditingItem(null);
  };

  const openAnalytics = () => {
    const profitData = investments.reduce((acc, item) => {
      const dateKey = item.boughtDate;
      const profit = getProfit(item);
      acc[dateKey] = (acc[dateKey] || 0) + profit;
      return acc;
    }, {});

    const chartData = Object.keys(profitData).map((date) => ({
      date,
      profit: profitData[date],
    })).sort((a, b) => new Date(a.date) - new Date(b.date));

    setProfitByDate(chartData);
    setAnalyticsData({
      totalInvested: investments.reduce(
        (sum, item) => sum + item.buyPrice * item.count,
        0
      ),
      totalProfit: totalProfit,
      currentProfit: investments.reduce(
        (sum, item) => sum + (item.sold ? 0 : getProfit(item)),
        0
      ),
      soldProfit: investments.reduce(
        (sum, item) => sum + (item.sold ? getProfit(item) : 0),
        0
      ),
    });
    setAnalyticsOpen(true);
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    calculateTotalProfit();
  }, [investments]);

  useEffect(() => {
    const filtered = investments.filter(item =>
      filterGame === "All" || item.game === filterGame
    );
    setFilteredInvestments(filtered);
  }, [investments, filterGame]);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: '100vh', padding: 2 }}>
        <StyledContainer maxWidth="lg">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Typography variant="h4" component="h1">
              {t.appTitle}
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<BarChart />}
              onClick={openAnalytics}
            >
              {t.analyticsTitle}
            </Button>
          </Box>
          <Box mb={4}>
            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} aria-label="tabs">
              <Tab label={t.addItem} />
              <Tab label="Інвестиції" />
            </Tabs>
          </Box>

          {tabValue === 0 && (
            <Box component="form" onSubmit={(e) => { e.preventDefault(); addItem(); }}>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} sm={6}>
                  <TextField
                    label={t.name}
                    variant="outlined"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined" required>
                    <InputLabel>{t.game}</InputLabel>
                    <Select
                      value={game}
                      onChange={(e) => setGame(e.target.value)}
                      label={t.game}
                    >
                      {games.map((g) => (
                        <MenuItem key={g.value} value={g.value}>{g.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label={t.count}
                    type="number"
                    variant="outlined"
                    fullWidth
                    value={count}
                    onChange={(e) => setCount(parseFloat(e.target.value) || 0)} // Виправлено
                    required
                    inputProps={{ min: 1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label={t.buyPrice}
                    type="number"
                    variant="outlined"
                    fullWidth
                    value={buyPrice}
                    onChange={(e) => setBuyPrice(parseFloat(e.target.value) || 0)} // Виправлено
                    required
                    inputProps={{ min: 0 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
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
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>{t.sold}</InputLabel>
                    <Select
                      value={sold}
                      onChange={(e) => setSold(e.target.value)}
                      label={t.sold}
                    >
                      <MenuItem value={true}>Так</MenuItem>
                      <MenuItem value={false}>Ні</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                {sold && (
                  <>
                    <Grid item xs={12} sm={6} md={6}>
                      <TextField
                        label={t.sellPrice}
                        type="number"
                        variant="outlined"
                        fullWidth
                        value={sellPrice}
                        onChange={(e) => setSellPrice(parseFloat(e.target.value) || 0)} // Виправлено
                        required
                        inputProps={{ min: 0 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
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
                  </>
                )}
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={isFetchingPrice}
                    startIcon={isFetchingPrice ? <CircularProgress size={20} color="inherit" /> : null}
                  >
                    {editingItem ? t.updateItem : (isFetchingPrice ? "Отримання ціни..." : t.addItem)}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}

          {tabValue === 1 && (
            <Box>
              <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h5">Інвестиції</Typography>
                <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                  <InputLabel>Фільтр по грі</InputLabel>
                  <Select
                    value={filterGame}
                    onChange={(e) => setFilterGame(e.target.value)}
                    label="Фільтр по грі"
                  >
                    <MenuItem value="All">Всі</MenuItem>
                    {games.map(game => (
                      <MenuItem key={game.value} value={game.value}>{game.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Grid container spacing={3}>
                {filteredInvestments.length === 0 ? (
                  <Grid item xs={12}>
                    <Typography variant="body1" align="center">
                      {t.noInvestments}
                    </Typography>
                  </Grid>
                ) : (
                  filteredInvestments.map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item.id}>
                      <InvestmentCard>
                        <CardContent>
                          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                            <Typography variant="h6">{item.name}</Typography>
                            <Chip
                              label={item.sold ? 'Продано' : 'В активі'}
                              color={item.sold ? 'secondary' : 'success'}
                              size="small"
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            **Гра:** {item.game}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            **Куплено:** {item.count} шт. по {item.buyPrice}€ ({item.boughtDate})
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            **Загальні витрати:** {(item.count * item.buyPrice).toFixed(2)}€
                          </Typography>
                          {!item.sold && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                              **Поточна ціна (за шт.):** {item.currentPrice}€
                            </Typography>
                          )}
                          {item.sold && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                              **Продано:** по {item.sellPrice}€ ({item.sellDate})
                            </Typography>
                          )}
                          <Box display="flex" alignItems="center" mt={2}>
                            <TrendingUp color={getProfit(item) >= 0 ? "success" : "error"} />
                            <Typography
                              variant="h6"
                              color={getProfit(item) >= 0 ? "success.main" : "error.main"}
                              sx={{ ml: 1, fontWeight: 'bold' }}
                            >
                              Прибуток: {getProfit(item).toFixed(2)}€
                            </Typography>
                          </Box>
                          <Box display="flex" justifyContent="flex-end" mt={2}>
                            <IconButton color="primary" onClick={() => handleEdit(item)}>
                              <Edit />
                            </IconButton>
                            <IconButton color="error" onClick={() => handleDelete(item.id)}>
                              <Delete />
                            </IconButton>
                          </Box>
                        </CardContent>
                      </InvestmentCard>
                    </Grid>
                  ))
                )}
              </Grid>
              <Box mt={4} textAlign="center">
                <Typography variant="h5">
                  {t.totalProfitLoss}
                  <Box component="span" sx={{ color: totalProfit >= 0 ? theme.palette.success.main : theme.palette.error.main, ml: 1, fontWeight: 'bold' }}>
                    {totalProfit.toFixed(2)}€
                  </Box>
                </Typography>
              </Box>
            </Box>
          )}

          {/* Dialog for Analytics */}
          <Dialog open={analyticsOpen} onClose={() => setAnalyticsOpen(false)} maxWidth="md" fullWidth>
            <DialogTitle>{t.analyticsTitle}</DialogTitle>
            <DialogContent>
              <Typography variant="h6">Загальна сума інвестицій: {analyticsData.totalInvested?.toFixed(2)}€</Typography>
              <Typography variant="h6">Поточний прибуток (активні): {analyticsData.currentProfit?.toFixed(2)}€</Typography>
              <Typography variant="h6">Прибуток з проданих: {analyticsData.soldProfit?.toFixed(2)}€</Typography>
              <Typography variant="h6">Загальний прибуток: {analyticsData.totalProfit?.toFixed(2)}€</Typography>
              <Box mt={4}>
                <Typography variant="h6" mb={2}>Прибуток за датою купівлі</Typography>
              </Box>
              {profitByDate.length === 0 ? (
                <Typography variant="body1" align="center" color="text.secondary">
                  {t.dataNotAvailable}
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
                      stroke="#6F42C1"
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

          {/* Snackbar for notifications */}
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
        </StyledContainer>
      </Box>
    </ThemeProvider>
  );
};

export default App;
