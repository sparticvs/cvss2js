const CVSS = require('../lib/main.js');
const assert = require('assert');

const TEST_BASE = "AV:N/AC:M/Au:N/C:P/I:P/A:P";
const TEST_TEMP = "AV:N/AC:M/Au:N/C:P/I:P/A:P/E:U/RL:TF/RC:C";
const TEST_ENV = "AV:N/AC:M/Au:N/C:P/I:P/A:P/E:U/RL:TF/RC:C/CDP:LM/TD:L/CR:M/IR:M/AR:L";

const TEST_OBJ = {"AV": "N", "AC": "M", "Au":"N", "C":"P", "I":"P", "A":"P"};

describe('CVSS', function() {
    describe('#getScore()', function() {
        it('should return 6.8 when given "' + TEST_BASE + '"', function() {
            assert.equal(CVSS.getScore(TEST_BASE), 6.8);
        });

        it('should return 5.2 when given "' + TEST_TEMP + '"', function() {
            assert.equal(CVSS.getScore(TEST_TEMP), 5.2);
        });

        it('should return 1.6 when given "' + TEST_ENV + '"', function() {
            assert.equal(CVSS.getScore(TEST_ENV), 1.6);
        });

        it('should return 6.8 when given "' + TEST_ENV + '" and only wanting Base Score', function() {
            assert.equal(CVSS.getScore(TEST_ENV, {baseOnly: true}), 6.8);
        });

        it('should return 5.2 when given "' + TEST_ENV + '" and only wanting Temporal Score', function() {
            assert.equal(CVSS.getScore(TEST_ENV, {temporal: true}), 5.2);
        });

        it('should throw an exception when given "AV:N/Au:N/A:P"', function() {
            assert.throws(() => { CVSS.getScore("AV:N/Au:N/A:P") }, Error);
        });

        it('should return 6.8 when given "' + JSON.stringify(TEST_OBJ) + '"', function() {
            assert.equal(CVSS.getScore(TEST_OBJ), 6.8);
        });
    });

    describe('#getBaseScore()', function() {
        it('should return 6.8 when given "' + TEST_BASE + '"', function() {
            assert.equal(CVSS.getBaseScore(TEST_BASE), 6.8);
        });

        it('should return 5.2 when given "' + TEST_TEMP + '"', function() {
            assert.equal(CVSS.getBaseScore(TEST_TEMP), 6.8);
        });

        it('should return 1.6 when given "' + TEST_ENV + '"', function() {
            assert.equal(CVSS.getBaseScore(TEST_ENV), 6.8);
        });

        it('should throw an exception when given "AV:N/Au:N/A:P"', function() {
            assert.throws(() => { CVSS.getBaseScore("AV:N/Au:N/A:P") }, Error);
        });
    });

    describe('#getTemporalScore()', function() { 
        it('should return 6.8 when given "' + TEST_BASE + '"', function() {
            assert.equal(CVSS.getTemporalScore(TEST_BASE), 6.8);
        });

        it('should return 5.2 when given "' + TEST_TEMP + '"', function() {
            assert.equal(CVSS.getTemporalScore(TEST_TEMP), 5.2);
        });

        it('should return 1.6 when given "' + TEST_ENV + '"', function() {
            assert.equal(CVSS.getTemporalScore(TEST_ENV), 5.2);
        });
    });

    describe('#getEnvironmentalScore()', function() {
        it('should return 6.8 when given "' + TEST_BASE + '"', function() {
            assert.equal(CVSS.getEnvironmentalScore(TEST_BASE), 6.8);
        });

        it('should return 5.2 when given "' + TEST_TEMP + '"', function() {
            assert.equal(CVSS.getEnvironmentalScore(TEST_TEMP), 5.2);
        });

        it('should return 1.6 when given "' + TEST_ENV + '"', function() {
            assert.equal(CVSS.getEnvironmentalScore(TEST_ENV), 1.6);
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

    describe('#getBase()', function() {
        it('should return an object matching the expected', function() {
            let result = CVSS.getBase(TEST_ENV);
            let expected = {
                score: 6.8,
                rating: 'Medium',
            };
            assert.deepEqual(result, expected);
        });
    });

    describe('#getTemporal()', function() {
        it('should return an object matching the expected', function() {
            let result = CVSS.getTemporal(TEST_ENV);
            let expected = {
                score: 5.2,
                rating: 'Medium',
            };
            assert.deepEqual(result, expected);
        });
    });
    
    describe('#getEnvironmental()', function() {
        it('should return an object matching the expected', function() {
            let result = CVSS.getEnvironmental(TEST_ENV);
            let expected = {
                score: 1.6,
                rating: 'Low',
            };
            assert.deepEqual(result, expected);
        });
    });
    
    describe('#getAll()', function() {
        it('should return an object matching the expected', function() {
            let result = CVSS.getAll(TEST_ENV);
            let expected = {
                base: {
                    score: 6.8,
                    rating: 'Medium',
                },
                temporal: {
                    score: 5.2,
                    rating: 'Medium',
                },
                environmental: {
                    score: 1.6,
                    rating: 'Low',
                },
            };
            assert.deepEqual(result, expected);
        });
    });
});
