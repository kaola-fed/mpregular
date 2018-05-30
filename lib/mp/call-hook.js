module.exports = function callHook(vm, hook, options) {
  var result;
  if (vm[hook]) {
    result = vm[hook].call(vm, options);
  }

  if (vm._children) {
    vm._children.forEach(function (child) {
      result = callHook(child, hook, options) || result;
    });
  }

  // page: onReady
  // app: onLaunch
  if (hook === 'onReady' || hook === 'onLaunch') {
    vm.$emit('$init')
    vm.init && vm.init.call(vm, options);
    vm.$emit("$afterInit");
  }

  if (hook === 'onUnload') {
    var rootVM = vm.$root;

    rootVM.destroy();
  }

  return result;
}