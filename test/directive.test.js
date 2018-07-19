const {commonCompare} = require('./helpers')
const assert = require('./helpers/assert')
const {getAppData, getAppDataSingleHolder, getListData} = require('./mock/holder')

describe('directive', function () {

  it('r-class', function (done) {
    assert(
      `
          <template>
              <div r-class="{{active: active}}">test</div>
              <div r-class="{{no_active: no_active}}">test</div>
              <div r-class={{'active': c + d - this.x( e / f )}}></div>
          </template>
          <script>
              export default {
                mpType: 'page',
                data: {
                  active: true,
                  no_active: false,
                  c: 1,
                  d: 1,
                  e: 2,
                  f: 1
                },
                x: function(num) {
                  return num
                }
              }
          </script>
       `,
      function (App) {
        const appData = getAppData({
          0: 'active ',
          1: '',
          2: ''
        })
        commonCompare(App, appData, done)
      }
    )
  })

  it('class', function (done) {
    assert(
      `
          <template>
              <div class="{active}">test</div>
              <div class="{active1} {active2}">test</div>
              <div class="static {active}"></div>
              <li class="static {active ? 'true' : 'false'}" r-class="{{static: false, 'active': true}}">test</li>
          </template>
          <script>
              export default {
                mpType: 'page',
                data: {
                  active: 'active',
                  active1: 'active1',
                  active2: 'active2'
                }
              }
          </script>
       `,
      function (App) {
        const appData = getAppData({
          0: 'active',
          1: 'active1 active2',
          2: 'static active',
          3: 'active true',
        })
        commonCompare(App, appData, done)
      }
    )
  })

  //reactive data
  it('r-style', function (done) {
    assert(
      `
          <template>
            <div r-style="{{width: width + 'px'}}" style="width: {styleWidth}px;height: 30px;">test</div>
            <div style="width: 100px;"></div>
            <div style="width: {width}px;"></div>
          </template>
          <script>
              export default {
                mpType: 'page',
                data: {
                  width: 30,
                  styleWidth: 20
                }
              }
          </script>
       `,
      function (App) {
        const appData = getAppData({
          1: 'width:30px;height: 30px;',
          2: 'width: 30px;'
        })
        commonCompare(App, appData, done)
      }
    )
  })

})
