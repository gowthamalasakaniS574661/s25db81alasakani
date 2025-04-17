const express = require("express");
const router = express.Router();
const artifact_controller = require("../controllers/artifact");

// ------- View Routes (specific first!) -------
router.get("/", artifact_controller.artifact_view_all_Page);
router.get("/create", artifact_controller.artifact_create_Page);
router.get("/update", artifact_controller.artifact_update_Page);
router.get("/delete", artifact_controller.artifact_delete_Page);
router.get("/detail", artifact_controller.artifact_detail_page);

// ------- API Routes (REST) -------
router.get("/api", artifact_controller.artifact_list);
router.post("/", artifact_controller.artifact_create_post);
router.put("/:id", artifact_controller.artifact_update_put);
router.delete("/:id", artifact_controller.artifact_delete);

// This MUST come last to avoid overriding specific routes
router.get("/:id", artifact_controller.artifact_detail);

module.exports = router;
