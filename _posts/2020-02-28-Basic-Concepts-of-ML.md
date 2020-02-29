---
layout: post
title:  "Basic Concepts of Statistical Learning"
date: 2020-02-28
categories: ML
comments: true
---

## 1. Basic Assumption

We assume that there is some relationship between $Y$ and $X$ which can be written as $Y = f(X) + \epsilon$. Here $f$ is some fixed but unknown function and $\epsilon$ is a random error term, which is independent of $X$ and has mean zero. 

## 2. Why Estimate $f$ ?

There are two main reasons: prediction and inference.

### 2.1 Prediction

The prediction $\hat{Y} = \hat{f}(X).$ The goal of prediction is to learn a function $f$ such that $f(X)$ is closed to $Y$.

The accuracy of $\hat{Y}$ as a prediction for $Y$ depends on two quantities, which we will call the reducible error (introduced by X) and the irreducible error (introduced by $\epsilon$). $Y$ is a function of X and $\epsilon$. Consider the expectation of the squared loss:

$$
E(Y-\hat{Y})^2 = E[f(X)+\epsilon-\hat{f}(X)]^2 = E[f(X)-\hat{f}(X)]^2+Var(\epsilon).
$$

The first item (expectation) is reducible and the second (variance) is irreducible.                     

### 2.2 Inference

For inference, we want to understand the relationship between $X$ and $Y$, or more specifically, to understand how $Y$ changes as a function of $X_1 , . . . , X_p$. Now $\hat{f}$ cannot be treated as a black box, because we need to know its exact form. 

## 3. How Do We Estimate $f$ ?

### 3.1 Parametric Methods

Parametric methods involve a two-step model-based approach.

1. Select model. We make an assumption about the functional form, or shape of $f$.For example, linear model. 

2. Fit or train the model. 

Advantages compared to non-parametric methods: need less observations, harder to over-fit, more interpretable, easier to do inference.

### 3.2 Non-parametric Methods

Non-parametric methods do not make explicit assumptions about the functional form of $f$. Instead they seek an estimate of $f$ that gets as close to the data points as possible without being too rough or wiggly. 

Advantage compared to parametric methods: flexible. By avoiding the assumption of a particular functional form for $f$, they have the potential to accurately fit a wider range of possible shapes for $f$ compared to parametric method.

## 4. Trade-Off 

### 4.1 Flexibility-Interpretability Trade-Off

The flexible models are usually more accurate and less interpretable. Linear regression is interpretable but not flexible, and neural network is the opposite. 

[high Interpretability, low Flexibility] Subset Selection (e.g. LASSO), Least Squares, Generalized Additive Models (GAM) (e.g. Trees), Bagging or Boosting, SVM. [low Interpretability, high Flexibility] 

Note: SVM with non-linear kernels is non-linear methods.

### 4.2 Bias-Variance Trade-Off

For regression, assume $Y = f+\epsilon,E(\epsilon) = 0$, then we have 

$$
E[(Y-\hat{f})^2] = \text{Var}(\hat{f}) + \text{Bias}^2(\hat{f}) + \text{Var}(\epsilon).
$$

**More flexible methods leads to higher variance and lower bias.**

Variance $\text{Var}(\hat{f})$ refers to the amount by which $ \hat{f} $ would change if we estimated it using a different training data set. In general, more flexible statistical methods have higher variance.

Bias $\text{Bias}(\hat{f})$ refers to the error that is introduced by approximating a real-life problem. For example, linear regression assumes that there is a linear relationship between $Y$ and $X$. It is unlikely that any real-life problem truly has such a simple linear relationship, and so performing linear regression will undoubtedly result in some bias in the estimate of $f$. Generally, more flexible methods result in less bias.



---

Reference: James, Gareth, et al. "Statistical Learning." *An introduction to statistical learning*. Vol. 112. New York: springer, 2013.