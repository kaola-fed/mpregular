var VM = require('./vm');

module.exports = function proxyEvent(rootVM, e) {
  var dataSet = e.target.dataset || {};
  var eventId = dataSet.eventId;
  var $k = dataSet.k;

  var vm = VM.getVm(rootVM, $k);
  var type = e.type;

  var eventHandlers = vm.__eventHandlers;

  if (eventHandlers) {
    var handlerMap = eventHandlers[eventId];
    var value;
    if (type === 'tap') {
      value = handlerMap['tap'] || handlerMap['click'];
    } else {
      value = handlerMap[EVENT_MAP[type]];
    }

    if (value) {
      vm.data.$event = e;
      value.get.call(vm, vm)
      vm.data.$event = undefined;
      vm.$update();
    }
  }
}

const EVENT_MAP = {
  tap: 'click',
  touchstart: 'touchstart',
  touchmove: 'touchmove',
  touchcancel: 'touchcancel',
  touchend: 'touchend',
  longtap: 'longtap',
  input: 'input',
  change: 'change',
  submit: 'submit',
  blur: 'blur',
  focus: 'focus',
  reset: 'reset',
  confirm: 'confirm',
  columnchange: 'columnchange',
  linechange: 'linechange',
  error: 'error',
  scrolltoupper: 'scrolltoupper',
  scrolltolower: 'scrolltolower',
  scroll: 'scroll',
  load: 'load'
};