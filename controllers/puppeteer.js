module.exports = (function () {
  const puppeteer = require('puppeteer');

  async function getWebPageScreenShot(option) {
    const browser = await puppeteer.launch();
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
  }

  return {
    getWebPageScreenShot
  }
})();

