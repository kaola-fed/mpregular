module.exports = function callHook(vm, hook, options) {
  if (!vm) {
    return;
  }
  
  var result;
  if (vm[hook]) {
    result = vm[hook].call(vm, options);
  }

  if (vm._children) {
    vm._children.forEach(function (child) {
      result = callHook(child, hook, options) || result;
    });
  }

  if (hook === 'onUnload') {
    var rootVM = vm.$root;

    rootVM && rootVM.destroy();
  }

  return result;
}