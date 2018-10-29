var fs = require('fs');
const main = require("./syncpom").main;
var args = process.argv.splice(2);
var pomPath = args.length ? args[0] : 'pom.xml';
var packagePath = args.length >= 2 ? args[1] : 'package.json';
var UTF8 = 'UTF8';

main(fs.readFileSync(pomPath, UTF8),
    fs.readFileSync(packagePath, UTF8),
    function packageNewContent(content) {
        fs.writeFileSync(packagePath, content, UTF8)
    }
);

