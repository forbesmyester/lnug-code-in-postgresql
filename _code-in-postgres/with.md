---
layout: post
title:  With
date:   2018-08-23 21:00:20 +0100
categories: postgresql
---

{% include code-in-postgres/tabs.html %}

## Results

{% include code-in-postgres/bin/with.result.html %}

## JS

### Libraries

#### sql-spitting-image/select.js

{% highlight js %}
{% include code-in-postgres/sql-spitting-image/select.js %}
{% endhighlight %}

#### sql-spitting-image/innerJoin.js

{% highlight js %}
{% include code-in-postgres/sql-spitting-image/innerJoin.js %}
{% endhighlight %}

#### sql-spitting-image/limit.js

{% highlight js %}
{% include code-in-postgres/sql-spitting-image/limit.js %}
{% endhighlight %}

#### sql-spitting-image/orderBy.js

{% highlight js %}
{% include code-in-postgres/sql-spitting-image/orderBy.js %}
{% endhighlight %}

#### sql-spitting-image/qryTable.js

{% highlight js %}
{% include code-in-postgres/sql-spitting-image/qryTable.js %}
{% endhighlight %}

### Main Code

{% highlight js %}
{% include code-in-postgres/with.js %}
{% endhighlight %}

### Pro's

 * The code at least is still quite tidy.
 * Has the slight advantage over [sub-select](./sub-select.html) that `lastRoundOfSeason()` now has a name.

### Con's

 * All the same problems as [sub-select](./sub-select.html).

## SQL

{% highlight sql linenos %}
{% include code-in-postgres/with.sql %}
{% endhighlight %}

### Pro's

 * The ability to name to a section of code is incredibly important because the developer can think about it as one thing, as opposed to the details that make it up.

### Con's

 * Adding a `where races.year = 2017` to the main query does not, at present limit the data which is retreived in `last_round_of_season`.

<script>
(function() {
    {% include jekyll-create-sections-from-headers.js %}
    {% include code-in-postgres/create-sections-to-support.js %}
}())
</script>
<style>
    {% include code-in-postgres/compare.css %}
</style>
