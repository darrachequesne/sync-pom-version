var program = require('commander');
var fs = require('fs');
var parse = require('xml-parser');

var defaultPom = "pom.xml";
var defaultPackage = "package.json";
var defaultRegex = "(\\d+).(\\d+).(\\d+).*";
var defaultReplacement = "$1.$2.$3";

program
    .usage('[' + defaultPom + '] [' + defaultPackage + ']')
    .option('-s, --source [source]', 'the regular expression used to parse the POM version', defaultRegex)
    .option('-t, --target [target]', 'the replacement used to set the package.json version', defaultReplacement)
    .parse(process.argv);

var pomPath = program.args[0] || defaultPom;
var packagePath = program.args[1] || defaultPackage;
main(pomPath, packagePath);

function main (pomPath, packagePath) {
  var pomContent = fs.readFileSync(pomPath, 'utf8');
  var pom = parse(pomContent);
  var pomVersionNode = extractPomVersionNode(pom.root);
  if (!pomVersionNode) {
      var parent = extractParentNode(pom.root);
      pomVersionNode = extractPomVersionNode(parent);
  }

  var pomVersion = pomVersionNode.content;
  console.log('found version ' + pomVersion + ' in pom.xml');

  var packageContent = fs.readFileSync(packagePath, 'utf8');
  var packageVersion = JSON.parse(packageContent).version;
  console.log('found version ' + packageVersion + ' in package.json');

  var pomRegex = program.source || defaultRegex;
  var packageReplacement = program.target || defaultReplacement;
  var newPackageVersion = pomVersion.replace(new RegExp(pomRegex), packageReplacement);

  if (packageVersion === newPackageVersion) {
    return;
  }

  var newPackageContent = packageContent.replace(formatVersion(packageVersion), formatVersion(newPackageVersion));
  fs.writeFileSync(packagePath, newPackageContent, 'utf8');
  console.log('package.json updated to version ' + newPackageVersion);
}

function extractParentNode(node) {
    return node.children.filter(function (item) {
        return item.name === 'parent';
    })[0];
}

function extractPomVersionNode(parent) {
    return parent.children.filter(function (item) {
        return item.name === 'version';
    })[0];
}

function formatVersion (version) { return '"version": "' + version + '"'; }