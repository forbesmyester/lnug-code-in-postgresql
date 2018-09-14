---
layout: post
title:  "Thankfully I think everyone knows about: WHERE"
date:   2018-08-14 21:04:55 +0100
categories: postgresql
---
As software developers given a problem, we can often solve it in multiple ways using multiple tools, but is it possible that sometimes we only think about the database as the place we go to to get our data out from, sometimes neglecting it's true power?

Think about it would you ever write the following in an application?

{% highlight js %}
{% include code-in-postgres/where.js %}
{% endhighlight %}

I think, and hope you would not, because the virtually any database will provide you with some way to filter results and because it probably has access to indices it can probably locate your data more quickly and easily than you can with code.

A translation of the above code to SQL would give you the following:

{% highlight sql %}
{% include code-in-postgres/where.sql %}
{% endhighlight %}

As you can see the SQL is much shorter, however did you notice anything else? It seems to me that the SQL version is also more elegant, easier to write, read and maintain.

The question I wish to ask is that is it possible that sometimes we write more code than we need to, not because it it the best solution, but because we unaware of some of the more advanced features that are available in PostgreSQL?

## Perhaps a NoSQL developer might not know about: GROUP BY

Nowadays I expect it is 100% possible that some very good programmers have only been exposed to NoSQL databases, not all of which offer the functionality of the SQL `GROUP BY`.

So lets imagine we are one of these developers who do not know about the `GROUP BY` clause. We could write some code like the following:

{% highlight js %}
{% include code-in-postgres/group.js %}
{% endhighlight %}

The code above I think is perfectly readable and maintainable. However when we compare it to the SQL code below we can quickly see that if you know the `GROUP BY` clause, it is clearly the way to go if we care about readability or maintainability.

{% highlight sql %}
{% include code-in-postgres/group.sql %}
{% endhighlight %}

## Some NoSQL databases do not support Joins
