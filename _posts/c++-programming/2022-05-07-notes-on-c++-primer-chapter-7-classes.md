---
layout: post
title: "Notes on \"C++ Primer\": Chapter 7. Classes"
date: 2022-05-07
categories: CS
tags: [C++]
toc: true
comments: true
published: true
hidden: true
---

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

