---
layout: post
title:  "Code In PostgreSQL"
date:   2018-08-14 21:04:55 +0100
categories: postgresql
---

First configure environmental variables to allow easy PostgreSQL interaction

```sh
export PGUSER=postgres PGPASSWORD=postgres PGDATABASE=postgres PGHOST=127.0.0.1
```

Then import the [Ergast](http://ergast.com/) database. NOTE: The PostgreSQL version on the web page does not seem to work.

```sh
wget -O /tmp/f1db_ansi.sql.gz http://ergast.com/downloads/f1db_ansi.sql.gz
cat /tmp/f1db_ansi.sql.gz | gzip -d | sed 's/int(..)/int/' | sed 's/ \+AUTO_INCREMENT//' |  sed "s/\\\'/\'\'/g" |  sed 's/UNIQUE KEY \"\(\w\+\)\"/UNIQUE /' | sed 's/^ *KEY .*(\"\(.*\)\")/CHECK ("\1" > 0)/' | sed 's/ date NOT NULL DEFAULT .0000.*,/ date,/'| psql
```

## Install Jekyll

    sudo apt install ruby-dev ruby
    sudo gem install bundler jekyll

To Test

    find _includes/code-in-postgres/ | grep 'sql$' | parallel '_includes/code-in-postgres/compare-results  {}'

To build results

    mkdir -p _includes/code-in-postgres/bin
    find _includes/code-in-postgres/ | grep 'sql$' | parallel -j 1 echo {} '&&' cat {} '|' psql -H  '>' _includes/code-in-postgres/bin/{/.}.result.html

{% for item in site["code-in-postgres"] %}
  {% unless item.title == page.title %}
  <h2>{{ item.title }}</h2>
  <p>{{ item.description }}</p>
  <p><a href="{{ item.url }}">{{ item.title }}</a></p>
  {% endunless %}
{% endfor %}
