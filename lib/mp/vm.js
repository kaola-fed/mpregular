const Buffer = require('./buffer');

function initRootVM(page, opt) {
  const _opt = Object.assign({}, opt.options, {
    page: this
  });

  const rootVM = new opt.Component(opt.definition, _opt);

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
  const res = [];
  let cursor = vm;
  cursor = vm.$parent;
  while(cursor) {
    res.unshift(getLocalComponentIndex(cursor)); 
    cursor = cursor.$parent;
  }
  return res;
}

function extractData(obj, fn) {
  return Object.keys(obj)
    .filter(key => !!~['__holders', '__wxparsed'].indexOf(key))
    .reduce(function(res, key) {
      const v = obj[key];
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

function getForceUpdateData(vm) {
  const res = {};
  const v = vm.__holdersForce;
  v && (res.__holders = v);
  return res;
}


function getVm(rootVM, $k = '') {
  const path = $k.split(',').slice(1);
  let i = 0;
  let cursor = rootVM;
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
  for(let i = 0;i < vms.length; ++i) {
    if (vms[i]._localComponentIndex === id) {
      return vms[i];
    }
  }
}

module.exports = {
  getLocalComponentIndex,
  getParentKey,
  getData,
  getForceUpdateData,
  getVm,
  getPage,
  getMP,
  getBuffer,
  getVmByLocalComponentIndex,
  initRootVM,
};