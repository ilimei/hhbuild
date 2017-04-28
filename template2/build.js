/**
 * Created by 51422 on 2017/4/1.
 */
const gulp=require("gulp");
const path=require("path");
const Commander = require("./zbuild/commander");

const basedir=__dirname;

let program=Commander.version('0.0.1').desc("npm run start")
    .options("f", "file", "value", "编译的入口文件")
    .options("p", "port", "value", "调试的版本号 默认是3000")
    .options("o", "outPath", "value", "输出文件位置 默认是build")
    .options("d", "dev",null, "是否是调试模式")
    .options("dl", "dll","value","编译dll模式,dll的库用空格隔开 例如 -dl react react-dom")
    .options("pf","profile","value","多版本文件")
    .options('s', "srcFolder","value",'编译的源文件目录 默认是src')
    .options("pt","pageTitle","value","指定编译后html的title")
    .options("h", "help", null, "输出帮助")
    .parse(process.argv);
global.program=program;
program.resolveApp=function(relativePath) {
    return path.resolve(basedir, relativePath);
};
program.buildPath=basedir;
program.srcFolder=program.srcFolder?program.resolveApp(program.srcFolder):program.resolveApp("src");

// Note that unlike in Node, only *relative* paths from `NODE_PATH` are honored.
// Otherwise, we risk importing Node.js core modules into an app instead of Webpack shims.
// https://github.com/facebookincubator/create-react-app/issues/1023#issuecomment-265344421
program.nodePaths = (process.env.NODE_PATH || '')
    .split(process.platform === 'win32' ? ';' : ':')
    .filter(Boolean)
    .filter(folder => !path.isAbsolute(folder))
    .map(program.resolveApp);

require("./zbuild/webpack.task");
if(program.dev) {
    gulp.start("webpackDevServer", function (err, msg) {
        if(err){
            console.error(err);
        }
    });
}else if(program.dll){
    gulp.start("dllpack", function (err, msg) {
        if(err){
            console.error(err);
        }
    });
}else{
    gulp.start("webpackBuild", function (err, msg) {
        if(err){
            console.error(err);
        }
    });
}