const Buffer = require('./buffer');

function initRootVM(mpVM, regularOptions) {
  const { Component, definition, options } = regularOptions;
  const page = mpVM;

  const _opt = Object.assign({}, options, {
    mpVM,
    $mp: {
      page,
      status: 'load',
      buffer: new Buffer(),
      options: page && page.options
    }
  });

  const rootVM = new Component(definition, _opt);

  return rootVM;
}

function getLocalComponentIndex(vm = {}) {
  if(vm._localComponentIndex === undefined) {
    if (vm.$root === vm) {
      vm._localComponentIndex = '0';
    }
  }
  return vm._localComponentIndex;
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
    .filter(key => !!~['__holders', '__wxparsed', '__indexMap'].indexOf(key))
    .reduce(function(res, key) {
      res[key] = obj[key];
      return res;
    }, {})
}

function getData(vm) {
  return Object.assign(
    {},
    extractData(vm)
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