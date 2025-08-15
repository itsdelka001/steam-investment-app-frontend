export const convertCurrency = (value, fromCurrency, toCurrency, rates) => {
  if (fromCurrency === toCurrency || !rates?.[fromCurrency] || !rates?.[toCurrency]) {
    return value;
  }
  const rateToEUR = 1 / rates[fromCurrency];
  const rateFromEUR = rates[toCurrency];
  return value * rateToEUR * rateFromEUR;
};

export const getNetProfit = (grossProfit, totalValue, commissions = []) => {
  const totalRate = commissions.reduce((sum, c) => sum + c.rate, 0);
  const totalCommission = totalValue * (totalRate / 100);
  return grossProfit - totalCommission;
};