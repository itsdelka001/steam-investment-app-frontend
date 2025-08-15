import React from 'react';
import {
  Typography, Box, IconButton, Menu, MenuItem,
  FormGroup, FormControlLabel, Switch, FormControl,
  InputLabel, Select, Tooltip, CircularProgress
} from '@mui/material';
import { Zap, BarChart, Settings, Globe, DollarSign } from 'lucide-react';

const PortfolioHeader = ({
  t,
  theme,
  themeMode,
  setThemeMode,
  autoUpdateEnabled,
  setAutoUpdateEnabled,
  lang,
  setLang,
  displayCurrency,
  setDisplayCurrency,
  CURRENCIES,
  fetchAndUpdateAllPrices,
  isUpdatingAllPrices,
  handleAnalyticsOpen,
  handleSettingsMenuClick,
  settingsAnchorEl,
  settingsMenuOpen,
  handleSettingsMenuClose
}) => {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Typography variant="h4" color="primary" fontWeight="bold">
        {t.portfolio}
      </Typography>
      <Box display="flex" gap={1}>
        <Tooltip title={t.updateAllPrices}>
          <IconButton color="primary" onClick={fetchAndUpdateAllPrices} disabled={isUpdatingAllPrices}>
            {isUpdatingAllPrices ? <CircularProgress size={24} /> : <Zap />}
          </IconButton>
        </Tooltip>
        <Tooltip title={t.analytics}>
          <IconButton color="secondary" onClick={handleAnalyticsOpen}>
            <BarChart />
          </IconButton>
        </Tooltip>
        <Tooltip title={t.settings}>
          <IconButton color="secondary" onClick={handleSettingsMenuClick}>
            <Settings />
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={settingsAnchorEl}
          open={settingsMenuOpen}
          onClose={handleSettingsMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={(e) => e.stopPropagation()}>
            <FormGroup>
              <FormControlLabel
                control={<Switch checked={themeMode === 'dark'} onChange={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')} />}
                label="Темна тема"
              />
            </FormGroup>
          </MenuItem>
          <MenuItem onClick={(e) => e.stopPropagation()}>
            <FormGroup>
              <FormControlLabel
                control={<Switch checked={autoUpdateEnabled} onChange={() => setAutoUpdateEnabled(!autoUpdateEnabled)} />}
                label="Автоматичне оновлення"
              />
            </FormGroup>
          </MenuItem>
          <MenuItem onClick={handleSettingsMenuClose}>
            <Box display="flex" alignItems="center" gap={1}>
              <Globe size={18} />
              <FormControl variant="standard" size="small" sx={{ minWidth: 100 }}>
                <InputLabel>Мова</InputLabel>
                <Select
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  label="Мова"
                >
                  <MenuItem value="uk">Українська</MenuItem>
                  <MenuItem value="en">English</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </MenuItem>
          <MenuItem onClick={handleSettingsMenuClose}>
            <Box display="flex" alignItems="center" gap={1}>
              <DollarSign size={18} />
              <FormControl variant="standard" size="small" sx={{ minWidth: 100 }}>
                <InputLabel>Валюта відображення</InputLabel>
                <Select
                  value={displayCurrency}
                  onChange={(e) => setDisplayCurrency(e.target.value)}
                  label="Валюта відображення"
                >
                  {CURRENCIES.map((currency, index) => (
                    <MenuItem key={index} value={currency}>{currency}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default PortfolioHeader;