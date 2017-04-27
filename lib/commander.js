/**
 * Created by Administrator on 2017/4/27.
 */

function step(arr) {
    let _step = 0;
    let args;

    function next() {
        if (_step < arr.length) {
            return (arr[_step++]).apply(this, args);
        }
    }

    return function () {
        Array.prototype.unshift.call(arguments, next);
        args = arguments;
        _step = 0;
        return next();
    };
}

const valueParseFunc = step([
    function BooleanParse(next, config, param, Commander, arr, index) {
        let value = config[param];
        let nextParam = arr[index++];
        if (value != "boolean") {
            return next();
        }
        Commander[param] = true;
        if (nextParam&&!nextParam.startsWith("-")) {
            if (nextParam == "false") {
                Commander[param] = false;
            }
            return 1;
        }
        return 0;
    },
    function ValueParse(next, config, param, Commander, arr, index) {
        let value = config[param];
        if (value != "value") {
            return next();
        }
        let values = [];
        let readTimes = 0;
        let nextParam = arr[index++];
        while (nextParam && !nextParam.startsWith("-")) {
            readTimes++;
            values.push(nextParam);
            nextParam = arr[index++];
        }
        Commander[param] = values.join(" ");
        return readTimes;
    }
]);

function getParams(config, param) {
    var params = [];
    var arr = param.split(/\s*/g);
    var leftParam = [];
    while (true) {
        if (arr.length == 0) {
            return params;
        }
        let p = arr.join("");
        if (config[p]) {
            params.push(p);
        } else {
            leftParam.unshift(arr.pop());
            continue;
        }
        if (leftParam.length == 0) {
            return params;
        } else {
            arr = leftParam;
            leftParam = [];
        }
    }
}

function makeStrLength(str, length) {
    if (str.length < length) {
        return str + " ".repeat(length - str.length);
    }
    return str;
}

let Commander = (function () {
    let Commander = {};
    let config = {};
    let shortMap = {};
    let version;
    let usage = "";
    let helperText = [];
    Commander.options = function (shorterParam, param, valueParse, desc) {
        helperText.push(makeStrLength("--" + param, 12) + makeStrLength("-" + shorterParam, 5) + desc);
        config[shorterParam] = valueParse || "boolean";
        config[param] = valueParse || "boolean";
        shortMap[shorterParam] = param;
        return Commander;
    }

    Commander.version = function (v) {
        version = v;
        return Commander;
    }

    Commander.desc = function (desc) {
        usage = desc;
        return Commander;
    }

    Commander.parse = function (arr) {
        let OPT = { unuse:[]};
        for (let index = 0, len = arr.length; index < len; index++) {
            let v = arr[index];
            if (v.startsWith("--")) {
                let param = v.replace("--", "");
                index += valueParseFunc(config, param, OPT, arr, index + 1);
            } else if (v.startsWith("-")) {
                let param = v.replace("-", "");
                let params = getParams(config, param);
                params.forEach(function (pp) {
                    index += valueParseFunc(config, shortMap[pp], OPT, arr, index + 1);
                });
            } else {
                OPT.unuse.push(v);
                continue;
            }
        }
        return OPT;
    }

    Commander.showHelp = function () {
        console.info(`version ${version}`);
        console.info(`usage : ${usage}`);
        console.info("\nOptions:\n")
        helperText.forEach(function (v) {
            console.info(`\t${v}`);
        });
        console.info("\n");
    }
    return Commander;
})();


let opt = Commander.version("1.0.0").desc("hhbuild [options]")
    .options("f", "files", "value", "编译的文件")
    .options("v", "version", null, "输出版本号")
    .options("h", "help", null, "输出帮助")
    .parse(["name.js", "age.js","1.0","-h"]);
Commander.showHelp();
console.dir(opt);
module.exports=Commander;