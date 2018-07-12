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

  const dataBuffer = buffer.pop();
  let { data = {}, forceUpdateData = {} } = dataBuffer;

  const pageData = page.data.$root;

  try {
    let obj = Object.keys(data).reduce((res, dataKey) => {
      let temp = {};
      const path = dataKey.replace('$root.', '');
      if (pageData && pageData[path]) {
        const oldData = utils.flatten(pageData[path], 2);
        const newData = utils.flatten(data[dataKey], 2);
        temp = utils.getDiffProperty(newData, oldData);
        temp = utils.addPrefixToProperty(temp, `${dataKey}.`);
      } else {
        temp = data[dataKey];
        temp = utils.addPrefixToProperty(temp, `${dataKey}.`);
      }
      Object.assign(res, temp);
      return res;
    }, {});
    data = obj;
  } catch(err) {
    console.error('diff error', err)
  }

  Object.assign(data, forceUpdateData);

  if (data && !utils.isObjectEmpty(data)) {
    Object.keys(data).forEach(k => {
      const v = data[k];
      data[k] = v === undefined ? '' : v;
    });

    page.setData(data);
    console.log(dataBuffer, data)
  }
// TODO: leadingDelay 存在问题
}, 50, { leading: false });

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

  // const pageData = page.data.$root;

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

  const vmForceUpdateData = VM.getForceUpdateData(vm);
  let forceUpdateData = {};
  if (!utils.isObjectEmpty(vmForceUpdateData)) {
    forceUpdateData = utils.flatten(vmForceUpdateData, 2);
    forceUpdateData = utils.addPrefixToProperty(forceUpdateData, `${dataKey}.`);
  }

  return {
    data,
    forceUpdateData,
  };
}


function updateData(vm) {
  vm = vm || this;
  const rootVM = vm.$root;

  if (!rootVM || rootVM.mpType === 'app') {
    return;
  }

  const page = VM.getPage(vm);

  if (page) {
    if (vm === rootVM) {
      updateAllData(vm);
    } else {
      const data = formatData(vm) || {};
      setData(vm, data);
    }
  }
}

function collectData(vm, res = {}) {
  if (!res.data) {
    res.data = {};
  }
  if (!res.forceUpdateData) {
    res.forceUpdateData = {};
  }

  const children = vm._children;
  if (children) {
    children.forEach(function(c) {
      collectData(c, res);
    });
  }
  const collectedData = formatData(vm);
  const { data = {}, forceUpdateData = {} } = collectedData;
  Object.assign(res.data, data);
  Object.assign(res.forceUpdateData, forceUpdateData);
  return res;
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

  if (force) {
    !this[forceKey] && (this[forceKey] = {});
    this[forceKey][parsedKey] = value;
  } else {
    !this[key] && (this[key] = {});
    this[key][parsedKey] = value;
  }
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

module.exports = {
  updateData,
  initDataToMP,
  updateHolders
};