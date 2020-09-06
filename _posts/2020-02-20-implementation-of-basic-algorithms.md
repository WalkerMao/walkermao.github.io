---
layout: post
title:  "Implementation of Basic Algorithms"
date: 2020-02-20
categories: cs
comments: true
---

### Binary Search

```python
def binarySearch(seq: list, target: int) -> int:
    """
    This function returns the index of the first founded element in seq that equals to target.
    """
    if target < seq[0] or target > seq[-1]:
        return -1

    low = 0
    upp = len(seq) - 1

    while low <= upp:
        mid = (low + upp) // 2
        if seq[mid] < target:
            low = mid + 1
        elif seq[mid] > target:
            upp = mid - 1
        else:
            return mid

    return -1
```

```python
def binarySearch(seq: list, target: int) -> int:
    """
    If there are more than one elements in seq that equal to target, this function returns the lowest index.
    """
    if target < seq[0] or target > seq[-1]:
        return -1

    low = 0
    upp = len(seq) - 1

    while low < upp:
        mid = (low + upp) // 2
        if seq[mid] < target:
            low = mid + 1
        else:
            upp = mid
    
    if seq[low] == target:
        return low
    else:
        return -1
```

```python
def binarySearch(seq: list, target: int) -> int:
    """
    If there are more than one elements in seq that equal to target, this function returns the highest index.
    """
    if target < seq[0] or target > seq[-1]:
        return -1

    low = 0
    upp = len(seq) - 1

    while low < upp:
        mid = (low + upp) // 2 + 1
        if seq[mid] > target:
            upp = mid - 1
        else:
            low = mid
    
    if seq[low] == target:
        return low
    else:
        return -1
```

