---
layout: post
title: "Notes on \"C++ Primer\": Functions and Classes (Chapter 6~7)"
date: 2022-05-08
categories: CS
tags: [C++]
comments: true
published: true
hidden: false
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

## Chapter 7. Classes

In C++ we use classes to define our own data types. 

The fundamental ideas behind classes are **data abstraction** and **encapsulation**. Data abstraction is a programming (and design) technique that relies on the separation of **interface** and **implementation**.  The interface of a class consists of the operations that users of the class can execute.

Encapsulation enforces the separation of a class' interface and implementation. A class that is encapsulated hides its implementation—users of the class can use the interface but have no access to the implementation.

A class that uses data abstraction and encapsulation defines an **abstract data type**. Programmers who use the class need not know how the type works. They can instead think abstractly about what the type does.

### 7.1 Defining Abstract Data Types

The `Sales_item` class that we used in Chapter 1 is an abstract data type. We have no access to the data members stored in a `Sales_item` object.

Our `Sales_data` class (§ 2.6.1, p. 72) is not an abstract data type. It lets users of the class access its data members and forces users to write their own operations. To make `Sales_data` an abstract type, we need to define operations for users of `Sales_data` to use. Once `Sales_data` defines its own operations, we can encapsulate (that is, hide) its data members.

#### 7.1.1 Designing the `Sales_data` Class

##### Using the Revised `Sales_data` Class

#### 7.1.2 Defining the Revised `Sales_data` Class

Member functions must be declared inside the class. Member functions may be defined inside the class itself or outside the class body. Nonmember functions that are part of the interface, such as add, read, and print, are declared and defined outside the class.

```c++
struct Sales_data {
    // new members: operations on Sales_data objects
    std::string isbn() const { return bookNo; } // defined inside the class
    // declared but not defined; will be defined elsewhere
    Sales_data& combine(const Sales_data&);
    double avg_price() const;
    
    // data members are unchanged from § 2.6.1 (p. 72)
    std::string bookNo;
    unsigned units_sold = 0;
    double revenue = 0.0;
};

// nonmember Sales_data interface functions
Sales_data add(const Sales_data&, const Sales_data&);
std::ostream &print(std::ostream&, const Sales_data&);
std::istream &read(std::istream&, Sales_data&);
```

Note: Functions defined in the class are implicitly inline (§ 6.5.2, p. 238).

##### Defining Member Functions

Although every member must be declared inside its class, we can define a member function's body either inside or outside of the class body.

##### Introducing `this`

A call to the `isbn` member function:

```c++
total.isbn()
```

Here we use the dot operator (§ 4.6, p. 150) to fetch the `isbn` member of the object named `total`, which we then call by the call operator `()`.

Member functions access the object on which they were called through an extra, implicit parameter named `this`. When we call a member function, `this` is initialized with the address of the object on which the function was invoked.

In the above example, the compiler passes the address of `total` to the implicit `this` parameter in `isbn`. It is as if the compiler rewrites this call as

```c++
// pseudo-code illustration of how a call to a member function is translated
Sales_data::isbn(&total)
```

which calls the `isbn` member of `Sales_data` passing the address of `total`.

Inside a member function, any direct use of a member of the class is assumed to be an implicit reference through `this`. That is, when
`isbn` uses `bookNo`, it is implicitly using the member to which this points. It is as if we had written `this->bookNo`, where `->` is the member access operator.

The `this` parameter is defined for us implicitly. It would be legal, although unnecessary, to define `isbn` as

```c++
std::string isbn() const { return this->bookNo; }
```

Because `this` is intended to always refer to "this" object, `this` is a `const` pointer (§ 2.4.2, p. 62). We cannot change the address that `this` holds.

##### Introducing `const` Member Functions

The purpose of the keyword `const` that follows the parameter list is to modify the type of the implicit `this` pointer.

By default, the type of `this` is a `const` pointer to the non`const` version of the class type. We cannot call an ordinary member function on a `const` object.

A `const` following the parameter list indicates that this is a pointer to `const`. Member functions that use `const` in this way are `const` member functions.

We can think of the body of `isbn` as if it were written as

```c++
// note that `this` is a pointer to const because isbn is a const member
std::string Sales_data::isbn(const Sales_data *const this) { return this->isbn; }
```

The fact that `this` is a pointer to `const` means that **`const` member functions can read but not write to the data members** of the object on which they are called.

Note: Objects that are `const`, and references or pointers to `const` objects, may call only `const` member functions.

##### Class Scope and Member Functions

Recall that a class is itself a scope (§ 2.6.1, p. 72). The definitions of the member functions of a class are nested inside the scope of the class itself. 

It is worth noting that `isbn` can use `bookNo` even though `bookNo` is defined after `isbn`. As we'll see in § 7.4.1 (p. 283), the compiler processes classes in two steps—the member declarations are compiled first, after which the member function bodies, if any, are processed. Thus, member function bodies may use other members of their class regardless of where in the class those members appear.

##### Defining a Member Function outside the Class

As with any other function, when we define a member function outside the class body, the member's definition must match its declaration in the class body. The name of a member defined outside the class must include the name of the class of which it is a member by using the scope operator `::` (§ 1.2, p. 8):

```c++
double Sales_data::avg_price() const {
    if (units_sold)
        return revenue/units_sold;
    else
        return 0;
}
```

##### Defining a Function to Return "This" Object

The `combine` function is intended to act like the compound assignment operator, `+=`.

```c++
Sales_data& Sales_data::combine(const Sales_data &rhs)
{
    // add the members of rhs into the members of `this` object
    units_sold += rhs.units_sold;
    revenue += rhs.revenue; 
    return *this; // return the object on which the function was called
}
```

When our program calls

```c++
total.combine(trans); // update the running total
```

the address of `total` is bound to the implicit `this` parameter and `rhs` is bound to `trans`. Thus, `units_sold += rhs.units_sold;` adds `trans.units_sold` to `total.units_sold`.

#### 7.1.3 Defining Nonmember Class-Related Functions

Class authors often define auxiliary functions, such as our `add`, `read`, and `print` functions.

As with any other function, we normally separate the declaration of the function from its definition (§ 6.1.2, p. 206). 

Note: Ordinarily, nonmember functions that are part of the interface of a class should be declared in the same header as the class itself. That way users need to include only one file to use any part of the interface.

##### Defining the `read` and `print` Functions

```c++
// input transactions contain ISBN, number of copies sold, and sales price
istream &read(istream &is, Sales_data &item)
{
    double price = 0;
    is >> item.bookNo >> item.units_sold >> price;
    item.revenue = price * item.units_sold;
    return is;
}

ostream &print(ostream &os, const Sales_data &item)
{
    os << item.isbn() << " " << item.units_sold << " "
    << item.revenue << " " << item.avg_price();
    return os;
}
```

Note that the IO classes are types that cannot be copied, so we may only pass them by reference (§ 6.2.2, p. 210). 

##### Defining the `add` Function

```c++
// takes two Sales_data objects and returns a new Sales_data representing their sum
Sales_data add(const Sales_data &lhs, const Sales_data &rhs)
{
    Sales_data sum = lhs; // copy data members from lhs into sum
    sum.combine(rhs); // add data members from rhs into sum
    return sum;
}
```

#### 7.1.4 Constructors

Classes control object initialization by defining one or more special member functions known as **constructors**. The job of a constructor is to initialize the data members of a class object. A constructor is run whenever an object of a class type is created.

Constructors are a surprisingly complex topic. Indeed, we'll have more to say about constructors in § 7.5 (p. 288), § 15.7 (p. 622), and § 18.1.3 (p. 777), and in Chapter 13.

Constructors have the same name as the class. Unlike other functions, constructors have no return type. A class can have multiple constructors. Like any other overloaded function (§ 6.4, p. 230), the constructors must differ from each other in the number or types of their parameters.

Unlike other member functions, constructors may not be declared as `const` (§ 7.1.2, p. 258). When we create a `const` object of a class type, the object does not assume its "constness" until after the constructor completes the object's initialization. Thus, constructors can write to `const` objects during their construction.

##### The Synthesized Default Constructor

If our class does not explicitly define any constructors, the compiler will implicitly define the default constructor for us. The default constructor takes no arguments.

The compiler-generated constructor is known as the **synthesized default constructor**. It default initializes the data member `bookNo` in `Sales_data` to the empty string.

##### Some Classes Cannot Rely on the Synthesized Default Constructor

Reasons to define the default constructor:

Remember that objects of built-in or compound type (such as arrays and pointers) that are defined inside a block have undefined value when they are default initialized (§ 2.2.1, p. 43). Therefore, classes that have members of built-in or compound type should ordinarily either initialize those members inside the class or define their own version of the default constructor.

Also, if a class has a member that has a class type, and that class doesn't have a default constructor, then the compiler can't initialize that member. For such classes, we must define our own version of the default constructor.

##### Defining the `Sales_data` Constructors

For our `Sales_data` class define four constructors with different parameters:

```c++
struct Sales_data {
    // constructors added
    Sales_data() = default;
    Sales_data(const std::string &s): bookNo(s) { }
    Sales_data(const std::string &s, unsigned n, double p):
        bookNo(s), units_sold(n), revenue(p*n) { }
    Sales_data(std::istream &);
    // other members as before
    std::string isbn() const { return bookNo; }
    Sales_data& combine(const Sales_data&);
    double avg_price() const;
    std::string bookNo;
    unsigned units_sold = 0;
    double revenue = 0.0;
};
```

##### What `=` default Means

The following defines the default constructor because it takes no arguments.

```c++
Sales_data() = default;
```

We are defining this constructor only because we want to provide other constructors as well as the default constructor. We want this constructor to do exactly the same work as the synthesized version we had been using.

##### Constructor Initializer List

```c++
Sales_data(const std::string &s): bookNo(s) { }
Sales_data(const std::string &s, unsigned n, double p):
    bookNo(s), units_sold(n), revenue(p*n) { }
```

`bookNo(s)` is the constructor initializer list for the first constructor, and `bookNo(s), units_sold(n), revenue(p*n)` is that for the second.

When a member is omitted from the constructor initializer list, it is implicitly initialized using the same process as is used by the synthesized default constructor. Thus, the constructor that takes a `string` is equivalent to

```c++
Sales_data(const std::string &s):
    bookNo(s), units_sold(0), revenue(0) { }
```

The only work these constructors need to do is give the data members their values. If there is no further work, then the function body is empty.

##### Defining a Constructor outside the Class Body

Unlike our other constructors, inside the function body of the constructor that takes an `istream`, this constructor calls `read` to give the data members new values:

```c++
Sales_data::Sales_data(std::istream &is)
{
    read(is, *this); // read will read a transaction from is into this object
}
```

Constructors have no return type, so this definition starts with the name of the function we are defining. This member is a constructor because it has the same name as its class.

#### 7.1.5 Copy, Assignment, and Destruction

In addition to defining how objects of the class type are initialized, classes also control what happens when we copy, assign, or destroy objects of the class type. Objects are copied in several contexts, such as when we initialize a variable or when we pass or return an object by value (§ 6.2.1, p. 209, and § 6.3.2, p. 224). Objects are assigned when we use the assignment operator (§ 4.4, p. 144). Objects are destroyed when they cease to exist, such as when a local object is destroyed on exit from the block in which it was created (§ 6.1.1, p. 204). Objects stored in a vector (or an array) are destroyed when that vector (or array) is destroyed.

If we do not define these operations, the compiler will synthesize them for us.

##### Some Classes Cannot Rely on the Synthesized Versions

### 7.2 Access Control and Encapsulation

At this point, our class is not yet encapsulated—users can reach inside a `Sales_data` object and meddle with its implementation. In C++ we use **access specifiers** to enforce encapsulation:

* Members defined after a `public` specifier are accessible to all parts of the program. The `public` members define the interface to the class.
* Members defined after a `private` specifier are accessible to the member functions of the class but are not accessible to code that uses the class. The `private` sections encapsulate (i.e., hide) the implementation.

Redefining `Sales_data` once again, we now have

```c++
class Sales_data {
    public: // access specifier added
        Sales_data() = default;
        Sales_data(const std::string &s, unsigned n, double p):
        bookNo(s), units_sold(n), revenue(p*n) { }
        Sales_data(const std::string &s): bookNo(s) { }
        Sales_data(std::istream&);
        std::string isbn() const { return bookNo; }
        Sales_data &combine(const Sales_data&);

    private: // access specifier added
        double avg_price() const
        { return units_sold ? revenue/units_sold : 0; }
        std::string bookNo;
        unsigned units_sold = 0;
        double revenue = 0.0;
};
```

##### Using the `class` or `struct` Keyword

We can define a class type using either keyword. The only difference between `struct` and `class` is the default access level.

If we use the `struct` keyword, the members defined before the first access specifier are `public`; if we use `class`, then the members are `private`.

As a matter of programming style, when we define a class intending for all of its members to be `public`, we use `struct`. If we intend to have `private` members, then we use `class`.

#### 7.2.1 Friends

Now that the data members of `Sales_data` are `private`, our `read`, `print`, and `add` functions will no longer compile. The problem is that although these functions are part of the `Sales_data` interface, they are not members of the class.

A class can allow another class or function to access its nonpublic members by making that class or function a **friend**.  A class makes a function its friend by including a declaration for that function preceded by the keyword `friend`:

```c++
class Sales_data {
    // friend declarations for nonmember Sales_data operations added
    friend Sales_data add(const Sales_data&, const Sales_data&);
    friend std::istream &read(std::istream&, Sales_data&);
    friend std::ostream &print(std::ostream&, const Sales_data&);
    
    // other members and access specifiers as before
    public:
        Sales_data() = default;
        Sales_data(const std::string &s, unsigned n, double p):
        bookNo(s), units_sold(n), revenue(p*n) { }
        Sales_data(const std::string &s): bookNo(s) { }
        Sales_data(std::istream&);
        std::string isbn() const { return bookNo; }
        Sales_data &combine(const Sales_data&);
    
    private:
        std::string bookNo;
        unsigned units_sold = 0;
        double revenue = 0.0;
};

// declarations for nonmember parts of the Sales_data interface
Sales_data add(const Sales_data&, const Sales_data&);
std::istream &read(std::istream&, Sales_data&);
std::ostream &print(std::ostream&, const Sales_data&);
```

Friend declarations may appear only inside a class definition. Friends are not members of the class.

KEY CONCEPT: BENEFITS OF ENCAPSULATION

Encapsulation provides two important advantages:

* User code cannot inadvertently corrupt the state of an encapsulated object.

* The implementation of an encapsulated class can change over time without requiring changes in user-level code.

##### Declarations for Friends

A friend declaration only specifies access. It is not a general declaration of the function. If we want users of the class to be able to call a friend function, then we must also declare the function separately from the friend declaration. We usually declare each friend (outside the class) in the same header as the class itself.

### 7.3 Additional Class Features

#### 7.3.1 Class Members Revisited

##### Defining a Type Member

In addition to defining data and function members, a class can define its own local names for types. Type member can be either `public` or `private`:

```c++
class Screen {
    public:
        typedef std::string::size_type pos;
    private:
        pos cursor = 0;
        pos height = 0, width = 0;
        std::string contents;
};
```

Users of `Screen` shouldn't know that `Screen` uses a `string` to hold its data. We can equivalently use a type alias (§ 2.5.1, p. 68):

```c++
class Screen {
	public:
        using pos = std::string::size_type;
        // other members as before
};
```

Unlike ordinary members, members that define types must appear before they are used. As a result, type members usually appear at the beginning of the class.

##### Member Functions of class `Screen`

Here we add a constructor that will let users define the size and contents of the screen, along with members to move the cursor and to get the character at a given location:

```c++
class Screen {
    public:
        typedef std::string::size_type pos;
        Screen() = default; // needed because Screen has another constructor
        // cursor initialized to 0 by its in-class initializer
        Screen(pos ht, pos wd, char c): height(ht), width(wd), contents(ht * wd, c) { }
        char get() const { return contents[cursor]; } // get the character at the cursor; implicitly inline
        inline char get(pos ht, pos wd) const; // explicitly inline
        Screen &move(pos r, pos c); // can be made inline later
    private:
        pos cursor = 0;
        pos height = 0, width = 0;
        std::string contents;
};
```

Because we have provided a constructor that takes three arguments, the compiler will not automatically generate a default constructor for us. If our class is to have a default constructor, we must say so explicitly. In this case, we use `= default` to ask the compiler to synthesize the default constructor's definition for us (§ 7.1.4, p. 264).

##### Making Members `inline`

Classes often have small functions that can benefit from being inlined. As we've seen, member functions defined inside the class are automatically `inline` (§ 6.5.2, p. 238).

We can explicitly declare a member function as `inline` as part of its declaration inside the class body. Alternatively, we can specify `inline` on the function definition that appears outside the class body.

##### Overloading Member Functions

As with nonmember functions, member functions may be overloaded (§ 6.4, p. 230) so long as the functions differ by the number and/or types of parameters. 

##### `mutable` Data Members

It sometimes (but not very often) happens that a class has a data member that we want to be able to modify, even inside a `const` member function. We indicate such members by including the `mutable` keyword in their declaration.

A mutable data member is never `const`, even when it is a member of a `const` object. Any member functions, including `const` member functions, can change a `mutable` member. 

As an example, we give `Screen` a mutable member named `access_ctr`, which we'll use to track how often each `Screen` member function is called:

```c++
class Screen {
    public:
    	void some_member() const;
    private:
        mutable size_t access_ctr; // may change even in a const object
        // other members as before
    };

void Screen::some_member() const
    {
        ++access_ctr; // keep a count of the calls to any member function
        // whatever other work this member needs to do
	};
```

##### Initializers for Data Members of Class Type

Note: When we provide an in-class initializer, we must do so following an `=` sign or inside braces.

#### 7.3.2 Functions That Return `*this`

`return *this` means that the member function returns a reference of the object, not a copy of the object.

##### Returning `*this` from a `const` Member Function

Note: A `const` member function that returns `*this` as a reference should have a return type that is a reference to `const`.

##### Overloading Based on `const`

We can overload a member function based on whether it is `const` for the same reasons that we can overload a function based on whether a pointer parameter points to `const` (§ 6.4, p. 232). 

#### 7.3.3 Class Types

Every class defines a unique type. We can refer to a class type directly, by using the class name as a type name. Alternatively, we can use the class name following the keyword `class` or `struct`:

```c++
Sales_data item1; // default-initialized object of type Sales_data
class Sales_data item1; // equivalent declaration
```

The second method is inherited from C and is also valid in C++.

##### Class Declarations

Just as we can declare a function apart from its definition (§ 6.1.2, p. 206), we can also declare a class without defining it:

```c++
class Screen; // declaration of the Screen class
```

After a declaration and before a definition is seen, the type Screen is an incomplete type.

#### 7.3.4 Friendship Revisited

Our Sales_data class defined three ordinary nonmember functions as friends (§ 7.2.1, p. 269). A class can also make another class its friend or it can declare specific member functions of another (previously defined) class as friends. In addition, a friend function can be defined inside the class body. Such functions are implicitly `inline`.

##### Friendship between Classes

For example, our `Screen` class can designate `Window_mgr` class as its friend:

```c++
class Screen {
    // Window_mgr members can access the private parts of class Screen
    friend class Window_mgr;
    // ... rest of the Screen class
};
```

The member functions of a friend class can access all the members, including the nonpublic members, of the class granting friendship.

Friendship is not transitive. That is, if class `Window_mgr` has its own friends, those friends have no special access to `Screen`.

Note: Each class controls which classes or functions are its friends.

##### Making A Member Function a Friend

Rather than making the entire `Window_mgr` class a friend, `Screen` can instead specify that only some members in `Window_mgr` are allowed access. 

```c++
class Screen {
    // specifies Window_mgr::clear member as a friend; Window_mgr::clear must have been declared before class Screen
    friend void Window_mgr::clear(ScreenIndex);
    // ... rest of the Screen class
};
```

##### Overloaded Functions and Friendship

Overloaded functions are different functions. Therefore, a class must declare as a friend each function in a set of overloaded functions that it wishes to make a friend.

##### Friend Declarations and Scope

A friend declaration affects access but is not a declaration in an ordinary sense.

### 7.4 Class Scope

Every class defines its own new scope. Outside the class scope, ordinary data and function members may be accessed only through an object, a reference, or a pointer using a member access operator `->` (§ 4.6, p. 150). We access type members from the class using the scope operator `::`.

##### Scope and Members Defined outside the Class

#### 7.4.1 Name Lookup and Class Scope

Note: Member function definitions are processed after the compiler processes all of the declarations in the class.

##### Name Lookup for Class Member Declarations

##### Type Names Are Special

Tip: Definitions of type names by using `typedef` or `using` usually should appear at the beginning of a class.

##### Normal Block-Scope Name Lookup inside Member Definitions

A name used in the body of a member function is resolved as follows:

* Look for a declaration of the name inside the member function.
* Look for a declaration inside the class.
* Look for a declaration that is in scope before the member function definition.

Ordinarily, it is a bad idea to use the name of another member as the name for a parameter in a member function.

##### After Class Scope, Look in the Surrounding Scope

If the compiler doesn't find the name in function or class scope, it looks for the name in the surrounding scope.

Note: Even though the outer object is hidden, it is still possible to access that object by using the scope operator `::`.

##### Names Are Resolved Where They Appear within a File

### 7.5 Constructors Revisited

Constructors are a crucial part of any C++ class.

#### 7.5.1 Constructor Initializer List

```c++
Sales_data(const std::string &s, unsigned n, double p):
    bookNo(s), units_sold(n), revenue(p*n) { }
```

has the same effect as

```c++
// legal but sloppier way to write the Sales_data constructor: no constructor initializers
Sales_data::Sales_data(const string &s,
unsigned cnt, double price)
{
    bookNo = s;
    units_sold = cnt;
    revenue = cnt * price;
}
```

The difference is that the previous version initializes its data members, whereas this version assigns values to the data members. How significant this distinction is depends on the type of the data member. 

This distinction between initialization and assignment is exactly the same as the distinction between

```c++
string foo = "Hello World!"; // define and initialize
```

and

```c++
string bar; // default initialized to the empty string
bar = "Hello World!"; // assign a new value to bar
```

##### Constructor Initializers Are Sometimes Required

We can often, but not always, ignore the distinction between whether a member is initialized or assigned.

Note: We must use the constructor initializer list to provide values for members that are `const`, reference, or of a class type that does not have a default constructor.

ADVICE: USE CONSTRUCTOR INITIALIZERS

In many classes, the distinction between initialization and assignment is strictly a matter of low-level efficiency: A data member is initialized and then assigned when it could have been initialized directly. More important than the efficiency issue is the fact that some data members must be initialized. 

##### Order of Member Initialization

Members are initialized in the order in which they appear in the class definition.

Best Practice: It is a good idea to write constructor initializers in the same order as the members are declared. Moreover, when possible, avoid using members to initialize other members.

##### Default Arguments and Constructors

We can rewrite these constructors as a single constructor with a default argument (§ 6.5.1, p. 236):

```c++
class Sales_data {
    public:
        // defines the default constructor as well as one that takes a string argument
        Sales_data(std::string s = ""): bookNo(s) { }
        // remaining constructors unchanged
        Sales_data(std::string s, unsigned cnt, double rev):
        bookNo(s), units_sold(cnt), revenue(rev*cnt) { }
        Sales_data(std::istream &is) { read(is, *this); }
        // remaining members as before
};
```

Note: A constructor that supplies default arguments for all its parameters also defines the default constructor.

#### 7.5.2 Delegating Constructors

As an example, we rewrite the `Sales_data` class to use delegating constructors as follows:

```c++
class Sales_data {
    public:
        // nondelegating constructor initializes members from corresponding arguments
        Sales_data(std::string s, unsigned cnt, double price):
        bookNo(s), units_sold(cnt), revenue(cnt*price) { }
        // remaining constructors all delegate to another constructor
        Sales_data(): Sales_data("", 0, 0) { }
        Sales_data(std::string s): Sales_data(s, 0,0) { }
        Sales_data(std::istream &is): Sales_data() { read(is, *this); }
        // other members as before
};
```

#### 7.5.3 The Role of the Default Constructor

The default constructor is used automatically whenever an object is default or value initialized. 

Best Practice: In practice, it is almost always right to provide a default constructor if other constructors are being defined.

##### Using the Default Constructor

WARNNING: It is a common mistake among programmers new to C++ to try to declare an object initialized with the default constructor as follows:

```c++
Sales_data obj(); // oops! declares a function, not an object
Sales_data obj2; // ok: obj2 is an object, not a function
```

#### 7.5.4 Implicit Class-Type Conversions

Classes can define implicit conversions.

##### Only One Class-Type Conversion Is Allowed

In § 4.11.2 (p. 162) we noted that the compiler will automatically apply only one class-type conversion.

##### Class-Type Conversions Are Not Always Useful

##### Suppressing Implicit Conversions Defined by Constructors

##### `explicit` Constructors Can Be Used Only for Direct Initialization

##### Explicitly Using Constructors for Conversions

##### Library Classes with `explicit` Constructors

#### 7.5.5 Aggregate Classes

An aggregate class gives users direct access to its members and has special initialization syntax. 

For example, the following class is an aggregate:

```c++
struct Data {
    int ival;
    string s;
};
```

We can initialize the data members of an aggregate class by providing a braced list of member initializers:

```c++
// val1.ival = 0; val1.s = string("Anna")
Data val1 = { 0, "Anna" };
```

As with initialization of array elements (§ 3.5.1, p. 114), if the list of initializers has fewer elements than the class has members, the trailing members are value initialized (§ 3.5.1, p. 114).

#### 7.5.6 Literal Classes

An aggregate class (§ 7.5.5, p. 298) whose data members are all of literal type is a literal class. A nonaggregate class, that meets the following restrictions, is also a literal class: ...

##### `constexpr` Constructors

### 7.6 `static` Class Members

Classes sometimes need members that are associated with the class, rather than with individual objects of the class type. For example, a bank account class might need a data member to represent the current prime interest rate. In this case, we'd want to associate the rate with the class, not with each individual object. From an efficiency standpoint, there'd be no reason for each object to store the rate. Much more importantly, if the rate changes, we'd want each object to use the new value.

##### Declaring `static` Members

We say a member is associated with the class by adding the keyword `static` to its declaration.

As an example, we'll define a class to represent an account record at a bank:

```c++
class Account {
    public:
        void calculate() { amount += amount * interestRate; }
        static double rate() { return interestRate; }
        static void rate(double);
    private:
        std::string owner;
        double amount;
        static double interestRate;
        static double initRate();
};
```

The `static` members of a class exist outside any object. Objects do not contain data associated with `static` data members. Thus, each Account object will contain two data members—`owner` and `amount`. There is only one `interestRate` object that will be shared by all the `Account` objects. 

Similarly, static member functions are not bound to any object; they do not have a `this` pointer. As a result, `static` member functions may not be declared as `const`.

##### Using a Class `static` Member

We can access a `static` member directly through the scope operator `::`:

```c++
double r;
r = Account::rate();
```

Even though `static` members are not part of the objects of its class, we can use an object, reference, or pointer of the class type to access a `static` member:

```c++
Account ac1;
Account *ac2 = &ac1;
// equivalent ways to call the static member rate function
r = ac1.rate(); // through an Account object or reference
r = ac2->rate(); // through a pointer to an Account object
```

Member functions can use `static` members directly, without the scope operator:

```c++
class Account {
    public:
    	void calculate() { amount += amount * interestRate; }
    private:
        static double interestRate;
        // remaining members as before
};
```

##### Defining `static` Members

As with any other member function, we can define a `static` member function inside or outside of the class body. The `static` keyword, however, is used only on the declaration inside the class body.

```c++
void Account::rate(double newRate)
{
    interestRate = newRate;
}
```

Because `static` data members are not part of individual objects of the class type, they are not defined when we create objects of the class. As a result, they are not initialized by the class' constructors. Moreover, in general, we may not initialize a `static` member inside the class. Instead, we must define and initialize each `static` data member outside the class body:

```c++
// define and initialize a static class member
double Account::interestRate = initRate();
```

Tip: The best way to ensure that the object is defined exactly once is to put the definition of `static` data members in the same file that contains the definitions of the class noninline member functions.

##### In-Class Initialization of `static` Data Members

##### `static` Members Can Be Used in Ways Ordinary Members Can't

Two difference between `static` and ordinary members:

* A `static` data member can have incomplete type (§ 7.3.3, p. 278).

* A `static` member can be used as a default argument.

### Chapter Summary

Classes are the most fundamental feature in C++. Classes let us define new types for our applications, making our programs shorter and easier to modify.

Data abstraction—the ability to define both data and function members—and encapsulation—the ability to protect class members from general access—are fundamental to classes. We encapsulate a class by defining its implementation members as `private`. Classes may grant access to their non`public` member by designating another class or function as a friend.

Classes may define constructors, which are special member functions that control how objects are initialized. Constructors may be overloaded. Constructors should use a constructor initializer list to initialize all the data members.

Classes may also define `mutable` or `static` members. A `mutable` member is a data member that is never `const`; its value may be changed inside a `const` member function. A `static` member can be either function or data; `static` members exist independently of the objects of the class type.

### Defined Terms

**abstract data type** Data structure that encapsulates (hides) its implementation.

**class** C++ mechanism for defining our own abstract data types. Classes may have data, function, or type members. A class defines a new type and a new scope.

**data abstraction** Programming technique that focuses on the interface to a type. Data abstraction lets programmers ignore the details of how a type is represented and think instead about the operations that the type can perform. Data abstraction is fundamental to both object-oriented and generic programming.

**encapsulation** Separation of implementation from interface; encapsulation hides the implementation details of a type. In C++, encapsulation is enforced by putting the implementation in the `private` part of a class.

**implementation** The (usually `private`) members of a class that define the data and any operations that are not intended for use by code that uses the type.

**interface** The (`public`) operations supported by a type. Ordinarily, the interface does not include data members.

The other terms are also important. Read p. 305~306 for detail.

<br>

## References

Lippman, Stanley B., Josée Lajoie, and Barbara E. Moo. *C++ Primer*. Addison-Wesley Professional, 2012. 

