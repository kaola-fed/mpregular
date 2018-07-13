// Regular
var _ = require("../util");
// var dom = require("../dom");
// var animate = require("../helper/animate");
var Regular = require("../render/client");
var consts = require("../const");
var namespaces = consts.NAMESPACE;
var OPTIONS = consts.OPTIONS
var STABLE = OPTIONS.STABLE;
var DEEP_STABLE = {deep: true, stable: true};
var html2wxml = require('../wxparse');




require("./event.js");
require("./form.js");


module.exports = {
// **warn**: class inteplation will override this directive 
  'r-class': function(elem, value, name, attrs){

    let classAst = _.filterDirectiveAst(attrs, 'class')

    let staticClass
    let holderId
    if (classAst && classAst.holder) {
      staticClass = this.expressions.get[classAst.holder.body].call(this, this, attrs.extra)
      holderId = classAst.holder.id
    } else {
      staticClass = classAst ? classAst.value : ''
      holderId = attrs.attrs.filter((attr) => {
        return attr.name === name
      })[0].holder.id
    }

    let staticClassArr = staticClass.split(' ')

    this.$watch(value, function (nvalue) {

      let result = []

      Object.keys(nvalue).forEach(function (key) {
        if (!!nvalue[key]) {
          //如果静态class中有就不push避免重复
          if (staticClassArr.indexOf(key) === -1) {
            result.push(key)
          }
        } else {
          //如果动态中要删除某个class，静态中也有，必须删除
          let index = staticClassArr.indexOf(key)
          if (index !== -1) {
            staticClassArr.splice(index, 1)
          }
        }
      })

      let resultStr = result.concat(staticClassArr).join(' ')

      _.updateHolders.call(this, resultStr, holderId, attrs)

    }, {force: true, stable: true});
  },
  // **warn**: style inteplation will override this directive 
  'r-style': function(elem, value){
    // if(typeof value=== 'string'){
    //   value = _.fixObjStr(value)
    // }
    // this.$watch(value, function(nvalue){
    //   for(var i in nvalue) if(nvalue.hasOwnProperty(i)){
    //     dom.css(elem, i, nvalue[i]);
    //   }
    // },DEEP_STABLE);
  },

  // when expression is evaluate to true, the elem will add display:none
  // Example: <div r-hide={{items.length > 0}}></div>
  'r-hide': {
    link:function(elem, value, name, attrs){
      const hideAst = _.filterDirectiveAst(attrs, name)
      if (!hideAst) return
      const holderId = hideAst.holder.id

      if( _.isExpr(value) || typeof value === "string"){
        this.$watch(value, function(nvalue){

          _.updateHolders.call(this, nvalue, holderId, attrs)

        }, STABLE);
      } else if(!!value) {

        _.updateHolders.call(this, false, holderId, attrs)

      }
    },
    ssr: function(value){
      return value? 'style="display:none"': ''
    }
  },
  'r-html': {
    ssr: function(value, tag){
      tag.body = value;
      return "";
    },
    link: function(elem, value, name , attrs){
      this.$watch(value, function(newVal){
        var node = {};
        try {
          node = html2wxml.wxParse('wxparse', 'html', newVal, null, 0);
        } catch (err) {
          console.error('r-html wxParse error', err);
        }
        this._updateMPHolders(node, {
          key: '__wxparsed',
          id: attrs.rhtmlId,
          extra: attrs.extra
        });

      }, {force: true, stable: true});

      this._initWxParse()
    }
  },
  'ref': {
    // accept: consts.COMPONENT_TYPE + consts.ELEMENT_TYPE,
    link: function( elem, value ){
      var refs = this.$refs || (this.$refs = {});
      var cval;
      if(_.isExpr(value)){
        this.$watch(value, function(nval, oval){
          cval = nval;
          if(refs[oval] === elem) refs[oval] = null;
          if(cval) refs[cval] = elem;
        }, STABLE)
      }else{
        refs[cval = value] = elem;
      }
      return function(){
        refs[cval] = null;
      }
    }
  }
}

Regular.directive(module.exports);










