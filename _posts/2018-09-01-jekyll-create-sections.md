---
layout: post
title:  "Jekyll: How to get `<section>` in Jekyll markdown based on `<h2>` tags."
categories: postgresql
---

I wanted to make a blog post which a future [LNUG](https://lnug.org/) talk will be based on to compare achieving the same output in both NodeJS and PostgreSQL.

While doing this I realised that it would be best to have the code shown side by side like the following:

    +-----------------------------------------------------------+
    |                                                           |
    |         # Joining Two Sets By Field Not In Result         |
    |                                                           |
    | Brief info about problem, input and desired result.       |
    |                                                           |
    |                                                           |
    |   ## Language: SQL            ## Language: NodeJS         |
    |   +-----------------------+   +-----------------------+   |
    |   |                       |   |                       |   |
    |   |  +-----------------+  |   |  +-----------------+  |   |
    |   |  |                 |  |   |  |                 |  |   |
    |   |  |       CODE      |  |   |  |       CODE      |  |   |
    |   |  |                 |  |   |  |                 |  |   |
    |   |  |                 |  |   |  |                 |  |   |
    |   |  +-----------------+  |   |  +-----------------+  |   |
    |   |                       |   |                       |   |
    |   |Info about why good or |   |Info about why good or |   |
    |   |bad language to use for|   |bad language to use for|   |
    |   |this problem.          |   |this problem.          |   |
    |   +-----------------------+   +-----------------------+ | |
    |                                                           |
    +-----------------------------------------------------------+

Now I am in the process of moving my blog to [Jekyll](https://jekyllrb.com/) but unfortunately when processing [Markdown](https://daringfireball.net/projects/markdown/) it adds `<h1>`, `<h2>`, `<code>` and `<p>` tags but does not group any set of elements, so pulling the bits related to SQL and NodeJS to the left and right with CSS would seem impossible... There also appeared to be no plugins for this if you want to stay with Markdown syntax.

So... like any good developer I set about writing one!

What it does is takes a main element which contains your blog content, a header level (`2` == `<h2>`) as well as a function that takes the content of a header and returns a set of strings which will be used as class names for newly created `<section>` elements that encompass all content related to the header.

An example of how to use is shown below:

{% highlight html %}
{% raw %}
<script>
(function() {

    {% include jekyll-create-sections-from-headers.js %}

    process(
        document.querySelector('div.post-content'),
        2,
        function(title) {
            return [
                'code-compare',
                'code-compare-' + title.toLowerCase().replace(/[^a-z0-9]/,'-')
            ];
        }
    );

}())
</script>
{% endraw %}
{% endhighlight %}

Note the function, in usage is wrapped in an [IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE). If you do not do this you will get unintended global variables.

Project is [on GitHub](https://github.com/forbesmyester/jekyll-create-sections-from-headers.js) with a MIT license.
