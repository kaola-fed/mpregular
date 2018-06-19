const VM = require('./vm');

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

function removeEventHandler(eventId, type) {
  const eventHanlders = this._eventHandlers;
  if (eventHanlders && eventHanlders[eventId]) {
    if (!type) {
      delete eventHanlders[eventId];
    } else if(eventHanlders[eventId][type]) {
      delete eventHanlders[eventId][type];
    }
  }
}

function proxyEvent(rootVM, e) {
  const target = e.currentTarget || e.target || {};
  const dataSet = target.dataset || {};
  const eventId = dataSet.eventId;
  const compId = dataSet.compId;

  const vm = VM.getVm(rootVM, compId);
  const type = e.type;

  if (!vm) {
    return;
  }

  const eventHandlers = vm._eventHandlers;

  if (eventHandlers) {
    const handlerMap = eventHandlers[eventId];
    let value;
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
  removeEventHandler,
  EVENT_MAP
}