const CVSS = require('../lib/main.js');
const assert = require('assert');


describe('CVSS', function() {
    describe('#getScore()', function() {
    });

    describe('#getBaseScore()', function() {
    });

    describe('#getTemporalScore()', function(){ 
    });

    describe('#getEnvironmentalScore()', function() {
    });

    describe('#getRating()', function() {
        it('should return undefined when no params provided', function() {
            assert.equal(CVSS.getRating(), undefined);
        });

        it('should return "Critical" when score is 10', function() {
            assert.equal(CVSS.getRating(10), "Critical");
        });
    });

    describe('#getBase()', function() {});
    describe('#getTemporal()', function() {});
    describe('#getEnvironmental()', function() {});
    describe('#getAll()', function() {});
});
