const express = require("express");
const router = express.Router();
const artifact_controller = require("../controllers/artifact");

// Middleware to protect sensitive routes
const secured = (req, res, next) => {
  if (req.user) return next();
  res.status(401).render("unauthorized", {
    title: "🔐 Access Denied",
    message: "🚧 You need to log in to Create, Update, or Delete artifacts.",
    redirectTo: "/login"
  });
};

// ------- View Routes (PUG pages) -------
router.get("/", artifact_controller.artifact_view_all_Page);
router.get("/detail", artifact_controller.artifact_detail_page);
router.get("/create", secured, artifact_controller.artifact_create_Page);
router.get("/update", secured, artifact_controller.artifact_update_Page);
router.get("/delete", secured, artifact_controller.artifact_delete_Page);

// ------- API Routes (REST) -------
router.get("/api", artifact_controller.artifact_list);                   // Public access
router.post("/", secured, artifact_controller.artifact_create_post);    // Requires login
router.put("/:id", secured, artifact_controller.artifact_update_put);   // Requires login
router.delete("/:id", secured, artifact_controller.artifact_delete);    // Requires login

// ------- Fallback GET by ID (keep at bottom) -------
router.get("/:id", artifact_controller.artifact_detail);

module.exports = router;
