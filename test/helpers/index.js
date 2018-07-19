const { Page, getPageInstance } = require('./mp.runtime')

global.Page = Page

function createInstance (App) {
  return new App()
}

module.exports = {
  createInstance,
  getPageInstance
}
