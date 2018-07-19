const { Page, getPageInstance } = require('./mp.runtime')

global.Page = Page

//for wxParse
global.wx = {
  getSystemInfo() {

  },
  previewImage() {

  }
}

function createInstance (App) {
  return new App()
}
function commonCompare(App, appData, done) {
  const app = createInstance(App)
  setTimeout(function () {
    let page = getPageInstance()
    expect(page.data).to.deep.equal(appData)
    done()
  }, 300)
}

module.exports = {
  createInstance,
  getPageInstance,
  commonCompare
}
