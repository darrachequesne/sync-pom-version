var assert = require('assert');

var syncPom = require('../../syncpom.js');

// Test ancora da fare
// 2) pom su due cifre ma package.json già aggiornato
// 3) pom già su tre cifre ma package.json già aggiornato
// 4) versione pom sul parent

var pomContent = "";
var packageJsonContent = "";

describe('sync-pom-version tests', function () {
    beforeEach(function () {
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

    describe('version on pom.xml', function () {
        beforeEach(function () {
            pomContent = "<project xmlns=\"http://maven.apache.org/POM/4.0.0\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:schemaLocation=\"http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd\">\n" +
                "    <modelVersion>4.0.0</modelVersion>\n" +
                "    <artifactId>my-project</artifactId>\n" +
                "    <packaging>jar</packaging>\n" +
                "    <name>my project</name>\n" +
                "    <description>my project</description>\n" +
                "    <version>######</version>\n" +
                "</project>";
        });


        it('pom has an updated version on two digits -> package.json should be updated with the same version of pom on three digits', function () {
            var POM_NEW_VERSION = "1.35";
            var PACKAGE_JSON_OLD_VERSION = "1.34.0";
            var PACKAGE_JSON_EXPECTED_NEW_VERSION = "1.35.0";

            testVersionReplacement(POM_NEW_VERSION, PACKAGE_JSON_OLD_VERSION, PACKAGE_JSON_EXPECTED_NEW_VERSION);
        });

        it('pom has an updated SNAPSHOT version on two digits -> package.json should be updated with the same SNAPSHOT version of pom on three digits', function () {
            var POM_NEW_VERSION = "1.35-SNAPSHOT";
            var PACKAGE_JSON_OLD_VERSION = "1.34.0";
            var PACKAGE_JSON_EXPECTED_NEW_VERSION = "1.35.0-SNAPSHOT";

            testVersionReplacement(POM_NEW_VERSION, PACKAGE_JSON_OLD_VERSION, PACKAGE_JSON_EXPECTED_NEW_VERSION);
        });

        it('pom has an updated version on three digits -> package.json should be updated with the same version of pom', function () {
            var POM_NEW_VERSION = "1.35.2";
            var PACKAGE_JSON_OLD_VERSION = "1.34.0";
            var PACKAGE_JSON_EXPECTED_NEW_VERSION = "1.35.2";

            testVersionReplacement(POM_NEW_VERSION, PACKAGE_JSON_OLD_VERSION, PACKAGE_JSON_EXPECTED_NEW_VERSION);
        });

        it('pom has a version on two digits, package.json already has the same version on three digits  -> no updates expected', function () {
            var POM_NEW_VERSION = "1.35";
            var PACKAGE_JSON_OLD_VERSION = "1.35.0";

            testNoReplacementOccurred(POM_NEW_VERSION, PACKAGE_JSON_OLD_VERSION);
        });

        it('pom has a version on three digits, package.json already has the same version -> no updates expected', function () {
            var POM_NEW_VERSION = "1.35.3";
            var PACKAGE_JSON_OLD_VERSION = "1.35.3";

            testNoReplacementOccurred(POM_NEW_VERSION, PACKAGE_JSON_OLD_VERSION);
        });


        it('pom has an updated version on two digits and RELEASE suffix -> package.json should be updated with three digits and no RELEASE suffix', function () {
            var POM_NEW_VERSION = "1.35-RELEASE";
            var PACKAGE_JSON_OLD_VERSION = "1.34.0";
            var PACKAGE_JSON_EXPECTED_NEW_VERSION = "1.35.0";

            testVersionReplacement(POM_NEW_VERSION, PACKAGE_JSON_OLD_VERSION, PACKAGE_JSON_EXPECTED_NEW_VERSION);
        });

    });

    describe("version on parent pom", function () {
        it('parent pom has an updated version on two digits -> package.json should be updated with the same version of the parent pom on three digits', function () {
            pomContent = "<project xmlns=\"http://maven.apache.org/POM/4.0.0\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:schemaLocation=\"http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd\">\n" +
                "    <modelVersion>4.0.0</modelVersion>\n" +
                "    <artifactId>my-project</artifactId>\n" +
                "    <packaging>jar</packaging>\n" +
                "    <name>my project</name>\n" +
                "    <description>my project</description>\n" +
                "    <parent>\n" +
                "\t    <groupId>myGroupId</groupId>\n" +
                "\t    <artifactId>myParent</artifactId>\n" +
                "\t    <version>######</version>\n" +
                "    </parent>";

            var POM_NEW_VERSION = "1.35";
            var PACKAGE_JSON_OLD_VERSION = "1.34.0";
            var PACKAGE_JSON_EXPECTED_NEW_VERSION = "1.35.0";

            testVersionReplacement(POM_NEW_VERSION, PACKAGE_JSON_OLD_VERSION, PACKAGE_JSON_EXPECTED_NEW_VERSION);
        });
    });

});

    function testVersionReplacement(POM_NEW_VERSION, PACKAGE_JSON_OLD_VERSION, PACKAGE_JSON_EXPECTED_NEW_VERSION) {
        pomContent = setVersion(pomContent, POM_NEW_VERSION);
        packageJsonContent = setVersion(packageJsonContent, PACKAGE_JSON_OLD_VERSION);
        var packageVersion = "";

        syncPom.main(pomContent, packageJsonContent, function (content) {
            packageVersion = JSON.parse(content).version;
        });

        assert.equal(packageVersion, PACKAGE_JSON_EXPECTED_NEW_VERSION)
    }

    function testNoReplacementOccurred(POM_NEW_VERSION, PACKAGE_JSON_OLD_VERSION) {
        pomContent = setVersion(pomContent, POM_NEW_VERSION);
        packageJsonContent = setVersion(packageJsonContent, PACKAGE_JSON_OLD_VERSION);

        syncPom.main(pomContent, packageJsonContent, function (content) {
            assert.fail("Unexpected attempt to write the following updated package.json:\n\n " + content);
        });
    }

    function setVersion(content, version) {
        return content.replace("######", version);
    }