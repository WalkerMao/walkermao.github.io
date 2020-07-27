---
layout: post
title:  "Linear Regression"
date: 2020-03-01
categories: ML
comments: true
---

A linear regression model assumes that the regression function $$E(y_i \mid x_i)$$ is linear in the inputs $$ x_i^{(1)}, \cdots, x_i^{(p)} $$. The linear regression model has the form $$ \hat{y}_i = f(x_i) =  \beta_0 + \underset{1 \times p}{\beta^T} \ \underset{p \times 1}{x_i} = \beta_0 + \sum_{j=1}^{p} \beta^{(j)} x_i^{(j)} $$. If we set a $$1$$ in the first position of the vector $$x_i$$, then we can dismiss the intercept and the regression model can be written as $$ \hat{y}_i = f(x_i) = \underset{1 \times p}{\beta^T} \ \underset{p \times 1}{x_i} = \sum_{j=1}^{p} \beta^{(j)} x_i^{(j)} $$.

### Ordinary Least Squares

The residual sum of squares: $$ \text{RSS}(\beta) = (y-X \beta)^T (y-X \beta) = \|y - X\beta \|^2_2 = \sum_{i=1}^{n}(y_i - \beta^T x_i)^2$$.

OLS (ordinary least squares) estimator $$\hat{\beta} = \underset{\beta \in \mathbb{R}^p}{\text{argmin}} \ \text{RSS}(\beta) = (X^T X)^{-1} X^T y$$. 

Hat matrix $$H = X (X^T X)^{-1} X^T$$, which is positive semi-definite.

Assume $$\epsilon \sim N(0, \sigma^2)$$, then $$\hat{\beta} \sim N(\beta, (X^TX)^{-1} \sigma^2)$$. 

More on *The elements of Statistical Learning* Page 47-49. 

The Gauss-Markov Theorem: Least squares estimates of the parameter $\beta $ has the smallest variance among all linear unbiased estimates. This theorem means that the OLS estimator is BLUE (best linear unbiased estimator).

Derivation of OLS estimator: The first and second partial derivatives are $$\frac{\partial \text{RSS}(\beta)}{\partial \beta} = -2 X^T (y-X \beta), \frac{\partial^2 \text{RSS}(\beta)}{\partial \beta \partial \beta^T} = 2 X^T X$$. Assuming that $$X$$ has full column rank, and hence $$X^TX$$ is positive definite, we set the first derivative to zero and then we get the solution $$\hat{\beta} = (X^T X)^{-1} X^T y$$.

### Subset Selection

There are two reasons why we do variable subset selection: 

* The first is **prediction accuracy**: the least squares estimates often have low bias but large variance. Prediction accuracy can sometimes be improved by shrinking or setting some coefficients to zero. By doing so we sacrifice a little bit of bias to reduce the variance of the predicted values, and hence may improve the overall prediction accuracy. 
* The second reason is **interpretation**. With a large number of predictors, we often would like to determine a smaller subset that exhibit the strongest effects. 

**Forward-stepwise selection**

Forward-stepwise starts with the intercept $$\bar{y}$$, and then sequentially adds into the model the predictor that most improves the fit. It is a greedy algorithm, producing a nested sequence of models $M_0,M_1,...,M_P$, then we can select a single best model from among using cross-validated prediction error, $C_p$ (AIC), BIC or adjusted $R^2$. 

The computation is $p(p-1)/2$. Advantages: computationally efficient, smaller variance as compared to best subset selection, but perhaps more bias; it can be used even when $p>n$.  Disadvantages: errors made at the beginning cannot be corrected later.

**Backward-stepwise selection**

Backward-stepwise starts with the full model, and sequentially deletes the predictor that has the least impact on the fit.

Advantages: can throw out the "right" predictor by looking at the full model. Disadvantages: computationally inefficient (start with the full model), cannot work if $p>n$ .

| Method            | Optimality            | Computation  |
| ----------------- | --------------------- | ------------ |
| Best subset       | Best model guaranteed | $$2^p$$      |
| Forward stepwise  | No guarantee          | $$p(p-1)/2$$ |
| Backward stepwise | No guarantee          | $$p(p-1)/2$$ |

There are several selection criteria like: $$C_p$$, AIC, BIC, Adjusted $$R^2$$.

### Shrinkage Methods

Linear regression with L1-norm is LASSO and L2-norm is ridge regression.

**Ridge regression**: $$\hat{\beta} = \underset{\beta \in \mathbb{R}^p}{\text{argmin}} \Big(\| y - X\beta \| ^2_2 + \lambda \| \beta \|^2_2 \Big) = (X^T X + \lambda I)^{-1} X^T y$$.

**LASSO**: $$ \hat{\beta} = \underset{\beta \in \mathbb{R}^p}{\text{argmin}} \Big( \|Y - X\beta \|^2_2 + \lambda \| \beta \|_1 \Big) $$.

![LASSO-and-Ridge](/pictures/LASSO-and-Ridge.png)

L1-norm shrinks some coefficients to $0$ and produces sparse coefficients, so it can be used to do feature selection. The sparsity makes the model more computationally efficient when doing prediction. L2-norm is differentiable so it has an analytical solution and can be calculated efficiently when training model. 