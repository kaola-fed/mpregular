function getVM(rootVM, $k) {
  var path = $k.split(',').slice(1);
  var i = 0;
  var cursor = rootVM;
  while(cursor && cursor._children && path[i] !== undefined) {
    cursor = cursor._children[path[i]];
    i++;
  }
  return cursor;
}

module.exports = function proxyEvent(rootVM, e) {
  console.log('proxy event', e)

  var dataSet = e.target.dataset || {};
  var eventId = dataSet.eventId.split('-');
  var eventName = eventId[0];
  var vmPath = eventId[1];
  var vm = getVM(rootVM, vmPath);

  if (vm && eventName) {
    vm.$event = {
      _mp: e
    }
    vm[eventName] && vm[eventName](e);
  } else {
    cosnole.warn('event proxy error', vm, dataSet.eventId);
  }
  vm.$update();
}
