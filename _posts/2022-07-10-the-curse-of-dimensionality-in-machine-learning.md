---
layout: post
title: "The Curse of Dimensionality in Machine Learning"
date: 2022-07-10
categories: ML Stat
tags: []
toc: false
published: true
hidden: false
comments: true
---

The curse of dimensionality, first introduced by Bellman [^1], refers to various phenomena that arise when analyzing and organizing data in high-dimensional spaces that do not occur in low-dimensional settings.

In machine learning, the curse of dimensionality is used interchangeably with the peaking phenomenon or Hughes phenomenon. This phenomenon states that with a fixed number of training samples, the average (expected) predictive power of a classifier or regressor first increases as the number of dimensions or features used is increased , but beyond a certain dimensionality it starts deteriorating. [^2]

<div align='center'>
<figure>
<img src="https://miro.medium.com/max/1400/1*pcJdd2y924Xk61SXa7uYpw.jpeg" alt="img" style="zoom:70%; margin-bottom:-120px; overflow:hidden;" />
<figcaption style="font-size:80%;"> Figure: Hughes phenomenon. (<a href="https://towardsdatascience.com/curse-of-dimensionality-a-curse-to-machine-learning-c122ee33bfeb">Source</a>) </figcaption>
</figure>
</div>

## Model Estimation

With a fixed number of training samples and an increasing number of dimensions, the density of the training samples decreases exponentially, and the feature space becomes sparser and sparser. This may lead to:

* The statistical confidence and functionality of model parameters decreases.

* Model estimation tends to be overfitting, since that a classifier can easily find a separable hyperplane even for noise samples, and a regressor can easily fit noises as well.

* The complexity of functions of many variables can grow exponentially with the dimension, the number of samples needed to estimate such functions with a given level of accuracy grows exponentially as well. [^3]

## Neighbors Are Not "Local"

In a high dimensional space, we need to cover a large range to capture just a few neighbors. Such neighbors are no longer "local", and this makes the nearest neighbors be meaningless.

Consider $$ n $$ data points uniformly distributed in a $$ p $$-dimensional unit hypercube or ball. A hypercube or ball that captures a fraction $$ \alpha $$ of the data has side length or radius $$ \alpha^{\frac{1}{p}} $$. That means we must cover of $$ \alpha ^{\frac{1}{p}} $$ the range in each dimension. In ten dimensions, we need to cover 63% or 79% of the range of each input variable to capture only 1% or 10% or the data. [^3]

<div align='center'>
<figure>
<img src="https://d3i71xaburhd42.cloudfront.net/581e4c6316feb4c18657a325afcdfd5524a4ead1/5-Figure2.6-1.png" alt="Figure 2.6 in ESL 2nd edition" style="zoom:100%;" />
<figcaption style="font-size:80%;"> Figure. The right figure shows the side-length of the subcube needed to capture a fraction r of the volume of the data,
for different dimensions p. (Source: [3]) </figcaption>
</figure>
</div>


## Close to Boundaries

Data around the origin (the center of the hypercube) is much more sparse than data around the boundary/edge. [^4] Most data points (for both training and predicting) reside close to the boundaries (even corners) of the feature space [^7], and they are mostly closer to the boundary than to any other data point [^3], since the distances between boundaries are very large. 

The reason that this presents a problem is that, for a prediction, we usually have to extrapolate from neighboring training data points rather than interpolate between them. [^3]

This property can be illustrated by following several aspects.

### Closest Distance to Origin

Consider $$ n $$ data points uniformly distributed in a $$ p $$-dimensional unit ball centered at the origin. The expected median distance from the origin to the closest of $$ n $$ data point is

$$
d(p,n) = \left( 1 - 2^{-1/n} \right)^{1/p}. 
$$

This is the Exercise 2.3 in [^3] and you can find a solution from [^8].

For example, $$ d(10, 500) \approx 0.52 $$, which means we expect all data points reside closer to the boundaries than to the origin. 

### Surface Area to Volume Ratio

**Hypercube:**

For a $$ p $$-dimensional cube of side length $$ r $$, the surface area and volume are

$$
S_p = 2pr^{p-1},\; V_p = r^p.
$$

Thus the ratio is $$ S_p/V_p = 2p/r$$.

**hypersphere:**

For a $$ p $$-dimensional ball of radius $$ r $$, the surface area and volume are

$$
S_p = \frac{p r^{p-1} \pi^{p/2}}{(p/2)!},\; V_p = \frac{r^p \pi^{p/2}}{(p/2)!}.
$$

Thus the ratio is $$ S_p/V_p = p/r $$.

That is, either for a hypercube or hypersphere, most of the volume is contained in an shell or annulus of width proportional to $$ r/p $$. This means that almost all of the high dimensional box/orange's mass is in the shell/peel. [^9]

### Most in Corners [^9]

Most of the volume of a high-dimensional cube is located in its corners.

We assume that data points are uniformaly distributed in a hypercube given by $$ [−r, r]^p $$. By Chernoff's Inequality, The probability that a data point $$ x = (x^{(1)}, \cdots, x^{(p)})^T \in \mathbb{R}^p $$ reside in the inscribed hypersphere of raidus $$ r $$ is

$$
P\left(\|x\|_2 \leq r \right) = P\left(\sqrt{\sum_{j=1}^p {x^{(j)}}^2} \leq r \right) \leq e^{-d/10}.
$$

Since this probability converges to 0 as the dimension $$ p $$ goes to infinity, this shows random points in high cubes are most likely outside the sphere. In other words, almost all the volume of hypercubes lie in their corners.

<div align='center'>
<figure>
<img src="https://www.visiondummy.com/wp-content/uploads/2014/04/sparseness.png" alt="Highly dimensional feature spaces are sparse around their origin" style="zoom:100%;" />
<figcaption style="font-size:80%;"> Figure. As the dimensionality increases, a larger percentage of the data points reside in the corners of the feature space. (Source: [4]) </figcaption>
</figure>
</div>

In addition, an interesting surprise in high-dimensional spaces is that hypercubes are both convex and "pointy". 

## Distances

Under certain reasonable and broad assumptions on data distribution (much broader than independent and identically distributed dimensions), as dimensionality increases, given a sample set and an arbitrary query data point in that set, the distances from the query point to the nearest and farthest neighbors in the set tend to be equal. [^5] [^6] Thus, the distance measures lose their effectiveness to measure similarity. 

## Others

### Gaussian Distribution

Gaussian distribution become flat and heavy tailed distributions in high dimensional spaces, such that the minimum and maximum gaussian likelihood tend to be equal. [^4]

<br>

## References

[^1]: Bellman, Richard. "Dynamic programming." *Princeton University Press*, 1957. 
[^2]: Wikipedia contributors. "[Curse of dimensionality](https://en.wikipedia.org/wiki/Curse_of_dimensionality)." *Wikipedia, The Free Encyclopedia*, 2022.
[^3]: Hastie, Trevor, et al. Section 2.5: Local methods in high dimensions. "The elements of statistical learning: data mining, inference, and prediction." Vol. 2. *New York: springer*, 2009.
[^4]: Spruyt, Vincent. "[The curse of dimensionality in classification](https://www.visiondummy.com/2014/04/curse-dimensionality-affect-classification/)." *[Computer vision for dummies](https://www.visiondummy.com/)*, 2014.
[^5]: Beyer, Kevin, et al. "[When is “nearest neighbor” meaningful?](https://minds.wisconsin.edu/bitstream/handle/1793/60174/TR1377.pdf?sequence=1&ref=https://githubhelp.com)." *International conference on database theory*. Springer, Berlin, Heidelberg, 1999.
[^6]: Aggarwal, Charu C., Alexander Hinneburg, and Daniel A. Keim. "[On the surprising behavior of distance metrics in high dimensional space](https://bib.dbvis.de/uploadedFiles/155.pdf)." *International conference on database theory*. Springer, Berlin, Heidelberg, 2001.
[^7]: [z_ai](https://z-ai.medium.com/). "[The surprising behaviour of distance metrics in high dimensions.](https://towardsdatascience.com/the-surprising-behaviour-of-distance-metrics-in-high-dimensions-c2cb72779ea6)" *[Towards data science](https://towardsdatascience.com/)*, 2021.

[^8]: Weatherwax, John L., and Epstein, David. "[A Solution Manual and Notes for: The Elements of Statistical Learning.](https://waxworksmath.com/Authors/G_M/Hastie/WriteUp/Weatherwax_Epstein_Hastie_Solution_Manual.pdf)" 2021.

[^9]: Strohmer, Thomas. "[Surprises in high dimensions.](https://www.math.ucdavis.edu/~strohmer/courses/180BigData/180lecture1.pdf)", 2017.

[^10]: [Sycorax](https://stats.stackexchange.com/users/22311/sycorax). "[Answer to 'Why is Euclidean distance not a good metric in high dimensions?'](https://stats.stackexchange.com/questions/99171/why-is-euclidean-distance-not-a-good-metric-in-high-dimensions)" *Statistics, Stack Exchange*, 2014.
