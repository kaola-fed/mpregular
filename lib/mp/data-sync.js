var DATA_ROOT = '$root';
var SPLITTER = ',';

function getIndex(vm = {}) {
  var parent = vm.$parent;
  var children = parent && parent._children;
  if (children && children.length) {
    var i = children.indexOf(vm);
    return i !== -1 ? i : '0';
  }
  return '0'
}

function getParentKey(vm) {
  var res = [];
  var cursor = vm;
  cursor = vm.$parent;
  while(cursor) {
    res.unshift(getIndex(cursor)); 
    cursor = cursor.$parent;
  }
  return res;
}

function getVMData(vm) {
  return Object.assign({}, vm.data);
}

function formatData(vm) {
  var $p = getParentKey(vm).join(SPLITTER);
  var $k = ($p ? $p + SPLITTER : '') + getIndex(vm);
  var rootKey = DATA_ROOT + '.' + $k;
  var data = {};

  data[rootKey] = Object.assign(getVMData(vm), {
    $k: $k,
    $kk: $k + SPLITTER,
    $p: $p
  })

  return data;
}

function updateData(vm, data) {
  data = data || formatData(vm);
  setData(vm, data);
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

function initDataToMP(vm) {
  var data = collectData(vm);
  setData(vm, data);
  console.log('init data to mp', data);
}

function setData(vm, data) {
  var rootVM = vm.$root;
  var mp = rootVM.$mp;
  if (mp && mp.page) {
    mp.page.setData(data);
  }
}

module.exports = {
  updateData,
  initDataToMP
};