---
layout: post
title: "Factorization Machines"
date: 2020-12-01
categories: fe
published: true
comments: true

---

Factorization machines (FMs) were first introduced by Steffen Rendle in 2010. FMs model all interactions between features using factorized parameters. Thus they are able to estimate the weights (coefficients) of feature interactions even in problems with huge sparsity (like recommender systems).

## Linear Model with Interactions

Suppose we have $$p$$ features $$x_1,\cdots,x_p$$. A linear model with no interactions can be expressed as 

$$
\hat{y} = w_0 + \sum_{j=1}^p w_jx_j. \tag {1}
$$

Sometimes we want to model the interactions between features, then a linear model with degree $$d=2$$ interactions can be expressed as 

$$
\hat{y} = w_0 + \sum_{j=1}^p w_jx_j + \sum_{j=1}^p\sum_{j'=j+1}^p w_{jj'}x_jx_{j'}. \tag {2}
$$

There are $$\frac{p(p-1)}{2}$$ weights $$w_{jj'}$$ of interactions to estimate. Estimating too many weights may lead to overfitting. For sparse features, most of feature values are zero, not to mention the interactions, thus we do not have enough data to estimate the weights of these interactions. 

## Derivation of Factorization Machines

The model equation for a factorization machine of degree $$d=2$$ is defined as

$$
\hat{y} = w_0 + \sum_{j=1}^p w_jx_j + \sum_{j=1}^p\sum_{j'=j+1}^p \langle v_j, v_{j'} \rangle x_jx_{j'}. \tag {3}
$$

Now let's derive that 

$$
w_{jj'} = v_j^Tv_{j'} = \langle v_j, v_{j'} \rangle. \tag {4}
$$

We firstly compose the weights of interactions as a matrix

$$
W = \begin{pmatrix}
  w_{11} & w_{12} & \cdots & w_{1p} \\
  w_{21} & w_{22} & \cdots & w_{2p} \\
  \vdots & \vdots & \ddots & \vdots  \\
  w_{p1} & w_{p2} & \cdots & w_{pp}
 \end{pmatrix}. 
 \tag {5}
$$

Note that $$w_{jj'}=w_{j'j}$$ for all $$j,j'=1,2,\cdots,p$$, and $$W$$ is a symmetric matrix. 

We assume $$W$$ is positive semidefinite. It is well known that for any positive semidefinite matrix $$W\in\mathbb{R}^{p \times p}$$, there exists a matrix $$V \in \mathbb{R}^{k \times p}$$ such that $$W = V^TV$$ provided that $$k$$ is sufficiently large. 

Denote $$v_j = (v_{1j}, v_{2j}, \cdots, v_{kj})^T \in \mathbb{R}^{k}$$ as the $$j$$-th column vector of the matrix $$V$$. Then we have

$$
V = 
\begin{pmatrix}
  v_1, v_2, \cdots, v_p
\end{pmatrix} 
= 
\begin{pmatrix}
  v_{11} & v_{12} & \cdots & v_{1p} \\
  v_{21} & v_{22} & \cdots & v_{2p} \\
  \vdots & \vdots & \ddots & \vdots  \\
  v_{k1} & v_{k2} & \cdots & v_{kp}
\end{pmatrix}.
\tag {6}
$$

Rather than estimating all $$\frac{p(p-1)}{2}$$ weights of interactions independently, we estimate all $$kp$$ entries in $$V$$. 

Now we decompose $$W$$ as

$$
W = V^TV = 
\begin{pmatrix}
  v_1^T \\
  v_2^T \\
  \cdots  \\
  v_p^T
\end{pmatrix} 
\begin{pmatrix}
  v_1, v_2, \cdots, v_p
\end{pmatrix} 
= 
\begin{pmatrix}
  v_{1}^Tv_{1} & v_{1}^Tv_{2} & \cdots & v_{1}^Tv_{p} \\
  v_{2}^Tv_{1} & v_{2}^Tv_{2} & \cdots & v_{2}^Tv_{p} \\
  \vdots & \vdots & \ddots & \vdots  \\
  v_{p}^Tv_{1} & v_{p}^Tv_{2} & \cdots & v_{p}^Tv_{p}
\end{pmatrix}.
\tag {7}
$$

Thus, 

$$
w_{jj'} = v_j^Tv_{j'} = \langle v_j, v_{j'} \rangle = (v_{1j}, v_{2j}, \cdots, v_{kj}) 
\begin{pmatrix}
v_{1j'} \\ v_{2j'} \\ \cdots \\ v_{kj'}
\end{pmatrix} 
= \sum_{f=1}^{k} v_{fj}v_{fj'}.
\tag {8}
$$

The equation $$(2)$$ can be rewrite as

$$
\hat{y} = w_0 + \sum_{j=1}^p w_jx_j + \sum_{j=1}^p\sum_{j'=j+1}^p \langle v_j, v_{j'} \rangle x_jx_{j'}. \tag {9}
$$

## Learning Factorization Machines

The pairwise interactions can be reformulated:

$$
\begin{align}
& \sum_{j=1}^p \sum_{j'=j+1}^p \langle \textbf{v}_j , \textbf{v}_{j'} \rangle x_{j} x_{j'} \\
&= \frac{1}{2} \sum_{j=1}^p \sum_{j'=1}^p \langle \textbf{v}_j , \textbf{v}_{j'} \rangle x_{j} x_{j'} - \frac{1}{2} \sum_{j=1}^p \langle \textbf{v}_j , \textbf{v}_{j} \rangle x_{j} x_{j} \\
&= \frac{1}{2}\left(\sum_{j=1}^p \sum_{j'=1}^p \sum_{f=1}^k v_{fj} v_{fj'} x_{j} x_{j'} \right)  - \frac{1}{2}\left( \sum_{j=1}^p \sum_{f=1}^k v_{fj} v_{fj} x_{j} x_{j} \right) \\
&= \frac{1}{2}\left(\sum_{j=1}^p \sum_{j'=1}^p \sum_{f=1}^k v_{fj} v_{fj'} x_{j} x_{j'}  -  \sum_{j=1}^p \sum_{f=1}^k v_{fj} v_{fj} x_{j} x_{j} \right) \\
&= \frac{1}{2} \sum_{f=1}^{k} \left( \left(\sum_{j=1}^p v_{fj}x_{j} \right) \left( \sum_{j'=1}^p v_{fj'}x_{j'} \right) - \sum_{j=1}^{p} v_{fj}^2 x_{j}^2 \right) \\
&= \frac{1}{2} \sum_{f=1}^{k} \left( \left( \sum_{j=1}^{p} v_{fj}x_{j} \right)^2  - \sum_{j=1}^{p} v_{fj}^2 x_{j}^2 \right) \tag {10}
\end{align}
$$

This equation has only linear complexity in both $$k$$ and $$p$$, i.e. its computation is in $$O(kp)$$.

As we have shown, FMs have a closed model equation that can be computed in linear time. The model parameters ($$w_0$$, $$w_j$$'s and $$V$$) of FMs can be learned efficiently by gradient descent methods, e.g. stochastic gradient descent (SGD), for a variety of losses, among them are square, logit or hinge loss. The gradient of the FM model is:
$$
\begin{align}
\frac{\partial\hat{y}}{\partial\theta} =
\begin{cases}
1,  & \text{if $\theta$ is $w_0$}; \\
x_j, & \text{if $\theta$ is $w_j$}; \\
x_j\sum_{j'=1}^{p} v_{fj'}x_{j'} - v_{fj}x_{j}^2, & \text{if $\theta$ is $v_{fj}$}.
\end{cases}
\end{align} \tag{11}
$$

The sum $$\sum_{j'=1}^{p} v_{fj'}x_{j'}$$ is independent of $$j$$ and thus can be precomputed (e.g. when computing $$\hat{y}$$). In general, each gradient can be computed in constant time $$O(1)$$. And all parameter updates for a case $$(x,y)$$ can be done in $$O(kp)$$.

## Tips and Summary

**Expressiveness**: A FM can express any interaction matrix $$W$$ if $$k$$ is chosen large enough. Nevertheless in sparse settings, typically a small $$k$$ should be chosen because there is not enough data. Restricting $$k$$, and also the restricting the expressiveness of the FM, leads to better generalization and thus improved interaction matrix $$W$$ under sparsity.

**Parameter Estimation Under Sparsity**: In sparse settings, there is usually not enough data to estimate interactions
between variables directly and independently. Factorization machines can estimate interactions even in these settings well because they break the independence of the interaction parameters by factorizing them. In general this means that the data for one interaction helps also to estimate the parameters for related interactions. Read the [original paper](https://www.csie.ntu.edu.tw/~b97053/paper/Rendle2010FM.pdf) for an intuitive example.

**Computation**: The model equation of a factorization machine (equation $$(2)$$) can be computed in linear time $$O(kp)$$. 

In summary, FMs model all possible interactions between values in the feature vector x using factorized interactions instead of full parametrized ones. This has two main advantages: 

- The interactions between values can be estimated even under high sparsity. Especially, it is possible to generalize to unobserved interactions.
- The number of parameters as well as the time for prediction and learning is linear. This makes direct optimization using SGD feasible and allows optimizing against a variety of loss functions.

<br>

**References**:

Rendle, Steffen. "Factorization machines." *2010 IEEE International Conference on Data Mining*. IEEE, 2010.

Kafunah, Jefkine. "Factorization machines." 27 Mar. 2017. https://www.jefkine.com/recsys/2017/03/27/factorization-machines/. Accessed 1 Dec. 2020.

