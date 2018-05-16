var VM = require('./vm');

function addEventHandler(eventId, type, handler) {
  if (!this._eventHandlers) {
    this._eventHandlers = {}
  }
  if (!this._eventHandlers[eventId]) {
    this._eventHandlers[eventId] = {}
  }
  this._eventHandlers[eventId][type] = handler;
  return this;
}

function proxyEvent(rootVM, e) {
  var dataSet = e.currentTarget.dataset || {};
  var eventId = dataSet.eventId;
  var compId = dataSet.compId;

  var vm = VM.getVm(rootVM, compId);
  var type = e.type;

  var eventHandlers = vm._eventHandlers;

  if (eventHandlers) {
    var handlerMap = eventHandlers[eventId];
    var value;
    if (type === 'tap') {
      value = handlerMap['tap'] || handlerMap['click'];
    } else {
      value = handlerMap[EVENT_MAP[type]];
    }

    if (type === 'input' && handlerMap['r-model']) {
      handlerMap['r-model'].call(vm, e);
    }

    if (value) {
      vm.data.$event = e;

      value.get(vm);

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

module.exports = {
  proxyEvent,
  addEventHandler,
  EVENT_MAP
}