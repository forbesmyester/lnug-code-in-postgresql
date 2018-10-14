---
layout: post
title:  Sub select
date:   2018-08-23 21:00:15 +0100
categories: postgresql
---

{% include code-in-postgres/tabs.html %}

## Results

{% include code-in-postgres/bin/sub-select.result.html %}

## JS

Compare EXPLAIN

### Libraries

#### sql-spitting-image/orderBy.js

{% highlight js %}
{% include code-in-postgres/sql-spitting-image/orderBy.js %}
{% endhighlight %}

#### sql-spitting-image/select.js

{% highlight js %}
{% include code-in-postgres/sql-spitting-image/select.js %}
{% endhighlight %}

#### sql-spitting-image/innerJoin.js

{% highlight js %}
{% include code-in-postgres/sql-spitting-image/innerJoin.js %}
{% endhighlight %}

#### sql-spitting-image/qryTable.js

{% highlight js %}
{% include code-in-postgres/sql-spitting-image/qryTable.js %}
{% endhighlight %}

### Main Code

{% highlight js %}
{% include code-in-postgres/sub-select.js %}
{% endhighlight %}

Because the `inner join` also embedded `where`'s this code ended up being very similar.

### Pro's

 * I am not sure there are any good bits of this code compared to the JavaScript. We've not created any new re-usable functions and the actual main code, while being difficult to slim down further feels like it is full of implementation details.

### Con's

 * Even though we know `order by` we've had to do it in JavaScript because that is where the data is by that point.
 * This code, for performance reasons needs to load data from both `drivers` and `driverStandings` using a `where` clause which is not something that has to happen in the pure SQL version.
 * Because of the extra `where` clauses we need to bring in the data in sequence.

## SQL
{% highlight sql linenos %}
{% include code-in-postgres/sub-select.sql %}
{% endhighlight %}

### Pro's

 * X

### Con's

 * X

<script>
(function() {
    {% include jekyll-create-sections-from-headers.js %}
    {% include code-in-postgres/create-sections-to-support.js %}
}())
</script>
<style>
    {% include code-in-postgres/compare.css %}
</style>

