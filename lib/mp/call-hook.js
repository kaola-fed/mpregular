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
  }

  if (bottomToTop) {
    result = fn(vm);
  }

  return result;
}

function doCallHook(vm, hook, options) {
  try {
    return vm[hook] && vm[hook].call(vm, options);
  } catch (err) {
    vm._errorHandling(`hook:${hook}`, err, vm);
  }
}

module.exports = function callHook(vm, hook, options) {
  if (!vm) {
    return;
  }
  
  let result;

  if (hook === 'onReady') {
    result = walkInTree(vm, function(_vm) {
      _vm.$emit("$init");
      try {
        _vm.init && _vm.init( _vm.data );
      } catch(err) {
        _vm._errorHandling(`hook:init`, err, _vm);
      }
      _vm.$emit("$afterInit");

      doCallHook(_vm, hook, options);
    }, { bottomToTop: true } );
  } else  {
    result = walkInTree(vm, function(_vm) {
      return doCallHook(_vm, hook, options);
    });
  }

  if (hook === 'onUnload') {
    const rootVM = vm.$root;
    rootVM.destroy();
  }

  return result;
}