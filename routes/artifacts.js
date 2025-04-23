const express = require("express");
const router = express.Router();
const artifact_controller = require("../controllers/artifact");

// 🔐 Middleware: Protects routes that require authentication
const secured = (req, res, next) => {
  if (req.user) return next();

  // Save the intended URL for redirect after login
  req.session.returnTo = req.originalUrl;

  res.status(401).render("unauthorized", {
    title: "🔐 Access Denied",
    message: "🚧 Please log in to Create, Update, or Delete artifacts.",
    redirectTo: "/login"
  });
};

// -------------------------------
// 🌐 PAGE VIEWS (PUG Templates)
// -------------------------------
router.get("/", secured, artifact_controller.artifact_view_all_Page);          // Dashboard
router.get("/detail", secured, artifact_controller.artifact_detail_page);      // Detail view
router.get("/create", secured, artifact_controller.artifact_create_Page);      // Create view
router.get("/update", secured, artifact_controller.artifact_update_Page);      // Update view
router.get("/delete", secured, artifact_controller.artifact_delete_Page);      // Delete confirmation

// -------------------------------
// 🧩 REST API ENDPOINTS (fetch/Postman)
// -------------------------------
router.get("/api", secured, artifact_controller.artifact_list);                // Get all
router.post("/", secured, artifact_controller.artifact_create_post);           // Create
router.put("/:id", secured, artifact_controller.artifact_update_put);          // Update
router.delete("/:id", secured, artifact_controller.artifact_delete);           // Delete

// -------------------------------
// 🧾 FALLBACK: View by MongoDB ID (must be last)
// -------------------------------
router.get("/:id", secured, artifact_controller.artifact_detail);              // Fallback: view one by ID

module.exports = router;
