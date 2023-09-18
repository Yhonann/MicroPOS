const express = require('express');
const app = express();
const port = 3005; // Choose an appropriate port
const amqp = require('amqplib');

// RabbitMQ connection URL (replace with your RabbitMQ server URL)
const rabbitmqUrl = 'amqp://rabbitmq'; // Example URL for a local RabbitMQ server

// Queue name to consume messages from
const queueName = 'crypto_data_queue';

// Variable to store received crypto data
let cryptoData = [];

// Function to consume messages from the queue and store them
async function consumeMessages() {
  try {
    // Create a connection to RabbitMQ
    const connection = await amqp.connect(rabbitmqUrl);

    // Create a channel
    const channel = await connection.createChannel();

    // Assert the queue exists (it will be created if not)
    await channel.assertQueue(queueName);

    // Define a callback function to handle incoming messages
    channel.consume(queueName, (msg) => {
      if (msg !== null) {
        // Process the received message
        const messageContent = msg.content.toString();
        console.log('Received message:', messageContent);

        // Parse the message and add it to the cryptoData array
        const parsedMessage = JSON.parse(messageContent);
        cryptoData.push(parsedMessage);

        // Acknowledge the message to remove it from the queue
        channel.ack(msg);
      }
    });

    console.log(`Waiting for messages in ${queueName}. To exit, press CTRL+C`);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Start consuming messages
consumeMessages();

// Create an API endpoint to retrieve crypto data
app.get('/api/crypto-data', (req, res) => {
  res.json(cryptoData);
});

app.listen(port, () => {
  console.log(`Crypto Data Service is running on port ${port}`);
});
