[![regularjs](http://regularjs.github.io/image/regular-icon-100.png)](http://regularjs.github.io)

# mpregular

基于 [RegularJS](https://github.com/regularjs/regular) 实现的小程序开发框架。可以直接用 `RegularJS` 进行小程序开发，提升将原有 Regular 项目转化为小程序的效率，以及保证一致的开发体验。

## 模版

html 元素和小程序元素不一样，regular 的模版和小程序模版页不一样，因此需要在编译时对模版进行转换。

小程序的原生组件可以直接在 regular 模版里面进行使用，对应的属性、事件名称都是一样的。

## Page 生命周期

每个 page 实例对应一个 Regular rootVM。

2. onLoad
1. config，regular
4. init，regular 页面组件及各个子组件
3. onReady
5. onShow
6. onHide
7. onUnload

小程序的页面钩子函数可以直接在 Regular 页面实例当中进行调用。

```javascript
export default {
  type: 'page',
  onLoad(options) {
    console.log(1, options);
  },
  config() {
    console.log(2);
  },
  init() {
    console.log(3);
  },
  onReady() {
    console.log(4);
  },
  onShow() {
    console.log('show');
  },
  onHide() {
    console.log('hide');
  },
  onPullDownRefresh() {
    console.log('pulldownrefresh');
  },
  onReachBottom() {
    console.log('reachbottom');
  },
  onPageScroll(options) {
    console.log('pagescroll', options);
  }
}
```

## App 生命周期

TODO

## 支持特性

### 事件绑定

事件绑定遵循 Regular 的事件绑定语法，利用 `on-` 指令，对于小程序的原生事件的绑定，也是一样，将 `bind` 替换成 `on-` 就好了。

`click` 事件对应与小程序中 `tap` 事件。

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

js 中要参照例子的写法，否则可能会出现问题

```javascript
import Regular from 'regularjs';

cosnt App = Regular.extend({

}).filter('dateFormat', function() {
  // your filer code here
});

export default App;
```

### {#inc this.$body}

当前只支持静态的模版，不支持动态的字符串编译，例如 `#{inc templateStr}` 是不支持的

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

### {#if}

与 Regular 语法一致。

```html
{#if mode === 1}
  <div>1</div>
{#elseif mode === 2}
  <div>2</div>
{#else}
  <div>other</div>
{/if}
```

### {#list}

语法与 Regular 一致，注意不要对大型列表进行 list，否则容易出现性能问题。

```html
{#list soure as item by item_index}
  <div on-click="{ this.onItemClick(item) }">{ item.name }</div>
{/list}
```

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
<div r-html="{ !show }"></div>
```

### 性能优化

官方文档里特别强调 `setData` 传递大数据时会大量占用 WebView JS 线程，因此对于数据更新，mpregular 做了特别的优化。

#### 收集 view 中使用的数据

收集 template 中，也即使 view 中用到的数据，将插值表达式执行的结果计算完成后，再通过 setData 传递到 view 线程。这样做，可以大大减少数据传输的数量。

例如：

```html
<!-- regular template -->
<span>{ largeData.info.countdown.time }</span>
<!-- 转换后的小程序 wxml -->
<text>{ __holders[0] }</text>
```

对于上面这个插值，通常的做法是将 largeData 传递给 view，然后由 view 去解析这个对象，得到目标值。但是，如果这个值挂在一个非常大的对象上，那么每次都需要传递这个大对象，性能将非常差。

mpregular 的做法是，每次值更改时，先将这个表达式的值计算出来，在这个例子里就是从 largetData 上取到 time 这个值，再将知道写到 `__holders[0]`， 通过 setData 传递给 view。这样每次更新的数据从一个大对象缩减到一个字符串，性能上会有很大提升。

同时，即便时复杂的插值表达式，也可以利用这个方式将计算结果设置到对应的 `__holders` 上。模版中的 filer、复杂表达式等特性，就是通过这一个机制实现的。

#### 缓存更新数据，定期更新

频繁调用 setData 传递数据也会造成性能问题，因此 mpregular 会设置一个 buffer 缓存更新数据，这段事件内重复的数据会进行 merge，并定时进行更新，目前这个时间时 50ms。这一个机制的实现与 mpvue 时类似的。

在之前的一个版本中，buffer 加入了数据大小的限制，限制每个 setData 周期的数据大小，规避产生 setData 传递数据超过大小限制的问题。但目前已经将这个逻辑去除，因为计算数据大小并不精确，同时性能比较差。这就要求开发者在开发时注意数据大小，不频繁更新大量数据。

#### 仍可能存在性能问题的情况

虽然 mpregular 对更新到 view 数据进行了简化，但是有些情况下，无法避免大数据的传递。

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

