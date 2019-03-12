const Buffer = require('./buffer');
const dataSync = require('./data-sync');

module.exports = function initRootVM(mpVM, regularOptions) {
  const { Component, definition, options } = regularOptions;
  const page = mpVM;

  const _opt = Object.assign({}, options, {
    mpVM,
    $mp: {
      page,
      status: 'load',
      buffer: new Buffer(),
      options: page && page.options
    }
  });

  const rootVM = new Component(definition, _opt);
  // create update function on root vm initilization
  rootVM._updateMPData = dataSync.createRootUpdateDataFn();

  return rootVM;
}