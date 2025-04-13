const express = require("express");
const router = express.Router();
const artifact_controller = require("../controllers/artifact");

// ===== PUG Views =====
router.get("/", artifact_controller.artifact_view_all_Page);              // Home list page
router.get("/create", artifact_controller.artifact_create_Page);          // Form to create
router.get("/update", artifact_controller.artifact_update_Page);          // Form to update
router.get("/delete", artifact_controller.artifact_delete_Page);          // Confirm delete
router.get("/detail", artifact_controller.artifact_detail_page);          // Detail page

// ===== REST API (used by Postman, JS fetch, etc) =====
router.get("/api", artifact_controller.artifact_list);                    // Get all (API)
router.post("/", artifact_controller.artifact_create_post);               // Create new
router.put("/:id", artifact_controller.artifact_update_put);              // Update
router.delete("/:id", artifact_controller.artifact_delete);               // Delete
router.get("/:id", artifact_controller.artifact_detail);                  // Get one by ID (MUST be last)

module.exports = router;
