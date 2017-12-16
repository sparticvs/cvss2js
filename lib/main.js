/**
 * Copyright (c) 2017 - Charles `sparticvs` Timko
 */

function __parseVectorString(input) {

    if(typeof input !== "string") {
        throw "Vector string must be a string";
    }

    var vectorObj = {
        AV: "",
        AC: "",
        Au: "",
        C: "",
        I: "",
        A: "",
        E: "ND",
        RL: "ND",
        RC: "ND",
        CDP: "ND",
        TD: "ND",
        CR: "ND",
        IR: "ND",
        AR: "ND",
    };

    metrics = input.split("/");

    metrics.forEach(function(metric) {
        kvPair = metric.split(":");
        if(kvPair.length !== 2) {
            throw "Metric format is not correct";
        }

        vectorObj[kvPair[0]] = kvPair[1];
    });

    return vectorObj;
}

function __toVectorString(input) {

    if(typeof input !== "object") {
        throw "Input needs to be an object";
    }

    var vectorStr = 'AV:' + input['AV'] + '/AC:' + input['AC'] + '/Au:' + input['Au'] + '/C:' + input['C'] + '/I:' + input['I'] + '/A:' + input['A'] + '/E:' + input['E'] + '/RL:' + input['RL'] + '/RC:' + input['RC'] + '/CDP:' + input['CDP'] + '/TD:' + input['TD'] + '/CR:' + input['CR'] + '/IR:' + input['IR'] + '/AR:' + input['AR'];

    return vectorStr;
}

/** Do some regex to ensure that the format is proper? **/
vector = __parseVectorString("AV:N/AC:M/Au:N/C:P/I:P/A:P");

test = __toVectorString(vector);
v2 = __parseVectorString(test);
test2 = __toVectorString(v2);
if(test === test2) {
    console.log("Pass");
} else {
    console.log("Fail");
}

const AccessVector = {
    L: 0.395,
    A: 0.646,
    N: 1.0,
};

const AccessComplexity = {
    H: 0.35,
    M: 0.61,
    L: 0.71,
};

const Authentication = {
    M: 0.45,
    S: 0.56,
    N: 0.704,
};

const Impacts = {
    N: 0.0,
    P: 0.275,
    C: 0.660,
};

const Exploitability = {
    U: 0.85,
    POC: 0.9,
    F: 0.95,
    H: 1.0,
    ND: 1.0,
};

const RemediationLevel = {
    OF: 0.87,
    TF: 0.90,
    W: 0.95,
    U: 1.0,
    ND: 1.0,
};

const ReportConfidence = {
    UC: 0.90,
    UR: 0.95,
    C: 1.0,
    ND: 1.0,
};

const CollateralDamagePotential = {
    N: 0.0,
    L: 0.1,
    LM: 0.3,
    MH: 0.4,
    H: 0.5,
    ND: 0.0,
};

const TargetDistribution = {
    N: 0.0,
    L: 0.25,
    M: 0.75,
    H: 1.0,
    ND: 1.0,
};

const Requirements = {
    L: 0.5,
    M: 1.0,
    H: 1.51,
    ND: 1.0,
};

function __computeImpact(conf, integrity, avail) {

    if(typeof conf !== "number" &&
        typeof integrity !== "number" &&
        typeof avail !== "number") {
        throw "Params are of the wrong type";
    }

    return (10.41 * (1 - (1 - conf) * (1 - integrity) * (1 - avail)));
}

function __computeExploitability(av, ac, au) {

    if(typeof av !== "number" &&
        typeof ac !== "number" &&
        typeof au !== "number") {
        throw "Params are of the wrong type";
    }

    return (20 * av * ac * au);
}

function __fImpact(impact) {

    if(typeof impact !== "number") {
        throw "Params are of the wrong type";
    }

    return (impact === 0) ? 0 : 1.176;
}

function __computeBaseScore(input) {
    
    impact = __computeImpact(Impacts[input.C], Impacts[input.I], Impacts[input.A]);
    exploitability = __computeExploitability(AccessVector[input.AV], AccessComplexity[input.AC], Authentication[input.Au]);
    baseScore = (((0.6 * impact) + (0.4 * exploitability) - 1.5) * __fImpact(impact)).toFixed(1);

    return Number.parseFloat(baseScore);
}

baseScore = __computeBaseScore(vector);
console.log("BaseScore: " + baseScore);

function __computeTemporalScore(input) {

    baseScore = __computeBaseScore(input);
    temporalScore = (Number.parseFloat(baseScore) * Exploitability[input.E] * RemediationLevel[input.RL] * ReportConfidence[input.RC]).toFixed(1);

    return Number.parseFloat(temporalScore);
}

temporalScore = __computeTemporalScore(vector, baseScore);
console.log("TemporalScore: " + temporalScore);

function __computeAdjustedImpact(input) {

    adjustedImpact = (10.41 * (1 - (1 - Impacts[input.C] * Requirements[input.CR]) * (1 - Impacts[input.I] * Requirements[input.IR]) * (1 - Impacts[input.A] * Requirements[input.AR])));
    return Math.min(10, adjustedImpact);
}

function __computeAdjustedBaseScore(input) {

    adjustedImpact = __computeAdjustedImpact(input);
    exploitability = __computeExploitability(AccessVector[input.AV], AccessComplexity[input.AC], Authentication[input.Au]);
    adjBaseScore = (((0.6 * adjustedImpact) + (0.4 * exploitability) - 1.5) * __fImpact(adjustedImpact)).toFixed(1);

    return Number.parseFloat(adjBaseScore); 
}

function __computeAdjustedTemporalScore(input) {

    adjBaseScore = __computeAdjustedBaseScore(input);
    adjTemporalScore = (adjBaseScore * Exploitability[input.E] * RemediationLevel[input.RL] * ReportConfidence[input.RC]).toFixed(1);

    return Number.parseFloat(adjTemporalScore);
}

function __computeEnvironmentalScore(input) {

    adjTemporalScore = __computeAdjustedTemporalScore(input);
    environmentalScore = ((adjTemporalScore + (10 - adjTemporalScore) * CollateralDamagePotential[input.CDP]) * TargetDistribution[input.TD]).toFixed(1);

    return Number.parseFloat(environmentalScore);
}

environmentalScore = __computeEnvironmentalScore(vector);
console.log("EnvironmentalScore: " + environmentalScore);

function __inRange(range, value) {
    if(typeof range !== "string" &&
        typeof value !== "number") {
        throw "Params are not the correct type";
    }

    rangeRegEx = /([\d\.]+)-([\d\.]+)/;
    match = rangeRegEx.exec(range);

    low = Number.parseFloat(match[1]);
    high = Number.parseFloat(match[2]);

    return low <= value && value < high;
}

const Ratings = {
    '0-0.1': 'Informational',
    '0.1-4': 'Low',
    '4-7': 'Medium',
    '7-9': 'High',
    '9-10.1': 'Critical',
};

function __getRating(score) {
    for(const props in Ratings) {
        if(__inRange(props, score)) {
            return Ratings[props];
        }
    }
    return undefined;
}

console.log("Info: " + __getRating(0));
console.log("Low: " + __getRating(2));
console.log("Med: " + __getRating(5));
console.log("High: " + __getRating(8));
console.log("Crit: " + __getRating(10));

function getScore(input, options = {}) {
}
exports.getScore = getScore;

function getBaseScore(input, options = {}) {
}
exports.getBaseScore = getBaseScore;

function getTemporalScore(input, options = {}) {
}
exports.getTemporalScore = getTemporalScore;

function getEnvironmentalScore(input, options = {}) {
}
exports.getEnvironmentalScore = getEnvironmentalScore;

function getRating(score) {
    return __getRating(score);
}
exports.getRating = getRating;

function getBase(input, options = {}) {
}
exports.getBase = getBase;

function getTemporal(input, options = {}) {
}
exports.getTemporal = getTemporal;

function getEnvironmental(input, options = {}) {
}
exports.getEnvironmental = getEnvironmental;

function getAll(input, options = {}) {
}
exports.getAll = getAll;
