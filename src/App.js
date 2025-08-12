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
          borderRadius: 8,
          textTransform: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
  },
});

const GradientText = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 700,
}));

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const CenteredBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '80vh',
});

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
    fetchError: "Помилка при отриманні даних з API.",
  },
};

const t = LANGUAGES.uk;
const PROXY_SERVER_URL = "https://steam-proxy-server-lues.onrender.com";

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
  const [autocompleteValue, setAutocompleteValue] = useState(null);
  const [isFetchingPrice, setIsFetchingPrice] = useState(false);

  useEffect(() => {
    const savedInvestments = localStorage.getItem("investments");
    if (savedInvestments) {
      setInvestments(JSON.parse(savedInvestments));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("investments", JSON.stringify(investments));
  }, [investments]);

  const fetchCurrentPrice = async (itemName, gameName) => {
    setIsFetchingPrice(true);
    try {
      const response = await fetch(`${PROXY_SERVER_URL}/price?item_name=${encodeURIComponent(itemName)}&game=${encodeURIComponent(gameName)}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setIsFetchingPrice(false);
      return data.price || 0;
    } catch (error) {
      setIsFetchingPrice(false);
      console.error('Error fetching current price:', error);
      showSnackbar(t.fetchError, "error");
      return null; // Повертаємо null при помилці
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
        const url = `${PROXY_SERVER_URL}/search?query=${encodeURIComponent(newInputValue)}&game=${encodeURIComponent(game)}`;
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

  const addItem = async () => {
    if (!name || !count || !buyPrice || !boughtDate || !game) {
      showSnackbar("Будь ласка, заповніть всі обов'язкові поля.", "error");
      return;
    }
    
    const currentPriceFromApi = await fetchCurrentPrice(name, game);
    if (currentPriceFromApi === null) {
      // Якщо не вдалося отримати ціну, не додаємо предмет і виходимо
      return;
    }

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
    setAutocompleteValue({ label: item.name, value: item.name });
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
    setAutocompleteValue(null);
    setItemOptions([]);
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

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
    setAnalyticsOpen(true);
  };

  const filteredInvestments = investments.filter((item) => tabValue === 0 ? true : item.game === GAMES[tabValue - 1] );
  const totalInvestment = calculateTotalInvestment(filteredInvestments);
  const currentValue = calculateCurrentValue(filteredInvestments);
  const profit = calculateProfit(filteredInvestments);
  const percentageProfit = calculatePercentageProfit(filteredInvestments);
  const profitColor = profit >= 0 ? '#28A745' : '#DC3545';

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', backgroundColor: theme.palette.background.default }}>
        <StyledContainer maxWidth="lg">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <GradientText variant="h4" component="h1">
              {t.portfolio}
            </GradientText>
            <Button variant="outlined" startIcon={<BarChart />} onClick={handleAnalyticsOpen}>
              {t.analytics}
            </Button>
          </Box>
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={6} md={3}>
              <StyledCard>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">{t.totalInvestment}</Typography>
                  <Typography variant="h6">{totalInvestment.toFixed(2)}€</Typography>
                </CardContent>
              </StyledCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StyledCard>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">{t.currentValue}</Typography>
                  <Typography variant="h6">{currentValue.toFixed(2)}€</Typography>
                </CardContent>
              </StyledCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StyledCard>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">{t.profit}</Typography>
                  <Typography variant="h6" sx={{ color: profitColor }}>
                    {profit.toFixed(2)}€
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StyledCard>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">{t.percentageProfit}</Typography>
                  <Typography variant="h6" sx={{ color: profitColor }}>
                    {percentageProfit.toFixed(2)}%
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
          </Grid>
          <Box mb={4}>
            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} aria-label="simple tabs example">
              <Tab label={t.add} />
              {GAMES.map((game, index) => (
                <Tab key={index} label={game} />
              ))}
            </Tabs>
          </Box>
          <Box hidden={tabValue !== 0}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
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
              <Grid item xs={12} sm={6}>
                <FormControl variant="outlined" fullWidth required>
                  <InputLabel>{t.game}</InputLabel>
                  <Select
                    value={game}
                    onChange={(e) => setGame(e.target.value)}
                    label={t.game}
                  >
                    {GAMES.map((gameOption) => (
                      <MenuItem key={gameOption} value={gameOption}>
                        {gameOption}
                      </MenuItem>
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
                  onChange={(e) => setCount(Number(e.target.value))}
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
                  onChange={(e) => setBuyPrice(Number(e.target.value))}
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
                </>
              )}
              <Grid item xs={12}>
                <Button variant="contained" color="primary" fullWidth onClick={addItem} disabled={isFetchingPrice}>
                  {isFetchingPrice ? <CircularProgress size={24} color="inherit" /> : editingItem ? t.save : t.add_item}
                </Button>
              </Grid>
            </Grid>
          </Box>
          {GAMES.map((gameName, index) => (
            <Box key={index} hidden={tabValue !== index + 1}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>{t.name}</StyledTableCell>
                    <StyledTableCell>{t.count}</StyledTableCell>
                    <StyledTableCell>{t.buyPrice}</StyledTableCell>
                    <StyledTableCell>{t.currentPrice}</StyledTableCell>
                    <StyledTableCell>{t.profit}</StyledTableCell>
                    <StyledTableCell>{t.action}</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {investments.filter(item => item.game === gameName).map((item) => (
                    <TableRow key={item.id}>
                      <StyledTableCell>{item.name}</StyledTableCell>
                      <StyledTableCell>{item.count}</StyledTableCell>
                      <StyledTableCell>{item.buyPrice}€</StyledTableCell>
                      <StyledTableCell>{item.currentPrice}€</StyledTableCell>
                      <StyledTableCell>
                        <Chip
                          label={`${(item.currentPrice * item.count - item.buyPrice * item.count).toFixed(2)}€`}
                          color={
                            (item.currentPrice * item.count - item.buyPrice * item.count) >= 0
                              ? 'success'
                              : 'error'
                          }
                        />
                      </StyledTableCell>
                      <StyledTableCell>
                        <IconButton onClick={() => editItem(item)}>
                          <Edit />
                        </IconButton>
                        <IconButton onClick={() => confirmDelete(item)}>
                          <Delete />
                        </IconButton>
                      </StyledTableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          ))}
          <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
            <DialogTitle>{t.deleteConfirmation}</DialogTitle>
            <DialogContent>
              <Typography>{itemToDelete?.name}</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteDialogOpen(false)}>{t.cancel}</Button>
              <Button onClick={deleteItem} color="error" variant="contained">{t.delete}</Button>
            </DialogActions>
          </Dialog>
          <Dialog open={analyticsOpen} onClose={() => setAnalyticsOpen(false)} maxWidth="md" fullWidth>
            <DialogTitle>{t.analytics}</DialogTitle>
            <DialogContent>
              <Typography variant="h6">Загальний прибуток (продано): {calculateProfit(investments.filter(i => i.sold)).toFixed(2)}€</Typography>
              <Typography variant="h6">Поточний прибуток (в активі): {calculateProfit(investments.filter(i => !i.sold)).toFixed(2)}€</Typography>
              <Typography variant="h6">Загальний прибуток: {calculateProfit(investments).toFixed(2)}€</Typography>
              <Box mt={4}>
                <Typography variant="h6" mb={2}>Прибуток за датою продажу (кумулятивно)</Typography>
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
        </StyledContainer>
      </Box>
    </ThemeProvider>
  );
}
