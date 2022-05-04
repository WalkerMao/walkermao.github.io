---
layout: post
title: "Notes on \"C++ Primer\": Getting Started and Data Types (Chapter 1~3)"
date: 2022-04-30
categories: CS
tags: [C++]
comments: true
published: true
hidden: false
---

[TOC]

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

## Chapter 2. Variables and Basic Types

Some languages, such as Smalltalk and Python, check types at run time. In contrast, **C++ is a statically typed language; type checking is done at compile time.** As a consequence, the compiler must know the type of every name used in the program.

**Types are fundamental to any program: They tell us what our data mean and what operations we can perform on those data.** 

C++ defines several primitive types (characters, integers, floating-point numbers, etc.) and provides mechanisms that let us define our own data types. The library uses these mechanisms to define more complicated types such as variable-length character strings, vectors, and so on.

### 2.1 Primitive Built-in Types

**C++ defines a set of primitive types that include the arithmetic types and a special type named `void`.** 

The `void` type has no associated values and can be used in only a few circumstances, most commonly as the return type for functions that do not return a value.

#### 2.1.1 Arithmetic Types

**The arithmetic types are divided into two categories: integral types (which include character and boolean types) and floating-point types.**

The size of—that is, the number of bits in—the arithmetic types varies across machines. The standard guarantees minimum sizes as listed in Table 2.1. However, compilers are allowed to use larger sizes for these types.

<div align='center'>
<figure>
<img src="https://www.oreilly.com/library/view/c-primer-fifth/9780133053043/graphics/02tab01.jpg" alt="Table 2.1: C++: Arithmetic Types" style="zoom:120%;" />
<figcaption style="font-size: 80%;"> Table 2.1: C++: Arithmetic Types (<a href="https://www.oreilly.com/library/view/c-primer-fifth/9780133053043/ch02lev2sec1.html">Source</a>) </figcaption>
</figure>
</div>
The `bool` type represents the truth values `true` and `false`.

There are several character types, most of which exist to support internationalization. The basic character type is `char`. A `char` is guaranteed to be big enough to hold numeric values corresponding to the characters in the machine's basic character set. That is, a `char` is the same size as a single machine byte. The remaining character types—`wchar_t`, `char16_t`, and `char32_t`—are used for extended character sets.

The `char` data type is used to store a single character. The character must be surrounded by single quotes, like 'A' or 'c': `char my_grade = 'A'`.  Alternatively, you can use ASCII values to display certain characters: `char my_grade = 65`.

There are different integer types represent integer values of (potentially) different sizes. The language guarantees that an `int` will be at least as large as `short`, a `long` at least as large as an `int`, and `long long` at least as large as `long`. The type `long long` was introduced by the new standard. 

The floating-point types represent single-, double-, and extended-precision values. The standard specifies a minimum number of significant digits. Most compilers provide more precision than the specified minimum. Typically, **`float`s are represented in one word (32 bits), `double`s in two words (64 bits), and `long double`s in either three or four words (96 or 128 bits).** The `float` and `double` types typically yield about 7 and 16 significant digits, respectively. The type `long double` is often used as a way to accommodate special-purpose floating-point hardware; its precision is more likely to vary from one implementation to another.

MACHINE-LEVEL REPRESENTATION OF THE BUILT-IN TYPES

Computers store data as a sequence of bits, each holding a 0 or 1, such as 000110110111000101... Most computers deal with memory as chunks of bits of sizes that are powers of 2. **The smallest chunk of addressable memory is referred to as a "byte".** The basic unit of storage, usually a small number of bytes, is referred to as a "word". In C++ a byte has at least as many bits as are needed to hold a character in the machine's basic character set. **On most machines a byte contains 8 bits** and a word is either 32 or 64 bits, that is, 4 or 8 bytes.

**Most computers associate a number (called an "address") with each byte in memory.** To give meaning to memory at a given address, we must know the type of the value stored there. The type determines how many bits are used and how to interpret those bits.

##### Signed and Unsigned Types

Except for `bool` and the extended character types, the integral types may be **signed** or **unsigned**. A signed type represents negative or positive numbers (including zero); an unsigned type represents only values greater than or equal to zero. 

The types `int`, `short`, `long`, and `long long` are all signed. We obtain the corresponding unsigned type by adding `unsigned` to the type, such as `unsigned long`. The type `unsigned int` may be abbreviated as `unsigned`.

Unlike the other integer types, there are three distinct basic character types: `char`, `signed char`, and `unsigned char`. In particular, `char` is not the same type as `signed char`. Although there are three character types, there are only two representations: signed and unsigned. The (plain) char type uses one of these representations. Which of the other two character representations is equivalent to char depends on the compiler.

In an unsigned type, all the bits represent the value. For example, an 8-bit `unsigned char` can hold the values from 0 through 255 inclusive.

The standard does not define how signed types are represented, but does specify that the range should be evenly divided between positive and negative values. Hence, an 8-bit `signed char` is guaranteed to be able to hold values from –127 through 127; most modern machines use representations that allow values from –128 through 127.

**ADVICE: DECIDING WHICH TYPE TO USE**

A few rules of thumb can be useful in deciding which type to use:

- Use an unsigned type when you know that the values cannot be negative.
- **Use `int` for integer arithmetic.** short is usually too small and, in practice, `long` often has the same size as `int`. If your data values are larger than the minimum guaranteed size of an `int`, then use `long long`.
- Do not use plain `char` or `bool` in arithmetic expressions. Use them only to hold characters or truth values. Computations using `char` are especially problematic because `char` is signed on some machines and unsigned on others. If you need a tiny integer, explicitly specify either `signed char` or `unsigned char`.
- **Use `double` for floating-point computations;** `float` usually does not have enough precision, and the cost of double precision calculations versus single-precision is negligible. In fact, on some machines, double-precision operations are faster than `single`. The precision offered by  `long double` usually is unnecessary and often entails considerable run-time cost.

Types in C++:

- Primitive built-in types
  - `void` type
  - Arithmetic types
    - `bool` type
    
    - Character types
      - `char` type
      - `wchar_t` type
      - `char16_t` type
      - `char32_t` type
      
    - Integer types
    
      - `short` type
    
      - `int` type (recommended)
      - `long` type
      - `long long` type (recommended)
    
    - Floating-point types
    
      - `float` type
      - `double` type (recommended)
      - `long double` type

#### 2.1.2 Type Conversions

**The type of an object defines the data that an object might contain and what operations that object can perform.** Among the operations that many types support is the ability to convert objects of the given type to other, related types.

When we assign one arithmetic type to another:

```c++
bool b = 42; // b is true
int i = b; // i has value 1
i = 3.14; // i has value 3
double pi = i; // pi has value 3.0
unsigned char c = -1; // assuming 8-bit char s, c has value 255
signed char c2 = 256; // assuming 8-bit char s, the value of c2 is undefined
```

what happens depends on the range of the values that the types permit:

- When we assign one of the non`bool` arithmetic types to a `bool` object, the result is `false` if the value is `0` and `true` otherwise.
- When we assign a `bool` to one of the other arithmetic types, the resulting value is `1` if the `bool` is `true` and `0` if the `bool` is `false`.
- When we assign a floating-point value to an object of integral type, the value is truncated. The value that is stored is the part before the decimal point.
- When we assign an integral value to an object of floating-point type, the fractional part is zero. Precision may be lost if the integer has more bits than the floating-point object can accommodate.
- **If we assign an out-of-range value to an object of unsigned type, the result is the remainder of the value modulo the number of values the target type can hold.** For example, an 8-bit `unsigned char` can hold values from 0 through 255, inclusive. If we assign a value outside this range, the compiler assigns the remainder of that value modulo 256. Therefore, assigning –1 to an 8-bit unsigned char gives that object the value 255.
- **If we assign an out-of-range value to an object of signed type, the result is undefined.** The program might appear to work, it might crash, or it might produce garbage values.

ADVICE: AVOID UNDEFINED BEHAVIOR

Undefined behavior results from errors that the compiler is not required (and sometimes is not able) to detect. Even if the code compiles, a program that executes an undefined expression is in error.

Unfortunately, programs that contain undefined behavior can appear to execute correctly in some circumstances and/or on some compilers. There is no guarantee that the same program, compiled under a different compiler or even a subsequent release of the same compiler, will continue to run correctly. Nor is there any guarantee that what works with one set of inputs will work with another.

##### Expressions Involving Unsigned Types

If we use both `unsigned` and `int` values in an arithmetic expression, the `int` value ordinarily is converted to `unsigned`.

```c++
unsigned u = 10;
int i = -42;
std::cout << i + i << std::endl; // prints -84
std::cout << u + i << std::endl; // if 32-bit int s, prints 4294967264
```

In the second expression, the `int` value -42 is converted to `unsigned` before the addition is done.

CAUTION: DON'T MIX SIGNED AND UNSIGNED TYPES

Expressions that mix signed and unsigned values can yield surprising results when the signed value is negative. It is essential to remember that **signed values are automatically converted to unsigned**. For example, in an expression like `a * b`, if `a` is `-1` and `b` is `1`, then if both `a` and `b` are `int`s, the value is, as expected `-1`. However, if `a` is `int` and `b` is an `unsigned`, then the value of this expression depends on how many bits an int has on the particular machine. On our machine, this expression yields `4294967295`.

#### 2.1.3 Literals

A value, such as `42`, is known as a literal because its value self-evident. Every literal has a type. The form and value of a literal determine its type. 

##### Integer and Floating-Point Literals

A decimal literal has the smallest type of `int`, `long`, or `long long` (i.e., the first type in this list) in which the literal's value fits. It is an error to use a literal that is too large to fit in the largest related type. There are no literals of type `short`. 

##### Character and Character String Literals

A character enclosed within single quotes is a literal of type char. Zero or more characters enclosed in double quotation marks is a string literal:

```c++
'a' // character literal
"Hello World!" // string literal
```

The type of a string literal is array of constant `char`s.

##### Escape Sequences

Some characters, such as backspace or control characters, have no visible image. Such characters are **nonprintable**. Other characters (single and double quotation marks, question mark, and backslash) have special meaning in the language. Our programs cannot use any of these characters directly. Instead, we use an **escape sequence** to represent such characters. An escape sequence begins with a backslash. The language defines several escape sequences:

newline `\n`, vertical tab `\v`, backslash `\\`, carriage return `\r`, horizontal tab `\t`, backspace `\b`, question mark `\?`, formfeed `\f`, alert (bell) `\a`, double quote `\"`, single quote `\'`

We use an escape sequence as if it were a single character:

```c++
std::cout << '\n'; // prints a newline
std::cout << "\tHi!\n"; // prints a tab followd by "Hi!" and a newline
```

##### Specifying the Type of a Literal

We can override the default type of an integer, floating-point, or character literal by supplying a suffix or prefix as listed in Table 2.2.

<div align='center'>
<figure>
<img src="https://raw.githubusercontent.com/gaoxiangnumber1/NotesPhotos/master/Cpp/Cp/2-2.png" alt="img" style="zoom: 60%;" />
<figcaption style="font-size: 80%;"> Table 2.2: Specifying the Type of a Literal </figcaption>
</figure>
</div>

##### Boolean and Pointer Literals

The words `true` and `false` are literals of type `bool`: `bool test = false;`. The word `nullptr` is a pointer literal.

### 2.2 Variables

A variable provides us with named storage that our programs can manipulate. Each variable in C++ has a type. The type determines the size and layout of the variable's memory, the range of values that can be stored within that memory, and the set of operations that can be applied to the variable. C++ programmers tend to refer to variables as "variables" or "objects" interchangeably.

#### 2.2.1 Variable Definitions
TERMINOLOGY: WHAT IS AN OBJECT?

**Generally, an object is a region of memory that can contain data and has a type.**

##### Initializers

Initialization is not assignment. Initialization happens when a variable is given a value when it is created. Assignment obliterates an object's current value and replaces that value with a new one.

##### List Initialization

We can use any of the following four different ways to define an `int` variable named `units_sold` and initialize it to `0`:

```c++
int units_sold(0);
int units_sold = 0;
int units_sold{0};
int units_sold = {0};
```

<div align='center'>
<figure>
<img src="http://1.bp.blogspot.com/-XgAWe68aefE/U_rzHhFhCaI/AAAAAAAAACY/8i_rFdj-yJs/s1600/inital.png" alt="img" style="zoom:50%;" />
<figcaption style="font-size: 80%;"> Figure: Declaration, initialization and assignment (<a href="http://programingsconcepts.blogspot.com/2014/08/as-you-know-that-c-is-computer-language.html">Source</a>) </figcaption>
</figure>
</div>
```c++
int a = 10;
int *ptr = &a;
```

`int` is the type specifier; `a` and `*ptr` are declarators; `=10` and `=&a` are initializers. 

The initialization with the use of curly braces is referred to as **list initialization**. When used with variables of built-in type, this form of initialization has one important property: The compiler will not let us list initialize variables of built-in type if the initializer might lead to the loss of information:

```c++
long double ld = 3.1415926536;
int a{ld}, b = {ld}; // error: narrowing conversion required
int c(ld), d = ld; // ok: but value will be truncated
```

The compiler rejects the initializations of `a`and `b` because using a `long double` to initialize an `int` is likely to lose data.

##### Default Initialization

**When we define a variable without an initializer, the variable is default initialized.** Such variables are given the "default" value. What that default value is depends on the type of the variable and may also depend on where the variable is defined.

```c++
int a;
float b;
```

The value of an object of built-in type that is not explicitly initialized depends on where it is defined. **Variables of built-in type defined outside any function body are initialized to zero. Variables of built-in type defined inside a function are uninitialized.** The value of an uninitialized variable of built-in type is **undefined** (§ 2.1.2, p. 36). It is an error to copy or otherwise try to access the value of a variable whose value is undefined.

Most classes let us define objects without explicit initializers. Such classes supply an appropriate default value for us. For example, as we've just seen, the library string class says that if we do not supply an initializer, then the resulting string is the empty string:

```c++
std::string empty; // empty implicitly initialized to the empty string
Sales_item item; // default-initialized Sales_item object
```


Some classes require that every object be explicitly initialized. The compiler will complain if we try to create an object of such a class with no initializer.

Note: Uninitialized objects of built-in type defined inside a function body have undefined value. Objects of class type that we do not explicitly initialize have a value that is defined by the class.

CAUTION: UNINITIALIZED VARIABLES CAUSE RUN-TIME PROBLEMS

An uninitialized variable has an indeterminate value. Trying to use the value of an uninitialized variable is an error that is often hard to debug.

#### 2.2.2 Variable Declarations and Definitions

**Separate compilation** lets us split our programs into several files and allow programs to be written in logical parts. Each of the files can be compiled independently.

When we separate a program into multiple files, we need a way to share code across those files. For example, code defined in one file may need to use a variable defined in another file. As a concrete example, consider `std::cout` and `std::cin`. These are objects defined somewhere in the standard library, yet our programs can use these objects.

To support separate compilation, C++ distinguishes between declarations and definitions. **A declaration makes a name known to the program.** A file that wants to use a name defined elsewhere includes a declaration for that name. **A definition creates the associated entity.** **A variable**
**definition is a declaration.**

A variable declaration specifies the type and name of a variable. In addition, a definition also allocates storage and may provide the variable with an initial value.

```c++
extern int i; // declares but does not define i
int j; // declares and defines j
extern int k = 1; // declares and defines k (the initializer overrides the extern)
```

**To use the same variable in multiple files, we must define that variable in one and only one file. Other files that use that variable must declare but not define that variable.**

KEY CONCEPT: STATIC TYPING

C++ is a statically typed language, which means that types are checked at compile time. The process is referred to as **type checking**. In C++, the compiler checks whether the operations we write are supported by the types we use. A consequence is that we must declare the types of the variables before we compile the program.

#### 2.2.3 Identifiers

Identifiers in C++ can be composed of letters, digits, and the underscore character. Identifiers must begin with either a letter or an underscore. Identifiers defined outside a function may not begin with an underscore.

##### Conventions for Variable Names

Variable names normally are lowercase, while classes we define usually begin with an uppercase letter.

#### 2.2.4 Scope of a Name

At any particular point in a program, each name that is in use refers to a specific entity—a variable, function, type, and so on. 

A **scope** is a part of the program in which a name has a particular meaning. Most scopes in C++ are delimited by curly braces.

The same name can refer to different entities in different scopes. **Names are visible from the point where they are declared until the end of the scope in which the declaration appears.**

```c++
#include <iostream>
int main(){
	int sum = 0;
	for (int val = 1; val <= 10; ++val)
		sum += val;
	std::cout << "Sum is " << sum << std::endl;
	return 0;
}
```

In the program above, the name `main`—like most names defined outside a function—has **global scope**. Once declared, names at the global scope are accessible throughout the program. The name `sum` is defined within the scope of the block that is the body of the `main` function. It is accessible from its point of declaration throughout the rest of the `main` function but not outside of it. The variable `sum` has **block scope**. The name `val` is defined in the scope of the `for` statement. It can be used in that statement but not elsewhere in `main`.

##### Nested Scopes

Scopes can contain other scopes. The contained (or nested) scope is referred to as an **inner scope**, the containing scope is the **outer scope**. Once a name has been declared in a scope, that name can be used and redefined by the inner scope, but not by the outer scope. 

### 2.3 Compound Types

A **compound type** is a type that is defined in terms of another type. C++ has several compound types, two of which—references and pointers. 

#### 2.3.1 References

**A reference defines an alternative name for an object. A reference type "refers to" another type.** We define a reference type by writing a declarator of the form `&d`, where `d` is the name being declared:

```c++
int ival = 1024;
int &refVal = ival; // refVal refers to (is another name for) ival
int &refVal2; // error: a reference must be initialized
```

When we define a reference, we bind the reference to its initializer. Once initialized, a reference remains bound to its initial object. There is no way to rebind a reference to refer to a different object. References must be initialized.

##### A Reference Is an Alias

Note: **A reference is not an object. Instead, a reference is just another name for an already existing object.**

All operations on a reference are actually operations on the object to which the reference is bound:

```c++
refVal = 2; // assigns 2 to the object to which refVal refers, i.e., to ival
// refVal3 is bound to the object to which refVal is bound, i.e., to ival
int &refVal3 = refVal;
// initializes i from the value in the object to which refVal is bound
int i = refVal;
```

Because references are not objects, we may not define a reference to a reference.

##### Reference Definitions

The type of a reference and the object to which the reference refers must match exactly. A reference may be bound only to an object, not to a literal or to the result of a more general expression. 

```c++
double dval = 3.14;
int &refVal5 = dval; // error: initializer must be an int object
int &refVal4 = 10; // error: initializer must be an object
```

#### 2.3.2 Pointers

A **pointer** is a compound type that "points to" another type. Like references, pointers are used for indirect access to other objects. Unlike a reference, **a pointer is an object in its own right.** Pointers can be assigned and copied; a single pointer can point to several different objects over its lifetime. Unlike a reference, a pointer need not be initialized at the time it is defined. Like other built-in types, pointers defined at block scope have undefined value if they are not initialized.

Warning: Pointers are often hard to understand. Debugging problems due to pointer errors bedevil even experienced programmers.

We define a pointer type by writing a declarator of the form `*d`, where `d` is the name being defined.

```c++
int *ip1, *ip2; // both ip1 and ip2 are pointers to int
double dp, *dp2; // dp2 is a pointer to double; dp is a double
```

##### Taking the Address of an Object

**A pointer holds the address of another object.** We get the address of an object by using the address-of operator (the & operator):

```c++
int ival = 42;
int *p = &ival; // p holds the address of ival; p is a pointer to ival
```

The second statement defines `p` as a pointer to `int` and initializes `p` to point to the int object named `ival`. Because references are not objects, they don't have addresses. Hence, we may not define a pointer to a reference.

The types of the pointer and the object to which it points must match:

```c++
double dval;
double *pd = &dval; // ok: initializer is the address of a double
double *pd2 = pd; // ok: initializer is a pointer to double
int *pi = pd; // error: types of pi and pd differ
pi = &dval; // error: assigning the address of a double to a pointer to int
```

The types must match because the type of the pointer is used to infer the type of the object to which the pointer points. If a pointer addressed an object of another type, operations performed on the underlying object would fail.

##### Pointer Value

The value (i.e., the address) stored in a pointer can be in one of four states:
1. It can point to an object.
2. It can point to the location just immediately past the end of an object.
3. It can be a null pointer, indicating that it is not bound to any object.
4. It can be invalid; values other than the preceding three are invalid.

It is an error to copy or otherwise try to access the value of an invalid pointer. As when we use an uninitialized variable, this error is one that the compiler is unlikely to detect. The result of accessing an invalid pointer is undefined. Therefore, we must always know whether a given pointer is valid.

Although pointers in cases 2 and 3 are valid, these pointers do not point to any object, and we may not use them to access the (supposed) object to which the pointer points. If we do attempt to access an object through such pointers, the behavior is undefined.

##### Using a Pointer to Access an Object

When a pointer points to an object, we can use the **dereference operator** (the `*` operator) to access that object:

```c++
int ival = 42;
int *p = &ival; // p holds the address of ival; p is a pointer to ival 
cout << *p; // * yields the object to which p points; prints 42
```

Dereferencing a pointer yields the object to which the pointer points. We can assign to that object by assigning to the result of the dereference:

```c++
*p = 0; // * yields the object; we assign a new value to ival through p
cout << *p; // prints 0
```

When we assign to `*p`, we are assigning to the object to which `p` points.

```c++
int i = 42; 
int &r = i; // & follows a type and is part of a declaration; r is a reference
int *p; // * follows a type and is part of a declaration; p is a pointer
p = &i; // & is used in an expression as the address-of operator
*p = i; // * is used in an expression as the dereference operator
int &r2 = *p; // & is part of the declaration; * is the dereference operator
```

##### Null Pointers

A **null pointer** does not point to any object. There are several ways to obtain a null pointer:

```c++
int *p1 = nullptr; // equivalent to int *p1 = 0;
int *p2 = 0; // directly initializes p2 from the literal constant 0 
// must #include cstdlib
```

Here `nullptr` is a literal. 

It is illegal to assign an int variable to a pointer, even if the variable's value happens to be `0`.

```c++
int zero = 0;
p1 = zero; // error: cannot assign an int to a pointer
```

ADVICE: INITIALIZE ALL POINTERS

Uninitialized pointers are a common source of run-time errors. As with any other uninitialized variable, what happens when we use an uninitialized pointer is undefined.

Our recommendation to **initialize all variables is particularly important for pointers.** If possible, define a pointer only after the object to which it should point has been defined. **If there is no object to bind to a pointer, then initialize the pointer to nullptr or zero. That way, the program can detect that the pointer does not point to an object.**

##### Assignment and Pointers

Both pointers and references give indirect access to other objects. However, there are important differences in how they do so. The most important is that a reference is not an object. Once we have defined a reference, there is no way to make that reference refer to a different object. 

As with any other (nonreference) variable, when we assign to a pointer, we give the pointer itself a new value. Assignment makes the pointer point to a different object:

```c++
int i = 42;
int *pi = 0; // pi is initialized but addresses no object 
int *pi2 = &i; // pi2 initialized to hold the address of i
int *pi3; // if pi3 is defined inside a block, pi3 is uninitialized
pi3 = pi2; // pi3 and pi2 address the same object, e.g., i
pi2 = 0; // pi2 now addresses no object
```

##### Other Pointer Operations

So long as the pointer has a valid value, we can use a pointer in a condition. If the pointer is `0` (`nullptr` is also zero pointer), then the condition is `false`. Any nonzero pointer evaluates as true.

Given two valid pointers of the same type, we can compare them using the equality (`==`) or inequality (`!=`) operators. The result of these operators has type `bool`. Two pointers are equal if they hold the same address and unequal otherwise. Two pointers hold the same address (i.e., are equal) if they are both null, if they address the same object, or if they are both pointers one past the same object. Note that it is possible for a pointer to an object and a pointer one past the end of a different object to hold the same address. Such pointers will compare equal.

##### `void*` Pointers

The type `void*` is a special pointer type that can hold the address of any object. Like any other pointer, a `void*` pointer holds an address, but the type of the object at that address is unknown:

```c++
double obj = 3.14, *pd = &obj;
// ok: void* can hold the address value of any data pointer type 
void *pv = &obj; // obj can be an object of any type 
pv = pd; // pv can hold a pointer to any type
```

We cannot use a `void*` to operate on the object it addresses—we don't know that object's type, and the type determines what operations we can perform on the object.

Generally, we use a `void*` pointer to deal with memory as memory, rather than using the pointer to access the object stored in that memory.

#### 2.3.3 Understanding Compound Type Declarations

`*` or `&` are called type modifiers.

##### Defining Multiple Variables

```c++
int* p; // p is a pointer, this way is legal but might be misleading
int* p1, p2; // p1 is a pointer to int; p2 is an int
int *p1, *p2; // both p1 and p2 are pointers to int
```

##### Pointers to Pointers

**A pointer is an object in memory, so like any object it has an address.** Therefore, we can store the address of a pointer in another pointer.

We indicate each pointer level by its own `*`. That is, we write `**` for a pointer to a pointer, `***` for a pointer to a pointer to a pointer, and so on:

```c++
int ival = 1024;
int *pi = &ival; // pi points to an int
int **ppi = &pi; // ppi points to a pointer to an int
```

##### References to Pointers

A reference is not an object. Hence, we may not have a pointer to a reference. However, because a pointer is an object, we can define a reference to a pointer:

```c++
int i = 42;
int *p; // p is a pointer to int
int *&r = p; // r is a reference to the pointer p
r = &i; // r refers to a pointer; assigning &i to r makes p point to i
*r = 0; // dereferences r yields i, the object to which p points; changes i to 0
```

### 2.4 `const` Qualifier

We can make a variable unchangeable by defining the variable's type as `const`:

```c++
const int bufSize = 512; // input buffer size
```

defines `bufSize` as a constant. Any attempt to assign to `bufSize` is an error:

```c++
bufSize = 512; // error: attempt to write to const object
```

`const` object must be initialized:

```c++
const int i = get_size(); // ok: initialized at run time 
const int j = 42; // ok: initialized at compile time 
const int k; // error: k is uninitialized const
```

##### Initialization and `const`

We may use only those operations that cannot change the `const` object.

##### By Default, `const` Objects Are Local to a File

When we define a `const` with the same name in multiple files, it is as if we had written definitions for separate variables in each file.

Sometimes we have a `const` variable that we want to share across multiple files but whose initializer is not a constant expression. In this case, we define the `const` in one file, and declare it in the other files that use that object.

To define a single instance of a `const` variable, we use the keyword `extern` on both its definition and declaration(s):

```c++
// file_1.cc defines and initializes a const that is accessible to other files 
extern const int bufSize = fcn();
// file_1.h
extern const int bufSize; // same bufSize as defined in file_1.cc
```

Note: To share a `const` object among multiple files, you must define the variable as `extern`.

#### 2.4.1 References to `const`

Unlike an ordinary reference, a reference to `const` cannot be used to change the object to which the reference is bound:

```c++
const int ci = 1024;
const int &r1 =  ci; // ok: both reference and underlying object are const
r1 = 42; // error: r1 is a reference to const
int &r2 = ci; // error: nonconst reference to a const object
```

TERMINOLOGY: `const` REFERENCE IS A REFERENCE TO `const`

C++ programmers tend to abbreviate the phrase "reference to `const`" as "`const` reference".

##### Initialization and References to `const`

In § 2.3.1 (p. 51) we noted that there are two exceptions to the rule that the type of a reference must match the type of the object to which it refers. The first exception is that we can initialize a reference to const from any expression that can be converted (§ 2.1.2, p. 35) to the type of the reference. In particular, **we can bind a reference to `const` to a non`const` object, a literal, or a more general expression:**

```c++
int i = 42;
const int &r1 = i; // we can bind a const int& to a plain int object
const int &r2 = 42; // ok: r1 is a reference to const 
const int &r3 = r1 * 2; // ok: r3 is a reference to const 
int &r4 = i * 2; // error: r4 is a plain, nonconst reference
```

##### A Reference to `const` May Refer to an Object That Is Not `const`

```c++
int i = 42;
int &r1 = i; // r1 bound to i
const int &r2 = i; // r2 also bound to i; but cannot be used to change i
r1 = 0; // r1 is not const; i is now 0
r2 = 0; // error: r2 is a reference to const
```

#### 2.4.2  Pointers and `const`

```c++
const double pi = 3.14; // pi is const; its value may not be changed
double *ptr = &pi; // error: ptr is a plain pointer
const double *cptr = &pi; // ok: cptr may point to a double that is const
*cptr = 42; // error: cannot assign to *cptr
```

In § 2.3.2 (p. 52) we noted that there are two exceptions to the rule that the types of a pointer and the object to which it points must match. The first exception is that **we can use a pointer to `const` to point to a non`const` object:**

```c++
double dval = 3.14; // dval is a double; its value can be changed 
cptr = &dval; // ok: but can't change dval through cptr
```

##### `const` Pointers

As with any other object type, we can have a pointer that is itself `const`. Like any other `const` object, a `const` pointer must be initialized, and once initialized, its value (i.e., the address that it holds) may not be changed. 

```c++
const int *ptr; // ok: ptr is a pointer to an const int object
int *const ptr; // error: uninitialized const 'ptr'
```

We indicate that the pointer is `const` by putting the `const` after the `*`. This placement indicates that it is the pointer, not the pointed-to type, that is const:

```c++
int errNumb = 0, i = 1;
int *const curErr = &errNumb; // curErr is a const pointer to an object of type int
*currErr = 2; // ok: now errNumb is 2
currErr = &i; // error: currErr is a const pointer and its value cannot be changed

const double pi = 3.14159;
const double *const pip = &pi; // pip is a const pointer to an object of type const double
*pip = 3.14; // error: pip points to a const object
```

#### 2.4.3 Top-Level `const`

We can talk independently about whether a pointer is `const` and whether the objects to which it can point are `const`. We use the term top-level const to indicate that the pointer itself is a `const`. When a pointer can point to a `const` object, we refer to that `cons`t as a low-level `cons`t.

More generally, top-level `const` indicates that an object itself is `const`. Top-level `const` can appear in any object type, i.e., one of the built-in arithmetic types, a class type, or a pointer type. Low-level `const` appears in the base type of compound types such as pointers or references. **Note that pointer types, unlike most other types, can have both top-level and low-level `const` independently:**

```c++
int i = 0;
int *const p1 = &i; // we cannot change the value of p1; const is top-level
const int ci = 42; // we cannot change ci; const is top-level
const int *p2 = &ci; // we can change p2; const is low-level
const int *const p3 = p2; // right-most const is top-level, left-most is not
const int &r = ci; // const in reference types is always low-level
```

The distinction between top-level and low-level matters when we copy an object. When we copy an object, top-level `const`s are ignored:


```c++
i = ci; // ok: copying the value o fci; top-level const in ci is ignored
p2 = p3; // ok: pointed-to type matches; top-level const in p3 is ignored
```

On the other hand, low-level `const` is never ignored. When we copy an object, both objects must have the same low-level `const` qualification or there must be a conversion between the types of the two objects. **In general, we can convert a non`const` to `const` but not the other way round:**

```c++
int *p = p3; // error: p3 has a low-level const but p doesn't
p2 = p3; // ok: p2 has the same low-level const qualification as p3
p2 = &i; // ok: we can convert int* to const int*
int &r = ci; // error: cannot bind an ordinary int& to a const int object 
const int &r2 = i; // ok: can bind const int& to plain int
```

#### 2.4.4 `constexpr` and Constant Expressions

**A constant expression is an expression whose value cannot change and that can be evaluated at compile time.** A literal is a constant expression. A const object that is initialized from a constant expression is also a constant expression.

```c++
const int max_files = 20; // 20 and max_files are constant expressions 
const int limit = max_files + 1; // max_files + 1 and limit are constant expressions 
int staff_size = 27; // staff_size is not a constant expression 
const int sz = get_size(); // sz is not a constant expression
```

`sz` is a const, but the value of its initializer is not known until run time. Hence, `sz` is not a constant expression.

##### `constexpr` Variables

Under the new standard, we can ask the compiler to verify that a variable is a constant expression by declaring the variable in a `constexpr` declaration. Variables declared as `constexpr` are implicitly `const` and must be initialized by constant expressions:

```c++
constexpr int mf = 20; // 20 is a constant expression
constexpr int limit = mf + 1; // mf + 1 is a constant expression 
constexpr int sz = size(); // ok only if size is a constexpr function
```

`constexpr` functions must be simple enough that the compiler can evaluate them at compile time. We can use `constexpr` functions in the initializer of a `constexpr` variable.

Best Practices: Generally, it is a good idea to use `constexpr` for variables that you intend to use as constant expressions.

##### Literal Types

**The types we can use in a `constexpr` declaration are known as "literal types" because they are simple enough to have literal values.**

Of the types we have used so far, the **arithmetic, reference, and pointer types are literal types**. Our `Sales_item` class and the **library IO and `string` types are not literal types**. Hence, we cannot define variables of these types as `constexpr`s. We'll see other kinds of literal types in § 7.5.6 (p. 299) and § 19.3 (p. 832).

Although we can define both pointers and reference as `constexpr`s, the objects we use to initialize them are strictly limited. We can initialize a `constexpr` pointer from the `nullptr` literal or the literal (i.e., constant expression) `0`. We can also point to (or bind to) an object that remains at a fixed address.

For reasons we'll cover in § 6.1.1 (p. 204), **variables defined inside a function ordinarily are not stored at a fixed address**. Hence, we cannot use a `constexpr` pointer to point to such variables. On the other hand, the address of an object defined outside of any function is stored at a fixed address and is a constant expression, and so may be used to initialize a `constexpr` pointer. We'll see in § 6.1.1 (p. 205), that functions may define variables that exist across calls to that function. Like an object defined outside any function, these special local objects also have fixed addresses. Therefore, a `constexpr` reference may be bound to, and a `constexpr` pointer may address, such variables.

##### Pointers and `constexpr`

```c++
const int *p = nullptr; // p is a pointer to a const int 
constexpr int *q = nullptr; // q is a const pointer to int
int j = 0;
constexpr int i = 42; // type of i is constint
// i and j must be defined outside any function
constexpr const int *p = &i; // p is a constant pointer to the const int i 
constexpr int *p1 = &j; // p1 is a constant pointer to the int j
```

### 2.5 Dealing with Types

#### 2.5.1 Type Aliases

A type alias is a name that is a synonym for another type. Type aliases let us simplify complicated type definitions, making those types easier to use. Type aliases also let us emphasize the purpose for which a type is used.

We can define a type alias in one of two ways. Traditionally, we use a `typedef`:

```c++
typedef double wages; // wages is a synonym for double
typedef wages base, *p; // base is a synonym for double, p for double*
```

Declarations that include typedef define type aliases rather than variables.

The new standard introduced a second way to define a type alias, via an alias declaration:

```c++
using SI = Sales_item; // SI is a synonym for Sales_item
```

A type alias is a type name and can appear wherever a type name can appear:

```c++
wages hourly, weekly; // same as double hourly, weekly; 
SI item; // same as Sales_item item
```

##### Pointers, `const`, and Type Aliases

Declarations that use type aliases that represent compound types and `const` can yield surprising results. For example, the following declarations use the type `pstring`, which is an alias for the the type `char*`:

```c++
typedef char *pstring; // pstring is a alias for the type char*
const pstring cstr = 0; // cstr is a constant pointer to char
const pstring *ps; // ps is a pointer to a constant pointer to char
```

The base type in these declarations is `const pstring`. As usual, a `const` that appears in the base type modifies the given type. The type of pstring is "pointer to `char`". So, `const pstring` is a constant pointer to `char`—not a pointer to `const char`.

It can be tempting, albeit incorrect, to interpret a declaration that uses a type alias by conceptually replacing the alias with its corresponding type:

```c++
const char *cstr = 0; // wrong interpretation of const pstring cstr
```

However, this interpretation is wrong. When we use pstring in a declaration, the base type of the declaration is a pointer type. When we rewrite the declaration using `char*`, the base type is `char` and the `*` is part of the declarator. In this case, `const char` is the base type. This rewrite declares `cstr` as a pointer to `const char` rather than as a` const` pointer to `char`.

#### 2.5.2 The auto Type Specifier

When we write a program, it can be surprisingly difficult—and sometimes even impossible—to determine the type of an expression. Under the new standard, we can use the `auto` type specifier to tell the compiler to deduce the type from the initializer. By implication, a variable that uses `auto` as its type specifier must have an initializer:

```c++
// the type of item is deduced from the type of the result of adding val1 and val2 
auto item = val1 + val2; // item initialized to the result of val1 + val2
```

As with any other type specifier, we can define multiple variables using `auto`. Because a declaration can involve only a single base type, the initializers for all the variables in the declaration must have types that are consistent with each other:

```c++
auto i = 0, *p = &i; // ok: i is int and p is a pointer to int
auto sz = 0, pi = 3.14; // error: inconsistent types for sz and pi
```

##### Compound Types, `const`, and `auto`

```c++
int i = 0, &r = i;
auto a = r; // a is an int (r is an alias for i, which has type int)
```

`auto` ordinarily ignores top-level `const`s (§ 2.4.3, p. 63). As usual in initializations, low-level `const`s, such as when an initializer is a pointer to const, are kept:

```c++
const int ci = i, &cr = ci;
auto b = ci; // b is an int (top-level const in ci is dropped)
auto c = cr; // c is an int (cr is an alias for ci whose const is top-level) 
auto d = &i; // d is an int* (&of anintobject isint*)
auto e = &ci; // e is a const int*, i.e. a pointer to const int (& of a const object is low-level const)
```

If we want the deduced type to have a top-level `const`, we must say so explicitly: 

```c++
const auto f = ci; // deduced type of ci is int; f has type const int
```

We can also specify that we want a reference to the auto-deduced type.

```c++
auto &g = ci; // g is a const int& (a reference to const int) that is bound to ci
auto &h = 42; // error: we can't bind a plain reference to a literal const 
auto &j = 42; // ok: we can bind a const reference to a literal
```

#### 2.5.3 The `decltype` Type Specifier

The new standard introduced a second type specifier, `decltype`, which returns the type of its operand. The compiler analyzes the expression to determine its type but does not evaluate the expression:

```c++
decltype(f()) sum = x; // sum has whatever type f returns
```

Here, the compiler does not call `f`, but it uses the type that would be returned if we were to call `f` as the type for `sum`.

When the expression to which we apply `decltype` is a variable, `decltype` returns the type of that variable, including top-level `const` and references:

```c++
const int ci = 0, &cj = ci;
decltype(ci) x = 0; // x has type const int
decltype(cj) y = x; // y has type const int& and is bound to x
decltype(cj) z; // error: z is a reference and like any other reference, z must be initialized
```

 ##### `decltype` and References

```c++
// decltype of an expression can be a reference type
int i = 42, *p = &i, &r = i;
decltype(r + 0) b; // ok: addition yields an int; b is an (uninitialized) int 
decltype(*p) c; // error: c is int& and must be initialized
```

Here `r` is a reference, so `decltype(r)` is a reference type. If we want the type to which `r` refers, we can use `r` in an expression, such as `r + 0`, which is an expression that yields a value that has a nonreference type.

The type deduced by `decltype(*p)` is `int&`, not plain `int`.

Another important difference between `decltype` and `auto` is that the deduction done by `decltype` depends on the form of its given expression.

```c++
// decltype of a parenthesized variable is always a reference 
decltype((i)) d; // error: d is int& and must be initialized 
decltype(i) e; // ok: e is an (uninitialized) int
```

WARNING: Remember that `decltype((variable))` (note, double parentheses) is always a reference type, but `decltype(variable)` is a reference type only if variable is a reference.

### 2.6 Defining Our Own Data Structures

At the most basic level, **a data structure is a way to group together related data elements and a strategy for using those data.** 

**In C++ we define our own data types by defining a class.** The library types `string`, `istream`, and `ostream` are all defined as classes, as is the `Sales_item` type we used in Chapter 1.

#### 2.6.1 Defining the `Sales_data` Type

We first define a data structure `Sales_data` that does not support any operations. We define the class as follows:

```c++
struct Sales_data {
    std::string bookNo;
    unsigned units_sold = 0;
    double revenue = 0.0;
};
```

Our class begins with the keyword `struct`, followed by the name of the class and a (possibly empty) class body. The class body is surrounded by curly braces and forms a new scope (§ 2.2.4, p. 48).

The close curly that ends the class body must be followed by a semicolon. 

```c++
struct Sales_data { /* ... */ } accum, trans, *salesptr; 
// equivalent, but better way to define these objects
struct Sales_data { /* ... */ };
Sales_data accum, trans, *salesptr;
```

##### Class Data Members

**The class body defines the members of the class.** Our class `Sales_data` has only data members. The data members of a class define the contents of the objects of that class type. 

The key difference between a `struct` and `class` in C++ is the default accessibility of member variables and methods. In a `struct` they are public; in a class they are `private`.

#### 2.6.2 Using the `Sales_data` Class

##### Adding Two `Sales_data` Objects

##### Reading Data into a `Sales_data` Object

##### Printing the Sum of Two `Sales_data` Objects

#### 2.6.3 Writing Our Own Header Files

As we'll see in § 19.7 (p. 852), we can define a class inside a function, such classes have limited functionality. As a result, classes ordinarily are not defined inside functions. 

In order to ensure that the class definition is the same in each file, **classes are usually defined in header files.** For example, the `string` library type is defined in the `string` header. Similarly, as we have already seen, we will define our `Sales_data` class in a header file named `Sales_data.h`.

Note:  Whenever a header is updated, the source files that use that header must be recompiled to get the new or changed declarations.

##### A Brief Introduction to the Preprocessor

The most common technique for making it safe to include a header multiple times relies on the preprocessor. The preprocessor—which C++ inherits from C—is a program that runs before the compiler and changes the source text of our programs. Our programs already rely on one preprocessor facility, `#include`. When the preprocessor sees a `#include`, it replaces the `#include` with the contents of the specified header.

C++ programs also use the preprocessor to define header guards. 

WARNING: Preprocessor variable names do not respect C++ scoping rules.

Best Practices: Headers should have guards.

### Chapter Summary

Types are fundamental to all programming in C++.

Each type defines the storage requirements and the operations that may be performed on objects of that type. The language provides a set of fundamental built-in types such as `int` and `char`, which are closely tied to their representation on the machine's hardware. Types can be non`const` or `const`; a `const` object must be initialized and, once initialized, its value may not be changed. In addition, we can define compound types, such as pointers or references. A compound type is one that is defined in terms of another type.

The language lets us define our own types by defining classes. The library uses the class facility to provide a set of higher-level abstractions such as the IO and string types.

### Defined Terms

Almost all terms are important. Read p. 78-80 for detail.

## Chapter 3. Strings, Vectors, and Arrays

The built-in types that we covered in Chapter 2 are defined directly by the C++ language. These types represent facilities present in most computer hardware, such as numbers or characters. 

The standard library defines a number of additional types (`string`, `vector`, etc.) of a higher-level nature that computer hardware usually does not implement directly. Associated with `string` and `vector` are companion types known as **iterators**, which are used to access the characters in a `string` or the elements in a `vector`.

The built-in array type represents facilities of the hardware. As a result, arrays are less convenient to use than the library `string` and `vector` types.

### 3.1 Namespace `using` Declarations

A `using` declaration has the form 

```c++
using namespace::name;
```

Once the `using` declaration has been made, we can access `name` directly.

##### A Separate `using` Declaration Is Required for Each Name

##### Headers Should Not Include `using` Declarations

Code inside headers (§ 2.6.3, p. 76) ordinarily should not use `using` declarations. The reason is that the contents of a header are copied into the including program's text. If a header has a using declaration, then every program that includes that header gets that same using declaration. As a result, a program that didn't intend to use the specified library name might encounter unexpected name conflicts.

##### A Note to the Reader

### 3.2 Library `string` Type

**A `string` is a variable-length sequence of characters.** To use the `string` type, we must include the `string` header. **`<string>` is a header file in C++ `std` library, and `string` is defined in the `std` namespace.**

```c++
#include <string>
using std::string;
```

#### 3.2.1 Defining and Initializing strings

Ways to initialize a `string`.

```c++
string s1 // default initialization, s1 is the empty string with no characters

string s2 = s1 // s2 is a copy of s1; copy initialization
string s2(s1) // direct initialization

string s3 = "value" // s3 is a copy of the string literal, not including the null; copy initialization
string s3("value") // direct initialization

string s4(5, 'c') // initialize s4 with 5 copies of the character 'c', s4 is "ccccc"; direct initialization
```

##### Direct and Copy Forms of Initialization

When we initialize a variable using `=`, we are asking the compiler to **copy initialize** the object by copying the initializer on the right-hand side into the object being created. Otherwise, when we omit the `=`, we use **direct initialization**.

#### 3.2.2 Operations on `string`s

##### Reading and Writing `string`s

##### Using `getline` to Read an Entire Line

##### The `string` `empty` and `size` Operations

<img src="https://raw.githubusercontent.com/gaoxiangnumber1/NotesPhotos/master/Cpp/Cp/3-2.png" alt="img" style="zoom:70%;" />

##### The `string::size_type` Type

The type of the value returned by `size` function is `string::size_type` but not `int` or `unsigned` (§ 2.1.1, p. 34). `string::size_type` is an unsigned type  (§ 2.1.1, p. 32) big enough to hold the size of any `string`.

```c++
string::size_type len = line.size();
auto len = line.size(); // equivalent to previous, len has type string::size_type
```

Because size returns an unsigned type, it is essential to remember that expressions that mix `signed` and `unsigned` data can have surprising results (§ 2.1.2, p. 36). For example, if `n` is an `int` that holds a negative value, then `s.size() < n` will almost surely evaluate as `true`, because the negative value in `n` will convert to a large unsigned value.

##### Comparing `string`s

##### Assignment for `string`s

##### Adding Two `string`s

##### Adding Literals and `string`s

#### 3.2.3 Dealing with the Characters in a `string`

##### Processing Every Character? Use Range-Based for

The range `for`  statement iterates through the elements in a given sequence and performs some operation on each value in that sequence. The syntactic form is 

```c++
for (declaration : expression)
	statement
```

where expression is an object of a type that represents a sequence. On each iteration, the variable in `declaration` is initialized from the value of the next element in expression.

```c++
string str("some string");
// print the characters in str one character to a line
for (auto c : str) // for every char in str
	cout << c << endl; // print the current character followed by a newline
```

In this case `c` is of type `char`. On each iteration, the next character in `str` will be copied into `c`.

We can declare references to the characters in `str` to avoid copying them: `for (auto &c : str)`. We can also declare constant references to the characters If we don't need to edit them: `for (auto &c : str)`.

<img src="https://raw.githubusercontent.com/gaoxiangnumber1/NotesPhotos/master/Cpp/Cp/3-2.png" alt="img" style="zoom:100%;" />

##### Using a Range `for` to Change the Characters in a `string`

If we want to change the value of the characters in a `string`, we must define the loop variable as a reference type.

Converting a `string` to all uppercase letters:

```c++
string s("Hello World!!!");
// convert s to uppercase
for (auto &c : s) // for every char in s (note: c is a reference)
	c = toupper(c); // c is a reference, so the assignment changes the char in s
cout << s << endl;
```

##### Processing Only Some Characters?

The subscript operator (the `[]` operator) takes a `string::size_type` (§ 3.2.2, p. 88) value that denotes the position of the character we want to access. The subscript operator `[]` returns a reference to the character at the given position.

The reference to the last character is `s[s.size()-1]`.

Note: The result of using an index outside this range is undefined. By implication, subscripting an empty `string` is undefined.

The value in the subscript is referred to as "a subscript" or "an index". If our index has a signed type, its value will be converted to the unsigned type that `string::size_type` represents (§ 2.1.2, p. 36).

##### Using a Subscript for Iteration

As a another example, we'll change the first word in `s` to all uppercase:

```c++
// process characters in s until we run out of characters or we hit a whitespace
for (decltype(s.size()) index = 0; index != s.size() && !isspace(s[index]); ++index)
	s[index] = toupper(s[index]); // capitalize the current character
```

CAUTION: SUBSCRIPTS ARE UNCHECKED

When we use a subscript, we must ensure that the subscript is in range. That is, the subscript must be `>= 0` and `<` the `size()` of the `string`.

WARNING: The library is not required to check the value of an subscript. The result of using an out-of-range subscript is undefined.

##### Using a Subscript for Random Access

### 3.3 Library `vector` Type

**A vector is a collection of objects, all of which have the same type.** Every object in the collection has an associated index, which gives access to that object. A vector is often referred to as a container because it "contains" other objects.

We must include the `<vector>` header to use a `vector`. In our examples, we also assume that an appropriate using declaration is made:

```c++
#include <vector>
using std::vector;
```

A vector is a **class template**. C++ has both class and function templates. 

Templates are not themselves functions or classes. Instead, they can be thought of as instructions to the compiler for generating classes or functions. **The process that the compiler uses to create classes or functions from templates is called instantiation.** When we use a template, we specify what kind of class or function we want the compiler to instantiate.

For a class template, we specify which class to instantiate by supplying additional information: We supply it inside a pair of angle brackets following the template's name.

In the case of `vector`, the additional information we supply is the type of the objects the `vector` will hold:

```c++
vector<int> ivec; // ivec holds objects of type int
vector<Sales_item> Sales_vec; // holds Sales_items
vector<vector<string>> file; // vector whose elements are vectors
```

Note: `vector` is a template, not a type. Types generated from `vector` must include the element type, for example, `vector<int>`.

Because references are not objects, we cannot have a `vector` of references.

#### 3.3.1 Defining and Initializing `vector`s

As with any class type, the `vector` template controls how we define and initialize `vector`s. 

```c++
vector<string> svec; // default initialization; svec has no elements
```

**The most common way of using `vector`s is to define an initially empty `vector` to which elements are added as their values become known at run time.**

We can also supply initial value(s) for the element(s) when we define a `vector`.

```c++
vector<int> ivec; // initially empty
// give ivec some values
vector<int> ivec2(ivec); // copy elements of ivec into ivec2
vector<int> ivec3 = ivec; // copy elements of ivec into ivec3
vector<string> svec(ivec2); // error: svec holds strings, not ints
```

##### List Initializing a `vector`

Under the new standard, we can list initialize (§ 2.2.1, p. 43) a vector from a list of zero or more initial element values enclosed in curly braces: 

```c++
vector<string> articles = {"a", "an", "the"};
```

Or

```c++
vector<string> articles{"a", "an", "the"};
```

##### Creating a Specified Number of Elements

```c++
vector<int> ivec(10, -1); // ten int elements, each initialized to -1
vector<string> svec(10, "hi!"); // ten strings; each element is "hi!"
```

##### Value Initialization

We can usually omit the value and supply only a size. 

```c++
vector<int> ivec(10); // ten elements, each initialized to 0
vector<string> svec(10); // ten elements, each an empty string
```

<div align='center'>
<figure>
<img src="https://www.oreilly.com/library/view/c-primer-fifth/9780133053043/graphics/03tab04.jpg" alt="Image" style="zoom:100%;" />
<figcaption style="font-size: 80%;"> Table 3.4. Ways to Initialize a vector. (<a href="https://www.oreilly.com/library/view/c-primer-fifth/9780133053043/ch03lev2sec7.html">Source</a>) </figcaption>
</figure>
</div>

##### List Initializer or Element Count?

```c++
vector<int> v1(10); // v1 has ten elements with value 0
vector<int> v2{10}; // v2 has one element with value 10
vector<int> v3(10, 1); // v3 has ten elements with value 1
vector<int> v4{10, 1}; // v4 has two elements with values 10 and 1
```

When we use parentheses, we are saying that the values we supply are to be used to *construct* the object. 

When we use curly braces, `{...}`, we're saying that, if possible, we want to list initialize the object. That is, if there is a way to use the values inside the curly braces as a list of element initializers, the class will do so. Only if it is not possible to list initialize the object will the other ways to initialize the object be considered.

On the other hand, if we use braces and there is no way to use the initializers to list initialize the object, then those values will be used to construct the object. 

```c++
vector<string> v5{"hi"}; // list initialization: v5 has one element
vector<string> v6("hi"); // error: can't construct a vector from a string literal
vector<string> v7{10}; // v7 has ten default initialized elements
vector<string> v8{10, "hi"}; // v8 has ten elements with value "hi"
```

#### 3.3.2 Adding Elements to a `vector`

```c++
vector<int> v2; // empty vector
for (int i = 0; i != 100; ++i)
	v2.push_back(i); // append sequential integers to v2
// at end of loop v2 has 100 elements, values 0 ... 99
```

Read the input, storing the values we read in the vector:

```c++
// read words from the standard input and store them as elements in a vector
string word;
vector<string> text; // empty vector
while (cin >> word) {
	text.push_back(word); // append word to text
}
```

##### Programming Implications of Adding Elements to a `vector`

The fact that we can easily and efficiently add elements to a vector greatly simplifies many programming tasks. 

We cannot use a range for if the body of the loop adds elements to the vector.

#### 3.3.3 Other vector Operations

```c++
vector<int> v{1,2,3,4,5,6,7,8,9};
for (auto &i : v) // for each element in v (note: i is a reference)
	i* = i; // square the element value
for (auto i : v) // for each element in v
	cout << i << " "; // print the element
cout << endl;
```

Note: To use `size_type`, we must name the type in which it is defined. A vector type always includes its element type (§ 3.3, p. 97):

```c++
vector<int>::size_type // ok
vector::size_type // error
```

We can compare two `vector`s only if we can compare the elements in those `vector`s.

<div align='center'>
<figure>
<img src="https://www.oreilly.com/library/view/c-primer-fifth/9780133053043/graphics/03tab05.jpg" alt="Image" style="zoom:100%;" />
<figcaption style="font-size: 80%;"> Table 3.5: vector Operations (<a href="https://www.oreilly.com/library/view/c-primer-fifth/9780133053043/ch03lev2sec9.html">Source</a>) </figcaption>
</figure>
</div>

##### Computing a `vector` Index

```c++
// count the number of grades by clusters of ten: 0--9, 10--19, ... 90--99, 100
vector<unsigned> scores(11, 0); // 11 buckets, all initially 0
unsigned grade;
while (cin >> grade) { // read the grades
	if (grade <= 100) // handle only valid grades
		++scores[grade/10]; // increment the counter for the current cluster
}
```

##### Subscripting Does Not Add Elements

### 3.4 Introducing Iterators

**Like pointers (§ 2.3.2, p. 52), iterators give us indirect access to an object.** 

As with pointers, an iterator may be valid or invalid. A valid iterator either denotes an element or denotes a position one past the last element in a container. All other iterator values are invalid.

#### 3.4.1 Using Iterators

Unlike pointers, we do not use the address-of operator to obtain an iterator. Instead, types that have iterators have members named `begin` and `end` that return iterators. 

```c++
// the compiler determines the type of b and e; see § 2.5.2 (p. 68)
// b denotes the first element and e denotes one past the last element in v
auto b = v.begin(), e = v.end(); // b and e have the same type
```

The `begin` member returns an iterator that denotes the first element (or first character), if there is one.

The iterator returned by `end` member is often referred to as the off-the-end iterator or abbreviated as "the end iterator". This iterator denotes a nonexistent element "off the end" of the container. It is used as a marker indicating when we have processed all the elements. 

If the container is empty, the iterators returned by `begin` and `end` are equal—they are both off-the-end iterators.

In general, we do not know (or care about) the precise type that an iterator has. In this example, we used auto to define `b` and `e` (§ 2.5.2, p. 68). 

##### Iterator Operations

As with pointers, we can dereference an iterator to obtain the element denoted by an iterator. Also, like pointers, we may dereference only a valid iterator that denotes an element (§ 2.3.2, p. 53). Dereferencing an invalid iterator or an off-the-end iterator has undefined behavior.

<img src="https://raw.githubusercontent.com/gaoxiangnumber1/NotesPhotos/master/Cpp/Cp/3-6.png" alt="img" style="zoom:100%;" />

As an example, we'll rewrite the program from § 3.2.3 (p. 94) that capitalized the first character of a `string` using an iterator instead of a subscript:

```c++
string s("some string");
if (s.begin() != s.end()) { // make sure s is not empty
    auto it = s.begin(); // it denotes the first character in s
    *it = toupper(*it); // make that character uppercase
}
```

##### Moving Iterators from One Element to Another

Iterators use the increment (`++`) operator (§ 1.4.1, p. 12) to move from one element to the next. 

Note: Because the iterator returned from `end` does not denote an element, it may not be incremented or dereferenced.

Change the case of the first word in a `string` by using iterator an `it` and the increment operator `++`:

```c++
// process characters in s until we run out of characters or we hit a whitespace
for (auto it = s.begin(); it != s.end() && !isspace(*it); ++it)
    *it = toupper(*it); // capitalize the current character
```

KEY CONCEPT: GENERIC PROGRAMMING

Only a few library types, `vector` and `string` being among them, have the subscript operator. Similarly, all of the library containers have iterators. Most of those iterators define the `==` and `!=` operators but do not have the `<` operator.

##### Iterator Types

The library types that have iterators define types named `iterator` and `const_iterator` that represent actual iterator types:

```c++
vector<int>::iterator it; // it can read and write vector<int> elements
string::iterator it2; // it2 can read and write characters in a string
vector<int>::const_iterator it3; // it3 can read but not write elements
string::const_iterator it4; // it4 can read but not write characters
```

If a `vector` or `string` is `const`, we may use only its `const_iterator` type.

##### The `begin` and `end` Operations

The type returned by `begin` and `end` depends on whether the object on which they operator is `const`. 

```c++
vector<int> v;
const vector<int> cv;
auto it1 = v.begin(); // it1 has type vector<int>::iterator
auto it2 = cv.begin(); // it2 has type vector<int>::const_iterator
```

For reasons we'll explain in § 6.2.3 (p. 213), it is usually best to use a `const` type (such as `const_iterator`) when we need to read but do not need to write to an object. To let us ask specifically for the `const_iterator` type, the new standard introduced two new functions named `cbegin` and `cend`: 

```c++
auto it3 = v.cbegin(); // it3 has type vector<int>::const_iterator
```

##### Combining Dereference and Member Access

Assuming `it` is an iterator into a `vector` of `string`s, we can check whether the `string` that `it` denotes is empty as follows:

```c++
(*it).empty()
```

To simplify expressions such as this one, the language defines the arrow operator (the `->` operator). The arrow operator combines dereference and member access into a single operation. That is, `it->mem` is a synonym for `(*it).mem`.

```c++
// print each line in text up to the first blank line
for (auto it = text.cbegin(); it != text.cend() && !it->empty(); ++it)
    cout << *it << endl;
```

##### Some `vector` Operations Invalidate Iterators

We cannot add elements to a `vector` inside a range `for` loop. We'll explore how iterators become invalid in more detail in § 9.3.6 (p. 353).

#### 3.4.2 Iterator Arithmetic

<img src="https://raw.githubusercontent.com/gaoxiangnumber1/NotesPhotos/master/Cpp/Cp/3-7.png" alt="img" style="zoom:60%;" />

##### Arithmetic Operations on Iterators

```c++
// compute an iterator to the element closest to the midpoint of vi
auto mid = vi.begin() + vi.size() / 2;
if (it < mid)
    // process elements in the first half of vi
```

We can also subtract two iterators to get the distance that refers to the amount by which we'd have to change one iterator to get the other. The result type is a signed integral type named `difference_type`.

##### Using Iterator Arithmetic

Do a binary search using iterators as follows:

```c++
// text must be sorted
// beg and end will denote the range we're searching
auto beg = text.begin(), end = text.end();
auto mid = text.begin() + (end - beg)/2; // original midpoint
// while there are still elements to look at and we haven't yet found sought
while (mid != end && *mid != sought) {
    if (sought < *mid) // is the element we want in the first half?
		end = mid; // if so, adjust the range to ignore the second half
	else // the element we want is in the second half
		beg = mid + 1; // start looking with the element just after mid
	mid = beg + (end - beg)/2; // new midpoint
}
```

### 3.5 Arrays

An array is a data structure that is similar to the library vector type (§ 3.3, p. 96) but offers a different trade-off between performance and flexibility. Like a vector, an array is a container of unnamed objects of a single type that we access by position. Unlike a vector, arrays have fixed size; we cannot add elements to an array. Because arrays have fixed size, they sometimes offer better run-time performance for specialized applications. 

#### 3.5.1 Defining and Initializing Built-in Arrays

Arrays are a compound type (§ 2.3, p. 50). An array declarator has the form `a[d]`, where `a` is the name being defined and `d` is the dimension of (the number of elements in) the array. The dimension is part of the array's type and must be known at compile time, which means that the dimension must be a constant expression (§ 2.4.4, p. 65):

```c++
unsigned cnt = 42; // not a constant expression
constexpr unsigned sz = 42; // constant expression (§ 2.4.4, p. 66)
int arr[10]; // array of ten ints
int *parr[sz]; // array of 42 pointers to int
string bad[cnt]; // error: cnt is not a constant expression
string strs[get_size()]; // ok if get_size is constexpr, error otherwise
```

By default, the elements in an array are default initialized (§ 2.2.1, p. 43).

WARNING: As with variables of built-in type, a default-initialized array of built-in type that is defined inside a function will have undefined values.

As with vector, arrays hold objects. Thus, there are no arrays of references.

##### Explicitly Initializing Array Elements

We can list initialize (§ 3.3.1, p. 98) the elements in an array. When we do so, we can omit the dimension and let the compiler infers it from the number of initializers.

```c++
const unsigned sz = 3;
int ia1[sz] = {0, 1, 2}; // array of three ints with values 0, 1, 2
int a2[] = {0, 1, 2}; // an array of dimension 3
int a3[5] = {0, 1, 2}; // equivalent to a3[] = {0, 1, 2, 0, 0}
string a4[3] = {"hi", "bye"}; // same as a4[] = {"hi", "bye", ""}
int a5[2] = {0, 1, 2}; // error: too many initializers
```

##### Character Arrays Are Special

Character arrays have an additional form of initialization: We can initialize such arrays from a string literal (§ 2.1.3, p. 39). When we use this form of initialization, it is important to remember that string literals end with a null character. That null character is copied into the array along with the characters in the literal:

```c++
char a1[] = {'C', '+', '+'}; // list initialization, no null
char a2[] = {'C', '+', '+', '\0'}; // list initialization, explicit null
char a3[] = "C++"; // null terminator added automatically
const char a4[6] = "Daniel"; // error: no space for the null!
```

The dimension of `a1` is 3; the dimensions of `a2` and `a3` are both 4.

##### No Copy or Assignment

```c++
int a[] = {0, 1, 2}; // array of three ints
int a2[] = a; // error: cannot initialize one array as a copy of another
a2 = a; // error: cannot assign one array to another
```

WARNING: Some compilers allow array assignment as a compiler extension. It is usually a good idea to avoid using nonstandard features. Programs that use such features, will not work with a different compiler.

##### Understanding Complicated Array Declarations

Defining a pointer or reference to an array is a bit complicated:

```c++
int *ptrs[10]; // ptrs is an array of ten pointers to int
int &refs[10] = /* ? */; // error: no arrays of references
int (*Parray)[10] = &arr; // Parray points to an array of ten ints
int (&arrRef)[10] = arr; // arrRef refers to an array of ten ints
```

**By default, type modifiers bind right to left.** Reading the definition of `ptrs` from right to left (§ 2.3.3, p. 58) is easy: We see that we're defining an array of size 10, named `ptrs`, that holds pointers to `int`.

As for the definition of `Parray`, reading from the inside out makes it easier to understand the type of `Parray`:  `(*Parray)` says that `Parray` is a pointer; `[10]` says `Parray` points to an array of size 10; `int` says the elements in that array are `int`s. Thus, `Parray` is a pointer to an array of 10 `int`s. Similarly, `arrRef` is a reference to an array of 10 `int`s.

Of course, there are no limits on how many type modifiers can be used:

```c++
int *(&arry)[10] = ptrs; // arry is a reference to an array of 10 pointers to int
```

Reading this declaration from the inside out: `(&arry)` says `arry` is a reference; `[10]` says `arry` points to an array of size 10; `int *` says the elements in the array are pointers to `int`.

Tip: It can be easier to understand array declarations by starting with the array's name and reading them from the inside out.

#### 3.5.2 Accessing the Elements of an Array

As with the library `vector` and `string` types, we can use a range `for` or the subscript operator to access elements of an array. 

When we use a variable to subscript an array, we normally should define that variable to have type `size_t`. `size_t` is a machine-specific unsigned type that is guaranteed to be large enough to hold the size of any object in memory. 

Reimplement our grading program from § 3.3.3 (p. 104) to use an array:

```c++
// count the number of grades by clusters of ten: 0--9, 10--19, ... 90--99, 100
unsigned scores[11] = {}; // 11 buckets, all value initialized to 0
unsigned grade;
while (cin >> grade) {
    if (grade <= 100)
        ++scores[grade/10]; // increment the counter for the current cluster
}
```

As in the case of `string` or `vector`, it is best to use a range `for` when we want to traverse the entire array.

```c++
for (auto i : scores) // for each counter in scores
    cout << i << " "; // print the value of that counter
cout << endl;
```

As with `string` and `vector`, it is up to the programmer to ensure that the subscript value is in range. Nothing stops a program from stepping across an array boundary except careful attention to detail and thorough testing of the code. It is possible for programs to compile and execute yet still be fatally wrong.

**WARNING: The most common source of security problems are buffer overflow bugs.** Such bugs occur when a program fails to check a subscript and mistakenly uses memory outside the range of an array or similar data structure.

#### 3.5.3 Pointers and Arrays

In C++ pointers and arrays are closely intertwined. In particular, when we use an array, the compiler ordinarily converts the array to a pointer.

The elements in an array are objects. As with any other object, we can obtain a pointer to an array element by taking the address of that element:

```c++
string nums[] = {"one", "two", "three"}; // array of strings
string *p = &nums[0]; // p points to the first element in nums
```

However, arrays have a special property—in most places when we use an array, the compiler automatically substitutes a pointer to the first element:

```c++
string *p2 = nums; // equivalent to `string *p2 = &nums[0]`
```

Note: In most expressions, when we use an object of array type, we are really using a pointer to the first element in that array.

Operations on arrays are often really operations on pointers. 

##### Pointers Are Iterators

Pointers that address elements in an array have additional operations beyond those we described in § 2.3.2 (p. 52). In particular, pointers to array elements support the same operations as iterators on vectors or strings (§ 3.4, p. 106). For example, we can use the increment operator to move from one element in an array to the next:

```c++
int arr[] = {0,1,2,3,4,5,6,7,8,9};
int *p = arr; // p points to the first element in arr
++p; // p points to arr[1]
```

Just as we can use iterators to traverse the elements in a `vector`, we can use pointers to traverse the elements in an array.

We can obtain an off-the-end pointer by taking the address of the nonexistent element one past the last element of an array:

```c++
int *e = &arr[10]; // pointer just past the last element in arr
```

Like an off-the-end iterator (§ 3.4.1, p. 106), an off-the-end pointer does not point to an element. As a result, we may not dereference or increment an off-the-end pointer, and the only thing we can do with it is to take its address.

Using these pointers we can write a loop to print the elements in `arr` as follows:

```c++
for (int *b = arr; b != e; ++b)
    cout << *b << endl; // print the elements in arr
```

##### The Library `begin` and `end` Functions

Although we can compute an off-the-end pointer, doing so is error-prone. To make it easier and safer to use pointers, the new library includes two functions, named `begin` and `end`. These functions are defined in the iterator header. They take an argument that is an array:

```c++
int *beg = begin(arr); // pointer to the first element in arr
int *last = end(arr); // pointer one past the last element in arr
```

Note: A pointer "one past" the end of a built-in array behaves the same way as the iterator returned by the end operation of a `vector`.

##### Pointer Arithmetic

Pointers that address array elements can use all the iterator operations listed in Table 3.6 (p. 107) and Table 3.7 (p. 111).

When we add (or subtract) an integral value to (or from) a pointer, the result is a new pointer. That new pointer points to the element the given number ahead of (or behind) the original pointer:

```c++
constexpr size_t sz = 5;
int arr[sz] = {1,2,3,4,5};
int *ip = arr; // equivalent to int *ip = &arr[0]
int *ip2 = ip + 4; // ip2 points to arr[4], the last element in arr
// ok: arr is converted to a pointer to its first element; p points one past the end of arr
int *p = arr + sz; // use caution -- do not dereference!
int *p2 = arr + 10; // error: arr has only 5 elements; p2 has undefined value
```

Computing a pointer more than one past the last element is an error, although the compiler is unlikely to detect such errors.

As with iterators, subtracting two pointers gives us the distance between those pointers. The pointers must point to elements in the same array:

```c++
auto n = end(arr) - begin(arr); // n is 5, the number of elements in arr
```

The result of subtracting two pointers is a library type named `ptrdiff_t`. Like `size_t`, the `ptrdiff_t` type is a machine-specific type and is defined in the `cstddef` header. 

Traverse the elements in `arr` as follows:

```c++
int *b = arr, *e = arr + sz;
while (b < e) {
    // use *b
    ++b;
}
```

It is worth noting that pointer arithmetic is also valid for null pointers (§ 2.3.2, p. 53) and for pointers that point to an object that is not an array. 

##### Interaction between Dereference and Pointer Arithmetic

The result of adding an integral value to a pointer is itself a pointer.

```c++
int ia[] = {0,2,4,6,8}; // array with 5 elements of type int
int last = *(ia + 4); // ok: initializes last to 8, the value of ia[4]
int last = *ia + 4; // ok: equivalent to ia[0] + 4
```

##### Subscripts and Pointers

In most places when we use the name of an array, we are really using a pointer to the first element in that array.

When we subscript an array, we are really subscripting a pointer to an element in that array:

```c++
int i = ia[2]; // ia is converted to a pointer to the first element in ia; ia[2] fetches the element to which (ia + 2) points
```

is equivalent to

```c++
int *p = ia; // p points to the first element in ia
int i = *(p + 2); // equivalent to int i = ia[2]
```

We can use the subscript operator on any pointer, as long as that pointer points to an element (or one past the last element) in an array:

```c++
int *p = &ia[2]; // p points to the element indexed by 2
int j = p[1]; // p[1] is equivalent to *(p + 1),
// p[1] is the same element as ia[3]
int k = p[-2]; // p[-2] is the same element as ia[0]
```

This last example points out an important difference between arrays and library types such as `vector` and `string` that have subscript operators. The library types force the index used with a subscript to be an unsigned value. The built-in subscript operator does not. The index used with the built-in subscript operator can be a negative value. Of course, the resulting address must point to an element in (or one past the end of) the array to which the original pointer points.

#### 3.5.4 C-Style Character Strings

WARNING: Although C++ supports C-style strings, they should not be used by C++ programs. C-style strings are a surprisingly rich source of bugs and are the root cause of many security problems. They're also harder to use!

##### C Library String Functions

##### Comparing Strings

##### Caller Is Responsible for Size of a Destination String

Tip: For most applications, in addition to being safer, it is also more efficient to use library strings rather than C-style strings.

#### 3.5.5 Interfacing to Older Code

Many C++ programs predate the standard library and do not use the `string` and `vector` types. Moreover, many C++ programs interface to programs written in C or other languages that cannot use the C++ library. Hence, programs written in modern C++ may have to interface to code that uses arrays and/or C-style character strings. The C++ library offers facilities to make the interface easier to manage.

##### Mixing Library `string`s and C-Style Strings

##### Using an Array to Initialize a `vector`

ADVICE: USE LIBRARY TYPES INSTEAD OF ARRAYS

Pointers and arrays are surprisingly error-prone. **Modern C++ programs should use `vector`s and iterators instead of built-in arrays and pointers, and use `string`s rather than C-style array-based character strings.**

### 3.6 Multidimensional Arrays

Strictly speaking, there are no multidimensional arrays in C++. What are commonly referred to as multidimensional arrays are actually arrays of arrays.

```c++
int ia[3][4]; // ia is an array of size 3; each element is an array of int s of size 4
// arr is an array of size 10; each element is a 20-element array whose elements are arrays of 30 int s
int arr[10][20][30] = {0}; // initialize all elements to 0
```

In a two-dimensional array, the first dimension is usually referred to as the row and the second as the column.

##### Initializing the Elements of a Multidimensional Array

```c++
int ia[3][4] = { // three elements; each element is an array of size 4
    {0, 1, 2, 3}, // initializers for the row indexed by 0
    {4, 5, 6, 7}, // row 1
    {8, 9, 10, 11} // row 2
};
```

is equivalent to

```c++
int ia[3][4] = {0,1,2,3,4,5,6,7,8,9,10,11};
```

As is the case for single-dimension arrays, elements may be left out of the initializer list.

```c++
// initialize only the first element of each row; the remaining elements are initialized to 0
int ia[3][4] = { {0}, {4}, {8} };
// explicitly initialize row 0; the remaining elements are initialized to 0
int ix[3][4] = {0, 3, 6, 9};
```

##### Subscripting a Multidimensional Array

```c++
// assigns the first element of arr to the last element in the last row of ia
ia[2][3] = arr[0][0][0];
// defines row as a reference to an array of four ints; binds this reference to the second four-element array in ia
int (&row)[4] = ia[1];
```

Use nested `for` loops to process the elements in a multidimensional array:

```c++
constexpr size_t rowCnt = 3, colCnt = 4;
int ia[rowCnt][colCnt]; // 12 uninitialized elements
// for each row
for (size_t i = 0; i != rowCnt; ++i) {
    // for each column within the row
    for (size_t j = 0; j != colCnt; ++j) {
        // assign the element's positional index as its value
        ia[i][j] = i * colCnt + j;
    }
}
```

##### Using a Range for with Multidimensional Arrays

Under the new standard we can simplify the previous loop by using a range `for`:

```c++
size_t cnt = 0;
for (auto &row : ia) // for every element in the outer array
    for (auto &col : row) { // for every element in the inner array
        col = cnt; // give this element the next value
        ++cnt; // increment cnt
}
```

The first `for` iterates through the elements in `ia`. Those elements are arrays of size 4. Thus, the type of `row` is a reference to an array of four `int`s. The second `for` iterates through one of those 4-element arrays. Hence, `col` is `int&`. 

It is worth noting that we define `row` and `col` as references rather than `for (auto row : ia)` and `for (auto col : row)` to avoid copying them. This way is more efficient than copying when `row` and `col` is large.

The following loop does not write to the elements, yet we still define the control variable of the outer loop as a reference.

```c++
for (const auto &row : ia)
    for (auto col : row)
        cout << col << endl;
```

Note: To use a multidimensional array in a range for, the loop control variable for all but the innermost array must be references.

##### Pointers and Multidimensional Arrays

As with any array, when we use the name of a multidimensional array, it is automatically converted to a pointer to the first element in the array. For here the first element is the first inner array in the multidimensional array.

```c++
int ia[3][4]; // array of size 3; each element is an array of int s of size 4
int (*p)[4] = ia; // pointer to an array of four ints
p = &ia[2]; // p now points to the last element in ia
```

Applying the strategy from § 3.5.1 (p. 115), we start by noting that (`*p`) says `p` is a pointer. Looking right, we see that the object to which `p` points has a dimension of size 4, and looking left that the element type is `int`. Hence, `p` is a pointer to an array of four `int`s.

Note: The parentheses in this declaration are essential:

```c++
int *ip[4]; // array of pointers to int
```

With the advent of the new standard, we can often avoid having to write the
type of a pointer into an array by using `auto` or `decltype` (§ 2.5.2, p. 68):

```c++
// print the value of each element in ia, with each inner array on its own line
// initialize p to point to the first array in ia
// the increment, ++p, moves p to point to the next row (i.e., the next element, the next array) in ia
for (auto p = ia; p != ia + 3; ++p) {
    // initialize q point to the first element of the array to which p points; this array is of four ints; thus q points to an int
    for (auto q = *p; q != *p + 4; ++q)
        cout << *q << ''; // prints the int value to which q points
    cout << endl;
}
```

We can even more easily write this loop using the library `begin` and `end` functions (§ 3.5.3, p. 118):

```c++
for (auto p = begin(ia); p != end(ia); ++p) {
    for (auto q = begin(*p); q != end(*p); ++q)
        cout << *q << '';
    cout << endl;
}
```

##### Type Aliases Simplify Pointers to Multidimensional Arrays

 Define `int_array` as a name for the type "array of four `int`s":

```c++
using int_array = int[4]; // new style type alias declaration; see § 2.5.1 (p. 68)
```

Or equivalently:

```c++
typedef int int_array[4]; // § 2.5.1 (p. 67)
```

Then we can rewrite the first line as:

```c++
for (int_array *p = ia; p != ia + 3; ++p) {
    // ...
```

### Chapter Summary

Among the most important library types are `vector` and `string`. A `string` is a variable-length sequence of characters, and a `vector` is a container of objects of a single type.

Iterators allow indirect access to objects stored in a container. Iterators are used to access and navigate between the elements in `string`s and `vector`s.

Arrays and pointers to array elements provide low-level analogs to the `vector` and `string` libraries. In general, the library classes should be used in preference to low-level array and pointer alternatives built into the language.

### Defined Terms

**buffer overflow** Serious programming bug that results when we use an index that is out-of-range for a container, such as a `string`, `vector`, or an array.

**class template** A blueprint from which specific class types can be created. To use a class template, we must specify additional information. For example, to define a `vector`, we specify the element type: `vector<int>` holds `int`s.

**container** A type whose objects hold a collection of objects of a given type. vector is a container type.

**iterator** A type used to access and navigate among the elements of a container.

**range for** Control statement that iterates through a specified collection of values.

**string** Library type that represents a sequence of characters.

**vector** Library type that holds a collection of elements of a specified type.

<br>

## References

[^1]: Lippman, Stanley B., Josée Lajoie, and Barbara E. Moo. *C++ Primer*. Addison-Wesley Professional, 2012. 

[^2]: Prata, Stephen. *C++ primer plus*. Addison-Wesley Professional, 2011.
