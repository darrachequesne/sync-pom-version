var assert = require('assert');

var syncPom = require('../../syncpom.js');

describe('Array', function() {
    var pomContent ="";
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
        });

        it('updates the version number on package.json with the same version of pom on three digits', function() {
            pomContent = setVersion(pomContent, "1.35-SNAPSHOT");
            var packageVersion="";

            syncPom.main(pomContent, "spec/resources/test-digits/package.json", function(path, content) {
                packageVersion = JSON.parse(content).version;
            });
            assert.equal(packageVersion,"1.22-SNAPSHOT")

        });
    });
});

function setVersion(content, version) {
    return content.replace("######", version);
}