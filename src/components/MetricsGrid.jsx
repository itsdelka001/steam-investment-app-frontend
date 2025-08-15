import React from 'react';
import { Grid, Typography, Tooltip, Box } from '@mui/material';
import { 
  StyledMetricCard, 
  StyledCombinedCard 
} from '../theme';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Percent, 
  Tag, 
  Clock 
} from 'lucide-react';
import { CURRENCY_SYMBOLS } from '../constants';

const MetricsGrid = ({ 
  theme, 
  displayCurrency, 
  totalInvestment, 
  totalSoldProfit, 
  currentMarketProfit, 
  realizedROI, 
  unrealizedROI, 
  totalFeesPaid, 
  averageHoldingPeriod,
  t 
}) => {
  const profitColor = totalSoldProfit >= 0 ? theme.palette.success.main : theme.palette.error.main;
  const currentProfitColor = currentMarketProfit >= 0 ? theme.palette.success.main : theme.palette.error.main;
  const realizedROIColor = realizedROI >= 0 ? theme.palette.success.main : theme.palette.error.main;
  const unrealizedROIColor = unrealizedROI >= 0 ? theme.palette.success.main : theme.palette.error.main;

  return (
    <Grid container spacing={2} mb={4} justifyContent="center" sx={{ px: { xs: 1, md: 0 } }}>
      {/* Загальний капітал */}
      <Grid item xs={12} sm={6} md={4} lg={2}>
        <Tooltip title={t.totalInvestmentTooltip} arrow>
          <StyledMetricCard>
            <DollarSign size={36} color={theme.palette.primary.main} sx={{ mb: 1 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {t.totalInvestment}
            </Typography>
            <Typography variant="h4" fontWeight="bold" color="primary">
              {totalInvestment.toFixed(2)} {CURRENCY_SYMBOLS[displayCurrency]}
            </Typography>
          </StyledMetricCard>
        </Tooltip>
      </Grid>
      
      {/* Реалізований прибуток */}
      <Grid item xs={12} sm={6} md={4} lg={2}>
        <Tooltip title={t.totalProfitTooltip} arrow>
          <StyledMetricCard bgcolor={profitColor === theme.palette.success.main ? theme.palette.success.light : theme.palette.error.light}>
            {totalSoldProfit >= 0 ? 
              <TrendingUp size={36} color={theme.palette.success.main} sx={{ mb: 1 }} /> : 
              <TrendingDown size={36} color={theme.palette.error.main} sx={{ mb: 1 }} />
            }
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {t.totalProfit}
            </Typography>
            <Typography variant="h4" fontWeight="bold" sx={{ color: profitColor }}>
              {totalSoldProfit.toFixed(2)} {CURRENCY_SYMBOLS[displayCurrency]}
            </Typography>
          </StyledMetricCard>
        </Tooltip>
      </Grid>

      {/* Нереалізований прибуток */}
      <Grid item xs={12} sm={6} md={4} lg={2}>
        <Tooltip title="Потенційний прибуток від активних інвестицій." arrow>
          <StyledMetricCard bgcolor={currentProfitColor === theme.palette.success.main ? theme.palette.success.light : theme.palette.error.light}>
            {currentMarketProfit >= 0 ?
              <TrendingUp size={36} color={theme.palette.success.main} sx={{ mb: 1 }} /> :
              <TrendingDown size={36} color={theme.palette.error.main} sx={{ mb: 1 }} />
            }
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Поточний прибуток
            </Typography>
            <Typography variant="h4" fontWeight="bold" sx={{ color: currentProfitColor }}>
              {currentMarketProfit.toFixed(2)} {CURRENCY_SYMBOLS[displayCurrency]}
            </Typography>
          </StyledMetricCard>
        </Tooltip>
      </Grid>

      {/* ROI */}
      <Grid item xs={12} sm={6} md={4} lg={2}>
        <StyledCombinedCard>
          <Box sx={{ textAlign: 'center' }}>
            <Percent size={36} color={theme.palette.primary.main} />
            <Typography variant="h6" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
              ROI (%)
            </Typography>
          </Box>
          <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body1" fontWeight="bold" color="text.secondary">
              Реалізований:
              <Typography component="span" fontWeight="bold" sx={{ color: realizedROIColor, ml: 1 }}>
                {realizedROI.toFixed(2)}%
              </Typography>
            </Typography>
            <Typography variant="body1" fontWeight="bold" color="text.secondary">
              Нереалізований:
              <Typography component="span" fontWeight="bold" sx={{ color: unrealizedROIColor, ml: 1 }}>
                {unrealizedROI.toFixed(2)}%
              </Typography>
            </Typography>
          </Box>
        </StyledCombinedCard>
      </Grid>

      {/* Комісії */}
      <Grid item xs={12} sm={6} md={4} lg={2}>
        <Tooltip title="Загальна сума сплачених комісій під час продажу." arrow>
          <StyledMetricCard>
            <Tag size={36} color={theme.palette.warning.main} sx={{ mb: 1 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Загальні комісії
            </Typography>
            <Typography variant="h4" fontWeight="bold" color="text.primary">
              {totalFeesPaid.toFixed(2)} {CURRENCY_SYMBOLS[displayCurrency]}
            </Typography>
          </StyledMetricCard>
        </Tooltip>
      </Grid>

      {/* Середній термін */}
      <Grid item xs={12} sm={6} md={4} lg={2}>
        <Tooltip title="Середня кількість днів, які ви тримаєте активи до продажу." arrow>
          <StyledMetricCard>
            <Clock size={36} color={theme.palette.secondary.main} sx={{ mb: 1 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Середній термін
            </Typography>
            <Typography variant="h4" fontWeight="bold" color="text.primary">
              {averageHoldingPeriod.toFixed(1)} {t.days}
            </Typography>
          </StyledMetricCard>
        </Tooltip>
      </Grid>
    </Grid>
  );
};

export default MetricsGrid;