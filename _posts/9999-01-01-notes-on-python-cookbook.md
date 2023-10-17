---
layout: post
title:  "Notes on Python Cookbook"
date: 9999-01-01
categories: CS
tags: [Python]
toc: true
published: true
hidden: false
comments: true
---

## Chapter 1. Data Structures and Algorithms

### 1.2. Unpacking Elements from Iterables of Arbitrary Length

```python
>>> record = ('Dave', 'dave@example.com', '773-555-1212', '847-555-1212')
>>> name, email, *phone_numbers = user_record
```

### 1.4. Finding the Largest or Smallest N Items

The `heapq` module has two functions—`nlargest()` and `nsmallest()`.

### 1.6. Mapping Keys to Multiple Values in a Dictionary

```python
d = {}
for key, valuein pairs:
    if key not in d:
        d[key] = []
    d[key].append(value)
```

To easily construct such dictionaries, you can use `defaultdict` in the `collections` module. A feature of `defaultdict` is that it automatically initializes the first value so you can simply focus on adding items.

```python
from collections import defaultdict
d = defaultdict(list)
for key, value in pairs:
    d[key].append(value)
```

### 1.7. Keeping Dictionaries in Order

Use an `OrderedDict` from the collections module. It exactly preserves the original insertion order of data when iterating. 

An `OrderedDict` internally maintains a doubly linked list that orders the keys according to insertion order. When a new item is first inserted, it is placed at the end of this list.

Be aware that the size of an `OrderedDict` is more than twice as large as a normal dictionary due to the extra linked list that’s created.

### 1.8. Calculating with Dictionaries

Be aware that `zip()` creates an iterator that can only be consumed once. For example, the following code is an error:

```python
prices_and_names = zip(prices.values(), prices.keys())
print(min(prices_and_names)) # OK
print(max(prices_and_names)) # ValueError: max() arg is an empty sequence
```

### 1.9. Finding Commonalities in Two Dictionaries

```python
# Find keys in common
a.keys() & b.keys()
# Find keys in a that are not in b
a.keys() - b.keys()
# Find (key, value) pairs in common
a.items() & b.items()
```

### 1.11. Naming a Slice

### 1.12. Determining the Most Frequently Occurring Items in a Sequence

Use the `most_common()` method in the `collections.Counter` class.

### 1.16. Filtering Sequence Elements

Use the built-in `filter()` function for a complicated filtering criteria. `filter()` creates an iterator.

### 1.18. Mapping Names to Sequence Elements

We can access list or tuple elements by name. `collections.namedtuple()` provides these benefits, while adding minimal overhead over using a normal tuple object. `collections.namedtuple()` is actually a factory method that returns a subclass of the standard Python `tuple` type.

```python
>>> from collections import namedtuple
>>> Subscriber = namedtuple('Subscriber', ['addr','joined'])
>>> sub = Subscriber('jonesy@example.com', '2012-10-19')
>>> sub
Subscriber(addr='jonesy@example.com', joined='2012-10-19')
>>> sub.addr
'jonesy@example.com'
```

It is inter‐changeable with a tuple and supports all of the usual tuple operations such as indexing and unpacking.

One possible use of a `namedtuple` is as a **replacement for a dictionary**, which requires more space to store.

## Chapter 2. Strings and Text

### 2.13. Aligning Text Strings

```python
>>> text = 'Hello World'
>>> format(text, '>20') # right aligned
'         Hello World'
>>> format(text, '<20') # left aligned
'Hello World         '
>>> format(text, '^20') # center aligned
'    Hello World     '
>>> format(text, '*>20s') # right aligned
'*********Hello World'
>>> format(text, '*^20s') # center aligned
'****Hello World*****'
```

### 2.14. Combining and Concatenating Strings

Using the `+` operator to join a lot of strings together is grossly inefficient due to the memory copies and garbage collection that occurs.

### 2.15. Interpolating Variables in Strings

```python
>>> s = '{name} has {n} messages.'
>>> s.format(name='Guido', n=37)
'Guido has 37 messages.'
```

## Chapter 3. Numbers, Dates, and Times

### 3.2. Performing Accurate Decimal Calculations

Floating-point numbers cannot accurately represent all base-10 decimals. Moreover, even simple mathematical calculations introduce small errors. For example:

```python
>>> 0.1 + 0.2
0.30000000000000004
>>> 0.1 + 0.2 == 0.3
False
```

These errors are a "feature" of the underlying CPU and the IEEE 754 arithmetic performed by its floating-point unit. You cannot avoid such errors with `float` instances.

You can use `decimal` module to avoid these errors, although you will give up some performance.

```python
>>> Decimal('0.1') + Decimal('0.2') == Decimal('0.3')
True
```

The `decimal` module implements IBM's "General Decimal Arithmetic Specification."

### 3.9. Calculating with Large Numerical Arrays

For any heavy computation involving arrays, use the NumPy library. The major feature of NumPy is that it gives Python an array object that is much more efficient and better suited for mathematical calculation than a standard Python list. 

```python
>>> def f(x):
...     return x**2 + 1
... 
>>> arr = np.array([1, 2, 3, 4])
>>> f(arr)
array([ 2,  5, 10, 17])
```

The fact that math operations apply to all of the elements simultaneously makes it very easy and fast to compute functions across an entire array. 

NumPy provides a collection of "universal functions" that also allow for array operations. These are replacements for similar functions normally found in the math module. For example:

```python
>>> np.sin(arr)
array([ 0.84147098,  0.90929743,  0.14112001, -0.7568025 ])
```

Using universal functions can be hundreds of times faster than looping over the array elements one at a time and performing calculations using functions in the `math` module.

Under the covers, NumPy arrays are allocated in the same manner as in C or Fortran. Namely, they are large, contiguous memory regions consisting of a homogenous data type. Because of this, it's possible to make arrays much larger than anything you would normally put into a Python list. 

### 3.10. Performing Matrix and Linear Algebra Calculations

Use `np.matrix` and `np.linalg`.

## Chapter 4. Iterators and Generators

Iteration is one of Python's strongest features. 

### 4.1. Manually Consuming an Iterator

In most cases, the `for` statement is used to consume an `iterable`. 

An example of the basic mechanics of what happens during iteration:

```python
>>> items = [1, 2] # an iterable
>>> it = iter(items) # get an iterator by invoking items.__iter__()
>>> next(it) # run the iterator by invoking it.__next__()
1
>>> next(it)
2
>>> next(it)
Traceback (most recent call last):
 File "<stdin>", line 1, in <module>
StopIteration
```

### 4.2. Delegating Iteration

Define an `__iter__()` method to delegates iteration.

```python
class IterEg:
    def __init__(self):
        self._my_iterable = [1, 2, 3]
    
    def __iter__(self):
        # equivalent to "return self._my_iterable.__iter__()"
        return iter(self._my_iterable) 
    
for x in ItrEg():
    print(x)
# output:
# 1
# 2
# 3
```

### 4.3. Creating New Iteration Patterns with Generators

The mere presence of the `yield` statement in a function turns it into a generator.

```python
# A generator that produces a range of floating-point numbers
def frange(start, stop, increment):
    x = start
    while x < stop:
        yield x
        x += increment

g = frange(0, 2, 0.5) # Create a generator
print(next(g)) # output: 0
print(next(g)) # output: 0.5
for x in g:
    print(x)
# output:
# 1
# 1.5
next(g) # Exception: StopIteration
```

Generator is a special iterator. To use it, you iterate over it using a `for` loop or use it with some other function that consumes an iterable (e.g., `sum()`, `list()`, etc.). A generator only runs in response to "next" operations carried out in iteration. Once a generator function returns, iteration stops. 

### 4.4. Implementing the Iterator Protocol

Python's iterator protocol requires `__iter__()` to return a special iterator object that implements a `__next__()` operation and uses a `StopIteration` exception to signal completion. However, implementing such objects can often be a messy affair. By far, the easiest way to implement a iterator is to use a generator function.

### 4.5. Iterating in Reverse

Use the built-in `reversed()` function. It costs much less memory than `[::-1]`, because `[::-1]` creates a new `list` object and copy all elements from the previous `list` to the new one. 

Reversed iteration only works if the object in question has a size that can be determined, or if the object implements a `__reversed__()` special method. For example, `list` object satisfies both conditions, `str` object satisfies the first condition, and objects like generators, files (e.g. `open("somefile")`) doesn't satisfy any condition.

### 4.7. Taking a Slice of an Iterator

Use the `itertools.islice()` function for taking slices of iterators and
generators. 

Iterators and generators can't normally be sliced, because no information is known about their length (and they don't implement indexing). 

### 4.8. Skipping the First Part of an Iterable

Use the `itertools.dropwhile()` function. 

### 4.9. Iterating Over All Possible Combinations or Permutations

Use the `itertools.permutations()`, `itertools.combinations()`, and `combinations_with_replacement()` functions.

### 4.11. Iterating Over Multiple Sequences Simultaneously

`zip()` is commonly used to pair data together. `zip()` creates an iterator as a result.

### 4.12. Iterating on Items in Separate Containers

`itertools.chain()` accepts one or more iterables as arguments. It then works by creating an iterator that successively consumes and returns the items produced by each of the supplied iterables you provided. 

```python
>>> from itertools import chain
>>> a = [1, 2] # or other iterables like {1, 2}
>>> b = ['x', 'y'] 
>>> for x in chain(a, b):
...     print(x)
... 
1
2
x
y
```

`chain()` is more efficient with memory than first combining the sequences and iterating: `for x in a + b:`, because the operation a + b creates an entirely new sequence. In addition, `a + b` requires `a` and `b` to be of the same type, but `chain()` does not.

### 4.13. Creating Data Processing Pipelines

### 4.14. Flattening a Nested Sequence

```python
from collections import Iterable

def flatten(items, ignore_types=(str, bytes)):
    for x in items:
        if isinstance(x, Iterable) and not isinstance(x, ignore_types):
            yield from flatten(x)
        else:
            yield x

items = ['ab', ['cd', 'ef', ['gh', 'ij'], 'kl'], 'mn']
# Produces 'ab', 'cd', 'ef', 'gh', 'ij', 'kl', 'mn'
for x in flatten(items):
    print(x)
```

The `yield from` statement is used to write generators that call other generators as subroutines. Here, `yield from flatten(x)` is equivalent to `for i in flatten(x): yield i`.

### 4.15. Iterating in Sorted Order Over Merged Sorted Iterables

Use the `heapq.merge()` function.

### 4.16. Replacing Infinite while Loops with an Iterator

`iter()` function accepts callable and sentinel (terminating) value as inputs. Read the corresponding section of the book and also `help(iter)` for detail.

## Chapter 5. Files and I/O

### 5.1. Reading and Writing Text Data

### 5.2. Printing to a File

```python
with open('somefile.txt', 'rt') as f:
    print('Hello World!', file=f)
```

### 5.3. Printing with a Different Separator or Line Ending

Use the `sep` and `end` keyword arguments to `print()`.

```python
>>> print('ACME', 50, 91.5, sep=', ')
ACME, 50, 91.5
```

Or equivalently,

```python
>>> row = ('ACME', 50, 91.5)
>>> print(*row, sep=', ')
ACME, 50, 91.5
```

### 5.6. Performing I/O Operations on a String

### 5.7. Reading and Writing Compressed Datafiles

Read or write data in a file with `gzip` or `bz2` compression.

### 5.19. Making Temporary Files and Directories

Use the `TemporaryFile()`, `NamedTemporaryFile()`, and `TemporaryDirectory()` functions in the `tempfile` module.

### 5.21. Serializing Python Objects

Use the `pickle` module.

## Chapter 6. Data Encoding and Processing

### 6.4. Parsing Huge XML Files Incrementally

Any time you are faced with the problem of  incremental data processing, you should think of iterators and generators.

### 6.12. Reading Nested and Variable-Sized Binary Structures

The `struct` module can be used to decode and encode almost any kind of binary data structure.

## Chapter 7. Functions

### 7.1. Writing Functions That Accept Any Number of Arguments

```python
def anyargs(*args, **kwargs):
    print(args) # A tuple
    print(kwargs) # A dict
```

### 7.2. Writing Functions That Only Accept Keyword Arguments

Keyword-only arguments are often a good way to enforce greater code clarity when specifying optional function arguments.

Place the keyword arguments after a `*` argument or a single unnamed `*`.

```python
def recv(maxsize, *, block):
    # Receives a message
    pass

recv(1024, True) # TypeError
recv(1024, block=True) # Ok
```

Specify keyword arguments for functions that accept
a varying number of positional arguments.

```python
def mininum(*values, clip=None):
    m = min(values)
    return m if clip is None else max(m, clip)

minimum(1, 5, 2, -5, 10) # Returns -5
minimum(1, 5, 2, -5, 10, clip=0) # Returns 0
```

### 7.3. Attaching Informational Metadata to Function Arguments

```python
>>> def add(x:int, y:int) -> int:
...     return x + y
...
>>> help(add)
Help on function add in module __main__:
add(x: int, y: int) -> int
>>> add.__annotations__
{'y': <class 'int'>, 'return': <class 'int'>, 'x': <class 'int'>}
```

Function annotations are merely stored in a function's `__annotations__` attribute.

### 7.5. Defining Functions with Default Arguments

The values assigned as defaults should always be immutable objects.

```python
# no
def func(a, b=[]):
    ...

# ok
def func(a, b=None):
    if b is None:
        b = []
    ...
```

### 7.7. Capturing Variables in Anonymous Functions

```python
>>> x = 10
>>> func = lambda y: x + y
>>> func(1)
11
>>> x = 15
>>> func(1)
16
```

```python
>>> funcs = [lambda x: x+n for n in range(3)]
>>> for f in funcs:
...     print(f(0))
...
4
4
4
```

The problem here is that the value of `x` used in the `lambda` expression is a free variable that gets bound at runtime, not definition time. Thus, the value of `x` in the `lambda` expressions is whatever the value of the `x` variable happens to be at the time of execution. 

If you want an anonymous function to capture a value at the point of definition and keep it, include the value as a default value, like this:

```python
>>> x = 10
>>> func = lambda y, x=x: x + y
>>> x = 20
>>> func(1)
11
```

```python
>>> funcs = [lambda x, n=n: x+n for n in range(5)]
>>> for f in funcs:
...     print(f(0))
...
0
1
2
```

### 7.8. Making an N-Argument Callable Work As a Callable with Fewer Arguments

If you need to reduce the number of arguments to a function, you should use `functools.partial()`. For example,

```python
>>> def spam(a, b, c, d):
...     print(a, b, c, d)
>>> from functools import partial
>>> s1 = partial(spam, 1) # a = 1
>>> s1(4, 5, 6)
1 4 5 6
>>> s2 = partial(spam, d=8) # d = 8
>>> s2(1, 2, 3)
1 2 3 8
>>> s3 = partial(spam, 1, d=8) # a = 1, d = 8
>>> s3(1, 2, 3)
1 2 3 8
```

### 7.9. Replacing Single Method Classes with Functions

Simply stated, a closure is just a function, but with an extra environment of the variables that are used inside the function. A key feature of a closure is that it remembers the environment in which it was defined. 

### 7.10. Carrying Extra State with Callback Functions

There are really two main approaches that are useful for capturing and carrying state. You can carry it around on an instance (attached to a bound method perhaps) or you can carry it around in a closure (an inner function). 

### 7.11. Inlining Callback Functions

### 7.12. Accessing Variables Defined Inside a Closure

## Chapter 8. Classes and Objects

Topics in this chapter include making objects support common Python features, usage of special methods, encapsulation techniques, inheritance, memory management, and useful design patterns.

### 8.1. Changing the String Representation of Instances

Defining `__repr__()` and `__str__()` can simplify debugging and instance output. 

```python
class Pair:
    def __init__(self, x, y):
        self.x = x
        self.y = y
    def __repr__(self):
        # or equivalently: return 'Pair(%r, %r)' % (self.x, self.y)
        return 'Pair({0.x!r}, {0.y!r})'.format(self)
    def __str__(self):
        return '({0.x!s}, {0.y!s})'.format(self)
```

The `__repr__()` method returns the code representation of an instance, and is usually the text you would type to re-create the instance. The built-in `repr()` function returns this text, as does the interactive interpreter when inspecting values. It is standard practice for the output of `__repr__()` to produce text such that `eval(repr(x)) == x`.  If this is not possible or desired, then it is common to create a useful textual representation enclosed in `<` and `>` instead. For example:

```python
>>> f = open('file.dat')
>>> f
<_io.TextIOWrapper name='file.dat' mode='r' encoding='UTF-8'>
```

The `__str__()` method converts the instance to a string, and is the output produced by the `str()` and `print()` functions.

If no `__str__()` is defined, the output of `__repr__()` is used as a fallback.

The special `!r` formatting code uses the output of `__repr__()`, while `!s` uses `__str__()`.

```python
>>> p = Pair('hello', 123)
>>> p
Pair('hello', 123) # __repr__() output
>>> print(p)
(hello, 123) # __str__() output
```

### 8.4. Saving Memory When Creating a Large Number of Instances

For classes that primarily serve as simple data structures, you can often greatly reduce the memory footprint of instances by adding the `__slots__` attribute to the class definition. For example:

```python
class Date:
    __slots__ = ['year', 'month', 'day']
    def __init__(self, year, month, day):
        self.year = year
        self.month = month
        self.day = day
```

When you define `__slots__`, Python uses a much more compact internal representation for instances. Instead of each instance consisting of a dictionary, instances are built around a small fixed-sized array, much like a tuple or list. Attribute names listed in the `__slots__` specifier are internally mapped to specific indices within this array. A side effect of using slots is that it is no longer possible to add new attributes to instances—you are restricted to only those attribute names listed in the `__slots__` specifier.

For the most part, you should only use slots on classes that are going to serve as frequently used data structures in your program (e.g., if your program created millions of instances of a particular class).

### 8.5. Encapsulating Names in a Class

Attributes (e.g. `self.__private`) or methods (e.g. `__private_method()`) with double leading underscores are hidden from subclasses cannot be overridden via inheritance.

Use a single trailing underscore to define a variable to avoid clash with  a reserved word. For example,

```python
lambda_ = 2.0 # Trailing _ to avoid clash with lambda keyword
```

### 8.6. Creating Managed Attributes

Use the `property` to add extra processing (e.g., type checking or validation) to the getting or setting of an instance attribute.

### 8.7. Calling a Method on a Parent Class

Use the `super()` function.

### 8.8. Extending a Property in a Subclass

### 8.9. Creating a New Kind of Class or Instance Attribute

A descriptor is a class that implements the three core attribute access operations (get, set, and delete) in the form of `__get__()`, `__set__()`, and `__delete__()` special methods. 

By defining a descriptor, you can capture the core instance operations (get, set, delete) at a very low level and completely customize what they do (e.g., add type checking or validation). This gives you great power, and is one of the most important tools employed by the writers of advanced libraries and frameworks.

Finally, it should be stressed that you would probably not write a descriptor if you simply want to customize the access of a single attribute of a specific class. For that, it’s easier to use a property instead, as described in Recipe 8.6. Descriptors are more useful in situations where there will be a lot of code reuse (i.e., you want to use the functionality provided by the descriptor in hundreds of places in your code or provide it as a library feature).

### 8.10. Using Lazily Computed Properties

### 8.11. Simplifying the Initialization of Data Structures

You are writing a lot of classes that serve as data structures, but you are getting tired of writing highly repetitive and boilerplate `__init__()` functions.

You can often generalize the initialization of data structures into a single `__init__()` function defined in a common base class. For example:

```python
class Structure2:
    _fields = []

    def __init__(self, *args, **kwargs):
        if len(args) > len(self._fields):
            raise TypeError('Expected {} arguments'.format(len(self._fields)))

        # Set all of the positional arguments
        for name, value in zip(self._fields, args):
            setattr(self, name, value)

        # Set the remaining keyword arguments
        for name in self._fields[len(args):]:
            setattr(self, name, kwargs.pop(name))

        # Check for any remaining unknown arguments
        if kwargs:
            raise TypeError('Invalid argument(s): {}'.format(','.join(kwargs)))

# Example use
if __name__ == '__main__':
    class Stock(Structure2):
        _fields = ['name', 'shares', 'price']

    s1 = Stock('ACME', 50, 91.1)
    s2 = Stock('ACME', 50, price=91.1)
    s3 = Stock('ACME', shares=50, price=91.1)
```

### 8.12. Defining an Interface or Abstract Base Class

Predefined abstract base classes are found in various places in the standard library. The collections module defines a variety of ABCs related to containers and iterators (se‐quences, mappings, sets, etc.), the numbers library defines ABCs related to numeric objects (integers, floats, rationals, etc.), and the io library defines ABCs related to I/O handling.

You can use the predefined ABCs to perform more generalized kinds of type checking. Here are some examples:

```python
isinstance(x, collections.abc.Sequence)
isinstance(x, collections.abc.Iterable)
isinstance(x, collections.abc.Sized)
isinstance(x, collections.abc.Mapping)
```

### 8.13. Implementing a Data Model or Type System

You can use descriptors, mixin classes, `super()`, class decorators, and metaclasses to enforce constraints on the values that are allowed to be assigned to certain attributes.

### 8.14. Implementing Custom Containers

The collections library defines a variety of abstract base classes that are extremely useful when implementing custom container classes. To illustrate, suppose you want your class to support iteration. To do that, simply start by having it inherit from `collections.abc.Iterable`, as follows:

```python
import collections

class A(collections.abc.Iterable):
    ...
```

### 8.15. Delegating Attribute Access

Simply stated, delegation is a programming pattern where the responsibility for implementing a particular operation is handed off (i.e., delegated) to a different object. 

The `__getattr__()` method is kind of like a catch-all for attribute lookup. It’s a method that gets called if code tries to access an attribute that doesn't exist. 

Delegation is sometimes used as an alternative to inheritance. This use of delegation is often useful in situations where direct inheritance might not make much sense or where you want to have more control of the relationship between objects (e.g., only exposing certain methods, implementing interfaces, etc.).

```python
class Proxy:
    """Forbiden accessing private attributes"""
    def __init__(self, obj):
        self._obj = obj
    
    # Delegate attribute lookup to internal obj
    def __getattr__(self, name):
        if name.startswith('_'):
            raise AttributeError('Cannot access a private attribute')
        return getattr(self._obj, name)

            
class Spam:
    def __init__(self):
        self.a = 'a'
        self._a = '_a'
    
    def bar(self):
        print('bar')
        
    def _bar(self):
        print('_bar')
        

s = Spam()  # Create an instance
p = Proxy(s)  # Create a proxy around it

print(p.a)  # Output: a
p.bar()  # Output: bar
print(p._a)  # AttributeError: Cannot access a private attribute
p._bar()  # AttributeError: Cannot access a private attribute
```

### 8.16. Defining More Than One Constructor in a Class
