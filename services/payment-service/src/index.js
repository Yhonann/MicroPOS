const express = require('express');
const { MongoClient } = require('mongodb');
const Stripe = require('stripe');

const stripe = new Stripe('your_stripe_secret_key');
const app = express();
const port = 4000;
const url = 'mongodb://127.0.0.1:27017';
const dbName = 'paymentDB';

const client = new MongoClient(url);

app.use(express.json());

const connectToMongoDB = async () => {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db(dbName);

    app.post('/processPayment', async (req, res) => {
      try {
        const { amount, token } = req.body;
        const charge = await stripe.charges.create({
          amount,
          currency: 'usd',
          source: token,
        });
        await db.collection('transactions').insertOne(charge);
        res.send('Payment processed');
      } catch (err) {
        console.error('Failed to process payment:', err);
        res.status(500).send('Internal Server Error');
      }
    });

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
  }
};

connectToMongoDB();