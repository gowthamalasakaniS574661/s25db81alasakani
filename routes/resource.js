const express = require('express');
const router = express.Router();
const api_controller = require('../controllers/api');
const artifact_controller = require('../controllers/artifact');

// API info
router.get('/', api_controller.api);

// RESTful routes for artifacts
router.get('/artifacts', artifact_controller.artifact_list);           // Get all artifacts
router.get('/artifacts/:id', artifact_controller.artifact_detail);     // ✅ Get one artifact by ID
router.post('/artifacts', artifact_controller.artifact_create_post);
router.put('/artifacts/:id', artifact_controller.artifact_update_put);
router.delete('/artifacts/:id', artifact_controller.artifact_delete);

module.exports = router;
