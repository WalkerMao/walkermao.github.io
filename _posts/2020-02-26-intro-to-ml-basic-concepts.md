---
layout: post
title:  "Intro to Machine Learning: Basic Concepts"
date: 2020-02-26
categories: ml stat
comments: true
---

## 1. Basic Assumption

We assume that there is some relationship between $Y$ and $X$ which can be written as $Y = f(X) + \epsilon$. Here $f$ is some fixed but unknown function and $\epsilon$ is a random error term, which is independent of $X$ and has mean zero. 

## 2. Why Estimate $f$ ?

There are two main reasons: prediction and inference.

### 2.1 Prediction

The prediction $\hat{Y} = \hat{f}(X).$ The goal of prediction is to learn a function $f$ such that $f(X)$ is closed to $Y$.

The accuracy of $\hat{Y}$ as a prediction for $Y$ depends on two quantities, which we will call the reducible error (introduced by $$X$$) and the irreducible error (introduced by $\epsilon$). $Y$ is a function of $X$ and $\epsilon$. Consider the expectation of the squared loss:

$$
E(Y-\hat{Y})^2 = E[f(X)+\epsilon-\hat{f}(X)]^2 = E[f(X)-\hat{f}(X)]^2 + \text{Var} (\epsilon).
$$

The first item (expectation) is reducible and the second (variance) is irreducible.                     

### 2.2 Inference

For inference, we want to understand the relationship between $X$ and $Y$, or more specifically, to understand how $Y$ changes as a function of $X_1 , . . . , X_p$. Now $\hat{f}$ cannot be treated as a black box, because we need to know its exact form. 

## 3. How Do We Estimate $f$ ?

### 3.1 Parametric Methods

Parametric methods involve a two-step model-based approach.

1. Select model. We make an assumption about the functional form, or shape of $f$. For example, linear model. 

2. Fit or train the model. 

Advantages compared to non-parametric methods: need less observations, harder to over-fit, more interpretable, easier to do inference.

### 3.2 Non-parametric Methods

Non-parametric methods do not make explicit assumptions about the functional form of $f$. Instead they seek an estimate of $f$ that gets as close to the data points as possible without being too rough or wiggly. 

Advantage compared to parametric methods: flexible. By avoiding the assumption of a particular functional form for $f$, they have the potential to accurately fit a wider range of possible shapes for $f$ compared to parametric method. 

## 4. Types of Machine Learning Algorithms

### 4.1 Regression and Classification

- Regression problem: Target variable $$Y$$ is continuous.

- Classification problem: Target variable $$Y$$ is discrete.

### 4.2 Supervised, Unsupervised, Semi-supervised, and Reinforcement

- Supervised learning: Target variable is available. E.g. regression and classification.

- Unsupervised learning: Target variable is not available. E.g. clustering, dimensionality reduction, and association.

### 4.3 Generative and Discriminative

Both these two types of models are for classification problems.

#### 4.3.1 Generative Model

Generative model learns the joint probability distribution $$P(X,Y)$$. 

Steps:

1. Assume some functional form for $$P(Y)$$, $$P(X\mid Y)$$;
2. Estimate parameters of $$P(Y)$$, $$P(X\mid Y)$$ directly from training data;
3. Use Bayes rule to calculate $$P(X,Y)$$ and also $$P(Y \mid X)$$. 

Examples: Naive Bayes classifier, supervised learning Gaussian mixture model (SLGMM), hidden Markov model (HMM), etc..

#### 4.3.2 Discriminative Model

Discriminative model learns the conditional probability distribution $$P(Y \mid X)$$ or the discriminant function $$\delta(X)$$.

Steps:

1. Assume some functional form for $$P(Y \mid X)$$;
2. Estimate parameters of $$P(Y \mid X)$$ directly from training data.

Examples: Logistic regression, SVM, decision tree, etc.. 

## 5. Trade-off 

### 5.1 Flexibility-Interpretability Trade-off

The flexible models are usually more accurate and less interpretable. For example, linear regression is interpretable but not flexible, and neural network is the opposite. 

[high Interpretability, low Flexibility] Subset Selection (e.g. LASSO), Least Squares, Generalized Additive Models (GAM) (e.g. Trees), Bagging or Boosting, SVM. [low Interpretability, high Flexibility] 

Note: SVM with non-linear kernels is non-linear methods.

### 5.2 Bias-Variance Trade-off

For regression, assume $Y = f+\epsilon,E(\epsilon) = 0$, and $\epsilon$ is independent with $f$ and $\hat{f}$, then we have 

$$\begin{align*}
E[(Y-\hat{f})^2] &= E[(f-\hat{f}+\epsilon)^2] \\
&= E[(f-\hat{f})^2] + E(\epsilon^2) + 2E(f-\hat{f})E(\epsilon) \\ 
&= E(\hat{f}^2) + f^2 - 2fE(\hat{f}) + \text{Var}(\epsilon) + 0\\ 
&= \big[ E(\hat{f}^2) - E^2(\hat{f}) \big] + \big[ E^2(\hat{f}) + f^2 - 2fE(\hat{f}) \big] + \text{Var}(\epsilon) \\
&= \text{Var}(\hat{f}) + [E(\hat{f})-f]^2 + \text{Var}(\epsilon) \\
&= \text{Var}(\hat{f}) + \text{Bias}^2(\hat{f}) + \text{Var}(\epsilon).
\end{align*}$$

**More flexible methods leads to higher variance and lower bias.**

Variance $\text{Var}(\hat{f})$ refers to the amount by which $ \hat{f} $ would change if it is by a different training data set. If the model $$\hat{f}$$ uses too much information from the the training data, it may do not generalize well. Typically, the model will change a lot if you change the training set, hence the "high variance" name. In general, more flexible statistical methods have higher variance.

Bias $\text{Bias}(\hat{f})$ refers to the error that is introduced by approximating a real-life problem. For example, linear regression assumes that there is a linear relationship between $Y$ and $X$. It is unlikely that any real-life problem truly has such a simple linear relationship, and so performing linear regression will undoubtedly result in some bias in the estimate of $f$. Generally, more flexible methods result in less bias.

Note: It is possible to have a model that has lower variance and lower bias simultaneously. For example, boosting method can reduce both variance and bias. 

---

**References**: 

James, Gareth, et al. "Statistical Learning." *An introduction to statistical learning*. Vol. 112. New York: springer, 2013.

Friedman, Jerome, Trevor Hastie, and Robert Tibshirani. *The elements of statistical learning*. Vol. 1. No. 10. New York: Springer series in statistics, 2001.