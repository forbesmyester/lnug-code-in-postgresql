---
layout: post
title:  Simple Unit Testing in PostgreSQL
date:   2018-10-26 18:15:30 +0100
categories: postgresql
---

As much as I know that writing stored procedures in any database is more painful than in your normal programming language there are sometimes very good reasons for doing this. I am thinking of situations like the following:

 * Getting the result requires vast amounts of data which is stored in the database.
 * The result itself is quite small.
 * You need an aggregate or use a window function, like MIN, MAX or RANK etc, but not one that already exists inside PostgreSQL.

So you have decided to build a [custom aggregate](/code-in-postgres/custom-aggregates.html), but as you are coding and because it's in a weird language you are not an expert in you feel you need to test it.

If you look at testing frameworks for PostgreSQL you will find [PgTap](https://pgtap.org/), which is a fine testing framework but requires Python and seems overkill when you just want to test some procedures/functions.

I have recently used [mixerp/plpgunit](https://github.com/mixerp/plpgunit) which exists solely within the database itself, so you write your tests in PLPGSQL and have no libraries or code to maintain in your code base.

installation is as simple as:

    curl https://raw.githubusercontent.com/mixerp/plpgunit/master/install/0.uninstall-unit-test.sql | psql

    curl https://raw.githubusercontent.com/mixerp/plpgunit/master/install/1.install-unit-test.sql | psql

## How to define a custom aggregate

A custom aggregate can be as easy as filling in the gaps of the following:

{% highlight sql linenos %}
{% include plpgunit-the-aggregate.sql %}
{% endhighlight %}

We have a few missing elements here, but don't worry, I will explain what they
are and then we will fill them in.

## If we were writing this in JavaScript...

Imagine if you wanted  to use a [`reduce`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)
function in Javascript. It has the following signature:

```
arr.reduce(callback[, initialValue])
```

And the `callback` has the following signature:

```
callback(accumulator, currentValue)
```

Therefore if you wanted to get the sum of the three highest humbers you may write the following

```
function callback(accumulator, currentValue) {
    if (accumulator.length < 3) {
        return accumulator.concat([currentValue]);
    }
    const min = inp.reduce((a, b) => Math.min(a, b), 99);
    const r = accumulator.concat([]);
    r.splice(inp.indexOf(min), 1);
    return r;
};

function finalize(arr) {
    let result = 0;
    for (let i = 0; i < arr.length; i++) {
        result = result + arr[i];
    }
    return result;
}

let reduceResult = [4, 3, 1, 5, 2].reduce(callback, []);
console.log(finalize(x));
```

And get the answer `6`.

## Converting the JavaScript back to SQL

### stype

The `stype` is the type of the `accumulator` and `returnResult`, it is also the type of the second argument to reduce.

This would be called an "Array of Number" in JavaScript, `Number[]` in TypeScript, but in SQL it would be `int[]`.

### initcond


