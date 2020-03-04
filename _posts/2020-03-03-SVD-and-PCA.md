---
layout: post
title:  "Orthogonal Transformation, SVD and PCA"
date: 2020-03-03
categories: Stat
comments: true
---

### Goal of PCA

The goal of PCA is to reduce the dimension of the original data without losing too much information. In machine learning, we usually want to reduce the number of features of   the original matrix $$\underset{n \times p}{X}$$, that is, to find a matrix $$\underset{n \times d}{Z_d}$$ that contains enough information of $$X$$ but with $$d<p$$, where $$n$$ is the number of observations, $$p$$ is the number of features and $$d$$ is the number of features after PCA.

### Centralization

The original data $$X=(x^{(1)}, \cdots ,x^{(p)})$$ is of dimension $$n \times p$$ with column vectors $$x^{(1)}, \cdots ,x^{(p)}$$. Each column vector refers to a feature. At first, we centralize the original data by reducing the column mean: 

Set $$x_i^{(j)} = x_i^{(j)} - \frac{1}{n} \sum_{i=1}^n x_i^{(j)}$$ for all $$i=1,\cdots,n$$ and all $$j=1,\cdots,p$$. 

After centralization,  $$\sum_{i=1}^n x_i^{(j)} = 0$$ or $$\bar{x}^{(j)}=0$$.

### Covariance Matrix

The $$i$$-th sample can be written as $x_i = (x_i^{(1)}, \cdots ,x_i^{(p)})^T$. We consider it as a random vector with dimension $$p\times 1$$. The covariance matrix of $$x_i$$ is

$$\begin{align}
\text{Var}(x_i) 
&= \begin{pmatrix}
  \text{Var}(x_i^{(1)}) & \text{Cov}(x_i^{(1)}, x_i^{(2)}) & \cdots & \text{Cov}(x_i^{(1)}, x_i^{(p)}) \\
  \text{Cov}(x_i^{(2)}, x_i^{(1)}) & \text{Var}(x_i^{(2)}) & \cdots & \text{Cov}(x_i^{(2)}, x_i^{(p)}) \\
  \vdots  & \vdots  & \ddots & \vdots  \\
\text{Cov}(x_i^{(p)}, x_i^{(1)}) & \text{Cov}(x_i^{(p)}, x_i^{(2)}) & \cdots & \text{Var}(x_i^{(p)})
 \end{pmatrix} \\
&= \begin{pmatrix}
  E(x_i^{(1)} - Ex_i^{(1)})^2 & E[(x_i^{(1)} - Ex_i^{(1)}) (x_i^{(2)} - Ex_i^{(2)})] & \cdots & E[(x_i^{(1)} - Ex_i^{(1)}) (x_i^{(p)} - Ex_i^{(p)})] \\
  E[(x_i^{(2)} - Ex_i^{(2)}) (x_i^{(1)} - Ex_i^{(1)})] & E(x_i^{(2)} - Ex_i^{(2)})^2 & \cdots & E[(x_i^{(2)} - Ex_i^{(2)}) (x_i^{(p)} - Ex_i^{(p)})] \\
  \vdots  & \vdots  & \ddots & \vdots  \\
E[(x_i^{(p)} - Ex_i^{(p)})(x_i^{(1)} - Ex_i^{(1)})] & E[(x_i^{(p)} - Ex_i^{(p)})(x_i^{(2)} - Ex_i^{(2)})] &  \cdots & E(x_i^{(p)} - Ex_i^{(p)})^2
 \end{pmatrix}.
\end{align}$$

For arbitrary integer $$j, j'$$ subject to $$1 \leq j, j' \leq q$$ , we use  $$\bar{x}^{(j)}$$ to estimate $$E x_i^{(j)}$$, and $$\frac{1}{n-1} \sum_{i=1}^{n} (x_i^{(j)} - \bar{x}^{(j)}) (x_i^{(j')} - \bar{x}^{(j')})$$ to estimate $$E[(x_i^{(j)} - Ex_i^{(j)})(x_i^{(j')} - Ex_i^{(j')})]$$. 

Since $$\bar{x}^{(j)}=0$$ after centralization, we have the estimator of variance

$$\begin{align}
\hat{\text{Var}}(x_i) 
&= \frac{1}{n-1} 
\begin{pmatrix}
  \sum_{i}{x_i^{(1)}}^2 & \sum_{i} x_i^{(1)} x_i^{(2)} & \cdots & \sum_{i} x_i^{(1)} x_i^{(p)} \\
  \sum_{i}x_i^{(2)} x_i^{(1)} & \sum_{i} {x_i^{(2)}}^2 & \cdots & \sum_{i} x_i^{(2)} x_i^{(p)} \\
  \vdots  & \vdots  & \ddots & \vdots  \\
\sum_{i} x_i^{(p)} x_i^{(1)} & \sum_{i} x_i^{(p)} x_i^{(2)} & \cdots & \sum_{i} {x_i^{(p)}}^2
 \end{pmatrix} \\
&= \frac{1}{n-1} 
\begin{pmatrix}
  {x^{(1)}}^T x^{(1)} & {x^{(1)}}^T x^{(2)} & \cdots & {x^{(1)}}^T x^{(p)} \\
  {x^{(2)}}^T x^{(1)} & {x^{(2)}}^T x^{(2)} & \cdots & {x^{(2)}}^T x^{(p)} \\
  \vdots  & \vdots  & \ddots & \vdots  \\
  {x^{(p)}}^T x^{(1)} & {x^{(p)}}^T x^{(2)} & \cdots & {x^{(p)}}^T x^{(p)} \\
 \end{pmatrix} \\
 &= \frac{1}{n-1} X^T X,
\end{align}$$

which is the sample covariance matrix.

### Orthogonal Transformation

Suppose there is a orthogonal matrix $$\underset{p\times p}{Q}$$, then we transform $$X$$ by $$Q$$ to get $$\underset{n\times p}{Z} = XQ$$. Denote $$\underset{n \times d}{Z_d}$$ as the output of PCA, which is a sub-matrix of $$Z$$.

Orthogonal transformation to the centralized data $$X$$ or $$x_i $$: 

$$
XQ=Z \ \text{ or } \ \ x_iQ=z_i,
$$

where the transformation matrix $$Q = (q_1,\cdots,q_p)$$ with dimension $$p \times p$$ is a orthogonal matrix  with orthogonal unit column vectors $$q_1,\cdots, q_p$$, and the output $$Z$$ has the same dimension as $$X$$. 

### Singular Value Decomposition

As we known, high variance means large amount of information. Similar to $$X$$, The sample covariance matrix of $$Z$$ is $$\frac{1}{n-1} Z^T Z$$. Note that the diagonal entries of $$\frac{X^TX}{n-1}$$ and $$\frac{Z^TZ}{n-1}$$ are the sample variance of each feature of $$X$$ and $$Z$$ respectively. The idea of PCA is to make $$\text{tr}(Z_d)$$ as close as possible to $$\text{tr}(X)$$. The larger $$\text{tr}(Z_d) $$, the higher variance, and the larger information we can have in $$Z_d$$.

An intuitive idea is to find a way to transform $$X^TX$$ to a diagonal matrix $$Z^TZ$$, then $$Z_d^T Z_d$$ will be the sub-matrix of $$Z^TZ$$ and contains the most highest $$d$$ diagonal values of  $$Z^TZ$$, In this way, the information contained in $$Z_d$$ will be largest. 

SVD is a nice method to do this.

Normal SVD: $$X = \underset{n\times n}{U}\ \underset{n\times p}{\Sigma}\ \underset{p\times p}{V^T}$$. 

Compact SVD: $$X = \underset{n\times r}{U}\ \underset{r \times r}{\Sigma}\ \underset{r \times p}{V^T}$$, where $$r$$ is the rank of $$X$$; $$U$$ and $$V$$ are orthogonal matrices; $$\Sigma$$ is a diagonal matrix with singular values $$\sigma_1, \cdots, \sigma_r$$ on the diagonal. We prefer the compact SVD since it is more computationally effective. 

Suppose $$p=r$$. Since $$U$$ and $$V$$ are both orthogonal, we have $$U^T=U^{-1}, V^T=V^{-1}$$, then the compact SVD of $$X^TX$$ is
$$
X^TX = V \Sigma^T U^T \cdot U \Sigma V^T = V \Sigma^2 V^T,
$$

which is also the eigenvalue decomposition of $$X^TX$$.

Now we have a diagonal matrix $$\Sigma^2$$, then we set
$$
Z^TZ = V^T X^T X V = \Sigma^2 = 
\begin{pmatrix}
  \sigma_1^2 & 0 & \cdots & 0 \\
  0 & \sigma_2^2 & \cdots & 0 \\
  \vdots  & \vdots  & \ddots & \vdots  \\
  0 & 0 & \cdots & \sigma_p^2
 \end{pmatrix} .
$$

Thus, 
$$
Z = XV.
$$
To get $$Z_d $$, we select the $$d$$ column vectors in $$V$$ that corresponding to $$d$$ largest eigenvalues $$\sigma_1^2, \cdots, \sigma_d^2$$. 

### Example

<img src="https://github.com/WalkerMao/Notes/blob/master/Pictures/PCA_Visulization.png?raw=true" style="width:80%;height:80%;" alt="PCA_Visulization.png">

$$
X = 

\begin{pmatrix}
  0 & 0 \\
  2 & 2 \\
  4 & 4 \\
  6 & 6 \\
  8 & 8
 \end{pmatrix}

 -

\begin{pmatrix}
  4 & 4 \\
  4 & 4 \\
  4 & 4 \\
  4 & 4 \\
  4 & 4
 \end{pmatrix}

 =

 \begin{pmatrix}
  -4 & -4 \\
  -2 & -2 \\
  0 & 0 \\
  2 & 2 \\
  4 & 4
 \end{pmatrix}.
$$

$$
Q = \begin{pmatrix}
  q_1, q_2
 \end{pmatrix} 
 =
 \begin{pmatrix}
  \frac{\sqrt{2}}{2} & \frac{-\sqrt{2}}{2} \\
  \frac{\sqrt{2}}{2} & \frac{\sqrt{2}}{2}
 \end{pmatrix} ,

 \ \ \ \ \ \

Z = XQ =
 \begin{pmatrix}
  -4\sqrt{2} & 0 \\
  -2\sqrt{2} & 0 \\
  0 & 0 \\
  2\sqrt{2} & 0 \\
  4\sqrt{2} & 0
 \end{pmatrix}.
$$



### Low-Rank Approximation

Compact SVD of $$X$$ can be decomposed as $$X = \underset{n\times r}{U}\ \underset{r \times r}{\Sigma}\ \underset{r \times p}{V^T} = \sum_{j=1}^r \sigma_j u_j v_j^T$$, where $$u_1,\cdots,u_r$$ and $$v_1,\cdots,v_r$$ are column vectors of $$U$$ and $$V$$.

According to Eckart-Young-Mirsky theorem, we can approximate $$X$$ by $$\sum_{j=1}^d \sigma_j u_j v_j^T$$. 

We have 

$$
XX^T = U \Sigma V^T \cdot V \Sigma^T U^T = U \Sigma^2 U^T, \\
Z_d Z_d^T = \underset{n \times d}{U_d} \ \underset{d \times d}{\Sigma_d^2} \ \underset{d \times n}{U_d^T}.
$$

Therefore, 

$$
Z_d = U_d \Sigma_d.
$$

### Tips

* The trace of a matrix equals to the sum of the eigenvalues. $$ \text{tr}(Z_d^T Z_d) = \sum_{j=1}^{d} \sigma_j^2$$, which equals to the sum of the sample variances of $$z^{(1)}, \cdots, z^{(d)}$$. We also have $$\text{tr}(X^TX) = \text{tr}(Z^TZ) = tr(\Sigma^2) = \sum_{j=1}^p \sigma_j^2$$, which also equals to the sum of the sample variances of $$x^{(1)}, \cdots, x^{(p)}$$ or equivalently that of $$z^{(1)}, \cdots, z^{(p)}$$. Thus, the proportion of the information retained in the output $$Z_d $$ is 

    $$
    \text{tr}(\Sigma_d^2) / \text{tr}(\Sigma_d^2) = \sum_{j=1}^d \sigma_j^2 / \sum_{j=1}^p \sigma_j^2
    $$.

* The column vectors in $$V$$ are the orthogonal basis vectors, which are principal components and decide the direction of coordinate axis after orthogonal transformation.

* How to decide $$d$$ ? We can plot the information (variance) proportion v.s. the number of components.

<img src="https://miro.medium.com/max/769/1*K8kwhxztpLzMSCI9labMzw.png" style="width:50%;height:50%;" alt="PCA_Visulization.png">

### Reference

Lecture notes from professor [Min Xu](https://stat.rutgers.edu/people-pages/faculty/people/130-faculty/378-min-xu).

张 洋. “[PCA的数学原理.](https://blog.codinglabs.org/articles/pca-tutorial.html.)” *CodingLabs*, 22 June 2013.

Jonathan Hui, "[Machine Learning - SVD and PCA.]( https://medium.com/@jonathan_hui/machine-learning-singular-value-decomposition-svd-principal-component-analysis-pca-1d45e885e491.)" *Medium*, 6 Mar 2019.