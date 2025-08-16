import React, { useState, useEffect, useMemo } from 'react';
import {
  Box, Container, Typography, Paper, Grid, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TableSortLabel, TextField, InputAdornment,
  IconButton, Tooltip, Chip, Avatar, Select, MenuItem, FormControl, InputLabel,
  CircularProgress, LinearProgress, Link, Switch, FormControlLabel, Divider
} from '@mui/material';
import {
  Zap, Filter, Search, ArrowRight, Settings, Star, TrendingUp, TrendingDown
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
  
  // --- ІНТЕГРАЦІЯ: Нові стани для фільтрів ---
  const [limit, setLimit] = useState(100);
  const [minRoi, setMinRoi] = useState('0'); // За замовчуванням шукаємо тільки вигідні
  const [maxRoi, setMaxRoi] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  
  const MARKETS = ['Steam', 'DMarket', 'Skinport', 'CS.Money', 'Buff'];

  const fetchOpportunities = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/arbitrage-opportunities?source=${sourceMarket}&destination=${destMarket}&limit=${limit}`);
      
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

  useEffect(() => {
    fetchOpportunities();

    const intervalId = setInterval(() => {
      console.log("Auto-refreshing data...");
      fetchOpportunities();
    }, 300000); // 5 хвилин

    return () => clearInterval(intervalId);
  }, [sourceMarket, destMarket, limit]);

  const calculateProfit = (item) => {
    const grossSpread = item.destPrice - item.sourcePrice;
    const netProfit = grossSpread - item.fees;
    const roi = item.sourcePrice > 0 ? (netProfit / item.sourcePrice) * 100 : 0;
    return { netProfit, roi };
  };

  const filteredAndSortedOpportunities = useMemo(() => {
    return opportunities
      .map(item => ({
        ...item,
        ...calculateProfit(item)
      }))
      .filter(item => {
        const minRoiNum = parseFloat(minRoi);
        const maxRoiNum = parseFloat(maxRoi);
        const minPriceNum = parseFloat(minPrice);
        const maxPriceNum = parseFloat(maxPrice);

        if (!isNaN(minRoiNum) && item.roi < minRoiNum) return false;
        if (!isNaN(maxRoiNum) && item.roi > maxRoiNum) return false;
        if (!isNaN(minPriceNum) && item.sourcePrice < minPriceNum) return false;
        if (!isNaN(maxPriceNum) && item.sourcePrice > maxPriceNum) return false;
        
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'netProfit') {
            return b.netProfit - a.netProfit;
        }
        if (sortBy === 'roi') {
            return b.roi - a.roi;
        }
        if (sortBy === 'sourcePrice') {
            return a.sourcePrice - b.sourcePrice;
        }
        return 0;
      });
  }, [opportunities, sortBy, minRoi, maxRoi, minPrice, maxPrice]);


  const getMarketLink = (market, itemName) => {
      const encodedName = encodeURIComponent(itemName);
      switch(market) {
          case 'Steam':
              return `https://steamcommunity.com/market/search?appid=730&q=${encodedName}`;
          case 'DMarket':
              return `https://dmarket.com/ingame-items/item-list/csgo-skins?title=${encodedName}`;
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
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box>
              <Typography variant="h4" fontWeight="bold" color="text.primary">Arbitrage Pulse</Typography>
              <Typography variant="body1" color="text.secondary">Аналіз ринкових можливостей в реальному часі</Typography>
            </Box>
            <Button variant="contained" color="primary" startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <Zap />} sx={{ borderRadius: 2, height: '48px' }} onClick={fetchOpportunities} disabled={isLoading}>
              {isLoading ? 'Оновлення...' : 'Оновити дані'}
            </Button>
          </Box>
          
          {/* --- ІНТЕГРАЦІЯ: Нова, "важка" панель фільтрів --- */}
          <Paper sx={{ p: 3, mb: 4, mt: 3, borderRadius: 4, background: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}` }}>
            <Grid container spacing={3} alignItems="center">
                {/* Блок вибору ринків */}
                <Grid item xs={12} md={4}>
                    <Typography variant="h6" gutterBottom>Напрямок арбітражу</Typography>
                    <Box display="flex" alignItems="center" gap={2}>
                        <FormControl fullWidth variant="outlined">
                          <InputLabel>Звідки</InputLabel>
                          <Select value={sourceMarket} label="Звідки" onChange={(e) => setSourceMarket(e.target.value)} sx={{ borderRadius: 2 }}>
                            {MARKETS.map(market => <MenuItem key={market} value={market}>{market}</MenuItem>)}
                          </Select>
                        </FormControl>
                        <ArrowRight />
                        <FormControl fullWidth variant="outlined">
                          <InputLabel>Куди</InputLabel>
                          <Select value={destMarket} label="Куди" onChange={(e) => setDestMarket(e.target.value)} sx={{ borderRadius: 2 }}>
                            {MARKETS.map(market => <MenuItem key={market} value={market} disabled={market === sourceMarket}>{market}</MenuItem>)}
                          </Select>
                        </FormControl>
                    </Box>
                </Grid>

                <Divider orientation="vertical" flexItem sx={{ mx: 2, display: { xs: 'none', md: 'block' } }} />

                {/* Блок фільтрів */}
                <Grid item xs={12} md={7}>
                    <Typography variant="h6" gutterBottom>Фільтри та налаштування</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={6} sm={3}>
                            <TextField label="Мін. ціна $" type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} fullWidth variant="outlined" InputProps={{ sx: { borderRadius: 2 } }} />
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <TextField label="Макс. ціна $" type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} fullWidth variant="outlined" InputProps={{ sx: { borderRadius: 2 } }} />
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <TextField label="Мін. ROI %" type="number" value={minRoi} onChange={(e) => setMinRoi(e.target.value)} fullWidth variant="outlined" InputProps={{ sx: { borderRadius: 2 } }} />
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <TextField label="Макс. ROI %" type="number" value={maxRoi} onChange={(e) => setMaxRoi(e.target.value)} fullWidth variant="outlined" InputProps={{ sx: { borderRadius: 2 } }} />
                        </Grid>
                        <Grid item xs={6} sm={4}>
                             <FormControl fullWidth variant="outlined">
                              <InputLabel>Кількість</InputLabel>
                              <Select value={limit} label="Кількість" onChange={(e) => setLimit(e.target.value)} sx={{ borderRadius: 2 }}>
                                  <MenuItem value={50}>50</MenuItem>
                                  <MenuItem value={100}>100</MenuItem>
                                  <MenuItem value={150}>150</MenuItem>
                                  <MenuItem value={200}>200</MenuItem>
                              </Select>
                            </FormControl>
                        </Grid>
                         <Grid item xs={6} sm={4}>
                             <FormControl fullWidth variant="outlined">
                              <InputLabel>Сортувати</InputLabel>
                              <Select value={sortBy} label="Сортувати" onChange={(e) => setSortBy(e.target.value)} sx={{ borderRadius: 2 }}>
                                  <MenuItem value="netProfit">Прибутком</MenuItem>
                                  <MenuItem value="roi">ROI</MenuItem>
                                  <MenuItem value="sourcePrice">Ціною</MenuItem>
                              </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Button fullWidth variant="outlined" color="secondary" startIcon={<Search />} sx={{ height: '56px', borderRadius: 2 }}>
                                Пошук
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
          </Paper>

          <TableContainer component={Paper} sx={{ borderRadius: 4, border: `1px solid ${theme.palette.divider}` }}>
            {isLoading && <LinearProgress />}
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={{ background: theme.palette.background.paper }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Предмет ({filteredAndSortedOpportunities.length})</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Джерело</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Призначення</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}><TableSortLabel active={sortBy === 'netProfit'} direction="desc" onClick={() => setSortBy('netProfit')}>Прибуток</TableSortLabel></TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}><TableSortLabel active={sortBy === 'roi'} direction="desc" onClick={() => setSortBy('roi')}>ROI</TableSortLabel></TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Дії</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!isLoading && filteredAndSortedOpportunities.length === 0 ? (
                  <TableRow><TableCell colSpan={6} align="center" sx={{ py: 5 }}><Typography color="text.secondary">Не знайдено можливостей для арбітражу за вашими критеріями.</Typography></TableCell></TableRow>
                ) : (
                  filteredAndSortedOpportunities.map((item) => {
                    const profitColor = item.netProfit > 0 ? theme.palette.success.main : theme.palette.error.main;
                    const TrendIcon = item.netProfit > 0 ? TrendingUp : TrendingDown;
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
                        <TableCell align="right">
                          <Box display="flex" justifyContent="flex-end" alignItems="center" sx={{ color: profitColor }}>
                            <TrendIcon size={16} style={{ marginRight: 4 }}/>
                            <Typography variant="h6" fontWeight="bold">${item.netProfit.toFixed(2)}</Typography>
                          </Box>
                          <Typography variant="caption" color="text.secondary">Комісія: ${item.fees.toFixed(2)}</Typography>
                        </TableCell>
                        <TableCell align="right"><Typography variant="h6" fontWeight="bold" sx={{ color: profitColor }}>{item.roi.toFixed(2)}%</Typography></TableCell>
                        <TableCell align="center">
                          <Tooltip title="Додати до обраного">
                            <IconButton color="secondary" size="small"><Star size={18} /></IconButton>
                          </Tooltip>
                          <Tooltip title="Переглянути деталі угоди">
                            <IconButton color="primary" size="small"><ArrowRight size={18} /></IconButton>
                          </Tooltip>
                        </TableCell>
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
