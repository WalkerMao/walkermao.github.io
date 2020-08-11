---
layout: post
title:  "Code Memos"
date: 2020-02-24
categories: CS
comments: true
---

### Git

Initialize a new local repository:

```bash
$ git init
```

Stage all local changes in `<directory> ` for the next commit: (Replace `<directory> `  with a `<file>` to stage the changes of a specific file.  Replace with `-A` to stage all changes.). The `<directory> ` will be tracked.  

```bash
$ git add <directory>
```

List which files are staged, unstaged, and untracked: 

```bash
$ git status
```

Unstage everything (retain changes):

```bash
$ git reset
```

Commit all local changes (include unstaged changes) in tracked files:

```bash
$ git commit -a -m "<message>"
```

Commit previously staged changes with message:

```bash
$ git commit -m "<message>"
```

Connect the local repository to the GitHub (remote) repository:

```bash
$ git remote add origin <GitHubRepoURL>
```

Verify the connection:

```bash
$ git remote -v
```

Push to GitHub (remote) repository:

```bash
$ git push
```

Fetches all files from GitHub (remote) repository (remember to backup local repository before execute this command): 

```bash
$ git pull --all
```

---

### SQL 

The input of the function `MAX()` must be a group of data.

```mysql
SELECT id, name FROM table where id = MAX(id); # invalid
SELECT id, name FROM table where id = (SELECT MAX(id) FROM table); # valid
```

---

### Jekyll

Make the local Jekyll server work:

```bash
$ bundle exec jekyll serve --watch
```

