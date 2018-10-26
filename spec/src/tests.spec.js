var assert = require('assert');

var syncPom = require('../../syncpom.js');

describe('Array', function() {
    describe('pom have a different version on two digits', function() {
        it('updates the version number on package.json with the same version of pom on three digits', function() {

            syncPom.main("spec/resources/test-digits/pom.xml", "spec/resources/test-digits/package.json", function(path, content) {
                console.log(content);
            });

        });
    });
});