var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('randomitem', { title: 'A random item' });
});

module.exports = router;
