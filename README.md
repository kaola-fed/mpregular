<img src="https://haitao.nos.netease.com/2758f92e-c498-4768-add3-c15a88c90390.gif" alt="mpregular" width="400px" align="center" />

# mpregular

基于 [RegularJS](https://github.com/regularjs/regular) 实现的小程序开发框架。可以直接使用 `RegularJS` 的语法和生态进行小程序开发，保证开发体验的一致性，同时提升 **web 应用**和**小程序应用**之间代码互相转换的效率。

## template

HTML 标签和小程序标签存在差异，比如 div 和 view 之间的关系，RegularJS 的模版语法和小程序模版语法也不一样，因此需要在编译时对模版进行转换。

小程序的原生组件可以在 RegularJS 模版中直接使用，对应的属性名和事件名都是一样的，但需要注意的是事件绑定的语法稍有不同，需要使用 RegularJs 的语法进行事件绑定。

例如：

小程序：

```html
<scroll-view
  scroll-y
  bindscroll="onScroll"
></scroll-view>
```

mpregular：

```html
<scroll-view
  scroll-y
  on-scroll="{ this.onScroll( $event ) }"
></scroll-view>
```

## Page 生命周期

1. onLoad
2. config，regular
4. init，regular 页面组件及各个子组件
3. onReady
5. onShow
6. onHide
7. onUnload

如何使用：

```javascript
export default {
  type: 'page',
  config() {
    // this.$mp.options 与 onLoad 中的 options 相同
    console.log('config', this.$mp.options);
  },
  init() {
    console.log('init');
  },
  onLoad(options) {
    console.log('onLoad', options);
  },
  onReady() {
    console.log('onReady');
  },
  onShow() {
    console.log('onShow');
  },
  onHide() {
    console.log('onHide');
  },
  onPullDownRefresh() {
    console.log('PullDownRefresh');
  },
  onReachBottom() {
    console.log('ReachBottom');
  },
  onPageScroll(options) {
    console.log('PageScroll', options);
  }
}
```

建议只在最外层的 Regular 实例中使用小程序相关的钩子函数，这样在转回 web 代码的时候工作量会相对减少

## App 生命周期

TODO

## 支持特性

### 事件绑定

事件绑定遵循 Regular 的事件绑定语法，利用 `on-` 指令，对于小程序的原生事件的绑定，也是一样，将 `bind` 替换成 `on-`。

比如 `click` 事件对应小程序中 `tap` 事件。

```html
<button on-click="{ this.onClick($event) }">click</button>
```

对于小程序中特有的事件绑定方式，在 Regular 中利用指令修饰符实现。

`catch{event}` -> `on-{event}.catch`

```html
<div on-touchstart.catch="{ this.onTouchStart($event) }"></div>
```

`capturebind{event}` -> `on-{event}.capture`

```html
<div on-touchstart.capture="{ this.onTouchStart($event) }"></div>
```

`catch-capture{event}` -> `on-{event}.catch-capture`

```html
<div on-touchstart.catch-capture="{ this.onTouchStart($event) }"></div>
```

处理函数中所返回的事件对象与小程序原生事件对象一致，保持不变。

### filter

```html
<span>{ time | dateFormat: 'yyyy-MM-dd' }</span>
```

```javascript
import Regular from 'regularjs';

cosnt App = Regular.extend({

}).filter('dateFormat', function() {
  // your filter code here
});

export default App;
```

这里需要注意下写法，需要用到 `Regular.extend`，下面的方式目前是不支持的（后面版本会加上）

```js
export default {
  filters: {
    // ...
  }
}
```

### {#inc this.$body}

```html
<!-- <Modal> definition -->
<div class="modal">
  {#inc this.$body}
</div>

<!-- use -->
<Modal>
  <head>Tips</head>
  <section>It's a tip</section>
</Modal>
```

目前只支持静态的模版，不支持动态的字符串编译，例如 `#{inc templateStr}` 是不支持的

### {#if}

```html
{#if mode === 1}
  <div>1</div>
{#elseif mode === 2}
  <div>2</div>
{#else}
  <div>other</div>
{/if}
```

语法与 Regular 一致。

### {#list}

```html
{#list soure as item by item_index}
  <div on-click="{ this.onItemClick(item) }">{ item.name }</div>
{/list}
```

语法与 Regular 一致，注意不要对大型列表进行 list 操作，否则容易出现性能问题。

### 指令

#### r-model

```html
<input r-model="{ title }">
<textarea r-model="{ article }">
```

#### r-hide

隐藏元素指令。

```html
<div r-hide="{ !show }"></div>
```

#### r-html

利用第三方开源库 wxParse 将 html 转换成 wxml 进行渲染。

```html
<div r-html="{ !htmlStr }"></div>
```

### 性能优化

小程序官方文档中特别强调 `setData` 传递大数据时会大量占用 WebView JS 线程，对此 mpregular 做了特别的优化。

#### 收集 view 中使用的数据

仅仅收集 template 中用到的数据，过滤没有用到的数据，将插值表达式执行的结果计算完成后，再通过 setData 传递到 view 线程。这样做，可以极大减少传输的数据量。

例如：

```html
<!-- RegularJS template -->
<span>{ largeData.info.countdown.time }</span>
<!-- 转换后的小程序 wxml -->
<text>{ __holders[0] }</text>
```

对于上面这个插值，通常的做法是将 largeData 传递给 view，然后由 view 去解析这个对象，得到目标值。但是，如果这个值挂在一个非常大的对象上，那么每次都需要传递这个大对象，性能将会非常差。

mpregular 的做法是，每次值更改时，先将这个表达式的值计算出来，在这个例子里就是从 largetData 上取到 time 这个值，再将值写到 `__holders[0]`， 通过 setData 传递给 view。这样每次更新的数据从一个大对象缩减到一个字符串，性能上会有很大提升。

同时，对于很复杂的插值表达式，也可以通过这种方式将计算结果设置到对应的 `__holders` 上。模版中的 filter、复杂表达式等特性，就是通过这一个机制实现的。

#### 缓存更新数据，定期更新

频繁调用 setData 传递数据也会造成性能问题，因此 mpregular 会设置一个 buffer 缓存更新数据，这段事件内重复的数据会进行 merge，并定时进行更新，目前这个时间是 50ms。这一机制的实现与 mpvue 时类似的。

#### 仍可能存在性能问题的情况

虽然 mpregular 对数据更新进行了内部优化，但是存在一些情况，无法避免大数据的传递。

```html
{#list largeList as item}
<span>{ item.name }</span>
{/list}
```

在 `{#list}` 表达式里面会直接把 `largeList` 传递到 view 去进行遍历。所以，如果要遍历一个数组，最好是将 view 中要遍历的列表精简成只包含 view 中要使用的属性，提高数据更新时的性能。当然，也不必要过度优化，当渲染大型列表出现性能问题时，你可以尝试从这个角度去处理问题。

## 暂不支持

- `r-style`，开发中
- `r-class`，开发中
- `r-animation`

## 工具

- [mpregular-loader](https://github.com/kaola-fed/mpregular-loader)

## demo

- [mpregular-example](https://github.com/kaola-fed/mpregular-example)

## reference

- [RegularJS](https://github.com/regularjs/regular)
- [mpvue](https://github.com/Meituan-Dianping/mpvue)
- [wxParse](https://github.com/icindy/wxParse)
