const express = require('express');
const router = express.Router();
const horsemanCtrl = require('../controllers/horseman');
const puppeteerCtrl = require('../controllers/puppeteer');
const config = require('config');
const cfg = config.get('cfg');

router.post('/screenshot', function(req, res, next) {
  try {
    const defaultParams = require('../data/parameters');
    const option = {
      url: new URL(req.body.url),
      width: Number(req.body.width) || defaultParams.option.width,
      height: Number(req.body.height) || defaultParams.option.height,
      userAgent: defaultParams.option.userAgent
    };

    if (req.body.type) {
      if (req.body.type === 'puppeteer') {
        puppeteerCtrl.getWebPageScreenShot(option).then(redirectUrl => {
          res.redirect(redirectUrl);
        });
      } else if (req.body.type === 'horseman') {
        horsemanCtrl.getWebPageScreenShot(option).then(redirectUrl => {
          res.redirect(redirectUrl);
        });
      } else {
        next(new Error('invalid type'));
      }
    } else {
      next(new Error('type data is needed'));
    }
  } catch (e) {
    next(e)
  }
});

/* GET home page. */
router.get('/', function(req, res, next) {
  const defaultParams = require('../data/parameters');
  const data = Object.assign({}, cfg, defaultParams);

  res.render('index', data);
});

module.exports = router;
