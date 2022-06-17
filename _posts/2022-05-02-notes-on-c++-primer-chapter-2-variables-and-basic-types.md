---
layout: post
title: "Notes on \"C++ Primer\": Chapter 2. Variables and Basic Types"
date: 2022-05-02
categories: CS
tags: [C++]
toc: true
comments: true
published: true
hidden: true
---

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
<img src="https://www.oreilly.com/library/view/c-primer-fifth/9780133053043/graphics/02tab01.jpg" alt="Table 2.1: C++: Arithmetic Types" style="zoom:100%;" />
<figcaption style="font-size: 80%;"> Table 2.1: C++: Arithmetic Types (<a href="https://www.oreilly.com/library/view/c-primer-fifth/9780133053043/ch02lev2sec1.html">Source</a>) </figcaption>
</figure>
</div>

Also refer to the [Microsoft C++ data type ranges](https://docs.microsoft.com/en-us/cpp/cpp/data-type-ranges).

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
<img src="https://raw.githubusercontent.com/gaoxiangnumber1/NotesPhotos/master/Cpp/Cp/2-2.png" alt="img" style="zoom: 58%;" />
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
<img src="http://1.bp.blogspot.com/-XgAWe68aefE/U_rzHhFhCaI/AAAAAAAAACY/8i_rFdj-yJs/s1600/inital.png" alt="img" style="zoom:55%;" />
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

<br>

## References

[1] Lippman, Stanley B., Josée Lajoie, and Barbara E. Moo. *C++ Primer*. Addison-Wesley Professional, 2012. 

[2] Prata, Stephen. *C++ primer plus*. Addison-Wesley Professional, 2011.
