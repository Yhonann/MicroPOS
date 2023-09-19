const express = require('express');
const app = express();
const port = 3005;
const amqp = require('amqplib');
const cors = require('cors');

const rabbitmqUrl = 'amqp://rabbitmq';
const queueName = 'api-to-crypto-queue';

let cryptoData = [];

async function createQueue() {
  const connection = await amqp.connect(rabbitmqUrl);
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: true });
}

async function consumeMessages() {
  const connection = await amqp.connect(rabbitmqUrl);
  const channel = await connection.createChannel();

  channel.consume(queueName, (msg) => {
    if (msg !== null) {
      const messageContent = msg.content.toString();
      console.log('Received message:', messageContent);

      const parsedMessage = JSON.parse(messageContent);
      cryptoData.push(parsedMessage);

      channel.ack(msg);
    }
  });

  console.log(`Waiting for messages in ${queueName}. To exit, press CTRL+C`);
}

app.use(cors({
  origin: "*",
  methods: 'GET,POST',
  credentials: true,
  optionsSuccessStatus: 204,
}));

cors("*");
app.get('/api/crypto-data', (req, res) => {
  res.json(cryptoData);
  consumeMessages();
});

cors("*");
app.listen(port, async () => {
  await createQueue();
  console.log(`Crypto Data Service is running on port ${port}`);
});