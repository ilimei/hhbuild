/**
 * Created by Administrator on 2017/8/17.
 */
const spawn = require("child_process").spawn;

module.exports=function(program){
    let ls=spawn(process.env.ElectronBin, ["."]);
    ls.stdout.pipe(process.stdout);
    ls.stderr.pipe(process.stderr);
}