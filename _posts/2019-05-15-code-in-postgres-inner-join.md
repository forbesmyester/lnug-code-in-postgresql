---
layout: post
title:  "Code In PostgreSQL: Combining data from multiple tables with INNER JOIN"
date:   2019-05-14 07:00:20
categories: postgresql code-in-postgres
---

## This series of articles

This is the third of the [Code In Postgres](/code-in-postgres/). The previous article is available [here]({{ site.baseurl }}{% post_url 2019-03-12-code-in-postgres-with %}).

{% include code-in-postgres/about-body.md %}

{% include code-in-postgres/about-ergast.md %}

### The Aim

At the end of the [last article]({{ site.baseurl }}{% post_url 2019-03-12-code-in-postgres-with %}) we had the following dataset:

{% include code-in-postgres/bin/in-order-by-limit.result.html %}

I would like to augment this dataset with the names of the drivers, so the results would look something like the following:

{% include code-in-postgres/assets/inner-join.possible-result.html %}

Where <i>forename</i> and <i>surname</i> have the real values in.

#### Table Structure

![ERD Diagram](/images/2019-05-15-code-in-postgres-inner-join.erd.png)


#### Table Data


##### races

| raceId | year | round | circuitId |           name           |    date    |   time   |                             url                             |
|--------+------+-------+-----------+--------------------------+------------+----------+-------------------------------------------------------------|
|    971 | 2017 |     3 |         3 | Bahrain Grand Prix       | 2017-04-16 | 15:00:00 | https://en.wikipedia.org/wiki/2017_Bahrain_Grand_Prix|
|    977 | 2017 |     9 |        70 | Austrian Grand Prix      | 2017-07-09 | 12:00:00 | https://en.wikipedia.org/wiki/2017_Austrian_Grand_Prix|


##### driversStandings

| driverStandingsId | raceId | driverId | points | position | positionText | wins |
|-------------------+--------+----------+--------+----------+--------------+------ |
|             64795 |    856 |        1 |    196 |        5 | 5            |    2 |
|             64810 |    856 |        3 |     67 |        7 | 7            |    0 |

##### drivers

| driverId | driverRef | number | code | forename | surname  |    dob     | nationality |                     url                      |
|----------+-----------+--------+------+----------+----------+------------+-------------+----------------------------------------------|
|        2 | heidfeld  |        | HEI  | Nick     | Heidfeld | 1977-05-10 | German      | http://en.wikipedia.org/wiki/Nick_Heidfeld |
|        4 | alonso    |     14 | ALO  | Fernando | Alonso   | 1981-07-29 | Spanish     | http://en.wikipedia.org/wiki/Fernando_Alonso |

### Implementing the JavaScript

If we think about what code we had in the previous article there are two peices of functionality  we're missing. These are:

 1. The ability to find a row in the `drivers` table that matches a row in our current result set.
 2. The ability to mix/join this row from `drivers` with our current results.

I'm going to aim to write code that is highly reusable and also still performs well on very large data sets.

#### Finding drivers efficiently

The obvious answer to finding a `driver` from a list of `drivers` would be to use `Array.find()`... something lie the following?

{% highlight js %}
{% include code-in-postgres/arrayFind.js %}
{% endhighlight %}

This is certainly a reusable piece of code and was easy to write and hopefully for you to understand.

I can see two problems here though.

The first problem is performance. When we need to look up a `driverId` we need to scan all the rows in `drivers` up until the point we find the correct one. We will be doing this for all of the (hypothetically millions of) `driverId` we want to look up. So I'm pretty sure the performance characteristics of this is not great.

The other short coming I can see is that it will only ever retreive one row. This is often what we want to acheive, but not always. An example of when this is not enough is when you have one customerId and you want to find / match / join it to all orders in another table.

The following would perform much better and allow returning multiple rows:

#### sql-spitting-image/_indexBySimple.js
{% highlight js %}
{% include code-in-postgres/sql-spitting-image/_indexBySimple.js %}
{% endhighlight %}

The `indexBySimple` function can scan through the whole set of `drivers` and fill up a Map with the key being `driverId` and the values are the actual rows with have that `driverId`.  Once we have this Map looking up drivers by `driverId` will become very cheap.

#### Mixing a `drivers` record with our current results

Combining an Object of one type (`driverRow`) with another (`currentResults`) is really easy in ES6 because you can simply destruct the objects to create new one like the following

```js
    const newObject = {...currentResults, ...driverRow};
```

### Building the libraries

#### sql-spitting-image/innerJoinSimple.js

Because of all our planning the innerJoinSimple library has become really quite simple.

{% highlight js %}
{% include code-in-postgres/sql-spitting-image/innerJoinSimple.js %}
{% endhighlight %}

Reading through it you can see that the first thing it does is build an index for the right set of data.

After this it will read through all of the left set of data, checking if it can be joined to the right, if it can it will be.

### Libraries

#### sql-spitting-image/select.js

{% highlight js %}
{% include code-in-postgres/sql-spitting-image/select.js %}
{% endhighlight %}

#### sql-spitting-image/orderBy.js

{% highlight js %}
{% include code-in-postgres/sql-spitting-image/orderBy.js %}
{% endhighlight %}

#### sql-spitting-image/orderByMulti.js

{% highlight js %}
{% include code-in-postgres/sql-spitting-image/orderByMulti.js %}
{% endhighlight %}

#### sql-spitting-image/limit.js

{% highlight js %}
{% include code-in-postgres/sql-spitting-image/limit.js %}
{% endhighlight %}

#### sql-spitting-image/qryTable.js

{% highlight js %}
{% include code-in-postgres/sql-spitting-image/qryTable.js %}
{% endhighlight %}


### Main Code

The last thing to do is glue all the code together. See below:

{% highlight js %}
{% include code-in-postgres/inner-join.js %}
{% endhighlight %}

Again we have a rather large amount of code, however I again think it is quite readable.

Even if you disagree and don't like this code I hope you will agree that this amount of code could easily be wrote quite badly.

### Pro's

 * Broken down quite well into bite size peices.
 * A lot of this code is quite reusable, if you wish.

### Con's

 * There's a lot of it.
 * We are again requesting more data than is required.

### The SQL

{% highlight sql %}
{% include code-in-postgres/inner-join.sql %}
{% endhighlight %}

### Pro's

 * Shorter than the JavaScript.
 * If this were called by JavaScript we would need only one Promise, which is much easier to write and reason about.
 * The `INNER JOIN` relatively effortlessly mixes in data about drivers into what we had before.

### Con's

 * There's not much here that's re-usable, other than the knowledge you've acquired.

<script>
(function() {
    {% include jekyll-create-sections-from-headers.js %}
    {% include code-in-postgres/create-sections-to-support.js %}
}())
</script>
<style>
    {% include code-in-postgres/compare.css %}
</style>
