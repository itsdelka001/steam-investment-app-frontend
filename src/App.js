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
  Fab,
} from "@mui/material";
import { TrendingUp, Delete, Edit, BarChart, Plus, Check } from 'lucide-react';
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

// Стилізовані компоненти
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

const StyledFab = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(4),
  right: theme.spacing(4),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const GAMES = ["Усі", "CS2", "Dota 2", "PUBG"];

const LANGUAGES = {
  uk: {
    portfolio: "Портфель інвестицій",
    name: "Назва предмета",
    count: "Кількість",
    buyPrice: "Ціна купівлі (за шт.)",
    game: "Гра",
    boughtDate: "Дата купівлі",
    action: "Дії",
    addItem: "Додати предмет",
    save: "Зберегти",
    cancel: "Скасувати",
    sold: "Продано",
    yes: "Так",
    no: "Ні",
    sellPrice: "Ціна продажу (за шт.)",
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
  },
};

const t = LANGUAGES.uk;

export default function App() {
  const [investments, setInvestments] = useState([]);
  const [name, setName] = useState("");
  const [count, setCount] = useState(1);
  const [buyPrice, setBuyPrice] = useState(0);
  const [game, setGame] = useState(GAMES[1]);
  const [boughtDate, setBoughtDate] = useState(new Date().toISOString().split('T')[0]);
  const [tabValue, setTabValue] = useState(0);
  const [itemToDelete, setItemToDelete] = useState(null);
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
      sold: false,
      sellPrice: 0,
      sellDate: null,
    };

    setInvestments([...investments, newItem]);
    showSnackbar(t.itemAdded, "success");
    resetForm();
    setAddDialog(false);
  };

  const markAsSold = () => {
    if (!itemToSell || !sellPrice || !sellDate) {
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

  const deleteItem = (id) => {
    setInvestments(investments.filter((item) => item.id !== id));
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
            <Grid item xs={12} sm={6} md={4}>
              <StyledCard>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">{t.totalInvestment}</Typography>
                  <Typography variant="h6">{totalInvestment.toFixed(2)}€</Typography>
                </CardContent>
              </StyledCard>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StyledCard>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">{t.profit}</Typography>
                  <Typography variant="h6" sx={{ color: profitColor }}>
                    {profit.toFixed(2)}€
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
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
            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} aria-label="game tabs">
              {GAMES.map((gameName, index) => (
                <Tab key={index} label={gameName} />
              ))}
            </Tabs>
          </Box>
          <Box>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>{t.name}</StyledTableCell>
                  <StyledTableCell>{t.count}</StyledTableCell>
                  <StyledTableCell>{t.buyPrice}</StyledTableCell>
                  <StyledTableCell>{t.game}</StyledTableCell>
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
                        Немає інвестицій у цій категорії.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInvestments.map((item) => (
                    <TableRow key={item.id}>
                      <StyledTableCell>{item.name}</StyledTableCell>
                      <StyledTableCell>{item.count}</StyledTableCell>
                      <StyledTableCell>{item.buyPrice}€</StyledTableCell>
                      <StyledTableCell>{item.game}</StyledTableCell>
                      <StyledTableCell>{item.boughtDate}</StyledTableCell>
                      <StyledTableCell>
                        <Chip
                          label={
                            item.sold
                              ? `${((item.sellPrice - item.buyPrice) * item.count).toFixed(2)}€`
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
                          <IconButton onClick={() => deleteItem(item.id)}>
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
        </StyledContainer>

        <StyledFab color="primary" aria-label="add" onClick={() => setAddDialog(true)}>
          <Plus />
        </StyledFab>

        {/* Dialog для додавання/редагування предмета */}
        <Dialog open={addDialog} onClose={() => { setAddDialog(false); resetForm(); }} maxWidth="sm" fullWidth>
          <DialogTitle>{t.addInvestment}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label={t.name}
                  variant="outlined"
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Grid>
              {tabValue === 0 && (
                <Grid item xs={12}>
                  <FormControl variant="outlined" fullWidth required>
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
                </Grid>
              )}
              <Grid item xs={12} sm={6}>
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
              <Grid item xs={12} sm={6}>
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
              <Grid item xs={12}>
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
            </Grid>
          </DialogContent>
          <DialogActions>
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

        {/* Dialog для аналітики */}
        <Dialog open={analyticsOpen} onClose={() => setAnalyticsOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>{t.analytics}</DialogTitle>
          <DialogContent>
            <Typography variant="h6">Загальні інвестиції (продано): {totalInvestment.toFixed(2)}€</Typography>
            <Typography variant="h6">Загальний прибуток (продано): {totalProfit.toFixed(2)}€</Typography>
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
