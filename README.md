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


