var page = require('./page');
var app = require('./app');

module.exports = {
  initMP($vm) {
    var mpType = $vm.mpType || 'page';
    if (mpType === 'app') {
      app.init($vm);
    } else {
      page.init($vm);
    }
  },
  updateData: require('./update-data')
}