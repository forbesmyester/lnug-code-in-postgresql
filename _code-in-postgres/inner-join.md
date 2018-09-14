---
layout: post
title:  "Some NoSQL databases do not support the INNER JOIN"
date:   2018-08-23 22:04:55 +0100
categories: postgresql
---

{% include code-in-postgres/tabs.html %}

## Results

{% include code-in-postgres/bin/inner-join.result.html %}

## JS
Again. let's think about our very capable software developer who is, unfortunately completely unaware of the capabilities of the PostgreSQL database he is using... That developer might write the following code.

{% highlight js %}
{% include code-in-postgres/inner-join.js %}
{% endhighlight %}

I think this is pretty good code. There is of course the hassle of having to manage an ansynchronous database call dependant upon another and probably a good amount of extra memory usage from creating the const `indexedDriverResults` to allow simpler joining of the records.

The thing I do notice about this code when I read it is that it says to me

 1. Get the `raceResults` by running a query against the database.
 2. extract the `circuitId` from races and use it as a parameter to get the `circuitResults` from the database.
 3. Build an index of `circuitResults` using the `circuitId`.
 4. Map over the races and mix in some properties of the `indexedCircuitResults` into the returned race object... Oh! The `circuitId` of `raceRow` is used to look up the key of `indexedCircuitResults` which was originally the `circuitId` of `circuitResults`.

Now of course we can abstract this code further and mmake yourself a [nice flexible implementation](https://ramdajs.com/docs/#innerJoin) but you will still need to worry about argument order, perhaps remove the joining field, worry about sorting the final result and still find it re-implemented throughout your code base in a few different ways because they did not know the function existed...



## SQL
{% highlight sql linenos %}
{% include code-in-postgres/inner-join.sql %}
{% endhighlight %}

Why is this better? Well for a start it is far shorter, but it also conveys the meaning of what is happening instead of telling you the steps required to perform the operation.

<script>
(function() {

    {% include jekyll-create-sections-from-headers.js %}

    process(
        document.querySelector('div.post-content'),
        2,
        function(s) {
            if (s.toLowerCase() == 'results') {
                return ['tabbable', 'results'];
            }
            return ['tabbable', 'code-compare', 'code-compare-' + s.toLowerCase().replace(/[^a-z0-9]/,'-')];
        }
    );

}())
</script>
<style>
    .wrapper { max-width: none; }
    div.post-content { display: flex; flex-wrap: wrap; }
    section.results { box-sizing: border-box; width: 100%; padding-left: 15px; padding-right: 15px; }
    section.code-compare { box-sizing: border-box; width: 50%; padding-left: 15px; padding-right: 15px; }
    section.code-compare:last-child { padding-right: 0; }
</style>

