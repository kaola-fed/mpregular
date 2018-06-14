const Buffer = require('./buffer');

function initRootVM(page, opt) {
  var _opt = Object.assign({}, opt.options, {
    page: this
  });

  var rootVM = new opt.Component(opt.definition, _opt);

  rootVM.$mp = {
    page: page,
    status: 'load',
    buffer: new Buffer()
  };

  return rootVM;
}

function getLocalComponentIndex(vm = {}) {
  return vm._localComponentIndex || '0';
}

function getParentKey(vm) {
  var res = [];
  var cursor = vm;
  cursor = vm.$parent;
  while(cursor) {
    res.unshift(getLocalComponentIndex(cursor)); 
    cursor = cursor.$parent;
  }
  return res;
}

function extractData(obj, fn) {
  return Object.keys(obj)
    .filter(key => !!~['__class__', '__holders', '__wxparsed'].indexOf(key))
    .reduce(function(res, key) {
      var v = obj[key];
      res[key] = typeof fn === 'function' ? fn(v) : v;
      return res;
    }, {})
}

function getData(vm) {
  return Object.assign(
    {},
    extractData(vm)
    // extractData(vm.data),
    // extractData(vm.computed, function(v) {return v.get(vm)})
  )
}


function getVm(rootVM, $k = '') {
  var path = $k.split(',').slice(1);
  var i = 0;
  var cursor = rootVM;
  while(cursor && cursor._children && path[i] !== undefined) {
    cursor = getVmByLocalComponentIndex(cursor._children, path[i]);
    i++;
  }
  return cursor;
}

function getMP(vm) {
  if (!vm || !vm.$root || !vm.$root.$mp) {
    return;
  }

  return vm.$root.$mp;
}

function getBuffer(vm) {
  if (!vm || !vm.$root || !vm.$root.$mp || !vm.$root.$mp.buffer) {
    return;
  }

  return vm.$root.$mp.buffer;
}

function getPage(vm) {
  if (!vm || !vm.$root || !vm.$root.$mp) {
    return;
  }

  return vm.$root.$mp.page;
}

function getVmByLocalComponentIndex(vms, id) {
  for(var i = 0;i < vms.length; ++i) {
    if (vms[i]._localComponentIndex === id) {
      return vms[i];
    }
  }
}

module.exports = {
  getLocalComponentIndex,
  getParentKey,
  getData,
  getVm,
  getPage,
  getMP,
  getBuffer,
  getVmByLocalComponentIndex,
  initRootVM
};