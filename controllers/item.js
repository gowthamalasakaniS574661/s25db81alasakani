const Item = require('../models/item');

exports.item_list = async function(req, res) {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).send(`{"error": "${err}"}`);
  }
};

exports.item_detail = async function(req, res) {
  try {
    const item = await Item.findById(req.params.id);
    res.json(item);
  } catch (err) {
    res.status(500).send(`{"error": "${err}"}`);
  }
};

exports.item_create_post = async function(req, res) {
  try {
    const item = new Item(req.body);
    const result = await item.save();
    res.json(result);
  } catch (err) {
    res.status(500).send(`{"error": "${err}"}`);
  }
};

exports.item_delete = async function(req, res) {
  try {
    const result = await Item.findByIdAndDelete(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).send(`{"error": "${err}"}`);
  }
};

exports.item_update_put = async function(req, res) {
  try {
    const result = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(result);
  } catch (err) {
    res.status(500).send(`{"error": "${err}"}`);
  }
};
