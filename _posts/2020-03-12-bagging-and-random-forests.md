---
layout: post
title:  "Bagging and Random Forests"
date: 2020-03-12
categories: ML
tags: [Ensemble learning, ML models]
comments: true
---

## 1. Bootstrap

The basic idea is to randomly draw datasets with replacement from the training data, each
sample the same size as the original training set. This is done $$B$$ times ($$B = 100$$ say), producing $$B$$ bootstrap datasets. 

Nonparametric bootstrap: sample with replacement from the training data. Parametric bootstrap: in which we simulate new responses by adding Gaussian noise to the predicted values.

Bootstrap can access the accuracy (e.g. derive estimates of standard errors and confidence intervals) of a parameter estimate or a prediction.  

## 2. Bagging

Bootstrap aggregation or bagging averages the prediction over a collection of bootstrap samples, thereby reducing its variance. Bagging can dramatically reduce the variance of unstable procedures like trees, leading to improved prediction. For regression tree, we simply fit the same regression tree many times to bootstrap-sampled versions of the training data, and average the result. For classification, a committee of trees each cast a vote for the predicted class.

For each bootstrap sample $Z^{∗b},\ b = 1,2,...,B$, we fit our model, giving prediction $\hat{f}^{*b}(x)$. The bagging estimate is defined by

$$
\hat{f}_{\text{bag}}(x) = \frac{1}{B} \sum_{b=1}^{B} \hat{f}^{*b}(x).
$$

The bagged estimate $\hat{f}_{\text{bag}}(x)$ will differ from the original estimate $\hat{f}(x)$ only when the latter is a nonlinear or adaptive function of the data. 

### 2.1 Out of Bag Error

The probability of a observation is not be selected in the bootstrap sample is  $(1-\frac{1}{n})^n \to \frac{1}{e}$. For each bootstrap sample, we have about $36.8\%$ ($\frac{1}{e}$) of observations are not included in it. We can use these **out-of-bag samples** to compute the **out-of-bag error** (global estimate of the mean prediction error) of the model build on the bootstrap sample.

How to compute out-of-bag error?

For each $x_i$ in training data set, get prediction $$\hat{y}_{i \text{(oob)}}$$ by the estimators (e.g. trees) that were trained without $$x_i$$. Then the out-of-bag error is $$\frac{1}{N}\sum_{i=1}^{N} \text{Loss}(y_i, \hat{y}_{i\text{(oob)}})$$.

|             | $Z^{∗1} \to f^{*1}$ | $Z^{∗2} \to f^{*2}$ | $Z^{∗3} \to f^{*3}$ | ...  | $Z^{∗B} \to f^{*B}$ |
| ----------- | ------------------- | ------------------- | ------------------- | ---- | ------------------- |
| $(x_1,y_1)$ | ✓                   | ✗                   | ✗                   | ...  | ✓                   |
| $(x_2,y_2)$ | ✗                   | ✗                   | ✓                   | ...  | ✓                   |
| ...         | ...                 | ...                 | ...                 | ...  | ...                 |
| $(x_N,y_N)$ | ✓                   | ✓                   | ✗                   | ...  | ✗                   |

In the example above, $(x_2,y_2)$ is not used in bootstrap samples $Z^{∗1}$ and $Z^{∗2}$ to train the estimator $$f^{*1}$$ and $$f^{*2}$$, so $$\hat{y}_{2\text{(oob)}} = \text{average}\Big(\hat{f}^{*1}(x_2),\hat{f}^{*2}(x_2)\Big)$$. 

The OOB error estimate is almost identical to that obtained by cross-validation. Once the OOB error stabilizes, the training can be terminated. 

### 2.2 Comparison with Boosting

Bagging can rarely get lower bias compared to a single model, however, boosting can. That is because each estimator $f^{*b}$ generated in bagging is identically distributed (i.d.), the expectation of an average of $B$ such estimators is the same as the expectation of any one of them. This means the bias of bagged estimators is the same as that of the individual estimator. This is in contrast to boosting, where the estimators are trained in an adaptive way to remove bias, and hence are not i.d. 

Bagging can help to avoid over-fitting, but boosting can increase this problem. 

| **Similarities**                                             | **Differences**                                              |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| Both make the final decision by averaging some learners …    | … but it is an equally weighted average for Bagging and a weighted average for Boosting, more weight to those with better performance on training data. |
| Both are good at reducing variance and provide higher stability… | … but only Boosting tries to reduce bias. On the other hand, Bagging may solve the over-fitting problem, while Boosting can increase it. |

## 3. Random Forests

The essential idea in bagging is to average many noisy but approximately unbiased models, and hence reduce the variance.  Bagging seems to work especially well for high-variance, low-bias procedures, such as trees. Trees are ideal candidates for bagging, since they can capture complex interaction structures in the data, and if grown sufficiently deep, have relatively low bias. Since trees are notoriously noisy (unstable), they benefit greatly from the averaging.

Random forests (Breiman, 2001) is a substantial modification of bagging that builds a large collection of de-correlated trees, and then averages them. On many problems the performance of random forests is very similar to boosting, and they are simpler to train and tune. As a consequence, random forests are popular. 

### 3.1 Reduce the Correlation

Suppose there are $B$ i.i.d. random variables $t_1, \dots, t_B$, each with the variance $\sigma^2$. The average has variance $\frac{σ^2}{B}$. If the variables $t_1, \cdots , t_B$ are simply i.d. (identically distributed, but not necessarily independent) with positive pairwise correlation $ρ$, the variance of the average is 

$$ \begin{align}
\text{Var}(\frac{1}{B} \sum_{b=1}^{B} t_b) &= \frac{1}{B^2} \text{Var}( \sum_{b=1}^{B} t_b) \\
&= \frac{1}{B^2} \sum_{b,b'=1}^{B} \text{Cov}(t_b, t_{b'}) \\
&= \frac{1}{B^2} \Big[ \sum_{b=1}^{B} \text{Var}(t_b) + \sum_{b \neq b'} \text{Cov}(t_b, t_{b'}) \Big] \\
&= \frac{1}{B^2} \Big[ B \sigma^2 + B(B-1) \rho \sigma^2 \Big] \\
&= \rho \sigma^2 + \frac{1-\rho}{B} \sigma^2.
\end{align} $$

As $B$ increases, $\rho \sigma^2 + \frac{1-\rho}{B} \sigma^2 \to \rho \sigma^2$, and hence the correlation $ρ$ of pairs of bagged trees limits the benefits of averaging. 

The idea in random forests is to improve the variance reduction of bagging by reducing the correlation $\rho$ between the trees, without increasing the variance $\sigma^2$ too much. This is achieved in the tree-growing process through **random selection of the input variables**.

### 3.2 Algorithm

**Algorithm: Random Forest for Regression or Classification.**

[1] For $b = 1$ to $B$, execute the steps (a) and (b):

&nbsp;&nbsp; (a) Draw a bootstrap sample $Z^{∗b}$ of size $N$ from the training data.

&nbsp;&nbsp; (b) Grow a random-forest tree $T_b$ to the bootstrapped data, by recursively repeating the following steps for each terminal node of the tree, until the minimum node size is reached.

&nbsp;&nbsp;&nbsp;&nbsp; i. Select $m$ features at random from the $p$ features.

&nbsp;&nbsp;&nbsp;&nbsp; ii. Pick the best variable/split-point among the $m$ features.

&nbsp;&nbsp;&nbsp;&nbsp; iii. Split the node into two daughter nodes.

[2] Output the ensemble of trees $$ \{ T_b \} ^B_1 $$.

### 3.3 Variable Importance

There are two popular metrics to measure variable importance.

#### 3.3.1 Mean Decrease in Impurity (MDI)

This is the same as the relative importance of predictor variables that is introduced in the section 10.13.1 of ESL.

For a single decision tree $T_b$, the importance of the variable $$X_j$$ (denote as $$\mathcal{I}_j^2(T_b)$$) can be measured by the sum of the improvements in loss after partition regions by variable $X_j$ over all nodes. 

For additive tree expansions, it is simply averaged over the trees $$\mathcal{I}_j^2 = \frac{1}{B} \sum_{b=1}^{B} \mathcal{I}_j^2(T_b)$$, it can also be written as 

$$
\hat{\text{MDI}}(X_j) = \frac{1}{B} \sum_{b=1}^{B} \sum_{\text{nonterminal} \\ \text{nodes}}(\text{Decrease in Impurity from spliting the j-th variable}).
$$

#### 3.3.2 Mean Decrease in Accuracy (MDA)

After we computed the OOB error, we randomly permute the values for the $j$-th variable ($j=1,...,p$), and fit the model with it and all other variables, and then compute the OOB error again. Permutation on the important variable leads to a large increase of OOB error. 

$$
\hat{\text{MDA}}(X_j)= \text{Difference in the OOB error before and after randomly} \\ \text{permuting the values of }j\text{-th variable in the out-of-bag samples.}
$$

This metric is more computationally expensive and accurate. 

### 3.4 Robustness and No Overfitting

When the number of variables is large, but the fraction of relevant variables (useful variables) small, random forests are likely to perform poorly with small $m$.

Random Forests is **robust** with the appropriate $m$. When the number of relevant variables (useful variables) increases, the performance of random forests is surprisingly robust to an increase in the number of noise variables. For example, with $6$ relevant and $100$ noise variables, the probability of a relevant variable being selected at any split is $0.46$, assuming $m=\sqrt{6+100} \approx 10$. 

Random forests "**cannot overfit**" the data. It is certainly true that increasing $B$ does not cause the random forest sequence to overfit.

### Tips

Suppose training contains $$N$$ observations, and we select $m$ features in each splitting, then the **time complexity** for training $$B$$ trees (each with depth $$d$$) is $$O(BNmd)$$. The prediction time for a input is $$O(Bd)$$. 

For classification, we usually set $m$ as $⌊\sqrt{p}⌋$, and the minimum number of observations in each leaf or terminal node (minimum leaf node size) $1$.

For regression, we usually set $m$ as $⌊p/3⌋$, and the minimum leaf node size as $5$.

<br>

**Reference:**

Friedman, Jerome, Trevor Hastie, and Robert Tibshirani. *The elements of statistical learning*. Vol. 1. No. 10. New York: Springer series in statistics, 2001.