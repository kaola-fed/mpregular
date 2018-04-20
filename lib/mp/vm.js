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

function getData(vm) {
  return Object.assign({}, vm.data);
}


function getVm(rootVM, $k) {
  var path = $k.split(',').slice(1);
  var i = 0;
  var cursor = rootVM;
  while(cursor && cursor._children && path[i] !== undefined) {
    cursor = getVmByComponentId(cursor._children, path[i]);
    i++;
  }
  return cursor;
}

function getVmByComponentId(vms, id) {
  for(var i = 0;i < vms.length; ++i) {
    if (vms[i]._componentId === id) {
      return vms[i];
    }
  }
}

module.exports = {
  getComponentId,
  getParentKey,
  getData,
  getVm,
  getVmByComponentId
};