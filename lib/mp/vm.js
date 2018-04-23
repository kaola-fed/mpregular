function getLocalComponentIndex(vm = {}) {
  return vm._localComponentIndex || '0';
}

function getParentKey(vm) {
  var res = [];
  var cursor = vm;
  cursor = vm.$parent;
  while(cursor) {
    res.unshift(getLocalComponentIndex(cursor)); 
    cursor = cursor.$parent;
  }
  return res;
}

function extractData(obj, fn) {
  return Object.keys(obj)
    .reduce(function(res, key) {
      var v = obj[key];
      res[key] = typeof fn === 'function' ? fn(v) : v;
      return res;
    }, {})
}

function getData(vm) {
  return Object.assign(
    {},
    extractData(vm.data),
    extractData(vm.computed, function(v) {return v.get(vm)})
  )
}


function getVm(rootVM, $k) {
  var path = $k.split(',').slice(1);
  var i = 0;
  var cursor = rootVM;
  while(cursor && cursor._children && path[i] !== undefined) {
    cursor = getVmByLocalComponentIndex(cursor._children, path[i]);
    i++;
  }
  return cursor;
}

function getVmByLocalComponentIndex(vms, id) {
  for(var i = 0;i < vms.length; ++i) {
    if (vms[i]._localComponentIndex === id) {
      return vms[i];
    }
  }
}

module.exports = {
  getLocalComponentIndex,
  getParentKey,
  getData,
  getVm,
  getVmByLocalComponentIndex
};