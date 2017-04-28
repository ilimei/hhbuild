#!/usr/bin/env node
const path = require("path");
const version = require("../package.json").version;
const Commander = require("../lib/commander");

let opt = Commander.version(version).desc("hhbuild [options]")
    .options("v", "version", null, "输出版本号")
    .options("h", "help", null, "输出帮助")
    .parse(process.argv);
if (opt.help) {
    Commander.showHelp();
    process.exit(0);
} else if (opt.version) {
    console.info("hhbuild " + version);
    process.exit(0);
}

let startTime = 0,
    projectName = process.argv[2];
projectVersion = process.argv[3] || "2.0";
if (!projectName) {
    console.error("use hhbuild projectName to create a new Project");
    process.exit(1);
}

let useTmpPath;
switch (projectVersion) {
    case "1.0":
        useTmpPath = tmpPath;
        break;
    case "2.0":
        useTmpPath = tmp2Path;
        break;
    default:
        console.error("the third param must 1.0 or 2.0 to choose which webpack version");
        process.exit(1);
}
const gulp = require("gulp");
const through = require('through2');
const tmpPath = path.resolve(__dirname, "../template");
const tmp2Path = path.resolve(__dirname, "../template2");

console.info("hhbuild version " + version);
function translateFile() {
    return through.obj(function (file, enc, cb) {
        if (file.path.endsWith(".tmp")) {
            file.path = file.path.replace(/.tmp$/, "");
            let oldStream = file.contents;
            file.contents = new Buffer(file.contents.toString().replace(/%PROJECT_NAME%/g, projectName));
        }
        this.push(file);
        cb();
    });
}

gulp.task("build", function () {
    console.info("start build " + projectName)
    startTime = new Date - 0;
    return gulp.src([useTmpPath + "/**/*", useTmpPath + "/.*"])
        .pipe(translateFile())
        .pipe(gulp.dest(process.cwd() + '/' + projectName));
});

gulp.start("build", function (err, msg) {
    console.info("successfull cost " + (new Date() - startTime) + "ms")
    if (err) {
        console.error(err);
    }
});

