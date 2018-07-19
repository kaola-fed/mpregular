function dealData (obj = {}, path, op = '.', value) {
  if (!obj) return obj
  const arr = (path || '').split(op)

  return arr.reduce((res, key, index) => {
    if (!res[key]) {
      res[key] = {}
    }
    if (index === arr.length - 1) {
      res[key] = value
    }
    return res[key]
  }, obj)
}

class MPPage {
  constructor (config) {
    this.data = {}
    Object.assign(this, config)

    this._options = {
      path: 'pages/index/index',
      scene: 1001,
      query: {}
    }

    this._initLifecycle()
  }

  // 此处只做简单的对象参数模拟
  setData (obj) {
    if (!obj || Object.prototype.toString.call(obj) !== '[object Object]') {
      return
    }
    this.data = this.data || {}
    Object.keys(obj).forEach(key => {
      const val = obj[key]
      dealData(this.data, key, '.', val)
      // console.log(parsedData)
      // Object.assign(parsedData, val)
    })
  }

  // _ 开头的方法和属性定义等，都不是小程序暴露的方法，是模拟出的私有方法，手动触发用
  _initLifecycle () {
    this._callHook('onLoad', this._options.query)
    this._callHook('onShow')
    this._callHook('onReady')
  }

  _callHook (hook, ev) {
    const handle = this[hook]
    if (typeof handle === 'function') {
      return handle.call(this, ev)
    }
  }

  _leaveAndBack () {
    this._callHook('onHide')
    setTimeout(() => {
      this._callHook('onShow')
    }, 100)
  }
}
let page
function Page (config) {
  page = new MPPage(config)
  return page
}
function getPageInstance() {
  return page
}

module.exports = {
  Page,
  getPageInstance
}