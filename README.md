<a href="http://regularjs.github.io">
  ![regularjs](http://regularjs.github.io/image/regular-icon-100.png)
</a>


# mpregular

基于 [RegularJS](https://github.com/regularjs/regular) 实现的小程序开发框架。可以直接用 `RegularJS` 进行小程序开发，提升将原油 Regular 项目转化为小程序的效率。

## Page 生命周期

1. config，regular
2. onLoad
3. onReady
4. init，regular 页面组件及各个子组件
5. onShow
6. onHide
7. onUnload

## 支持特性

- regular 常用基本语法，`{#if}`、`{#list}`、`{#inc this.$body}`
- `r-model`
- `r-hide`

## 暂不支持

- `animation`
- `filter`
- `directive`
- `r-style`
- `r-class`
- `r-animation`

## 工具

- [mpregular-loader](https://www.npmjs.com/package/mpregular-loader)

## demo

- [mpregular-example](https://github.com/kaola-fed/mpregular-example)
## reference

- [RegularJS](https://github.com/regularjs/regular)
- [mpvue](https://github.com/Meituan-Dianping/mpvue)