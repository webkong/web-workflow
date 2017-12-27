/**
 * Created by wangsw on 12/20/2017.
 * @version 1.0.4
 * @desc config file for vue
 */
var path = require('path');
function resolve (dir) {
  return path.join(__dirname, '../../', dir)
}
var conf = function (page) {
  return {
    views: {
      src: resolve('src/' + page + '/html/**'),
      dest: resolve('dist/' + page + '/')
    },
    images:{
      src: resolve('src/' + page + '/images/**'),
      dest: resolve('dist/' + page + '/images/')
    },
    static:{
      src: resolve('src/' + page + '/static/**'),
      dest: resolve('dist/' + page + '/static/')
    },
    fonts:{
      src: resolve('src/' + page + '/fonts/**'),
      dest: resolve('dist/' + page + '/fonts/')
    },
    webpack:{
      dest:resolve('dist/' + page + '/'),
      src:resolve('src/' + page + '/'),
      jsSrc: resolve('src/' + page + '/'),
      jsDest: resolve('dist/' + page + '/js/'),
      cssSrc: resolve('src/' + page + '/css/'),
      cssDest: resolve('dist/' + page + '/css/')
    }
  }
};

module.exports = conf;