module.exports = function callHook(vm, hook, options) {
  if (vm[hook]) {
    vm[hook].call(vm, options);

    // page: onReady
    // app: onLaunch
    if (hook === 'onReady' || hook === 'onLaunch') {
      vm.$emit('$init')
      vm.init && vm.init.call(vm, options);
      vm.$emit("$afterInit");
    }
  }
}