module.exports = (function () {
  const Horseman = require('node-horseman');

  function getWebPageScreenShot(option) {
    const horseman = new Horseman();

    return horseman.open(option.url.href)
      .userAgent(option.userAgent)
      .viewport(option.width, option.height)
      .screenshot(`./public/images/${option.url.hostname}.jpg`)
      .then(() => {
        return `/images/${option.url.hostname}.jpg`;
      })
      .close();
  }

  return {
    getWebPageScreenShot
  }
})();
