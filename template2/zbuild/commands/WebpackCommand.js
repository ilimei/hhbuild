const gulp = require("gulp");
const spawn = require("child_process").spawn;
const path = require("path");
require("../tasks/webpack.task.js");

/**
 * 调试构建
 * @param program
 */
function makeDev(program){
    gulp.start("webpackDevServer", function (err, msg) {
        if (err) {
            console.error(err);
        } else {
            let ls=spawn(process.env.ElectronBin, [".",program.port||3000])
            ls.stdout.pipe(process.stdout);
            ls.stderr.pipe(process.stderr);
        }
    });
}

/**
 * 发布构建
 * @param program
 */
function makePub(program){
    gulp.start("webpackBuild", function (err, msg) {
        if (err) {
            console.error(err);
        }else{
            let fs=require("fs");
            let request=require("../lib/request");
            let packFile=require("../lib/packfile")
            request.upload("http://manager-server.dhccdl.com/api/app/createWeb",{
                name:"manager",
                desc:"集群管理节点",
                type:0,
                version:require("./package.json").version
            },packFile("./build"),"logo","test.zip").then(data=>{
                console.info(data);
            });
        }
    });
}

/**
 * Created by Administrator on 2017/8/17.
 */
module.exports=function(program){
    if(program.dev){
        makeDev(program);
    }else{
        makePub(program);
    }
}
