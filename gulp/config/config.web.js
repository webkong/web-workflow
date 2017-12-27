/**
 * Created by wangsw on 08/05/2016.
 * @version 1.0.4
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
      homeSrc:resolve('src/'),
      jsSrc: resolve('src/' + page + '/js/'),
      jsDest: resolve('dist/' + page + '/js/'),
      cssSrc: resolve('src/' + page + '/css/'),
      cssDest: resolve('dist/' + page + '/css/')
    }
  }
};

module.exports = conf;