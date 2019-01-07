const {commonCompare, createInstance, getPageInstance} = require('./helpers')
import {input as inputDataSet} from './helpers/eventDataSet'
const octoparse = require('octoparse');
const assert = require('./helpers/assert')
const {getAppData, getAppBaseData} = require('./mock/holder')

describe('directive', function () {
  it('r-model', function (done) {
    assert(
      `
          <template>
            <input r-model="{info}" />
          </template>
          <script>
              export default {
                mpType: 'page',
                data: {
                  info: 'test input'
                }
              }
          </script>
       `,
      function (App) {
        const appData = getAppData({
          0: 'test input'
        })
        const app = createInstance(App)
        setTimeout(function () {
          let page = getPageInstance()
          expect(page.data).to.deep.equal(appData)

          page.proxyEvent(inputDataSet)
          setTimeout(function () {
            expect(page.data).to.deep.equal(getAppData({
              0: 'test update'
            }))
            done()
          }, 300)

        }, 300)
      }
    )
  })
  it('r-html', function (done) {
    assert(
      `
          <template>
              <div r-html={rawHtml}></div>
          </template>
          <script>
              export default {
                mpType: 'page',
                data: {
                  rawHtml: '<div>test r html</div>'
                }
              }
          </script>
       `,
      function (App) {
        let node = {
          nodes: octoparse.htmlParse('<div>test r html</div>')
        }
        const appData = getAppBaseData({
          __wxparsed: {
            0: node
          },
        })
        commonCompare(App, appData, done)
      }
    )
  })

  it('r-hide', function (done) {
    assert(
      `
          <template>
              <div r-hide={hide}></div>
          </template>
          <script>
              export default {
                mpType: 'page',
                data: {
                  hide: true
                }
              }
          </script>
       `,
      function (App) {
        const appData = getAppData({
          0: true,
        })
        commonCompare(App, appData, done)
      }
    )
  })

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
            <div r-style="{computedStyle}"></div>
            <div r-style="{this.getStyle()}"></div>
          </template>
          <script>
              export default {
                mpType: 'page',
                data: {
                  width: 30,
                  styleWidth: 20,
                  computedWidth: 50
                },
                getStyle() {
                  return {
                    width: '100px',
                    height: '200px'
                  }
                },
                computed: {
                  computedStyle(data) {
                    return {
                      width: data.computedWidth + 'px'
                    }
                  }
                }
              }
          </script>
       `,
      function (App) {
        const appData = getAppData({
          1: 'width:30px;height: 30px;',
          2: 'width: 30px;',
          3: 'width:50px;',
          4: 'width:100px;height:200px;'
        })
        commonCompare(App, appData, done)
      }
    )
  })

})
