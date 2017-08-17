/**
 * Created by Administrator on 2017/8/17.
 */
const http=require("http");
const path=require("path");
const fs=require("fs");
let port=3000;
let cb;
let indexPath=__dirname+"/build/";

function getProcess(req,res){
    let reqPath=req.url;
    if(reqPath=="/"){
        let p=path.resolve(indexPath+"/index.html");
        fs.createReadStream(p).pipe(res);
    }else if(/^.+\..+$/.test(reqPath)){
        let p=path.resolve(indexPath+reqPath);
        fs.createReadStream(p).pipe(res);
    }else{
        let p=path.resolve(indexPath+"/index.html");
        fs.createReadStream(p).pipe(res);
    }
}

function postProcess(req,res){
    let reqPath=req.url;
    console.info(reqPath);
    res.write(JSON.stringify({
        message:"not found"
    }));
    res.end();
}

let server=http.createServer(function(req,res){
    if(req.method=="GET"){
        getProcess(req,res);
    }else if(req.method=="POST"){
        postProcess(req,res);
    }
});
function start(){
    server.listen(port);
}
server.on("listening",function(){
    console.info("Server success listen on port :"+port);
    if(typeof cb=="function"){
        cb(port);
    }
});
server.on("error",function(err){
    if(err){
        port++;
        start();
    }
});
module.exports=function (callback) {
    cb=callback;
    start();
}

