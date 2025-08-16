import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Paper, Grid, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TableSortLabel, TextField, InputAdornment,
  IconButton, Tooltip, Chip, Avatar, Select, MenuItem, FormControl, InputLabel,
  CircularProgress, LinearProgress, Link
} from '@mui/material';
import {
  Zap, Filter, Search, ArrowRight, TrendingUp, DollarSign, Percent, Info
} from 'lucide-react';
import { ThemeProvider } from '@mui/material/styles';
import { getTheme } from '../theme';
import { BACKEND_URL } from '../constants';

// --- Основний компонент сторінки ---
export default function TradeonPage() {
  const [themeMode, setThemeMode] = useState('dark');
  const theme = getTheme(themeMode);

  const [opportunities, setOpportunities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sourceMarket, setSourceMarket] = useState('Steam');
  const [destMarket, setDestMarket] = useState('DMarket');
  const [sortBy, setSortBy] = useState('netProfit');
  const [priceType, setPriceType] = useState('min_price'); 
  
  // --- ІНТЕГРАЦІЯ SKINPORT: Додаємо Skinport у список ---
  const MARKETS = ['Steam', 'DMarket', 'Skinport', 'CS.Money', 'Buff'];

  const fetchOpportunities = async () => {
    setIsLoading(true);
    setOpportunities([]);

    try {
      const response = await fetch(`${BACKEND_URL}/api/arbitrage-opportunities?source=${sourceMarket}&destination=${destMarket}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setOpportunities(data);

    } catch (error) {
      console.error("Failed to fetch opportunities:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- ІНТЕГРАЦІЯ: Автоматичне оновлення даних ---
  useEffect(() => {
    // Запускаємо при першому завантаженні
    fetchOpportunities();

    // Встановлюємо інтервал на 5 хвилин (300000 мілісекунд)
    const intervalId = setInterval(() => {
      console.log("Auto-refreshing data...");
      fetchOpportunities();
    }, 300000);

    // Очищуємо інтервал при розмонтуванні компонента, щоб уникнути витоків пам'яті
    return () => clearInterval(intervalId);
  }, [sourceMarket, destMarket]);

  const calculateProfit = (item) => {
    const grossSpread = item.destPrice - item.sourcePrice;
    const netProfit = grossSpread - item.fees;
    const roi = item.sourcePrice > 0 ? (netProfit / item.sourcePrice) * 100 : 0;
    return { netProfit, roi };
  };

  const sortedOpportunities = [...opportunities].sort((a, b) => {
      const aProfit = calculateProfit(a);
      const bProfit = calculateProfit(b);
      if (sortBy === 'netProfit') {
          return bProfit.netProfit - aProfit.netProfit;
      }
      if (sortBy === 'roi') {
          return bProfit.roi - aProfit.roi;
      }
      if (sortBy === 'sourcePrice') {
          return a.sourcePrice - b.sourcePrice;
      }
      return 0;
  });

  const getMarketLink = (market, itemName) => {
      const encodedName = encodeURIComponent(itemName);
      switch(market) {
          case 'Steam':
              return `https://steamcommunity.com/market/search?appid=730&q=${encodedName}`;
          case 'DMarket':
              return `https://dmarket.com/ingame-items/item-list/csgo-skins?title=${encodedName}`;
          // --- ІНТЕГРАЦІЯ SKINPORT: Додаємо посилання ---
          case 'Skinport':
              return `https://skinport.com/market?search=${encodedName}`;
          default:
              return '#';
      }
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: '100vh', py: 4 }}>
        <Container maxWidth="xl">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Box>
              <Typography variant="h4" fontWeight="bold" color="text.primary">Arbitrage Pulse</Typography>
              <Typography variant="body1" color="text.secondary">Аналіз ринкових можливостей в реальному часі</Typography>
            </Box>
            <Button variant="contained" color="primary" startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <Zap />} sx={{ borderRadius: 2, height: '48px' }} onClick={fetchOpportunities} disabled={isLoading}>
              {isLoading ? 'Оновлення...' : 'Оновити дані'}
            </Button>
          </Box>

          {/* --- ІНТЕГРАЦІЯ: Видалено блок метрик та додано відступ для панелі фільтрів --- */}
          <Paper sx={{ p: 2, mb: 4, mt: 4, borderRadius: 4, background: theme.palette.background.paper }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={3}><TextField fullWidth variant="outlined" placeholder="Пошук за назвою предмета..." InputProps={{ startAdornment: (<InputAdornment position="start"><Search color={theme.palette.text.secondary} /></InputAdornment>), sx: { borderRadius: 2 } }} /></Grid>
              <Grid item xs={6} md={2}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Ринок покупки</InputLabel>
                  <Select value={sourceMarket} label="Ринок покупки" onChange={(e) => setSourceMarket(e.target.value)} sx={{ borderRadius: 2 }}>
                    {MARKETS.map(market => <MenuItem key={market} value={market}>{market}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} md={2}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Ринок продажу</InputLabel>
                  <Select value={destMarket} label="Ринок продажу" onChange={(e) => setDestMarket(e.target.value)} sx={{ borderRadius: 2 }}>
                    {MARKETS.map(market => <MenuItem key={market} value={market} disabled={market === sourceMarket}>{market}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                 <FormControl fullWidth variant="outlined">
                  <InputLabel>Тип ціни</InputLabel>
                  <Select value={priceType} label="Тип ціни" onChange={(e) => setPriceType(e.target.value)} sx={{ borderRadius: 2 }}>
                      <MenuItem value="min_price">Мінімальна ціна</MenuItem>
                      <MenuItem value="avg_price" disabled>Середня ціна (скоро)</MenuItem>
                      <MenuItem value="autobuy" disabled>Автобай (скоро)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} md={1.5}>
                 <FormControl fullWidth variant="outlined">
                  <InputLabel>Сортувати</InputLabel>
                  <Select value={sortBy} label="Сортувати" onChange={(e) => setSortBy(e.target.value)} sx={{ borderRadius: 2 }}>
                      <MenuItem value="netProfit">Прибутком</MenuItem>
                      <MenuItem value="roi">ROI</MenuItem>
                      <MenuItem value="sourcePrice">Ціною</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} md={1.5}><Button fullWidth variant="outlined" color="secondary" startIcon={<Filter />} sx={{ height: '56px', borderRadius: 2 }}>Фільтри</Button></Grid>
            </Grid>
          </Paper>

          <TableContainer component={Paper} sx={{ borderRadius: 4, border: `1px solid ${theme.palette.divider}` }}>
            {isLoading && <LinearProgress />}
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={{ background: theme.palette.background.paper }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Предмет</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Джерело</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Призначення</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}><TableSortLabel active={sortBy === 'netProfit'} direction="desc" onClick={() => setSortBy('netProfit')}>Чистий прибуток</TableSortLabel></TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}><TableSortLabel active={sortBy === 'roi'} direction="desc" onClick={() => setSortBy('roi')}>ROI</TableSortLabel></TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Дії</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!isLoading && sortedOpportunities.length === 0 ? (
                  <TableRow><TableCell colSpan={6} align="center" sx={{ py: 5 }}><Typography color="text.secondary">Не знайдено можливостей для арбітражу за вашими критеріями.</Typography></TableCell></TableRow>
                ) : (
                  sortedOpportunities.map((item) => {
                    const { netProfit, roi } = calculateProfit(item);
                    const profitColor = netProfit > 0 ? theme.palette.success.main : theme.palette.error.main;
                    return (
                      <TableRow key={item.id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: theme.palette.action.hover, }, transition: 'background-color 0.2s' }}>
                        <TableCell><Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}><Avatar src={item.image} variant="rounded" /><Typography variant="body1" fontWeight={500}>{item.name}</Typography></Box></TableCell>
                        <TableCell align="center">
                            <Link href={getMarketLink(item.sourceMarket, item.name)} target="_blank" rel="noopener noreferrer" underline="none">
                                <Chip label={item.sourceMarket} size="small" variant="outlined" clickable />
                            </Link>
                            <Typography variant="body2" fontWeight="bold" mt={0.5}>${item.sourcePrice.toFixed(2)}</Typography>
                        </TableCell>
                        <TableCell align="center">
                            <Link href={getMarketLink(item.destMarket, item.name)} target="_blank" rel="noopener noreferrer" underline="none">
                                <Chip label={item.destMarket} size="small" clickable />
                            </Link>
                            <Typography variant="body2" fontWeight="bold" mt={0.5}>${item.destPrice.toFixed(2)}</Typography>
                        </TableCell>
                        <TableCell align="right"><Typography variant="h6" fontWeight="bold" sx={{ color: profitColor }}>${netProfit.toFixed(2)}</Typography><Typography variant="caption" color="text.secondary">Комісія: ${item.fees.toFixed(2)}</Typography></TableCell>
                        <TableCell align="right"><Typography variant="h6" fontWeight="bold" sx={{ color: profitColor }}>{roi.toFixed(2)}%</Typography></TableCell>
                        <TableCell align="center"><Tooltip title="Переглянути деталі угоди"><IconButton color="primary"><ArrowRight /></IconButton></Tooltip></TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
