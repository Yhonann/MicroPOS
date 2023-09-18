const axios = require('axios');

const fetchCryptoData = async () => {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 10,
        page: 1
      }
    });
    const cryptoData = response.data;
    const tvlData = cryptoData.map(coin => ({
      name: coin.name,
      tvl: coin.market_cap
    }));
    return tvlData;
  } catch (error) {
    console.error('Error fetching crypto data:', error);
  }
};

fetchCryptoData().then(data => console.log(data));