const express = require('express');
const cors = require('cors');
const amqp = require('amqplib');

const app = express();
app.use(cors());

async function connectToRabbitMQ() {
  const connection = await amqp.connect('amqp://rabbitmq:5672');


  const channel = await connection.createChannel();
  return channel;
}

async function sendMessage(channel, queue, message) {
  await channel.assertQueue(queue);
  channel.sendToQueue(queue, Buffer.from(message));
}

(async () => {
  try {
    const channel = await connectToRabbitMQ();

    app.get('/api/crypto-visualization', (req, res) => {
      res.json([{ name: 'Bitcoin', pileSize: 70 }, { name: 'Ethereum', pileSize: 30 }]);
    });

    app.get('/api/send-message', (req, res) => {
      sendMessage(channel, 'crypto_data_queue', 'Hello, RabbitMQ!');
      res.send('Message sent to RabbitMQ');
    });

    const PORT = process.env.PORT || 3006;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error('Failed to connect to RabbitMQ:', error);
  }
})();