var callHook = require('./call-hook');
var app = {};

var appVMRoot;

app.init = function init($vm) {
  if (!appVMRoot) {
    appVMRoot = $vm;
  }

  if (!appVMRoot.$mp) {
    appVMRoot.$mp = {};
  }
  const mp = $vm.$mp;

  App({
    data: $vm.data,
    //	Function	生命周期函数--监听小程序初始化	当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
    onLaunch(options) {
      callHook(appVMRoot,'onLaunch', options);
    },
    //	Function	生命周期函数--监听小程序显示	当小程序启动，或从后台进入前台显示，会触发 onShow
    onShow(options) {
      callHook(appVMRoot,'onShow', options);
    },
    //	Function	生命周期函数--监听小程序隐藏	当小程序从前台进入后台，会触发 onHide
    onHide() {
      callHook(appVMRoot,'onHide');
    },
    //	Function	错误监听函数	当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
    onError(msg) {
      callHook(appVMRoot,'onError', msg);
    },
    //	Function	页面不存在监听函数	当小程序出现要打开的页面不存在的情况，会带上页面信息回调该函数，详见下文
    onPageNotFound(options) {
      callHook(appVMRoot,'onPageNotFound', options);
    },
    eventProxy: function (e) {
      const eventId = e.target.dataset.eventId;
      if (eventId) {
        $vm.$event = {
          _mp: e
        }
        $vm[eventId](e);
      }
    }
  });
};

module.exports = app;