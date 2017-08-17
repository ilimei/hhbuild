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

function Commander(){
    this.config={};
    this.shortMap = {};
    this.configCb={};
    this._version="";
    this.usage = "";
    this.helperText = [];
}

/**
 *
 * @param shorterParam
 * @param param
 * @param valueParse
 * @param desc
 * @return {Commander}
 */
Commander.prototype.options=function (shorterParam, param, valueParse, desc,callback){
    this.helperText.push( makeStrLength("-" + shorterParam, 12)+makeStrLength("--" + param, 20) + desc);
    this.config[shorterParam] = valueParse || "boolean";
    this.config[param] = valueParse || "boolean";
    this.configCb[param]=callback;
    this.shortMap[shorterParam] = param;
    return this;
}

/**
 *
 * @param v
 * @return {Commander}
 */
Commander.prototype.version=function(v){
    this._version = v;
    return this;
}

/**
 *
 * @param v
 * @return {Commander}
 */
Commander.prototype.desc=function(desc){
    this.usage = desc
    return this;
}

/**
 *
 * @param arr
 * @return {*}
 */
Commander.prototype.parse=function(arr){
    let OPT = { unuse:[]};
    for (let index = 0, len = arr.length; index < len; index++) {
        let v = arr[index];
        if (v.startsWith("--")) {
            let param = v.replace("--", "");
            index += valueParseFunc(this.config, param, OPT, arr, index + 1);
        } else if (v.startsWith("-")) {
            let param = v.replace("-", "");
            let params = getParams(this.config, param);
            let self=this;
            params.forEach(function (pp) {
                index += valueParseFunc(self.config, self.shortMap[pp], OPT, arr, index + 1);
            });
        } else {
            OPT.unuse.push(v);
            continue;
        }
    }
    return OPT;
}

/**
 * 执行命令
 * @param arr
 */
Commander.prototype.execute=function(arr,prevProcess){
    let program=this.parse(arr);
    if(typeof prevProcess=="function"){
        prevProcess(program);
    }
    for(var i in program){
        if(program.hasOwnProperty(i)){
            let cb=this.configCb[i];
            if(typeof cb=="function"){
                cb(program);
            }
        }
    }
};

/**
 *
 */
Commander.prototype.showHelp=function(){
    console.info(`version ${this._version}`);
    console.info(`usage : ${this.usage}`);
    console.info("Options:")
    this.helperText.forEach(function (v) {
        console.info(`\t${v}`);
    });
}

module.exports=new Commander();