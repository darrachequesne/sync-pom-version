var fs = require('fs');
var parse = require('xml-parser');

exports.main = function(pomContent, packageContent, writer) {
    var pom = parse(pomContent);
    var pomVersionNode = extractPomVersionNode(pom.root);
    if (!pomVersionNode) {
        var parent = extractParentNode(pom.root);
        pomVersionNode = extractPomVersionNode(parent);
    }

    var pomVersion = pomVersionNode.content.replace(/[\.-](RELEASE|FINAL)$/i, '');

    console.log('found version ' + pomVersion + ' in pom.xml');


    var json = JSON.parse(packageContent);
    var packageVersion = json.version;

    console.log('found version ' + packageVersion + ' in package.json');

    if (pomVersion === packageVersion) {
        return;
    }

    json.version = mvnVersionToNpm(pomVersion);
    var newPackageContent = JSON.stringify(json);
    writer(newPackageContent);

    console.log('package.json updated to version ' + pomVersion);
};

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

function padToThreeNumbers(version) {
    var tokens = version.split('.').length ;
    var numbersToAdd =3-tokens;
    for(var i =0; i<numbersToAdd;i++){
        version = version+".0"
    }
    return version;
}

function mvnVersionToNpm (mvnVersion) {
    var tokens = mvnVersion.split("-");
    return padToThreeNumbers(tokens[0]) + (tokens.length == 2 ? "-" +  tokens[1] : "");
}
