---
layout: post
title:  "Implementation of Basic Algorithms in Python"
date: 2020-02-20
categories: CS
tags: [Algorithms in CS, Programming]
comments: true
hidden: true
---

## Binary Search

### Return the First Founded

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

### Return the Lowest Index

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

### Return the Highest Index

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

## Sorting Algorithms

### Merge Sort on Linked List

```python
class ListNode(object):
    def __init__(self, x):
        self.val = x
        self.next = None
        
class Solution:
    def sortList(self, head: ListNode) -> ListNode:
        if not head or not head.next:
            return head
        slow, fast = head, head.next
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
        second = slow.next
        slow.next = None
        l = self.sortList(head)
        r = self.sortList(second)
        return self.merge(l, r)
    
    def merge(self, l: ListNode, r: ListNode) -> ListNode:
        if not l or not r:
            return l or r
        if l.val > r.val:
            l, r = r, l
        # get the return node "head"
        head = pre = l
        l = l.next
        while l and r:
            if l.val < r.val:
                l = l.next
            else:
                nxt = pre.next
                pre.next = r
                tmp = r.next
                r.next = nxt
                r = tmp
            pre = pre.next
        # l and r at least one is None
        pre.next = l or r
        return head
```

### Quick-Sort on Array

```python
def partition(arr: list, start: int, end: int) -> int:
    """returns the partition index"""
    j = start
    for i in range(start, end):
        # use arr[end] as pivot
        if arr[i] < arr[end]:
            # swap to make the elements in arr[:j] be smaller than pivot
            arr[j], arr[i] = arr[i], arr[j]
            j += 1
    arr[j], arr[end] = arr[end], arr[j]
    # now the elements in arr[:j] are smaller than arr[j],
    # and the elements in arr[j+1:] are larger than arr[j]
    return j

# another partition method
def partition(arr: list, start: int, end: int) -> int:
    """returns the partition index"""
    i, j = start, end # left index i, and right index j
    # use arr[end] as pivot
    while i < j:
        # find i that makes arr[i] >= pivot
        while i < j and arr[i] < arr[end]:
            i += 1
        # find j that makes arr[j] < pivot
        while i < j and arr[j] >= arr[end]:
            j -= 1
        # swap left large element arr[i] and right small element arr[j]
        arr[i], arr[j] = arr[j], arr[i]
    # now i == j, swap pivot and arr[j]
    arr[end], arr[j] = arr[j], arr[end]
    # now the elements in arr[:j] are < arr[j],
    # and the elements in arr[j+1:] are >= arr[j]
    return j
```

```python
def quicksort(arr: list) -> list:
    """in-place quicksort function"""
    
    def helper(arr: list, start: int, end: int) -> None:
        """recursive helper"""
        if start >= end: return None
        j = partition(arr, start, end) # partition index
        helper(arr, start, j-1) # sort the left part arr[:j]
        helper(arr, j+1, end) # sort the right part arr[j+1:]
    
    helper(arr, 0, len(arr)-1)
```

### Quick Sort on Linked List

```python
# Definition for singly-linked list.
class ListNode(object):
    def __init__(self, x):
        self.val = x
        self.next = None

class Solution(object):
    def sortList(self, node):
        if not node or not node.next:
            return node
        pivot = node
        node = node.next
        pivot.next = None
        left = dummyLeft = ListNode(None)
        right = dummyRight = ListNode(None)
        
        while node:
            if node.val < pivot.val:
                left.next = node 
                left = left.next
            else:
                right.next = node
                right = right.next
            node = node.next
        left.next = None
        right.next = None
        
        headLeft = self.sortList(dummyLeft.next)
        
        if not headLeft:
            headLeft = pivot
        else:
            tailLeft = headLeft
            while tailLeft.next: 
                tailLeft = tailLeft.next
            tailLeft.next = pivot
        pivot.next = self.sortList(dummyRight.next) 
        
        return headLeft
```

### Counting Sort on Array

```python
def countingSort(input: list, k: int) -> list:
    count = k * [0]
    for x in input:
        count[key(x)] += 1
    for j in range(1, k):
        count[j] += count[j-1]
    output = len(input) * [None]
    for x in input[::-1]:
        count[key(x)] -= 1
        output[count[key(x)]] = x
    return output
```

### Radix Sort on Array

```python
# use the bucket sort internally.
def radixSort(self, nums: list) -> int:
    # Convert nums list to reversed bit array list
    nums = [bin(num)[2:][::-1] for num in nums] 
    for i in range(max(map(len, nums))):
        nums0 = [x for x in nums if i >= len(x) or x[i] == '0']
        nums1 = [x for x in nums if i < len(x) and x[i] == '1']
        # it will only have two buckets (0, 1) in radix sort.
        nums = nums0 + nums1
    # convert the number back to base 10 integer. 
    output = [int(num[::-1], 2) for num in nums]
    return output
```

## Traversal

### Binary Tree Traversals

- Preorder: node -> left -> right;

- Inorder: left -> node -> right;

- Postorder: left -> right -> node.

```python
# definition for a binary tree node.
class TreeNode:
    def __init__(self, x):
        self.val = x
        self.left = None
        self.right = None

# traverse a binary tree recursively.
def traverseTreeRecursively(self, root: TreeNode) -> tuple:
    preorder, inorder, postorder = list(), list(), list()
    def recursion(node: TreeNode):
        if node:
            preorder.append(node.val) # preorder traversal
            recursion(node.left)
            inorder.append(node.val) # inorder traversal
            recursion(node.right)
            postorder.append(node.val) # postorder traversal

        recursion(root)
        return preorder, inorder, postorder
```

### Combinations by BFS or DFS

```python
# Example input: [[1, 2], [3, 4, 5], [6]].
# Example output: [[1, 3, 6], [1, 4, 6], [1, 5, 6], [2, 3, 6], [2, 4, 6], [2, 5, 6]].
```

```python
# method1: BFS
from collections import deque
def BFS(params):
    ans = deque([[]])
    for i, param in enumerate(params):
        while len(ans[0]) == i:
            temp = ans.popleft()
            for p in param:
                ans.append(temp + [p])
    return ans
```

```python
# method2: DFS
def DFS(params):
    ans = list()
    def helper(path: list):
        if len(path) == len(params):
            ans.append(path)
            return None
        for p in params[len(path)]:
            helper(path + [p])
    helper([])
    return ans
```
