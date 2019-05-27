---
layout: post
title:  "Code In PostgreSQL: You can do lots with just IN, ORDER BY and LIMIT"
date:   2019-03-03 12:00:00
categories: postgresql code-in-postgres
---

## This series of articles

This is the first of the [Code In Postgres](/code-in-postgres/) series of articles.

{% include code-in-postgres/about-body.md %}

{% include code-in-postgres/about-ergast.md %}

## The aim

Lets say you want to find out the final points for drivers in the 2017 Formula 1 World Championship. The schema for the tables we will be using is as follows:

![ERD Diagram](/images/2019-03-03-code-in-postgres-in-order-by-limit.erd.png)

An example of the data you would find in these tables is shown below:

#### races

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


#### driversStandings

| driverStandingsId | raceId | driverId | points | position | positionText | wins |
|-------------------+--------+----------+--------+----------+--------------+------ |
|             64782 |    855 |        3 |     63 |        7 | 7            |    0 |
|             64795 |    856 |        1 |    196 |        5 | 5            |    2 |
|             64797 |    856 |        4 |    212 |        3 | 3            |    1 |
|             64805 |    856 |        2 |     34 |       10 | 10           |    0 |
|             64810 |    856 |        3 |     67 |        7 | 7            |    0 |

The `driverStandings` table has the points for every driver in every race. The problem here is that there is no record in the `driverStandings` table for which season a `raceId` belongs to. So we need to get a bit creative... Here is one possible solution:

 1. Looking at the `races` table's `year` column, we can find all the `raceId` in 2017.
 2. If we can get all `races` in a given `year` we should be able to get the last race because the `raceId` will be the highest within that year.
 2. Find the `points` and `driverId` for the drivers who were in that `raceId` by reading the `driverStandings` table.
 3. Sort them by `points` descending.
 4. The very first row contains the `driverId` which has the most points in that season. This `driverId` is the world champion. The ones later on denote their final position (assuming the points differ).

## Implementing the JavaScript

### Assumed level of SQL Knowledge for the JavaScript example

In this JavaScript example we will assume the writer has sufficient SQL knowledge to use a `WHERE` statement along with the ability to only return certain fields using `SELECT`. After this we will see how this can be accomplished in one single SQL statement using `IN`, `ORDER BY` and `LIMIT`.

### Libraries

#### sql-spitting-image/limit.js

{% highlight js %}
{% include code-in-postgres/sql-spitting-image/limit.js %}
{% endhighlight %}

#### sql-spitting-image/orderBy.js

{% highlight js %}
{% include code-in-postgres/sql-spitting-image/orderBy.js %}
{% endhighlight %}

### Main Code

{% highlight js %}
{% include code-in-postgres/in-order-by-limit.js %}
{% endhighlight %}

This code, despite there being a lot of it is relatively straight forward. We get a list of `raceId` from the `qryRaces` function. Once we have this we will order by the `raceId` from largest to smallest and take the one off the top. This is the last race.

After this we feed the `raceId` of the last race in 2017 directly into the `qryStandings` functions to get the results from the last race. Finally we sort by the `points` column, from largest to smallest, solely for presentation reasons.

### Pro's

 * There's some nice re-usable functions here.
 * The main code is quite concise and easy to understand.

### Con's

 * Longer than SQL
 * We downloaded a reasonably large amount of data from the database, which could be slow.

## SQL

{% highlight sql %}
{% include code-in-postgres/in-order-by-limit.sql %}
{% endhighlight %}

Like the JavaScript we are using ordering (`ORDER BY`) and limiting (`LIMIT`) to get the highest `raceId` within 2017.

The `IN` clause can be used to match a column against a set of numbers. For example we may choose to write `WHERE "raceId" IN (4, 5, 7)` which would be the same thing as writing `WHERE "raceId" = 4 OR "raceId" = 5 OR "raceId" = 7`.

The smart thing here is that we are using a query to get the last `raceId` within the `IN` clause instead of a directly specified list of `raceId`.

Finally an `ORDER BY` statement is used to perform sorting of the final record set, you can sort by multiple fields or use many types of expressions.

### Pro's

 * Shorter than the JavaScript.
 * If this were called by JavaScript we would need only one Promise, which is much easier to write and reason about.
 * The inside of the `IN` clause can be ran and understood individually.

### Con's

 * Is the `order by` / `limit 1` a trick?
 * It seems in code you can give the contents of IN clause a name (`raceIds`) but this is not possible using SQL's `IN`, [or is it?]({{ site.baseurl }}{% post_url 2019-03-12-code-in-postgres-with %}).


## Results

{% include code-in-postgres/bin/in-order-by-limit.result.html %}

<script>
(function() {
    {% include jekyll-create-sections-from-headers.js %}
    {% include code-in-postgres/create-sections-to-support.js %}
}())
</script>
<style>
    {% include code-in-postgres/compare.css %}
</style>
