/**
 * Created by wangsw on 12/20/2017.
 * @version 1.0.4
 * @desc config file for vue
 */
var path = require('path');
var conf = function (page) {
  return {
    views: {
      src: path.resolve(__dirname, '../../','src/' + page + '/html/**'),
      dest: path.resolve(__dirname, '../../','dist/' + page + '/')
    },
    images:{
      src: path.resolve(__dirname, '../../','src/' + page + '/images/**'),
      dest: path.resolve(__dirname, '../../','dist/' + page + '/images/')
    },
    static:{
      src: path.resolve(__dirname, '../../','src/' + page + '/static/**'),
      dest: path.resolve(__dirname, '../../','dist/' + page + '/static/')
    },
    fonts:{
      src: path.resolve(__dirname, '../../','src/' + page + '/fonts/**'),
      dest: path.resolve(__dirname, '../../','dist/' + page + '/fonts/')
    },
    webpack:{
      dest:path.resolve(__dirname, '../../','dist/' + page + '/'),
      src:path.resolve(__dirname, '../../','src/' + page + '/'),
      jsSrc: path.resolve(__dirname, '../../','src/' + page + '/'),
      jsDest: path.resolve(__dirname, '../../','dist/' + page + '/js/'),
      cssSrc: path.resolve(__dirname, '../../','src/' + page + '/css/'),
      cssDest: path.resolve(__dirname, '../../','dist/' + page + '/css/')
    }
  }
};

module.exports = conf;