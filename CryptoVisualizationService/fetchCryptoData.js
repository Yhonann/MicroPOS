const axios = require('axios');

const fetchCryptoData = async () => {
  try {
    // Send a GET request to the CoinGecko API
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 10,
        page: 1
      }
    });

    // Log the response
    console.log('Response:', response);

    // Check the HTTP status code
    console.log('Status:', response.status);

    // Extract the data from the response
    const cryptoData = response.data;

    // Log the data structure
    console.log('Data:', cryptoData);

    // Map the data to include only the name and TVL (market_cap) of each coin
    const tvlData = cryptoData.map(coin => ({
      name: coin.name,
      tvl: coin.market_cap
    }));

    return tvlData;
  } catch (error) {
    // Handle errors and log error details
    console.error('Error fetching crypto data:', error.response || error);
  }
};

// Call the fetchCryptoData function and log the result
fetchCryptoData().then(data => console.log(data));
