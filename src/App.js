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
      fontSize: '2.5rem',
      color: '#4A148C',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      color: '#212529',
    },
    body1: {
      fontSize: '1rem',
      color: '#212529',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
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
  },
});

const STEAM_CDN_URL = 'https://community.cloudflare.steamstatic.com/economy/image/';

const API_BASE_URL = 'https://steam-investment-app-api.vercel.app';
// -- ВИПРАВЛЕНО: Рядок з API-ключем повернуто, оскільки він доступний у вашому середовищі.
const STEAM_API_KEY = process.env.STEAM_API_KEY;

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 6px 25px rgba(0, 0, 0, 0.1)',
  },
}));

const InvestmentTable = styled(Table)(({ theme }) => ({
  minWidth: 650,
  '& .MuiTableCell-head': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: 'bold',
  },
}));

function App() {
  const [investments, setInvestments] = useState([]);
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemGame, setItemGame] = useState("CS:GO");
  const [itemFloat, setItemFloat] = useState("");
  const [addDialog, setAddDialog] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [currentInvestment, setCurrentInvestment] = useState(null);
  const [analyticsData, setAnalyticsData] = useState([]);
  const [profitByDate, setProfitByDate] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedItemDetails, setSelectedItemDetails] = useState(null);
  const [autocompleteLoading, setAutocompleteLoading] = useState(false);
  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [tabIndex, setTabIndex] = useState(0);

  const fetchTimeoutRef = useRef(null);

  // Функції для роботи зі Snackbar
  const openSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Функція для скидання форми
  const resetForm = () => {
    setItemName("");
    setItemPrice("");
    setItemFloat("");
    setItemGame("CS:GO");
    setSelectedItemDetails(null);
    setValue(null);
    setInputValue('');
    setSearchResults([]);
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  // Збереження даних у localStorage
  useEffect(() => {
    const storedInvestments = localStorage.getItem("investments");
    if (storedInvestments) {
      setInvestments(JSON.parse(storedInvestments));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("investments", JSON.stringify(investments));
    calculateAnalytics();
  }, [investments]);

  // Розрахунок аналітики
  const calculateAnalytics = () => {
    const totalInvested = investments.reduce((sum, inv) => sum + parseFloat(inv.price), 0);
    const profitData = {};

    investments.forEach(inv => {
      const date = new Date(inv.date).toISOString().split('T')[0];
      const profit = (inv.currentPrice - parseFloat(inv.price));
      if (!profitData[date]) {
        profitData[date] = 0;
      }
      profitData[date] += profit;
    });

    const formattedProfitByDate = Object.keys(profitData).map(date => ({
      date,
      profit: parseFloat(profitData[date].toFixed(2))
    }));

    setProfitByDate(formattedProfitByDate);

    const totalProfit = investments.reduce((sum, inv) => sum + (inv.currentPrice - parseFloat(inv.price)), 0);
    const profitPercentage = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;
    setAnalyticsData({
      totalInvested: totalInvested.toFixed(2),
      totalProfit: totalProfit.toFixed(2),
      profitPercentage: profitPercentage.toFixed(2)
    });
  };

  // Функція для отримання поточної ціни
  const fetchCurrentPrice = async (item) => {
    try {
      const response = await fetch(`${API_BASE_URL}/price?game=${item.game}&itemName=${encodeURIComponent(item.name)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch price');
      }
      const data = await response.json();
      return data.price;
    } catch (error) {
      console.error("Error fetching current price:", error);
      return item.currentPrice;
    }
  };

  // Оновлення цін для всіх інвестицій
  const updateAllPrices = async () => {
    setLoading(true);
    const updatedInvestments = await Promise.all(
      investments.map(async (inv) => {
        const newPrice = await fetchCurrentPrice(inv);
        return { ...inv, currentPrice: newPrice };
      })
    );
    setInvestments(updatedInvestments);
    setLoading(false);
    openSnackbar("Усі ціни оновлено!", "success");
  };

  // Додавання нової інвестиції
  const handleAddInvestment = async (e) => {
    e.preventDefault();
    if (!selectedItemDetails) {
      openSnackbar("Будь ласка, виберіть предмет зі списку.", "error");
      return;
    }

    setLoading(true);
    try {
      const newInvestment = {
        id: Date.now(),
        name: selectedItemDetails.label,
        game: itemGame,
        price: parseFloat(itemPrice),
        currentPrice: await fetchCurrentPrice(selectedItemDetails),
        float: itemFloat ? parseFloat(itemFloat) : null,
        image: selectedItemDetails.image,
        date: new Date().toISOString().split('T')[0],
      };
      setInvestments([...investments, newInvestment]);
      setAddDialog(false);
      resetForm();
      openSnackbar("Інвестицію успішно додано!", "success");
    } catch (error) {
      console.error("Error adding investment:", error);
      openSnackbar("Помилка під час додавання інвестиції.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Видалення інвестиції
  const handleDeleteInvestment = (id) => {
    setInvestments(investments.filter((inv) => inv.id !== id));
    openSnackbar("Інвестицію видалено.", "info");
  };

  // Отримання предметів для автозаповнення
  const fetchItems = async (query) => {
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }
    setAutocompleteLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/search?game=${itemGame}&query=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch items');
      }
      const data = await response.json();
      
      // -- ВИПРАВЛЕНО: Формування URL зображення --
      // Використовуємо наданий URL, і якщо він є фрагментом, додаємо повний CDN URL.
      // Згідно з наданим прикладом, це фрагмент, тому ми його збираємо.
      const formattedOptions = data.results.map(item => {
        const imageUrl = item.icon_url.startsWith('https://')
          ? item.icon_url
          : `${STEAM_CDN_URL}${item.icon_url}`;
          
        return {
          label: item.name,
          image: imageUrl,
          float: item.float
        };
      });
      setSearchResults(formattedOptions);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setAutocompleteLoading(false);
    }
  };

  const handleItemNameChange = (event, newValue) => {
    setValue(newValue);
    if (newValue) {
      setSelectedItemDetails(newValue);
    } else {
      setSelectedItemDetails(null);
    }
  };

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }
    fetchTimeoutRef.current = setTimeout(() => {
      fetchItems(newInputValue);
    }, 500);
  };

  const showAnalytics = (inv) => {
    setCurrentInvestment(inv);
    setAnalyticsOpen(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="xl" sx={{ py: 4, backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
        {/* Хедер */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h2">Steam Investment Tracker</Typography>
          <Box>
            <Button
              variant="contained"
              startIcon={<Plus />}
              onClick={() => setAddDialog(true)}
              sx={{ mr: 2 }}
            >
              Додати інвестицію
            </Button>
            <Button
              variant="outlined"
              startIcon={<TrendingUp />}
              onClick={updateAllPrices}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Оновити ціни'}
            </Button>
          </Box>
        </Box>

        {/* Загальна аналітика */}
        <Grid container spacing={4} mb={4}>
          <Grid item xs={12} sm={6} md={4}>
            <StyledCard>
              <CardContent>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Загальна інвестована сума
                </Typography>
                <Typography variant="h3">{analyticsData.totalInvested || '0.00'} USD</Typography>
              </CardContent>
            </StyledCard>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StyledCard>
              <CardContent>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Загальний прибуток/збиток
                </Typography>
                <Typography variant="h3" color={analyticsData.totalProfit > 0 ? 'success.main' : 'error.main'}>
                  {analyticsData.totalProfit || '0.00'} USD
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StyledCard>
              <CardContent>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Відсоток прибутку
                </Typography>
                <Typography variant="h3" color={analyticsData.profitPercentage > 0 ? 'success.main' : 'error.main'}>
                  {analyticsData.profitPercentage || '0.00'}%
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Таблиця інвестицій */}
        <Box sx={{ overflowX: 'auto' }}>
          <InvestmentTable>
            <TableHead>
              <TableRow>
                <TableCell>Назва предмета</TableCell>
                <TableCell>Гра</TableCell>
                <TableCell>Ціна покупки</TableCell>
                <TableCell>Поточна ціна</TableCell>
                <TableCell>Прибуток/збиток</TableCell>
                <TableCell>Дії</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {investments.length > 0 ? (
                investments.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {/* -- ВИПРАВЛЕНО: Відображення зображення -- */}
                        <img
                          src={inv.image}
                          alt={inv.name}
                          style={{ width: 40, height: 40, marginRight: 16, borderRadius: 8, objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.src = "https://placehold.co/40x40/f3f4f6/000000?text=NA";
                          }}
                        />
                        <Typography>{inv.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={inv.game}
                        size="small"
                        color={inv.game === "CS:GO" ? "primary" : "secondary"}
                      />
                    </TableCell>
                    <TableCell>{inv.price.toFixed(2)} USD</TableCell>
                    <TableCell>
                      <Tooltip title={`Оновлено: ${new Date().toLocaleTimeString()}`}>
                        <span>{inv.currentPrice ? inv.currentPrice.toFixed(2) : 'N/A'} USD</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Typography color={(inv.currentPrice - inv.price) > 0 ? 'success.main' : 'error.main'}>
                        {(inv.currentPrice - inv.price).toFixed(2)} USD
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Показати аналітику">
                        <IconButton onClick={() => showAnalytics(inv)} color="primary">
                          <BarChart size={20} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Видалити">
                        <IconButton onClick={() => handleDeleteInvestment(inv.id)} color="error">
                          <Delete size={20} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body1" color="text.secondary">
                      У вас ще немає інвестицій.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </InvestmentTable>
        </Box>

        {/* Діалогове вікно для додавання інвестиції */}
        <Dialog open={addDialog} onClose={() => { setAddDialog(false); resetForm(); }} maxWidth="lg" fullWidth
          // -- ВИПРАВЛЕНО: Змінено overflowY для коректного відображення --
          PaperProps={{ style: { overflowY: 'auto' } }}
        >
          <DialogTitle>Додати нову інвестицію</DialogTitle>
          <Box component="form" onSubmit={handleAddInvestment}>
            <DialogContent
              // -- ВИПРАВЛЕНО: Змінено overflowY для коректного відображення --
              sx={{ p: 4, overflowY: 'auto' }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel id="game-select-label">Гра</InputLabel>
                    <Select
                      labelId="game-select-label"
                      value={itemGame}
                      label="Гра"
                      onChange={(e) => setItemGame(e.target.value)}
                    >
                      <MenuItem value="CS:GO">CS:GO</MenuItem>
                      <MenuItem value="Dota 2">Dota 2</MenuItem>
                      <MenuItem value="PUBG">PUBG</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Autocomplete
                    value={value}
                    onChange={handleItemNameChange}
                    inputValue={inputValue}
                    onInputChange={handleInputChange}
                    options={searchResults}
                    loading={autocompleteLoading}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Назва предмета"
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
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value) => option.label === value.label}
                    renderOption={(props, option) => (
                      <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                        {/* -- ВИПРАВЛЕНО: Додано обробник помилок для зображення -- */}
                        <img
                          loading="lazy"
                          width="20"
                          src={option.image}
                          alt={option.label}
                          onError={(e) => {
                            e.target.src = "https://placehold.co/20x20/f3f4f6/000000?text=NA";
                          }}
                        />
                        {option.label}
                      </Box>
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Ціна покупки (USD)"
                    type="number"
                    value={itemPrice}
                    onChange={(e) => setItemPrice(e.target.value)}
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ step: "0.01" }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Float (якщо є)"
                    type="number"
                    value={itemFloat}
                    onChange={(e) => setItemFloat(e.target.value)}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ step: "0.00000001" }}
                  />
                </Grid>
                <Grid item xs={12}>
                  {selectedItemDetails && (
                    <Box mt={2} sx={{ display: 'flex', alignItems: 'center' }}>
                      {/* -- ВИПРАВЛЕНО: Додано обробник помилок для зображення -- */}
                      <img
                        src={selectedItemDetails.image}
                        alt={selectedItemDetails.label}
                        style={{ width: 60, height: 60, marginRight: 16, borderRadius: 8 }}
                        onError={(e) => {
                          e.target.src = "https://placehold.co/60x60/f3f4f6/000000?text=NA";
                        }}
                      />
                      <Typography variant="body1">
                        Вибраний предмет: <strong>{selectedItemDetails.label}</strong>
                      </Typography>
                    </Box>
                  )}
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => { setAddDialog(false); resetForm(); }}>Скасувати</Button>
              <Button type="submit" variant="contained" color="primary" disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Додати'}
              </Button>
            </DialogActions>
          </Box>
        </Dialog>

        {/* Діалогове вікно аналітики */}
        <Dialog open={analyticsOpen} onClose={() => setAnalyticsOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Аналітика для: {currentInvestment?.name}</DialogTitle>
          <DialogContent
            // -- ВИПРАВЛЕНО: Змінено overflowY для коректного відображення --
            sx={{ p: 4, overflowY: 'auto' }}
          >
            {analyticsData && currentInvestment ? (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Деталі інвестиції
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography>
                      <strong>Ціна покупки:</strong> {currentInvestment.price} USD
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography>
                      <strong>Поточна ціна:</strong> {currentInvestment.currentPrice.toFixed(2)} USD
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography>
                      <strong>Прибуток/збиток:</strong>
                      <span style={{ color: (currentInvestment.currentPrice - currentInvestment.price) > 0 ? 'green' : 'red' }}>
                        {(currentInvestment.currentPrice - currentInvestment.price).toFixed(2)} USD
                      </span>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography>
                      <strong>Float:</strong> {currentInvestment.float || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography>
                      <strong>Дата покупки:</strong> {currentInvestment.date}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            ) : (
              <Typography variant="body1" align="center" color="text.secondary">
                Аналітика недоступна
              </Typography>
            )}

            <Tabs value={tabIndex} onChange={handleTabChange} sx={{ mt: 4, mb: 2 }}>
              <Tab label="Графік прибутку" />
            </Tabs>
            <Divider />

            {profitByDate.length === 0 ? (
              <Typography variant="body1" align="center" color="text.secondary">
                Немає даних для графіка.
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
                    name="Прибуток"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAnalyticsOpen(false)}>Скасувати</Button>
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

export default App;
