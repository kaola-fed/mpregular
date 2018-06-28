function walkInTree(vm, fn, bottomToTop) {
  let result;


  if (!bottomToTop) {
    result = fn(vm);
  }

  if (vm._children) {
    vm._children.forEach(function (child) {
      result = walkInTree(child, fn) || result;
    });
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
  } else if (hook === 'onUnload') {
    const rootVM = vm.$root;
    rootVM && rootVM.destroy();
  } else  {
    result = walkInTree(vm, function(_vm) {
      return _vm[hook] && _vm[hook].call(_vm, options);
    });
  }

  return result;
}