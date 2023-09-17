const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 4000;
const url = 'mongodb://127.0.0.1:27017';
const dbName = 'analyticsDB';

const client = new MongoClient(url);

app.use(express.json());

const connectToMongoDB = async () => {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db(dbName);

    app.post('/recordEvent', async (req, res) => {
      try {
        const newEvent = req.body;
        await db.collection('events').insertOne(newEvent);
        res.send('Event recorded');
      } catch (err) {
        console.error('Failed to record event:', err);
        res.status(500).send('Internal Server Error');
      }
    });

    app.get('/getEvents', async (req, res) => {
      try {
        const events = await db.collection('events').find({}).toArray();
        res.send(events);
      } catch (err) {
        console.error('Failed to get events:', err);
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