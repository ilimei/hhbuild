const archiver = require('archiver');
const unzip = require("unzip");
const fs = require('fs');
const Path = require("path");

module.exports = function (path) {
    var tarFile = archiver('zip');
    if (Array.isArray(path)) {
        path.forEach(v => {
            let stat = fs.statSync(v);
            if (stat.isDirectory()) {
                tarFile.directory(v, "/");
            } else {
                let {base} = Path.parse(v);
                tarFile.file(v, {name: base});
            }
        });
    } else {
        tarFile.directory(path, "/");
    }
    tarFile.finalize();
    return tarFile;
};

module.exports.unpack = function (zipPath, folder) {
    fs.createReadStream(path.resolve(zipPath)).on("end", function () {
        console.info("end");
    }).pipe(unzip.Extract({path: path.resolve(folder)}));
}