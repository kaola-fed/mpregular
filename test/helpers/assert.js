const webpack = require('webpack');
const defaultConfig = require('./webpack.config')
const Module = require('./module')

module.exports = function (template, cb) {
  const virtualModule = Module.addModule(template);
  const { name, path } = virtualModule;

  const config = Object.assign({
    entry: {
      [name]: path
    },
    output: {
      filename: '[name].js'
    }
  }, defaultConfig);

  let compiler = webpack(config);

  Module.installFileSystem(compiler);

  compiler.run(function(err, stats) {
    virtualModule.remove();

    if (err) throw err;
    let code = stats.compilation.assets[`${name}.js`].source()
    cb(eval(code))
  });
}

