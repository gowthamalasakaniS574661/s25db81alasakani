const Artifact = require("../models/artifact");

// === API CONTROLLERS ===

// GET all artifacts (API)
exports.artifact_list = async (req, res) => {
  try {
    const artifacts = await Artifact.find();
    res.json(artifacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET one artifact by ID (API)
exports.artifact_detail = async (req, res) => {
  try {
    const artifact = await Artifact.findById(req.params.id);
    if (!artifact) {
      return res.status(404).json({ error: `Artifact with ID ${req.params.id} not found` });
    }
    res.json(artifact);
  } catch (error) {
    res.status(500).json({ error: `Error fetching artifact: ${error}` });
  }
};

// POST create new artifact (API + FORM)
exports.artifact_create_post = async (req, res) => {
  try {
    const artifact = new Artifact(req.body);
    const result = await artifact.save();

    if (req.headers.accept && req.headers.accept.includes("application/json")) {
      res.status(201).json(result); // API response
    } else {
      res.redirect("/artifacts");
    }
  } catch (err) {
    if (req.headers.accept && req.headers.accept.includes("application/json")) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).send("Error saving artifact");
    }
  }
};

// PUT update artifact (API + FORM)
exports.artifact_update_put = async (req, res) => {
  try {
    const artifact = await Artifact.findById(req.params.id);
    if (!artifact) return res.status(404).send({ error: "Artifact not found" });

    if (req.body.name) artifact.name = req.body.name;
    if (req.body.age) artifact.age = req.body.age;
    if (req.body.origin) artifact.origin = req.body.origin;

    const result = await artifact.save();
    res.send(result);
  } catch (err) {
    res.status(500).send({ error: `${err}: Update failed for ID ${req.params.id}` });
  }
};

// DELETE artifact (API + FORM)
exports.artifact_delete = async (req, res) => {
  try {
    const result = await Artifact.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: "Artifact not found" });
    res.send(result);
  } catch (err) {
    res.status(500).json({ error: `Error deleting artifact: ${err}` });
  }
};

// === PUG VIEW CONTROLLERS ===

// Render list of artifacts
exports.artifact_view_all_Page = async (req, res) => {
  try {
    const results = await Artifact.find();
    res.render("artifacts", { title: "Artifact List", results });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// Render detail view for one artifact
exports.artifact_detail_page = async (req, res) => {
  try {
    const result = await Artifact.findById(req.query.id);
    if (!result) {
      res.render("artifactdetail", { title: "Artifact Detail", toShow: null });
    } else {
      res.render("artifactdetail", { title: "Artifact Detail", toShow: result });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// Render create form
exports.artifact_create_Page = (req, res) => {
  try {
    res.render("artifactcreate", { title: "Create Artifact" });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// Render update form
exports.artifact_update_Page = async (req, res) => {
  try {
    const result = await Artifact.findById(req.query.id);
    if (!result) {
      res.render("artifactupdate", { title: "Update Artifact", toShow: null });
    } else {
      res.render("artifactupdate", { title: "Update Artifact", toShow: result });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// Render delete confirmation view
exports.artifact_delete_Page = async (req, res) => {
  try {
    const result = await Artifact.findById(req.query.id);
    if (!result) {
      res.render("artifactdelete", { title: "Delete Artifact", toShow: null });
    } else {
      res.render("artifactdelete", { title: "Delete Artifact", toShow: result });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};
