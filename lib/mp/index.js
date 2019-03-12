const page = require('./page');
const app = require('./app');
const dataSync = require('./data-sync');
const events = require('./events');
const createErrorHandlingFn = require('./error-handling');

module.exports = {
  initMP($vm, ...args) {
    const mpType = $vm.mpType || 'page';
    if (mpType === 'app') {
      return app.init($vm, ...args);
    } else {
      return page.init($vm, ...args);
    }
  },
  install(Regular) {
    const proto = Regular.prototype;
    proto._addMPEventHandler = events.addEventHandler;
    proto._removeMPEventHandler = events.removeEventHandler;

    dataSync.install(proto)

    proto._errorHandling = createErrorHandlingFn(Regular);
    return Regular;
  }
}