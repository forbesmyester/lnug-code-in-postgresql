---
layout: post
title:  "A NoSQL developer might not know about: GROUP BY"
date:   2018-08-23 21:00:10 +0100
categories: postgresql
---

{% include code-in-postgres/tabs.html %}

## Walkthrough

Nowadays I expect it is 100% possible that some very good programmers have only been exposed to NoSQL databases, not all of which offer the functionality of the SQL `GROUP BY`.

So lets imagine we are one of these developers who do not know about the `GROUP BY` clause. We could write some code like the following:

## Results

{% include code-in-postgres/bin/group.result.html %}

## JS

### Libraries

#### sql-spitting-image/orderBy.js

{% highlight js %}
{% include code-in-postgres/sql-spitting-image/orderBy.js %}
{% endhighlight %}

#### sql-spitting-image/_indexBy.js

{% highlight js %}
{% include code-in-postgres/sql-spitting-image/_indexBy.js %}
{% endhighlight %}

#### sql-spitting-image/groupBy.js

{% highlight js %}
{% include code-in-postgres/sql-spitting-image/groupBy.js %}
{% endhighlight %}

### Main Code

{% highlight js %}
{% include code-in-postgres/group.js %}
{% endhighlight %}

### Pro's

 * To my eyes `groupBy` seems quite elegant and should be re-usable.
 * The actual main code is quite concise and does what it says.
 
### Con's

 * Even though we know `order by` we still need to implement it in JS because it happens after the `group by`.
 * This is __a lot__ of code.

## SQL

{% highlight sql %}
{% include code-in-postgres/group.sql %}
{% endhighlight %}

### Pro's

 * Significantly shorter as similar to the main JavaScrip the SQL describes what you want, not how to do it. The difference is the how does not exist.
 * Less bandwith used between the database server and it's client

### Con's

 * It requires knowledge of how `GROUP BY` works.

<script>
(function() {
    {% include jekyll-create-sections-from-headers.js %}
    {% include code-in-postgres/create-sections-to-support.js %}
}())
</script>
<style>
    {% include code-in-postgres/compare.css %}
</style>
