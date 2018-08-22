var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'My fucking awesome list app', description: 'Using Vue.js as client' });
});

module.exports = router;
