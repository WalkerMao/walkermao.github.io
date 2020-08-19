---
layout: post
title: "Basic HTML and CSS"
date: 2020-02-25
categories: cs
published: true
comments: true
---

## HTML

### What is HTML?

- HTML stands for Hyper Text Markup Language.
- HTML is the standard markup language for creating Web pages.
- HTML describes the structure of a Web page.
- HTML consists of a series of elements.
- HTML elements tell the browser how to display the content.
- HTML elements label pieces of content such as "this is a heading", "this is a paragraph", "this is a link", etc.

### Basic HTML Elements

An **HTML element** is defined by a start tag, some content, and an end tag. The HTML element is everything from the start tag to the end tag. 

HTML elements with no content (like the `<br>` element defines a line break) are called empty elements. Empty elements do not have an end tag. 

#### `<!DOCTYPE>` Tag

The `<!DOCTYPE>` declaration represents the document type, and helps browsers to display web pages correctly. 

#### `<head>` Tag

The HTML `<head>` element contains the metadata about the HTML document which is not displayed in web pages. 

#### `<body>` Tag

Only the content inside the `<body>` section is displayed in a browser. 

#### Headings Tag

HTML headings are defined with the `<h1>` to `<h6>` tags. `<h1>` defines the most important heading. `<h6>` defines the least important heading. 

####  `<p>` Tag

HTML paragraphs are defined with the `<p>` tag.

#### `<a>` Tag

HTML links are defined with the `<a>` tag. The link's destination is specified in the `href` (Hypertext REFerence) attribute. 

#### `<img>` Tag

HTML images are defined with the `<img>` tag. The source file (`src`), alternative text (`alt`), `width`, and `height` are provided as attributes. 

#### `<pre>` Tag

The `<pre>` tag defines preformatted text. Text in a `<pre>` element is displayed in a fixed-width font, and the text preserves both spaces and line breaks. The text will be displayed exactly as written in the HTML source code. 

#### `<div>` Tag 

The `<div>` tag defines a division or a section in an HTML document. The `<div>` tag is used as a container for HTML elements - which is then styled with CSS or manipulated with JavaScript. The `<div>` tag is easily styled by using the class or id attribute. Any sort of content can be put inside the `<div>` tag. Note: By default, browsers always place a line break before and after the `<div>` element.

### Basic HTML Attributes

HTML attributes: 

- All HTML elements can have **attributes**.

- Attributes provide **additional information** about elements.

- Attributes are always specified in **the start tag**.

- Attributes usually come in name/value pairs like: **`name="value"`**.

The `style` attribute is used to add styles to an element, such as color, font, size, and more. 

You should always include the `lang` attribute inside the `<html>` tag, to declare the language of the Web page. This is meant to assist search engines and browsers. 

The `title` attribute defines some extra information about an element. The value of the title attribute will be displayed as a tooltip when you mouse over the element. 

Attribute names are not case sensitive, but we usually use lowercase. 

We suggest always quoting attribute values. 

Here is an example: 

```html
<!-- example of some basic HTML elements -->

<!DOCTYPE html>
<html lang="en-US">

<head>
<title>Page Title</title>
</head>

<body>
    
<h1 style="font-size:20px;">My First Heading</h1>

<img src="my_image.jpg" style="width:50%;height:50%;" alt="Girl with a jacket">

<p title="I'm a tooltip" style="color:red; font-size:120%; font-family: Arial; text-align:center;">
The <b>first</b> line.<br>The second line.
</p>

<a href="https://www.w3schools.com">This is a link</a>

<pre>
	The first line.
	The second line.
</pre>
    
</body>
</html>
```

And the display in browser:

---
<h1 style="font-size:20px;">My First Heading</h1>
<img src="my_image.jpg" style="width:50%;height:50%;" alt="Girl with a jacket">

<p title="I'm a tooltip" style="color:red; font-size:120%; font-family: Arial; text-align:center;">
The <b>first</b> line.<br>The second line.
</p>

<a href="https://www.w3schools.com">This is a link</a>

<pre>
	The first line.
	The second line.
</pre>
---

### HTML `class` and `id` Attribute

#### `class` Attribute

The HTML `class` attribute is used to specify a class for an HTML element. Multiple HTML elements can share the same class. The `class` attribute is often used to point to a class name in a style sheet. It can also be used by a JavaScript to access and manipulate elements with the specific class name.

The `class` attribute can be used on **any** HTML element. To create a class, write a period (.) character, followed by a class name, then define the CSS properties within curly braces {}.

```html
<!-- example of HTML class attribute -->

<!DOCTYPE html>
<html>
<head>
<style>
.note {
  font-size: 120%;
  color: red;
}
.city {
  background-color: tomato;
  border: 2px solid black;
  margin: 20px;
  padding: 20px;
}
</style>
</head>
<body>

<h2>My <span class="note">Important</span> Heading</h2>
<p>This is some <span class="note">important</span> text.</p>

<div class="city">
  <h2>London</h2>
  <p>London is the capital of England.</p>
</div>

</body>
</html>
```

The class name can also be used by JavaScript to perform certain tasks for specific elements. JavaScript can access elements with a specific class name with the `getElementsByClassName()` method. 

#### `id` Attribute

The `id` attribute specifies a unique id for an HTML element. The value of the `id` attribute must be unique within the HTML document. 

The `id` attribute is used to point to a specific style declaration in a style sheet. It is also used by JavaScript to access and manipulate the element with the specific id. JavaScript can access an element with a specific id with the `getElementById()` method.

The syntax for id is: write a hash character (#), followed by an id name. Then, define the CSS properties within curly braces {}.

In the following example we have an `<h1>` element that points to the id name "myHeader". This `<h1>` element will be styled according to the `#myHeader` style definition in the head section: 

```html
<!DOCTYPE html>
<html>
<head>
<style>
#myHeader {
  background-color: lightblue;
  color: black;
  padding: 40px;
  text-align: center;
}
</style>
</head>
<body>

<h1 id="myHeader">My Header</h1>

</body>
</html>
```

HTML bookmarks are used to allow readers to jump to specific parts of a webpage. Bookmarks can be useful if your page is very long. To use a bookmark, you must first create it. For example, 

```html
<p id="bookmark" color="grey" style="font-style: italic;">A bookmark</p>
```

<p id="bookmark" color="grey" style="font-style: italic;">A bookmark</p>

Then, add a link to the bookmark ("Link to the bookmark"), from within the same page: 

```html
<a href="#bookmark">Link to the bookmark</a>
```

<a href="#bookmark">Link to the bookmark</a>

Or, add a link from another page:

```html
<a href="html_demo.html#bookmark">Link to the bookmark</a>
```

Then, when the link is clicked, the page will scroll to the location with the bookmark. 

#### Difference Between `class` and `id`

A class name can be used by multiple HTML elements, while an id name must only be used by one HTML element within the page. 

## CSS

**CSS** stands for **C**ascading **S**tyle **S**heets. CSS **describes how HTML elements are to be displayed on**. CSS saves a lot of work. It can control the layout of multiple web pages all at once.

The word **cascading** means that a style applied to a parent element will also apply to all children elements within the parent. So, if you set the color of the body text to "blue", all headings, paragraphs, and other text elements within the body will also get the same color (unless you specify something else).

CSS can be added to HTML elements in 3 ways:

- Inline - by using the `style` attribute in HTML elements;
- Internal - by using a `<style>` element in the `<head>` section;
- External - by using an external CSS file. (most common)

### Inline CSS

An **inline CSS** uses the `style` attribute to apply a unique style to a single HTML element. For example, 

```html
<!-- Inline CSS example -->
<h1 style="color:blue;">A Blue Heading</h1>
<p style="color:red;">A red paragraph.</p>
```

### Internal CSS

An **internal CSS** is used to define a style for a single HTML page, and it is defined in the `<head>` section of an HTML page, within a `<style>` element.

The following example sets the text color of ALL the `<h1>` elements (on that page) to blue, and the text color of ALL the `<p>` elements to red. In addition, the page will be displayed with a "powderblue" background color: 

```html
<!-- Internal CSS example -->

<!DOCTYPE html>
<html>
<head>
<style>
body {background-color: powderblue;}
h1   {color: blue;}
p    {color: red;}
</style>
</head>
<body>

<h1>This is a heading</h1>
<p>This is a paragraph.</p>

</body>
</html>
```

### External CSS

An **external CSS** (external style sheet) is used to define the style for many HTML pages. To use that, add a link to it in the `<head>` section of each HTML page. For example, 

```html
<!-- External CSS example -->

<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="/html/styles.css">
</head>
<body>

<h1>This is a heading</h1>
<p>This is a paragraph.</p>

</body>
</html>
```

The external style sheet can be written in any text editor. The file must not contain any HTML code, and must be saved with a `.css` extension. Here is how the "`styles.css`" file looks like:

```css
/* CSS file example */

body {
  background-color: powderblue;
}
h1 {
  color: blue;
}
p {
  color: red;
}
```

With an external style sheet, you can change the look of an entire web site, by changing one file. 

External style sheets can be referenced with a full URL: 

```css
<link rel="stylesheet" href="https://www.w3schools.com/html/styles.css">
```

Or with a path relative to the current web page:

```css
<link rel="stylesheet" href="/html/styles.css">
```

### CSS Properties

We demonstrate some commonly used CSS properties. 

The CSS `border` property defines a border around an HTML element. (You can define a border for nearly all HTML elements.)

The CSS `padding` property defines a padding (space) between the text and the border. 

The CSS `margin` property defines a margin (space) outside the border.

```css
p {
  color: red;
  font-family: courier;
  font-size: 160%;
  border: 2px solid powderblue;
  padding: 30px;
  margin: 50px;
}
```

---

**References**:

https://www.w3schools.com/html.

https://www.w3schools.com/css.