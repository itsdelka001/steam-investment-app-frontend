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
import { TrendingUp, Delete, Edit, BarChart, Info, Check, Plus, Languages } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip as ChartTooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";

// Припускаємо, що у вас є файл перекладу та хук useTranslation
// Для прикладу, створюємо mock-функцію для перекладу
const useTranslation = () => {
  const [lang, setLang] = useState('uk');
  const t = (key) => {
    const translations = {
      uk: {
        inventory: "Інвентар",
        addInvestment: "Додати інвестицію",
        game: "Гра",
        itemName: "Назва предмета",
        cost: "Ціна покупки",
        date: "Дата покупки",
        quantity: "Кількість",
        totalCost: "Загальна вартість",
        price: "Поточна ціна",
        profit: "Прибуток",
        actions: "Дії",
        remove: "Видалити",
        edit: "Редагувати",
        save: "Зберегти",
        cancel: "Скасувати",
        priceNotFound: "Ціну не знайдено",
        failedToFetch: "Не вдалося отримати ціну",
        currentInvestments: "Поточні інвестиції",
        analytics: "Аналітика",
        totalInvestments: "Усього інвестицій",
        totalProfit: "Усього прибутку",
        averageProfit: "Середній прибуток",
        profitOverTime: "Прибуток з часом",
        noData: "Немає даних для відображення", // Виправлений ключ для відсутності даних
        noInvestments: "Немає інвестицій у цій категорії", // Доданий ключ для відсутності інвестицій в таблиці
        gameOptions: ["CS2", "Dota 2", "PUBG"],
        investmentAdded: "Інвестицію додано!",
        investmentUpdated: "Інвестицію оновлено!",
        investmentRemoved: "Інвестицію видалено!",
        fetchPriceInfo: "Отримати поточну ціну предмета",
        language: "Мова",
      },
      en: {
        inventory: "Inventory",
        addInvestment: "Add Investment",
        game: "Game",
        itemName: "Item Name",
        cost: "Purchase Price",
        date: "Purchase Date",
        quantity: "Quantity",
        totalCost: "Total Cost",
        price: "Current Price",
        profit: "Profit",
        actions: "Actions",
        remove: "Remove",
        edit: "Edit",
        save: "Save",
        cancel: "Cancel",
        priceNotFound: "Price not found",
        failedToFetch: "Failed to fetch price",
        currentInvestments: "Current Investments",
        analytics: "Analytics",
        totalInvestments: "Total Investments",
        totalProfit: "Total Profit",
        averageProfit: "Average Profit",
        profitOverTime: "Profit over time",
        noData: "No data to display", // Виправлений ключ для відсутності даних
        noInvestments: "No investments in this category", // Доданий ключ для відсутності інвестицій в таблиці
        gameOptions: ["CS2", "Dota 2", "PUBG"],
        investmentAdded: "Investment added!",
        investmentUpdated: "Investment updated!",
        investmentRemoved: "Investment removed!",
        fetchPriceInfo: "Fetch current item price",
        language: "Language",
      },
    };
    return translations[lang][key] || key;
  };
  const changeLanguage = () => {
    setLang(lang === 'uk' ? 'en' : 'uk');
  };
  return { t, changeLanguage, lang };
};

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
    success: {
      main: '#28a745',
    },
    error: {
      main: '#dc3545',
    }
  },
  typography: {
    fontFamily: ['Poppins', 'Inter', 'sans-serif'].join(','),
    h4: {
      fontWeight: 600,
      fontSize: '1.8rem',
      '@media (min-width:600px)': {
        fontSize: '2.5rem',
      },
    },
    h5: {
      fontWeight: 500,
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
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));

// Стилізовані картки для виділення фінансових показників
const StatCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(3),
  textAlign: 'center',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
  },
}));

// Mock API calls
const fetchItemPrice = async (game, itemName) => {
  console.log(`Fetching price for ${itemName} in ${game}`);
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate different outcomes
  if (itemName.toLowerCase().includes('expensive')) {
    return { price: 150.75, success: true };
  }
  if (itemName.toLowerCase().includes('notfound')) {
    return { price: null, success: false, error: 'Price not found' };
  }
  return { price: Math.random() * 100, success: true };
};

function App() {
  const { t, changeLanguage, lang } = useTranslation();
  const [investments, setInvestments] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Form state for adding/editing investments
  const [formState, setFormState] = useState({
    game: 'CS2',
    itemName: '',
    cost: '',
    date: new Date().toISOString().slice(0, 10),
    quantity: 1,
    id: null,
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [isFetchingPrice, setIsFetchingPrice] = useState(false);

  // Example data for the chart. We make sure investments is an array
  const profitByDate = (Array.isArray(investments) ? investments : []).map(inv => {
    const profit = (inv.price - inv.cost) * inv.quantity;
    return {
      date: inv.date,
      profit: isNaN(profit) ? 0 : profit
    };
  }).filter(p => !isNaN(p.profit)).sort((a, b) => new Date(a.date) - new Date(b.date));

  const openSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Improved handling for both text fields and Autocomplete
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAutocompleteChange = (event, value) => {
    setFormState(prev => ({ ...prev, itemName: value || '' }));
  };

  const handleAddInvestment = async () => {
    if (!formState.itemName || !formState.cost || !formState.quantity) {
      openSnackbar("Будь ласка, заповніть усі поля", "error");
      return;
    }
    
    setIsFetchingPrice(true);
    const result = await fetchItemPrice(formState.game, formState.itemName);
    setIsFetchingPrice(false);

    if (result.success) {
      const newInvestment = {
        ...formState,
        id: isEditMode ? formState.id : Date.now(),
        price: result.price,
      };

      if (isEditMode) {
        setInvestments(prevInvestments => 
          (Array.isArray(prevInvestments) ? prevInvestments : []).map(inv => inv.id === newInvestment.id ? newInvestment : inv)
        );
        openSnackbar(t.investmentUpdated, "success");
      } else {
        setInvestments(prevInvestments => 
          (Array.isArray(prevInvestments) ? prevInvestments : []).concat(newInvestment)
        );
        openSnackbar(t.investmentAdded, "success");
      }
      
      // Reset form
      setFormState({
        game: 'CS2',
        itemName: '',
        cost: '',
        date: new Date().toISOString().slice(0, 10),
        quantity: 1,
        id: null,
      });
      setIsEditMode(false);

    } else {
      openSnackbar(t.failedToFetch, "error");
    }
  };

  const handleEdit = (investment) => {
    setFormState(investment);
    setIsEditMode(true);
  };

  const handleDelete = (id) => {
    setInvestments(prevInvestments => 
      (Array.isArray(prevInvestments) ? prevInvestments : []).filter(inv => inv.id !== id)
    );
    openSnackbar(t.investmentRemoved, "success");
  };

  const handleCancelEdit = () => {
    setFormState({
      game: 'CS2',
      itemName: '',
      cost: '',
      date: new Date().toISOString().slice(0, 10),
      quantity: 1,
      id: null,
    });
    setIsEditMode(false);
  };

  const investmentsArray = Array.isArray(investments) ? investments : [];
  const totalInvestments = investmentsArray.reduce((sum, inv) => sum + (inv.cost * inv.quantity), 0);
  const totalProfit = investmentsArray.reduce((sum, inv) => sum + (inv.price - inv.cost) * inv.quantity, 0);
  const averageProfit = totalInvestments > 0 && !isNaN(totalProfit) ? (totalProfit / totalInvestments) * 100 : 0;
  
  const uniqueItems = [...new Set(investmentsArray.map(inv => inv.itemName))];

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <StyledContainer maxWidth="md">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {t.inventory}
            </Typography>
            <IconButton onClick={changeLanguage} color="primary">
                <Languages />
            </IconButton>
          </Box>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 4 }}>
            <Tab label={t.currentInvestments} />
            <Tab label={t.analytics} />
          </Tabs>

          {activeTab === 0 && (
            <Box>
              {/* Form to add/edit investments */}
              <Card sx={{ mb: 4 }}>
                <CardContent>
                  <Typography variant="h5" sx={{ mb: 2 }}>{isEditMode ? t.edit : t.addInvestment}</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>{t.game}</InputLabel>
                        <Select
                          name="game"
                          value={formState.game}
                          label={t.game}
                          onChange={handleFormChange}
                        >
                          {t.gameOptions.map(game => (
                            <MenuItem key={game} value={game}>{game}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Autocomplete
                        freeSolo
                        options={uniqueItems}
                        value={formState.itemName}
                        onChange={handleAutocompleteChange}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            name="itemName"
                            label={t.itemName}
                            fullWidth
                            value={formState.itemName}
                            onChange={handleFormChange}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        name="cost"
                        label={t.cost}
                        type="number"
                        fullWidth
                        value={formState.cost}
                        onChange={handleFormChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        name="quantity"
                        label={t.quantity}
                        type="number"
                        fullWidth
                        value={formState.quantity}
                        onChange={handleFormChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        name="date"
                        label={t.date}
                        type="date"
                        fullWidth
                        value={formState.date}
                        onChange={handleFormChange}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                      {isEditMode && (
                        <Button variant="outlined" color="secondary" onClick={handleCancelEdit}>
                          {t.cancel}
                        </Button>
                      )}
                      <Button variant="contained" onClick={handleAddInvestment} startIcon={isFetchingPrice ? null : (isEditMode ? <Check /> : <Plus />)} disabled={isFetchingPrice}>
                        {isFetchingPrice ? <CircularProgress size={24} color="inherit" /> : (isEditMode ? t.save : t.addInvestment)}
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Table of investments */}
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t.game}</TableCell>
                    <TableCell>{t.itemName}</TableCell>
                    <TableCell align="right">{t.totalCost}</TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        {t.price}
                        <Tooltip title={t.fetchPriceInfo}>
                            <Info color="action" style={{ marginLeft: 4 }} />
                        </Tooltip>
                      </Box>
                    </TableCell>
                    <TableCell align="right">{t.profit}</TableCell>
                    <TableCell align="center">{t.actions}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                {investmentsArray.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={6} align="center">
                            <Typography variant="body1" color="text.secondary" sx={{ py: 2 }}>
                                {t.noInvestments}
                            </Typography>
                        </TableCell>
                    </TableRow>
                ) : (
                    investmentsArray.map((inv) => {
                      const profitValue = (inv.price - inv.cost) * inv.quantity;
                      const priceDisplay = inv.price != null && !isNaN(inv.price) ? `$${inv.price.toFixed(2)}` : t.priceNotFound;
                      const profitDisplay = !isNaN(profitValue) ? `$${profitValue.toFixed(2)}` : t.priceNotFound;
                      
                      return (
                        <TableRow key={inv.id}>
                          <TableCell>{inv.game}</TableCell>
                          <TableCell>{inv.itemName}</TableCell>
                          <TableCell align="right">${(inv.cost * inv.quantity).toFixed(2)}</TableCell>
                          <TableCell align="right">{priceDisplay}</TableCell>
                          <TableCell align="right">
                            <Chip
                              label={profitDisplay}
                              sx={{ 
                                color: (!isNaN(profitValue) && profitValue > 0) ? theme.palette.success.main : theme.palette.error.main,
                                borderColor: (!isNaN(profitValue) && profitValue > 0) ? theme.palette.success.main : theme.palette.error.main,
                              }}
                              variant="outlined"
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <IconButton color="primary" onClick={() => handleEdit(inv)}>
                              <Edit />
                            </IconButton>
                            <IconButton color="error" onClick={() => handleDelete(inv.id)}>
                              <Delete />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    }))}
                </TableBody>
              </Table>
            </Box>
          )}

          {activeTab === 1 && (
            <Box sx={{ my: 4 }}>
              {/* Покращені та виділені картки */}
              <Grid container spacing={3} justifyContent="center" alignItems="stretch">
                <Grid item xs={12} sm={4}>
                  <StatCard>
                    <CardContent>
                      <Typography variant="h6" color="text.secondary">{t.totalInvestments}</Typography>
                      <Typography variant="h4" color="primary" sx={{ mt: 1 }}>${totalInvestments.toFixed(2)}</Typography>
                    </CardContent>
                  </StatCard>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <StatCard>
                    <CardContent>
                      <Typography variant="h6" color="text.secondary">{t.totalProfit}</Typography>
                      <Typography
                        variant="h4"
                        sx={{ mt: 1, color: totalProfit > 0 && !isNaN(totalProfit) ? theme.palette.success.main : theme.palette.error.main }}
                      >
                          {isNaN(totalProfit) ? "$0.00" : `$${totalProfit.toFixed(2)}`}
                      </Typography>
                    </CardContent>
                  </StatCard>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <StatCard>
                    <CardContent>
                      <Typography variant="h6" color="text.secondary">{t.averageProfit}</Typography>
                      <Typography 
                        variant="h4" 
                        sx={{ mt: 1, color: averageProfit > 0 && !isNaN(averageProfit) ? theme.palette.success.main : theme.palette.error.main }}
                      >
                          {isNaN(averageProfit) ? "0.00%" : `${averageProfit.toFixed(2)}%`}
                      </Typography>
                    </CardContent>
                  </StatCard>
                </Grid>
              </Grid>
              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Button variant="contained" startIcon={<BarChart />} onClick={() => setAnalyticsOpen(true)}>
                  {t.profitOverTime}
                </Button>
              </Box>
            </Box>
          )}
        </StyledContainer>

        {/* Analytics Dialog */}
        <Dialog open={analyticsOpen} onClose={() => setAnalyticsOpen(false)} fullWidth maxWidth="md">
          <DialogTitle>{t.profitOverTime}</DialogTitle>
          <Divider />
          <DialogContent sx={{ height: 400 }}>
            {profitByDate.length === 0 ? (
              <Typography variant="body1" align="center" color="text.secondary">
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
      </Box>
    </ThemeProvider>
  );
}

export default App;
