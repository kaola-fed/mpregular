var DATA_ROOT = '$root';
var LABEL = '0';
var SPLITTER = ',';

function getParentKey(vm) {
  var res = [];
  var cursor = vm;
  cursor = vm.$parent;
  while(cursor) {
    res.unshift(LABEL); 
    cursor = cursor.$parent;
  }
  return res;
}

function getVMData(vm) {
  return Object.assign({}, vm.data);
}

function formatData(vm) {
  var $p = getParentKey(vm).join(SPLITTER);
  var $k = ($p ? $p + SPLITTER : '') + LABEL;
  var rootKey = DATA_ROOT + '.' + $k;
  var data = {};

  data[rootKey] = Object.assign(getVMData(vm), {
    $k: $k,
    $kk: $k + SPLITTER,
    $p: $p
  })

  return data;
}

function updateData(vm) {
  var rootVM = vm.$root;
  var mp = rootVM.$mp;
  if (mp && mp.page) {
    var data = formatData(vm);
    mp.page.setData(data);
    console.log('update: ', data, mp.page)
    // mp.page.setData(vm.data);
  }
}

module.exports = updateData;