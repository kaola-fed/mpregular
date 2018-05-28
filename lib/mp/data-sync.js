var diff = require('../helper/diff');
var _ = require('../util');
var throttle = require('./throttle');
var VM = require('./vm');
var DATA_ROOT = '$root';
var SPLITTER = ',';

let time = 0;

var setData = throttle(function(vm, data) {
  var rootVM = vm.$root;
  var mp = rootVM.$mp;

  if (mp && mp.page) {
    var page = mp.page;
    // let start = Date.now();
    page.setData(data);
    // time += Date.now() - start;
    // console.log(time, data)
  }
}, 50);

function diffs(pre, cur, dep = 1) {
  if (dep > 5) {
    return true;
  }
  if (pre !== cur && (pre == undefined || cur == undefined)) {
    return true;
  }

  if (pre === cur && pre == undefined ) {
    return false;
  }

  var type = typeof cur[k];


  var preKeys = Object.keys(pre);
  var curKeys = Object.keys(cur);

  if (preKeys.length !== curKeys.length) {
    return true;
  }

  for (var i = 0; i < preKeys.length; ++i) {
    var k = preKeys[i];
    if (!~curKeys.indexOf(k)) {
      return true;
    }

    var type = typeof cur[k];
   
    if (type !== 'object' && cur[k] !== pre[k]) {
      return true;
    }

    if (type === 'object' && diffs(pre[k], cur[k], dep + 1)) {
      return true;
    }
  }

  return false;
}

function formatData(vm) {
  var root = vm.$root;
  var rootData = root.$mp.page.data.$root;

  var $p = VM.getParentKey(vm).join(SPLITTER);
  var localComponentIndex = VM.getLocalComponentIndex(vm);
  var $k = ($p ? $p + SPLITTER : '') + localComponentIndex;
  var rootKey = DATA_ROOT + '.' + $k;
  var data = {};
  var vmData = VM.getData(vm);

  data[rootKey] = Object.assign({}, vmData, {
    $k: $k,
    $kk: $k + SPLITTER,
    $p: $p
  });

  var path = rootKey.replace('$root.', '');
  if (rootData && rootData[path]) {
    var s = diffs(rootData[path], data[rootKey])
    if (!s) {
      return null;
    }
  }

  delete data[rootKey].$event;

  return data;
}


function updateData(vm, data) {
  vm = vm || this;
  var rootVM = vm.$root;
  if (rootVM && rootVM.$mp && rootVM.$mp.page) {
    if (vm === rootVM) {
      updateAllData(vm);
    } else {
      data = data || formatData(vm);
      data && setData(vm, data);
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
      .reduce((res, path) => {
        res[path] = data[path];
        return res;
      }, {});

    setData(vm, updatedData);
  }
}

function initDataToMP(vm) {
  var data = collectData(vm);
  setData(vm, data);
  // console.log('init data to mp', data);
}

module.exports = {
  updateData,
  initDataToMP
};