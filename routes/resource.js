const express = require("express");
const router = express.Router();
const artifactController = require("../controllers/artifact");

router.get("/artifacts", artifactController.artifact_list);
router.get("/artifacts/:id", artifactController.artifact_detail);
router.post("/artifacts", artifactController.artifact_create_post);
router.put("/artifacts/:id", artifactController.artifact_update_put);
router.delete("/artifacts/:id", artifactController.artifact_delete);

module.exports = router;
