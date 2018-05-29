var page = require('./page');
var app = require('./app');
var dataSync = require('./data-sync');
var events = require('./events');
var wxParse = require('./wxparse');

module.exports = {
  initMP($vm, ...args) {
    var mpType = $vm.mpType || 'page';
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
    var proto = Regular.prototype;
    proto._addMPEventHandler = events.addEventHandler;
    proto._removeMPEventHandler = events.removeEventHandler;

    proto._updateMPData = dataSync.updateData;
    proto._updateMPFilter = dataSync.updateFilter;

    proto._initWxParse = wxParse.init;
    return Regular;
  }
}