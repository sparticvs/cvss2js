# cvss2js
Implementation of CVSSv2 in Javascript

# CVSSv2 is Old, Why Implement?
There are a number of folks that still use CVSSv2 because of certain metrics
than are important to their industry that have been removed from CVSSv3. This
is for them.

That said, I wanted to make sure that this implementation was compatible with
the popular CVSS JS implementation done by [Aaron
McCall](https://github.com/aaronmccall). This implementation only borrows the
function signatures to ensure that there is a drop in replacement (also, Aaron
did a good job on the API design).

# Requirements
This project now requires a minimum of Node version 8.

# Install
```js
npm i cvss2js
```

# Usage
```js
const cvss = require('cvss2js');

var score = cvss.getScore('AV:N/AC:M/Au:N/C:P/I:P/A:P');

console.log(score); // -> 6.8

var rating = cvss.getRating(score);

console.log(rating); // -> Medium
```

# API

## getScore(input, options={})

### Description
Computes a CVSSv2 score based on the input provided.

### Returns
Returns a number value between 0 and 10.

### Parameters
`input` is assumed to be of the types `String` or `Object`. Expected format for
a String value is a valid CVSSv2 Vector String (e.g. `AV:L/AC:M/Au:N/C:N/I:P/A:C`).
Expected format for a Object should look like so:
```
    valid_object = {
        AV: 'L',
        AC: 'M',
        Au: 'N',
        C: 'N',
        I: 'P',
        A: 'C',
    };
```

It isn't necessary to provide any metrics beyond Base Score Metrics.

**Usage Note**: Calculators like NVD's CVSSv2 Calculator produces vector
strings that are wrapped with parenthesis. These will cause an issue in the
current implementation of this library. Open a feature request if you really
want this supported.

`options` is an optional parameter that can control how the score is computed.
By default the function acts the same as a call to `getEnvironmentalScore`. The
options object can accept the following keys:
  * `throw`: If validation returns an error, throw an error. This is default functionality if `options` is excluded.
  * `baseOnly`: Only consider the base metrics when computing the score. Will ignore all other provided metrics. Effectively calls `getBaseScore`.
  * `temporal`: Include temporal metrics when computing the score. Effectively calls `getTemporalScore`.
  * `environmental`: Include both temporal and environmental metrics when computing the score. This is the default functionality if `options` is excluded.

### Exceptions
This function throws exceptions when invalid data is provided.

## getBaseScore(input, options={})

### Description
Computes a CVSSv2 score based only on the Base Score metrics. Effectively an
alias to `getScore(input, {baseOnly: true})`.

### Returns
Returns a number value between 0 and 10.

### Parameters

## getTemporalScore(input, options={})

### Description
Computes a CVSSv2 score using Base and Temporal Metrics. Effectively an alias
to `getScore(input, {temporal: true})`.

### Returns
Returns a number value between 0 and 10.

### Parameters

## getEnvironmentalScore(input, options={})

### Description
Computes a CVSSv2 score using all of the metrics provided. Effectively an alias
to `getScore(input)` or `getScore(input, {environmental: true})`.

### Returns
Returns a number value between 0 and 10.

### Parameters

## getRating(score)

### Description
Produces a rating based on the CVSSv2 score that is provided.

### Returns
Returns a string describing the rating of the score. By default the
configuration of this function returns the following ratings based on the
following ranges:

  * score < 0.1 : None
  * 0.1 <= score < 4 : Low
  * 4 <= score < 7 : Medium
  * 7 <= score < 9 : High
  * 9 <= score: Critical

**Note:** Currently this is not configurable. I will implement the
configurability based on demand.

### Parameters

## getBase(input, options={})

### Description

### Returns

### Parameters

## getTemporal(input, options={})

### Description

### Returns

### Parameters

## getEnvironmental(input, options={})

### Description

### Returns

### Parameters

## getAll(input, options={})

### Description

### Returns

### Parameters

# References

  1. [NIST NVD CVSSv2 Calculator](https://nvd.nist.gov/vuln-metrics/cvss/v2-calculator)
  2. [FIRST CVSSv2 Specification]()
