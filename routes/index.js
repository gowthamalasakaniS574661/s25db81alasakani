const express = require('express');
const router = express.Router();
const Item = require('../models/artifact'); // ✅ Lowercase 'item' for correct file name

// Root route - renders homepage
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express with MongoDB' });
});

// Route to manually add a test item (for quick testing)
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

// Route to list all items in JSON format
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
