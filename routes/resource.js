const express = require('express');
const router = express.Router();
const item_controller = require('../controllers/item');

router.get('/', function(req, res) {
  res.send([
    {
      resource: 'items',
      verbs: ['GET', 'POST', 'PUT', 'DELETE']
    }
  ]);
});

router.get('/items', item_controller.item_list);
router.get('/items/:id', item_controller.item_detail);
router.post('/items', item_controller.item_create_post);
router.delete('/items/:id', item_controller.item_delete);
router.put('/items/:id', item_controller.item_update_put);

module.exports = router;
