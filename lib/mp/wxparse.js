const wxParse = require('../wxparse');

module.exports = {
  init() {
    const root = this.$root;
    if (!root.__useRHtml) {
      root.__useRHtml = true;
    }
  },
  install(vm) {
    if (!vm || !vm.$root || !vm.$root.$mp) {
      return;
    }
    
    const root = vm.$root;
    const page = root.$mp && root.$mp.page;
    page.wxParseImgLoad = function(e) {
      // wxParse.wxParseImgLoad();
      root.onWxParseImgLoad && root.onWxParseImgLoad(e)
    }
    page.wxParseImgTap = function(e) {
      root.onWxParseImgTap && root.onWxParseImgTap(e)
      // wxParse.wxParseImgTap.call(page, e)
    };
  }

}