var page = require('./page');
var app = require('./app');
var updateData = require('./update-data');

module.exports = {
  initMP($vm) {
    var mpType = $vm.mpType || 'page';
    if (mpType === 'app') {
      app.init($vm);
    } else {
      page.init($vm);
    }
  },
  updateData: updateData
}