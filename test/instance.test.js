const {commonCompare} = require('./helpers')
const assert = require('./helpers/assert')
const {getAppDataSingleHolder, getListData} = require('./mock/holder')

describe('instance', function () {

  // data 默认初始化数据
  it('data', function (done) {
    assert(
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
        const appData = getAppDataSingleHolder('test')
        commonCompare(App, appData, done)
      }
    )
  })

  //reactive data
  it('reactive data', function (done) {
    assert(
      `
          <template>
              <div>{test}</div>
          </template>
          <script>
              export default {
                mpType: 'page',
                data: {
                  test: 'test'
                },
                onLoad() {
                  this.data.test = 'test update'
                  this.$update()
                }
              }
          </script>
       `,
      function (App) {
        const appData = getAppDataSingleHolder('test update')
        commonCompare(App, appData, done)
      }
    )
  })

  it('list', function (done) {
    assert(
      `
          <template>
            {#list items as item}
              <li class="static">{item}</li>
            {/list}
          </template>
          <script>
              export default {
                mpType: 'page',
                data: {
                  items: [
                    111,
                    222,
                    333
                  ]
                }
              }
          </script>
       `,
      function (App) {
        const appData = getListData()
        commonCompare(App, appData, done)
      }
    )
  })
})
