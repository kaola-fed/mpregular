const diff = require('../helper/diff');
const _ = require('../util');
const utils = require('./utils');
const throttle = require('./throttle');
const VM = require('./vm');
const DATA_ROOT = '$root';
const SPLITTER = ',';

let time = 0;

const throttleSetData = throttle((vm) => {
  const page = VM.getPage(vm);
  const buffer = VM.getBuffer(vm);

  if (!page || !buffer) {
    return;
  }

  const data = buffer.pop();
  page.setData(data);
}, 50);

const setData = (vm, data) => {
  const buffer = VM.getBuffer(vm);
  if (!buffer) {
    return;
  }

  buffer.push(data);
  throttleSetData(vm);
};

function formatData(vm) {
  const page = VM.getPage(vm);
  if (!page) {
    return;
  }

  const pageData = page.data.$root;

  const $p = VM.getParentKey(vm).join(SPLITTER);
  const localComponentIndex = VM.getLocalComponentIndex(vm);
  const $k = ($p ? $p + SPLITTER : '') + localComponentIndex;
  const dataKey = DATA_ROOT + '.' + $k;
  const vmData = VM.getData(vm);

  let data = {};

  data[dataKey] = Object.assign({}, vmData, {
    $k: $k,
    $kk: $k + SPLITTER,
    $p: $p
  });

  delete data[dataKey].$event;

  try {
    const path = dataKey.replace('$root.', '');
    if (pageData && pageData[path]) {
      const oldData = utils.flatten(pageData[path], 2);
      const newData = utils.flatten(data[dataKey], 2);
      data = utils.getDiffProperty(newData, oldData, dataKey);
      data = utils.addPrefixToProperty(data, `${dataKey}.`);
    }
  } catch(err) {
    console.error('diff error', err)
  }

  return data;
}


function updateData(vm, data) {
  vm = vm || this;
  const rootVM = vm.$root;
  const page = VM.getPage(vm);

  if (page) {
    if (vm === rootVM) {
      updateAllData(vm);
    } else {
      data = data || formatData(vm);
      data && setData(vm, data);
    }
  }
}

function collectData(vm, res = {}) {
  const children = vm._children;
  if (children) {
    children.forEach(function(c) {
      collectData(c, res);
    });
  }
  return Object.assign(res, formatData(vm));
}

function updateAllData(vm) {
  const page = VM.getPage(vm);
  if (!page) {
    return;
  }

  const data = collectData(vm);
  const updatedData = Object.keys(data)
    .reduce((res, path) => {
      res[path] = data[path];
      return res;
    }, {});

  setData(vm, updatedData);
}

function initDataToMP(vm) {
  const data = collectData(vm);
  setData(vm, data);
}

function updateHolders(value, options = {}) {
  const key = options.key || '__holders';
  const id = options.id || '0';
  if (!this[key]) {
    this[key] = {};
  }

  const keys = [id];
  const extra = options.extra || {};
  if (extra.__listInfo__) {
    const listIndexArray = _.getListIndexArray(extra);
    if (listIndexArray.length > 0) {
      keys.push(listIndexArray.join('-'));
    }
  }
  const parsedKey = keys.join('-');

  this[key][parsedKey] = value;
}

module.exports = {
  updateData,
  initDataToMP,
  updateHolders
};