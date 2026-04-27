const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const puppeteerCtrl = require('../controllers/puppeteer');
const config = require('config');
const cfg = config.get('cfg');
const {
  assertPublicHttpUrl,
  parseScreenshotDimension
} = require('../lib/request-security');

const screenshotLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-8',
  legacyHeaders: false
});

router.post('/screenshot', screenshotLimiter, async function(req, res, next) {
  try {
    const defaultParams = require('../data/parameters');
    const url = await assertPublicHttpUrl(req.body.url);
    const option = {
      url,
      width: parseScreenshotDimension(req.body.width, defaultParams.option.width, 'width'),
      height: parseScreenshotDimension(req.body.height, defaultParams.option.height, 'height'),
      userAgent: defaultParams.option.userAgent,
      headers: defaultParams.option.headers
    };

    if (req.body.type === 'puppeteer' || req.body.type === 'horseman') {
      puppeteerCtrl.getWebPageScreenShot(option).then(redirectUrl => {
        res.redirect(redirectUrl);
      }).catch(e => {
        next(e);
      });
    } else if (req.body.type) {
      next(new Error('invalid type'));
    } else {
      next(new Error('type data is needed'));
    }
  } catch (e) {
    next(e);
  }
});

/* GET home page. */
router.get('/', function(req, res, next) {
  const defaultParams = require('../data/parameters');
  const data = Object.assign({}, cfg, defaultParams);

  res.render('index', data);
});

module.exports = router;
