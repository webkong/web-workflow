/**
 * Created by wangsw on 08/05/2016.
 * @version 1.0.4
 */
let _ = require('lodash');
let path = require('path');
let webpack = require('webpack');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let autoprefixer = require('autoprefixer');
let flexibility = require('postcss-flexibility');
let sorting = require('postcss-sorting');
let color_rgba_fallback = require('postcss-color-rgba-fallback');
let opacity = require('postcss-opacity');
let pseudoelements = require('postcss-pseudoelements');
let will_change = require('postcss-will-change');
let cssnano = require('cssnano');

let glob = require('glob');

let WebpackDevServer = require('webpack-dev-server');

let project = require('./lib/project');
let config = require('./config/config.' + project.type)(project.page).webpack;

//js-lib

let jsLib = project.lib === 'jquery' ? 'jquery' : 'zepto';

//entery 配置
let files = glob.sync(config.jsSrc + '/*.js');
let newEntries = {};
files.forEach(function(f) {
  let name = /([a-z]+)\.js/.exec(f)[1];
  newEntries[name] = f;
});

// loaders配置
let getLoaders = function(env) {
  return [
    {
      test: /\.vue$/,
      loader: 'vue-loader'
    },
    {
      test: /\.js?$/,
      include: [config.jsSrc],
      exclude: [/(node_modules)/],
      loader: 'babel-loader',
      options: {
        presets: ['es2015']
      }
    },
    {
      test: /\.css$/,
      loaders: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['style-loader', 'css-loader', 'postcss-loader']
      })
    },
    {
      test: /\.less$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader', 'postcss-loader', 'less-loader']
      })
    },
    {
      test: /\.scss$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader', 'postcss-loader', 'sass-loader']
      })
    },
    {
      test: /\.(jpg|png|gif|jpeg)$/,
      loader: 'url-loader?limit=10000&name=../images/[hash:8].[name].[ext]'
    },
    {
      test: /\.(woff|ttf|eot|woff2)$/,
      loader: 'file-loader'
    },
    {
      //zepto导入到webpack
      test: require.resolve('zepto'),
      loader: 'exports-loader?window.Zepto!script-loader'
    }
  ];
};

// 别名配置
let getAlias = function(env) {
  return {
    // 特殊
    lib: jsLib,
    vue$: 'vue/dist/vue.esm.js',
    '@': config.jsSrc
  };
};

// 插件配置
let getPlugins = function(env) {
  //html 
  let htmlfiles = glob.sync(config.src + '/html/*.html');
  let htmlArr = []; //存储文件path数组
  let newHtmlArr = []; //对象数组
  htmlfiles.forEach(function(f) {
    let name = /([a-z]+)\.html/.exec(f)[1];
    htmlArr.push(f);
    if (env === 'production') {
      newHtmlArr.push(
        new HtmlWebpackPlugin({
          filename: config.dest + '/' + name + '.html',
          template: f,
          inject: true,
          minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true
          },
          chunksSortMode: 'dependency'
        })
      );
    } else {
      newHtmlArr.push(
        new HtmlWebpackPlugin({
          filename: config.dest + '/' + name + '.html',
          template: f,
          inject: true
        })
      );
    }
  });

  let defaultPlugins = [
    // 这个不仅是别名，还可以在遇到别名的时候自动引入模块
    new webpack.ProvidePlugin({
      $: jsLib
    }),
    // 抽离公共模块
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      filename: 'common.js'
    }),
    new ExtractTextPlugin({
      filename: '../css/[name].css'
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [
          require('autoprefixer'),
          require('postcss-smart-import'),
          require('precss'),
          require('postcss-mixins'),
          require('cssnano')
        ]
      }
    })
  ];

  if (env === 'production') {
    // 线上模式的配置，去除依赖中重复的插件/压缩js/排除报错的插件
    plugins = _.union(defaultPlugins,newHtmlArr, [
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
          drop_console: false
        },
        sourceMap: true
      })
    ]);
  } else {
    plugins = _.union(defaultPlugins,newHtmlArr, []);
  }

  return plugins;
};
// 作为函数导出配置，代码更简洁
module.exports = function(env) {
  return {
    //entry: config.jsSrc + '/index.js',
    // entry: {
    //   index: config.jsSrc + '/index.js',
    //   auth: config.jsSrc + '/auth.js',
    //   server:config.jsSrc + '/server.js',
    // },
    //扫描目录
    entry: Object.assign({}, config.entry, newEntries),

    output: {
      path: config.jsDest,
      filename: '[name].js'
    },
    devtool: 'eval',
    watch: false,
    profile: true,
    cache: true,
    module: {
      rules: getLoaders(env)
    },
    resolve: {
      extensions: ['.js', '.json', '.jsx', '.css', '.scss', '.vue'],
      alias: getAlias(env)
    },
    plugins: getPlugins(env)
  };
};
