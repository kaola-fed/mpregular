var page = {};
var events = require('./events');
var callHook = require('./call-hook');
var dataSync = require('./data-sync');

page.init = function init(vm) {
  var rootVM = vm.$root;
  if (!rootVM.$mp) {
    rootVM.$mp = {};
  }
  const mp = rootVM.$mp;

  if (vm !== rootVM) {
    callHook(vm, 'onLoad');
    callHook(vm, 'onReady');
    return;
  }

  Page({
    data: rootVM.data,
    // 生命周期函数--监听页面加载
    onLoad(options) {
      mp.page = this;
      mp.status = 'load';
      callHook(rootVM,'onLoad', options)
    },
    // 生命周期函数--监听页面初次渲染完成
    onReady(options) {
      mp.status = 'ready';
      callHook(rootVM,'onReady', options)
      dataSync.initDataToMP(rootVM);
      // rootVM.$update();
    },
    // 生命周期函数--监听页面显示
    onShow(options) {
      mp.status = 'show';
      callHook(rootVM,'onShow', options)
    },
    // 生命周期函数--监听页面隐藏
    onHide(options) {
      mp.status = 'hide';
      callHook(rootVM,'onHide', options)
    },
    // 生命周期函数--监听页面卸载
    onUnload(options) {
      mp.status = 'unload';
      callHook(rootVM,'onUnload', options)
    },
    // 页面相关事件处理函数--监听用户下拉动作
    onPullDownRefresh(options) {
      callHook(rootVM,'onPullDownRefresh', options)
    },
    // 页面上拉触底事件的处理函数
    onReachBottom(options) {
      callHook(rootVM,'onReachBottom', options)
    },
    // 用户点击右上角转发
    onShareAppMessage(options) {
      callHook(rootVM,'onShareAppMessage', options)
    },
    // 页面滚动触发事件的处理函数
    onPageScroll(options) {
      callHook(rootVM,'onPageScroll', options)
    },
    // 当前是 tab 页时，点击 tab 时触发
    onTabItemTap(options) {
      callHook(rootVM,'onTabItemTap', options)
    },
    proxyEvent(e) {
      events.proxyEvent(rootVM, e);
    }
  });
}

module.exports = page;