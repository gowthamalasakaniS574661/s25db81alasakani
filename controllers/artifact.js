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
    res.json(artifact);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

exports.artifact_create_post = async (req, res) => {
  try {
    const artifact = new Artifact(req.body);
    await artifact.save();
    res.redirect("/artifacts");
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

exports.artifact_update_put = async (req, res) => {
  try {
    const result = await Artifact.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

exports.artifact_delete = async (req, res) => {
  try {
    const result = await Artifact.findByIdAndDelete(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
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
