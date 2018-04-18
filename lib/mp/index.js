var page = require('./page');
var app = require('./app');
var dataSync = require('./data-sync');
var proxyEvent = require('./proxy-event');

module.exports = {
  initMP($vm) {
    var mpType = $vm.mpType || 'page';
    if (mpType === 'app') {
      app.init($vm);
    } else {
      page.init($vm);
    }
  },
  updateData: dataSync.updateData,
  initDataToMP: dataSync.initDataToMP,
  proxyEvent
}