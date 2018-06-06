var _ = require('../util');

var utils = {};

function diff(pre, cur, maxDep = 5, dep = 1) {
  if (dep > maxDep) {
    return true;
  }

  if (pre !== cur && (pre == undefined || cur == undefined)) {
    return true;
  }

  if (pre === cur && pre == undefined ) {
    return false;
  }

  const curType = _.typeOf(cur);
  const preType = _.typeOf(pre);

  if (curType !== preType) {
    return true;
  }

  if (curType !== 'array' && curType !== 'object') {
    return cur !== pre;
  }

  var preKeys = _.keys(pre);
  var curKeys = _.keys(cur);

  if (curKeys.length !== preKeys.length) {
    return true;
  }

  for (var i = 0; i < preKeys.length; ++i) {
    var k = preKeys[i];

    var type = typeof cur[k];
   
    if (type !== 'object' && cur[k] !== pre[k]) {
      return true;
    }

    if (type === 'object' && diff(pre[k], cur[k], maxDep, dep + 1)) {
      return true;
    }
  }

  return false;
}

module.exports = {
  diff
};