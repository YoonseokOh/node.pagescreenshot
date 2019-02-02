var express = require('express');
var router = express.Router();
var horsemanCtrl = require('../controllers/horseman');

router.post('/capture', function(req, res, next) {
  var url = req.body.url;

  horsemanCtrl.getWebPageScreenShot(url).then(result => {
    res.send(result);
  });
});

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log( req.header('user-agent'));

  res.render('index', { title: 'Express' });
});

module.exports = router;
