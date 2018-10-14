---
layout: post
title:  "Some NoSQL databases do not support the INNER JOIN"
date:   2018-08-23 21:00:05 +0100
categories: postgresql
---

{% include code-in-postgres/tabs.html %}

## Results

{% include code-in-postgres/bin/inner-join.result.html %}

## JS

### Libraries

#### sql-spitting-image/select.js

{% highlight js %}
{% include code-in-postgres/sql-spitting-image/select.js %}
{% endhighlight %}

#### sql-spitting-image/orderBy.js

{% highlight js %}
{% include code-in-postgres/sql-spitting-image/orderBy.js %}
{% endhighlight %}

#### sql-spitting-image/limit.js

{% highlight js %}
{% include code-in-postgres/sql-spitting-image/limit.js %}
{% endhighlight %}

#### sql-spitting-image/qryTable.js

{% highlight js %}
{% include code-in-postgres/sql-spitting-image/qryTable.js %}
{% endhighlight %}

#### sql-spitting-image/innerJoin.js

{% highlight js %}
{% include code-in-postgres/sql-spitting-image/innerJoin.js %}
{% endhighlight %}

### Main Code

{% highlight js %}
{% include code-in-postgres/inner-join.js %}
{% endhighlight %}

### Pro's

 * I am fairly happy with the code in `sql-spitting-image/innerJoin.js`. It seems quite elegant and should remain performant given it indexes the data while joining.
 * the `innerJoin` function should be quite re-usable.

### Con's

 * What this code does is __bad__. It is pulling entire data sets over the network for `driverStandings` and `drivers` when it does not need to... however we cannot know what those subsets are until the preceding (races for `driverStandings` or `driverStandings` for `drivers` are downloaded and this would introduce sequencing into the Javascript that does not exist in the SQL version.
 * Even though we know both `order by` and `limit` in SQL we cannot use them because by that point the data is brought into JavaScript.

## SQL
{% highlight sql linenos %}
{% include code-in-postgres/inner-join.sql %}
{% endhighlight %}

### Pro's

 * Significantly shorter.
 * Any sensible developer would add sequencing to the JavaScript version to avoid pulling down whole datasets, this is not required here.
 * The joins for `driverStandings` and `drivers` do not require `where` clauses because the database has access to all data and will be optimized transparently.
 * This can run on datasets which are bigger than available memory.

### Con's

 * It doesn't have any re-usable elements like the JavaScript version, but the complexity is not there either.

<script>
(function() {
    {% include jekyll-create-sections-from-headers.js %}
    {% include code-in-postgres/create-sections-to-support.js %}
}())
</script>
<style>
    {% include code-in-postgres/compare.css %}
</style>

