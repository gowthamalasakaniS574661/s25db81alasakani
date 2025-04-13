const Artifact = require("../models/artifact");

exports.artifact_list = async (req, res) => {
  try {
    const artifacts = await Artifact.find();
    res.json(artifacts);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

exports.artifact_detail = async (req, res) => {
  try {
    const artifact = await Artifact.findById(req.params.id);
    if (!artifact) {
      return res.status(404).send({ error: `Artifact with ID ${req.params.id} not found` });
    }
    res.send(artifact);
  } catch (error) {
    res.status(500).send({ error: `Error fetching artifact: ${error}` });
  }
};

exports.artifact_create_post = async (req, res) => {
  try {
    const artifact = new Artifact(req.body);
    const result = await artifact.save();
    if (req.headers.accept && req.headers.accept.includes("application/json")) {
      res.json(result);
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

exports.artifact_update_put = async (req, res) => {
  try {
    let toUpdate = await Artifact.findById(req.params.id);
    if (!toUpdate) return res.status(404).send({ error: "Artifact not found" });

    if (req.body.name) toUpdate.name = req.body.name;
    if (req.body.age) toUpdate.age = req.body.age;
    if (req.body.origin) toUpdate.origin = req.body.origin;

    const result = await toUpdate.save();
    res.send(result);
  } catch (err) {
    res.status(500).send({ error: `${err}: Update failed for ID ${req.params.id}` });
  }
};

exports.artifact_delete = async (req, res) => {
  try {
    const result = await Artifact.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).send({ error: "Artifact not found" });
    res.send(result);
  } catch (err) {
    res.status(500).send({ error: `Error deleting artifact: ${err}` });
  }
};

exports.artifact_view_all_Page = async (req, res) => {
  try {
    const results = await Artifact.find();
    res.render("artifacts", { title: "Artifact List", results });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

exports.artifact_detail_page = async (req, res) => {
  try {
    const result = await Artifact.findById(req.query.id);
    if (!result) return res.status(404).send("Artifact not found");
    res.render("artifactdetail", { title: "Artifact Detail", toShow: result });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

exports.artifact_create_Page = function (req, res) {
  try {
    res.render("artifactcreate", { title: "Create Artifact" });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

exports.artifact_update_Page = async function (req, res) {
  try {
    const result = await Artifact.findById(req.query.id);
    res.render("artifactupdate", { title: "Update Artifact", toShow: result });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

exports.artifact_delete_Page = async function (req, res) {
  try {
    const result = await Artifact.findById(req.query.id);
    res.render("artifactdelete", { title: "Delete Artifact", toShow: result });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};
