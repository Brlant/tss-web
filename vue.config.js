const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

module.exports = {
  devServer: {
    open: true,
    port: '8011',
    https: false,
    hotOnly: false, disableHostCheck: true, proxy: {
      '/api': {
        target: 'https://un-tss.cdcerp.cn',
        //  target: 'http://172.200.82.113:8080',
        changOrigin: true
      }
    }
  },
  transpileDependencies: ['@dtop'],
  configureWebpack: {
    plugins:[new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, 'static'), to: 'static',
        ignore: ['.*']
      }])
    ]
  }
};
