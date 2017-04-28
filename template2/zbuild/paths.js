/**
 * Created by Administrator on 2017/4/28.
 */
const path=require("path");
const basedir=path.resolve("../"+__dirname);

exports.resolveApp=function(relativePath){
    return path.resolve(basedir, relativePath);
}

exports.srcFolder=

exports.nodePaths=(process.env.NODE_PATH || '')
    .split(process.platform === 'win32' ? ';' : ':')
    .filter(Boolean)
    .filter(folder => !path.isAbsolute(folder))
    .map(exports.resolveApp);