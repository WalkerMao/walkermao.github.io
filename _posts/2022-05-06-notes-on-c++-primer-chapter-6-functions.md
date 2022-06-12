---
layout: post
title: "Notes on \"C++ Primer\": Chapter 6. Functions"
date: 2022-05-06
categories: CS
tags: [C++]
toc: true
comments: true
published: true
hidden: true
---

## Chapter 6. Functions

This chapter describes how to define and declare functions.

A function is a block of code with a name. We execute the code by calling the function. 

### 6.1 Function Basics

A function definition typically consists of a return type, a name, a list of zero or more parameters, and a body.

We execute a function through the call operator, which is a pair of parentheses. Inside the parentheses is a comma-separated list of arguments. The arguments are used to initialize the function's parameters. 

##### Writing a Function

```c++
// factorial
int fact(int val) {
    int ret = 1; // local variable to hold the result as we calculate it
    while (val > 1)
        ret *= val--; // assign ret * val to ret and decrement val
    return ret; // return the result
}
```

```c++
float plus(float x, float y) {
    return x + y
}
```

##### Calling a Function

A function call does two things: It initializes the function's parameters from the corresponding arguments, and it transfers control to that function, then execution of the called function begins. 

A call to `fact`:

```c++
int j = fact(5);
```

is equivalent to 

```c++
int val = 5; // initialize val from the literal 5
int ret = 1; // code from the body of fact
while (val > 1)
    ret *= val--;
int j = ret; // initialize j as a copy of ret
```

##### Parameters and Arguments

Arguments are the initializers for a function's parameters. We
have no guarantees about the order in which arguments are evaluated (§ 4.1.3, p. 137). The compiler is free to evaluate the arguments in whatever order it prefers.

```c++
fact(3.14); // ok: argument is converted to int; this is equivalent to fact(3);
```

##### Function Parameter List

A function's parameter list can be empty but cannot be omitted. 

```c++
void f1() { /* ... */ } // implicit void parameter list
void f2(void) { /* ... */ } // explicit void parameter list
```

##### Function Return Type

Most types can be used as the return type of a function. In particular, the return type can be `void`, which means that the function does not return a value. However, the return type may not be an array type (§ 3.5, p. 113) or a function type. However, a function may return a pointer to an array or a function.

#### 6.1.1 Local Objects

In C++, names have scope (§ 2.2.4, p. 48), and objects have lifetimes. It is important to understand both of these concepts.

* The **scope** of a name is the part of the program's text in which that name is visible.

* The **lifetime** of an object is the time during the program's execution that the object exists.

The body of a function is a statement block that forms a new scope in which we can define variables. Parameters and variables defined inside a function body are referred to as **local variables**. They are "local" to that function and hide declarations of the same name made in an outer scope.

##### Automatic Objects

Objects that exist only while a block is executing are known as automatic objects. After execution exits a block, the values of the automatic objects created in that block are undefined.

Parameters are automatic objects. Storage for the parameters is allocated when the function begins. Parameters are defined in the scope of the function body. Hence they are destroyed when the function terminates.

Automatic objects corresponding to local variables are initialized if their definition contains an initializer.

##### Local `static` Objects

It can be useful to have a local variable whose lifetime continues across calls to the function. We obtain such objects by defining a local variable as `static`. Each local `static` object is initialized before the first time execution passes through the object's definition. Local statics are not destroyed when a function ends; they are destroyed when the program terminates.

As a trivial example, here is a function that counts how many times it is called:

```c++
size_t count_calls()
{
    static size_t ctr = 0; // value will persist across calls
    return ++ctr;
}

int main()
{
    for (size_t i = 0; i != 10; ++i)
        cout << count_calls() << endl;
    return 0;
}
```

This program will print the numbers from 1 through 10 inclusive.

Before control flows through the definition of ctr for the first time, `ctr` is created and given an initial value of 0. Whenever count_calls is executed, the variable `ctr` already exists and has whatever value was in that variable the last time the function exited. 

#### 6.1.2 Function Declarations

A function declaration (a.k.a. function prototype) is just like a function definition except that a declaration has no function body. 

```c++
void print(vector<int>::const_iterator beg,
           vector<int>::const_iterator end);
```

Because a function declaration has no body, there is no need for parameter names, but they can help understanding the function.

##### Function Declarations Go in Header Files

As with variables, functions should also be declared in header files and defined in source files.

The source file that defines a function should include the header that contains that function's declaration. That way the compiler will verify that the definition and declaration are consistent.

#### 6.1.3 Separate Compilation

We may want to store the various parts of the program in separate files. C++ supports what is commonly known as separate compilation to lets us split our programs into several files, each of which can be compiled independently.

##### Compiling and Linking Multiple Source Files

As an example, assume that the definition of our `fact` function is in a file named `fact.cc` and its declaration is in a header file named `Chapter6.h`. Our `fact.cc` file, like any file that uses these functions, will include the `Chapter6.h` header. We'll store a `main` function that calls `fact` in a second file named `factMain.cc`.

To produce an executable file, we must tell the compiler where to find all of the code we use. We might compile these files as follows:

```shell
$ CC factMain.cc fact.cc # generates factMain.exe or a.out
$ CC factMain.cc fact.cc -o main # generates main or main.exe
```

Here `CC` is the name of our compiler, `$` is our system prompt, and `#` begins a command-line comment.

If we have changed only one of our source files, we'd like to recompile only the file that actually changed. Most compilers provide a way to separately compile each file. This process usually yields a file with the `.obj` (Windows) or `.o` (UNIX) file extension, indicating that the file contains **object code**.

```shell
$ CC -c factMain.cc # generates factMain.o
$ CC -c fact.cc # generates fact.o
$ CC factMain.o fact.o # generates factMain.exe or a.out
$ CC factMain.o fact.o -o main # generates main or main.exe
```

### 6.2 Argument Passing

As we've seen, each time we call a function, its parameters are created and initialized by the arguments passed in the call.

Note: Parameter initialization works the same way as variable initialization.

As with any other variable, the type of a parameter determines the interaction between the parameter and its argument. If the parameter is a reference (§ 2.3.1, p. 50), then the parameter is bound to its argument. Otherwise, the argument's value is copied. When a parameter is a reference, we say that its corresponding argument is "passed by reference" or that the function is "called by reference".

When the argument value is copied, the parameter and argument are independent objects. We say such arguments are "passed by value" or alternatively that the function is "called by value".

#### 6.2.1 Passing Arguments by Value

When we initialize a nonreference type variable, the value of the initializer is copied. Changes made to the variable have no effect on the initializer. 

Passing an argument by value works exactly the same way.

##### Pointer Parameters

Pointers (§ 2.3.2, p. 52) behave like any other nonreference type.

```c++
// function that takes a pointer and sets the pointed-to value to zero
void reset(int *ip)
{
    *ip = 0; // changes the value of the object to which ip points
    ip = 0; // changes only the local copy of ip; the argument is unchanged
}
```

Best Practice: Programmers accustomed to programming in C often use pointer parameters to access objects outside a function. In C++, programmers generally use reference parameters instead.

#### 6.2.2 Passing Arguments by Reference

Reference parameters are often used to allow a function to change the value of its arguments.

```c++
// function that sets the given object to 0
void reset(int &i)
{
    i = 0;
}
```

As with any other reference, a reference parameter is bound directly to the object from which it is initialized. We pass an object directly; there is no need to pass its address:

```c++
int j = 42;
reset(j); // j is passed by reference; the value in j is changed
```

##### Using References to Avoid Copies

It can be inefficient to copy objects of large class types or large containers. Moreover, some class types (including the IO types) cannot be copied.

```c++
// compare the length of two strings
bool isShorter(const string &s1, const string &s2)
{
    return s1.size() < s2.size();
}
```

Best Practice: Reference parameters that are not changed inside a function should be references to `const`.

##### Using Reference Parameters to Return Additional Information

A function can return only a single value. Reference parameters let us effectively return multiple results. 

#### 6.2.3 `const` Parameters and Arguments

Just as in any other initialization, when we copy an argument to initialize a parameter, top-level `const`s (§ 2.4.3, p. 63) on parameters are ignored. We can pass either a `const` or a non`const` object to a parameter (`i` in the following code) that has a top-level `const`:

```c++
void fcn(const int i) { /* fcn can read but not write to i */ }
```

In C++, we can define several different functions that have the same name. However, we can do so only if their parameter lists are sufficiently different, otherwise it's an error. For example, 

```c++
void fcn(const int i) { /* fcn can read but not write to i */ }
void fcn(int i) { /* ... */ } // error: redefines fcn(int)
```

Because top-level `const`s are ignored, we can pass exactly the same types to either version of `fcn`. The second version of `fcn` is an error. Despite appearances, its parameter list doesn't differ from the list in the first version of `fcn`.

##### Pointer or Reference Parameters and `const`

Remember that, we can initialize an object with a low-level `const` from a non`const` object but not vice versa (§ 2.4.1, p. 61; § 2.4.2, p. 62), and a plain reference must be initialized from an object of the same type (§ 2.3.1, p. 50).

Exactly the same initialization rules apply to parameter passing:

```c++
int i = 0;
const int ci = i;
string::size_type ctr = 0;
reset(&i); // calls the version of reset that has an int* parameter
reset(&ci); // error: can't initialize an int* from a pointer to a const int object
reset(i); // calls the version of reset that has an int& parameter
reset(ci); // error: can't bind a plain reference to the const object ci
reset(42); // error: can't bind a plain reference to a literal
reset(ctr); // error: types don't match; ctr has an unsigned type
// ok: find_char (§ 6.2.2, p. 211) 's first parameter is a reference to const
find_char("Hello World!", 'o', ctr);
```

##### Use Reference to `const` When Possible

As we've just seen, we cannot pass a `const` object, or a literal, or an object that requires conversion to a plain reference parameter.

#### 6.2.4 Array Parameters

Arrays have two special properties that affect how we define and use functions that operate on arrays: We cannot copy an array (§ 3.5.1, p. 114), and when we use an array it is (usually) converted to a pointer (§ 3.5.3, p. 117). When we pass an array to a function, we are actually passing a pointer to the array's first element, and the size of the array is irrelevant.

Regardless of appearances, these declarations are equivalent: Each declares a function with a single parameter of type `const int*`.

```c++
void print(const int*);
void print(const int[]); // shows the intent that the function takes an array
void print(const int[10]); // dimension for documentation purposes (at best)
```

When the compiler checks a call to `print`, it checks only that the argument has type `const int*`:

```c++
int i = 0, j[2] = {0, 1};
print(&i); // ok: &i is int*
print(j); // ok: j is converted to an int* that points to j[0]
```

WARNING: As with any code that uses arrays, functions that take array parameters must ensure that all uses of the array stay within the array bounds.

Because arrays are passed as pointers, functions ordinarily don't know the size of the array they are given. They must rely on additional information provided by the caller. There are three common techniques used to manage pointer parameters.

##### Using a Marker to Specify the Extent of an Array

The first approach to manage array arguments requires the array itself to contain an end marker. For example, C-style strings (§ 3.5.4, p. 122) are stored in character arrays in which the last character of the string is followed by a null character. 

```c++
void print(const char *cp)
{
    if (cp) // if cp is not a null pointer
        while (*cp) // so long as the character it points to is not a null character
            cout << *cp++; // print the character and advance the pointer
}
```

This convention works less well with data, such as `int`s, where every value in the range is a legitimate value.

##### Using the Standard Library Conventions

A second technique used to manage array arguments is to pass pointers to the first and one past the last element in the array.

```c++
void print(const int *beg, const int *end)
{
    // print every element starting at beg up to but not including end
    while (beg != end)
        cout << *beg++ << endl; // print the current element and advance the pointer
}
```

To call this function,

```c++
int j[2] = {0, 1};
print(begin(j), end(j)); // begin and end functions, see § 3.5.3 (p. 118)
```

##### Explicitly Passing a Size Parameter

A third approach for array arguments, which is common in C programs and older C++ programs, is to define a second parameter that indicates the size of the array.

```c++
// const int ia[] is equivalent to const int* ia
// size is passed explicitly and used to control access to elements of ia
void print(const int ia[], size_t size)
{
    for (size_t i = 0; i != size; ++i) {
        cout << ia[i] << endl;
    }
}
```

To call this function,

```c++
int j[] = {0, 1};
print(j, end(j) - begin(j));
```

##### Array Parameters and `const`

##### Array Reference Parameters

We can define a parameter that is a reference to an array. 

```c++
// ok: parameter is a reference to an array; the dimension is part of the type
void print(int (&arr)[10])
{
    for (auto elem : arr)
        cout << elem << endl;
}
```

Note: The parentheses around `&arr` are necessary (§ 3.5.1, p. 114):

```c++
f(int &arr[10]) // error: declares arr as an array of references
f(int (&arr)[10]) // ok: arr is a reference to an array of ten ints
```

The fact that the size is part of the type limits the usefulness of this version of `print`. We may call this function only for an array
of exactly ten `int`s:

```c++
int i = 0, j[2] = {0, 1};
int k[10] = {0,1,2,3,4,5,6,7,8,9};
print(&i); // error: argument is not an array of ten ints
print(j); // error: argument is not an array of ten ints
print(k); // ok: argument is an array of ten ints
```

We'll see in § 16.1.1 (p. 654) how we might write this function in a way that would allow us to pass a reference parameter to an array of any size.

##### Passing a Multidimensional Array

A multidimensional array is passed as a pointer to its first sub-array. 

```c++
// matrix points to the first element in an array whose elements are arrays of ten ints
void print(int (*matrix)[10], int rowSize) { /* ... */ }
```

declares `matrix` as a pointer to an array of ten `int`s.

Note: Again, the parentheses around `*matrix` are necessary:

```c++
int *matrix[10]; // array of ten pointers
int (*matrix)[10]; // pointer to an array of ten ints
```

We can also define our function using array syntax. As usual, the compiler ignores the first dimension, so it is best not to include it:

```c++
// equivalent definition
void print(int matrix[][10], int rowSize) { /* ... */ }
```

declares matrix to be what looks like a two-dimensional array. In fact, it's still a pointer to an array of ten `int`s.

#### 6.2.5 `main`: Handling Command-Line Options

We sometimes need to pass arguments to `main`. The most common use of arguments to `main` is to let the user specify a set of options to guide the operation of the program.

#### 6.2.6 Functions with Varying Parameters

The new standard provides two primary ways to write a function that takes a varying number of arguments: If all the arguments have the same type, we can pass a library type named `initializer_list`. If the argument types vary, we can write a special kind of function, known as a variadic template, which we'll cover in § 16.4 (p. 699).

##### `initializer_list` Parameters

An `initializer_list` is a library type that represents an array (§ 3.5, p. 113) of values of the specified type. This type is defined in the `initializer_list` header. 

Like a `vector`, `initializer_list` is a template type (§ 3.3, p. 96). When we define an `initializer_list`, we must specify the type of the elements that the list will contain:

```c++
initializer_list<string> ls; // initializer_list of strings
initializer_list<int> li; // initializer_list of ints
```

Unlike vector, the elements in an `initializer_list` are always `const` values.

We can write our function to produce an error code and error messages from a varying number of arguments as follows:

```c++
void error_msg(ErrCode e, initializer_list<string> il)
{
    cout << e.msg() << ": ";
    for (const auto &elem : il)
        cout << elem << " " ;
    cout << endl;
}
```

To call this function,

```c++
if (expected != actual)
    error_msg(ErrCode(42), {"functionX", expected, actual});
else
    error_msg(ErrCode(0), {"functionX", "okay"});
```

##### Ellipsis Parameters

Ellipsis parameters are in C++ to allow programs to interface to C code that uses a C library facility named `varargs`.

### 6.3 Return Types and the return Statement

There are two forms of `return` statements:

```c++
return; // no return value
return expression; // return a value
```

#### 6.3.1 Functions with No Return Value

A `return` with no value may be used only in a function that has a `return` type of `void`. Functions that return `void` are not required to contain a `return`; an implicit `return` takes place after the function's last statement.

#### 6.3.2 Functions That Return a Value

Every return in a function with a return type other than `void` must return a value. The value returned must have the same type as the function return type, or it must have a type that can be implicitly converted (§ 4.11, p. 159) to that type.

##### How Values Are Returned

Values are returned in exactly the same way as variables and parameters are initialized: The return value is used to initialize a temporary at the call site, and that temporary is the result of the function call.

If the return type is a nonreference type, the return value is copied to the call site.

##### Never Return a Reference or Pointer to a Local Object

When a function completes, its storage is freed (§ 6.1.1, p. 204). After a function terminates, references to local objects refer to memory that is no longer valid, and pointers to local objects would point to a nonexistent object.

```c++
// disaster: both returns refer to memory that is no longer available
const string &manip()
{
    string ret;
    // transform ret in some way
    if (!ret.empty())
        return ret; // WRONG: returning a reference to a local object!
    else
        return "Empty"; // WRONG: "Empty" is a local temporary string
}
```

Tip: One good way to ensure that the return is safe is to ask: To what preexisting object is the reference referring?

##### Functions That Return Class Types and the Call Operator

##### Reference Returns Are Lvalues

Calls to functions that return references are lvalues; other return types yield rvalues. We can assign to the result of a function that returns a reference to non`const`:

```c++
char &get_val(string &str, string::size_type ix)
{
    return str[ix]; // get_val assumes the given index is valid
}

int main()
{
    string s("a value");
    get_val(s, 0) = 'A'; // changes s[0] to A
    // ...
    return 0;
}
```

##### List Initializing the Return Value

Under the new standard, functions can return a braced list of values.

As an example, the following function returns a `vector` that holds the error-message `string`s:

```c++
vector<string> process()
{
    // ...
    // expected and actual are strings
    if (expected.empty())
        return {}; // return an empty vector
    else if (expected == actual)
        return {"functionX", "okay"}; // return list-initialized vector
    else
        return {"functionX", expected, actual};
}
```

##### Return from `main`

There is one exception to the rule that a function with a return type other than `void` must return a value: If control reaches the end of `main` and there is no `return`, then the compiler implicitly inserts a return of 0.

As we saw in § 1.1 (p. 2), the value returned from `main` is treated as a status indicator. A zero return indicates success; most other values indicate failure. A nonzero value has a machine-dependent meaning. To make return values machine independent, the `cstdlib` header defines two preprocessor variables (§ 2.3.2, p. 54) that we can use to indicate success or failure:

```c++
int main()
{
    if (some_failure)
        return EXIT_FAILURE; // defined in cstdlib
    else
        return EXIT_SUCCESS; // defined in cstdlib
}
```

Because these are preprocessor variables, we must not precede them with `std::`, nor may we mention them in using declarations.

##### Recursion

A function that calls itself, either directly or indirectly, is a recursive function.

There must always be a path through a recursive function that does not involve a recursive call; otherwise, the function will recurse "forever", meaning that the function will continue to call itself until the program stack is exhausted.

Note: The `main` function may not call itself.

#### 6.3.3 Returning a Pointer to an Array

Because we cannot copy an array, a function cannot return an array. However, a function can return a pointer or a reference to an array (§ 3.5.1, p. 114).

##### Declaring a Function That Returns a Pointer to an Array

Remember that 

```c++
int arr[10]; // arr is an array of ten ints
int *p1[10]; // p1 is an array of ten pointers
int (*p2)[10] = &arr; // p2 points to an array of ten ints
```

The form of a function that returns a pointer to an array is:

```c++
Type (*function(parameter_list))[dimension]
```

As an example,

```c++
int (*func(int i))[10];
```

We can use a type alias to simplify the declaration of `func` and make it more readable (§ 2.5.1, p. 67):

```c++
typedef int arrT[10]; // arrT is a synonym for the type array of ten ints
using arrT = int[10]; // equivalent declaration of arrT; see § 2.5.1 (p. 68)
arrT* func(int i); // func returns a pointer to an array of ten ints
```

##### Using a Trailing Return Type

Under the new standard, another way to simplify the declaration of `func` is by using a trailing return type.

```c++
// func takes an int argument and returns a pointer to an array of ten ints
auto func(int i) -> int(*)[10];
```

##### Using `decltype`

As another alternative, if we know the array(s) to which our function can return a pointer, we can use `decltype` to declare the return type. 

```c++
int odd[] = {1,3,5,7,9};
int even[] = {0,2,4,6,8};
// returns a pointer to an array of five int elements
decltype(odd) *arrPtr(int i)
{
    return (i % 2) ? &odd : &even; // returns a pointer to the array
}
```

### 6.4 Overloaded Functions

Functions that have the same name but different parameter lists and that appear in the same scope are overloaded. For example, in § 6.2.4 (p. 214) we defined several functions named `print`:

```c++
void print(const char *cp);
void print(const int *beg, const int *end);
void print(const int ia[], size_t size);
```

When we call these functions, the compiler can deduce which function we want based on the argument type we pass:

```c++
int j[2] = {0,1};
print("Hello World"); // calls print(const char*)
print(j, end(j) - begin(j)); // calls print(const int*, size_t)
print(begin(j), end(j)); // calls print(const int*, const int*)
```

Note: The `main` function may not be overloaded.

##### Defining Overloaded Functions

##### Determining Whether Two Parameter Types Differ

##### Overloading and `const` Parameters

As we saw in § 6.2.3 (p. 212), a parameter that has a top-level `const` is indistinguishable from one without a top-level `const`, so we cannot overload based on whether the parameter is a top-level `const`.

On the other hand, we can overload based on whether the parameter is a reference (or pointer) to the `const` or non`const` version of a given type; such `const`s are low-level.

ADVICE: WHEN NOT TO OVERLOAD A FUNCTION NAME

We should only overload operations that actually do similar things.

##### `const_cast` and Overloading

In § 4.11.3 (p. 163) we noted that `const_cast`s are most useful in the context of overloaded functions. 

##### Calling an Overloaded Function

#### 6.4.1 Overloading and Scope

Note: In C++, name lookup happens before type checking.

### 6.5 Features for Specialized Uses

#### 6.5.1 Default Arguments

If a parameter has a default argument, all the parameters that follow it must also have default arguments.

```c++
typedef string::size_type sz; // typedef see § 2.5.1 (p. 67)
string screen(sz ht = 24, sz wid = 80, char backgrnd = ' ');
```

##### Calling Functions with Default Arguments

##### Default Argument Declarations

Each parameter can have its default specified only once in a given scope. For example, given

```c++
// no default for the height or width parameters
string screen(sz, sz, char = ' ');
```

we cannot change an already declared default value:

```c++
string screen(sz, sz, char = '*'); // error: redeclaration
```

but we can add a default argument as follows:

```c++
string screen(sz = 24, sz = 80, char); // ok: adds default arguments
```

Best Practices: Default arguments ordinarily should be specified with the function declaration in an appropriate header.

##### Default Argument Initializers

Local variables may not be used as a default argument. 

```c++
// the declarations of wd, def, and ht must appear outside a function
sz wd = 80;
char def = ' ';
sz ht();
string screen(sz = ht(), sz = wd, char = def);
string window = screen(); // calls screen(ht(), 80, ' ')

void f2()
{
    def = '*'; // changes the value of a default argument
    sz wd = 100; // hides the outer definition of wd but does not change the default
    window = screen(); // calls screen(ht(), 80, '*')
}
```

Inside `f2`, we declared a local variable that hides the outer `wd`. However, the local named `wd` is unrelated to the default argument passed to screen.

#### 6.5.2 `inline` and `constexpr` Functions

Calling a function is apt to be slower than evaluating the equivalent expression. On most machines, a function call does a lot of work: Registers are saved before the call and restored after the return; arguments may be copied; and the program branches to a new location.

##### `inline` Functions Avoid Function Call Overhead

A function specified as inline (usually) is expanded "in line" at each call. If `shorterString` were defined as `inline`, 

```c++
// inline version: find the shorter of two strings
inline const string &shorterString(const string &s1, const string &s2)
{
    return s1.size() <= s2.size() ? s1 : s2;
}
```

then this call

```c++
cout << shorterString(s1, s2) << endl;
```

(probably) would be expanded during compilation into something like

```c++
cout << (s1.size() < s2.size() ? s1 : s2) << endl;
```

The run-time overhead of making `shorterString` a function is thus removed.

Note: The `inline` specification is only a request to the compiler. The compiler may choose to ignore this request.

In general, the `inline` mechanism is meant to optimize small, straight-line functions that are called frequently. Many compilers will not inline a recursive function. A 75-line function will almost surely not be expanded inline.

##### `constexpr` Functions

A `constexpr` function is a function that can be used in a constant expression (§ 2.4.4, p. 65). 

##### Put `inline` and `constexpr` Functions in Header Files

#### 6.5.3 Aids for Debugging

C++ programmers sometimes use a technique similar to header guards (§ 2.6.3, p. 77) to conditionally execute debugging code. The debugging code is turned off when the application is completed and ready to ship. This approach uses two preprocessor facilities: `assert` and `NDEBUG`.

##### The `assert` Preprocessor Macro

`assert` is a preprocessor macro. A preprocessor macro is a preprocessor variable that acts somewhat like an inline function.

```c++
assert(expr);
```

evaluates `expr` and if the expression is false (i.e., zero), then assert writes a message and terminates the program.

The `assert` macro is defined in the `cassert` header. As we've seen, preprocessor names are managed by the preprocessor not the compiler (§ 2.6. 3, p. 76). As a result, we use preprocessor names directly and do not provide a `using` declaration for them. That is, we refer to `assert`, not `std::assert`, and provide no `using` declaration for `assert`.

As with preprocessor variables, macro names must be unique within the program. We should avoid using macro names in our program.

##### The `NDEBUG` Preprocessor Variable

The behavior of `assert` depends on the status of a preprocessor variable named `NDEBUG`. If `NDEBUG` is defined, `assert` does nothing. By default, `NDEBUG` is not defined, so, by default, `assert` performs a run-time check.

We can "turn off" debugging by writing a `#define NDEBUG` at the beginning of the script. Alternatively, most compilers provide a command-line option that lets us define preprocessor variables:

```shell
$ CC -D NDEBUG main.C # use /D with the Microsoft compiler
```

In addition to using `assert`, we can write our own conditional debugging code using `NDEBUG`. If `NDEBUG` is not defined, the code between the `#ifndef` and the `#endif` is executed. If `NDEBUG` is defined, that code is ignored:

```c++
void print(const int ia[], size_t size)
{
    // print the name of the function we are debugging
    #ifndef NDEBUG
    // _ _func_ _ is a local static defined by the compiler that holds the function's name
    cerr << _ _func_ _ << ": array size is " << size << endl;
    #endif
    // ...
```

In addition to `_ _func_ _`, which the C++ compiler defines, the preprocessor defines four other names that can be useful in debugging:

* `_ _FILE_ _` string literal containing the name of the file
* `_ _LINE_ _` integer literal containing the current line number
* `_ _TIME_ _` string literal containing the time the file was compiled
* `_ _DATE_ _` string literal containing the date the file was compiled

### 6.6 Function Matching

##### Determining the Candidate and Viable Functions

##### Finding the Best Match, If Any

The closer the types of the argument and parameter are to each other, the better the match.

##### Function Matching with Multiple Parameters

If after looking at each argument there is no single function that is preferable, then the call is in error. The compiler will complain that the call is ambiguous.

Best Practices: Casts should not be needed to call an overloaded function. The need for a cast suggests that the parameter sets are designed poorly.

#### 6.6.1 Argument Type Conversions

##### Matches Requiring Promotion or Arithmetic Conversion

##### Function Matching and `const` Arguments

### 6.7 Pointers to Functions

A function pointer is a pointer that denotes a function rather than an object. Like any other pointer, a function pointer points to a particular type. A function's type is determined by its return type and the types of its parameters. For example, 

```c++
bool lengthCompare(const string &, const string &);
```

has type `bool(const string&, const string&)`. To declare a pointer that can point at this function, we declare a pointer in place of the function name:

```c++
// pf points to a function returning bool that takes two const string references
bool (*pf)(const string &, const string &); // uninitialized
```

Starting from the name we are declaring, we see that `pf` is preceded by a `*`, so `pf` is a pointer. To the right is a parameter list, which means that `pf` points to a function. Looking left, we find that the type the function returns is `bool`. 

##### Using Function Pointers

When we use the name of a function as a value, the function is automatically converted to a pointer.  For example, we can assign the address of `lengthCompare` to `pf` as follows:

```c++
pf = lengthCompare; // pf now points to the function named lengthCompare
pf = &lengthCompare; // equivalent assignment: address-of operator is optional
```

We can use a pointer to a function to call the function. We can do so directly—there is no need to dereference the pointer:

```c++
bool b1 = pf("hello", "goodbye"); // calls lengthCompare
bool b2 = (*pf)("hello", "goodbye"); // equivalent call
bool b3 = lengthCompare("hello", "goodbye"); // equivalent call
```

There is no conversion between pointers to one function type and pointers to another function type. However, as usual, we can assign `nullptr` (§ 2.3.2, p. 53) or a zero-valued integer constant expression to a function pointer to indicate that the pointer does not point to any function:

```c++
string::size_type sumLength(const string&, const string&);
bool cstringCompare(const char*, const char*);
pf = 0; // ok: pf points to no function
pf = sumLength; // error: return type differs
pf = cstringCompare; // error: parameter types differ
pf = lengthCompare; // ok: function and pointer types match exactly
```

##### Pointers to Overloaded Functions

The compiler uses the type of the pointer to determine which overloaded function to use.

##### Function Pointer Parameters

Just as with arrays (§ 6.2.4, p. 214), we cannot define parameters of function type but can have a parameter that is a pointer to function. As with arrays, we can write a parameter that looks like a function type, but it will be treated as a pointer:

```c++
// third parameter is a function type and is automatically treated as a pointer to function
void useBigger(const string &s1, const string &s2, bool pf(const string &, const string &));
// equivalent declaration: explicitly define the parameter as a pointer to function
void useBigger(const string &s1, const string &s2, bool (*pf)(const string &, const string &));
```

When we pass a function as an argument, we can do so directly. It will be automatically converted to a pointer:

```c++
// automatically converts the function lengthCompare to a pointer to function
useBigger(s1, s2, lengthCompare);
```

As we've just seen in the declaration of `useBigger`, writing function pointer types quickly gets tedious. Type aliases (§ 2.5.1, p. 67), along with `decltype` (§ 2.5.3, p. 70), let us simplify code that uses function pointers:

```c++
// Func and Func2 have function type
typedef bool Func(const string&, const string&);
typedef decltype(lengthCompare) Func2; // equivalent type
// FuncP and FuncP2 have pointer to function type
typedef bool(*FuncP)(const string&, const string&);
typedef decltype(lengthCompare) *FuncP2; // equivalent type
```

It is important to note that `decltype` returns the function type; the automatic conversion to pointer is not done, so we must add the `*` if we want a pointer. We can redeclare `useBigger` using any of these types:

```c++
// equivalent declarations of useBigger using type aliases
void useBigger(const string&, const string&, Func);
void useBigger(const string&, const string&, FuncP2);
```

In the first case, the compiler will automatically convert the function type represented by `Func` to a pointer.

##### Returning a Pointer to Function

As with arrays (§ 6.3.3, p. 228), we can't return a function type but can return a pointer to a function type. Similarly, we must write the return type as a pointer type; the compiler will not automatically treat a function return type as the corresponding pointer type.

For example,

```c++
// the return type of f1 is a pointer to a function that has type int(int)
int (*f1(int))(int*, int);
```

Reading this declaration from the inside out, we see that `f1` has a parameter list, so `f1` is a function. `f1` is preceded by a `*` so `f1` returns a pointer. The type of that pointer itself has a parameter list, so the pointer points to a function. That function takes an `int` parameter and returns an `int`.

Also as with array returns, we can simply the declaration by using a type alias:

```c++
using F = int(int*, int); // F is a function type, not a pointer
using PF = int(*)(int*, int); // PF is a pointer type

PF f1(int); // ok: PF is a pointer to function; f1 returns a pointer to function
F f1(int); // error: F is a function type; f1 can't return a function
F* f1(int); // ok: explicitly specify that the return type is a pointer to function
```

For completeness, it's worth noting that we can simplify declarations of functions that return pointers to function by using a trailing return (§ 6.3.3, p. 229):

```c++
auto f1(int) -> int (*)(int*, int);
```

##### Using `auto` or `decltype` for Function Pointer Types

If we know which function(s) we want to return, we can use `decltype` to simplify writing a function pointer return type.  For example, assume we have two functions, both of which return a `string::size_type` and have two `const string&` parameters. We can write a third function that takes a `string` parameter and returns a pointer to one of these two functions as follows:

```c++
string::size_type sumLength(const string&, const string&);
string::size_type largerLength(const string&, const string&);
// depending on the value of its string parameter,
// getFcn returns a pointer to sumLength or to largerLength
decltype(sumLength) *getFcn(const string &);
```

### Chapter Summary

Functions are named units of computation. Every function has a return type, a name, a (possibly empty) list of parameters, and a function body. 

In C++, functions may be overloaded: The same name may be used to define different functions as long as the number or types of the parameters in the functions differ. The compiler automatically figures out which function to call based on the arguments in a call. The process of selecting the right function from a set of overloaded functions is referred to as function matching.

### Defined Terms

Almost all terms are important. Read p. 251~252 for detail.

<br>

## References

Lippman, Stanley B., Josée Lajoie, and Barbara E. Moo. *C++ Primer*. Addison-Wesley Professional, 2012. 

