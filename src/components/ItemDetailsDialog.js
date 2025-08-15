import React from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Typography, Box,
    Grid, Chip, Button, Tooltip, IconButton
} from '@mui/material';
import { Delete, Edit, Globe, Zap } from 'lucide-react';
import { CURRENCY_SYMBOLS } from '../constants';

const ItemDetailsDialog = ({ open, onClose, item, t, theme, convertCurrency, displayCurrency, confirmDelete, handleCurrentPriceUpdate, handleEdit }) => {
    if (!item) return null;

    const convertedTotalBuyPrice = convertCurrency(item.buyPrice * item.count, item.buyCurrency);
    const convertedCurrentPrice = item.currentPrice ? convertCurrency(item.currentPrice, "EUR") : null;
    const convertedTotalCurrentPrice = convertedCurrentPrice ? convertedCurrentPrice * item.count : convertedTotalBuyPrice;
    const itemGrossProfit = item.sold ? (convertCurrency(item.sellPrice, item.buyCurrency) * item.count) - convertedTotalBuyPrice : convertedTotalCurrentPrice - convertedTotalBuyPrice;
    const itemTotalValue = item.sold ? convertCurrency(item.sellPrice * item.count, item.buyCurrency) : convertedTotalCurrentPrice;
    const getNetProfit = (grossProfit, totalValue, commissions) => {
        const totalRate = (commissions || []).reduce((sum, c) => sum + c.rate, 0);
        const totalCommission = totalValue * (totalRate / 100);
        return grossProfit - totalCommission;
    };
    const itemProfit = getNetProfit(itemGrossProfit, itemTotalValue, item.commissions);
    const profitColor = itemProfit >= 0 ? theme.palette.success.main : theme.palette.error.main;
    const profitPercentage = convertedTotalBuyPrice > 0 ? ((itemProfit / convertedTotalBuyPrice) * 100).toFixed(2) : '0.00';
    const totalCommissionRate = (item.commissions || []).reduce((sum, c) => sum + c.rate, 0);

    const handleOpenMarketLink = () => {
        let url = '';
        if (item.game === "CS2") {
            url = `https://steamcommunity.com/market/listings/730/${encodeURIComponent(item.market_hash_name)}`;
        } else if (item.game === "Dota 2") {
            url = `https://steamcommunity.com/market/listings/570/${encodeURIComponent(item.market_hash_name)}`;
        } else if (item.game === "PUBG") {
            url = `https://steamcommunity.com/market/listings/578080/${encodeURIComponent(item.market_hash_name)}`;
        }
        if (url) {
            window.open(url, '_blank');
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ style: { borderRadius: 16 } }}>
            <DialogTitle sx={{ textAlign: 'center' }}>
                <Typography variant="h6" fontWeight="bold" color="primary">{t.itemDetails}</Typography>
            </DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} md={5}>
                        <Box display="flex" flexDirection="column" alignItems="center">
                            {item.image && (
                                <img src={item.image} alt={item.name} style={{ width: '100%', maxWidth: 200, borderRadius: 8, marginBottom: 16 }} />
                            )}
                            <Typography variant="h5" fontWeight="bold" textAlign="center">{item.name.replace(/\*/g, '')}</Typography>
                            <Chip label={item.sold ? t.sold : t.active} color={item.sold ? "success" : "primary"} size="small" sx={{ mt: 1, fontWeight: 'bold' }} />
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={7}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography variant="body2" color="text.secondary">Ціна за одиницю</Typography>
                                <Typography variant="h6" fontWeight="bold">{convertCurrency(item.buyPrice, item.buyCurrency).toFixed(2)} {CURRENCY_SYMBOLS[displayCurrency]}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body2" color="text.secondary">Поточна ціна</Typography>
                                <Typography variant="h6" fontWeight="bold">
                                    {item.currentPrice ? convertCurrency(item.currentPrice, 'EUR').toFixed(2) : '-'} {item.currentPrice ? CURRENCY_SYMBOLS[displayCurrency] : ''}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body2" color="text.secondary">Ціна продажу</Typography>
                                <Typography variant="h6" fontWeight="bold">
                                    {item.sold ? convertCurrency(item.sellPrice, item.buyCurrency).toFixed(2) : '-'} {item.sold ? CURRENCY_SYMBOLS[displayCurrency] : ''}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body2" color="text.secondary">{t.profit}</Typography>
                                <Typography variant="h6" fontWeight="bold" sx={{ color: profitColor }}>
                                    {itemProfit.toFixed(2)} {CURRENCY_SYMBOLS[displayCurrency]}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body2" color="text.secondary">Загальна комісія</Typography>
                                <Typography variant="h6" fontWeight="bold" >
                                    {totalCommissionRate.toFixed(2)}%
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body2" color="text.secondary">ROI (%)</Typography>
                                <Typography variant="h6" fontWeight="bold" sx={{ color: profitColor }}>
                                    {profitPercentage}%
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3, display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                    <Button onClick={() => { onClose(); confirmDelete(item); }} color="error" variant="text" startIcon={<Delete />} sx={{ borderRadius: 8 }} >
                        {t.delete}
                    </Button>
                </Box>
                <Box display="flex" gap={1}>
                    <Button onClick={() => { onClose(); handleCurrentPriceUpdate(item); }} color="info" variant="outlined" startIcon={<Zap />} sx={{ borderRadius: 8 }} >
                        {t.updatePrice}
                    </Button>
                    <Button onClick={() => { onClose(); handleOpenMarketLink(); }} color="secondary" variant="outlined" startIcon={<Globe />} sx={{ borderRadius: 8 }} >
                        {t.openMarket}
                    </Button>
                    <Button onClick={() => { onClose(); handleEdit(item); }} color="primary" variant="contained" startIcon={<Edit />} sx={{ borderRadius: 8 }} >
                        {t.edit}
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default ItemDetailsDialog;