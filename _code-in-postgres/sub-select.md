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

 * The code at least is still quite tidy.

### Con's

 * The nested `innerJoin` calls now seem messy.
 * Even though we know `order by` we've had to do it in JavaScript because that is where the data is by that point.
 * Like the [inner-join](./inner-join.md) this pulls over whole datasets which does not occur in the SQL version.

## SQL
{% highlight sql linenos %}
{% include code-in-postgres/sub-select.sql %}
{% endhighlight %}

### Pro's

 * Shorter.
 * Not really any more difficult to understand than [inner-join](./inner-join.md).
 * The optimizer works out the most efficient way of getting the desired results, using indexes right now, but if you were to filter by year, for example, the sub-query would be optimized automatically.

### Con's

 * None

<script>
(function() {
    {% include jekyll-create-sections-from-headers.js %}
    {% include code-in-postgres/create-sections-to-support.js %}
}())
</script>
<style>
    {% include code-in-postgres/compare.css %}
</style>

