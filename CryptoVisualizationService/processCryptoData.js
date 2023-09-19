const processCryptoData = (tvlData) => {
  const totalMarketCap = tvlData.reduce((acc, coin) => acc + coin.tvl, 0);
  const coinPiles = tvlData.map(coin => ({
    name: coin.name,
    pileSize: (coin.tvl / totalMarketCap) * 100
  }));
  return coinPiles;
};

module.exports = processCryptoData;