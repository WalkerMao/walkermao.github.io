---
layout: post
title: "Optimizing Matrix Multiplication"
date: 2020-09-19
categories: CS Math
tags: [optimization]
published: true
comments: true
---

## 1. Matrix Chain Multiplication

Matrix chain multiplication is an optimization problem that can be solved using dynamic programming. Given a sequence of matrices, the goal is to find the most efficient way to multiply these matrices. There are many options because matrix multiplication is associative. 

Given two matrices $$A$$ with dimension $$a \times b$$ and $$B$$ with dimension $$b \times c$$, then computing the multiplication $$AB$$ needs $$a \times b \times c$$ operations. 

Given three matrices, say $$A$$ is a $$10 × 30$$ matrix, $$B$$ is a $$30 × 5$$ matrix, and $$C$$ is a $$5 × 60$$ matrix, then we have two ways to computing the product $$ABC$$: 

- computing $$(AB)C$$ needs $$(10×30×5) + (10×5×60) = 1500 + 3000 = 4500$$ operations, while

- computing $$A(BC)$$ needs $$(30×5×60) + (10×30×60) = 9000 + 18000 = 27000$$ operations. 

Apparently the first way is more efficient. 

How to decide the way to compute the product? In other word, how to decide the order in which we parenthesize the product? 

Now suppose we want to compute the multiplication of a sequence of matrices $$A_1A_2 \cdots A_n$$, where $$A_i$$ has dimension $$p_{i-1} \times p_i$$. 

### 1.1 Brute-Force Approach

First we show that exhaustively checking all possible parenthesizations leads to exponential growth of computation.

A naive recursive approach in Python:  

```python
def matrixChain(p: list, i: int, j: int) -> int: 
    if i == j:
        return 0
    ans = float("inf")
    for k in range(i, j): 
        ans = min(ans, matrixChain(p, i, k) + p[i-1]*p[k]*p[j] + matrixChain(p, k+1, j))
    return ans

matrixChain(p, 1, len(p)-1)
```

The time complexity of the above naive recursive approach is exponential. It should be noted that the above function computes the same subproblems again and again. See the following recursion tree for a matrix chain of size 4. The function `matrixChain(p, 3, 4)` is called two times. We can see that there are many subproblems being called more than once. 

<div style="text-align: center">
<figure>
<img src="../pictures/matrix-chain-multiplication-brute-force.png" alt="Brute-force approach for matrix chain multiplication" style="zoom: 60%;" />
<figcaption style="font-size: 80%;"> <a href="https://www.geeksforgeeks.org/matrix-chain-multiplication-dp-8/">Figure source</a> </figcaption>
</figure>
</div>

### 1.2 Dynamic Programming Approach

We can break this optimization problem into subproblems. If we know the optimal parenthesization of every subchain $$A_iA_{i+1}\cdots A_j$$ ($$1 \leq i \leq j \leq n$$), then we can know the optimal  parenthesization of the whole chain.  

**Dynamic Programming** is an algorithmic technique for solving an optimization problem by breaking it down into simpler subproblems, and utilizing the fact that the optimal solution to the overall problem depends upon the optimal solution to its subproblems. 

Let $M$ be a two dimensional array, where $$M[i][j]$$ is the minimum number of scalar multiplications needed to compute the product of matrices $$A_iA_{i+1}\cdots A_j$$. 

We have the following **recursion formula**: 

$$
M[i][j] = 
\begin{cases}
0 & \text{if } i=j,\\
\min_{i \leq k \leq j} \{ M[i][k] + p_{i-1} p_k p_j + M[k+1][j] \} & \text{if } i<j.
\end{cases}
$$

Dynamic programming Python implementation:

```python
def matrixChain(p: list) -> int: 
    n = len(p) - 1
    M = [[0] * (n+1) for _ in range(n+1)] 
    # L is subchain length. 
    for L in range(2, n+1): 
        for i in range(1, n-L+2): 
            j = i + L -1
            M[i][j] = float("inf")
            for k in range(i, j): 
                M[i][j] = min(M[i][j], M[i][k] + p[i-1]*p[k]*p[j] + M[k+1][j]) 
    return M[1][n] 
```

The time complexity is $$O(n^3)$$ and the space complexity is $$O(n^2)$$. 

## 2. Strassen Algorithm

Let $$\mathbf{A},\mathbf{B}$$ be two square matrices with dimension $$2^n \times 2^n$$, and we want to calculate the matrix product as $$\mathbf{C} = \mathbf{A} \mathbf{B}$$.

If the matrices $$\mathbf{A},\mathbf{B}$$ are not of $$2^n \times 2^n$$, we fill the missing rows and columns with zeros. 

A Divide and Conquer approach is that, we partition $$\mathbf{A},\mathbf{B}$$ and $$\mathbf{C}$$ into equally sized block matrices as 

$$
\mathbf{A} =
\begin{bmatrix}
\mathbf{A}_{1,1} & \mathbf{A}_{1,2} \\
\mathbf{A}_{2,1} & \mathbf{A}_{2,2}
\end{bmatrix}
\mbox { , }
\mathbf{B} =
\begin{bmatrix}
\mathbf{B}_{1,1} & \mathbf{B}_{1,2} \\
\mathbf{B}_{2,1} & \mathbf{B}_{2,2}
\end{bmatrix}
\mbox { , }
\mathbf{C} =
\begin{bmatrix}
\mathbf{C}_{1,1} & \mathbf{C}_{1,2} \\
\mathbf{C}_{2,1} & \mathbf{C}_{2,2}
\end{bmatrix}.
$$

with $$\mathbf{A}_{i,j}, \mathbf{B}_{i,j}, \mathbf{C}_{i,j}$$ are of dimension $$2^{n-1} \times 2^{n-1}$$.

The basic algorithm would be:

$$
\mathbf{C}_{1,1} = \mathbf{A}_{1,1} \mathbf{B}_{1,1} + \mathbf{A}_{1,2} \mathbf{B}_{2,1}, \\
\mathbf{C}_{1,2} = \mathbf{A}_{1,1} \mathbf{B}_{1,2} + \mathbf{A}_{1,2} \mathbf{B}_{2,2}, \\
\mathbf{C}_{2,1} = \mathbf{A}_{2,1} \mathbf{B}_{1,1} + \mathbf{A}_{2,2} \mathbf{B}_{2,1}, \\
\mathbf{C}_{2,2} = \mathbf{A}_{2,1} \mathbf{B}_{1,2} + \mathbf{A}_{2,2} \mathbf{B}_{2,2}.
$$

With this construction we have not reduced the number of multiplications. We still need $8$ multiplications to calculate the $$C_{i,j}$$ matrices. 

Denote $$N = 2^n$$, the time complexity of this basic algorithm is $$\text{Time}(N) = 8\text{Time}(N/2) + O(N^2)$$, where $$O(N^2)$$ is the time taken by the addition of two matrices. We can show that $$\text{Time}(N)=O(N^3)$$, which is unfortunately same as the time we need when using standard matrix multiplication.

The **Strassen algorithm** defines instead new matrices:

$$
\begin{align*}
& \mathbf{M}_{1} := (\mathbf{A}_{1,1} + \mathbf{A}_{2,2}) (\mathbf{B}_{1,1} + \mathbf{B}_{2,2}), \\
& \mathbf{M}_{2} := (\mathbf{A}_{2,1} + \mathbf{A}_{2,2}) \mathbf{B}_{1,1}, \\
& \mathbf{M}_{3} := \mathbf{A}_{1,1} (\mathbf{B}_{1,2} - \mathbf{B}_{2,2}), \\
& \mathbf{M}_{4} := \mathbf{A}_{2,2} (\mathbf{B}_{2,1} - \mathbf{B}_{1,1}), \\
& \mathbf{M}_{5} := (\mathbf{A}_{1,1} + \mathbf{A}_{1,2}) \mathbf{B}_{2,2}, \\
& \mathbf{M}_{6} := (\mathbf{A}_{2,1} - \mathbf{A}_{1,1}) (\mathbf{B}_{1,1} + \mathbf{B}_{1,2}), \\
& \mathbf{M}_{7} := (\mathbf{A}_{1,2} - \mathbf{A}_{2,2}) (\mathbf{B}_{2,1} + \mathbf{B}_{2,2}).
\end{align*}
$$

only using $$7$$ multiplications instead of $$8$$. We may now express the $$C_{i,j}$$ in terms of $$M_k$$:

$$
\begin{align*}
& \mathbf{C}_{1,1} = \mathbf{M}_{1} + \mathbf{M}_{4} - \mathbf{M}_{5} + \mathbf{M}_{7}, \\
& \mathbf{C}_{1,2} = \mathbf{M}_{3} + \mathbf{M}_{5}, \\
& \mathbf{C}_{2,1} = \mathbf{M}_{2} + \mathbf{M}_{4}, \\
& \mathbf{C}_{2,2} = \mathbf{M}_{1} - \mathbf{M}_{2} + \mathbf{M}_{3} + \mathbf{M}_{6}.
\end{align*}
$$

We iterate this division process $$n$$ times **recursively** until the submatrices degenerate into numbers. 

The time complexity of this Strassen algorithm is $$\text{Time}(N) = 7\text{Time}(N/2) + O(N^2)$$, and we can show that $$\text{Time}(N)=O(N^{\log7}) \approx O(N^{2.8074})$$. 

The resulting product will be padded with zeroes just like $$A$$ and $$B$$, and should be stripped of the corresponding rows and columns. 

Here is a implementation of  Strassen algorithm in Python: 

```python
# Python code from https://www.geeksforgeeks.org/strassens-matrix-multiplication/.
import numpy as np 
  
def split(matrix): 
    """ 
    Splits a given matrix into quarters. 
    Input: n x n matrix 
    Output: tuple containing 4 n/2 x n/2 matrices corresponding to a, b, c, d 
    """
    row, col = matrix.shape 
    row2, col2 = row//2, col//2
    return matrix[:row2, :col2], matrix[:row2, col2:], matrix[row2:, :col2], matrix[row2:, col2:] 
  
def strassen(x, y): 
    """ 
    Computes matrix product by divide and conquer approach, recursively. 
    Input: n x n matrices x and y 
    Output: n x n matrix, product of x and y 
    """
  
    # Base case when size of matrices is 1 x 1 
    if len(x) == 1: 
        return x * y 
  
    # Splitting the matrices into quadrants. This will be done recursively 
    # untill the base case is reached. 
    a, b, c, d = split(x) 
    e, f, g, h = split(y) 
  
    # Computing the 7 products, recursively (p1, p2...p7) 
    p1 = strassen(a, f - h)   
    p2 = strassen(a + b, h)         
    p3 = strassen(c + d, e)         
    p4 = strassen(d, g - e)         
    p5 = strassen(a + d, e + h)         
    p6 = strassen(b - d, g + h)   
    p7 = strassen(a - c, e + f)   
  
    # Computing the values of the 4 quadrants of the final matrix c 
    c11 = p5 + p4 - p2 + p6   
    c12 = p1 + p2            
    c21 = p3 + p4             
    c22 = p1 + p5 - p3 - p7   
  
    # Combining the 4 quadrants into a single matrix by stacking horizontally and vertically. 
    c = np.vstack((np.hstack((c11, c12)), np.hstack((c21, c22))))  
  
    return c 
```


<br>


**References**:

[GeeksforGeeks: Matrix Chain Multiplication](https://www.geeksforgeeks.org/matrix-chain-multiplication-dp-8/).

[Learn Dynamic Programming](https://www.dynamicprogramming.com/post/what-is-dynamic-programming).

[Dynamic Programming Solution to the Matrix-Chain Multiplication Problem](http://www.ccs.neu.edu/home/vip/teach/Algorithms/6_dyn_prog/notes/matrix_chain_multiplication/matrix_chain_multiplication.pdf).

[GeeksforGeeks: Strassen's Matrix Multiplication](https://www.geeksforgeeks.org/strassens-matrix-multiplication/).

[Wikipedia: Strassen algorithm](https://en.wikipedia.org/wiki/Strassen_algorithm).