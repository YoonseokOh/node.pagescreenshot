module.exports = (function () {
  const Horseman = require('node-horseman');

  function getWebPageScreenShot(url) {
    const horseman = new Horseman();
    const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36';
    const width = 1400;
    const height = 800;

    const parsedUrl = new URL(url);

    return horseman.open(url)
      .userAgent(userAgent)
      .viewport(width, height)
      .screenshot(`./public/images/${parsedUrl.hostname}.jpg`)
      .then(string => {
        let html = `<img src="/images/${parsedUrl.hostname}.jpg"/>`;

        return html;
      })
      .close();
  }

  return {
    getWebPageScreenShot
  }
})();
