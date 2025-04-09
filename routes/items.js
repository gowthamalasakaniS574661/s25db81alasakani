const express = require('express');
const router = express.Router();
const item_controller = require('../controllers/item');

// ✅ Static form route (must be before `/:id`)
router.get('/new', (req, res) => {
  res.render('item_form', { title: 'Add New Item' });
});

// ✅ View all items
router.get('/', item_controller.item_view_all_Page);

// ✅ API endpoint
router.get('/api', item_controller.item_list);

// ✅ Create item
router.post('/', item_controller.item_create_post);

// ✅ Update item (PUT)
router.put('/:id', item_controller.item_update_put);

// ✅ Delete item (DELETE)
router.delete('/:id', item_controller.item_delete);

// ✅ View details of one item (must be last)
router.get('/:id', item_controller.item_detail);

module.exports = router;
