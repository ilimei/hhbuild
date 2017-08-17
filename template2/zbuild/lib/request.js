/**
 * Created by Administrator on 2017/7/19.
 */
let http = require("http");
let queryString = require('querystring');
let URL = require("url");
let FormData=require("form-data");

let request = function (url) {
    return new Promise((resolve, reject) => {
        let req = http.request(url, function (res) {
            let chunk = [];
            res.on("data", data => {
                chunk.push(data.toString());
            }).on("end", () => {
                resolve(chunk.join(""));
            }).on("error", e => {
                reject(e);
            });
        });
        req.end();
        req.on("error", e => {
            reject(e);
        });
    });
};
request.get = request;

request.post= function(url,data){
    return new Promise((resolve,reject)=>{
        let opt=URL.parse(url);
        opt.method="POST";
        opt.headers={
            "Content-Type":"application/json"
        }
        let req = http.request(opt, function (res) {
            let chunk = [];
            res.on("data", data => {
                chunk.push(data.toString());
            }).on("end", () => {
                resolve(chunk.join(""));
            }).on("error", e => {
                reject(e);
            });
        });
        req.write(JSON.stringify(data));
        req.end();
        req.on("error", e => {
            reject(e);
        });
    });
};

request.delete=function(url){
    return new Promise((resolve,reject)=>{
        let opt=URL.parse(url);
        opt.method="DELETE";
        let req = http.request(opt, function (res) {
            let chunk = [];
            res.on("data", data => {
                chunk.push(data.toString());
            }).on("end", () => {
                resolve(chunk.join(""));
            }).on("error", e => {
                reject(e);
            });
        });
        req.end();
        req.on("error", e => {
            reject(e);
        });
    });
};


request.upload=function(url,data,stream,formName,fileName){
    let boundaryKey="WebKitFormBoundaryOc576u7rfP58qms7";
    let boundaryStr=`--${boundaryKey}`;
    return new Promise((resolve,reject)=>{
        let opt=URL.parse(url);
        opt.method="POST";
        opt.headers={
            "Content-Type":'multipart/form-data; boundary=' + boundaryKey
        };
        let req = http.request(opt, function (res) {
            let chunk = [];
            res.on("data", data => {
                chunk.push(data.toString());
            }).on("end", () => {
                resolve(chunk.join(""));
            }).on("error", e => {
                reject(e);
            });
        });
        let content=[];
        for(var i in data){
            if(data.hasOwnProperty(i)){
                content.push(`${boundaryStr}\r\n`);
                content.push(`Content-Disposition: form-data; name="${i}" \r\n\r\n${data[i]}\r\n`);
            }
        }
        content.push(`${boundaryStr}\r\n`);
        content.push(`Content-Disposition: form-data; name="${formName}"; filename="${fileName}"\r\nContent-Type: image/zip\r\n\r\n`);
        req.write(content.join(""));
        stream.on("end",()=>{
            req.end(`\r\n${boundaryStr}--\r\n`);
        }).pipe(req);
        req.on("error", e => {
            reject(e);
        });
    });
}

module.exports=request;