---
layout: post
title: "N-Gram Language Models"
date: 2020-06-15
categories: NLP
published: true
comments: true
---

## N-Grams

A model that computes the probability of a sentence $$P(w_1 \cdots w_i)$$ (or $$P(w_1^i)$$) or the probability of an upcoming word $P(w_i \mid w_1 \cdots w_{i-1})$ (or $$P(w_i \mid w_1^{i-1})$$) is called a **language model**. 

By the chain rule of probability, we have 

$$
P(w_1^i) = P(w_1) P(w_2 \mid w_1)P(w_3 \mid w_1^2) \cdots P(w_i \mid w_1^{i-1}) = \prod_{j=1}^{i} P(w_j \mid w_1^{j-1}).
$$

The chain rule shows the link between computing the joint probability of a sequence and computing the conditional probability of a word given previous words.

The assumption that the probability of a word depends only on the previous word Markov is called a **Markov assumption**. The general equation for the n-gram approximation is 

$$
P(w_i \mid w_1^{i-1}) \approx P(w_i \mid w_{i-n+1}^{i-1}),
$$

which looks $n − 1$ words into the past. In particular, unigram model: $$P(w_1^i) \approx \prod_i P(w_i)$$; bigram model: $$P(w_i\mid w_1^{i-1}) \approx P(w_i\mid w_{i-1})$$.

By using n-gram approximation, we have

$$
P(w_1^i) = \prod_{j=1}^{i} P(w_j \mid w_1^{j-1}) \approx \prod_{j=1}^{i} P(w_j \mid w_{j-n+1}^{j-1}). 
$$

MLE (maximum likelihood estimation) for the parameters of an n-gram model: 

$$
P(w_i \mid w_{i-n+1}^{i-1}) = \frac{\text{Count}(w_{i-n+1}^{i-1}w_i)}{\text{Count}(w_{i-n+1}^{i-1})}.
$$

It estimates the n-gram probability by dividing the observed frequency of a particular sequence by the observed frequency of a prefix. This ratio is called a **relative frequency**. 

In practice, it’s more common to use trigram models, which condition on the previous two words rather than the previous word, or 4-gram or even 5-gram models, when there is sufficient training data. 

Another practical issue is that we always represent and compute language model probabilities in log format as **log probabilities**. Since probabilities are less than or equal to $1$, the more probabilities we multiply together, the smaller the product becomes, and it would result in numerical underflow. Also, adding in log space is equivalent to multiplying in linear space, so we combine log probabilities by adding them: $$p_1 \times p_2 \times p_3 = \exp(\ln p_1 + \ln p_2 + \ln p_3)$$.

## Language Entropy

Now we treat a sentence $$W^{(N)}$$ (sentence of words) with finite length $N$ as a random variable. The outcomes $w^{(N)}$'s of random variable $W^{(N)}$ are all sentences with length $N$ in language $L$. The entropy of $$W^{(N)}$$ can be computed as

$$
H(W^{(N)}) = - \sum_{w^{(N)} \in L} P(w^{(N)}) \log P(w^{(N)}).
$$

The **entropy rate** (or **per-word entropy**) is defined as 

$$
\frac{1}{N}H(W^{(N)}) = - \frac{1}{N} \sum_{w^{(N)} \in L} P(w^{(N)}) \log P(w^{(N)}).
$$

But to measure the true entropy of a language, we need to consider sequences of
infinite length. The entropy rate of language $L$ is defined as 

$$
H(L) := \lim_{N\to\infty} \frac{1}{N}H(W^{(N)}) = - \lim_{N\to\infty}\frac{1}{N} \sum_{w^{(N)} \in L} P(w^{(N)}) \log P(w^{(N)}).
$$

The Shannon-McMillan-Breiman theorem states that if the language is regular in certain ways (to be exact, if it is both stationary and ergodic), then the entropy rate of language $L$ can be computed by

$$
H(L) = - \lim_{N\to\infty}\frac{1}{N} \log P(w^{(N)}).
$$

We consider a language as a stochastic process. A stochastic process is said to be **stationary** if the probabilities it assigns to a sequence are invariant with respect to shifts in the time index. In other words, the probability distribution for words at an index is the same as the probability distribution at any other index. Markov models, and hence n-grams, are stationary. For example, in a bigram, $P_i$ is dependent only on $P_{i−1}$. So if we shift our index by $j$, $P_{i+j}$ is still dependent on $P_{i+j-1}$. But natural language is not stationary, since the probability of upcoming words can be dependent on events that were arbitrarily distant and thus the index matters. Therefore, this computation only gives an approximation to the entropies of natural language. 

To summarize, by making some incorrect but convenient simplifying assumptions, we can compute the entropy of some stochastic process by taking a very long sample of the output and computing its average log probability.

## Evaluating Language Models: Perplexity

In practice we don't use raw probability as our metric for evaluating language models, but a variant called **perplexity** (sometimes called $\text{PP}$ for short). A better n-gram model is one that assigns a higher probability to the test data, and perplexity is a normalized version of the probability of the test set. 

The perplexity measure arises from the information theoretic concept of cross entropy, and it is defined as the **exponent of the cross entropy**. 

Suppose we want to evaluate the model $$\hat{P}(\cdot)$$, which is an approximation to the actual probability distribution $$P(\cdot)$$. The cross entropy of $$\hat{P}$$ on $$P$$ is defined by

$$
H(P\parallel\hat{P}) = -\lim_{N\to\infty} \frac{1}{N} \sum_{w^{(N)} \in L} P(w^{(N)}) \log \hat{P}(w^{(N)}).
$$

This cross entropy can measure the difference between our model and the true distribution.

Again, following the Shannon-McMillan-Breiman theorem, for a stationary ergodic process, we have 

$$
H(P\parallel\hat{P}) = -\lim_{N\to\infty} \frac{1}{N} \log \hat{P}(w^{(N)}).
$$

This means that, we can estimate the cross entropy of a model $$\hat{P}$$ on some distribution $$P$$ by taking a single sequence that is long enough instead of summing over all possible sequences. 

Now suppose $$N$$ is large enough, for a sequence of words $$w_1^N = w_1w_2 \cdots w_N$$, we have $$H(P\parallel\hat{P}) \approx - \frac{1}{N} \log \hat{P}(w_1^N)$$, then the perplexity is defined as 

$$
\text{PP}(w_1^N) = 2^{H(P\parallel\hat{P})} = \hat{P}(w_1^N)^{-1/N} = \prod_{i=1}^N \hat{P}(w_i|w_1 \cdots w_{i-1})^{-1/N},
$$

where $$\hat{P}(\cdot)$$ is the probability estimated by the language model that we want to evaluate. If we are computing the perplexity of $w_1^N$ with a n-gram language model $$\hat{P}$$, we get 

$$
\text{PP}(w_1^N) \approx \prod_{i=1}^N \hat{P}(w_i \mid  w_{i-n+1}^{i-1})^{-1/N}.
$$

The higher the conditional probability of the word sequence, the lower the perplexity. Thus, minimizing perplexity is equivalent to maximizing the test set probability according to the language model.

## Smoothing

To keep a language model from assigning zero probability to the unseen events, we will have to shave off a bit of probability mass from some more frequent events and give it to the events we've never seen. This modification is called **smoothing** or discounting. A variety of ways to do smoothing: add-1 smoothing, add-k smoothing, stupid backoff, and Kneser-Ney smoothing.

### Add-1 and Add-k Smoothing

**Add-1 smoothing** is also known as **Laplace smoothing**. This algorithm add one to all the bigram counts, before we normalize them into probabilities. It does not perform well enough in modern n-gram models, but is still practical for some tasks like text classification.

Denote $$\text{Count}(\cdot)$$ as $C(\cdot)$, and suppose there are $V$ words in the vocabulary and $N$ word tokens, then we have $$P_{\text{add-1}}(w_i) = \frac{C(w_i)+1}{N+V}, C_{\text{add-1}}(w_i) = (C(w_i)+1) \frac{N}{N+V}, P_{\text{add-1}}(w_i \mid w_{i-1})=\frac{C(w_{i-1}w_i)+1}{C(w_{i-1})+V}$$.

Instead of adding 1 to each count, we add a fractional count $k\ (0.5?, 0.05?, 0.01?)$, it follows that $$P_{\text{add-k}}(w_n\mid w_{n-1})=\frac{C(w_{n-1}w_n)+k}{C(w_{n-1})+kV}$$. This algorithm is called **add-k smoothing**. It turns out that it still doesn't work well for language modeling.

### Backoff and Interpolation

The intuition is that, if we are trying to compute $$P(w_n \mid w_{n−2}w_{n−1})$$ but we have no examples of a particular trigram $$w_{n−2}w_{n−1}w_{n}$$, we can instead estimate its probability by using the bigram probability $$P(w_n \mid w_{n−1})$$. Similarly, if we don't have counts to compute $$P(w_n\mid w_{n−1})$$, we can look to the unigram $P(w_n)$.

In **backoff**, for example, we use the trigram if the evidence is sufficient, otherwise we use the bigram, otherwise the unigram. In other words, we only "back off" to a lower-order n-gram if we have zero evidence for a higher-order interpolation n-gram. 

By contrast, in **interpolation**, we always mix the probability estimates from all the n-gram estimators, weighing and combining the trigram, bigram, and unigram counts. In simple linear interpolation, we combine different order n-grams by linearly interpolating all the models. For example,  we estimate the trigram probability by mixing together the unigram, bigram, and trigram probabilities, each weighted by $$\lambda_1,\lambda_2,\lambda_3$$:

$$
\hat{P}(w_i \mid w_{i-2}w_{i-1}) = \lambda_1 P(w_i \mid w_{i-2}w_{i-1}) + \lambda_2 P(w_i \mid w_{i-1}) + \lambda_3 P(w_i), \text{ such that } \sum_{j=1}^3{\lambda_j}=1.
$$

In a slightly more sophisticated version of linear interpolation, each $\lambda$ weight is computed by conditioning on the context. This way, if we have particularly accurate counts for a particular bigram, we assume that the counts of the trigrams based on this bigram will be more trustworthy, so we can make the $λ$'s for those trigrams higher and thus give that trigram more weight in the interpolation. The equation below shows the equation for interpolation with **context-conditioned weights**:

$$
\hat{P}(w_n \mid w_{n-2}w_{n-1}) = \lambda_1(w_{n-2}^{n-1}) \cdot P(w_n \mid w_{n-2}w_{n-1}) + \lambda_2(w_{n-2}^{n-1}) \cdot P(w_n \mid w_{n-1}) + \lambda_3(w_{n-2}^{n-1}) \cdot P(w_n).
$$

Both for the simple interpolation and conditional interpolation, the hyperparameters $$\lambda$$'s are chosen from cross validation, or simply from a single **held-out** corpus. 

The backoff with discounting is also called **Katz backoff**, and it is often combined with a smoothing method called **Good-Turing**. 

### Kneser-Ney Smoothing

This n-gram smoothing algorithm is the most commonly used and best performing. Kneser-Ney has its roots in a method called **absolute discounting**, which subtracts a fixed (absolute) discount $d$ from each count. 

In smoothing, we shave off a bit of counts from some seen events and give it to the events we've never seen. Consider an n-gram that has a count, and we need to discount this count by some amount. But how much should we discount it? Church and Gale compared training set and hold-out set, and they found $$0.75$$ is a good discount for bigrams. 

The equation for interpolated absolute discounting applied to bigrams: 

$$
P_{\text{AD}}(w_i \mid w_{i-1}) = \frac{C(w_{i-1}w_i)-d}{\sum_v C(w_{i-1}v)} + \lambda(w_{i-1}) \cdot P(w_i).
$$

The first term is the discounted bigram, and the second term is the unigram with an interpolation weight $λ$. We could just set all the $d$ values to $0.75$, or we could keep a separate discount value of $0.5$ for the bigrams with counts of $1$.

**Kneser-Ney discounting** augments absolute discounting with a more sophisticated way to handle the lower-order unigram distribution.

The number of times a word $w$ appears as a novel continuation can be expressed as: 

$$
P_{\text{Cont}}(w) \propto | \{v : C(vw) > 0\} |.
$$

To turn this count into a probability, we normalize by the total number of word bigram types:

$$
P_{\text{Cont}}(w) = \frac{|\{v : C(vw) > 0\}|} {|\{(v',w') : C(v'w') > 0\}|}.
$$

The equation for **Interpolated Kneser-Ney smoothing** for bigrams is:

$$
P_{\text{KN}}(w_i \mid w_{i-1}) = \frac{\max(C(w_{i-1}w_i)-d, 0)}{C(w_{i-1})} + \lambda(w_{i-1}) \cdot P_{\text{Conti}}(w_i).
$$

The $λ$ is a normalizing constant that is used to distribute the probability mass we've discounted:

$$
\lambda(w_{i-1}) = \frac{d}{\sum_u C(w_{i-1}u)} |\{u: C(w_{i−1}u) > 0\}|.
$$

The first term, $\frac{d}{\sum_u C(w_{i-1}u)}$ , is the normalized discount. The second term, $$\mid\{u: C(w_{i−1}u) > 0\}\mid$$, is the number of word types that can follow $w_{n−1}$ or, equivalently, the number of word types that we discounted.

The general recursive formulation is as follows:

$$
P_{\text{KN}}(w_i \mid w^{i-1}_{i-n+1}) = \frac{\max(C_{\text{KN}}(w^{i-1}_{i-n+1})-d, 0)}{\sum_v{C_{\text{KN}}(w^{i-1}_{i-n+1} v)}} + \lambda(w^{i-1}_{i-n+1}) \cdot P_{\text{KN}}(w_i \mid w^{i-1}_{i-n+2}).
$$

where 

$$
C_{\text{KN}}(\cdot) =
  \begin{cases}
    \text{Count}(\cdot) & \text{for the highest order}\\
    \text{ContinuationCount}(\cdot)  &\text{for lower orders}
  \end{cases}
$$

At the termination of the recursion, unigrams are interpolated with the uniform distribution, where the parameter $ε$ is the empty string: 

$$
P_{\text{KN}}(w) = \frac{\max(C_{\text{KN}}(w)-d, 0)}{\sum_{w'}{C_{\text{KN}}(w')}} + \lambda(\epsilon) \cdot \frac{1}{V}.
$$

If we want to include an unknown word , it’s just included as a regular vocabulary entry with count zero, and hence its probability will be a lambda-weighted uniform distribution $λ(ε)/V$.

Kneser-Ney smoothing has different versions, the best-performing version is called **modified Kneser-Ney smoothing**. 

### Stupid Backoff

With very large language models, a much simpler algorithm may be sufficient, which is called stupid backoff. 

Stupid backoff gives up the idea of trying to make the language model a true probability distribution. There is no discounting of the higher-order probabilities. If a higher-order n-gram has a zero count, we simply backoff to a lower order n-gram, weighed by a fixed (context-independent) weight. This algorithm does not produce a probability distribution.

$$
S(w_i \mid w_{i-k+1}^{i-1}) =
  \begin{cases}
    \frac{\text{Count}(w_{i-k+1}^i)}{\text{Count}(w_{i-k+1}^{i-1})} & \text{if Count}(w_{i-k+1}^i)>0\\
    \lambda S(w_i \mid w_{i-k+2}^{i-1})  &\text{otherwise}
  \end{cases}
$$

The backoff terminates in the unigram, which has probability $S(w) = \text{Count}(w)/N$. Brants et al. (2007) found that a value of $$0.4$$ worked well for $$\lambda$$.

## Summary 

This chapter introduced language modeling and the n-gram, one of the most widely used tools in language processing. 

* Language models offer a way to assign a probability to a sentence or other sequence of words, and to predict a word from preceding words. 
* n-grams are Markov models that estimate words from a fixed window of previous words. n-gram probabilities can be estimated by counting in a corpus and normalizing (the maximum likelihood estimate). 
* n-gram language models are evaluated extrinsically in some task, or intrinsically using perplexity. 
* The perplexity of a test set according to a language model is the geometric mean of the inverse test set probability computed by the model. 
* Smoothing algorithms provide a more sophisticated way to estimate the probability of n-grams. Commonly used smoothing algorithms for n-grams rely on lower-order n-gram counts through backoff or interpolation. 
* Both backoff and interpolation require discounting to create a probability distribution. 
* Kneser-Ney smoothing makes use of the probability of a word being a novel continuation. The interpolated Kneser-Ney smoothing algorithm mixes a discounted probability with a lower-order continuation probability.

<br>

**Reference:**

Jurafsky, D., Martin, J. H. (2009). *Speech and language processing: an introduction to natural language processing, computational linguistics, and speech recognition*. Upper Saddle River, N.J.: Pearson Prentice Hall.
