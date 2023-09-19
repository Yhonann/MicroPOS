const processCryptoData = (tvlData) => {
  const totalMarketCap = tvlData.reduce((acc, coin) => acc + coin.tvl, 0);
  const coinPiles = tvlData.map(coin => ({
    name: coin.name,
    pileSize: (coin.tvl / totalMarketCap) * 100
  }));
  return coinPiles;
};

// Example usage
const tvlData = [
  { name: 'Bitcoin', tvl: 900000000 },
  { name: 'Ethereum', tvl: 400000000 }
];

const coinPiles = processCryptoData(tvlData);
console.log(coinPiles);