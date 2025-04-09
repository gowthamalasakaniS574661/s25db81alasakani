// API controller to describe available resources
exports.api = function (req, res) {
  res.write('[');
  res.write('{"resource":"artifacts", ');
  res.write('"verbs":["GET", "POST", "PUT", "DELETE"]}');
  res.write(']');
  res.send();
};
