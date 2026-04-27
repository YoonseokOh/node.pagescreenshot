module.exports = (function () {
  const fs = require('fs/promises');
  const path = require('path');
  const puppeteer = require('puppeteer');
  const { assertPublicHttpUrl } = require('../lib/request-security');

  async function getWebPageScreenShot(option) {
    let browser;

    try {
      const launchArgs = process.env.PUPPETEER_NO_SANDBOX === 'true'
        ? ['--no-sandbox', '--disable-setuid-sandbox']
        : [];

      browser = await puppeteer.launch({
        headless: true,
        args: launchArgs,
      });

      const page = await browser.newPage();

      const viewport = {
        width: option.width,
        height: option.height
      };

      await Promise.all([
        page.setExtraHTTPHeaders(option.headers || {}),
        page.setUserAgent(option.userAgent),
        page.setViewport(viewport)
      ]);

      await page.setRequestInterception(true);
      page.on('request', async(request) => {
        try {
          const requestUrl = request.url();

          if (/^(about|blob|data):/.test(requestUrl)) {
            request.continue();
            return;
          }

          await assertPublicHttpUrl(requestUrl);
          request.continue();
        } catch (e) {
          request.abort();
        }
      });

      await page.goto(option.url.href, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      const imagesDir = path.join(__dirname, '../public/images');
      const fileName = `${option.url.hostname.replace(/[^a-z0-9.-]/gi, '_')}.jpg`;
      const filePath = path.join(imagesDir, fileName);

      await fs.mkdir(imagesDir, { recursive: true });
      await page.screenshot({ path: filePath, type: 'jpeg', quality: 90 });

      return `/images/${fileName}`;
    } catch (e) {
      return Promise.reject(e);
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  return {
    getWebPageScreenShot
  }
})();
