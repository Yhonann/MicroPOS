const express = require('express');
const cors = require('cors');
const amqp = require('amqplib');
const fetchCryptoData = require('./fetchCryptoData');
const processCryptoData = require('./processCryptoData');
const renderCoinPiles = require('./renderCoinPiles');

const app = express();

// Use environment variable for RabbitMQ URL or default to 'amqp://localhost'
const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://rabbitmq';

function connectToRabbitMQ() {
  return amqp.connect(rabbitmqUrl)
    .then(connection => connection.createChannel())
    .then(channel => {
      // Declare frontend-to-api-queue as a Classic Transient queue with auto-delete
      return channel.assertQueue('frontend-to-api-queue', { durable: false, autoDelete: true })
        .then(() => channel);
    });
}

function sendMessage(channel, queue, message) {
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
}

connectToRabbitMQ()
  .then(channel => {
    const corsOptions = {
      origin: '*',
    };

    app.use(cors(corsOptions));

    app.get('/api/crypto-visualization', (req, res) => {
      fetchCryptoData()
        .then(cryptoData => {
          const processedCryptoData = processCryptoData(cryptoData);
          sendMessage(channel, 'api-to-crypto-queue', processedCryptoData);
          res.status(202).json({ message: 'Data sent to processing service' });
        })
        .catch(error => {
          console.error('Failed to fetch or process crypto data:', error);
          res.status(500).json({ error: 'Failed to fetch, process, or render crypto data' });
        });
    });

    const PORT = process.env.PORT || 4001;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(error => {
    console.error('Failed to connect to RabbitMQ:', error);
  });
