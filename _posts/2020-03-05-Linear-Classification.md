---
layout: post
title: "Linear Classification Methods"
date: 2020-03-05
categories: ML
comments: true
---

We model **discriminant functions** $$\delta_k(x)$$ for each class $$k$$, and then classify $$x$$ to the class with the largest value for its discriminant function. For example, model the posterior probabilities $$\delta_k(x) = P(G = k \mid X = x)$$, which is the estimated probability of the observation $$x$$ is of class $$k$$. 

If the discriminant functions $$\delta_k(x)$$ are linear in $$x$$, then the decision boundaries are also linear in $$x$$. The models with linear boundaries are linear classification methods. 

The following parts introduce two popular linear classification methods: **LDA** (linear discriminant analysis) and **LR** (logistic regression).

## 1. Linear Discriminant Analysis

LDA is similar to PCA, but PCA is unsupervised learning method and LDA is supervised. 

The assumptions of LDA are the same as those for MANOVA:

* Assume that the class conditional distributions are Gaussian;

* Assume that these Gaussians have the same covariance matrix.

The idea of LDA is to find the projection (or transformation) that makes the samples belonging to the same class are close together but samples from different classes are far from each other. The projection here is the same as the discriminant function. Suppose the discriminant function for class $$k$$ is $$\delta_k(x) = w_k^Tx + b_k$$, which is linear in $$x$$, then the decision boundary $$\{x \mid \delta_k(x)=0\}$$ for class $$k$$ will be linear. 

![LDA](/pictures/LDA.png)

For simplicity, let's take binary classification problem for example.

Denote $$x$$ as an arbitrary sample with dimension $$ p \times 1 $$ and $$w$$ as the projection vector with the same dimension as $$x$$. We have two classes $$C_1, C_2$$ and the sample mean vectors of them are $$\bar{x}_{C_1}, \bar{x}_{C_2}$$. 

The squared of the distance between two sample mean vectors after projection: $$ ( w^T \bar{x}_{C_1} - w^T \bar{x}_{C_2} )^2 $$.

The sample variances after projection times the corresponding degree of freedom are 

$$
\sum_{x \in C_1} (w^Tx - w^T\bar{x}_{C_1})^2, \\
\sum_{x \in C_2} (w^Tx - w^T\bar{x}_{C_2})^2.
$$

Our goal is to find $$w$$ that maximize 

$$\begin{align*}
J(w) &= \frac{( w^T \bar{x}_{C_1} - w^T \bar{x}_{C_2} )^2}{\sum_{x \in C_1} (w^Tx - w^T\bar{x}_{C_1})^2 + \sum_{x \in C_2} (w^Tx - w^T\bar{x}_{C_2})^2} \\
&= \frac{w^T (\bar{x}_{C_1} - \bar{x}_{C_2})(\bar{x}_{C_1} - \bar{x}_{C_2})^T w}{ \sum_{k=1}^2 \sum_{x \in C_k} w^T (x - \bar{x}_{C_k}) (x - \bar{x}_{C_k})^T w}.
\end{align*} $$

Denote the between-class scatter matrix as $$S_b = (\bar{x}_{C_1} - \bar{x}_{C_2})(\bar{x}_{C_1} - \bar{x}_{C_2})^T$$, the within-class scatter matrix as $$S_w = \sum_{k=1}^2 \sum_{x \in C_k} (x - \bar{x}_{C_k}) (x - \bar{x}_{C_k})^T $$. 

For multiclass ($$K$$-class) problem, denote the overall mean of all samples as $$\bar{x}$$, the total class scatter matrix as 

$$
S_t = \sum_{i=1}^{n} (x_i - \bar{x}) (x_i - \bar{x})^T.
$$

The within-class scatter matrix as 

$$
S_w = \sum_{k=1}^K \sum_{x \in C_k} (x - \bar{x}_{C_k}) (x - \bar{x}_{C_k})^T.
$$

Then we can derive the between-class scatter matrix as 

$$
S_b = S_t - S_w = \sum_{k=1}^K |C_k| (\bar{x}_{C_k} - \bar{x}) (\bar{x}_{C_k} - \bar{x})^T,
$$

where $$ \mid C_k \mid $$ is the size of the set $$C_k$$ (the number of samples in the class $$k$$).

We can explain the between-class scatter matrix $$ S_b $$ as the weighted distance between the class mean and the overall mean, and the weight is sample size of each class. Maximizing $$w^T S_b w$$ means maximizing the distances between all class mean and the overall mean.

Then $$J(w)$$ can be rewritten as 

$$
J(w) = \frac{w^T S_b w}{w^T S_w w},
$$

which is the generalized Rayleigh quotient of $$S_b$$ and $$S_w$$.

$$
w = \underset{w \in \mathbb{R}^p}{\text{argmax }} J(w).
$$

Take derivative of $$J(w)$$ with respect to $$w$$ and set to $$0$$, we have

$$
(w^T S_w w) S_b w - (w^T S_b w) S_w w = 0 \implies S_w^{-1} S_b w = J(w) w.
$$

Thus, $$J(w)$$ **is the largest eigenvalue of $$S_w^{-1}S_b$$ and $$w$$ is the corresponding eigenvector.** 

The decision rule of binary classification can be simply written as $$\text{sign}( w^Tx + b)$$, where $$b$$ is the intercept that is selected to minimize the loss. 

## 2. Logistic Regression

Logistic regression (LR) is used for classification problem and it can predict the probability of each class. We use logit transformation to get binary logistic regression: $\log[p/(1-p)] = z = w^T x + b$, where $p/(1-p)$ is odds and $\log[p(1-p)]$ is log-odds, then we have the discriminant function $\delta(x) = w^Tx+b$ and the decision boundary $$\{x \mid \delta(x)=0 \}$$ (same as $$\{x \mid p=0.5\}$$), which is linear in $$x$$.

### 2.1 Multi-class LR

We use the softmax function to generate the probability. The logistic regression for $K$-class classification can be written as

$$
\hat{p}_{ik} = \frac{e^{z_{ik}}}{\sum_{k=1}^K e^{z_{ik}}}, \\
z_{ik} = w_k^T x_{i} + b_k,
$$

where $k$ is the index of class, the weights (coefficients) $w_k$ and and the $i$-th observation $x_i$ are both the vectors of dimension $p\times 1$; the bias $b_k$ is a scalar; $$\hat{p}_{ik}$$ and $$z_{ik}$$ are both scalar, and $$\hat{p}_{ik}$$ is the estimated probability of the $i$-th observation is of class $k$.

Cross entropy loss for $$K$$-class classification problem is 

$$
\frac{1}{n} \sum_{i=1}^n \text{Loss}(y_i,\hat{p}_i) = \frac{1}{n} \sum_{i=1}^n \sum_{k=1}^K -y_{ik} \log \hat{p}_{ik}, 
$$

In the formula above, $y_i$ and $\hat{p}_ i$ are the vectors with dimension $K \times 1$; $y_{ik}$ and $$\hat{p}_{ik}$$ are the $k$-th elements in the vectors $y_i$ and $$\hat{p}_i$$ respectively; $y_{ik}=1$ if the $i$-th observation is of class $k$, and $y_{ik}=0$ otherwise. 

### 2.2 Binary LR

For binary classification, the softmax function is degraded to sigmoid function. Then the binary logistic regression can be written as

$$
\hat{p}_i = \frac{1}{1+e^{-z_i}}, \\z_i = w^Tx_i + b,
$$

where the weights (coefficients) $w$ and and the $i$-th observation $x_i$ are both the vectors of dimension $p\times 1$; the bias $$b$$ is a scalar; $\hat{p}_i$ and $z_i$ are both scalar; $$\hat{p}_{i}$$ is the estimated probability of the $i$-th observation is of the positive class.

For binary classification problem, the cross entropy is 

$$
\frac{1}{n} \sum_{i=1}^n \big[ -y_i \log \hat{p}_i - (1-y_i) \log(1-\hat{p}_i) \big],
$$

where $y_i$ and $\hat{p}_i$ are both scalar, and $y_i$ can only be $0$ or $1$. 

#### 2.3 Gradient Descent for LR

For simplicity, let's look at the gradient descent for binary logistic regression.

The partial derivative of the loss with respect to $\hat{p}_i$:

$$
\frac{\partial \text{Loss}(y_i, \hat{p}_i)} {\partial \hat{p}_i} =  -\frac{y_i}{\hat{p}_i} + \frac{1-y_i}{1-p_i}.
$$

The partial derivative of $\hat{p}_i$ with respect to $z_i$:

$$
\frac{\partial \hat{p}_i} {\partial z_i} =  \frac{-e^{-z_i}}{(1+e^{-z_i})^2} = \frac{-1}{1+e^{-z_i}} \cdot \frac{e^{-z_i}}{1+e^{-z_i}} = -\hat{p}_i (1-\hat{p}_i).
$$

The partial derivative of $z_i$ with respect to $w$ and $$b$$:

$$
\frac{\partial z_i} {\partial w} = x_i, \frac{\partial z_i} {\partial b} = 1.
$$

Thus, we have the gradients:

$$
\frac{\partial \text{Loss}(y_i, \hat{p}_i)} {\partial w} =  \frac{\partial \text{Loss}(y_i, \hat{p}_i)} {\partial \hat{p}_i} \cdot \frac{\partial \hat{p}_i} {\partial z_i} \cdot \frac{\partial z_i} {\partial w} = (\hat{p}_i - y_i) x_i, \\
\frac{\partial \text{Loss}(y_i, \hat{p}_i)} {\partial b} = \frac{\partial \text{Loss}(y_i, \hat{p}_i)} {\partial \hat{p}_i} \cdot \frac{\partial \hat{p}_i} {\partial z_i} \cdot \frac{\partial z_i} {\partial b} = \hat{p}_i - y_i.
$$

The gradient descent of parameters can be shown as:

$$
w^{[t]} = w^{[t-1]} - \alpha \cdot \frac{1}{n}\sum_{i=1}^{n} \frac{\partial \text{Loss}(y_i, \hat{p}_i^{[t-1]})} {\partial w^{[t-1]}} = w^{[t-1]} - \alpha \cdot \frac{1}{n}\sum_{i=1}^{n} (\hat{p}_i^{[t-1]} - y_i) x_i, \\
b^{[t]} = b^{[t-1]} - \alpha \cdot \frac{1}{n}\sum_{i=1}^{n} \frac{\partial \text{Loss}(y_i, \hat{p}_i^{[t-1]})} {\partial b^{[t-1]}} = b^{[t-1]} - \alpha \cdot \frac{1}{n}\sum_{i=1}^{n} (\hat{p}_i^{[t-1]} - y_i).
$$

where $t$ is the index of iteration, and $\alpha$ is the learning rate (step size).

​	

**Comparisons** between LDA and LR:

The LR model is more robust and more general, in that it makes less assumptions. LDA is not robust to gross outliers, because observations far from the decision boundary (which are down-weighted by logistic regression) play a role in estimating the common covariance matrix. LDA assumes the distribution of the data. By relying on the additional model assumptions, we have more information about the parameters, and hence can estimate them more efficiently (lower variance). Otherwise, it will pay a price for focusing on the (noisier) data.

​	

**References**:

Friedman, Jerome, Trevor Hastie, and Robert Tibshirani. *The elements of statistical learning*. Vol. 1. No. 10. New York: Springer series in statistics, 2001.

周志华. *机器学习*. 清华大学出版社, 2016. 