#!/usr/bin/env node
const gulp=require("gulp");
const path=require("path");
const through = require('through2');
const tmpPath=path.resolve(__dirname,"../template");
const tmp2Path=path.resolve(__dirname,"../template2");
const Commander=require("../lib/commander");

let startTime=0,
     projectName=process.argv[2];
     projectVersion=process.argv[3]||"2.0";
if(!projectName){
    console.error("use hhbuild projectName to create a new Project");
    process.exit(1);
}

let useTmpPath;
switch (projectVersion){
    case "1.0":useTmpPath=tmpPath;break;
    case "2.0":useTmpPath=tmp2Path;break;
    default:
        console.error("the third param must 1.0 or 2.0 to choose which webpack version");
        process.exit(1);
}

console.info("hhbuild version 0.1.0");
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
    return  gulp.src([useTmpPath+"/**/*",useTmpPath+"/.*"])
        .pipe(translateFile())
        .pipe(gulp.dest(process.cwd()+'/'+projectName));
});

gulp.start("build",function(err,msg){
    console.info("successfull cost "+(new Date()-startTime)+"ms")
    if(err){
        console.error(err);
    }
});

