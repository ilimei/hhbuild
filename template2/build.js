/**
 * Created by 51422 on 2017/4/1.
 */
const commander = require("./zbuild/commander");
const path = require("path");

const basedir = __dirname;
commander.version('0.0.1').desc("npm run start")
    //=======构建脚本
    .options("f", "file", "value", "编译的入口文件", function (program) {
        require("./zbuild/commands/WebpackCommand")(program);
    })
    .options("pt", "pageTitle", "value", "指定编译后html的title")
    .options("pf", "profile", "value", "多版本文件")
    .options("p", "port", "value", "调试的版本号 默认是3000")
    .options("o", "outPath", "value", "输出文件位置 默认是build")
    .options("d", "dev", null, "是否是调试模式")
    //=======构建脚本结束
    .options("se", "showElectron", null, "打开electron", function (program) {
        require("./zbuild/commands/showElectronCommand")(program);
    })
    .options("asar", "asar", null, "打asar包", function (program) {
        const AsarPack = require('./zbuild/lib/AsarPack');
        const spawn = require("child_process").spawn;
        AsarPack(".", [
            "./build",
            ["./zbuild/asarPack", "./"]
        ], "name.asar", {}, function (err) {
            console.info("done");
            let ls = spawn(process.env.ElectronBin, ["name.asar"]);
            ls.stdout.pipe(process.stdout);
            ls.stderr.pipe(process.stderr);

        });
    })
    .options("ups", "uploadServer", null, "上传服务端", function (program) {
        let fs = require("fs");
        let request = require("./zbuild/lib/request");
        let packFile = require("./zbuild/lib/packfile")
        request.upload("http://localhost:8808/api/app/createWeb", {
            name: "managerServer",
            desc: "集群管理节点服务",
            type: 2,
            version: require("./package.json").version
        }, packFile(["./server", "./package.json", "./start.sh"]), "logo", "test.zip").then(data => {
            console.info(data);
        });
    })
    .options("dl", "dll", "value", "编译dll模式,dll的库用空格隔开 例如 -dl react react-dom", function (program) {
        require("./zbuild/commands/dllpackCommand")(program);
    })
    .options("h", "help", null, "输出帮助", function () {
        commander.showHelp();
    })
    .execute(process.argv, function (program) {
        global.program = program;
        program.resolveApp = function (relativePath) {
            return path.resolve(basedir, relativePath);
        };
        program.buildPath = basedir;
        program.srcFolder = program.srcFolder ? program.resolveApp(program.srcFolder) : program.resolveApp("src");

        // Note that unlike in Node, only *relative* paths from `NODE_PATH` are honored.
        // Otherwise, we risk importing Node.js core modules into an app instead of Webpack shims.
        // https://github.com/facebookincubator/create-react-app/issues/1023#issuecomment-265344421
        program.nodePaths = (process.env.NODE_PATH || '')
            .split(process.platform === 'win32' ? ';' : ':')
            .filter(Boolean)
            .filter(folder => !path.isAbsolute(folder))
            .map(program.resolveApp);
    });