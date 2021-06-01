---
layout: post
title: "Root Cause Localization: Adtributor"
date: 2021-05-16
categories: ML
comments: true
published: true
hidden: false

---

## Notes on "Adtributor: Revenue debugging in advertising systems"

The following sections are excerpted from the paper "Adtributor: Revenue debugging in advertising systems" [^1].

### Problem Statement

#### System Overview

An anomalous rise or drop in any measure of a advertising system is an indication of a problem. For each alert, our objective is to attribute the anomaly in a measure to a dimension and its corresponding elements. 

Dimension: A dimension is an axis along which a measure can be projected, e.g.  data center, advertiser, device type. Element: Every dimension has a domain of values called elements.  For instance, the "Advertiser" domain can have the following elements: {Geico, Microsoft, Toyota, Frito-Lay, ...}. 

#### Problem Definition and Scope

If the measure is revenue, then the problem can be stated as follows: "Find a Boolean expression, in terms of dimensions and their elements, such that the revenue drop attributed to the expression best explains the total drop in revenue."

Based on the manual study on historical alerts, the cases where multiple dimensions contribute together to a root-cause are very rare. Therefore, for simplicity of exposition, we limit our discussions to finding a Boolean expression that involves a single dimension and a set of its elements that explains the anomalous change.

Generalizing to any measure, our final debugging problem statement can be captured in three steps:

- For a dimension, find all sets of elements that explain at least a threshold fraction, $$T_{EP}$$, of the change in the measure. (have high explanatory power)

- Among all such sets for each dimension, find the sets that are most succinct in that dimension. (Occam's razor)

- Across all such sets for all dimensions, find the one set that is the most surprising in terms of changes in contribution.

Our algorithm use a per-element threshold of the change in the measure, $$T_{EEP}$$, to add to the idea of succinctness. Not only do we want the smallest set of elements, we also want only those elements that contribute at least a fraction of $$T_{EEP}$$ to the anomaly.

### Root-Cause Identification Algorithm

#### Notation

<div align='center'>
<figure>
<img src="https://d3i71xaburhd42.cloudfront.net/95a9ac4dca271352a14a8c8c95f598d9b164719f/7-Table5-1.png" alt="Table 5: Notation" style="zoom:120%;" /> <figcaption style="font-size:80%;"> Table 5: Notation (<a href="https://www.semanticscholar.org/paper/Adtributor%3A-Revenue-Debugging-in-Advertising-Bhagwan-Kumar/95a9ac4dca271352a14a8c8c95f598d9b164719f#extracted">Source</a>) </figcaption>
</figure>
</div>

For fundamental measures, the overall measure is simply the summation of value of the measures of the elements of the respective dimensions, but the same is not true for derived measures as they are not additive (Section 4).

Given $$F(m)$$ and $$A(m)$$, the algorithm needs to output a potential root cause to explain the difference between the two. For this, it uses explanatory power and surprise, defined next.

#### Explanatory Power

Explanatory power of an element can be defined as the percentage of change in the overall value of the measure that is explained by change in the given element's value. For fundamental measures, the explanatory power of an element $$j$$ in dimension $$i$$ is simply

$$
E P_{i j}=\left(A_{i j}(m)-F_{i j}\right) /(A(m)-F(m)).
$$

#### Surprise

A dimension that has large change in its distribution (e.g., DeviceType) is more likely to be a root-cause than the dimension that does not exhibit such a change (e.g., Data Center). 

For each element $$ E_{i j} $$, let $$ p_{i j}(m) $$ be the forecasted or prior probability value given by

$$
p_{i j}(m)=F_{i j}(m) / F(m), \forall E_{i j}.
$$

Given a new anomalous observation, let $$ q_{i j}(m) $$ be the actual or posterior probability value

$$
q_{i j}(m)=A_{i j}(m) / A(m), \forall E_{i j}.
$$

We use the Jensen-Shannon (JS) divergence as the measure of surprise.

Intuitively, the new observations for a given dimension are surprising if the posterior probability distribution is significantly different from the prior probability distribution.

We use the Jensen-Shannon (JS) divergence for computing surprise, defined as

$$
\begin{aligned}
D_{JS}(P, Q) &= \frac{1}{2} \left(D_{KL}(P \| Q) + D_{KL}(Q \| P) \right) \\
&= \frac{1}{2} \left(\Sigma_{i} p_{i} \log \frac{2 p_{i}}{p_{i}+q_{i}}+\Sigma_{i} q_{i} \log \frac{2 q_{i}}{p_{i}+q_{i}}\right).
\end{aligned}
$$

Instead of KL divergence, $$ D_{J S}(P, Q) $$ is symmetric and is finite even when $$ q_{i}=0 $$ and/or $$ p_{i}=0 . $$ Further, $$ 0 \leq $$ $$ D_{J S}(P, Q) \leq 1 $$, where 0 denotes no change in distribution between $$ P $$ and $$ Q $$, with higher values denoting greater differences.

Thus, to compute surprise $$ S_{i j} $$ for element $$ E_{i j} $$, we use $$ p=p_{i j}(m) $$ and $$ q=q_{i j}(m) $$ to compute

$$
S_{i j}(m) = \frac{1}{2} \left(p \log \left(\frac{2 p}{p+q}\right)+q \log \left(\frac{2 q}{p+q}\right)\right).
$$

#### Algorithm

<div align='center'>
<figure>
<img src="https://imgconvert.csdnimg.cn/aHR0cHM6Ly9ub3RlLnlvdWRhby5jb20veXdzL3B1YmxpYy9yZXNvdXJjZS9lNzFiZDRjMzA0YjdlY2E3Y2E0M2VjMDAzODdiZDgwYy94bWxub3RlL1dFQlJFU09VUkNFYzgxYzk1OGJkNjkyM2E0ZGMxZTQ3NWM3YzM3YzQ3NGIvMjgwNTI?x-oss-process=image/format,png" alt="image" style="zoom:70%;" />
<figcaption style="font-size:80%;"> Figure 2: Root-Cause Identification Algorithm </figcaption>
</figure>
</div>

Note that, obtaining the optimal solution to the problem in the worst case will take exponential time. Instead of enumerating various minimum cardinality subsets that have explanatory power of at least $$T_{EP}$$, our algorithm (Figure 2) uses the greedy heuristic. By examining elements in descending order of surprise, we greedily seek to maximize the surprise of the candidate set.

The algorithm sorts the various candidate sets by their surprise value and returns the top three most surprising candidate sets as potential root-cause candidates (lines 21–22).

### Derived Measures

Derived measures are functions of fundamental measures. For example, $$\text{Cost-per-click} = \text{Revenue} / \text{Clicks}$$. 

An element's explanatory power for derived measures can be determined by computing a new derived measure value, where the actual value of the given element and forecasted values of all other elements are used, and comparing this derived measure value to the expected value of the derived measure.

Our solution to the derived measure attribution problem is adapted from partial derivatives and finite-difference calculus. Recall that a partial derivative is a measure of how a function of several variables changes when one of its variable changes. However, since we operate in the discrete domain, we use partial derivative equivalents from finite-difference calculus.

We formally define explanatory power of an element $$j$$ for a derived measure, which is function $$ h\left(m_{1}, \cdots, m_{k}\right) $$ of fundamental measures $$ m_{1}, \cdots, m_{k} $$, as the partial derivative with respect to $$j$$ in finite-differences of $$ h(\cdot) $$, normalized so that the value across all elements of the dimension sum up to $$ 100 \% $$.

While the above definition is general and applicable to derived measures that are arbitrary functions of fundamental measures (as long as they are differentiable in finite-differences), we now illustrate it through the specific example of derived functions of the form $$ A\left(m_{1}\right) / A\left(m_{2}\right) $$, which make up many of the derived measures in ad system. For example, for the cost-per-click derived measure, we have $$ m_{1}=\text{Revenue}$$ and $$ m_{2}=\text{Clicks}$$.

<div align='center'>
<figure>
<img src="https://d3i71xaburhd42.cloudfront.net/95a9ac4dca271352a14a8c8c95f598d9b164719f/9-Table8-1.png" alt="Table 8: Cost-per-click" style="zoom:120%;" />
<figcaption style="font-size:80%;"> (<a href="https://www.semanticscholar.org/paper/Adtributor%3A-Revenue-Debugging-in-Advertising-Bhagwan-Kumar/95a9ac4dca271352a14a8c8c95f598d9b164719f#extracted">Source</a>) </figcaption>
</figure>
</div>

The partial derivative in finite-differences of $$ f(\cdot) / g(\cdot) $$ is of the form $$ (\Delta f * g-\Delta g * f) /(g *(g+\Delta g)) $$, and is similar to continuous domain partial derivative, except for the extra $$ \Delta g $$ in the denominator.

Thus, explanatory power of element $$ j $$ for dimension $$ i $$ for derived measures of the form $$ m_{1} / m_{2} $$ is given by

$$
\begin{aligned}
E P_{i j} = 
\frac{\left(A_{i j}\left(m_{1}\right)-F_{i j}\left(m_{1}\right)\right) * F_i\left(m_{2}\right)-\left(A_{i j}\left(m_{2}\right)-F_{i j}\left(m_{2}\right)\right) * F_i\left(m_{1}\right)}
{F_i\left(m_{2}\right) * \left(F_i\left(m_{2}\right)+A_{i j}\left(m_{2}\right)-F_{i j}\left(m_{2}\right)\right)}.
\end{aligned}
$$

We compute $$ E P_{i j} $$ for each of the elements using the above equation and normalize it so that they add up to $$100\%$$.

#### Surprise

As an approximation, we assume that measures are independent, and compute the surprise for derived measures as the summation of the surprise of the individual measures that are part of the derived function.

<br>

**References:**

[^1]: Bhagwan, Ranjita, et al. "Adtributor: Revenue debugging in advertising systems." *11th {USENIX} Symposium on Networked Systems Design and Implementation ({NSDI} 14)*. 2014.

