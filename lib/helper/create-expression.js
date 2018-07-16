var parsePath = require('./parse-path');

function createGetterFromPath(paths) {
  return paths.reduce(function(fn, key) {
    return function(c, e) {
      e = e || '';
      return c._sg_(key, fn(c, e), e);
    }
  }, function(c, e) {
    return c.data;
  });
}

function createGetter(rawExpr) {
  return createGetterFromPath(parsePath(rawExpr));
}

function createSetter(rawExpr) {
  var paths = parsePath(rawExpr);
  var setKey = paths[paths.length - 1];
  var getPaths = paths.slice(0, paths.length - 2);
  var get;
  if (getPaths.length > 0) {
    get = createGetterFromPath(getPaths);
  }

  return function(c, value) {
    c._ss_(
      setKey,
      value,
      get && get(c) || c.data,
      '=',
      0
    )
  }
}

module.exports = {
  createGetter,
  createSetter,
}