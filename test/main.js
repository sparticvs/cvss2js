const CVSS = require('../lib/main.js');
const assert = require('assert');


describe('CVSS', function() {
    describe('#getScore()', function() {
        it('should return 6.8 when given "AV:N/AC:M/Au:N/C:P/I:P/A:P"', function() {
            assert.equal(CVSS.getScore("AV:N/AC:M/Au:N/C:P/I:P/A:P"), 6.8);
        });

        it('should return 5.2 when given "AV:N/AC:M/Au:N/C:P/I:P/A:P/E:U/RL:TF/RC:C"', function() {
            assert.equal(CVSS.getScore("AV:N/AC:M/Au:N/C:P/I:P/A:P/E:U/RL:TF/RC:C"), 5.2);
        });

        it('should return 1.6 when given "AV:N/AC:M/Au:N/C:P/I:P/A:P/E:U/RL:TF/RC:C/CDP:LM/TD:L/CR:M/IR:M/AR:L"', function() {
            assert.equal(CVSS.getScore("AV:N/AC:M/Au:N/C:P/I:P/A:P/E:U/RL:TF/RC:C/CDP:LM/TD:L/CR:M/IR:M/AR:L"), 1.6);
        });

        it('should throw an exception when given "AV:N/Au:N/A:P"', function() {
            assert.throws(() => { CVSS.getScore("AV:N/Au:N/A:P") }, Error);
        });
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
