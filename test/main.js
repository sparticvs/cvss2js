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
        it('should return 6.8 when given "AV:N/AC:M/Au:N/C:P/I:P/A:P"', function() {
            assert.equal(CVSS.getBaseScore("AV:N/AC:M/Au:N/C:P/I:P/A:P"), 6.8);
        });

        it('should return 6.8 when given "AV:N/AC:M/Au:N/C:P/I:P/A:P/E:U/RL:TF/RC:C"', function() {
            assert.equal(CVSS.getBaseScore("AV:N/AC:M/Au:N/C:P/I:P/A:P/E:U/RL:TF/RC:C"), 6.8);
        });

        it('should return 6.8 when given "AV:N/AC:M/Au:N/C:P/I:P/A:P/E:U/RL:TF/RC:C/CDP:LM/TD:L/CR:M/IR:M/AR:L"', function() {
            assert.equal(CVSS.getBaseScore("AV:N/AC:M/Au:N/C:P/I:P/A:P/E:U/RL:TF/RC:C/CDP:LM/TD:L/CR:M/IR:M/AR:L"), 6.8);
        });
    });

    describe('#getTemporalScore()', function() { 
        it('should return 6.8 when given "AV:N/AC:M/Au:N/C:P/I:P/A:P"', function() {
            assert.equal(CVSS.getTemporalScore("AV:N/AC:M/Au:N/C:P/I:P/A:P"), 6.8);
        });

        it('should return 5.2 when given "AV:N/AC:M/Au:N/C:P/I:P/A:P/E:U/RL:TF/RC:C"', function() {
            assert.equal(CVSS.getTemporalScore("AV:N/AC:M/Au:N/C:P/I:P/A:P/E:U/RL:TF/RC:C"), 5.2);
        });

        it('should return 5.2 when given "AV:N/AC:M/Au:N/C:P/I:P/A:P/E:U/RL:TF/RC:C/CDP:LM/TD:L/CR:M/IR:M/AR:L"', function() {
            assert.equal(CVSS.getTemporalScore("AV:N/AC:M/Au:N/C:P/I:P/A:P/E:U/RL:TF/RC:C/CDP:LM/TD:L/CR:M/IR:M/AR:L"), 5.2);
        });
    });

    describe('#getEnvironmentalScore()', function() {
        it('should return 6.8 when given "AV:N/AC:M/Au:N/C:P/I:P/A:P"', function() {
            assert.equal(CVSS.getEnvironmentalScore("AV:N/AC:M/Au:N/C:P/I:P/A:P"), 6.8);
        });

        it('should return 5.2 when given "AV:N/AC:M/Au:N/C:P/I:P/A:P/E:U/RL:TF/RC:C"', function() {
            assert.equal(CVSS.getEnvironmentalScore("AV:N/AC:M/Au:N/C:P/I:P/A:P/E:U/RL:TF/RC:C"), 5.2);
        });

        it('should return 1.6 when given "AV:N/AC:M/Au:N/C:P/I:P/A:P/E:U/RL:TF/RC:C/CDP:LM/TD:L/CR:M/IR:M/AR:L"', function() {
            assert.equal(CVSS.getEnvironmentalScore("AV:N/AC:M/Au:N/C:P/I:P/A:P/E:U/RL:TF/RC:C/CDP:LM/TD:L/CR:M/IR:M/AR:L"), 1.6);
        });
    });

    describe('#getRating()', function() {
        it('should return undefined when no params provided', function() {
            assert.equal(CVSS.getRating(), undefined);
        });

        it('should return "Informational" when score is 0', function() {
            assert.equal(CVSS.getRating(0), "Informational");
        });

        it('should return "Low" when score is 0.1', function() {
            assert.equal(CVSS.getRating(0.1), "Low");
        });

        it('should return "Medium" when score is 4', function() {
            assert.equal(CVSS.getRating(4), "Medium");
        });

        it('should return "High" when score is 7', function() {
            assert.equal(CVSS.getRating(7), "High");
        });

        it('should return "Critical" when score is 9', function() {
            assert.equal(CVSS.getRating(9), "Critical");
        });
    });

    describe('#getBase()', function() {});
    describe('#getTemporal()', function() {});
    describe('#getEnvironmental()', function() {});
    describe('#getAll()', function() {});
});
