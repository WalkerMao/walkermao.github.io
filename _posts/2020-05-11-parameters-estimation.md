---
layout: post
title:  "Parameters Estimation: MLE, MAP and Bayesian"
date: 2020-05-11
categories: stat
comments: true
---

In this post, let's introduce and compare three methods (MLE, MAP and Bayesian) for **parameters estimation**.

Given the observed data $$X = \{ x_i \}_{i=1}^n$$, we want to estimate the probabilistic model's parameter $$\theta$$. Denote $$f(*)$$ as the probability density function of $$*$$ if $$*$$ is a continuous random variable, or the probability mass function if $$*$$ is a discrete random variable. 

## MLE

MLE (Maximum Likelihood Estimation) is a frequenist method, and it consider the parameters as fixed and unknown constants. Given the observed data $$X$$, MLE seeks out the value for $$\theta$$ that provides maximum support for the observed data $$X$$. That is, MLE simply select $$\theta$$ that maximize the likelihood: 

$$
\hat{\theta}_{\text{MLE}} = \underset{\theta}{\text{argmax }}  \mathcal{L}(\theta \mid X) = \underset{\theta}{\text{argmax }}  f(X \mid \theta),
$$

where $$\mathcal{L}(\theta \mid X)$$ is the likelihood function, and it is considered as a function of parameter $$\theta$$.

If we assume $$x_i$$'s are independent, then $$f(X \mid \theta) = \prod_{i=1}^n f(x_i \mid \theta)$$.

Since the logarithm is a monotonically increasing function of its argument, maximizing likelihood is equivalent to maximizing its logarithm (i.e. log-likelihood), which means:

$$
\hat{\theta}_{\text{MLE}} = \underset{\theta}{\text{argmax }}  \mathcal{L}(\theta \mid X) = \underset{\theta}{\text{argmax }}  \log \mathcal{L}(\theta \mid X).
$$

Note that the derivative of a sum is just the sum of the derivatives, but the derivative of a product requires the product rule. Maximizing log-likelihood is usually much easier than maximizing likelihood since logarithm transform the product to sum:

$$
\log \mathcal{L}(\theta \mid X) = \log \prod_{i=1}^n f(x_i \mid \theta) = \sum_{i=1}^n \log f(x_i \mid \theta).
$$

The MLE solution is usually obtained by setting the derivative of log-likelihood function $$\log \mathcal{L}(\theta \mid X)$$ with respect to the parameter $$\theta$$ to zero: $$\frac{\partial \log \mathcal{L}(\theta \mid X)}{\partial \theta} = 0$$.

## MAP

MAP (Maximum A Posterior) is a Bayesian method. MAP considers the parameter $$\theta$$ as random, and assumes it can take values from a distribution $$f(\theta)$$ that expresses our prior beliefs regarding $$\theta$$. By Bayes rule, we have

$$
f(\theta \mid X) = \frac{f(X \mid \theta)f(\theta)}{f(X)} \text{ i.e. } \text{Posterior} = \frac{\text{Likelihood} \times \text{Prior}}{\text{Evidence}}.
$$

MAP considers the prior of the parameter $$\theta$$, and return a single specific value of $$\theta$$ that maximize the posterior: 

$$
\hat{\theta}_{\text{MAP}} = \underset{\theta}{\text{argmax }} f(\theta \mid X) = \underset{\theta}{\text{argmax }} \frac{f(X \mid \theta)f(\theta)} {f(X)} = \underset{\theta}{\text{argmax }} f(X \mid \theta)f(\theta).
$$

Note that if we assume the prior $$f(\theta)$$ as a uniform distribution, then $$f(\theta)$$ is a constant and we have $$\underset{\theta}{\text{argmax }} f(X \mid \theta)f(\theta) = \underset{\theta}{\text{argmax }} f(X \mid \theta)$$, it follows that $$\hat{\theta}_{\text{MAP}} = \hat{\theta}_{\text{MLE}}$$. We can conclude that MLE is a special case of MAP, when prior follows a uniform distribution.

MLE and MAP both return a single and specific value as the estimation. Since that, the estimators of MLE or MAP are considered as **point estimators**. 

## Bayesian Estimation

Bayesian estimation also considers the parameter $$\theta$$ as a random variable. However, unlike MLE and MAP (and other point estimations), Bayesian estimation does not return a specific value, but returns fully the **posterior distribution** $$f(\theta \mid X)$$:

$$
f(\theta \mid X) = \frac{f(X \mid \theta)f(\theta)}{f(X)} = \frac{f(X \mid \theta)f(\theta)}{\int_\theta f(X \mid \theta) f(\theta) d\theta}.
$$

Bayesian estimation is made complex by the fact that now the denominator in the formula above cannot be ignored. 

The integral is usually difficult to compute. Since we have a choice regarding the prior, we can use **conjugate prior** to simplify the computation of the integration. For a given algebraic form for the likelihood $$f(X \mid \theta)$$, a prior $$f(\theta)$$ is called a conjugate prior if the posterior $$f(\theta \mid X)$$ has the same algebraic form as the prior. 

We can also use the Monte Carlo integration to estimate the integral in the denominator. (Read [Monte Carlo Integration in Bayesian Estimation](https://engineering.purdue.edu/kak/Tutorials/MonteCarloInBayesian.pdf) for details.)

Based on the posterior distribution of $$\theta$$, we may want a specific value of $$\theta$$ that we consider best in some sense. For example, the posterior expectation of $$\theta$$: 

$$
E(\theta \mid X) = \int_\theta \theta f(\theta \mid X) d\theta.
$$

The variance $$\text{Var}(\theta \mid X)$$ that we can calculate for $$\theta$$ from its posterior distribution allows us to express our confidence in any specific value we may use as an estimate. If the variance is too large, we may declare that there does not exist a good specific estimate for $$\theta$$.

<br>

**Reference**: 

[ML, MAP, and Bayesian --- The Holy Trinity of Parameter Estimation and Data Prediction](https://engineering.purdue.edu/kak/Tutorials/Trinity.pdf).