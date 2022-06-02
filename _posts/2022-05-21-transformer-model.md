---
layout: post
title: "The Transformer Model"
date: 2022-05-21
categories: NLP DL
published: false
hidden: true
comments: true
---

The contents in this post are mostly excerpted from the great paper "Attention Is All You Need" [^1]. There are also some notes and figures from other references.

## 1. Introduction

Transformer is a model architecture eschewing recurrence and convolution, and instead relying entirely on an attention mechanism to draw global dependencies between input and output. The Transformer allows for significantly more parallelization.

<div align='center'>
<figure>
<img src="https://lena-voita.github.io/resources/lectures/seq2seq/transformer/modeling_table-min.png" alt="img" style="zoom: 25%;" />
<figcaption style="font-size:80%;"> (<a href="https://lena-voita.github.io/nlp_course/seq2seq_and_attention.html#transformer_intro">Source</a>) </figcaption>
</figure>
</div>

## 2. Background

In the Transformer, the number of operations required to relate signals from two arbitrary input or output positions is reduced to a constant.

Self-attention, sometimes called intra-attention is an attention mechanism relating different positions of a single sequence in order to compute a representation of the sequence.

## 3. Model Architecture

The Transformer follows an encoder-decoder architecture using stacked self-attention and point-wise, fully connected layers for both the encoder and decoder, shown in the left and right halves in the following figures, respectively.

<div align='center'>
<figure>
<img src="https://jalammar.github.io/images/t/The_transformer_encoder_decoder_stack.png" alt="img" style="zoom:67%;" />
<figcaption style="font-size:80%;"> Figure: A high level look at the Transformer. (<a href="https://jalammar.github.io/illustrated-transformer/#a-high-level-look">Source</a>) </figcaption>
</figure>
</div>

<div align='center'>
<figure>
<img src="https://lena-voita.github.io/resources/lectures/seq2seq/transformer/model-min.png" alt="img" style="zoom:80%;" />
<figcaption style="font-size:80%;"> Figure 1: The Transformer - model architecture. (<a href="https://lena-voita.github.io/nlp_course/seq2seq_and_attention.html#transformer_model_architecture">Source</a>) </figcaption>
</figure>
</div>
### 3.1 Encoder and Decoder Stacks

#### 3.1.1 Encoder

<div align='center'>
<figure>
<img src="https://lilianweng.github.io/posts/2018-06-24-attention/transformer-encoder.png" alt="img" style="zoom:40%;" />
<figcaption style="font-size:80%;"> Figure: The Transformer's encoder. (<a href="https://lilianweng.github.io/posts/2018-06-24-attention/#encoder">Source</a>) </figcaption>
</figure>
</div>
The encoder is composed of a stack of $$ N = 6 $$ identical layers. Each layer has two sub-layers. The first is a multi-head self-attention mechanism, and the second is a simple, positionwise fully connected feed-forward network. We employ a residual connection around each of the two sub-layers, followed by layer normalization. That is, the output of each sub-layer is $$ \mathrm{LayerNorm}(x + \mathrm{Sublayer}(x)) $$, where $$ \mathrm{Sublayer}(x) $$ is the function implemented by the sub-layer itself.

<div align='center'>
<figure>
<img src="https://jalammar.github.io/images/t/encoder_with_tensors_2.png" alt="img" style="zoom:70%;" />
<figcaption style="font-size:80%;"> Figure: The word at each position passes through a self-attention process. Then, they each pass through a feed-forward neural network -- the exact same network with each vector flowing through it separately. (<a href="https://jalammar.github.io/illustrated-transformer/">Source</a>) </figcaption>
</figure>
</div>

All 6 encoders receive a list of vectors each of the size $$ d_{\mathrm{model}} = 512$$ -- In the bottom encoder that would be the word embeddings (each word is embedded into a vector of size $$ d_{\mathrm{model}} $$), but in other encoders, it would be the output of the encoder that's directly below. The size of this list is hyperparameter we can set - basically it would be the length of the longest sentence in our training dataset. Each encoder processes this list by passing the vectors into a "self-attention" layer, then into a position-wise feed-forward neural network, then sends out the output upwards to the next encoder. [^2]

The word in each position flows through its own path in the encoder. There are dependencies between these paths in the self-attention layer. The feed-forward layer does not have those dependencies, however, and thus the various paths can be executed in parallel while flowing through the feed-forward layer. [^2]

#### 3.1.2 Decoder

<div align='center'>
<figure>
<img src="https://lilianweng.github.io/posts/2018-06-24-attention/transformer-decoder.png" alt="img" style="zoom:40%;" />
<figcaption style="font-size:80%;"> Figure: The Transformer's decoder. (<a href="https://lilianweng.github.io/posts/2018-06-24-attention/#decoder">Source</a>) </figcaption>
</figure>
</div>
The decoder is also composed of a stack of $$ N = 6 $$​ identical layers. In addition to the two sub-layers in each encoder layer, the decoder inserts a third sub-layer (the middle one), which performs multi-head attention over the output of the encoder stack. We also modify the self-attention sub-layer in the decoder stack to prevent positions from using the future information by masking the future positions.


### 3.2 Attention

An attention function can be described as mapping a query and a set of key value pairs to an output, where the query, keys, values, and output are all vectors. The output is computed as a weighted sum of the values, where the weight assigned to each value is computed by a compatibility function of the query with the corresponding key.

Note: The key, value and query concepts come from retrieval systems. For exmaple, the search engine maps your queries (e.g. text in the search bar) against a set of keys (e.g. title, contents, etc.) in their database, then present you the best matched values (e.g. articles, videos, etc.). [^5]

<div align='center'>
<figure>
<img src="https://lilianweng.github.io/posts/2018-06-24-attention/transformer.png" alt="img" style="zoom:80%;" />
<figcaption style="font-size:80%;"> Figure: (left) The Transformer - model architecture. (middle) Multi-Head Attention consists of several
attention layers running in parallel. (right) Scaled Dot-Product Attention. (<a href="https://lilianweng.github.io/posts/2018-06-24-attention/#full-architecture">Source</a>) </figcaption>
</figure>
</div>
#### 3.2.1 Scaled Dot-Product Attention

As for the Scaled Dot-Product Attention, the input consists of queries and keys of dimension $$ d_k $$, and values of dimension $$ d_v $$. We compute the dot products of the query with all keys, divide each by $$ \sqrt{d_k} $$, and apply a softmax function to obtain the weights on the values.

In practice, we compute the attention function on a set of queries simultaneously, packed together into a matrix $$ Q $$. The keys and values are also packed together into matrices $$ K $$ and $$ V $$. We compute the matrix of outputs as:

$$
\operatorname{Attention}(Q, K, V) = \operatorname{softmax}\left(\frac{Q K^{T}}{\sqrt{d_{k}}}\right) V.
$$

The two most commonly used attention functions are additive attention, and dot-product (multiplicative) attention, and they are similar in theoretical complexity. Here we use the dot-product attention, which is much faster and more space-efficient in practice, since it can be implemented using highly optimized matrix multiplication code.

For large values of $$ d_k $$, the dot products grow large in magnitude, pushing the softmax function into regions where it has extremely small gradients. To counteract this effect, we scale the dot products by $$ \frac{1}{\sqrt{d_{k}}} $$. To illustrate why the dot products get large, assume that the components of $$ q $$ and $$ k $$ are independent random variables with mean 0 and variance 1. Then their dot product, $$ q \cdot k = \sum_{i=1}^{d_k} q_i k_i $$, has mean 0 and variance $$ d_k $$. 

#### 3.2.2 Multi-Head Attention

Instead of performing a single attention function with $$ d_{\mathrm{model}} $$-dimensional keys, values and queries, the Multi-Head Attention projects the queries, keys and values $$ h $$ times with different, learned linear projections to $$ d_k $$, $$ d_k $$ and $$ d_v $$ dimensions, respectively. On each of these projected versions of queries, keys and values we then perform the attention function in parallel, yielding $$ d_v $$-dimensional output values. These are concatenated and once again projected, resulting in the final values.

Multi-head attention allows the model to jointly attend to information from different representation subspaces at different positions. With a single attention head, averaging inhibits this. 

Note: we can regard the multi-head mechanism as ensembling. [^3]
$$
\operatorname{MultiHead}(Q, K, V)=\operatorname{Concat}\left(\mathrm{head}_{1}, \ldots, \mathrm{head}_{h} \right) W^{O}
$$

where

$$
\mathrm{head}_{i} = \operatorname{Attention}\left(Q W_{i}^{Q}, K W_{i}^{K}, V W_{i}^{V}\right) = \operatorname{softmax}\left(\frac{Q W_{i}^{Q} {W_{i}^{K}}^{T} K^{T} }{\sqrt{d_{k}}}\right) V W_{i}^{V}.
$$

Where the queries matrix $$ Q \in \mathbb{R}^{d_{k} \times d_{\mathrm{model}}} $$, the keys matrix $$ K \in \mathbb{R}^{d_{k} \times d_{\mathrm{model}}} $$ and the values matrix $$ V \in \mathbb{R}^{d_{v} \times d_{\mathrm{model}}} $$, and the projections are parameter matrices $ W_{i}^{Q} \in \mathbb{R}^{d_{\mathrm{model}} \times d_{k}}, W_{i}^{K} \in \mathbb{R}^{d_{\mathrm{model}} \times d_{k}}, W_{i}^{V} \in \mathbb{R}^{d_{\mathrm{model}} \times d_{v}} $ and $ W^{O} \in \mathbb{R}^{h d_{v} \times d_{\mathrm{model}}} $, and the attention head $$ \mathrm{head}_{i} \in \mathbb{R}^{d_{k} \times d_{v}}$$.

In this work we employ $ h=8 $ parallel attention layers, or heads. For each of these we use $ d_{k}=d_{v}=d_{\text {model }} / h=64 $. 

#### 3.2.3 Applications of Attention in our Model

The Transformer uses multi-head attention in different ways:

* In "encoder-decoder attention" layer (the third/middle sub-layer in decoder), the queries come from the previous decoder layer, and the memory keys and values come from the output of the encoder. This allows every position in the decoder to attend over all positions in the input sequence. This mimics the typical encoder-decoder attention mechanisms.
* The encoder/decoder contains self-attention layers, which allow each position in the encoder/decoder to attend to all positions in the encoder/decoder up to and including that position. 
* In the decoder, the self-attention layer is only allowed to attend to earlier positions in the output sequence. We implement this inside of scaled dot-product attention by masking out all values (setting to $$-\infin$$) for future positions in the input of the softmax.

### 3.3 Position-wise Feed-Forward Networks

Each encoder and decoder contains a fully connected feed-forward network, which is applied to each position (in the list of vectors each of the size $$ d_{\mathrm{model}} $$) separately and identically. This consists of two linear transformations with a ReLU activation in between.
$$
\operatorname{FFN}(x) = \max(0, x W_1 + b_1)W_2 + b_2
$$
The dimensionality of input and output is $$ d_{\mathrm{model}} = 512 $$, and the inner-layer has dimensionality $$ d_{ff} = 2048 $$.

### 3.4 Embeddings and Softmax

We use embedding layers to convert the input tokens (words) and output tokens (words) to vectors of dimension $$ d_{\mathrm{model}} $$. We share the same weight matrix between the two embedding layers (for encoder and decoder) and the pre-softmax linear transformation, similar to ([Press et al., 2016](https://arxiv.org/abs/1608.05859)). In the embedding layers, we multiply those weights by $$ \sqrt{d_{\mathrm{model}}} $$.

<div align='center'>
<figure>
<img src="https://jalammar.github.io/images/t/transformer_decoder_output_softmax.png" alt="img" style="zoom:80%;" />
<figcaption style="font-size:80%;"> Figure: From the output of the decoder stack to an output word. (<a href="https://jalammar.github.io/illustrated-transformer/">Source</a>) </figcaption>
</figure>
</div>

The pre-softmax linear transformation is a simple fully connected neural network that projects the vector produced by the stack of decoders, into a much, much larger vector called a logits vector of the output vocabulary size. The softmax layer then turns those scores into probabilities (all positive, all add up to 1.0). The word associated with the highest probability is produced as the output for this time step. [^2]

### 3.5 Positional Encoding

TODO

## 4. Why Self-Attention

As the model processes each word (each position in the input sequence), self-attention allows it to look at other positions in the input sequence for clues that can help lead to a better encoding for this word.

TODO

## 5. Training

### 5.3 Optimizer

Vaswani, et al. (2017) used the [Adam optimizer](https://arxiv.org/abs/1412.6980).

### 5.4 Regularization

Vaswani, et al. (2017) employed Residual [Dropout](https://www.jmlr.org/papers/volume15/srivastava14a/srivastava14a.pdf) and Label Smoothing.

<br>

**References**: 

[^1]: Vaswani, Ashish, et al. "Attention is all you need." *Advances in neural information processing systems* 30 (2017).

[^2]: Alammar, Jay. "The Illustrated Transformer." *jalammar.github.io*. June 27, 2018. Retrieved from https://jalammar.github.io/illustrated-transformer/

[^3]: Weng, Lilian. "Attention? Attention!" *Lil'Log*, June 24, 2018. Retrieved from https://lilianweng.github.io/posts/2018-06-24-attention/#transformer

[^4]: Viota, Lena. "Sequence to Sequence (seq2seq) and Attention." *lena-voita.github.io*. Retrieved from https://lena-voita.github.io/nlp_course/seq2seq_and_attention.html#transformer

[^5]: Dontloo. "Answer for the question 'What exactly are keys, queries, and values in attention mechanisms?'." *StackExchange*, Aug 29, 2019. Retrieved from https://stats.stackexchange.com/a/424127