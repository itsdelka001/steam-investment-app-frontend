import React from 'react';
import { Box, Typography, Paper, Grid, Divider, Tooltip } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, Tooltip as ChartTooltip, ResponsiveContainer, CartesianGrid, Legend, PieChart, Pie, Cell, BarChart as RechartsBarChart, Bar } from 'recharts';
import { GAMES } from '../constants';

export default function PortfolioDashboard({
  t,
  theme,
  cumulativeProfit,
  investmentDistributionData,
  profitByGameData,
}) {
  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" color="primary" sx={{ mb: 2 }}>
        {t.analytics}
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2, background: theme.palette.background.paper }}>
        <Typography variant="h6" mb={2} color="secondary">
          {t.profitDynamics}
        </Typography>
        {cumulativeProfit.length === 0 ? (
          <Typography variant="body1" align="center" color="text.secondary">{t.noData}</Typography>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={cumulativeProfit} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
              <XAxis dataKey="date" stroke={theme.palette.text.secondary} />
              <YAxis stroke={theme.palette.text.secondary} />
              <ChartTooltip contentStyle={{ backgroundColor: theme.palette.background.paper, border: '1px solid #ccc', borderRadius: 8 }} />
              <Legend />
              <Line type="monotone" dataKey="profit" stroke={theme.palette.primary.main} activeDot={{ r: 8 }} name={t.profit} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Paper>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, mb: 2, borderRadius: 2, background: theme.palette.background.paper }}>
            <Typography variant="h6" mb={2} color="secondary">
              {t.investmentDistribution}
            </Typography>
            {investmentDistributionData.length === 0 ? (
              <Typography variant="body1" align="center" color="text.secondary">{t.noData}</Typography>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={investmentDistributionData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill={theme.palette.primary.main} label>
                    {investmentDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip contentStyle={{ backgroundColor: theme.palette.background.paper, border: '1px solid #ccc', borderRadius: 8 }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, mb: 2, borderRadius: 2, background: theme.palette.background.paper }}>
            <Typography variant="h6" mb={2} color="secondary">
              {t.profitByGame}
            </Typography>
            {profitByGameData.length === 0 ? (
              <Typography variant="body1" align="center" color="text.secondary">{t.noData}</Typography>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <RechartsBarChart data={profitByGameData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                  <XAxis dataKey="name" stroke={theme.palette.text.secondary} />
                  <YAxis stroke={theme.palette.text.secondary} />
                  <ChartTooltip contentStyle={{ backgroundColor: theme.palette.background.paper, border: '1px solid #ccc', borderRadius: 8 }} />
                  <Legend />
                  <Bar dataKey="profit" name={t.profit} fill={theme.palette.primary.main} />
                </RechartsBarChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}