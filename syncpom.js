var fs = require('fs');
var parse = require('xml-parser');

exports.main = function(pomContent, packageContent, writer) {
    var pom = parse(pomContent);
    var pomVersionNode = extractPomVersionNode(pom.root);
    if (!pomVersionNode) {
        var parent = extractParentNode(pom.root);
        pomVersionNode = extractPomVersionNode(parent);
    }

    var pomVersion = pomVersionNode.content;
    console.log('found version ' + pomVersion + ' in pom.xml');

    var json = JSON.parse(packageContent);

    var packageVersion = json.version;
    console.log('found version ' + packageVersion + ' in package.json');

    var newPackageVersion = mvnVersionToNpm(pomVersion);
    if (newPackageVersion === packageVersion) {
        return;
    }

    json.version = newPackageVersion;
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

function padToNPMVersion(version) {
    var NPM_VERSION_SEQUENCES = 3;

    var tokens = version.split('.').length;
    var missingSeq = NPM_VERSION_SEQUENCES - tokens;
    for (var i = 0; i < missingSeq; i++) {
        version = version + ".0"
    }
    return version;
}

function mvnVersionToNpm (mvnVersion) {
    var normalizedMvnVersion = mvnVersion.replace(/[\.-](RELEASE|FINAL)$/i, '');
    var tokens = mvnVersion.split("-");
    var snapshotSuffix = (tokens.length == 2 ? "-" +  tokens[1] : "");
    return padToNPMVersion(tokens[0]) + snapshotSuffix;
}
