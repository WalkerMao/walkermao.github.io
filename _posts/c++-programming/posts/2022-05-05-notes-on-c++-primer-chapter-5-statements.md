---
layout: post
title: "Notes on \"C++ Primer\": Chapter 5. Statements"
date: 2022-05-04
categories: CS
tags: [C++]
toc: true
comments: true
published: true
hidden: true
---

## Chapter 5. Statements

Like most languages, C++ provides statements for conditional execution, loops that repeatedly execute the same body of code, and jump statements that interrupt the flow of control.

### 5.1 Simple Statements

##### Null Statements

The simplest statement is the empty statement, also known as a null statement, which is a single semicolon:

```c++
; // null statement
```

For example, 

```c++
// read until we hit end-of-file or find an input equal to sought
while (cin >> s && s != sought)
    ; // null statement
// do something with s
```

Best Practice: Null statements should be commented. That way anyone reading the code can see that the statement was omitted intentionally.

##### Beware of Missing or Extraneous Semicolons

```c++
ival = v1 + v2;; // ok: second semicolon is a superfluous null statement
```

Although an unnecessary null statement is often harmless, an extra semicolon following the condition in a while or if can drastically alter the programmer's intent. For example, the following code will loop indefinitely:

```c++
// disaster: extra semicolon: loop body is this null statement
while (iter != svec.end()) ; // the while body is the empty statement
    ++iter; // increment is not part of the loop
```

Extraneous null statements are not always harmless.

WARNING: Extraneous null statements are not always harmless.

##### Compound Statements (Blocks)

A **compound statement**, usually referred to as a **block**, is a (possibly empty) sequence of statements and declarations surrounded by a pair of curly braces. A block is a scope (§ 2.2.4, p. 48). Names introduced inside a block are accessible only in that block and in blocks nested inside that block. 

By enclosing the statements in curly braces, we made them into a single (compound) statement.

We can also define an empty block which is equivalent to a null statement:

```c++
while (cin >> s && s != sought)
    { } // empty block
```

### 5.2 Statement Scope

We can define variables inside the control structure of the `if`, `switch`, `while`, and `for` statements. Variables defined in the control structure are visible only within that statement and are out of scope after the statement ends:

```c++
while (int i = get_num()) // i is created and initialized on each iteration
    cout << i << endl;
i = 0; // error: i is not accessible outside the loop
```

If we need access to the control variable, then that variable must be defined outside the statement:

```c++
// find the first negative element
auto beg = v.begin();
while (beg != v.end() && *beg >= 0)
    ++beg;
if (beg == v.end())
    // we know that all elements in v are greater than or equal to zero
```

### 5.3 Conditional Statements

C++ provides two statements, `if` and `switch`, that allow for conditional execution. 

#### 5.3.1 The `if` Statement

The syntactic form of the simple `if` without an `else` branch is

```c++
if (condition)
    statement
```

An `if else` statement has the form

```c++
if (condition)
    statement
else
    statement2
```

##### Using an `if else` Statement

##### Nested `if` Statements

##### Watch Your Braces

To avoid the problems caused by missing braces, some coding styles recommend always using braces after an `if` or an `else` (and also around the bodies of `while` and `for` statements). Doing so avoids any possible confusion. It also means that the braces are already in place if later modifications of the code require adding statements.

##### Dangling `else`

##### Controlling the Execution Path with Braces

#### 5.3.2 The `switch` Statement

The `case` keyword and its associated value together are known as the `case` label. `case` labels must be integral constant expressions (§ 2.4.4, p. 65). It is an error for any two `case` labels to have the same value.

```c++
// counting vewels
// initialize counters for each vowel
unsigned aCnt = 0, eCnt = 0, iCnt = 0, oCnt = 0, uCnt = 0;
char ch;
while (cin >> ch) {
    // if ch is a vowel, increment the appropriate counter
    switch (ch) {
        case 'a':
            ++aCnt;
            break;
        case 'e':
            ++eCnt;
            break;
        case 'i':
            ++iCnt;
            break;
        case 'o':
            ++oCnt;
            break;
        case 'u':
            ++uCnt;
            break;
    }
}
```

##### Control Flow within a `switch`

After a `case` label is matched, execution starts at that label and continues across all the remaining `case`s or until the program explicitly interrupts it. To avoid executing code for subsequent `case`s, we must explicitly add a `break` to tell the compiler to stop execution. 

There are also situations that we omit a `break` statement to allow the program to fall through multiple case labels.

```c++
unsigned vowelCnt = 0;
// ...
switch (ch)
{
    // any occurrence of a, e, i, o, or u increments vowelCnt
    case 'a':
    case 'e':
    case 'i':
    case 'o':
    case 'u':
        ++vowelCnt;
        break;
}
```

Because C++ programs are free-form, case labels need not appear on a new line.

```c++
switch (ch)
{
    // alternative legal syntax
    case 'a': case 'e': case 'i': case 'o': case 'u':
        ++vowelCnt;
        break;
}
```

##### Forgetting a `break` Is a Common Source of Bugs

Best Practice: Although it is not necessary to include a `break` after the last label of a `switch`, the safest course is to provide one. That way, if an additional case is added later, the `break` is already in place.

##### The `default` Label

The statements following the `default` label are executed when no `case` label matches the value of the `switch` expression.

```c++
// if ch is a vowel, increment the appropriate counter
switch (ch) {
    case 'a': case 'e': case 'i': case 'o': case 'u':
        ++vowelCnt;
        break;
    default:
        ++otherCnt;
        break;
    }
}
```

Best Practice: It can be useful to define a `default` label even if there is no work for the `default` case. Defining an empty `default` section indicates to subsequent readers that the case was considered.

##### Variable Definitions inside the Body of a `switch`

It is illegal to jump from a place where a variable with an initializer is out of scope to a place where that variable is in scope:

```c++
case true:
    // this switch statement is illegal because these initializations might be bypassed
    string file_name; // error: control bypasses an implicitly initialized variable
    int ival = 0; // error: control bypasses an explicitly initialized variable
    int jval; // ok: because jval is not initialized
    break;
case false:
    // ok: jval is in scope but is uninitialized
    jval = next_num(); // ok: assign a value to jval
    if (file_name.empty()) // file_name is in scope but wasn't initialized
        // ...
```

### 5.4 Iterative Statements

C++ provides three iterative statements (commonly called loops): `while`, `for` and `do while`.

#### 5.4.1 The while Statement

```c++
while (condition)
    statement
```

Note: Variables defined in a `while` condition or `while` body are created and destroyed on each iteration.

##### Using a `while` Loop

#### 5.4.2 Traditional for Statement

The syntactic form of the `for` statement is:

```c++
for (init-statement condition; expression)
    statement
```

or equivalently

```c++
for (initializer; condition; expression)
    statement
```

The `for` and the part inside the parentheses is often referred to as the `for` header.

##### Execution Flow in a Traditional `for` Loop

Executes until the condition is `false`: 

init-statement -> condition is `true` -> statement (`for` body) -> expression -> condition is `true` -> statement -> expression -> ... -> condition is `false`.

##### Multiple Definitions in the `for` Header

init-statement can define several objects, but with only a single declaration statement. Therefore, all the variables must have the same base type (§ 2.3, p. 50). 

```c++
// remember the size of v and stop when we get to the original last element
for (decltype(v.size()) i = 0, sz = v.size(); i != sz; ++i)
    v.push_back(v[i]);
```

In this loop we define both the index, `i`, and the loop control, `sz`, in init-statement.

##### Omitting Parts of the `for` Header

A `for` header can omit any (or all) of init-statement, condition, or expression.

We can use a null statement for init-statement when an initialization is unnecessary. For example, we might rewrite the loop that looked for the first negative number in a `vector` so that it uses a `for`:

```c++
auto beg = v.begin();
for ( /* null */; beg != v.end() && *beg >= 0; ++beg)
    ; // no work to do
```

Omitting condition is equivalent to writing true as the condition, so the `for` body must contain a statement that exits the loop.

```c++
for (int i = 0; /* no condition */ ; ++i) {
    // process i; code inside the loop must stop the iteration!
}
```

We can also omit expression from the for header. In such loops, either the condition or the body must do something to advance the iteration. As an example, we'll rewrite the `while` loop that read input into a `vector` of `int`s, and we let the condition change the value of `i`:

```c++
vector<int> v;
for (int i; cin >> i; /* no expression */ )
    v.push_back(i);
```

#### 5.4.3 Range `for` Statement

The new standard introduced the range `for` statement that can be used to iterate through the elements of a container or other sequence. 

```c++
for (declaration : expression)
    statement
```

The expression must represent a sequence, such as a braced initializer list (§ 3.3.1, p. 98), an array (§ 3.5, p. 113), or an object of a type such as vector or string that has begin and end members that return iterators (§ 3.4, p. 106).

The declaration defines a variable. It must be possible to convert each element of the sequence to the variable's type (§ 4.11, p. 159). The easiest way to ensure that the types match is to use the `auto` type specifier (§ 2.5.2, p. 68). 

An example that doubles the value of each element in a `vector`:

```c++
vector<int> v = {0,1,2,3,4,5,6,7,8,9};
// range variable must be a reference so we can write to the elements
for (auto &r : v) // for each element in v
    r *= 2; // double the value of each element in v
```

is equivalent to 

```c++
for (auto beg = v.begin(), end = v.end(); beg != end; ++beg) {
    auto &r = *beg; // r must be a reference so we can change the element
    r *= 2; // double the value of each element in v
}
```

Now that we know how a range for works, we can understand why we said in  § 3.3.2 (p. 101) that we cannot use a range `for` to add elements to a `vector` (or other container). In a range for, the value of `end()` is cached. If we add elements to (or remove them from) the sequence, the value of `end` might be invalidated
(§ 3.4.1, p. 110). We'll have more to say about these matters in § 9.3.6 (p. 353).

#### 5.4.4 The `do while` Statement

The condition is tested after the loop body completes. The loop body is executed at least once.

```c++
do
    statement
while (condition);
```

### 5.5 Jump Statements

Jump statements interrupt the flow of execution. C++ offers four jumps: `break`, `continue`, `goto`, and `return`.

5.5.1 The `break` Statement

A `break` can appear only within an iteration statement or `switch` statement.

#### 5.5.2 The `continue` Statement

A `continue` can appear only inside an iterative statement.

#### 5.5.3 The `goto` Statement

```c++
goto label;
```

where `label` is an identifier that identifies a labeled statement.

```c++
label: ... // labeled statement; may be the target of a goto
```

### 5.6 `try` Blocks and Exception Handling

Exceptions are run-time anomalies.

In C++, exception handling involves throw expressions, try blocks and a set of exception classes.

#### 5.6.1 A `throw` Expression

The detecting part of a program uses a `throw` expression to raise an exception. 

```c++
throw runtime_error("Exception message")
```

The type `runtime_error` is one of the standard library exception types and is defined in the `stdexcept` header. We must initialize a `runtime_error` by giving it a `string` or a C-style character string (§ 3.5.4, p. 122). 

#### 5.6.2 The `try` Block

```c++
try {
    program-statements
} catch (exception-declaration) {
    handler-statements
} catch (exception-declaration) {
    handler-statements
} // ...
```

##### Writing a Handler

```c++
try {
    // ...
} catch (runtime_error err) {
    cout << err.what()
    // ...
}
```

`err` has type `runtime_error` and `what` is a member function (§ 1.5.2, p. 23) of the `runtime_error` class. Each of the library exception classes defines a member function named `what`. These functions take no arguments and return a C-style character string (i.e., a `const char*`). The `what` member of `runtime_error` returns a copy of the `string` (i.e. the `"Exception message"`) used to initialize the particular object. 

##### Functions Are Exited during the Search for a Handler

If a program has no `try` blocks or no appropriate `catch` is found, a library function named `terminate` is called and the the program is aborted.

#### 5.6.3 Standard Exceptions

The C++ library defines several classes that it uses to report problems encountered in the functions in the standard library. These classes are defined in four headers:

* The `exception` header defines the most general kind of exception class named `exception`. It communicates only that an exception occurred but provides no additional information.
* The `stdexcept` header defines several general-purpose exception classes, which are listed in Table 5.1.
* The `new` header defines the `bad_alloc` exception type, which we cover in § 12.1.2 (p. 458).
* The `type_info` header defines the `bad_cast` exception type, which we cover in § 19.2 (p. 825).

<div align='center'>
<figure>
<img src="https://www.oreilly.com/library/view/c-primer-fifth/9780133053043/graphics/05tab01.jpg" alt="Image" style="zoom:100%;" />
<figcaption style="font-size: 80%;"> Table 5.1. Standard Exception Classes Defined in &lt;stdexcept&gt; (<a href="https://www.oreilly.com/library/view/c-primer-fifth/9780133053043/ch05lev2sec15.html">Source</a>) </figcaption>
</figure>
</div>


The exception types define only a single operation named `what`. 

### Chapter Summary

C++ provides a limited number of statements. Most of these affect the flow of control within a program:

* `while`, `for`, and `do while` statements, which provide iterative execution.
* `if` and `switch`, which provide conditional execution.
* `continue`, which stops the current iteration of a loop.
* `break`, which exits a loop or switch statement.
* `goto`, which transfers control to a labeled statement.
* `try` and `catch`, which define a `try` block enclosing a sequence of statements that might throw an exception. The `catch` clause(s) are intended to handle the exception(s) that the enclosed code might throw.
* `throw` expression statements, which exit a block of code, transferring control to an associated catch clause.
* `return`, which stops execution of a function. 

In addition, there are expression statements and declaration statements. An expression statement causes the subject expression to be evaluated. Declarations and definitions of variables were described in Chapter 2.

### Defined Terms

**block** Sequence of zero or more statements enclosed in curly braces.

**compound statement** Synonym for block.

**exception safe** Term used to describe programs that behave correctly when exceptions are thrown.

**flow of control** Execution path through a program.

**raise** Often used as a synonym for **throw**. C++ programmers speak of "throwing" or "raising" an exception interchangeably.

<br>

## References

Lippman, Stanley B., Josée Lajoie, and Barbara E. Moo. *C++ Primer*. Addison-Wesley Professional, 2012. 

