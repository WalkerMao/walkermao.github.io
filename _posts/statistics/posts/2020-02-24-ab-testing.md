---
layout: post
title:  "A/B Testing"
date: 2020-02-24
categories: Stat
comments: true
hidden: true
---

Assume $X_{Ai}$'s and $X_{Bj}$'s are iid (independent and identically distributed) random variables with mean $\mu_A$, $\mu_B$ and variance $\sigma^2_A$, $\sigma^2_B$.

By the CLT (central limit theorem), 

$$
\bar{X}_A = \frac{1}{n_A} \sum_{i=1}^{n_A} X_{Ai} \xrightarrow{d} N(\mu_A, \frac{\sigma_A^2}{n_A}), \\
\bar{X}_B = \frac{1}{n_B} \sum_{j=1}^{n_B} X_{Bj} \xrightarrow{d} N(\mu_B, \frac{\sigma_B^2}{n_B}).
$$

By the additivity of normal distribution,

$$
\bar{X}_A - \bar{X}_B \xrightarrow{d} N(\mu_A - \mu_B, \frac{\sigma_A^2}{n_A} + \frac{\sigma_B^2}{n_B}).
$$

If the population variances $$\sigma_A$$ and $$\sigma_B$$ are known, we can simply use $Z$-test. However, we usually do not know them and we use the sample variances $$s_A^2$$ and $$s_B^2$$ to estimate them, then we construct a test statistic $$T$$ which follows the student's $$t$$ distribution with the degrees of freedom $$\upsilon$$.

**Hypothesis:** $H_0: \mu_A=\mu_B \text{  v.s. } H_1: \mu_A \neq \mu_B$.

**Test statistic:** 

$$
T= \frac{\bar{X}_A - \bar{X}_B}{\sqrt{s^2_A/n_A + s^2_B/n_B}} \sim t_{(\upsilon)},
$$

which is the $t$ distribution with degrees of freedom

$$
\upsilon = \frac{(s^{2}_{A}/n_{A} + s^{2}_{B}/n_{B})^{2}} {(s^2_{A}/n_{A})^2/(n_{A}-1) + (s^2_{B}/n_{B})^2/(n_{B}-1) }.
$$

**Significance level:** $\alpha$.

**Critical region:** Reject the $$H_0$$ if $$\ \mid\ T\mid \ >\ t_{1- \alpha/2, \upsilon} $$, where $t_{1- \alpha/2, \upsilon}$ is the critical value of the $t$ distribution with $ \upsilon$ degrees of freedom. 

Note: 

As the number of degrees of freedom grows, the *t* distribution approaches the standard normal distribution, which means if the sample size is large enough (usually $>30$), then $T \sim N(0,1)$ approximately and we can use the $Z$ test instead of the $t$ test. 

If we assume $\sigma^2_A = \sigma^2_B$, then $$ T = \frac{\bar{X}_{A} - \bar{X}_{B}} {s \sqrt{1/n_A + 1/n_B}} \sim t_{(\upsilon)} $$, where $$ s^{2} = \frac{(n_{A}-1){s^{2}_{A}} + (n_{B}-1){s^{2}_{B}}} {n_{A} + n_{B} - 2}, \upsilon=n_A+n_B-2 $$. 

<br>

**Reference:** [Two-Sample *t*-Test for Equal Means](https://www.itl.nist.gov/div898/handbook/eda/section3/eda353.htm).
