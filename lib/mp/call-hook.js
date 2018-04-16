module.exports = function callHook(vm, hook, options) {
  if (vm[hook]) {
    vm[hook].call(vm, options);

    if (hook === 'onReady') {
      vm.$emit('$init')
      vm.init && vm.init.call(vm, options);
      vm.$emit("$afterInit");
    }
  }
}