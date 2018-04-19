var diff = require('../helper/diff');
var throttle = require('./throttle');
var DATA_ROOT = '$root';
var SPLITTER = ',';

var setData = throttle(function(vm, data) {
  var rootVM = vm.$root;
  var mp = rootVM.$mp;

  console.log('set data', vm, data)
  if (mp && mp.page) {
    var page = mp.page;
    page.setData(data);
  }
}, 50);

function getIndex(vm = {}) {
  var parent = vm.$parent;
  var children = parent && parent._children;
  if (children && children.length) {
    var i = children.indexOf(vm);
    return i !== -1 ? i : '0';
  }
  return '0'
}

function getComponentId(vm = {}) {
  return vm._componentId || '0';
}

function getParentKey(vm) {
  var res = [];
  var cursor = vm;
  cursor = vm.$parent;
  while(cursor) {
    res.unshift(getComponentId(cursor)); 
    cursor = cursor.$parent;
  }
  return res;
}

function getVMData(vm) {
  return Object.assign({}, vm.data);
}

function formatData(vm) {
  var $p = getParentKey(vm).join(SPLITTER);
  var $k = ($p ? $p + SPLITTER : '') + getComponentId(vm);
  var rootKey = DATA_ROOT + '.' + $k;
  var data = {}

  data[rootKey] = Object.assign({}, getVMData(vm), {
    $k: $k,
    $kk: $k + SPLITTER,
    $p: $p
  });

  return data;
}

function updateData(vm, data) {
  var rootVM = vm.$root;
  if (rootVM.$mp) {
    if (vm === rootVM) {
      updateAllData(vm);
    } else {
      data = data || formatData(vm);
      setData(vm, data);
    }
  }
}

function collectData(vm, res = {}) {
  var children = vm._children;
  if (children) {
    children.forEach(function(c) {
      collectData(c, res);
    });
  }
  return Object.assign(res, formatData(vm));
}

function updateAllData(vm) {
  var rootVM = vm.$root;
  var mp = rootVM.$mp;
  var page = mp.page;
  var data = collectData(vm);
  if (page && page.data.$root) {
    var updatedData = Object.keys(data)
      .filter((path) => {
        var newData = data[path],
          oldData = page.data.$root[path.replace(/^\$root\./, '')];
        return (!oldData && newData) || diff.diffObject(newData, oldData);
      })
      .reduce((res, path) => {
        res[path] = data[path];
        return res;
        // console.log(path, newData, oldData, res);
      }, {})
    setData(vm, updatedData);
  }
}

function initDataToMP(vm) {
  var data = collectData(vm);
  setData(vm, data);
  console.log('init data to mp', data);
}

module.exports = {
  updateData,
  initDataToMP
};