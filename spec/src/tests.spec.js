var assert = require('assert');

var syncPom = require('../../syncpom.js');

describe('Array', function() {
    var pomContent ="";
    var packageJsonContent = "";
    describe('pom have a different version on two digits', function() {
        beforeEach(()=>{
            pomContent = "<project xmlns=\"http://maven.apache.org/POM/4.0.0\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:schemaLocation=\"http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd\">\n" +
                "    <modelVersion>4.0.0</modelVersion>\n" +
                "    <artifactId>my-project</artifactId>\n" +
                "    <packaging>jar</packaging>\n" +
                "    <name>my project</name>\n" +
                "    <description>my project</description>\n" +
                "    <version>######</version>\n" +
                "</project>"

            packageJsonContent = JSON.stringify({
                "name": "@myCompany/my-project",
                "version": "######",
                "description": "my project",
                "scripts": {
                    "test": "echo \"Error: no test specified\" && exit 1",
                },
                "author": "xxx",
            });
        });

        it('updates the version number on package.json with the same version of pom on three digits', function() {
            var POM_NEW_VERSION = "1.35";
            var PACKAGE_JSON_OLD_VERSION = "1.34.0";
            var PACKAGE_JSON_EXPECTED_NEW_VERSION = "1.35.0";

            pomContent = setVersion(pomContent, POM_NEW_VERSION);
            packageJsonContent = setVersion(packageJsonContent, PACKAGE_JSON_OLD_VERSION);
            var packageVersion="";

            syncPom.main(pomContent, packageJsonContent, function(content) {
                packageVersion = JSON.parse(content).version;
            });

            assert.equal(packageVersion, PACKAGE_JSON_EXPECTED_NEW_VERSION)
        });

        it('updates the version number on package.json with the same version of pom on three digits', function() {
            var POM_NEW_VERSION = "1.35-SNAPSHOT";
            var PACKAGE_JSON_OLD_VERSION = "1.34.0";
            var PACKAGE_JSON_EXPECTED_NEW_VERSION = "1.35.0-SNAPSHOT";

            pomContent = setVersion(pomContent, POM_NEW_VERSION);
            packageJsonContent = setVersion(packageJsonContent, PACKAGE_JSON_OLD_VERSION);
            var packageVersion="";

            syncPom.main(pomContent, packageJsonContent, function(content) {
                packageVersion = JSON.parse(content).version;
            });

            assert.equal(packageVersion, PACKAGE_JSON_EXPECTED_NEW_VERSION)
        });

    });
});

function setVersion(content, version) {
    return content.replace("######", version);
}