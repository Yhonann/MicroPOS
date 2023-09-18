const amqp = require('amqplib/callback_api');

// Connect to RabbitMQ server
amqp.connect('amqp://localhost', (error0, connection) => {
  if (error0) {
    throw error0;
  }

  // Create a channel
  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1;
    }

    const queue = 'cryptoVisualizationQueue';

    // Assert a queue
    channel.assertQueue(queue, {
      durable: false
    });

    // Send processed crypto data to the queue
    const processedData = JSON.stringify([
      { name: 'Bitcoin', pileSize: 70 },
      { name: 'Ethereum', pileSize: 30 }
    ]);

    channel.sendToQueue(queue, Buffer.from(processedData));
    console.log(`Sent: ${processedData}`);
  });
});