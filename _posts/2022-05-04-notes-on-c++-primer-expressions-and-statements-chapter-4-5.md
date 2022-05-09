---
layout: post
title: "Notes on \"C++ Primer\": Expressions and Statements (Chapter 4~5)"
date: 2022-05-04
categories: CS
tags: [C++]
comments: true
published: true
hidden: false
---

## Chapter 4. Expressions

An expression is composed of one or more operands and yields a result when it is evaluated. The simplest form of an expression is a single literal or variable. The result of such an expression is the value of the variable or literal. More complicated expressions are formed from an operator and one or more operands.

### 4.1 Fundamentals

#### 4.1.1 Basic Concepts

There are both unary operators and binary operators. Unary operators, such as address-of (`&`) and dereference (`*`), act on one operand. Binary operators, such as equality (`==`) and multiplication (`*`), act on two operands. There is also one ternary operator that takes three operands, and one operator, function call, that takes an unlimited number of operands.

##### Grouping Operators and Operands

Understanding expressions with multiple operators requires understanding the precedence and associativity of the operators and may depend on the order of evaluation of the operands.

##### Operand Conversions

As part of evaluating an expression, operands are often converted from one type to another. For example, the binary operators usually expect operands with the same type. These operators can be used on operands with differing types so long as the operands can be converted (§ 2.1.2, p. 35) to a common type.

Small integral type operands (e.g., `bool`, `char`, `short`, etc.) are generally promoted to a larger integral type, typically `int`.

##### Overloaded Operators

The language defines what the operators mean when applied to built-in and compound types. We can also define what most operators mean when applied to class types. Because such definitions give an alternative meaning to an existing operator symbol, we refer to them as overloaded operators. The IO library `>>` and `<<` operators and the operators we used with `string`s, `vector`s, and `iterator`s are all overloaded operators.

##### Lvalues and Rvalues

Every expression in C++ is either an `rvalue` or an `lvalue`. These names are inherited from C and originally had a simple mnemonic purpose: lvalues could stand on the left-hand side of an assignment whereas rvalues could not.

In C++, the distinction is less simple.  Roughly speaking, when we use an object as an rvalue, we use the object's value (its contents). When we use an object as an lvalue, we use the object's identity (its location in memory).

We can use an lvalue when an rvalue is required, but we cannot use an rvalue when an lvalue (i.e., a location) is required. When we use an lvalue in place of an rvalue, the object's contents (its value) are used. (There is one exception that we'll cover in § 13.6 (p. 531))

#### 4.1.2 Precedence and Associativity

An expression with two or more operators is a compound expression. Precedence and associativity determine how the operands are grouped to the operators.

##### Parentheses Override Precedence and Associativity

##### When Precedence and Associativity Matter

```c++
int ia[] = {0,2,4,6,8}; // array with five elements of type int
int last = *(ia + 4); // initializes last to 8, the value of ia[4]
last = *ia + 4; // last = 4, equivalent to ia[0] + 4
```

#### 4.1.3 Order of Evaluation

Precedence specifies how the operands are grouped. It says nothing about the order in which the operands are evaluated. In most cases, the order is largely unspecified. In the following expression

```c++
int i = f1() * f2();
```

we have no way of knowing whether `f1` will be called before `f2` or vice versa.

For operators that do not specify evaluation order, it is an error for an expression to refer to and change the same object. Expressions that do so have undefined behavior (§ 2.1.2, p. 36). As a simple example, the `<<` operator makes no guarantees about when or how its operands are evaluated. As a result, the following output expression is undefined:

```c++
int i = 0;
cout << i << " " << ++i << endl; // undefined
```

The compiler might evaluate `++i` before evaluating `i`, in which case the output will be `1 1`. Or the compiler might evaluate `i` first, in which case the output will be `0 1`. Or the compiler might do something else entirely. Because this expression has undefined behavior, the program is in error, regardless of what code the compiler generates.

There are four operators that do guarantee the order in which operands are evaluated: the logical AND (`&&`) operator (§ 3.2.3, p. 94), the logical OR (`||`) operator (§ 4.3, p. 141), the conditional (`? :`) operator (§ 4.7, p. 151), and the comma (`,`) operator (§ 4.10, p. 157). For example, the logical AND (`&&`) operator guarantees that its left-hand operand is evaluated first.

##### Order of Evaluation, Precedence, and Associativity

Order of operand evaluation is independent of precedence and associativity. In an expression such as `f() + g() * h() + j()`, there are no guarantees as to the order in which these functions are called. If any of the functions `f`, `g`, `h` and `j` do affect the same object, then the expression is in error and has undefined behavior.

Order of evaluation for most of the binary operators is left undefined to give the compiler opportunities for optimization.

### 4.2 Arithmetic Operators

<div align='center'>
<figure>
<img src="https://www.oreilly.com/library/view/c-primer-fifth/9780133053043/graphics/04tab01.jpg" alt="Image" style="zoom:100%;" />
<figcaption style="font-size: 80%;"> Table 4.1: Arithmetic Operators (Left Associative) (<a href="https://www.oreilly.com/library/view/c-primer-fifth/9780133053043/ch04lev1sec2.html">Source</a>) </figcaption>
</figure>
</div>

Unless noted otherwise, the arithmetic operators may be applied to any of the arithmetic types (§2.1.1,p. 32)or to any type that can be converted to an arithmetic type. The operands and results of these operators are rvalues. As described in § 4.11 (p. 159), operands of small integral types are promoted to a larger integral type, and all operands may be converted to a common type as part of evaluating these operators.

The unary plus operator and the addition and subtraction operators may also be applied to pointers. 

For most operators, operands of type `bool` are promoted to `int`. In this case, the value of `b` is `true`, which promotes to the `int` value `1` (§ 2.1.2, p. 35). That (promoted) value is negated, yielding `-1`. The value `-1` is converted  back to `bool` and used to initialize `b2`. This initializer is a nonzero value, which when converted to `bool` is `true`. Thus, the value of `b2` is `true`!

CAUTION: OVERFLOW AND OTHER ARITHMETIC EXCEPTIONS

Overflow happens when a value is computed that is outside the range of values that the type can represent. On many systems, there is no compile-time or run-time warning when an overflow occurs. Overflow yields undefined results.

Division (`/`) between integers returns an integer. If the quotient contains a fractional part, it is truncated toward zero, no matter positive or negative.

The operands to the remainder (or called the modulus) operator `%` must have integral type.

Except for the obscure case where `-m` overflows, `(-m) / n` and `m / (-n)` are always equal to `-(m / n)`, `m % (-n)` is equal to `m % n`, and `(-m) % n` is equal to `-(m % n)`.

### 4.3 Logical and Relational Operators

The relational operators take operands of arithmetic or pointer type; the logical operators take operands of any type that can be converted to `bool`. These operators all return values of type `bool`. Arithmetic and pointer operand(s) with a value of zero are `false`; all other values are `true`. The operands to these operators are rvalues and the result is an rvalue.

<div align='center'>
<figure>
<img src="https://www.oreilly.com/library/view/c-primer-fifth/9780133053043/graphics/04tab02.jpg" alt="Image" style="zoom:100%;" />
<figcaption style="font-size: 80%;"> Table 4.2. Logical and Relational Operators (<a href="https://www.oreilly.com/library/view/c-primer-fifth/9780133053043/ch04lev1sec3.html">Source</a>) </figcaption>
</figure>
</div>

##### Logical AND and OR Operators

The logical AND and OR operators always evaluate their left operand before the right. Moreover, the right operand is evaluated if and only if the left operand does not determine the result. This strategy is known as **short-circuit evaluation**.

##### Logical NOT Operator

Because the relational operators return bools, the result of chaining these operators together is likely to be surprising:

```c++
// oops! this condition compares k to the bool result of i < j
if (i < j < k) // true if k is greater than 1!
```

To accomplish the test we intended, we can rewrite the expression as follows:

```c++
// ok: condition is true if i is smaller than j and j is smaller than k
if (i < j && j < k)
```

##### Equality Tests and the `bool` Literals

Test the truth value of an arithmetic or pointer object:

```c++
if (val) // true if val is any nonzero value
if (!val) // true if val is zero
```

In both conditions, the compiler converts `val` to `bool` type. 

We don't write it as

```c++
if (val == true) // true only if val is equal to 1 
```

because if `val` is not a `bool`, then `true` is converted to the type of `val` before the `==` operator is applied, and it is as if we had written

```c++
if (val == 1)
```

As we've seen, when a bool is converted to another arithmetic type, false converts to 0 and true converts to 1 (§ 2.1.2, p. 35).

WARNING: It is usually a bad idea to use the boolean literals `true` and `false` as operands in a comparison. These literals should be used only to compare to an object of type `bool`.

### 4.4 Assignment Operators

The left-hand operand of an assignment operator must be a modifiable lvalue.

```c++
int k = 0; // initialization, not assignment
1024 = k; // error: literals are rvalues
i + j = k; // error: arithmetic expressions are rvalues
ci = k; // error: ci is a const (nonmodifiable) lvalue
k = 3.14; // assignment, type int, value 3
```

Under the new standard, we can use a braced initializer list (§ 2.2.1, p. 43) on the right-hand side:

```c++
k = {3.14}; // error: narrowing conversion
```

##### Assignment Is Right Associative

Unlike the other binary operators, assignment is right associative:

```c++
int ival, jval;
ival = jval = 0; // ok: each assigned 0
```

Because assignment is right associative, the right-most assignment, `jval = 0`, is the right-hand operand of the left-most assignment operator. Because assignment returns its left-hand operand, the result of the right-most assignment (i.e., `jval`) is assigned to `ival`.

Each object in a multiple assignment must have the same type as its right-hand neighbor or a type to which that neighbor can be converted (§ 4.11, p. 159):

```c++
int ival, *pval; // ival is an int ; pval is a pointer to int
ival = pval = 0; // error: cannot assign the value of a pointer to an int
```

Because `ival` and `pval` have different types and there is no conversion from the type of `pval` (`int*`) to the type of `ival` (`int`). It is illegal even though zero is a value that can be assigned to either object.

```c++
int ival;
float fval1, fval2;
fval1 = ival = fval2 = 1.5; // fval1 is 1.0, ival is 1, fval2 is 1.5
```

##### Assignment Has Low Precedence

We want to call a function until it returns a desired value—say, 42:

```c++
// a verbose and therefore more error-prone way to write this loop
int i = get_value(); // get the first value
while (i != 42) {
    // do something with i ...
    i = get_value(); // get remaining values
}
```

Rewrite this loop more directly by using assignment in a condition as:

```c++
int i;
while ((i = get_value()) != 42) {
    // do something with i ...
}
```

Note: Because assignment has lower precedence than the relational operators, parentheses are usually needed around assignments in conditions. 

##### Beware of Confusing Equality and Assignment Operators

The condition in `if (i = j)` assigns the value of `j` to `i` and then tests the result of the assignment. If `j` is nonzero, the condition will be `true`.

##### Compound Assignment Operators

Compound assignment operators:

```c++
+= -= *= /= %= // arithmetic operators
<<= >>= &= ^= |= // bitwise operators; see § 4.8 (p. 152)
```

`x op b` is essentially equivalent to `a = a op b`.

### 4.5 Increment and Decrement Operators

The increment (`++`) and decrement (`--`) operators rise above mere convenience when we use these operators with iterators, because many iterators do not support arithmetic.

There are two forms of these operators: prefix and postfix. The prefix form increments (or decrements) its operand and yields the changed object as its result. The postfix operators increment (or decrement) the operand but yield a copy of the original, unchanged value as its result.

```c++
int i = 0, j;
j = ++i; // j = 1, i = 1: prefix yields the incremented value
j = i++; // j = 1, i = 2: postfix yields the unincremented value
```

ADVICE: USE POSTFIX OPERATORS ONLY WHEN NECESSARY

The postfix operator must store the original value so that it can return the unincremented value as its result. If we don't need the unincremented value, there's no need for the extra work done by the postfix operator.

##### Combining Dereference and Increment in a Single Expression

These three expressions are equivalent:

```c++
x = *iter++;
```

```c++
x = *(iter++);
```

```c++
x = *iter;
++iter;
```

The first expression is succinct and widely used.

##### Remember That Operands Can Be Evaluated in Any Order

Most operators give no guarantee as to the order in which operands will be evaluated (§ 4.1.3, p. 137). This lack of guaranteed order often doesn't matter. The cases where it does matter are when one subexpression changes the value of an operand that is used in another subexpression. Because the increment and decrement operators change their operands, it is easy to misuse these operators in compound expressions.

To illustrate the problem, we'll rewrite the loop from § 3.4.1 (p. 108) that capitalizes the first word in the input. That example used a `for` loop:

```c++
for (auto it = s.begin(); it != s.end() && !isspace(*it); ++it)
    *it = toupper(*it); // capitalize the current character
```

which allowed us to separate the statement that dereferenced `it` from the one that incremented it. Replacing the `for` with a seemingly equivalent `while`:

```c++
// the behavior of the following loop is undefined!
while (beg != s.end() && !isspace(*beg))
    *beg = toupper(*beg++); // error: this assignment is undefined
```

results in undefined behavior. The problem is that both the left- and right-hand operands to `=` use `beg` and the right-hand operand changes `beg`. The assignment is therefore undefined. The compiler might evaluate this expression as either

```c++
*beg = toupper(*beg); // execution if left-hand side is evaluated first
*(beg + 1) = toupper(*beg); // execution if right-hand side is evaluated first
```

or it might evaluate it in yet some other way.

### 4.6 The Member Access Operators

The dot (§ 1.5.2, p. 23) and arrow (§ 3.4.1, p. 110) operators provide for member access. The dot operator fetches a member from an object of class type; arrow is defined so that `ptr->mem` is a synonym for `(*ptr).mem`:

```c++
string s1 = "a string", *p = &s1;
auto n = s1.size(); // run the size member of the string s1
n = (*p).size(); // run size on the object to which p points
n = p->size(); // equivalent to (*p).size()
```

### 4.7 The Conditional Operator

The conditional operator (the `? :` operator) lets us embed simple if-else logic inside an expression, and it has the following form:

```c++
cond ? expr1 : expr2;
```

For example,

```c++
string finalgrade = (grade < 60) ? "fail" : "pass";
```

The parentheses can be ignored here but it is not recommended to do that:

```c++
string finalgrade = grade < 60 ? "fail" : "pass";
```

Like the logical AND and logical OR (`&&` and `||`) operators, the conditional operator guarantees that only one of `expr1` or `expr2` is evaluated.

##### Nesting Conditional Operations

We can nest one conditional operator inside another as the `cond` or as one or both of the `exprs`. As an example,

```c++
finalgrade = (grade > 90) ? "high pass"
                          : (grade < 60) ? "fail" : "pass";
```

##### Using a Conditional Operator in an Output Expression

The conditional operator has fairly low precedence.

```c++
cout << ((grade < 60) ? "fail" : "pass"); // prints pass or fail
cout << (grade < 60) ? "fail" : "pass"; // prints 1 or 0 
cout << grade < 60 ? "fail" : "pass"; // error: compares cout to 60
```

The `<<` operator returns `cout`.

The second expression is equivalent to

```c++
cout << (grade < 60); // prints 1 or 0
cout ? "fail" : "pass"; // test cout and then yield one of the two literals depending on whether cout is true or false
```

The last is equivalent to

```c++
cout << grade; // less-than has lower precedence than shift, so print grade first
cout < 60 ? "fail" : "pass"; // then compare cout to 60
```

### 4.8 The Bitwise Operators

The bitwise operators take operands of integral type that they use as a collection of bits. These operators let us test and set individual bits, and they all generate new values.

As usual, if an operand is a "small integer", its value is first promoted (§ 4.11.1, p. 160) to a larger integral type. The operand(s) can be either signed or unsigned.

<div align='center'>
<figure>
<img src="https://www.oreilly.com/library/view/c-primer-fifth/9780133053043/graphics/04tab03.jpg" alt="Image" style="zoom:100%;" />
<figcaption style="font-size: 80%;"> Table 4.3. Bitwise Operators (Left Associative) (<a href="https://www.oreilly.com/library/view/c-primer-fifth/9780133053043/ch04lev1sec8.html">Source</a>) </figcaption>
</figure>
</div>

WARNING: Because there are no guarantees for how the sign bit is handled, we strongly recommend using unsigned types with the bitwise operators.

##### Bitwise Shift Operators

We have already used the overloaded versions of the `>>` and `<<` operators that the IO library defines to do input and output. The built-in meaning of these operators is that they perform a bitwise shift on their operands. They yield a value that is a copy of the (possibly promoted) left-hand operand with the bits shifted. The bits are shifted left (`<<`) or right (`>>`). Bits that are shifted off the end are discarded.

##### Bitwise NOT Operator

##### Bitwise AND , OR , and XOR Operators

##### Using Bitwise Operators

##### Shift Operators (aka IO Operators) Are Left Associative

### 4.9 The `sizeof` Operator

The `sizeof` operator returns the size, in bytes, of an expression or a type name. The operator is right associative. The result of `sizeof` is a constant expression (§ 2.4.4, p. 65) of type `size_t` (§ 3.5.2, p. 116).

```c++
Sales_data data, *p;
sizeof(Sales_data); // size required to hold an object of type Sales_data
sizeof data; // size of data's type, i.e., sizeof(Sales_data)
sizeof p; // size of a pointer
sizeof *p; // size of the type to which p points, i.e., sizeof(Sales_data)
sizeof data.revenue; // size of the type of Sales_data's revenue member
sizeof Sales_data::revenue; // alternative way to get the size of revenue
```

The operator does not evaluate its operand. `sizeof *p;` doesn't matter that `p` is an (i.e., uninitialized) pointer (§ 2.3.2, p. 52). `sizeof` doesn't need dereference the pointer to know what type it will return.

`sizeof char` is 1.

We can determine the number of elements in an array by dividing the array size by the element size:

```c++
constexpr size_t sz = sizeof(ia)/sizeof(*ia); // the number of elements in ia 
```

### 4.10 Comma Operator

One common use for the comma operator is in a `for` loop:

```c++
vector<int>::size_type cnt = ivec.size();
// assign values from size . . . 1 to the elements in ivec
for (vector<int>::size_type ix = 0; ix != ivec.size(); ++ix, --cnt)
    ivec[ix] = cnt;
```

This loop increments `ix` and decrements `cnt` in the expression in the `for` header.

### 4.11 Type Conversions

In C++ some types are related to each other. Two types are related if there is a conversion between them, and we can use an object or value of one type where an operand of the related type is expected.

As an example,

```c++
int ival = 3.541 + 3; // the compiler might warn about loss of precision
```

These conversions are carried out automatically and they are referred to as implicit conversions.

The implicit conversions among the arithmetic types are defined to preserve precision, if possible. Most often, if an expression has both integral and floating-point operands, the integer is converted to floating-point. In this case, 3 is converted to `double`, floating-point addition is done, and the result is a `double`.

##### When Implicit Conversions Occur

The compiler automatically converts operands in the following circumstances:

* In most expressions, values of integral types smaller than `int` are first promoted to an appropriate larger integral type.

* In conditions, non`bool` expressions are converted to `bool`.

* In initializations, the initializer is converted to the type of the variable; in assignments, the right-hand operand is converted to the type of the left-hand.

* In arithmetic and relational expressions with operands of mixed types, the types are converted to a common type.

* As we'll see in Chapter 6, conversions also happen during function calls.

#### 4.11.1 The Arithmetic Conversions

The arithmetic conversions, which we introduced in § 2.1.2 (p. 35), convert one arithmetic type to another. The rules define a hierarchy of type conversions in which operands to an operator are converted to the widest type.

##### Integral Promotions

The integral promotions convert the small integral types to a larger integral type. The types `bool`, `char`, `signed char`, `unsigned char`, `short`, and `unsigned short` are promoted to `int` if all possible values of that type fit in an `int`. Otherwise, the value is promoted to `unsigned int`.

The larger char types (`wchar_t`, `char16_t`, and `char32_t`) are promoted to the smallest type of `int`, `unsigned int`, `long`, `unsigned long`, `long long`, or `unsigned long long` in which all possible values of that character type fit.

##### Operands of Unsigned Type

If the operands of an operator have differing types, those operands are ordinarily converted to a common type.

##### Understanding the Arithmetic Conversions

One way to understand the arithmetic conversions is to study lots of examples:

```c++
bool flag; char cval;
short sval; unsigned short usval;
int ival; unsigned int uival;
long lval; unsigned long ulval;
float fval; double dval;

3.14159L + 'a'; // 'a' promoted to int, then that int converted to long double; 'a' has type char, which is a numeric value (§ 2.1.1, p. 32)
dval + ival; // ival converted to double
dval + fval; // fval converted to double
ival = dval; // dval converted (by truncation) to int
flag = dval; // if dval is 0, then flag is false, otherwise true
cval + fval; // cval promoted to int, then that int converted to float
sval + cval; // sval and cval promoted to int
cval + lval; // cval converted to long
ival + ulval; // ival converted to unsigned long
usval + ival; // promotion depends on the size of unsigned short and int
uival + lval; // conversion depends on the size of unsigned int and long
```

#### 4.11.2 Other Implicit Conversions

Array to Pointer Conversions: In most expressions, when we use an array, the array is automatically converted to a pointer to the first element in that array:

```c++
int ia[10]; // array of ten int s
int* ip = ia; // convert ia to a pointer to the first element
```

Pointer Conversions: There are several other pointer conversions: ...

Conversions to `bool`: If the pointer or arithmetic value is zero, the conversion yields `false`; any other value yields `true`:

```c++
char *cp = get_string();
if (cp) /* ... */  // true if the pointer cp is not zero
while (*cp) /* ... */  //true if * cp is not the null character
```

Conversion to `const`: We can convert a pointer to a non`const` type to a pointer to the corresponding `const` type, and similarly for references. 

```c++
int i;
const int &j = i; // convert a nonconst to a reference to const int
const int *p = &i; // convert address of a nonconst to the address of a const
int &r = j, *q = p; // error: conversion from const to nonconst not allowed
```

Conversions Defined by Class Types: Class types can define conversions that the compiler will apply automatically. The compiler will apply only one class-type conversion at a time.

```c++
string s, t = "a value"; // character string literal converted to type string
while (cin >> s) // while condition converts cin to bool
```

The IO library defines a conversion from `istream` to `bool`. The resulting `bool` value depends on the state of the stream. If the last read succeeded, then the conversion yields `true`, else `false`.

#### 4.11.3 Explicit Conversions

Sometimes we want to explicitly force an object to be converted to a different type. For example, we might want to use floating-point division in the following code:

```c++
int i, j;
double slope = i/j;
```

To do so, we'd need a way to explicitly convert `i` and/or `j` to double. We use a cast to request an explicit conversion.

WARNING: Although necessary at times, casts are inherently dangerous constructs.

##### Named Casts

A named cast has the following form:

```c++
cast-name<type> (expression);
```

where `type` is the target type of the conversion, and `expression` is the value to be cast. The `cast-name` may be one of `static_cast`, `dynamic_cast`, `const_cast`, and `reinterpret_cast`. The `cast-name` determines what kind of conversion is performed.

**static_cast**

Any well-defined type conversion, other than those involving low-level `const`, can be requested using a `static_cast`. For example, we can force our expression to use floating-point division by casting one of the operands to `double`:

```c++
double slope = static_cast<double>(j) / i;
```

A `static_cast` is often useful when a larger arithmetic type is assigned to a smaller type. It is also useful to perform a conversion that the compiler will not generate automatically.

**`const_cast`**

A `const_cast` changes only a low-level (§ 2.4.3, p. 63) `const` in its operand:

```c++
const char *pc;
char *p = const_cast<char*>(pc); // ok: but writing through p is undefined
```

Conventionally we say that a cast that converts a `const` object to a non`const` type "casts away the `const`". However, using a `const_cast` in order to write to a `const` object is undefined.

```c++
const char *cp;
// error: static_cast can't cast away const
char *q = static_cast<char*>(cp);
static_cast<string>(cp); // ok: converts string literal to string
const_cast<string>(cp); // error: const_cast only changes constness
```

A `const_cast` is most useful in the context of overloaded functions, which we'll describe in § 6.4 (p. 232). Other uses of `const_cast` often indicate a design flaw. 

**reinterpret_cast**

A `reinterpret_cast` generally performs a low-level reinterpretation of the bit pattern of its operands. 

WARNING: A reinterpret_cast is inherently machine dependent. Safely using reinterpret_cast requires completely understanding the types involved as well as the details of how the compiler implements the cast.

ADVICE: AVOID CASTS

Casts interfere with normal type checking (§ 2.2.2, p. 46). As a result, we strongly recommend that programmers avoid casts. This advice is particularly applicable to `reinterpret_cast`s. Such casts are always hazardous.

##### Old-Style Casts

In early versions of C++, an explicit cast took one of the following two forms:

```c++
type (expr); // function-style cast notation
(type) expr; // C-language-style cast notation
```

When we use an old-style cast where a static_cast or a const_cast would be legal, the old-style  cast does the same conversion as the respective named cast. If neither cast is legal, then an old-style cast performs a reinterpret_cast. For example:

```c++
char *pc = (char*) ip; // ip is a pointer to int
```


has the same effect as using a `reinterpret_cast`.

WARNING: Old-style casts are less visible than are named casts, and it is more difficult to track down a rogue cast.

### 4.12 Operator Precedence Table

### Chapter Summary

Most operators do not specify the order in which operands are evaluated: The compiler is free to evaluate either the left- or right-hand operand first. 

Operands are often converted automatically from their initial type to another related type. For example, small integral types are promoted to a larger integral type in every expression. Conversions exist for both built-in and class types. Conversions can also be done explicitly through a cast.

### Defined Terms

**cast** An explicit conversion.

**const_cast** A cast that converts a low-level `const` object to the corresponding non`const` type or vice versa.

**conversion** Process whereby a value of one type is transformed into a value of another type. The language defines conversions among the built-in types. Conversions to and from class types are also possible.

**implicit conversion** A conversion that is automatically generated by the compiler.

**integral promotions** conversions that take a smaller integral type to its most closely related larger integral type. Operands of small integral types (e.g., `short`, `char`, etc.) are always promoted, even in contexts where such conversions might not seem to be required.

**lvalue** An expression that yields an object or function. A non`const` lvalue that denotes an object may be the left-hand operand of assignment.

**order of evaluation** Order, if any, in which the operands to an operator are evaluated. In most cases, the compiler is free to evaluate operands in any order. However, the operands are always evaluated before the operator itself is evaluated. Only the `&&`, `||`, `?:`, and comma operators specify the order in which their operands are evaluated.

**rvalue** Expression that yields a value but not the associated location, if any, of that value.

**sizeof** Operator that returns the size, in bytes.

**static_cast** An explicit request for a well-defined type conversion. Often used to override an implicit conversion that the compiler would otherwise perform.

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

