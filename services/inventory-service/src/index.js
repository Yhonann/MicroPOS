const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = 3000;
const url = 'mongodb://127.0.0.1:27017';
const dbName = 'inventoryDB';

const client = new MongoClient(url);

app.use(express.json());

const connectToMongoDB = async () => {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db(dbName);

    app.post('/addItem', async (req, res) => {
      try {
        const newItem = req.body;
        await db.collection('items').insertOne(newItem);
        res.send('Item added');
      } catch (err) {
        console.error('Failed to add item:', err);
        res.status(500).send('Internal Server Error');
      }
    });

    app.put('/updateItem/:id', async (req, res) => {
      try {
        const id = ObjectId(req.params.id);
        const newQuantity = req.body.quantity;
        await db.collection('items').updateOne({ _id: id }, { $set: { quantity: newQuantity } });
        res.send('Item updated');
      } catch (err) {
        console.error('Failed to update item:', err);
        res.status(500).send('Internal Server Error');
      }
    });

    app.delete('/deleteItem/:id', async (req, res) => {
      try {
        const id = ObjectId(req.params.id);
        await db.collection('items').deleteOne({ _id: id });
        res.send('Item deleted');
      } catch (err) {
        console.error('Failed to delete item:', err);
        res.status(500).send('Internal Server Error');
      }
    });

    app.get('/getItems', async (req, res) => {
      try {
        const items = await db.collection('items').find({}).toArray();
        res.send(items);
      } catch (err) {
        console.error('Failed to get items:', err);
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