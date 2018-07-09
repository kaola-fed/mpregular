const page = require('./page');
const app = require('./app');
const dataSync = require('./data-sync');
const events = require('./events');
const wxParse = require('./wxparse');

module.exports = {
  initMP($vm, ...args) {
    const mpType = $vm.mpType || 'page';
    if (mpType === 'app') {
      return app.init($vm, ...args);
    } else {
      return page.init($vm, ...args);
    }
  },
  updateData: dataSync.updateData,
  initDataToMP: dataSync.initDataToMP,
  proxyEvent: events.proxyEvent,
  addEventHandler: events.addEventHandler,
  install(Regular) {
    const proto = Regular.prototype;
    proto._addMPEventHandler = events.addEventHandler;
    proto._removeMPEventHandler = events.removeEventHandler;

    proto._updateMPData = dataSync.updateData;
    proto._updateMPHolders = dataSync.updateHolders;

    proto._initWxParse = wxParse.init;
    return Regular;
  }
}