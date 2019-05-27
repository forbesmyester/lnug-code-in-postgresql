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
|    969 | 2017 |     1 |         1 | Australian Grand Prix    | 2017-03-26 | 05:00:00 | https://en.wikipedia.org/wiki/2017_Australian_Grand_Prix|
|    970 | 2017 |     2 |        17 | Chinese Grand Prix       | 2017-04-09 | 06:00:00 | https://en.wikipedia.org/wiki/2017_Chinese_Grand_Prix|
|    971 | 2017 |     3 |         3 | Bahrain Grand Prix       | 2017-04-16 | 15:00:00 | https://en.wikipedia.org/wiki/2017_Bahrain_Grand_Prix|
|    972 | 2017 |     4 |        71 | Russian Grand Prix       | 2017-04-30 | 12:00:00 | https://en.wikipedia.org/wiki/2017_Russian_Grand_Prix|
|    973 | 2017 |     5 |         4 | Spanish Grand Prix       | 2017-05-14 | 12:00:00 | https://en.wikipedia.org/wiki/2017_Spanish_Grand_Prix|
|    974 | 2017 |     6 |         6 | Monaco Grand Prix        | 2017-05-28 | 12:00:00 | https://en.wikipedia.org/wiki/2017_Monaco_Grand_Prix|
|    975 | 2017 |     7 |         7 | Canadian Grand Prix      | 2017-06-11 | 18:00:00 | https://en.wikipedia.org/wiki/2017_Canadian_Grand_Prix|
|    976 | 2017 |     8 |        73 | Azerbaijan Grand Prix    | 2017-06-25 | 13:00:00 | https://en.wikipedia.org/wiki/2017_Azerbaijan_Grand_Prix|
|    977 | 2017 |     9 |        70 | Austrian Grand Prix      | 2017-07-09 | 12:00:00 | https://en.wikipedia.org/wiki/2017_Austrian_Grand_Prix|


##### driversStandings

| driverStandingsId | raceId | driverId | points | position | positionText | wins |
|-------------------+--------+----------+--------+----------+--------------+------ |
|             64782 |    855 |        3 |     63 |        7 | 7            |    0 |
|             64795 |    856 |        1 |    196 |        5 | 5            |    2 |
|             64797 |    856 |        4 |    212 |        3 | 3            |    1 |
|             64805 |    856 |        2 |     34 |       10 | 10           |    0 |
|             64810 |    856 |        3 |     67 |        7 | 7            |    0 |

##### drivers

| driverId | driverRef | number | code | forename | surname  |    dob     | nationality |                     url                      |
|----------+-----------+--------+------+----------+----------+------------+-------------+----------------------------------------------|
|        1 | hamilton  |     44 | HAM  | Lewis    | Hamilton | 1985-01-07 | British     | http://en.wikipedia.org/wiki/Lewis_Hamilton |
|        2 | heidfeld  |        | HEI  | Nick     | Heidfeld | 1977-05-10 | German      | http://en.wikipedia.org/wiki/Nick_Heidfeld |
|        3 | rosberg   |      6 | ROS  | Nico     | Rosberg  | 1985-06-27 | German      | http://en.wikipedia.org/wiki/Nico_Rosberg |
|        4 | alonso    |     14 | ALO  | Fernando | Alonso   | 1981-07-29 | Spanish     | http://en.wikipedia.org/wiki/Fernando_Alonso |

### The SQL

{% highlight sql %}
{% include code-in-postgres/inner-join.sql %}
{% endhighlight %}

### The aim

We have the following data from the [previous article]({{ site.baseurl }}{% post_url 2019-03-12-code-in-postgres-with %}).

{% include code-in-postgres/bin/in-order-by-limit.result.html %}

We would like to mix this result with data from the `drivers` table above so we might get a result similar to:

TODO: ADD DATA HERE

### The plan

There are two things we're missing to implement this in JavaScript. These are:

 1. The ability to find a row in the `drivers` table that matches a row in our current result set.
 2. The ability to mix this row from `drivers` with our current results.

Because this is an open source blog about open source tools I'm going to allow myself the freedom to over-engineer this and consider that we are going to be looking up thousands of `drivers` from a list of millions of `driverId`. How would we solve this problem?

Well the obvious answer to finding a `driver` from a list of `drivers` would be to use `find`... something lie the following?

{% highlight js %}
{% include code-in-postgres/array-find.js %}
{% endhighlight %}

This is certainly a reusable piece of code and was easy to write, but how will it perform? When we need to look up a `driverId` we need to scan all the rows in `drivers` up until the point we find the correct one and do this for all the (millions of) `driverId` we want to look up. So I'm pretty sure the performance characteristics of this is not great.

The following would perform much better:

{% highlight js %}
{% include code-in-postgres/sql-spitting-image/_indexBySimple.js %}
{% endhighlight %}

This code will scan through the whole set of `drivers` only once and fill up a Map (returned by `indexBySimple`) so that the key is the `driverId` and the values are the actual rows that match (though it will really just point to the Array so will use up little memory).

