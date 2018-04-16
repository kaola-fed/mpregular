module.exports = function($vm) {
  const mp = $vm.$mp;
  if (mp && mp.page) {
    mp.page.setData($vm.data);
  }
}