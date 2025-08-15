export const convertCurrency = (value, fromCurrency, toCurrency, rates) => {
  if (fromCurrency === toCurrency || !rates || Object.keys(rates).length === 0) {
    return value;
  }

  // Use a common base currency (e.g., EUR) for conversion.
  const baseCurrency = 'EUR';

  // Check if both 'from' and 'to' currencies are available in the rates object.
  if (!rates?.[fromCurrency] || !rates?.[toCurrency]) {
    console.error(`Missing exchange rate for ${fromCurrency} or ${toCurrency}. Conversion failed.`);
    return value; // Return original value if rates are missing
  }

  // Convert the value from its original currency to the base currency (EUR)
  const valueInBaseCurrency = value / rates[fromCurrency];

  // Convert the value from the base currency to the target currency
  const convertedValue = valueInBaseCurrency * rates[toCurrency];

  return convertedValue;
};

export const getNetProfit = (grossProfit, totalValue, commissions = []) => {
  const totalRate = commissions.reduce((sum, c) => sum + c.rate, 0);
  const totalCommission = totalValue * (totalRate / 100);
  return grossProfit - totalCommission;
};
