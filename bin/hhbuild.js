#!/usr/bin/env node
const gulp=require("gulp");
const path=require("path");
const through = require('through2');
const tmpPath=path.resolve(__dirname,"../template");
const readline = require('readline');

let startTime=0,
     projectName=process.argv[2];
if(!projectName){
    console.error("use hhbuild projectName to create a new Project");
    process.exit(1);
}
console.info("hhbuild version 0.0.4");
function translateFile(){
    return through.obj(function(file, enc, cb) {
        if(file.path.endsWith(".tmp")){
            file.path=file.path.replace(/.tmp$/,"");
            let oldStream=file.contents;
            file.contents=new Buffer(file.contents.toString().replace(/%PROJECT_NAME%/g,projectName));
        }
        // 确保文件进去下一个插件
        this.push(file);
        // 告诉 stream 转换工作完成
        cb();
    });
}
gulp.task("build",function(){
    console.info("start build "+projectName)
    startTime=new Date-0;
    return  gulp.src(tmpPath+"/**/*")
        .pipe(translateFile())
        .pipe(gulp.dest(process.cwd()+'/'+projectName));
});

gulp.start("build",function(err,msg){
    console.info("successfull cost "+(new Date()-startTime)+"ms")
    if(err){
        console.error(err);
    }
});