/**
 * 所有的less文件引入全局less
 * Created by Administrator on 2017/4/28.
 */
const path=require("path");

module.exports={
    install: function(less, pluginManager) {
        pluginManager.addPreProcessor({
            process:function(lessStr,{context, imports, fileInfo}){
                return `@import "${path.resolve("./less/base.less")}";\n`+lessStr;
            }
        });
        // console.info(less);
        // less.tree.Import(path.resolve("../less/base.less"));
    },
    minVersion: [2, 0, 0] /* optional */
}