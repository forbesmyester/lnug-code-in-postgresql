---
layout: post
title:  "Code In PostgreSQL"
date:   2018-08-14 21:04:55 +0100
categories: postgresql
---

To Test

    find _includes/code-in-postgres/ | grep 'sql$' | parallel '_includes/code-in-postgres/compare-results  {}'

To build results

    mkdir -p _includes/code-in-postgres/bin
    find _includes/code-in-postgres/ | grep 'sql$' | parallel -j 1 echo {} '&&' cat {} '|' psql -H  '>' _includes/code-in-postgres/bin/{/.}.result.html

{% for item in site["code-in-postgres"] %}
  <h2>{{ item.title }}</h2>
  <p>{{ item.description }}</p>
  <p><a href="{{ item.url }}">{{ item.title }}</a></p>
{% endfor %}
