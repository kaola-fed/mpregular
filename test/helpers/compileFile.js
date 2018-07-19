var webpack = require('webpack');
var MemoryFS = require('memory-fs');
var root = require('app-root-path');
var fs = new MemoryFS();
const realFS = require('fs');
const path = require('path')
var config = require('../../webpack.config')

const statOrig = fs.stat.bind(fs);
const readFileOrig = fs.readFile.bind(fs);
fs.stat = function (_path, cb) {
  statOrig(_path, function(err, result) {
    if (err) {
      return realFS.stat(_path, cb);
    } else {
      return cb(err, result);
    }
  });
};
fs.readFile = function (path, cb) {
  readFileOrig(path, function (err, result) {
    if (err) {
      return realFS.readFile(path, cb);
    } else {
      return cb(err, result);
    }
  });
};

module.exports = function (name, template, cb) {
  const rootDir = root.toString();
  const outputName = `${name}.rgl`;
  const entry = path.join(rootDir, outputName);
  const rootExists = fs.existsSync(rootDir);
  if (!rootExists) {
    fs.mkdirpSync(rootDir);
  }

  fs.writeFileSync(entry, template);

  config.entry = {}
  config.entry[name] = entry
  config.output = {
    filename: outputName
  }

  var compiler = webpack(config);

  compiler.inputFileSystem = fs;
  compiler.outputFileSystem = fs;
  compiler.resolvers.normal.fileSystem = fs;
  compiler.resolvers.context.fileSystem = fs;

  compiler.run(function(err, stats) {
    if (err) throw err;
    let code = stats.compilation.assets[`${name}.rgl`].source()
    cb(eval(code))
  });
}

