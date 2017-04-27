/**
 * Created by 51422 on 2017/4/1.
 */
const gulp=require("gulp");
const path=require("path");
const program = require('commander');
const basedir=__dirname;
require("./zbuild/webpack.task");

program
    .version('0.0.1')
    .option('-f, --file [value]', 'the bundle file')
    .option('-p, --port [value]', 'the dev server port')
    .option('-o, --outPath [value]', 'the output dir')
    .option('-d, --dev', 'is dev')
    .option('-pf, --profile [value]', 'the profile import')
    .option('-s, --srcFolder [value]', 'the source dir default is "src"')
    .option('-bn, --outBundleName [value]', 'the output bundle path and name default is "static/js/bundle.js"')
    .option('-pt, --pageTitle [value]',"the page title generate")
    .parse(process.argv);
global.program=program;
program.resolveApp=function(relativePath) {
    return path.resolve(basedir, relativePath);
}
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

if(program.dev) {
    gulp.start("webpackDevServer", function (err, msg) {
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