module.exports = (function () {
  const puppeteer = require('puppeteer');

  async function getWebPageScreenShot(option) {
    try {
      // args for debian(ubuntu) dependencies
      // refer: https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md
      const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
      const page = await browser.newPage();

      const viewport = {
        width: option.width,
        height: option.height
      };

      return page.setUserAgent(option.userAgent)
        .then(() => {
          return page.setViewport(viewport).then(async() => {
            await page.goto(option.url.href);
            await page.screenshot({path: `./public/images/${option.url.hostname}.jpg`});

            await browser.close();

            return Promise.resolve(`/images/${option.url.hostname}.jpg`);
          })
        });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  return {
    getWebPageScreenShot
  }
})();

