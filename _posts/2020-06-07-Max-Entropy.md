---
layout: post
title: "Maximum Entropy"
date: 2020-06-07
categories: Stat
published: true
comments: true
---

## Upper Bound of Entropy

Given a finite sample space, **uniform distribution has maximum entropy among all distributions**.

Given a random variable $X$ with sample space $$\mathcal{X}$$ and outcomes $$x \in \mathcal{X}$$. Suppose $X$ follows the distribution $$P_X$$. Denote $$\mid\mathcal{X}\mid$$ as the number of elements in the set $$\mathcal{X}$$, 

**Theorem.** $$H(X)\leq\log\mid\mathcal{X}\mid$$. Equality iff $X$ has uniform distribution on $$\mathcal{X}$$.

Proof: 

Denote $U_{\mathcal{X}}$ as the uniform distribution on the sample space $$\mathcal{X}$$, then we have $$U_{\mathcal{X}}(x)=\frac{1}{\mid\mathcal{X}\mid}$$.

By the non-negativity of KL divergence, or equivalently by Gibbs' inequality, 

$$\begin{align}
0 &\leq D_{\text{KL}}(P_X \parallel U_{\mathcal{X}}) = \sum_{x \in \mathcal{X}} P_X(x)\log\frac{P_X(x)}{U_{\mathcal{X}}(x)} \\
&= \sum_{x \in \mathcal{X}} P_X(x) \log |\mathcal{X}| - \left(-\sum_{x \in \mathcal{X}} P_X(x)\log P_X(x) \right) \\ 
&= \log |\mathcal{X}| - H(X).
\end{align}$$

Equality iff $$P_X \equiv U_{\mathcal{X}}$$. $$□$$

## Principle of Maximum Entropy

Bayesian methods usually need to assume the prior distribution. Naturally we want to avoid inadvertently assuming more knowledge than we actually have, and the **principle of maximum entropy** is the technique for doing this, which states that the probability distribution which best represents the current state of knowledge is the one with largest entropy. 

Suppose the outcomes of random variable $X$ are $$\mathcal{X}=\{x_i\}_{i=1}^n$$, then entropy is $$H(X)=-\sum_{i=1}^n P(x_i) \log_b P(x_i)$$. (*Common values of the logarithm base $b$ are $2$, and the corresponding units of entropy are the bits for $$b=2$$*). Now we want to estimate the probabilities $$P(x_1),P(x_2),\cdots,P(x_n)$$ given $m$ constraints $$\sum_{i=1}^n P(x_i)g_j(x_i)=E\left[g_j(X)\right], j=1,2,\cdots,m$$, where $$g_j(x_i)$$ and $$E\left[g_j(X)\right]$$ are all known for each $$i,j$$.

The **formulation** of maximizing entropy is

$$
P(x_1),\cdots,P(x_n) = \underset{P(x_1),\cdots,P(x_n)}{\text{argmax }} H(X) = \underset{P(x_1),\cdots,P(x_n)}{\text{argmax }} -\sum_{i=1}^n P(x_i) \log_b P(x_i), \\
\begin{align}
\text{subject to } \\
& P(x_i) \geq 0 \text{ for } i=1,\cdots,n, \\ &\sum_{i=1}^{n}P(x_i)=1, \\ 
&\sum_{i=1}^n P(x_i)g_j(x_i)=E\left[g_j(X)\right] \text{ for } j=1,\cdots,m.
\end{align}
$$

We can apply the method of **Lagrange multipliers** to solve this maximization problem. The Lagrangian function is

$$\begin{align}
\mathcal{L}\big(P(x_1),\cdots,P(x_n),\lambda_0,\cdots,\lambda_m\big) = &-\sum_{i=1}^n P(x_i) \log_b P(x_i) + \lambda_0 \left(\sum_{i=1}^{n}P(x_i)-1\right) \\ &+ \sum_{j=1}^{m} \lambda_j \left( \sum_{i=1}^n P(x_i)g_j(x_i) - E\left[g_j(X)\right] \right).
\end{align}$$

Take derivative with respect to $$P(x_i)$$ and set to $0$, we have

$$
\frac{\partial \mathcal{L}\big(P(x_1),\cdots,P(x_n),\lambda_0,\cdots,\lambda_m\big)}{\partial P(x_1)} = 0 \implies P^*(x_i) = b^{\lambda_0 - 1 + \sum_{j=1}^m \lambda_jE\left[g_j(X)\right]}.
$$

The Lagrange multipliers $$\lambda_0,\lambda_1,\cdots,\lambda_m$$ are chosen such that

$$
\begin{cases}
\sum_{i=1}^{n}P(x_i)=1, \\
\sum_{i=1}^n P(x_i)g_j(x_i)=E\left[g_j(X)\right] \text{ for } j=1,\cdots,m.
\end{cases}
$$

Since we have $$m+1$$ constraints, and it is equal to the number of Lagrange multipliers, thus we can get the exact solution of $$\lambda_0,\lambda_1,\cdots,\lambda_m$$. 

Note that the logarithm base $b$ does not influence the result. 

## Example: Berger's Burgers

Walker usually buys meals from a fast food restaurant, Berger's Burger, which offers four different meals as shown below:

| Item              | Price  |
| ----------------- | ------ |
| Burger ($$x_1$$)  | $$$1$$ |
| Chicken ($$x_2$$) | $$$2$$ |
| Fish ($$x_3$$)    | $$$3$$ |
| Tofu ($$x_4$$)    | $$$8$$ |

Now Walker tells you that his average cost of each meal is $$$2.5$$. What is the frequency that each item being ordered? We can solve this problem by the technique we discussed in the previous section. 

Denote the item he orders as a random variable $X$, which has possible outcomes $$x_1,x_2,x_3,x_4$$. The entropy of $X$ is $$H(X)=-\sum_{i=1}^4 P(x_i) \log_2 P(x_i)$$. 

The formulation of maximizing entropy is

$$
P(x_1),\cdots,P(x_4) = \underset{P(x_1),\cdots,P(x_4)}{\text{argmax }} H(X) = \underset{P(x_1),\cdots,P(x_4)}{\text{argmax }} -\sum_{i=1}^4 P(x_i) \log_b P(x_i), \\
\begin{align}
\text{subject to } \\
& P(x_i) \geq 0 \text{ for } i=1,\cdots,4, \\ &\sum_{i=1}^{4}P(x_i)=1, \\ 
& P(x_1)+2P(x_2)+3P(x_3)+8P(x_4)=2.5.
\end{align}
$$

By the method of Lagrange multipliers, we have

$$
P^*(x_1)=2^{\lambda_0 - 1 + \lambda_1}, P^*(x_2)=2^{\lambda_0 - 1 + 2\lambda_1}, P^*(x_3)=2^{\lambda_0 - 1 + 3\lambda_1}, P^*(x_4)=2^{\lambda_0 - 1 + 8\lambda_1}.
$$

Plug these equations into the constraints 

$$
\begin{cases}
P(x_1)+P(x_2)+P(x_3)+P(x_4)=1, \\
P(x_1)+2P(x_2)+3P(x_3)+8P(x_4)=2.5.
\end{cases}
$$

We have two constraints and two variables $$\lambda_0,\lambda_1$$, thus we can get the exact solution: 

$$
\lambda_0 = 1.2371, \lambda_1 = 0.2586.
$$

Plug them back to $$P^*(x_1),\cdots,P^*(x_4)$$ and we have 

$$
P^*(x_1) = 0.3546, P^*(x_2)=0.2964, P^*(x_3)=0.2478, P^*(x_4) = 0.1011.
$$

## Maximum Entropy Classifier

The maximum entropy classifier is equivalent to logistic regression. 

---

**References:**

Xie, Yao. (2010, Dec 9). Chain rules and inequalities. Retrieved June 4, 2020, from https://www2.isye.gatech.edu/~yxie77/ece587/Lecture2.pdf. 

Xie, Yao. (2010, Dec 9). Maximum entropy. Retrieved June 6, 2020, from https://www2.isye.gatech.edu/~yxie77/ece587/Lecture11.pdf. 

Paul Penfield, Jr. (2004, Apr 2). Principle of Maximum Entropy. Retrieved June 7, 2020, from http://www-mtl.mit.edu/Courses/6.050/notes/chapter9.pdf.

Mount, John. (2011, Sep 23). *The equivalence of logistic regression and maximum entropy models*. Retrieved June 7, 2020, from https://pdfs.semanticscholar.org/19cc/c9e2937b3260ac2c93020174c09c2891672e.pdf.

