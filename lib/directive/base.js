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
var octoparse = require('octoparse/lib').default;




require("./event.js");
require("./form.js");

function getStaticAndHolderId(attrs, staticAttrName, dynamicAttrName) {

  let staticAst = _.filterDirectiveAst(attrs, staticAttrName)

  let staticStr
  let holderId
  if (staticAst && staticAst.holder) {
    staticStr = this.expressions.get[staticAst.holder.body].call(this, this, attrs.extra)
    holderId = staticAst.holder.holderId
  } else {
    staticStr = staticAst ? staticAst.value : ''
    let dynamicStyleHolder = _.filterDirectiveAst(attrs, dynamicAttrName).holder
    holderId = dynamicStyleHolder && dynamicStyleHolder.holderId
  }
  return {
    staticStr,
    holderId
  }
}

module.exports = {
// **warn**: class inteplation will override this directive 
  'r-class': function(elem, value, name, attrs){

    let {staticStr: staticClass, holderId} = getStaticAndHolderId.call(this, attrs, 'class', name)

    let staticClassArr = staticClass.split(' ')

    if (!_.isExpr(value)) return

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

      _.updateHolders.call(this, resultStr, holderId, attrs.extra)

    }, {force: true, stable: true});
  },
  // **warn**: style inteplation will override this directive 
  'r-style': function(elem, value, name, attrs){

    let {staticStr: staticStyle, holderId} = getStaticAndHolderId.call(this, attrs, 'style', name)
    let staticStyleMap = {}
    staticStyle.split(';').forEach((styleItem) => {
      if (styleItem) {
        let keyValueArr = styleItem.split(':')
        staticStyleMap[keyValueArr[0]] = keyValueArr[1]
      }
    })

    if (!_.isExpr(value)) return

    this.$watch(value, function (nvalue) {

      if (typeof nvalue === 'object') {
        nvalue = Object.keys(nvalue).reduce(function (res, prev) {
          res[_.camelCaseToDash(prev)] = nvalue[prev]
          return res
        }, {})
      }
      let result = Object.assign({}, staticStyleMap, nvalue)
      let resultStr = Object.keys(result).map(function (key) {
        return `${key}:${result[key]}`
      }).join(';')

      _.updateHolders.call(this, `${resultStr};`, holderId, attrs.extra)

    }, {force: true, stable: true});
  },

  // when expression is evaluate to true, the elem will add display:none
  // Example: <div r-hide={{items.length > 0}}></div>
  'r-hide': {
    link:function(elem, value, name, attrs){
      const hideAst = _.filterDirectiveAst(attrs, name)
      if (!hideAst) return
      const holderId = hideAst.holder.holderId

      if( _.isExpr(value) || typeof value === "string"){
        this.$watch(value, function(nvalue){

          _.updateHolders.call(this, nvalue, holderId, attrs.extra)

        }, STABLE);
      } else if(!!value) {

        _.updateHolders.call(this, false, holderId, attrs.extra)

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
          node = octoparse.htmlParse(newVal);
        } catch (err) {
          console.error('r-html octoparse error', err);
        }
        this._updateMPHolders(node, {
          key: '__wxparsed',
          id: attrs.rhtmlId,
          extra: attrs.extra
        });

      }, {force: true, stable: true});
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










