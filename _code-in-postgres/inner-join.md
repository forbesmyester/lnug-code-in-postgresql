---
layout: post
title:  "Some NoSQL databases do not support the INNER JOIN"
date:   2018-08-23 22:04:55 +0100
categories: postgresql
---

{% include code-in-postgres/tabs.html %}

## Results

{% include code-in-postgres/bin/inner-join.result.html %}

## JS

{% highlight js %}
{% include code-in-postgres/sql-spitting-image/select.js %}
{% endhighlight %}

{% highlight js %}
{% include code-in-postgres/sql-spitting-image/innerJoin.js %}
{% endhighlight %}

{% highlight js %}
{% include code-in-postgres/inner-join.js %}
{% endhighlight %}

### Pro's

 * We have created a useful methods in `get` and `indexBy` that appear to be quite reusable.
 * Duplicate `circuitId`'s do not cause duplicate races in final result.
 * Performance should be relatively linear and probably can still use indices.

### Con's

 * The code is relatively good at describing what it is doing as apposed to how, but there still is a lot more how in there than the SQL version.
 * Much longer than the SQL version.
 * The method `get` appears to be superfluous even though without it the code may crash if a circuit could not be found.
 * `qryCircuits` requires a `if (circuitIds.length == 0) { return []; }` to ensure it does not crash when a zero length set of `circuitId`'s is passed in.

I think this is pretty good code. There is of course the hassle of having to manage an ansynchronous database call dependant upon another and probably a good amount of extra memory usage from creating the const `indexedDriverResults` to allow simpler joining of the records.

The thing I do notice about this code when I read it is that it says to me

 1. Get the `raceResults` by running a query against the database.
 2. extract the `circuitId` from races and use it as a parameter to get the `circuitResults` from the database.
 3. Build an index of `circuitResults` using the `circuitId`.
 4. Map over the races and mix in some properties of the `indexedCircuitResults` into the returned race object... Oh! The `circuitId` of `raceRow` is used to look up the key of `indexedCircuitResults` which was originally the `circuitId` of `circuitResults`.

Now of course we can abstract this code further and mmake yourself a [nice flexible implementation](https://ramdajs.com/docs/#innerJoin) but you will still need to worry about argument order, perhaps remove the joining field, worry about sorting the final result and still find it re-implemented throughout your code base in a few different ways because they did not know the function existed...


## SQL
{% highlight sql linenos %}
{% include code-in-postgres/inner-join.sql %}
{% endhighlight %}

Why is this better? Well for a start it is far shorter, but it also conveys the meaning of what is happening instead of telling you the steps required to perform the operation.

### Pro's

 * Short and concise.
 * Shows clearly the column which is used to join the two record sets.
 * It is easy to see which data will be in the final output.
 * Likely can use indices on the server to find the required data.

### Con's

 * If there happened to be zero circuits with the correct `circuitId` lines would disappear from the result. Fix this by using a LEFT JOIN.
 * If there were two circuits with the same `circuitId` race data would be duplicated. This could be solved by using a sub select or prevented from happening with a PRIMARY KEY.

<script>
(function() {
    {% include jekyll-create-sections-from-headers.js %}
    {% include code-in-postgres/create-sections-to-support.js %}
}())
</script>
<style>
    {% include code-in-postgres/compare.css %}
</style>

