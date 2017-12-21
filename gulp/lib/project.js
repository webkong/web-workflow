/**
 * Created by wangsw on 08/05/2016.
 * @version 1.0.4
 */
let argv = require('yargs').argv;

// gulp build -t=web -p=demo -l=jquery

let type = argv.t || 'web';
let page = argv.p || 'demo';
let lib = argv.l || 'jquery';

console.log('type: ' + type + '  page: ' + page + ' jsLib:' + lib);

module.exports = {
    type: type,
    page: page,
    lib: lib
};