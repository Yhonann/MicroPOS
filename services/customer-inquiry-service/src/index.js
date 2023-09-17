const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = 3001;
const url = 'mongodb://127.0.0.1:27017';
const dbName = 'customerInquiryDB';

const client = new MongoClient(url);

app.use(express.json());

const connectToMongoDB = async () => {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db(dbName);

    app.post('/addInquiry', async (req, res) => {
      try {
        const newInquiry = req.body;
        await db.collection('inquiries').insertOne(newInquiry);
        res.send('Inquiry added');
      } catch (err) {
        console.error('Failed to add inquiry:', err);
        res.status(500).send('Internal Server Error');
      }
    });

    app.put('/updateInquiry/:id', async (req, res) => {
      try {
        const id = ObjectId(req.params.id);
        const updateData = req.body;
        await db.collection('inquiries').updateOne({ _id: id }, { $set: updateData });
        res.send('Inquiry updated');
      } catch (err) {
        console.error('Failed to update inquiry:', err);
        res.status(500).send('Internal Server Error');
      }
    });

    app.delete('/deleteInquiry/:id', async (req, res) => {
      try {
        const id = ObjectId(req.params.id);
        await db.collection('inquiries').deleteOne({ _id: id });
        res.send('Inquiry deleted');
      } catch (err) {
        console.error('Failed to delete inquiry:', err);
        res.status(500).send('Internal Server Error');
      }
    });

    app.get('/getInquiries', async (req, res) => {
      try {
        const inquiries = await db.collection('inquiries').find({}).toArray();
        res.send(inquiries);
      } catch (err) {
        console.error('Failed to get inquiries:', err);
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