---
layout: post
title:  Variables
date:   2018-08-23 21:00:25 +0100
categories: postgresql
---

{% include code-in-postgres/tabs.html %}

## Results

{% include code-in-postgres/bin/variables.result.html %}

## SQL

{% highlight sql linenos %}
{% include code-in-postgres/variables.sql %}
{% endhighlight %}

### Pro's

 * Returns the optimizations that were lost between [sub-select](./sub-select.html) and [with](./with.html)
 * Keeps the ability to name a sub selection like what was introduced in the [with](./with.html).
 * Variables now have names as apposed to just `$1`, `$2` which makes it more readable should your PostgreSQL library only have positional parameter support.

### Con's

 * It's a bit of a hack, even if it has no performance downsides and those `cross join`'s add extra noise.

<script>
(function() {
    {% include jekyll-create-sections-from-headers.js %}
    {% include code-in-postgres/create-sections-to-support.js %}
}())
</script>
<style>
    {% include code-in-postgres/compare.css %}
</style>
