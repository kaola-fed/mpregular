var wxParse = require('../wxparse');

module.exports = {
  init() {
    var root = this.$root;
    if (!root.__useRHtml) {
      root.__useRHtml = true;
    }
  },
  install(vm) {
    if (!vm) {
      return;
    }
    
    var root = vm.$root;
    var page = root.$mp && root.$mp.page;
    page.wxParseImgLoad = wxParse.wxParseImgLoad;
    page.wxParseImgTap = wxParse.wxParseImgTap;
  }

}