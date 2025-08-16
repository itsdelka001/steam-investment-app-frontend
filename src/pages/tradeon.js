import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Chip,
  Avatar,
  Select,
  MenuItem,
  FormControl
} from '@mui/material';
import {
  Zap,
  Filter,
  Search,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Percent,
  Info,
  ChevronDown
} from 'lucide-react';
import { ThemeProvider } from '@mui/material/styles';
import { getTheme } from '../theme'; // Припускаємо, що theme.js знаходиться в тому ж каталозі

// --- Компонент метрики ---
// Створюємо стилізовану картку для ключових показників, схожу на ті, що в App.js
const MetricCard = ({ title, value, icon, change, changeColor }) => {
  const theme = getTheme('dark'); // Використовуємо тему для доступу до палітри
  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        borderRadius: 4,
        border: `1px solid ${theme.palette.divider}`,
        background: theme.palette.background.paper,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 24px rgba(0,0,0,0.1)`,
          borderColor: theme.palette.primary.main,
        },
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle1" color="text.secondary">{title}</Typography>
        <Box sx={{ color: theme.palette.primary.main }}>{icon}</Box>
      </Box>
      <Box mt={2}>
        <Typography variant="h4" fontWeight="bold">{value}</Typography>
        {change && (
          <Typography variant="body2" sx={{ color: changeColor, display: 'flex', alignItems: 'center', mt: 0.5 }}>
            <TrendingUp size={16} style={{ marginRight: 4 }} /> {change}
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

// --- Основний компонент сторінки ---
export default function TradeonPage() {
  // Використовуємо стан для теми, щоб компонент був самодостатнім для перегляду
  const [themeMode, setThemeMode] = useState('dark');
  const theme = getTheme(themeMode);

  // Зразок даних для таблиці. У реальному додатку вони будуть приходити з API.
  const opportunities = [
    {
      id: 1,
      name: 'AK-47 | Redline',
      image: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf2PLacDBA5ciJlY20hPb6N7LZnzJS7ZE_j-Db8Yy7iQLs_RdoZ23zI4-ce1dsYg_V_1W5w-frhcDvu8_J1zI97Z3sWmc0UeQ-j-vuww/96fx96f',
      sourceMarket: 'Buff',
      sourcePrice: 15.50,
      destMarket: 'Steam',
      destPrice: 22.75,
      fees: 3.41,
    },
    {
      id: 2,
      name: 'AWP | Asiimov',
      image: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf2PLacDBA5ciJlY20hPb6N7LZnzJS7ZE_j-Db8Yy7iQLs_RdoZ23zI4-ce1dsYg_V_1W5w-frhcDvu8_J1zI97Z3sWmc0UeQ-j-vuww/96fx96f',
      sourceMarket: 'CS.Money',
      sourcePrice: 85.00,
      destMarket: 'Steam',
      destPrice: 110.20,
      fees: 16.53,
    },
    {
      id: 3,
      name: 'Glock-18 | Fade',
      image: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf2PLacDBA5ciJlY20hPb6N7LZnzJS7ZE_j-Db8Yy7iQLs_RdoZ23zI4-ce1dsYg_V_1W5w-frhcDvu8_J1zI97Z3sWmc0UeQ-j-vuww/96fx96f',
      sourceMarket: 'DMarket',
      sourcePrice: 450.00,
      destMarket: 'Buff',
      destPrice: 515.00,
      fees: 10.30,
    },
  ];

  // Функція для розрахунку прибутку
  const calculateProfit = (item) => {
    const grossSpread = item.destPrice - item.sourcePrice;
    const netProfit = grossSpread - item.fees;
    const roi = (netProfit / item.sourcePrice) * 100;
    return { grossSpread, netProfit, roi };
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: '100vh', py: 4 }}>
        <Container maxWidth="xl">

          {/* --- Заголовок сторінки --- */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Box>
              <Typography variant="h4" fontWeight="bold" color="text.primary">
                Arbitrage Pulse
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Аналіз ринкових можливостей в реальному часі
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Zap />}
              sx={{ borderRadius: 2, height: '48px' }}
            >
              Оновити дані
            </Button>
          </Box>

          {/* --- Метрики --- */}
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Активні можливості"
                value="1,284"
                icon={<TrendingUp />}
                change="+12% за годину"
                changeColor={theme.palette.success.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Сукупний потенціал"
                value="$8,430.50"
                icon={<DollarSign />}
                change="+ $250 за годину"
                changeColor={theme.palette.success.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Середній ROI"
                value="14.72%"
                icon={<Percent />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Середній час угоди"
                value="~45 хв"
                icon={<Info />}
              />
            </Grid>
          </Grid>

          {/* --- Панель фільтрів та пошуку --- */}
          <Paper sx={{ p: 2, mb: 4, borderRadius: 4, background: theme.palette.background.paper }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={5}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Пошук за назвою предмета..."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search color={theme.palette.text.secondary} />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: 2 }
                  }}
                />
              </Grid>
              <Grid item xs={6} md={2}>
                <FormControl fullWidth variant="outlined">
                   <Select defaultValue="all" sx={{ borderRadius: 2 }}>
                      <MenuItem value="all">Усі ігри</MenuItem>
                      <MenuItem value="cs2">CS2</MenuItem>
                      <MenuItem value="dota2">Dota 2</MenuItem>
                      <MenuItem value="pubg">PUBG</MenuItem>
                   </Select>
                </FormControl>
              </Grid>
               <Grid item xs={6} md={2}>
                <FormControl fullWidth variant="outlined">
                   <Select defaultValue="all" sx={{ borderRadius: 2 }}>
                      <MenuItem value="all">Усі маркети</MenuItem>
                      <MenuItem value="buff">Buff</MenuItem>
                      <MenuItem value="steam">Steam</MenuItem>
                      <MenuItem value="cs.money">CS.Money</MenuItem>
                   </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <Button fullWidth variant="outlined" color="secondary" startIcon={<Filter />} sx={{ height: '56px', borderRadius: 2 }}>
                  Розширені фільтри
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* --- Таблиця з можливостями --- */}
          <TableContainer component={Paper} sx={{ borderRadius: 4, border: `1px solid ${theme.palette.divider}` }}>
            <Table sx={{ minWidth: 650 }} aria-label="arbitrage opportunities table">
              <TableHead sx={{ background: theme.palette.background.paper }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Предмет</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Джерело</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Призначення</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                    <TableSortLabel active direction="desc">
                      Чистий прибуток
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>ROI</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Дії</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {opportunities.map((item) => {
                  const { netProfit, roi } = calculateProfit(item);
                  const profitColor = netProfit > 0 ? theme.palette.success.main : theme.palette.error.main;

                  return (
                    <TableRow
                      key={item.id}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                        '&:hover': {
                          backgroundColor: theme.palette.action.hover,
                        },
                        transition: 'background-color 0.2s'
                      }}
                    >
                      <TableCell component="th" scope="row">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar src={item.image} variant="rounded" />
                          <Typography variant="body1" fontWeight={500}>{item.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Chip label={item.sourceMarket} size="small" variant="outlined" />
                        <Typography variant="body2" fontWeight="bold" mt={0.5}>${item.sourcePrice.toFixed(2)}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip label={item.destMarket} size="small" />
                        <Typography variant="body2" fontWeight="bold" mt={0.5}>${item.destPrice.toFixed(2)}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="h6" fontWeight="bold" sx={{ color: profitColor }}>
                          ${netProfit.toFixed(2)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Комісія: ${item.fees.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="h6" fontWeight="bold" sx={{ color: profitColor }}>
                          {roi.toFixed(2)}%
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Переглянути деталі угоди">
                          <IconButton color="primary">
                            <ArrowRight />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

        </Container>
      </Box>
    </ThemeProvider>
  );
}
