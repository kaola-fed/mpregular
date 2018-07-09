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


    let extra = attrs.extra
    let staticClass = extra.staticClass || ''
    let staticClassArr = staticClass.split(' ')

    let staticClassHolderIds = extra.staticClassHolderIds || []
    if (staticClassHolderIds.length) {
      staticClassArr = staticClassArr.concat(staticClassHolderIds.map((id) => {
        const keys = [ id ];

        if (extra.__listInfo__) {
          const listIndexArray = _.getListIndexArray(extra);
          if (listIndexArray.length > 0) {
            keys.push(listIndexArray.join('-'));
          }
        }
        const parsedKey = keys.join('-');
        if (this.__holders[parsedKey]) {
          return this.__holders[parsedKey].toString()
        } else {
          return ''
        }
      }))
    }

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

      this._updateMPHolders(resultStr, {
        key: '__holders',
        id: `class${attrs.extra.classId}`,
        extra: attrs.extra
      });

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
    link:function(elem, value){
      var preBool = null, compelete;
      if( _.isExpr(value) || typeof value === "string"){
        this.$watch(value, function(nvalue){
          // var bool = !!nvalue;
          // if(bool === preBool) return; 
          // preBool = bool;
          // if(bool){
          //   if(elem.onleave){
          //     compelete = elem.onleave(function(){
          //       elem.style.display = "none"
          //       compelete = null;
          //     })
          //   }else{
          //     elem.style.display = "none"
          //   }
            
          // }else{
          //   if(compelete) compelete();
          //   elem.style.display = "";
          //   if(elem.onenter){
          //     elem.onenter();
          //   }
          // }
        }, STABLE);
      }else if(!!value){
        // elem.style.display = "none";
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










