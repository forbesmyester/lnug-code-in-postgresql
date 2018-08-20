---
layout: post
title:  "Can we put our code into PostgreSQL instead of Node? - 1: WHERE"
date:   2018-08-14 21:04:55 +0100
categories: postgresql
---

As software developers given a problem, we can often solve it in multiple ways using multiple tools, but is it possible that sometimes we just think about the database as the place we go to to get our data out from? Could it be that sometimes the best solution might be to use SQL to solve our problems instead of code?

Think about it would you ever write the following in an application?

{% highlight ruby %}
{% include code-in-postgres-where.js %}
{% endhighlight %}

I think, and hope you would not, because the SQL server has indices to locate the data more quickly and easily so we understand it it much, much better to write the following:

{% highlight sql %}
{% include code-in-postgres-where.sql %}
{% endhighlight %}

However did you notice anything else? It seems to me that the SQL version is also more elegant, easier to write, read and maintain.

The question I wish to ask is that is it possible that sometimes we write more code than we need to, not because it it the best solution, but because we unaware of some of the more advanced features that are available in PostgreSQL?
