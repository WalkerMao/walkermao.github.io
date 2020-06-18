---
layout: post
title: "Naive Bayes Classifiers"
date: 2020-06-18
categories: NLP
published: true
comments: true
---

## Naive Bayes

Naive Bayes is a probabilistic classifier, meaning that for a document $d$, out of all classes $ c \in C$ the classifier returns the class $\hat{c}$ which has the maximum posterior probability given the document. 

$$
\hat{c}(d) = \underset{c \in C}{\operatorname{argmax}} P(c \mid d) = \underset{c \in C}{\operatorname{argmax}} \frac{P(d \mid c)P(c)}{P(d)} = \underset{c \in C}{\operatorname{argmax}} P(d \mid c)P(c),
$$

where $P(d \mid c)$ is the likelihood and $P(c)$ is the prior. We can represent a document $d$ as a set of words $w_1,w_2,...,w_n$, then $P(d \mid c)=P(w_1,w_2,...,w_n \mid c)$. 

Naive Bayes classifiers make two simplifying assumptions.

The first is called the **bag-of-words assumption**: we assume the positions of words do not matter. We represent a text document as if it were a bag-of-words, that is, an unordered set of words with their position ignored, keeping only their frequency in the document.

The second is commonly called the **naive Bayes assumption**: the **conditional independence assumption** that the probabilities $P(w_i\mid c)$ are independent given the class $c$ and hence can be 'naively' multiplied as follows: 

$$
P(d \mid c)=P(w_1,w_2,\cdots,w_n \mid c) = P(w_1 \mid c) P(w_1 \mid c) \cdots P(w_n \mid c).
$$

Then the naive Bayes classifier can be expressed as

$$
\hat{c}_{NB}(d) = \underset{c \in C}{\operatorname{argmax}} P(c) \prod_{w \in d} P(w \mid c).
$$

The calculations are usually done in log space, to avoid underflow and increase speed. Thus the previous equation can be expressed as 

$$
\hat{c}_{NB}(d) = \underset{c \in C}{\operatorname{argmax}} \log P(c) + \sum_{ w \in d} \log P(w \mid c).
$$

By considering features in log space, naive Bayes classifier computes the predicted class as a linear function of input features. Classifiers that use a linear combination of the input features to make a classification decision (like naive Bayes and also logistic regression) are called **linear classifiers**.

## Training the Naive Bayes Classifier

How can we learn the probabilities $$P(c)$$ and $$P(w \mid c)$$?

Let $N_c$ be the number of documents in our training data with class $c$, $N_{doc}$ be the total number of documents, the vocabulary $\mathcal{V}$ be the union of all different words in all classes, and $$\mid\mathcal{\mathcal{V}}\mid$$ be the size of set $$\mathcal{\mathcal{V}}$$ (that is, the number of different words). Then

$$
\hat{P}(c) = \frac{N_c}{N_{doc}}, \\
\hat{P}(w_i \mid c) = \frac{\text{Count}(w_i \mid c)} {\sum_{w \in \mathcal{V}} \text{Count}(w \mid c) },
$$

where $$\text{Count}(w_i \mid c)$$ counts the number of word $$w_i$$ in the documents in training data with class $c$. 

There is a problem. Imagine that the word "walker" occurs in the class *positive* but not in the class *negative*, then $$\hat{P}(\text{"walker"} \mid \text{negative}) = 0$$, and that is a problem since the logarithm will be $$-\infty$$.  The simplest and commonly used solution is the add-one (Laplace) **smoothing**. 

$$
\hat{P}(w_i|c) = \frac{\text{Count}(w_i \mid c) + 1} {\sum_{w \in V} \left(\text{Count}(w\mid c)+1\right)} = \frac{\text{Count}(w_i\mid c) + 1} {\sum_{w \in V} \text{Count}(w\mid c) + |\mathcal{V}|}.
$$

What do we do about words that occur in our test data but are not in our vocabulary at all because they did not occur in any training document in any class? The solution for such unknown words is to ignore them: remove them from the test document and not include any probability for them at all.

In most text classification applications, using a stop word list does not improve performance, and so it is more common to make use of the entire vocabulary and not use a stop word list. 

The final algorithm can be expressed as 

<img src="/pictures/Naive-Bayes.png" alt="Naive-Bayes" style="zoom:70%;" />

---

**Reference**: Jurafsky, D., Martin, J. H. (2009). *Speech and language processing: an introduction to natural language processing, computational linguistics, and speech recognition*. Upper Saddle River, N.J.: Pearson Prentice Hall.

