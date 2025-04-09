const express = require("express");
const router = express.Router();
const artifact_controller = require("../controllers/artifact");

router.get("/", artifact_controller.artifact_view_all_Page);
router.get("/api", artifact_controller.artifact_list);
router.post("/", artifact_controller.artifact_create_post);
router.put("/:id", artifact_controller.artifact_update_put);
router.delete("/:id", artifact_controller.artifact_delete);
router.get("/:id", artifact_controller.artifact_detail); // Must be last

module.exports = router;
