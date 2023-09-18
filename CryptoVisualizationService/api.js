const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

// Dummy processed data
const processedData = [
  { name: 'Bitcoin', pileSize: 70 },
  { name: 'Ethereum', pileSize: 30 }
];

app.get('/api/crypto-visualization', (req, res) => {
  res.json(processedData);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});