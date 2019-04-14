---
layout: post
title:  "Code In PostgreSQL: You can use WITH to name specific parts of SQL"
date:   2019-03-04 21:00:20
categories: postgresql code-in-postgres
---

## This series of articles

This is the second of the [Code In Postgres](/code-in-postgres/). The previous article is available [here]({{ site.baseurl }}{% post_url 2019-03-03-code-in-postgres-in-order-by-limit %}).

{% include code-in-postgres/about-body.md %}

{% include code-in-postgres/about-ergast.md %}

## Where we are

We saw [in the previous article]({{ site.baseurl }}{% post_url 2019-03-03-code-in-postgres-in-order-by-limit %}) how we could select rows from one table using a condition on another table. In doing this we noticed that the SQL we created did not give a name to the section of code within the `IN (...)` clause, which we would have done if it were code.

For the next few articles our SQL will be simple enough that it will not cause a big problem. At some point however, as the complexity ramps up, we're going to want to start naming sections of our SQL to enhance readability.

### The original SQL

{% highlight sql %}
{% include code-in-postgres/in-order-by-limit.sql %}
{% endhighlight %}

### The aim

We would like to give a name to the section of code within the `IN (...)` clause.

## Common Table Expressions

Functions in code are magical, yes they have a name, take parameters and give you back a result, but the amazing thing is that they have a name. Because they have names you often do not think about their internal workings any more, you think about the function as a distinct thing in and of itself, which frees your mind to think about the larger picture.

Giving names to things is not an alien concept to SQL. As you can see in "The original SQL" we actually gave the third column whose value is `2017` the name "year". You can also name, or alias other things within your SQL but this falls far short of how we think (or not) about functions.

Common Table Expressions are the closest I have found to being able to name and refer to sections of SQL.

### The SQL

{% highlight sql %}
{% include code-in-postgres/with.sql %}
{% endhighlight %}

IN the above code we have taken the contents of the `IN (...)` statement and moved it into a common table expression called "racesIn2017" at the top. We then have to select from that common table expression within the `IN (...)` clause again so in characters typed we have something longer, but we have achieved something else...

There is no `WHERE` within the `IN (...)` clause any more, that complexity has been moved to the common table expression. WHERE is not difficult to understand but obviously the complexity we could have abstracted away and named in the common table expressions could have been far greater.

### Pro's

 * The ability to name and refer to a section of code is incredibly important because the developer can think about it as one thing, as opposed to the details that make it up.

### Con's

 * Common table expressions, from what I have seen, are optimized individually, not in the context of the main query.

## Results

The results are identical to the [previous version]({{ site.baseurl }}{% post_url 2019-03-03-code-in-postgres-in-order-by-limit %}).

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
