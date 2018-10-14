---
layout: post
title:  "You can do lots with just IN, ORDER BY and LIMIT"
date:   2018-08-14 21:00:00 +0100
categories: postgresql
---

{% include code-in-postgres/tabs.html %}

## Walkthrough 

## Results

{% include code-in-postgres/bin/in-order-by-limit.result.html %}

## JS

### Libraries

#### sql-spitting-image/limit.js

{% highlight js %}
{% include code-in-postgres/sql-spitting-image/limit.js %}
{% endhighlight %}

#### sql-spitting-image/orderBy.js

{% highlight js %}
{% include code-in-postgres/sql-spitting-image/orderBy.js %}
{% endhighlight %}

### Main Code

{% highlight js %}
{% include code-in-postgres/in-order-by-limit.js %}
{% endhighlight %}

XXX
### Pro's

 * There's some nice re-usable functions here.
 * The main code is quite concise and easy to understand.
 * Only data from the database which is required is brought over.

### Con's

 * Longer than SQL
 * There is that nasty `if` condition in `qryMain`.

## SQL

{% highlight sql %}
{% include code-in-postgres/in-order-by-limit.sql %}
{% endhighlight %}

### Pro's

 * Shorter than the JavaScript.

### Con's

 * Is the `order by` / `limit 1` a trick?

<script>
(function() {
    {% include jekyll-create-sections-from-headers.js %}
    {% include code-in-postgres/create-sections-to-support.js %}
}())
</script>
<style>
    {% include code-in-postgres/compare.css %}
</style>
