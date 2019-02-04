module.exports = (function () {
  const Horseman = require('node-horseman');

  function getWebPageScreenShot(option) {
    try {
      const horseman = new Horseman();

      return horseman.open(option.url.href)
        .userAgent(option.userAgent)
        .headers(option.headers)
        .viewport(option.width, option.height)
        .screenshot(`./public/images/${option.url.hostname}.jpg`)
        .then(() => {
          return `/images/${option.url.hostname}.jpg`;
        })
        .close();
    } catch (e) {
      return Promise.reject(e);
    }
  }

  return {
    getWebPageScreenShot
  }
})();
