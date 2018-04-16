var page = {};
var eventProxy = require('./event-proxy');
var callHook = require('./call-hook');

page.init = function init($vm) {
  if (!$vm.$mp) {
    $vm.$mp = {};
  }
  const mp = $vm.$mp;

  Page({
    data: $vm.data,
    // 生命周期函数--监听页面加载
    onLoad: function(options) {
      mp.page = this;
      callHook($vm,'onLoad', options)
    },
    // 生命周期函数--监听页面初次渲染完成
    onReady(options) {
      callHook($vm,'onReady', options)
    },
    // 生命周期函数--监听页面显示
    onShow(options) {
      callHook($vm,'onShow', options)
    },
    // 生命周期函数--监听页面隐藏
    onHide(options) {
      callHook($vm,'onShow', options)
    },
    // 生命周期函数--监听页面卸载
    onUnload(options) {
      callHook($vm,'onUnload', options)
    },
    // 页面相关事件处理函数--监听用户下拉动作
    onPullDownRefresh(options) {
      callHook($vm,'onPullDownRefresh', options)
    },
    // 页面上拉触底事件的处理函数
    onReachBottom(options) {
      callHook($vm,'onReachBottom', options)
    },
    // 用户点击右上角转发
    onShareAppMessage(options) {
      callHook($vm,'onShareAppMessage', options)
    },
    // 页面滚动触发事件的处理函数
    onPageScroll(options) {
      callHook($vm,'onPageScroll', options)
    },
    // 当前是 tab 页时，点击 tab 时触发
    onTabItemTap(options) {
      callHook($vm,'onTabItemTap', options)
    },
    eventProxy(e) {
      eventProxy($vm, e);
    }
  });
}

module.exports = page;