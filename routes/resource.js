const express = require('express');
const router = express.Router();

// ✅ Load the correct controllers
const api_controller = require('../controllers/api');
const artifact_controller = require('../controllers/artifact');

/// API ROOT ///
router.get('/', api_controller.api);

/// ARTIFACT ROUTES ///
router.get('/artifacts', artifact_controller.artifact_list);
router.get('/artifacts/:id', artifact_controller.artifact_detail);
router.post('/artifacts', artifact_controller.artifact_create_post);
router.put('/artifacts/:id', artifact_controller.artifact_update_put);
router.delete('/artifacts/:id', artifact_controller.artifact_delete);

module.exports = router;
