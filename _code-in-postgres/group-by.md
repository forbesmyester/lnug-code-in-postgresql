---
layout: post
title:  "Perhaps a NoSQL developer might not know about: GROUP BY"
date:   2018-08-23 21:04:55 +0100
categories: postgresql
---

{% include code-in-postgres/tabs.html %}

## Results

{% include code-in-postgres/bin/group.result.html %}

## JS

{% highlight js %}
{% include code-in-postgres/group.js %}
{% endhighlight %}

### Pro's

 * `keyValueToRow` appears to be a useful reusable function.
 * The `WHERE` clause should ensure indices are used, even if excessive data is sent over the network.
 * Still relatively small.
 
### Con's

 * Everything matched by the `WHERE` clause would need to be held in memory.
 * The data is translated into key/value pairs then translated back into rows.
 * Relies on the key/value pairs object being ordered to maintain output order which is not strictly correct in JavaScript (but consistently works).

The code above I think is perfectly readable and maintainable. However when we compare it to the SQL code below we can quickly see that if you know the `GROUP BY` clause, it is clearly the way to go if we care about readability or maintainability.

## SQL

{% highlight sql %}
{% include code-in-postgres/group.sql %}
{% endhighlight %}

### Pro's

 * Uses the databases indices for the `WHERE` clause and potentially for the `GROUP BY`
 * The bare minimum of data would be sent over the network.

### Con's

 * It requires knowledge of how `GROUP BY` works.


Nowadays I expect it is 100% possible that some very good programmers have only been exposed to NoSQL databases, not all of which offer the functionality of the SQL `GROUP BY`.

So lets imagine we are one of these developers who do not know about the `GROUP BY` clause. We could write some code like the following:

<script>
(function() {
    {% include jekyll-create-sections-from-headers.js %}
    {% include code-in-postgres/create-sections-to-support.js %}
}())
</script>
<style>
    {% include code-in-postgres/compare.css %}
</style>
