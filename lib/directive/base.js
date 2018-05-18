// Regular
var _ = require("../util");
var dom = require("../dom");
var animate = require("../helper/animate");
var Regular = require("../render/client");
var consts = require("../const");
var namespaces = consts.NAMESPACE;
var OPTIONS = consts.OPTIONS
var STABLE = OPTIONS.STABLE;
var DEEP_STABLE = {deep: true, stable: true};
var html2wxml = require('../wxParse');




require("./event.js");
require("./form.js");


module.exports = {
// **warn**: class inteplation will override this directive 
  'r-class': function(elem, value){

    if(typeof value=== 'string'){
      value = _.fixObjStr(value)
    }
    var isNotHtml = elem.namespaceURI && elem.namespaceURI !== namespaces.html ;
    this.$watch(value, function(nvalue){
      var className = isNotHtml? elem.getAttribute('class'): elem.className;
      className = ' '+ (className||'').replace(/\s+/g, ' ') +' ';
      for(var i in nvalue) if(nvalue.hasOwnProperty(i)){
        className = className.replace(' ' + i + ' ',' ');
        if(nvalue[i] === true){
          className += i+' ';
        }
      }
      className = className.trim();
      if(isNotHtml){
        dom.attr(elem, 'class', className)
      }else{
        elem.className = className
      }
    }, DEEP_STABLE);
  },
  // **warn**: style inteplation will override this directive 
  'r-style': function(elem, value){
    if(typeof value=== 'string'){
      value = _.fixObjStr(value)
    }
    this.$watch(value, function(nvalue){
      for(var i in nvalue) if(nvalue.hasOwnProperty(i)){
        dom.css(elem, i, nvalue[i]);
      }
    },DEEP_STABLE);
  },
  // when expression is evaluate to true, the elem will add display:none
  // Example: <div r-hide={{items.length > 0}}></div>
  'r-hide': {
    link:function(elem, value){
      // var preBool = null, compelete;
      // if( _.isExpr(value) || typeof value === "string"){
      //   this.$watch(value, function(nvalue){
      //     var bool = !!nvalue;
      //     if(bool === preBool) return; 
      //     preBool = bool;
      //     if(bool){
      //       if(elem.onleave){
      //         compelete = elem.onleave(function(){
      //           elem.style.display = "none"
      //           compelete = null;
      //         })
      //       }else{
      //         elem.style.display = "none"
      //       }
            
      //     }else{
      //       if(compelete) compelete();
      //       elem.style.display = "";
      //       if(elem.onenter){
      //         elem.onenter();
      //       }
      //     }
      //   }, STABLE);
      // }else if(!!value){
      //   elem.style.display = "none";
      // }
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
      var keys = [attrs.rhtmlId];
      if (attrs.extra.__listInfo__) {
        var compIndex = _.getListIndexArray(attrs.extra).join('_');
        keys.push(compIndex);
      }
      var parsedKey = keys.join('_');

      console.log(parsedKey)
      if (!this.data.__wxparsed) {
        this.data.__wxparsed = {};
      }

      this.$watch(value, function(newVal){
        var node = html2wxml.wxParse(parsedKey, 'html', newVal, null, 0);
        this.data.__wxparsed[parsedKey] = node;
      }, {force: true, stable: true});
    }
  },
  'ref': {
    accept: consts.COMPONENT_TYPE + consts.ELEMENT_TYPE,
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










