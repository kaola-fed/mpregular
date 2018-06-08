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

function addPrefixToProperty(obj, prefix) {
  return Object.keys(obj).reduce((res, k) => {
    res[`${prefix}${k}`] = obj[k];
    return res;
  }, {});
}

function getDiffProperty(newData, oldData, path) {
  const keys = _.keys(newData);

  const temp = keys.reduce((res, k) => {
    if (diff(newData[k], oldData[k])) {
      res[`${k}`] = newData[k] || '';
    }
    return res;
  }, {});

  return temp;
}
function composePrefix(prefix, key) {
    if(_.typeOf(key) === 'number' && /^\d*$/.test(key)) {
        return [prefix, `[${key}]`].filter(str => str).join('');
    } else if(/^[^a-zA-Z_$]|[^0-9a-zA-Z_$]/.test(key)) {
        return [prefix, `.${key}`].filter(str => str).join('');
    }
    return [prefix, `${key}`].filter(str => str).join('.');
}

function flatten(obj, maxDep = 1) {
    if (obj === undefined || obj === null) {
        return obj;
    }
    const result = {};
    function flat(obj, prefix = '', dep = 1) {
        if (Object.keys(obj).length === 0) {
            result[composePrefix('', prefix)] = '';
        }

        for(let key in obj) {
            if (!obj.hasOwnProperty(key)) {
                continue;
            }
            const composeKey = composePrefix(prefix, key)

            let val = obj[key];

            if (dep >= maxDep) {
              result[composeKey] = val;
              continue;
            }

            let valType = _.typeOf(val);

            switch (valType) {
                case 'object':
                case 'array':
                    flat(val, composeKey, dep + 1);
                    break;
                default:
                    result[composeKey] = val;
                    break;
            }
        }
    }

    flat(obj);

    return result;
}

module.exports = {
  diff,
  flatten,
  addPrefixToProperty,
  getDiffProperty
};