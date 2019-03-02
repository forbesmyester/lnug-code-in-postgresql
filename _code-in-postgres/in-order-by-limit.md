---
layout: post
title:  "You can do lots with just IN, ORDER BY and LIMIT"
date:   2018-08-14 21:00:00 +0100
categories: postgresql
---

{% include code-in-postgres/tabs.html %}

## Walkthrough 

Lets say you want to find out who the Formula 1 World Champion was in 2017 from the [Ergast](https://ergast.com/mrd) data set, which is a dataset provided under the [Attribution-NonCommercial-ShareAlike 3.0 Unported Licence](http://creativecommons.org/licenses/by-nc-sa/3.0/).

The schema looks like the following:

![ERD Diagram](/images/code-in-postgres/in-order-by-limit.erd.png)

Here are two samples of the data:

### drivers

| driverId | driverRef | number | code | forename | surname  |    dob     | nationality |                     url                      |
|----------+-----------+--------+------+----------+----------+------------+-------------+----------------------------------------------|
|        1 | hamilton  |     44 | HAM  | Lewis    | Hamilton | 1985-01-07 | British     | http://en.wikipedia.org/wiki/Lewis_Hamilton |
|        2 | heidfeld  |        | HEI  | Nick     | Heidfeld | 1977-05-10 | German      | http://en.wikipedia.org/wiki/Nick_Heidfeld |
|        3 | rosberg   |      6 | ROS  | Nico     | Rosberg  | 1985-06-27 | German      | http://en.wikipedia.org/wiki/Nico_Rosberg |
|        4 | alonso    |     14 | ALO  | Fernando | Alonso   | 1981-07-29 | Spanish     | http://en.wikipedia.org/wiki/Fernando_Alonso |

### driversStandings

| driverStandingsId | raceId | driverId | points | position | positionText | wins |
|-------------------+--------+----------+--------+----------+--------------+------ |
|             64782 |    855 |        3 |     63 |        7 | 7            |    0 |
|             64795 |    856 |        1 |    196 |        5 | 5            |    2 |
|             64797 |    856 |        4 |    212 |        3 | 3            |    1 |
|             64805 |    856 |        2 |     34 |       10 | 10           |    0 |
|             64810 |    856 |        3 |     67 |        7 | 7            |    0 |

The `driverStandings` table has the points for every driver in every race and world champions would be the driver with the most points in a single season. The problem here is that there is no record in the `driverStandings` table for which season a `raceId` belongs to. So we need to get a bit creative... Here is a possible solution:

 1. Find all the `raceId` in 2017 by looking at the `races` table, because this has a `year` column.
 2. Find the `points` and `driverId` for all of those `raceId`.
 3. Sort them by `points` descending.
 4. The very first row contains the `driverId` which has the most points in that season. This `driverId` is the world champion.

{% highlight sql %}
{% include code-in-postgres/in-order-by-limit.sql %}
{% endhighlight %}


## Results

{% include code-in-postgres/bin/in-order-by-limit.result.html %}

## JS

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

XXX
### Pro's

 * There's some nice re-usable functions here.
 * The main code is quite concise and easy to understand.
 * Only data from the database which is required is brought over.

### Con's

 * Longer than SQL
 * There is that nasty `if` condition in `qryMain`.

## SQL

{% highlight sql %}
{% include code-in-postgres/in-order-by-limit.sql %}
{% endhighlight %}

### Pro's

 * Shorter than the JavaScript.

### Con's

 * Is the `order by` / `limit 1` a trick?

<script>
(function() {
    {% include jekyll-create-sections-from-headers.js %}
    {% include code-in-postgres/create-sections-to-support.js %}
}())
</script>
<style>
    {% include code-in-postgres/compare.css %}
</style>
