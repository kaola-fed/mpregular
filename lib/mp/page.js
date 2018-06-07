var page = {};
var events = require('./events');
var callHook = require('./call-hook');
var dataSync = require('./data-sync');
var wxParse = require('./wxparse');
var VM = require('./vm');

page.init = function init(vm, opt) {
  Page({
    // 生命周期函数--监听页面加载
    data: {
      $root: {}
    },
    onLoad(options) {
      var rootVM = this.rootVM = VM.initRootVM(this, opt);

      wxParse.install(rootVM);

      callHook(rootVM,'onLoad', options)
    },
    // 生命周期函数--监听页面初次渲染完成
    onReady(options) {
      var rootVM = this.rootVM;
      var mp = rootVM.$mp;

      mp.status = 'ready';
      callHook(rootVM,'onReady', options)
      dataSync.initDataToMP(rootVM);
    },
    // 生命周期函数--监听页面显示
    onShow(options) {
      var rootVM = this.rootVM;
      var mp = rootVM.$mp;

      mp.status = 'show';
      callHook(rootVM,'onShow', options)
    },
    // 生命周期函数--监听页面隐藏
    onHide(options) {
      var rootVM = this.rootVM;
      var mp = rootVM.$mp;

      mp.status = 'hide';
      callHook(rootVM,'onHide', options)
    },
    // 生命周期函数--监听页面卸载
    onUnload(options) {
      var rootVM = this.rootVM;
      var mp = rootVM.$mp;

      mp.status = 'unload';
      callHook(rootVM,'onUnload', options)
    },
    // 页面相关事件处理函数--监听用户下拉动作
    onPullDownRefresh(options) {
      var rootVM = this.rootVM;

      callHook(rootVM,'onPullDownRefresh', options)
    },
    // 页面上拉触底事件的处理函数
    onReachBottom(options) {
      var rootVM = this.rootVM;

      callHook(rootVM,'onReachBottom', options)
    },
    // 用户点击右上角转发
    onShareAppMessage(options) {
      var rootVM = this.rootVM;

      return callHook(rootVM,'onShareAppMessage', options);
    },
    // 页面滚动触发事件的处理函数
    onPageScroll(options) {
      var rootVM = this.rootVM;

      callHook(rootVM,'onPageScroll', options)
    },
    // 当前是 tab 页时，点击 tab 时触发
    onTabItemTap(options) {
      var rootVM = this.rootVM;

      callHook(rootVM,'onTabItemTap', options)
    },
    proxyEvent(e) {
      var rootVM = this.rootVM;

      events.proxyEvent(rootVM, e);
    }
  });
}

module.exports = page;