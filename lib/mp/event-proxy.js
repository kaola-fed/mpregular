module.exports = function eventProxy(vm, e) {
  const eventId = e.target.dataset.eventId;
  if (eventId) {
    vm.$event = {
      _mp: e
    }
    vm[eventId](e);
  }
  vm.$update();
}
