---
layout: post
title:  "Code In PostgreSQL"
date:   2018-08-14 21:04:55 +0100
categories: code-in-postgres
---

## About "Code In In Postgres" Articles

{% include code-in-postgres/about-body.md %}

{% include code-in-postgres/about-ergast.md %}

## Articles in this series

  * [You can do lots with just IN, ORDER BY and LIMIT]({{ site.baseurl }}{% post_url 2019-03-03-code-in-postgres-in-order-by-limit %})
  * [You can use WITH to name specific parts of SQL]({{ site.baseurl }}{% post_url 2019-03-12-code-in-postgres-with %})
  * [Combining data from multiple tables with INNER JOIN]({{ site.baseurl }}{% post_url 2019-05-15-code-in-postgres-inner-join %})

More to come...

<!--
<li>Some NoSQL databases do not support the INNER JOIN</li>
<li>A NoSQL developer might not know about: GROUP BY</li>
<li>Sub select</li>
<li>Variables</li>
<li>Prepare JSON</li>
<li>Create Function (and testing it)</li>
<li>Custom Aggregates</li>
-->

## Setting up the Ergast database within PostgreSQL

To set up the [Ergast](https://ergast.com/mrd) database within PostgreSQL I did the following:

I allowed `psql` and friends to work without me having to put in a password all the time by configuring the [PostgreSQL environmental variables](https://www.postgresql.org/docs/current/libpq-envars.html).

```sh
export PGUSER=postgres PGPASSWORD=postgres PGDATABASE=postgres PGHOST=127.0.0.1
```

Then import the [Ergast](http://ergast.com/) database. NOTE: At the time of writing I was unable to install the PostgreSQL version.

```sh
wget -O /tmp/f1db_ansi.sql.gz http://ergast.com/downloads/f1db_ansi.sql.gz
cat /tmp/f1db_ansi.sql.gz | gzip -d | sed 's/int(..)/int/' | sed 's/ \+AUTO_INCREMENT//' |  sed "s/\\\'/\'\'/g" |  sed 's/UNIQUE KEY \"\(\w\+\)\"/UNIQUE /' | sed 's/^ *KEY .*(\"\(.*\)\")/CHECK ("\1" > 0)/' | sed 's/ date NOT NULL DEFAULT .0000.*,/ date,/'| psql
```

To Test

    find _includes/code-in-postgres/ -type f | grep 'sql$' | parallel '_includes/code-in-postgres/compare-results  {}'

To build results

    mkdir -p _includes/code-in-postgres/bin
    find _includes/code-in-postgres/ | grep 'sql$' | parallel -j 1 echo {} '&&' cat {} '|' psql -H  '>' _includes/code-in-postgres/bin/{/.}.result.html

To generate ERD Diagrams

    # Requires [ERD](https://github.com/BurntSushi/erd) 
    find images -type f | grep -v 'png$' | parallel cat {} '|' erd -f png '>' {}.png

 
