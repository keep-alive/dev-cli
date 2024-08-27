const fs = require('fs');
const path = require('path');
exports.clearDir = function(dirPath) {
    const files = fs.readdirSync(dirPath)
    files.forEach(file => {
        const curPath = path.join(dirPath,file)
        if(fs.statSync(curPath).isDirectory()) {                 
            clearDir(curPath);
        } else {    
            fs.unlinkSync(curPath);                                 
        }
    })
    fs.rmdirSync(dirPath); 
}