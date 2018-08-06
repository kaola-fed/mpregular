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

  if (!page || !buffer || (vm && vm.$mp && vm.$mp.status === 'hide')) {
    return;
  }

  const dataBuffer = buffer.pop();
  let { data = {}, forceUpdateData = {} } = dataBuffer;

  const pageData = page.data.$root;

  Object.assign(data, forceUpdateData);

  if (data && !utils.isObjectEmpty(data)) {
    Object.keys(data).forEach(k => {
      const v = data[k];
      data[k] = v === undefined ? '' : v;
    });

    page.setData(data);
  }
}, 50);

const setData = (vm, data) => {
  const buffer = VM.getBuffer(vm);
  if (!buffer) {
    return;
  }

  if (data) {
    buffer.push(data);
  }
  throttleSetData(vm);
};

function updateData(vm) {
  vm = vm || this;
  const rootVM = vm.$root;

  if (!rootVM || rootVM.mpType === 'app') {
    return;
  }

  setData(vm);
}

function updateHolders(value, options = {}) {
  const vm = this;
  const {
    key = '__holders',
    id,
    force = false,
    extra = {},
    isList = false,
    track = '',
  } = options;

  if (id == undefined) {
    return;
  }

  const forceKey = `${key}Force`;

  const keys = [ id ];

  if (extra.__listInfo__) {
    const listIndexArray = utils.getListIndexArray(extra);
    if (listIndexArray.length > 0) {
      keys.push(listIndexArray.join('-'));
    }
  }
  const parsedKey = keys.join('-');

  if (isList) {
    let trackProp = track && track.split('.')[1];;

    if (_.typeOf(value) === 'array') {
      value = value.map(getTrackProp(trackProp));
    } else if(_.typeOf(value) === 'object') {
      value = Object.keys(value).reduce((res, k, i) => {
        res[k] = getTrackProp(trackProp)(value[k], i);
        return res;
      }, {});
    }
  }

  setHolderToMP(vm, `${key}.${parsedKey}`, value);
}

function setHolderToMP(vm, key, value) {
  vm = vm || this;
  const buffer = VM.getBuffer(vm);
  const ids = getVMIds(vm);
  const { $k, $kk, $p } = ids;

  buffer.push({
    data: {
      [`$root.${$k}.${key}`]: value != undefined ? value : ''
    }
  });
}

function getTrackProp(prop) {
  return function(obj, defaults) {
    if (prop && obj[prop] !== undefined) {
      return {
        [prop]: obj[prop]
      };
    }
    return defaults;
  }
}

function getVMIds(vm) {
  const $p = VM.getParentKey(vm).join(SPLITTER);
  const localComponentIndex = VM.getLocalComponentIndex(vm);
  const $k = ($p ? $p + SPLITTER : '') + localComponentIndex;

  return {
    $k,
    $kk: $k + SPLITTER, 
    $p
  };
}

function initVMToMP(vm) {
  vm = vm || this;
  const buffer = VM.getBuffer(vm);
  const ids = getVMIds(vm);
  const { $k, $kk, $p } = ids;

  buffer.push({
    data: {
      [`$root.${$k}.$k`]: $k,
      [`$root.${$k}.$kk`]: $kk,
      [`$root.${$k}.$p`]: $p,
      [`$root.${$k}.__indexMap`]: vm.__indexMap || ''
    }
  });
}

module.exports = {
  updateData,
  initVMToMP,
  updateHolders,
  setHolderToMP,
  setData,
};