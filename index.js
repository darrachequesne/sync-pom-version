var fs = require('fs');
const main = require("./syncpom").main;
var args = process.argv.splice(2);
var pomPath = args.length ? args[0] : 'pom.xml';
var packagePath = args.length >= 2 ? args[1] : 'package.json';

main(fs.readFileSync(pomPath, 'utf8'), packagePath, fs.writeFileSync);

