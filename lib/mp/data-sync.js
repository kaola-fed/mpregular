var diff = require('../helper/diff');
var throttle = require('./throttle');
var VM = require('./vm');
var DATA_ROOT = '$root';
var SPLITTER = ',';

var setData = throttle(function(vm, data) {
  var rootVM = vm.$root;
  var mp = rootVM.$mp;

  if (mp && mp.page) {
    var page = mp.page;
    page.setData(data);
  }
}, 50);

function formatData(vm) {
  var $p = VM.getParentKey(vm).join(SPLITTER);
  var localComponentIndex = VM.getLocalComponentIndex(vm);
  var $k = ($p ? $p + SPLITTER : '') + localComponentIndex;
  var rootKey = DATA_ROOT + '.' + $k;
  var data = {}

  data[rootKey] = Object.assign({}, VM.getData(vm), {
    $k: $k,
    $kk: $k + SPLITTER,
    $p: $p
  });

  delete data[rootKey].$event;

  return data;
}

function updateData(vm, data) {
  vm = vm || this;
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
        var key = path.replace(/^\$root\./, ''),
        newData = data[path],
          oldData = page.data.$root[key];
        return (!oldData && newData) || diff.diffObject(newData, oldData);
      })
      .reduce((res, path) => {
        res[path] = data[path];
        return res;
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