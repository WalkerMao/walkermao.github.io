---
layout: post
title:  "Markov Chain and Hidden Markov Model"
date: 9999-01-01
categories: Stat
tags: []
toc: false
published: true
hidden: false
comments: true
---

## Markov Chain

The **Markov property** refers to that the conditional probability distribution of future states of a stochastic process depends only upon the present state, but not on the past. [^1] A **Markov process** is a stochastic process that satisfies the Markov property. A **Markov chain** is a type of Markov process that has either a discrete state space or a discrete index set (often representing time).  [^2] In the following we refer to discrete-time Markov chain as Markov chain by default.

A Markov chain is a sequence of random variables $$ X_1, X_2, \cdots, X_t $$ with the Markov property:

$$
P(X_t \mid X_{t-1}, X_{t-2}, \cdots, X_1) = P(X_t \mid X_{t-1}).
$$

A Markov chain is specified by the following three components:

* A set of $$N$$ states $$ S = \{ s_1, s_2, \cdots, s_N \}$$;

* An initial probability distribution over states $$ \pi = (\pi_1, \pi_2, \cdots, \pi_N) $$, where $$ \pi_i = P(X_1 = s_i) $$.

* A transition probability matrix
  
  $$
  P = \left[{\begin{matrix} p_{1,1} & p_{1,2} & \dots & p_{1,j}& \dots & p_{1, N } \\ p_{2,1} & p_{2,2} & \dots & p_{2,j} & \dots & p_{2,N} \\ \vdots & \vdots & \ddots & \vdots & \ddots & \vdots \\ p_{i,1} & p_{i,2} & \dots & p_{i,j} & \dots & p_{i, N }\\\vdots & \vdots & \ddots & \vdots & \ddots & \vdots \\ p_{N,1} & p_{N,2} & \dots & p_{ N ,j}& \dots & p_{N, N} \\ \end{matrix}} \right],
  $$
  
  where $$ p_{i,j} = P(X_t = s_j \mid X_{t-1} = s_i) $$ is the probability of moving from state $$ s_i $$ to state $$ s_j $$ in one time step.
  
  Since the total of transition probability from a state $$ s_i $$ to all other states must be $$ 1 $$, we have $$ \sum_{j=1}^N p_{i,j} = 1, \; \forall i $$.
  

<br>

## References

[^1]: Wikipedia contributors. "[Markov property](https://en.wikipedia.org/wiki/Markov_property#Introduction)." *Wikipedia, The Free Encyclopedia*. 2022.
[^2]: Wikipedia contributors. "[Markov chain](https://en.wikipedia.org/wiki/Markov_chain#Definition)." *Wikipedia, The Free Encyclopedia*. 2022.
