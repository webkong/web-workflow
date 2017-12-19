let gulp = require('gulp-help')(require('gulp'), {
  hideDepsMessage: true,
  description: '查看可以使用的命令'
});
let path = require('path');
let del = require('del');
let sequence = require('gulp-sequence');
let requireDir = require('require-dir');
let project = require('./gulp/lib/project'); // 得到当前项目的类型和名称
let config = require('./gulp/config/config.' + project.type)(project.page).views; // 读取配置文件
let proxy_config = require('./gulp/proxy.config');
let connect = require('gulp-connect'); //本地服务
let open = require('open');
let url = require('url');
let proxy = require('proxy-middleware'); //代理
// 递归引入gulp/tasks目录下的文件
requireDir('./gulp/tasks', {
  recurse: true
});

gulp.task('default', '组合：默认执行html, js, css编译', [
  'views',
  'webpack',
]);

gulp.task('statics', '组合：执行image, fonts编译', [
  'fonts',
  'static'
]);

gulp.task('clean', '组合：清除js, css, html文件', [
  'clean:views',
  'clean:webpack',
	'clean:images'
]);

gulp.task('cleanAll', '组合：删除dist目录当前project的内容', [
  'clean:views',
  'clean:images',
  'clean:static',
  'clean:fonts',
  'clean:webpack'
]);

gulp.task('empty', '组合：删除dist目录当前的project', function () {
  return del([
    config.dest
  ], {
    force: false
  });
});

gulp.task('emptyAll', '组合：清空dist目录', function () {
  return del([
    path.resolve(__dirname, './dist/*')
  ], {
    force: false
  });
});

gulp.task('build', '组合：上线编译打包', sequence(
  'clean', [
    'build:views',
    'build:images',
    'build:static',
    'build:webpack',
    'build:fonts'
  ]
), {
  options: {
    't=web': '按照web类型的配置执行，默认是web',
    'p=projectName': '要编译的项目名，默认是demo',
    'l=jquery': '使用的js库，默认是demo，可选jquery',
    'z-notes': '以下所有命令参数与之相同'
  }
});
let proxyOptions = url.parse(proxy_config.context);
proxyOptions.route = proxy_config.route;


gulp.task('create_server', '组合：监听并起本地服务', ['watch'], function () {
  connect.server({
    name: 'Dev server',
    root: ['dist'],
    port: 9000,
    middleware: function (connect, opt) {
      return [
        proxy(proxyOptions)
      ]
    },
    livereload: true
  });
});

gulp.task('open',function(){
	open('http://localhost:9000/' + project.page);
});

gulp.task('server', '组合：监听并起本地服务', ['create_server','open']);