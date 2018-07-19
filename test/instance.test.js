const {createInstance, getPageInstance} = require('./helpers')
const compileFile = require('./helpers/compileFile')

describe('instance', function () {
  function getDefAppData() {
    return {
      $root: {
        0: {
          $k: '0',
          $kk: '0,',
          $p: '',
          __holders: {
            0: 'test'
          },
          __indexMap: ""
        }
      }
    }
  }

  function getDefAppDataByVfor() {
    return {
      $root: {
        0: {
          items: [111, 222, 333],
          $k: '0',
          $kk: '0,',
          $p: ''
        },
        '0,1-0': {
          info: 111,
          $k: '0,1-0',
          $kk: '0,1-0,',
          $p: '0'
        },
        '0,1-1': {
          info: 222,
          $k: '0,1-1',
          $kk: '0,1-1,',
          $p: '0'
        },
        '0,1-2': {
          info: 333,
          $k: '0,1-2',
          $kk: '0,1-2,',
          $p: '0'
        }
      }
    }
  }

  // data 默认初始化数据
  it('data', function (done) {
    compileFile('instance',
      `
          <template>
              <div>{test}</div>
          </template>
          <script>
              export default {
                mpType: 'page',
                data: {
                  test: 'test'
                }
              }
          </script>
       `,
      function (App) {
        const app = createInstance(App)
        setTimeout(function () {
          const appData = getDefAppData()
          let page = getPageInstance()
          console.log(page, appData)
          expect(page.data).toEqual(appData)
          done()
        }, 300)
      }
    )
  })
})
