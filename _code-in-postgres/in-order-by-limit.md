---
layout: post
title:  "You can do lots with just IN, ORDER BY and LIMIT"
date:   2018-08-14 21:04:55 +0100
categories: postgresql
---

{% include code-in-postgres/tabs.html %}

## Walkthrough 

## Results

{% include code-in-postgres/bin/in-order-by-limit.result.html %}

## JS

{% highlight js %}
{% include code-in-postgres/sql-spitting-image/limit.js %}
{% endhighlight %}

{% highlight js %}
{% include code-in-postgres/sql-spitting-image/orderBy.js %}
{% endhighlight %}

{% highlight js %}
{% include code-in-postgres/in-order-by-limit.js %}
{% endhighlight %}

### Pro's

 * TODO

### Con's

 * TODO

## SQL

{% highlight sql %}
{% include code-in-postgres/in-order-by-limit.sql %}
{% endhighlight %}

### Pro's

 * TODO

### Con's

 * TODO

<script>
(function() {
    {% include jekyll-create-sections-from-headers.js %}
    {% include code-in-postgres/create-sections-to-support.js %}
}())
</script>
<style>
    {% include code-in-postgres/compare.css %}
</style>
