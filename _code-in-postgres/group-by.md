---
layout: post
title:  "Perhaps a NoSQL developer might not know about: GROUP BY"
date:   2018-08-23 21:04:55 +0100
categories: postgresql
---
Nowadays I expect it is 100% possible that some very good programmers have only been exposed to NoSQL databases, not all of which offer the functionality of the SQL `GROUP BY`.

So lets imagine we are one of these developers who do not know about the `GROUP BY` clause. We could write some code like the following:

{% highlight js %}
{% include code-in-postgres/group.js %}
{% endhighlight %}

The code above I think is perfectly readable and maintainable. However when we compare it to the SQL code below we can quickly see that if you know the `GROUP BY` clause, it is clearly the way to go if we care about readability or maintainability.

{% highlight sql %}
{% include code-in-postgres/group.sql %}
{% endhighlight %}

