const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express with MongoDB' });
});

router.get('/add-item', async (req, res) => {
  try {
    const newItem = new Item({ name: 'Test Item', quantity: 5 });
    await newItem.save();
    res.send('✅ Item added to MongoDB!');
  } catch (err) {
    console.error(err);
    res.status(500).send('❌ Failed to add item');
  }
});

router.get('/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).send('❌ Error retrieving items');
  }
});

module.exports = router;
