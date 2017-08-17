const gulp = require("gulp");
const spawn = require("child_process").spawn;
const path = require("path");
require("../tasks/webpack.task.js");
/**
 * Created by Administrator on 2017/8/17.
 */
module.exports=function(program){
    gulp.start("dllpack", function (err, msg) {
        if (err) {
            console.error(err);
        }
    });
}
