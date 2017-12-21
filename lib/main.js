/**
 * Copyright (c) 2017 - Charles `sparticvs` Timko
 */
function __isValidVectorString(input) {
    if(typeof input !== "string") {
        throw "Vector string must be a string";
    }

    const regex = /AV:[LAN]\/AC:[HML]\/Au:[MSN]\/C:[NPC]\/I:[NPC]\/A:[NPC](\/E:(ND|U|POC|F|H)\/RL:(ND|OF|TF|W|U)\/RC:(ND|UC|UR|C))?(\/CDP:(ND|N|L|LM|MH|H)\/TD:(ND|N|L|M|H)\/CR:(ND|L|M|H)\/IR:(ND|L|M|H)\/AR:(ND|L|M|H))?/;

    return input.match(regex) !== null;
}

function __prepareVectorObj(input) {
    if(typeof input !== "object") {
        throw new Error('param should be of type object');
    }

    const vectorObj = {
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

    return Object.assign({}, input, vectorObj);
}

function __parseVectorString(input) {

    if(typeof input !== "string") {
        throw "Vector string must be a string";
    }

    const vectorObj = {
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
    let scoreObj = {};
    
    impact = __computeImpact(Impacts[input.C], Impacts[input.I], Impacts[input.A]);
    exploitability = __computeExploitability(AccessVector[input.AV], AccessComplexity[input.AC], Authentication[input.Au]);
    baseScore = (((0.6 * impact) + (0.4 * exploitability) - 1.5) * __fImpact(impact)).toFixed(1);

    scoreObj["base"] = Number.parseFloat(baseScore);

    return scoreObj;
}

function __computeTemporalScore(input) {

    scoreObj = __computeBaseScore(input);
    let baseScore = scoreObj['base'];
    temporalScore = (baseScore * Exploitability[input.E] * RemediationLevel[input.RL] * ReportConfidence[input.RC]).toFixed(1);

    scoreObj['temporal'] = Number.parseFloat(temporalScore);

    return scoreObj;
}

function __computeAdjustedImpact(input) {

    adjustedImpact = (10.41 * (1 - (1 - Impacts[input.C] * Requirements[input.CR]) * (1 - Impacts[input.I] * Requirements[input.IR]) * (1 - Impacts[input.A] * Requirements[input.AR])));
    return Math.min(10, adjustedImpact);
}

function __computeAdjustedBaseScore(input) {

    let scoreObj = {};
    adjustedImpact = __computeAdjustedImpact(input);
    exploitability = __computeExploitability(AccessVector[input.AV], AccessComplexity[input.AC], Authentication[input.Au]);
    adjBaseScore = (((0.6 * adjustedImpact) + (0.4 * exploitability) - 1.5) * __fImpact(adjustedImpact)).toFixed(1);

    scoreObj['base'] = Number.parseFloat(adjBaseScore);
    return scoreObj;
}

function __computeAdjustedTemporalScore(input) {

    scoreObj = __computeAdjustedBaseScore(input);
    let adjBaseScore = scoreObj['base'];
    adjTemporalScore = (adjBaseScore * Exploitability[input.E] * RemediationLevel[input.RL] * ReportConfidence[input.RC]).toFixed(1);

    scoreObj['temporal'] = Number.parseFloat(adjTemporalScore);
    return scoreObj;
}

function __computeEnvironmentalScore(input) {

    
    scoreObj = __computeAdjustedTemporalScore(input);
    let adjTemporalScore = scoreObj['temporal'];
    environmentalScore = ((adjTemporalScore + (10 - adjTemporalScore) * CollateralDamagePotential[input.CDP]) * TargetDistribution[input.TD]).toFixed(1);

    scoreObj['environmental'] = Number.parseFloat(environmentalScore);
    return scoreObj;
}

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

const Compute = {
    base: __computeBaseScore,
    temporal: __computeTemporalScore,
    environmental: __computeEnvironmentalScore,
};

function __getRating(score) {
    for(const props in Ratings) {
        if(__inRange(props, score)) {
            return Ratings[props];
        }
    }
    return undefined;
}

function __getScore(input, func) {
    let vector = undefined;
    if(typeof input === "string") {
        if(__isValidVectorString(input)) {
            vector = __parseVectorString(input);
        } else {
            throw new Error("Invalid Vector String Format. Must be CVSSv2.");
        }
    } else if(typeof input === "object") {
        vector = __prepareVectorObj(input);
    } else {
        throw new Error("Invalid type for 'input'");
    }

    return func(vector);
}

function getScore(input, options = {}) {
    let key = 'environmental';
    if(options['baseOnly']) {
        key = 'base';
    }
    if(options['temporal']) {
        key = 'temporal';
    }
    if(options['env']) {
        key = 'environmental';
    }
    let scoreObj = __getScore(input, Compute[key]);
    return scoreObj[key];
}
exports.getScore = getScore;

function getBaseScore(input, options = {}) {
    return getScore(input, {baseOnly: true});
}
exports.getBaseScore = getBaseScore;

function getTemporalScore(input, options = {}) {
    return getScore(input, {temporal: true});
}
exports.getTemporalScore = getTemporalScore;

function getEnvironmentalScore(input, options = {}) {
    return getScore(input, {env: true});
}
exports.getEnvironmentalScore = getEnvironmentalScore;

function getRating(score) {
    return __getRating(score);
}
exports.getRating = getRating;

function getBase(input, options = {}) {
    score = getBaseScore(input, options);
    let scoreObj = {
        score: score,
        rating: getRating(score),
    };
    return scoreObj;
}
exports.getBase = getBase;

function getTemporal(input, options = {}) {
    score = getTemporalScore(input, options);
    let scoreObj = {
        score: score,
        rating: getRating(score),
    };
    return scoreObj;
}
exports.getTemporal = getTemporal;

function getEnvironmental(input, options = {}) {
    score = getEnvironmentalScore(input, options);
    let scoreObj = {
        score: score,
        rating: getRating(score),
    };
    return scoreObj;
}
exports.getEnvironmental = getEnvironmental;

function getAll(input, options = {}) {
    var scoreObj = {
        base: getBase(input, options),
        temporal: getTemporal(input, options),
        environmental: getEnvironmental(input, options),
    };
    return scoreObj;
}
exports.getAll = getAll;
