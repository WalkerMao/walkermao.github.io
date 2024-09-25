---
layout: post
title: "Notes on \"C++ Primer\": Chapter 1. Getting Started"
date: 2022-05-01
categories: CS
tags: [C++]
toc: true
comments: true
published: true
hidden: true
---

## Chapter 1. Getting Started

### 1.1 Writing a Simple C++ Program

**Every C++ program contains one or more functions, one of which must be named `main`. The operating system runs a C++ program by calling `main`.** Here is a simple version of `main` that returns a value to the operating system:

```c++
int main()
{
	return 0;
}
```

**On most systems, the value returned from `main` is a status indicator. A return value of `0` indicates success. A nonzero return has a meaning that is defined by the system. Ordinarily a nonzero return indicates what kind of error occurred.** 

#### 1.1.1 Compiling and Executing Our Program
Having written the program, we need to compile it. 

**Integrated development environment (IDE) bundles the compiler with build and analysis tools.** Most compilers, including those that come with an IDE, provide a command line interface. It is usually easier to get started with a command line interface, rather than an IDE.

##### Program Source File Naming Convention

Program files are normally referred to as a **source files**. The suffix of the file tells the system that the file is a C++ program.  Different compilers use different suffix conventions; the most common include `.cc`, `.cxx`, `.cpp`, `.cp`, and `.C`.

##### Running the Compiler from the Command Line

If we are using a command-line interface, we will typically compile a program in a console window (such as a shell window on a UNIX system or a Command Prompt window on Windows). **The compiler generates an executable file.** 

The command used to run the C++ compiler varies across compilers and operating systems. The most common compilers are the GNU compiler and the Microsoft Visual Studio compilers. 

The command to run the GNU compiler is `g++`. Assuming that our `main` program is in a file named `prog1.cc`, we might compile it by using a command such as

```shell
$ g++ -o prog1 prog1.cc
```

Here `$` is the system prompt. The `-o prog1` is an argument to the compiler and names the file in which to put the executable file as `prog1`. This command generates an executable file named `prog1` on UNIX systems and `prog1.exe` on Windows. If the `-o prog1` is omitted, the compiler generates an executable named `a.out` on UNIX systems and `a.exe` on Windows.

To run the executable `prog1` on UNIX:

```shell
$ ./prog1
```

The value returned from `main` is accessed in a system-dependent manner. After executing the program, we issue an appropriate `echo` command to obtain the status:

```sh
$ echo $?
```

### 1.2 A First Look at Input/Output

The C++ language does not define any statements to do input or output (IO). Instead, C++ includes an extensive **standard library** that provides IO (and many other facilities). 

Most of the examples in this book use the `iostream` library. Fundamental to the `iostream` library are two types named `istream` and `ostream`, which represent input and output streams, respectively. A stream is a sequence of characters read from or written to an IO device. The term stream is intended to suggest that the characters are generated, or consumed, sequentially over time.

##### Standard Input and Output Objects

**The `iostream` library defines four IO objects.** 

| Object name | Type      | Used for                                               | Also known as   |
| ----------- | --------- | ------------------------------------------------------ | --------------- |
| `cin`       | `istream` | Input                                                  | Standard input  |
| `cout`      | `ostream` | Output                                                 | Standard output |
| `cerr`      | `ostream` | Warning and error messages                             | Standard error  |
| `clog`      | `ostream` | General information about the execution of the program | -               |

Ordinarily, the system associates each of these objects with the window in which the program is executed. So, when we read from `cin`, data are read from the window in which the program is executing, and when we write to `cout`, `cerr`, or `clog`, the output is written to the same window.

##### A Program That Uses the IO Library

Using the IO library, we can extend our main program to prompt the user to give us two numbers and then print their sum:

```c++
#include <iostream>
int main()
{
    std::cout << "Enter two numbers:" << std::endl;
    int v1 = 0, v2 = 0;
    std::cin >> v1 >> v2;
    std::cout << "The sum of " << v1 << " and " << v2
              << " is " << v1 + v2 << std::endl;
    return 0;
}
```

The first line of our program `#include <iostream>` tells the compiler that we want to use the `iostream` library. The name inside angle brackets (`iostream` in this case) refers to a header. Every program that uses a library facility must include its associated header. 

##### Writing to a Stream

In C++ an **expression** yields a result and is composed of one or more **operands** and (usually) an **operator**.

The output operator `<<` writes the given value (right-hand operand) on the given `ostream` object (left-hand operand). The output operator returns its left-hand operand as its result. The following three expressions are equivalent:

```c++
std::cout << "Enter two numbers:" << std::endl;
```

```c++
(std::cout << "Enter two numbers:") << std::endl;
```

```c++
std::cout << "Enter two numbers:";
std::cout << std::endl;
```

The second operator prints `endl`, which is a special value called a manipulator. Writing `endl` has the effect of ending the current line and flushing the buffer associated with that device. Flushing the buffer ensures that all the output the program has generated so far is actually written to the output stream, rather than sitting in memory waiting to be written.

##### Using Names from the Standard Library

The prefix `std::` of `std::cout` and `std::endl` indicates that the names `cout` and `endl` are defined inside the **namespace** named `std`. **All the names defined by the standard library are in the `std` namespace.** 

Rather than using the prefix `std::`, we can also write the line `using namespace std;` to make all the names in the `std` namespace available, then you can use names defined in the `std` namespace without using the `std::` prefix; [^2]

```c++
#include <iostream>
using namespace std;
int main()
{	
    cout << "Enter two numbers:" << endl;
    // ...
}
```

This way simplifies the code but modern practice regards this as a bit lazy and potentially a problem in large projects. The preferred approaches are to use the `std::` qualifier or to use something called a `using` declaration to make just particular names available: [^2]

```c++
using std::cout; // make cout available
using std::endl; // make endl available
using std::cin; // make cin available
```

##### Reading from a Stream

The input operator `>>` reads data from the given `istream` object (left-hand operand) and stores what was read in the given object (right-hand operand). Like the output operator, the input operator returns its left-hand operand as its result.

The following three expressions are equivalent:

```c++
std::cin >> v1 >> v2;
```

```c++
(std::cin >> v1) >> v2;
```

```c++
std::cin >> v1;
std::cin >> v2;
```

### 1.3 A Word about Comments

Single-line comments start with `//`:

```c++
// a comment
```

Multi-line comments start with `/*` and ends with `*/`:

```c++
/* 
 This is 
 a comment 
*/
```

### 1.4 Flow of Control

#### 1.4.1 The `while` Statement

For example, 

```c++
int sum = 0, val = 1;
while (val <= 10) {
    sum += val;
	++val;
}
```

#### 1.4.2 The `for` Statement

For example, 

```c++
int sum = 0;
for (int val = 1; val <= 10; ++val) {
    sum += val;
}
```

#### 1.4.3 Reading an Unknown Number of Inputs

For example,

```c++
#include <iostream>
int main()
{
    int sum = 0, value = 0;
    while (std::cin >> value) {
        sum += value; 
    }
    std::cout << "Sum is: " << sum << std::endl;
    return 0;
}
```

If we give this program the input `3 4 5 6` then our output will be `Sum is: 18`. 

The input operator returns its left operand, which in this case is `std::cin`. This condition, therefore, tests `std::cin`. An `istream` becomes invalid when we hit `end-of-file` or encounter an invalid input, such as reading a value that is not an integer. An `istream` that is in an invalid state will cause the condition to yield false.

#### 1.4.4 The `if` Statement

```c++
if (condition){
    expressions
} else if {
    expressions
} else {
    expressions
}
```

### 1.5 Introducing Classes

**In C++ we define our own data structures by defining a class.** **A class defines a type along with a collection of operations that are related to that type.** The class mechanism is one of the most important features in C++. In fact, a primary focus of the design of C++ is to make it possible to define class types that behave as naturally as the built-in types.

As we've seen, to use a library facility, we must include the associated header. Similarly, we use headers to access classes defined for our own applications. Conventionally, header file names are derived from the name of a class defined in that header. Header files that we write usually have a suffix of `.h`, but some programmers use `.H`, `.hpp`, or `.hxx`. The standard library headers typically have no suffix at all. Compilers usually don't care about the form of header file names, but IDEs sometimes do.

#### 1.5.1 The `Sales_item` Class

**Every class defines a type. The type name is the same as the name of the class.** Hence, our `Sales_item` class defines a type named `Sales_item`. As with the built-in types, we can define a variable of a class type. When we write `Sales_item item;`, we are saying that item is an object of type `Sales_item`. We often contract the phrase "an object of type `Sales_item`" to "a `Sales_item` object" or even more simply to "a `Sales_item`". 

The following program reads data from the standard input into a `Sales_item` object and writes that `Sales_item` back onto the standard output:

```c++
#include <iostream>
#include "Sales_item.h"
int main()
{
	Sales_item book;
	// read ISBN, number of copies sold, and sales price
	std::cin >> book;
	// write ISBN, number of copies sold, total revenue, and average price
	std::cout << book << std::endl;
	return 0;
}
```

Headers from the standard library are enclosed in angle brackets (`< >`). Those that are not part of the library are enclosed in double quotes (`" "`).

TIP: USING FILE REDIRECTION

It can be tedious to repeatedly type these transactions as input to the programs you are testing. Most operating systems support file redirection, which lets us associate a named file with the standard input and the standard output:

```shell
$ addItems <infile >outfile
```

Assuming `$` is the system prompt and our addition program has been compiled into an executable file named `addItems.exe` on Windows (or `addItems` on UNIX systems), this command will read transactions from a file named `infile` and write its output to a file named `outfile` in the current directory. 

#### 1.5.2 A First Look at Member Functions

**A member function (or a method) is a function that is defined as part of a class.** 

### Chapter Summary

### Defined Terms

**header** Mechanism whereby the definitions of a class or other names are made available to multiple programs. A program uses a header through a `#include` directive.

**main** Function called by the operating system to execute a C++ program. Each program must have one and only one function named main.

**namespace** Mechanism for putting names defined by a library into a single place. Namespaces help avoid inadvertent name clashes. The names defined by the C++ library are in the namespace `std`.

**standard library** Collection of types and functions that every C++ compiler must support. The library provides the types that support IO. C++ programmers tend to talk about "the library", meaning the entire standard library. They also tend to refer to particular parts of the library by referring to a library type, such as the "`iostream` library", meaning the part of the standard library that defines the IO classes. 

**std** Name of the namespace used by the standard library. `std::cout` indicates that we're using the name `cout` defined in the std namespace.

**variable** A named object.

**. operator** Dot operator. Left-hand operand must be an object of class type and the right-hand operand must be the name of a member of that object. The operator yields the named member of the given object.

**:: operator** Scope operator. Among other uses, the scope operator is used to access names in a namespace.

<br>

## References

[1] Lippman, Stanley B., Josée Lajoie, and Barbara E. Moo. *C++ Primer*. Addison-Wesley Professional, 2012. 

[2] Prata, Stephen. *C++ primer plus*. Addison-Wesley Professional, 2011.
