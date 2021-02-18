---
layout: post
title: "Shell Command Memo (Part 2)"
date: 2020-01-21
categories: CS
published: true
hidden: true
comments: true
---

### Calculation

| Syntax            | Example             |
| ----------------- | ------------------- |
| `$((expression))` | `a=$((1+1))`        |
| `` `expr expression` `` | ``a=`expr 1+1` `` |
| `$[expression]` | `a=$[1+1]` |
| `declare -i variable=expression` | `declare -i a=1+1` |
| `let variable=expression` | `let a=1+1` |

