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

// GET one artifact by ID
exports.artifact_detail = async function (req, res) {
  console.log("Fetching detail for ID:", req.params.id);
  try {
    const result = await Artifact.findById(req.params.id);
    if (!result) {
      res.status(404).send(`{"error": "Document for ID ${req.params.id} not found"}`);
    } else {
      res.send(result);
    }
  } catch (error) {
    res.status(500).send(`{"error": "Error fetching artifact: ${error}"}`);
  }
};

exports.artifact_update_put = async function (req, res) {
  console.log(`🔄 Updating artifact ${req.params.id} with`, req.body);
  try {
    let toUpdate = await Artifact.findById(req.params.id);
    if (!toUpdate) {
      return res.status(404).send({ error: "Artifact not found" });
    }

    // Only update fields if provided
    if (req.body.name) toUpdate.name = req.body.name;
    if (req.body.age) toUpdate.age = req.body.age;
    if (req.body.origin) toUpdate.origin = req.body.origin;

    let result = await toUpdate.save();
    res.send(result);
  } catch (err) {
    res.status(500).send({ error: `${err}: Update for id ${req.params.id} failed` });
  }
};
