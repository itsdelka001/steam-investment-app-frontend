import React, { useState, useEffect } from "react";
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

// Оновлені тексти для локалізації
const translations = {
  ua: {
    title: "Steam Investment Tracker",
    addItemTitle: "Додати предмет",
    itemNameLabel: "Назва предмета",
    gameLabel: "Гра",
    csgo: "CS2",
    dota2: "Dota 2",
    pubg: "PUBG",
    add: "Додати",
    myItems: "Мої предмети",
    item: "Предмет",
    price: "Поточна ціна",
    invested: "Інвестовано",
    profit: "Прибуток",
    actions: "Дії",
    editItemTitle: "Редагувати предмет",
    save: "Зберегти",
    cancel: "Скасувати",
    delete: "Видалити",
    profitAnalytics: "Аналітика прибутку",
    itemAdded: "Предмет успішно додано!",
    itemUpdated: "Предмет успішно оновлено!",
    itemDeleted: "Предмет успішно видалено!",
    fetchError: "Помилка при отриманні даних",
    noData: "Немає даних для відображення",
    noItems: "Список предметів порожній.",
    fetching: "Завантаження...",
    history: "Історія",
    date: "Дата",
  },
};

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
      fontWeight: 600,
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
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
  },
});

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  backgroundColor: theme.palette.background.default,
  minHeight: '100vh',
}));

// Використовуємо `const` для визначення URL-адреси проксі-сервера
const PROXY_SERVER_URL = "https://steam-investment-app-proxy.onrender.com";

export default function App() {
  const [t] = useState(translations.ua); // Використовуємо українську мову за замовчуванням
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState("");
  const [invested, setInvested] = useState("");
  const [game, setGame] = useState("CS2");
  const [currentPrices, setCurrentPrices] = useState({});
  const [editItem, setEditItem] = useState(null);
  const [editInvested, setEditInvested] = useState("");
  const [tabIndex, setTabIndex] = useState(0);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [profitByDate, setProfitByDate] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [autocompleteOptions, setAutocompleteOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  const serverUrl = PROXY_SERVER_URL;

  // Використовуємо useRef для відстеження, чи був useEffect вже запущений
  const initialDataFetched = React.useRef(false);

  // Оновлюємо цю функцію для роботи з новим API
  const handleSearch = async (query) => {
    if (query.length < 3) {
      setAutocompleteOptions([]);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${serverUrl}/search?query=${query}&game=${game}`);
      if (!response.ok) {
        throw new Error("Failed to fetch search results");
      }
      const data = await response.json();
      // Зверніть увагу, що ми тепер отримуємо об'єкти з полями name, price, market_hash_name, icon_url
      setAutocompleteOptions(data);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSnackbar({ open: true, message: t.fetchError, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const getPrice = async (item) => {
    try {
      // Використовуємо market_hash_name для запиту ціни
      const response = await fetch(`${serverUrl}/price?item_name=${item.market_hash_name}&game=${item.game}`);
      if (!response.ok) {
        throw new Error("Failed to fetch price");
      }
      const data = await response.json();
      return data.price;
    } catch (error) {
      console.error(`Error fetching price for ${item.name}:`, error);
      return null;
    }
  };

  const fetchCurrentPrices = async () => {
    const prices = {};
    for (const item of items) {
      const price = await getPrice(item);
      if (price !== null) {
        prices[item.id] = price;
      }
    }
    setCurrentPrices(prices);
  };
  
  // Оновлена функція handleAddItem для роботи з Autocomplete
  const handleAddItem = async () => {
    if (!selectedItem || invested === "") {
      setSnackbar({ open: true, message: "Будь ласка, оберіть предмет і введіть суму інвестиції.", severity: "warning" });
      return;
    }
  
    // Використовуємо market_hash_name з selectedItem
    const newItem = {
      id: Date.now(), // Унікальний ID
      name: selectedItem.name,
      invested: parseFloat(invested),
      game: game,
      icon_url: selectedItem.icon_url,
      market_hash_name: selectedItem.market_hash_name, // Зберігаємо market_hash_name
    };
  
    setItems((prevItems) => {
      const updatedItems = [...prevItems, newItem];
      localStorage.setItem("mySteamInvestments", JSON.stringify(updatedItems));
      return updatedItems;
    });
  
    setSnackbar({ open: true, message: t.itemAdded, severity: "success" });
    setSelectedItem(null); // Скидаємо вибраний предмет
    setInvested("");
    setInputValue("");
    fetchCurrentPrices();
  };

  const handleEditItem = (item) => {
    setEditItem(item);
    setEditInvested(item.invested);
  };

  const handleSaveEdit = () => {
    setItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item.id === editItem.id ? { ...item, invested: parseFloat(editInvested) } : item
      );
      localStorage.setItem("mySteamInvestments", JSON.stringify(updatedItems));
      return updatedItems;
    });
    setEditItem(null);
    setSnackbar({ open: true, message: t.itemUpdated, severity: "success" });
  };

  const handleDeleteItem = (id) => {
    setItems((prevItems) => {
      const updatedItems = prevItems.filter((item) => item.id !== id);
      localStorage.setItem("mySteamInvestments", JSON.stringify(updatedItems));
      return updatedItems;
    });
    setSnackbar({ open: true, message: t.itemDeleted, severity: "success" });
  };

  const handleShowAnalytics = async (item) => {
    setAnalyticsOpen(true);
    setProfitByDate([]); // Clear previous data
    // Це заглушка, оскільки ми не маємо історичних даних.
    // У реальному додатку тут був би запит до API.
    const today = new Date();
    const mockData = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (29 - i));
      const priceChange = Math.random() * 2 - 1; // -1 to 1
      const profit = item.invested * (1 + priceChange);
      return {
        date: date.toISOString().split('T')[0],
        profit: parseFloat(profit.toFixed(2)),
      };
    });
    setProfitByDate(mockData);
  };

  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Використовуємо useEffect для завантаження даних при старті
  useEffect(() => {
    if (initialDataFetched.current) {
      return;
    }
    const storedItems = JSON.parse(localStorage.getItem("mySteamInvestments")) || [];
    setItems(storedItems);
    fetchCurrentPrices();
    initialDataFetched.current = true;
  }, []); // Запускаємо лише один раз

  // Цей useEffect буде оновлювати ціни кожні 5 хвилин
  useEffect(() => {
    const interval = setInterval(() => {
      fetchCurrentPrices();
    }, 5 * 60 * 1000); // 5 хвилин
    return () => clearInterval(interval);
  }, [items]);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
        <StyledContainer maxWidth="lg">
          <Typography variant="h4" align="center" gutterBottom color="primary">
            {t.title}
          </Typography>

          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={tabIndex} onChange={(e, newValue) => setTabIndex(newValue)} centered>
              <Tab label={t.addItemTitle} />
              <Tab label={t.myItems} />
            </Tabs>
          </Box>

          {tabIndex === 0 && (
            <Card sx={{ p: 3, mb: 3, boxShadow: 3 }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel id="game-select-label">{t.gameLabel}</InputLabel>
                      <Select
                        labelId="game-select-label"
                        value={game}
                        label={t.gameLabel}
                        onChange={(e) => {
                          setGame(e.target.value);
                          setAutocompleteOptions([]); // Очищаємо опції при зміні гри
                          setSelectedItem(null);
                          setInputValue('');
                        }}
                      >
                        <MenuItem value="CS2">{t.csgo}</MenuItem>
                        <MenuItem value="Dota 2">{t.dota2}</MenuItem>
                        <MenuItem value="PUBG">{t.pubg}</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Autocomplete
                      options={autocompleteOptions}
                      getOptionLabel={(option) => option.name || ""}
                      isOptionEqualToValue={(option, value) => option.name === value.name}
                      onInputChange={(event, newInputValue) => {
                        setInputValue(newInputValue);
                        handleSearch(newInputValue);
                      }}
                      onChange={(event, newValue) => {
                        setSelectedItem(newValue);
                      }}
                      inputValue={inputValue}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={t.itemNameLabel}
                          variant="outlined"
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                      renderOption={(props, option) => (
                        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                          <img
                            loading="lazy"
                            width="20"
                            src={option.icon_url}
                            alt=""
                          />
                          {option.name}
                        </Box>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label={t.invested}
                      type="number"
                      value={invested}
                      onChange={(e) => setInvested(e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={handleAddItem}
                      disabled={!selectedItem || invested === ""}
                    >
                      {t.add}
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}

          {tabIndex === 1 && (
            <Card sx={{ p: 3, boxShadow: 3 }}>
              <CardContent>
                {items.length === 0 ? (
                  <Typography align="center" color="text.secondary">{t.noItems}</Typography>
                ) : (
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>{t.item}</TableCell>
                        <TableCell>{t.invested}</TableCell>
                        <TableCell>{t.price}</TableCell>
                        <TableCell>{t.profit}</TableCell>
                        <TableCell>{t.actions}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {items.map((item) => {
                        const currentPrice = currentPrices[item.id] || "N/A";
                        const profit = currentPrice !== "N/A" ? currentPrice - item.invested : "N/A";
                        const profitColor = profit === "N/A" ? "default" : profit > 0 ? "success" : profit < 0 ? "error" : "primary";

                        return (
                          <TableRow key={item.id}>
                            <TableCell>
                              <Box display="flex" alignItems="center">
                                <img src={item.icon_url} alt={item.name} style={{ width: 32, height: 32, marginRight: 8, borderRadius: 4 }} />
                                <Box>
                                  <Typography variant="body1">{item.name}</Typography>
                                  <Chip label={item.game} size="small" />
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>{item.invested.toFixed(2)}</TableCell>
                            <TableCell>
                              <Tooltip title={t.fetching} arrow>
                                <CircularProgress size={16} sx={{ visibility: currentPrice === "N/A" ? 'visible' : 'hidden' }} />
                              </Tooltip>
                              <Typography sx={{ visibility: currentPrice !== "N/A" ? 'visible' : 'hidden' }}>{currentPrice !== "N/A" ? currentPrice.toFixed(2) : ''}</Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={profit !== "N/A" ? profit.toFixed(2) : "N/A"}
                                color={profitColor}
                                size="small"
                                sx={{ fontWeight: 'bold' }}
                              />
                            </TableCell>
                            <TableCell>
                              <IconButton onClick={() => handleEditItem(item)}><Edit size={16} /></IconButton>
                              <IconButton onClick={() => handleDeleteItem(item.id)}><Delete size={16} /></IconButton>
                              <IconButton onClick={() => handleShowAnalytics(item)}><BarChart size={16} /></IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          )}

          {/* Dialog for editing item */}
          <Dialog open={!!editItem} onClose={() => setEditItem(null)}>
            <DialogTitle>{t.editItemTitle}</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label={t.invested}
                type="number"
                fullWidth
                value={editInvested}
                onChange={(e) => setEditInvested(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditItem(null)}>{t.cancel}</Button>
              <Button onClick={handleSaveEdit} variant="contained">{t.save}</Button>
            </DialogActions>
          </Dialog>

          {/* Dialog for analytics chart */}
          <Dialog open={analyticsOpen} onClose={() => setAnalyticsOpen(false)} maxWidth="md" fullWidth>
            <DialogTitle>{t.profitAnalytics}</DialogTitle>
            <DialogContent sx={{ height: 400 }}>
              <Tabs value={0}>
                <Tab label={t.history} />
              </Tabs>
              {profitByDate.length === 0 ? (
                <Typography align="center" mt={3}>
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
}
