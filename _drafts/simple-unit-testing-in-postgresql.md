---
layout: post
title:  Unit Testing PostgreSQL functions.
categories: postgresql
---

As much as I know that writing stored procedures in any database is more painful than in your normal programming language there are sometimes very good reasons for doing this. I am thinking of situations like the following:

 * Getting the result requires vast amounts of data which is stored in the database.
 * The result itself is quite small.
 * You need an aggregate or use a window function, like MIN, MAX or RANK etc, but not one that already exists inside PostgreSQL.

So you have decided to build a [custom aggregate](/code-in-postgres/custom-aggregates.html), but as you are coding and because it's in a weird language you are not an expert in you feel you need to test it.

If you look at testing frameworks for PostgreSQL you will find [PgTap](https://pgtap.org/), which is a fine testing framework but requires Python and seems overkill when you just want to test some procedures/functions.

I have recently used [mixerp/plpgunit](https://github.com/mixerp/plpgunit) which exists solely within the database itself, so you write your tests in PLPGSQL and have no libraries or code to maintain in your code base.

installation is as simple as:

    curl https://raw.githubusercontent.com/mixerp/plpgunit/master/install/0.uninstall-unit-test.sql | psql

    curl https://raw.githubusercontent.com/mixerp/plpgunit/master/install/1.install-unit-test.sql | psql

