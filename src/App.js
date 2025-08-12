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

// Оновлені налаштування теми для мінімалістичного, світлого дизайну
const theme = createTheme({
  palette: {
    mode: 'light', // Встановлюємо світлий режим
    primary: {
      main: '#6F42C1', // Пастельний фіолетовий для акцентів
    },
    secondary: {
      main: '#007BFF', // Світло-синій
    },
    background: {
      default: '#F8F9FA', // М'який білий для фону
      paper: '#FFFFFF', // Чистий білий для карток і діалогів
    },
    text: {
      primary: '#212529', // Темний, майже чорний, текст
      secondary: '#6C757D', // Сірий для допоміжного тексту
    },
  },
  typography: {
    fontFamily: ['Poppins', 'Inter', 'sans-serif'].join(','),
    h4: {
      fontWeight: 700,
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
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)', // Легка тінь
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-2px)', // Легкий підйом при наведенні
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

// Стилізований заголовок з градієнтом
const GradientText = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 700,
}));

// Стилізовані компоненти для мінімалістичного дизайну
const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const GAMES = ["CS2", "Dota 2", "PUBG", "Інші"];

const LANGUAGES = {
  uk: {
    portfolio: "Портфель інвестицій",
    name: "Назва предмета",
    count: "Кількість",
    buyPrice: "Ціна купівлі",
    currentPrice: "Поточна ціна",
    game: "Гра",
    boughtDate: "Дата купівлі",
    action: "Дії",
    add: "Додати предмет",
    add_item: "Додати предмет",
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
    currentValue: "Поточна вартість",
    profit: "Прибуток",
    percentageProfit: "Процентний прибуток",
    analytics: "Аналітика",
    noData: "Немає даних для відображення.",
    itemAdded: "Предмет успішно додано!",
    itemUpdated: "Предмет успішно оновлено!",
    itemDeleted: "Предмет успішно видалено!",
  },
};

const t = LANGUAGES.uk;

export default function App() {
  const [investments, setInvestments] = useState([]);
  const [name, setName] = useState("");
  const [count, setCount] = useState(1);
  const [buyPrice, setBuyPrice] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [game, setGame] = useState(GAMES[0]);
  const [boughtDate, setBoughtDate] = useState(new Date().toISOString().split('T')[0]);
  const [sellPrice, setSellPrice] = useState(0);
  const [sellDate, setSellDate] = useState(new Date().toISOString().split('T')[0]);
  const [editingItem, setEditingItem] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [sold, setSold] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [profitByDate, setProfitByDate] = useState([]);
  const [autocompleteLoading, setAutocompleteLoading] = useState(false);
  const [itemOptions, setItemOptions] = useState([]);
  const abortControllerRef = useRef(null);

  // Завантаження даних з Local Storage при завантаженні
  useEffect(() => {
    const savedInvestments = localStorage.getItem("investments");
    if (savedInvestments) {
      setInvestments(JSON.parse(savedInvestments));
    }
  }, []);

  // Збереження даних в Local Storage при зміні
  useEffect(() => {
    localStorage.setItem("investments", JSON.stringify(investments));
  }, [investments]);

  // Функція для отримання поточних цін (зараз фіксована, для демонстрації)
  const fetchCurrentPrice = async (itemName, gameName) => {
    // В реальному додатку тут був би виклик API, наприклад, Steam API, Buff163
    setAutocompleteLoading(true);
    // Імітація затримки API
    await new Promise(resolve => setTimeout(resolve, 500));
    setAutocompleteLoading(false);
    return Math.random() * 1000 + 10; // Повертає випадкову ціну
  };
  
  // Обробник для Autocomplete
  const handleItemNameChange = async (event, newValue) => {
    setName(newValue || "");
    if (newValue && newValue.length > 2) {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;
      setAutocompleteLoading(true);
      
      try {
        // Імітація виклику API для пошуку предметів
        const response = await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            const mockData = [
              { label: `${newValue} (skin)` },
              { label: `${newValue} (case)` },
              { label: `${newValue} (sticker)` },
            ];
            resolve(mockData);
          }, 500);

          signal.addEventListener('abort', () => {
            clearTimeout(timeout);
            reject(new Error('Aborted'));
          });
        });
        setItemOptions(response);
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('Fetch aborted');
        } else {
          console.error('Error fetching autocomplete options:', error);
        }
      } finally {
        setAutocompleteLoading(false);
      }
    } else {
      setItemOptions([]);
      setAutocompleteLoading(false);
    }
  };

  const addItem = async () => {
    if (!name || !count || !buyPrice || !boughtDate || !game) {
      showSnackbar("Будь ласка, заповніть всі обов'язкові поля.", "error");
      return;
    }
    const currentPriceFromApi = await fetchCurrentPrice(name, game);
    const newItem = {
      id: editingItem ? editingItem.id : Date.now(),
      name,
      count,
      buyPrice,
      currentPrice: currentPriceFromApi,
      game,
      boughtDate,
      sold,
      sellPrice: sold ? sellPrice : 0,
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
  };

  const editItem = (item) => {
    setEditingItem(item);
    setName(item.name);
    setCount(item.count);
    setBuyPrice(item.buyPrice);
    setCurrentPrice(item.currentPrice);
    setGame(item.game);
    setBoughtDate(item.boughtDate);
    setSold(item.sold);
    setSellPrice(item.sellPrice || 0);
    setSellDate(item.sellDate || new Date().toISOString().split('T')[0]);
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
    setCurrentPrice(0);
    setGame(GAMES[0]);
    setBoughtDate(new Date().toISOString().split('T')[0]);
    setSellPrice(0);
    setSellDate(new Date().toISOString().split('T')[0]);
    setSold(false);
    setEditingItem(null);
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Розрахунки для аналітики
  const calculateTotalInvestment = (items) => items.reduce((sum, item) => sum + item.buyPrice * item.count, 0);
  const calculateCurrentValue = (items) => items.reduce((sum, item) => {
    if (item.sold) {
      return sum + item.sellPrice * item.count;
    }
    return sum + item.currentPrice * item.count;
  }, 0);
  
  const calculateProfit = (items) => {
    const totalInvest = calculateTotalInvestment(items);
    const totalValue = calculateCurrentValue(items);
    return totalValue - totalInvest;
  };
  
  const calculatePercentageProfit = (items) => {
    const totalInvest = calculateTotalInvestment(items);
    if (totalInvest === 0) return 0;
    return (calculateProfit(items) / totalInvest) * 100;
  };
  
  const handleAnalyticsOpen = () => {
    const profitData = investments
      .filter(item => item.sold)
      .map(item => ({
        date: item.sellDate,
        profit: (item.sellPrice - item.buyPrice) * item.count,
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
      
    // Агрегація прибутку по датах
    const aggregatedProfit = profitData.reduce((acc, curr) => {
      const existing = acc.find(p => p.date === curr.date);
      if (existing) {
        existing.profit += curr.profit;
      } else {
        acc.push(curr);
      }
      return acc;
    }, []);
    
    setProfitByDate(aggregatedProfit);
    setAnalyticsOpen(true);
  };

  // Фільтрація за грою
  const filteredInvestments = investments.filter((item) =>
    tabValue === 0 ? true : item.game === GAMES[tabValue - 1]
  );
  
  // Розрахунки для відображення в шапці
  const totalInvestment = calculateTotalInvestment(filteredInvestments);
  const currentValue = calculateCurrentValue(filteredInvestments);
  const profit = calculateProfit(filteredInvestments);
  const percentageProfit = calculatePercentageProfit(filteredInvestments);

  const profitColor = profit >= 0 ? '#28A745' : '#DC3545'; // Зелений для прибутку, червоний для збитку

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', backgroundColor: theme.palette.background.default }}>
        <StyledContainer maxWidth="lg">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <GradientText variant="h4" component="h1">
              {t.portfolio}
            </GradientText>
            <Button
              variant="outlined"
              startIcon={<BarChart />}
              onClick={handleAnalyticsOpen}
            >
              {t.analytics}
            </Button>
          </Box>

          {/* Панель з основними показниками */}
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={6} md={3}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    {t.totalInvestment}
                  </Typography>
                  <Typography variant="h5" component="div" fontWeight={600}>
                    ${totalInvestment.toFixed(2)}
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    {t.currentValue}
                  </Typography>
                  <Typography variant="h5" component="div" fontWeight={600}>
                    ${currentValue.toFixed(2)}
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    {t.profit}
                  </Typography>
                  <Typography variant="h5" component="div" sx={{ color: profitColor }} fontWeight={600}>
                    ${profit.toFixed(2)}
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    {t.percentageProfit}
                  </Typography>
                  <Typography variant="h5" component="div" sx={{ color: profitColor }} fontWeight={600}>
                    {percentageProfit.toFixed(2)}%
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
          </Grid>
          
          {/* Форма для додавання/редагування */}
          <StyledCard>
            <Typography variant="h6" mb={2}>
              {editingItem ? t.editItem : t.add_item}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Autocomplete
                  freeSolo
                  options={itemOptions}
                  getOptionLabel={(option) => option.label || option}
                  loading={autocompleteLoading}
                  value={name}
                  onInputChange={handleItemNameChange}
                  onChange={(event, newValue) => setName(newValue || "")}
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
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  label={t.count}
                  type="number"
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  label={t.buyPrice}
                  type="number"
                  value={buyPrice}
                  onChange={(e) => setBuyPrice(Number(e.target.value))}
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel>{t.game}</InputLabel>
                  <Select
                    value={game}
                    onChange={(e) => setGame(e.target.value)}
                    label={t.game}
                  >
                    {GAMES.map((gameName) => (
                      <MenuItem key={gameName} value={gameName}>
                        {gameName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label={t.boughtDate}
                  type="date"
                  value={boughtDate}
                  onChange={(e) => setBoughtDate(e.target.value)}
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel>{t.sold}</InputLabel>
                  <Select
                    value={sold}
                    onChange={(e) => setSold(e.target.value)}
                    label={t.sold}
                  >
                    <MenuItem value={true}>{t.yes}</MenuItem>
                    <MenuItem value={false}>{t.no}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {sold && (
                <>
                  <Grid item xs={12} md={3}>
                    <TextField
                      label={t.sellPrice}
                      type="number"
                      value={sellPrice}
                      onChange={(e) => setSellPrice(Number(e.target.value))}
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      label={t.sellDate}
                      type="date"
                      value={sellDate}
                      onChange={(e) => setSellDate(e.target.value)}
                      variant="outlined"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                </>
              )}
              <Grid item xs={12}>
                <Button variant="contained" color="primary" onClick={addItem}>
                  {editingItem ? t.save : t.add}
                </Button>
                {editingItem && (
                  <Button
                    variant="text"
                    onClick={resetForm}
                    sx={{ ml: 1 }}
                  >
                    {t.cancel}
                  </Button>
                )}
              </Grid>
            </Grid>
          </StyledCard>

          {/* Фільтрація по іграх */}
          <Box mb={2}>
            <Tabs
              value={tabValue}
              onChange={(e, newValue) => setTabValue(newValue)}
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Tab label="Всі" />
              {GAMES.map((gameName) => (
                <Tab key={gameName} label={gameName} />
              ))}
            </Tabs>
          </Box>

          {/* Таблиця з інвестиціями */}
          <StyledCard>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>{t.name}</StyledTableCell>
                  <StyledTableCell>{t.count}</StyledTableCell>
                  <StyledTableCell>{t.game}</StyledTableCell>
                  <StyledTableCell>{t.buyPrice}</StyledTableCell>
                  <StyledTableCell>{t.currentPrice}</StyledTableCell>
                  <StyledTableCell>{t.profit}</StyledTableCell>
                  <StyledTableCell>{t.action}</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredInvestments.map((item) => {
                  const profitValue = item.sold
                    ? (item.sellPrice - item.buyPrice) * item.count
                    : (item.currentPrice - item.buyPrice) * item.count;
                  return (
                    <TableRow key={item.id}>
                      <StyledTableCell>
                        <Box display="flex" alignItems="center">
                          <Typography>{item.name}</Typography>
                          {item.sold && (
                            <Tooltip title={`${t.sold} (${item.sellDate})`}>
                              <Chip
                                label={t.sold}
                                color="success"
                                size="small"
                                sx={{ ml: 1, backgroundColor: theme.palette.success.light }}
                              />
                            </Tooltip>
                          )}
                        </Box>
                      </StyledTableCell>
                      <StyledTableCell>{item.count}</StyledTableCell>
                      <StyledTableCell>{item.game}</StyledTableCell>
                      <StyledTableCell>${item.buyPrice.toFixed(2)}</StyledTableCell>
                      <StyledTableCell>${item.currentPrice.toFixed(2)}</StyledTableCell>
                      <StyledTableCell>
                        <Box display="flex" alignItems="center">
                          <Typography sx={{ color: profitValue >= 0 ? '#28A745' : '#DC3545' }}>
                            ${profitValue.toFixed(2)}
                          </Typography>
                          {profitValue >= 0 ? (
                            <TrendingUp size={16} color="#28A745" style={{ marginLeft: 4 }} />
                          ) : (
                            <TrendingUp size={16} color="#DC3545" style={{ transform: 'rotate(180deg)', marginLeft: 4 }} />
                          )}
                        </Box>
                      </StyledTableCell>
                      <StyledTableCell>
                        <IconButton color="primary" onClick={() => editItem(item)}>
                          <Edit size={20} />
                        </IconButton>
                        <IconButton color="secondary" onClick={() => confirmDelete(item)}>
                          <Delete size={20} />
                        </IconButton>
                      </StyledTableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </StyledCard>

          {/* Діалог для підтвердження видалення */}
          <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
            <DialogTitle>{t.delete}</DialogTitle>
            <DialogContent>
              <Typography>{t.deleteConfirmation}</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteDialogOpen(false)}>{t.cancel}</Button>
              <Button onClick={deleteItem} color="secondary" variant="contained">
                {t.delete}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Діалог для аналітики */}
          <Dialog
            open={analyticsOpen}
            onClose={() => setAnalyticsOpen(false)}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>{t.analytics}</DialogTitle>
            <DialogContent sx={{ height: 400 }}>
              {profitByDate.length === 0 ? (
                <Typography variant="body1" align="center" mt={3}>
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
                      stroke="#6F42C1" // Використовуємо акцентний колір
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
        </StyledContainer>
      </Box>
    </ThemeProvider>
  );
}
