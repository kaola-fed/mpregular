function walkInTree(vm, fn, options = {}) {
  let result;
  let { bottomToTop = false } = options;

  if (!bottomToTop) {
    result = fn(vm);
  }

  if (vm._children) {
    for(let i = vm._children.length - 1; i >= 0; i--) {
      let child = vm._children[i];
      result = walkInTree(child, fn, options) || result;
    }
    // vm._children.forEach(function (child) {
    //   result = walkInTree(child, fn, options) || result;
    // });
  }

  if (bottomToTop) {
    result = fn(vm);
  }

  return result;
}

module.exports = function callHook(vm, hook, options) {
  if (!vm) {
    return;
  }
  
  let result;

  if (hook === 'onReady') {
    result = walkInTree(vm, function(_vm) {
      _vm.$emit("$init");
      _vm.init && _vm.init( _vm.data );
      _vm.$emit("$afterInit");

      _vm[hook] && _vm[hook].call(_vm, options);
    }, { bottomToTop: true } );
  } else  {
    result = walkInTree(vm, function(_vm) {
      return _vm[hook] && _vm[hook].call(_vm, options);
    });
  }

  if (hook === 'onUnload') {
    const rootVM = vm.$root;
    rootVM.destroy();
  }

  return result;
}