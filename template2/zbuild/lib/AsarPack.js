/**
 * Created by Administrator on 2017/8/16.
 */
const fs = require('fs');
const path=require("path");
const glob = require('glob');
const Asar=require("./AsarWarp");

function testPromise(dir,vPath, options, metadata) {
    return new Promise(function (resolve, reject) {
        let abDirPath=path.resolve(dir).replace(/\\/g,"/");
        let abVirtualPath="";
        if(vPath)abVirtualPath=path.resolve(vPath).replace(/\\/g,"/");
        glob(abDirPath + '/**/*', options, function (error, filenames) {
            if (error) {
                return reject(error)
            }
            for (const filename of filenames) {
                const stat = fs.lstatSync(filename)
                let vFilename=false;
                if(vPath){
                    vFilename=filename.replace(abDirPath,abVirtualPath);
                }
                if (stat.isFile()) {
                    metadata[filename] = {vfilename:vFilename,type: 'file', stat: stat}
                } else if (stat.isDirectory()) {
                    metadata[filename] = {vfilename:vFilename,type: 'directory', stat: stat}
                } else if (stat.isSymbolicLink()) {
                    metadata[filename] = {vfilename:vFilename,type: 'link', stat: stat}
                }
            }
            return resolve(filenames);
        })
    });
}

function tests(dirs, options, callback) {
    let metadata = {};
    Promise.all(dirs.map(dir =>{
        let vFilename=false;
        if(Array.isArray(dir)){
            vFilename=dir[1];
            dir=dir[0];
        }
        const stat =  fs.lstatSync(dir);
        if (stat.isFile()) {
            let filename=path.resolve(dir).replace(/\\/g,"/");
            metadata[filename] = {type: 'file',vfilename:vFilename, stat: stat}
            return [filename];
        }else {
            return testPromise(dir,vFilename, options, metadata);
        }
    })).then(filenames=>{
        callback(null,Array.prototype.concat.apply([],filenames),metadata);
    }).catch(e=>{
        callback(e);
    });
}

module.exports=function(src,dirs,dest,options,cb){
    tests(dirs,options,function(err,filenames,metedata){
        if(err){
            return cb(err);
        }
        Asar.createPackageFromFiles(src,dest,filenames,metedata,options,cb);
    })
}