---
layout: post
title:  "XXX Thankfully I think everyone knows about: WHERE"
date:   2018-08-14 01:00:00 +0100
categories: postgresql
---

{% include code-in-postgres/tabs.html %}

## Walkthrough 

hi


## Results

{% include code-in-postgres/bin/where.result.html %}

## JS

{% highlight js %}
{% include code-in-postgres/where.js %}
{% endhighlight %}

### Pro's

 * It is reasonably short and is easy to tell what it does at a glance.
 * The `filter` and `sort` methods could be extracted for unit testing.
 * There are no code branches implying it is less likely to fail unexpetedly.

### Con's

 * The whole dataset has to be downloaded from the database causing a large disk usage spike and significant network activity.
 * The full dataset, which may be significant, has to be stored in memory.
 * The code is longer than the SQL version.


I think, and hope you would not, because the virtually any database will provide you with some way to filter results and because it probably has access to indices it can probably locate your data more quickly and easily than you can with code.

## SQL

A translation of the above code to SQL would give you the following:

{% highlight sql %}
{% include code-in-postgres/where.sql %}
{% endhighlight %}

### Pro's

 * Shorter.
 * Even easier than the JavaScript version, it is practically in English.
 * Can make use of Indices if available.

### Con's

 * None!

As you can see the SQL is much shorter, however did you notice anything else? It seems to me that the SQL version is also more elegant, easier to write, read and maintain.

As software developers given a problem, we can often solve it in multiple ways using multiple tools, but is it possible that sometimes we only think about the database as the place we go to to get our data out from, sometimes neglecting it's true power?

Think about it would you ever write the following in an application?


The question I wish to ask is that is it possible that sometimes we write more code than we need to, not because it it the best solution, but because we unaware of some of the more advanced features that are available in PostgreSQL?


<script>
(function() {
    {% include jekyll-create-sections-from-headers.js %}
    {% include code-in-postgres/create-sections-to-support.js %}
}())
</script>
<style>
    {% include code-in-postgres/compare.css %}
</style>
