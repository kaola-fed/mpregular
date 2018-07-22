var MemoryFS = require('memory-fs');
var root = require('app-root-path');
var fs = new MemoryFS();
const realFS = require('fs');
const pathTo = require('path')

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

let filePrefix = 'temp_file';

const uid = (function() {
  let id = 0;
  return function _uid() {
    return `${id++}`;
  }
})()

const rootDir = root.toString();

const rootExists = fs.existsSync(rootDir);
if (!rootExists) {
  fs.mkdirpSync(rootDir);
}

const moduleList = [];

class Module {
  constructor(options = {}) {
    let { path = '', code } = options;
    let id = uid();
    let name;
    if (!path) {
      name = `${filePrefix}${id}`
      path = `${name}.rgl`;
    }

    path = pathTo.join(rootDir, path);

    Object.assign(this, {
      id,
      path,
      code
    });

    this.init();
  }

  init() {
    const { path, code } = this;
    fs.writeFileSync(path, code);
    moduleList.push(this);
    return this;
  }

  remove() {
    fs.unlinkSync(this.path); //release memory
    return true;
  }

  static addModule(...args) {
    if (args[1]) {
      return new Module({
        code: args[1],
        path: args[0]
      });
    } else {
      return new Module({
        code: args[0],
      });
    }
  }

  static findModule(id) {
    return moduleList.find(m => m.id === id);
  }

  static clearAll() {
    moduleList.forEach(m => m.remove());
  }

  static removeModule(id) {
    const m  = this.findModule(id);
    if (m) {
      return m.remove();
    }
    return false;
  }

  static installFileSystem(compiler) {
    compiler.inputFileSystem = fs;
    compiler.outputFileSystem = fs;
    compiler.resolvers.normal.fileSystem = fs;
    compiler.resolvers.context.fileSystem = fs;
  }
}

module.exports = Module;