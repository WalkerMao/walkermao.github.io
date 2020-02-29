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

### HTML

HTML is the standard markup language for Web pages.

```html
<!DOCTYPE html>
<html lang="en-US">

<head>
<title>Page Title</title>
</head>

<body>
    
<h1>My First Heading</h1>

<img src="img_girl.jpg" style="width:50%;height:50%;" alt="Girl with a jacket">

<p style="color:red; font-size:120%; font-family: Arial; text-align:center;">
The <b>first</b> line.<br>The second line.
</p>

<a href="https://www.w3schools.com">

<pre>
	The first line.
	The second line.
</pre>
    
</body>

</html>
```

The `<!DOCTYPE>` declaration represents the document type, and helps browsers to display web pages correctly. 

The HTML `<head>` element contains the metadata about the HTML document which is not displayed in web pages. 

Only the content inside the `<body>` section is displayed in a browser. 

---

### CSS

**CSS** stands for **C**ascading **S**tyle **S**heets. CSS describes **how HTML elements are to be displayed on**. CSS **saves a lot of work**. It can control the layout of multiple web pages all at once.

CSS can be added to HTML elements in 3 ways:

- **Inline** - by using the style attribute in HTML elements;
- **Internal** - by using a `<style>` element in the `<head>` section;
- **External** - by using an external CSS file. (most common)

---

### Jekyll

Make the local Jekyll server work:

```bash
$ bundle exec jekyll serve --watch
```
