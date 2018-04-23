module.exports = function(path) {
  return path.split('.')
    .map((p) => {
      if (/\[/.test(p)) {
        let keys = p.split('[').map((key) => {
          let keyStr = key.replace(/[\]|"|']/g, '');
          return keyStr;
        });
        return keys;
      }
      return p;
    })
    .reduce((result, key) => {
      if (Array.isArray(key)) {
        return result.concat(key);
      }
      result.push(key);
      return result;
    }, []); 
}