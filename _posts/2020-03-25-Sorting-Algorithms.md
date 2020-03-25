---
layout: post
title:  "Sorting Algorithms"
date: 2020-03-25
categories: CS
comments: true
---

Here is the cheat sheet for commonly used sorting algorithms: 

| Algorithm | Best Time   | Average Time | Worst Time | Space            | Stable? | In-place? |
| --------- | ----------- | ------------ | ---------- | ---------------- | ------- | --------- |
| Selection | $n^2$       | $n^2$        | $n^2$      | $1$              | ✓       | ✓         |
| Bubble    | $n$         | $n^2$        | $n^2$      | $1$              | ✓       | ✓         |
| Insertion | $n$         | $n^2$        | $n^2$      | $1$              | ✓       | ✓         |
| Tree      | $n\log_2 n$ | $n\log_2 n$  | $n^2$      | $n$              | ✓       | ✗         |
| Heap      | $n\log_2 n$ | $n\log_2 n$  | $n\log_2n$ | $1$              | ✗       | ✓         |
| Merge     | $n\log_2 n$ | $n\log_2 n$  | $n\log_2n$ | $n$              | ✓       | ✗         |
| Quick     | $n\log_2 n$ | $n\log_2 n$  | $n^2$      | $\log_2n$ or $n$ | ✗       | ✓         |
| Counting  | $n+k$       | $ n+k $      | $n+k$      | $k$              | ✓       | ✗         |
| Bucket    | $n+k $      | $ n+k $      | $ n^2 $    | $n$              | ✓       | ✗         |

## Tree Sort and Heap Sort

They are both comparison based sorting techniques based on binary search trees and heaps. 

### Tree Sort

Tree sort builds a binary search tree (BST) for the elements and then traverses the tree in-order so that the elements come out in sorted order. It is faster for nearly sorted array. 

```pseudocode
def TreeSort(A): 
	BST = BuildBST(A)
	return InOrderTraverse(BST)
```

### Heap Sort

Heap sort first transforms the array into a heap (implemented as an array) in-place (time $O(n)$), then divides the array into a sorted and an unsorted region. We do the following steps iteratively (time $O(n\log_2n)$): 1. swap the first and last element in unsorted region; 2. shrink the unsorted region by merging the last element into the the sorted region. 3. re-heapify the shrunk unsorted region. 

```pseudocode
def HeapSort(A):
	BuildHeap(A) # in-place, time is n
	for i from len(A)-1 to 1:
		swap(A[0], A[i])
		Heapify(A[:i])
```

<img src="https://www.codesdope.com/staticroot/images/algorithm/heapsort2.png" alt="Heap sort" style="zoom:100%;" />

The left part (in heap) of the array is unsorted and the right part (not in heap) is sorted. We swap the first and last element in the unsorted array, then the last element is  in the sorted array. Heap sort can be thought of as an improved selection sort. 

### Comparison

Heap sort is always preferable to tree sort in terms of either time or space: 

- Time: The heap sort tends to be faster, because the heap is a balanced tree and its operations always are $O(\log_2n)$, in a determistic way, not on average. With BST, depending on the approach for balancing, insertion and deletion tend to take more time than the heap, no matter which balancing approach is used. 
- Space: The heaps can be implemented as an array since they are always complete binary trees, but BSTs cannot because they are not guaranteed to be complete binary trees. 
- Stability: Tree sort is stable, but heapsort is not because operations on the heap can change the relative order of equal items.

## Merge Sort and Quick Sort

Both them employ the **divide-and-conquer** paradigm based on recursion. This paradigm breaks a problem into subproblems that are similar to the original problem, recursively solves the subproblems, and finally combines the solutions to the subproblems to solve the original problem. 

### Merge Sort 

Divide the array into two sublists recursively and merge them.

<img src="https://media.geeksforgeeks.org/wp-content/cdn-uploads/Merge-Sort-Tutorial.png" alt="Merge sort" style="zoom: 50%;" />

Space complexity: 

Suppose $n=16$, the space tree can be drawn as:

```pseudocode
                     16                                 | 16
                    /  \                              
                   /    \
                  /      \
                 /        \
                8          8                            | 16
               / \        / \
              /   \      /   \
             4     4    4     4                         | 16
            / \   / \  / \   / \
           2   2 2   2 .......  2                       | 16
          / \  /\  ............ /\
         1  1  1 1 ............ 1 1                     | 16
```

The largest memory in recursion is: 

```pseudocode
                       16
                      /
                     8
                    /
                   4
                  /
                 2
               / \
              1   1
```

Thus, the space complexity is $O(3n)=O(n)$. 

#### Merge Sort on Linked List


```python
# Definition for singly-linked list.
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

### Quick Sort

Recursively pick an element as pivot and partition the other elements by comparing them with the picked pivot. 

![Quick sort](https://media.geeksforgeeks.org/wp-content/cdn-uploads/gq/2014/01/QuickSort2.png)

Best case: In the best case, each time we perform a partition we divide the list into two nearly equal pieces. The depth of the recurrence tree is $\log_2n$. The time in each level of the  recurrence tree is $O(n)$. Thus, in the best case, the time complexity is $O(n\log_2n)$ and the space complexity is $O(\log_2n)$.

Worst case: If the leftmost (or rightmost) element is chosen as pivot, the worst occurs when the array is **already sorted** in order or reverse order (a special case is that all elements are same). At this situation, every element will be a pivot, thus the time is $$(n-1) + (n-2) + \cdots + 1 = \frac{n(n-1)}{2} = O(n^2)$$, and the recurrence tree will be a right or left skewed tree thus the space is $O(n)$. The problem can be easily solved by choosing a random or middle index for the pivot. However, the worst case can still occurs when all elements are same. 

Quick sort exhibits good cache locality, and this makes quick sort faster than most other $O(n\log_2n)$ comparison based algorithms in practice. The reason for this **cache efficiency** is that it linearly scans the input and linearly partitions the input. This means we can make the most of every cache load we do as we read every number we load into the cache before swapping that cache for another. In particular, the algorithm is cache-oblivious, which gives good cache performance for every cache level, which is another win.

#### Quick Sort on Linked List

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

## Counting Sort and Bucket Sort

### Counting Sort

Counting sort is usually used for sorting integers or characters. It is based on keys between a specific range. It works by counting the number of objects having distinct key values (kind of hashing). Then doing some arithmetic to calculate the position of each object in the output sequence.

![counting_sort](https://www.cs.rit.edu/~vcss233/Labs/lab05/images/count_sort_exp.gif)

```python
# Suppose A is an integer array
def countingSort(A: list) -> list:
    mi, ma = float("inf"), -float("inf")
    for n in A: 
        mi, ma = min(mi, n), max(ma, n)
    counts = [0] * (max(A) - min(A) + 1)
    for n in A: 
        counts[n-mi] += 1
    sortedA = list()
    for i, c in enumerate(counts):
        sortedA.extend([mi+i] * c)
    return sortedA
```

Time complexity of initializing the counting array of size $k$ is $O(k)$, and that of counting all elements is $O(n)$. Thus the time complexity of counting sort is $O(n+k)$. Space complexity is $O(k)$ since the size of the counting array is $k$. 

### Bucket Sort

Bucket sort works as follows:

1. Set up an array of initially empty "buckets".
2. **Scatter**: Go over the original array, putting each object in its bucket.
3. Sort each non-empty bucket using bucket sort or other sorting methods.
4. **Gather**: Visit the buckets in order and put all elements back into the original array.

<img src="/pictures/bucket-sort.png" alt="bucket-sort" style="zoom:60%;" />

Bucket sort is mainly useful when input is uniformly distributed over a range. The worst-case scenario occurs when all the elements are placed in a single bucket. The overall performance would then be dominated by the algorithm used to sort each bucket, which is typically $O(n^{2}) $ insertion sort, making bucket sort less optimal than $O(n\log_2n)$ comparison sort algorithms.

