---
layout: post
title: "Feature Selection Methods"
date: 2020-07-27
categories: ml
published: true
comments: true
---

## Introduction

**Feature selection** (or **variable selection**, or **attribute selection**) is the process of selecting a subset of informative features for use in model construction. 

Feature selection is different from dimensionality reduction. Both methods seek to reduce the number of features in the dataset, but a dimensionality reduction method (e.g. PCA) do so by creating new combinations of features, where as feature selection methods include and exclude features present in the data without changing them. 

There are many potential **benefits of feature selection**: 

- Reducing training and utilization times; 
- Defying the curse of dimensionality, removing useless noise features, and reducing overfitting to improve prediction performance; 
- Helping to understand and explain model;
- Facilitating data visualization and data understanding; 
- Reducing the measurement and storage requirements. 

Denote the data as $$X = (x^{(1)}, x^{(2)}, \cdots, x^{(p)}) \in\mathbb{R}^{n\times p}$$ with $n$ observations and $p$ features. The original features are $$\{x^{(j)}\}_{j=1}^p$$. Feature selection can be considered as a hyperparameters tuning procedure, where the hyperparameters are $$\{s_j\}_{j=1}^p$$ and $$s_j\in\{0,1\}$$, then the selected features can be expressed as $$\{s_jx^{(j)}\}_{j=1}^p$$. Remember that we should use training and validation set to do hyperparameters tuning, not only the training set, to avoid overfitting. 

Next we introduce three general classes of feature selection methods: filter methods, wrapper methods and embedded methods. 

## Filter Methods

**Filter methods** apply a statistical measure to assign a scoring to each feature with respect to target variable, and then rank features by the score. 

Filter methods are often univariate and consider the features independently with regard to the dependent variable. However, **a single feature that is completely useless by itself can provide a significant performance improvement when taken with others**, so we may try kernel methods to produce some new features (e.g. cross products) before applying filter methods. 

Some examples of some filter methods include the **correlation coefficient**, **Chi squared test**, **information gain** and **mutual information**. 

### Correlation Coefficient

$$
\text{Corr}(x^{(j)},y) = \frac{\text{Cov}(x^{(j)},y)}{\sqrt{\text{Var}(x^{(j)}) \text{Var}(y)}} = \frac{\sum_{i=1}^n (x_i^{(j)} - \bar{x}^{(j)}) (y_i - \bar{y})}{\sqrt{\sum_{i=1}^n (x_i^{(j)} - \bar{x}^{(j)})^2 \cdot \sum_{i=1}^n (y_i - \bar{y})^2}}.
$$

Correlation criteria can only detect linear dependencies between features and target variable $y$.

### Information Gain

The information gain is commonly used in classification methods like decision trees. It is the expected reduction in entropy of target $y$ caused by partitioning the observations according to a feature $x_j$, and it is calculated as

$$
\text{IG}\left(H(y),x_j\right) = H(y) - H(y\mid x_j),
$$

where $H(y)$ is the entropy of target $y$ before any change and $$H(y\mid x_j)$$ is the conditional entropy for $y$ given feature $x_j$. 

$$
H(y\mid x_j) = \sum_v \frac{\#\{x_j = v\}}{n} H(\{x_j=v\}),
$$

where $$\#\{x_j=v\}$$ is the number of observations in the dataset with feature $x_j$ has the value $v$, and $$H(\{x_j=v\})$$ is the entropy of group of obseravtions where variable $x_j$ has the value $v$. 

High information gain means that the feature is useful for predicting the target.

### Mutual Information

Mutual information measures the mutual dependence between the two random variables, or equivalently, measures the information that these two random variables share. More specifically, it quantifies the "amount of information" obtained about one random variable through observing the other random variable. 

Not limited to linear dependence like the correlation coefficient, mutual information is more general and determines how different the joint distribution $$P_{(x_j,y)}(x_j,y)$$ is to the product of the marginal distributions $$P_{x_j}(x_j)P_{y}(y)$$. 

The mutual information for feature $x_j$ and target $y$ is calculated as

$$
I(x_j,y) = \sum_{v}\sum_{u} P_{(x_j,y)}(x_j=v,y=u) \log \frac{P_{(x_j,y)}(x_j=v,y=u)}{P_{x_j}(x_j=v)P_{y}(y=u)}.
$$

High mutual information means that the feature is useful for predicting the target.

## Wrapper Methods

**Wrapper methods** consider the selection of a set of features as a search problem, where different combinations are prepared, evaluated and compared to other combinations. A predictive model is used to evaluate a combination of features and assign a score based on model accuracy.

The search process may be methodical such as a best-first search, it may stochastic such as a random hill-climbing algorithm, or it may use heuristics, like forward and backward passes to add and remove features.

An example of a wrapper method is the **recursive feature elimination** algorithm. 

### Forward Selection

Forward selection methods sequentially add into the model the feature that most improves the model performance. It is a greedy algorithm, producing $p$ models, then we can select a single best model from among using cross-validated prediction error, $C_p$, AIC or BIC etc. 

Advantages: computationally efficient; can be used even when $p>n$. 

Disadvantages: errors made at the beginning cannot be corrected later. 

### Backward Selection

Backward selection starts with the full model, and sequentially deletes the feature that has the least impact on the model performance. This method also produces $p$ models, and we can select a best one by using the same criteria as that in forward selection. 

Advantages: can throw out the "right" feature by looking at the full model. 

Disadvantages: computationally inefficient (start with the full model); cannot work if $p>n$.

### Forward vs. Backward Selection

The best subset of features can be selected by comparing every possible subset, but that is usually computationally unaffordable, so we use forward or backward selection as a compromise. 

| Method            | Optimality            | Computation  |
| ----------------- | --------------------- | ------------ |
| Best subset       | Best model guaranteed | $$2^p$$      |
| Forward stepwise  | No guarantee          | $$p(p-1)/2$$ |
| Backward stepwise | No guarantee          | $$p(p-1)/2$$ |

It is often argued that forward selection is computationally more efficient than backward elimination to generate nested subsets of features. 

However, the defenders of backward elimination argue that weaker subsets are found by forward selection because the importance of variables is not assessed in the context of other variables not included yet.

## Embedded Methods

**Embedded methods** learn which features best contribute to the performance of the model while the model is being trained. The most common type of embedded methods are regularization methods. Remember that we need to normalize features before applying regularization methods. Also, **tree based** or **tree ensemble** methods can also evaluate feature importance through training. 

Examples of embedded methods are linear or logistic regression with **L1 regularization**, since L1-norm shrinks some coefficients to $0$ and produces sparse coefficients. 

---

**References**: 

Guyon, I., & Elisseeff, A. (2003). An introduction to variable and feature selection. *Journal of machine learning research*, *3*(Mar), 1157-1182. 

Brownlee, J. (2019, Oct 16). Information Gain and Mutual Information for Machine Learning. *Machine Learning Mastery*. Retrieved July 27, 2020, from https://machinelearningmastery.com/information-gain-and-mutual-information.

Brownlee, J. (2014, Oct 6). An Introduction to Feature Selection. *Machine Learning Mastery*. Retrieved July 27, 2020, from https://machinelearningmastery.com/an-introduction-to-feature-selection. 
