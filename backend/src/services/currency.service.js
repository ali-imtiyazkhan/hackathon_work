
import axios from 'axios';

export async function getCurrencyForCountry(countryCode) {
  const resp = await axios.get(`https://restcountries.com/v3.1/alpha/${countryCode}?fields=currencies`);
  const data = resp.data[0];
  const currencies = data?.currencies;
  const codes = Object.keys(currencies || {});
  if (codes.length > 0) {
    return codes[0];
  }
  throw new Error('Currency not found');
}


export async function convertCurrency(base, target, amount) {
  try {
    const resp = await axios.get(`https://api.exchangerate-api.com/v4/latest/${base}`);
    const rate = resp.data.rates[target];

    if (!rate) throw new Error(`Exchange rate not found for ${base} to ${target}`);

    return amount * rate;
  } catch (error) {
    console.error('Error converting currency:', error.message);
    // fallback: return same amount
    return amount;
  }
}


