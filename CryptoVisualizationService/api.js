const express = require('express');
const cors = require('cors');
const app = express();
const amqp = require('amqplib');

// Function to create a connection to RabbitMQ
async function createConnection() {
  try {
    const connection = await amqp.connect('amqp://rabbitmq'); // Replace with your RabbitMQ server URL
    return connection;
  } catch (error) {
    console.error('Error creating RabbitMQ connection:', error);
  }
}

// Function to publish a message to RabbitMQ
async function publishMessage(channel, queueName, message) {
  try {
    await channel.assertQueue(queueName);
    channel.sendToQueue(queueName, Buffer.from(message));
    console.log(`Sent message: "${message}"`);
  } catch (error) {
    console.error('Error publishing message:', error);
  }
}

// Usage example: create a RabbitMQ connection and a channel
let rabbitmqChannel;
createConnection()
  .then((connection) => {
    return connection.createChannel();
  })
  .then((channel) => {
    rabbitmqChannel = channel;
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
  })
  .catch((error) => {
    console.error('Error:', error);
  });

// Usage example: publish a message to RabbitMQ
app.get('/api/send-message', (req, res) => {
  const message = 'Hello, RabbitMQ!';
  publishMessage(rabbitmqChannel, 'crypto_data_queue', message);
  res.send('Message sent to RabbitMQ');
});
