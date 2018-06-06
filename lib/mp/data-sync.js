var diff = require('../helper/diff');
var _ = require('../util');
var utils = require('./utils');
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
    page.setData(data);
  }
}, 75);


function formatData(vm) {
  var root = vm.$root;
  var rootData = root.$mp.page.data.$root;

  var $p = VM.getParentKey(vm).join(SPLITTER);
  var localComponentIndex = VM.getLocalComponentIndex(vm);
  var $k = ($p ? $p + SPLITTER : '') + localComponentIndex;
  var dataKey = DATA_ROOT + '.' + $k;
  var data = {};
  var vmData = VM.getData(vm);

  data[dataKey] = Object.assign({}, vmData, {
    $k: $k,
    $kk: $k + SPLITTER,
    $p: $p
  });

  delete data[dataKey].$event;

  try {
    var path = dataKey.replace('$root.', '');
    if (rootData && rootData[path]) {

      var oldData = rootData[path];
      var newData = data[dataKey];
      var keys = _.keys(newData);

      var temp = {};
      var updated = false;

      keys.forEach((k, i) => {
        if (utils.diff(newData[k], oldData[k])) {
          updated = true;
          temp[`${dataKey}.${k}`] = newData[k] || '';
        }
      });

      if (updated) {
        data = temp;
      } else {
        data = null;
      }
    }
  } catch(err) { }

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

function updateHolders(value, options = {}) {
  var key = options.key || '__holders';
  var id = options.id || '0';
  if (!this.data[key]) {
    this.data[key] = {};
  }

  var keys = [id];
  var extra = options.extra || {};
  if (extra.__listInfo__) {
    var listIndexArray = _.getListIndexArray(extra);
    if (listIndexArray.length > 0) {
      keys.push(listIndexArray.join('-'));
    }
  }
  var parsedKey = keys.join('-');

  this.data[key][parsedKey] = value;
}

module.exports = {
  updateData,
  initDataToMP,
  updateHolders
};