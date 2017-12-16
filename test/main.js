const CVSS = require('../lib/main.js');
const assert = require('assert');

assert(CVSS.getRating(10) === "Critical", "Rating returned was unexpected");


console.log('Testing is complete');
