---
layout: post
title: "The Transformer Model"
date: 2022-06-13
categories: DL NLP
tags: [Encoder-decoder]
toc: false
published: true
hidden: true
comments: true
---

The contents in this post are mostly excerpted from the great paper "Attention Is All You Need" [^1]. There are also some notes and figures from other references.

## 1. Introduction

Transformer is a model architecture eschewing recurrence and convolution, and instead relying entirely on an attention mechanism to draw global dependencies between input and output. The Transformer allows for significantly more parallelization.

<div align='center'>
<figure>
<img src="https://lena-voita.github.io/resources/lectures/seq2seq/transformer/modeling_table-min.png" alt="img" style="zoom: 25%;" />
<figcaption style="font-size:80%;"> Table: Comparison with previous Seq2Seq (encoder-decoder) models. (<a href="https://lena-voita.github.io/nlp_course/seq2seq_and_attention.html#transformer_intro">Source</a>) </figcaption>
</figure>
</div>

## 2. Background

In the Transformer, the number of operations required to relate signals from two arbitrary input or output positions is reduced to a constant.

Self-attention, sometimes called intra-attention is an attention mechanism relating different positions of a single sequence in order to compute a representation of the sequence. 

## 3. Model Architecture

The Transformer follows an encoder-decoder architecture using stacked self-attention and point-wise, fully connected layers for both the encoder and decoder, shown in the left and right halves in the following figures, respectively.

<div align='center'>
<figure>
<img src="https://jalammar.github.io/images/t/The_transformer_encoder_decoder_stack.png" alt="img" style="zoom:50%;" />
<figcaption style="font-size:80%;"> Figure: A high level look at the Transformer. (<a href="https://jalammar.github.io/illustrated-transformer/#a-high-level-look">Source</a>) </figcaption>
</figure>
</div>

<div align='center'>
<figure>
<img src="https://lena-voita.github.io/resources/lectures/seq2seq/transformer/model-min.png" alt="img" style="zoom:40%;" />
<figcaption style="font-size:80%;"> Figure 1: The Transformer - model architecture. (<a href="https://lena-voita.github.io/nlp_course/seq2seq_and_attention.html#transformer_model_architecture">Source</a>) </figcaption>
</figure>
</div>

### 3.1 Encoder and Decoder Stacks

#### 3.1.1 Encoder

<div align='center'>
<figure>
<img src="https://lilianweng.github.io/posts/2018-06-24-attention/transformer-encoder.png" alt="img" style="zoom:33%;" />
<figcaption style="font-size:80%;"> Figure: The Transformer's encoder. (<a href="https://lilianweng.github.io/posts/2018-06-24-attention/#encoder">Source</a>) </figcaption>
</figure>
</div>

The encoder is composed of a stack of $$ N = 6 $$ identical layers. Each layer has two sub-layers. The first is a multi-head self-attention mechanism, and the second is a simple, positionwise fully connected feed-forward network. We employ a residual connection around each of the two sub-layers, followed by layer normalization. That is, the output of each sub-layer is $$ \mathrm{LayerNorm}(X + \mathrm{Sublayer}(X)) $$, where $$ \mathrm{Sublayer}(X) $$ is the function implemented by the sub-layer itself.

<div align='center'>
<figure>
<img src="https://jalammar.github.io/images/t/encoder_with_tensors_2.png" alt="img" style="zoom:60%;" />
<figcaption style="font-size:80%;"> Figure: The word at each position passes through a self-attention process. Then, they each pass through a feed-forward neural network -- the exact same network with each vector flowing through it separately. (<a href="https://jalammar.github.io/illustrated-transformer/#now-were-encoding">Source</a>) </figcaption>
</figure>
</div>

All 6 encoders receive a list of vectors $$ X = (x_1, \cdots, x_L) \in \mathbb{R}^{L \times d_{\mathrm{model}}} $$, each vector $$ x_i \in \mathbb{R}^{d_{\mathrm{model}}}$$. In the bottom encoder, $$ X $$ would be the word embeddings (each word is embedded into a vector of size $$ d_{\mathrm{model}} $$), but in other encoders, $$ X $$ would be the output of the encoder that's directly below. The list length $$ L $$ is hyperparameter we can set - basically it would be the length of the longest input sentence in our training dataset. Each encoder processes this list by passing the vectors into a "self-attention" layer, then into a position-wise feed-forward neural network, then sends out the output upwards to the next encoder. [^2]

The word in each position flows through its own path in the encoder. There are dependencies between these paths in the self-attention layer. The feed-forward layer does not have those dependencies, however, and thus the various paths can be executed in parallel while flowing through the feed-forward layer. [^2]

#### 3.1.2 Decoder

<div align='center'>
<figure>
<img src="https://lilianweng.github.io/posts/2018-06-24-attention/transformer-decoder.png" alt="img" style="zoom:33%;" />
<figcaption style="font-size:80%;"> Figure: The Transformer's decoder. (<a href="https://lilianweng.github.io/posts/2018-06-24-attention/#decoder">Source</a>) </figcaption>
</figure>
</div>

The decoder is also composed of a stack of $$ N = 6 $$​ identical layers. In addition to the two sub-layers in each encoder layer, the decoder inserts a third sub-layer (the middle one), which performs multi-head attention over the output of the encoder stack. We also modify the self-attention sub-layer in the decoder stack to preserve the auto-regressive property (predicting future by past), that is, to prevent positions from using the future information by masking the future positions.

<div align='center'>
<video controls autoplay>
<source src="https://lena-voita.github.io/resources/lectures/seq2seq/transformer/masked_self_attn.mp4" type="video/mp4">
</video>
<figcaption style="font-size:80%;"> Video: An illustration for the masking in decoder. (<a href="https://lena-voita.github.io/nlp_course/seq2seq_and_attention.html#masked_self_attention">Source</a>) </figcaption>
</div>

The encoder start by processing the input sequence. The output of the top encoder is then transformed into a set of attention vectors $$ K $$ and $$ V $$. These are to be used by each decoder in its "encoder-decoder attention" layer (the third/middle sub-layer in decoder) which helps the decoder focus on appropriate places in the input sequence.

<div align='center'>
<figure>
<img src="https://jalammar.github.io/images/t/transformer_decoding_2.gif" alt="img" style="zoom:70%;" />
<figcaption style="font-size:80%;"> Figure: An illustration for the decoding procedures. (<a href="https://jalammar.github.io/illustrated-transformer/#the-decoder-side">Source</a>) </figcaption>
</figure>
</div>

### 3.2 Attention

An attention function can be described as mapping a query and a set of key value pairs to an output, where the query, keys, values, and output are all vectors. The output is computed as a weighted sum of the values, where the weight assigned to each value is computed by a compatibility function of the query with the corresponding key.

Note: The key, value and query concepts come from retrieval systems. For exmaple, the search engine maps your queries (e.g. text in the search bar) against a set of keys (e.g. title, contents, etc.) in their database, then present you the best matched values (e.g. articles, videos, etc.). [^3]

<div align='center'>
<figure>
<img src="https://lilianweng.github.io/posts/2018-06-24-attention/transformer.png" alt="img" style="zoom:75%;" />
<figcaption style="font-size:80%;"> Figure: (left) The Transformer - model architecture. (middle) Multi-Head Attention consists of several
attention layers running in parallel. (right) Scaled Dot-Product Attention. (<a href="https://lilianweng.github.io/posts/2018-06-24-attention/#full-architecture">Source</a>) </figcaption>
</figure>
</div>

#### 3.2.1 Scaled Dot-Product (Self-)Attention

As for the Scaled Dot-Product Attention, the input consists of queries and keys of dimension $$ d_k $$, and values of dimension $$ d_v $$. We compute the dot products of the query with all keys, divide each by $$ \sqrt{d_k} $$, and apply a softmax function to obtain the weights on the values.

In practice, we compute the attention function on a set of queries simultaneously, packed together into a query matrix $$ Q \in \mathbb{R}^{L \times d_k} $$. The keys and values are also packed together into matrices $$ K \in \mathbb{R}^{L \times d_k} $$ and $$ V \in \mathbb{R}^{L \times d_v} $$. We compute the matrix of outputs as:

$$
\operatorname{Attention}(Q, K, V) = \operatorname{softmax}\left(\frac{Q K^{T}}{\sqrt{d_{k}}}\right) V.
$$

Here $$ A = \frac{Q K^{T}}{\sqrt{d_{k}}} \in \mathbb{R}^{L \times L} $$ refers to the Scaled Dot-Product Attention which produces the alignment score between $$ Q $$ and $$ K $$, then this score is softmaxed to produce the attention weight as $$ \operatorname{softmax}(A)  \in \mathbb{R}^{L \times L} $$, and finally the weighted values are calculated as $$ \operatorname{softmax}(A)V  \in \mathbb{R}^{L \times d_v} $$. 

The attention weight determines how much each positions were attended by the current position. An position that is relevant to the current position usually has a higher corresponding weight.

<div align='center'>
<figure>
<img src="https://miro.medium.com/max/1400/1*4Ky7WD2Bwt7ONuewCEimbg.gif" alt="img" style="zoom:55%;" />
<figcaption style="font-size:80%;"> Figure: Step flow of calculating attentions (<a href="https://medium.com/lsc-psd/introduction-of-self-attention-layer-in-transformer-fc7bff63f3bc">Source</a>) </figcaption>
</figure>
</div>
<div align='center'>
<figure>
<img src="https://miro.medium.com/max/1400/1*tIU60poFU4Ym988ULlN1sA.gif" alt="img" style="zoom:62.5%;" />
<figcaption style="font-size:80%;"> Figure: Step flow of calculating calculating outputs of self-attention layer (<a href="https://medium.com/lsc-psd/introduction-of-self-attention-layer-in-transformer-fc7bff63f3bc">Source</a>) </figcaption>
</figure>
</div>

Why dot-product attention: The two most commonly used attention functions are additive attention, and dot-product (multiplicative) attention, and they are similar in theoretical complexity. Here we use the dot-product attention, which is much faster and more space-efficient in practice, since it can be implemented using highly optimized matrix multiplication code.

Why scaling: For large values of $$ d_k $$, the dot products grow large in magnitude, pushing the softmax function into regions where it has extremely small gradients. To counteract this effect, we scale the dot products by $$ \frac{1}{\sqrt{d_{k}}} $$. To illustrate why the dot products get large, assume that the components of $$ q $$ and $$ k $$ are independent random variables with mean 0 and variance 1. Then their dot product, $$ q \cdot k = \sum_{i=1}^{d_k} q_i k_i $$, has mean 0 and variance $$ d_k $$. 

#### 3.2.2 Multi-Head Attention

Instead of performing a single attention function with $$ d_{\mathrm{model}} $$-dimensional keys, values and queries, the Multi-Head Attention projects the queries, keys and values $$ h $$ times with different, learned linear projections to $$ d_k $$, $$ d_k $$ and $$ d_v $$ dimensions, respectively. On each of these projected versions of queries, keys and values we then perform the attention function in parallel, yielding $$ d_v $$-dimensional output values. These are concatenated and once again projected, resulting in the final values.

Multi-head attention allows the model to jointly attend to information from different representation subspaces at different positions. With a single attention head, averaging inhibits this. 

Note: we can regard the multi-head mechanism as ensembling. [^4]

$$
\operatorname{MultiHead}(X)=\operatorname{Concat}\left(\mathrm{head}_{1}, \ldots, \mathrm{head}_{h} \right) W^{O},
$$

where each head is calcaluted as

$$
\mathrm{head}_{g} = \operatorname{Attention}(Q, K, V), \quad g = 1, \cdots, h.
$$

Where

$$
Q = X W_{g}^{Q}, \\
K = X W_{g}^{K}, \\
V = X W_{g}^{V}.
$$

Here the queries matrix $$ Q \in \mathbb{R}^{L \times d_k} $$, the keys matrix $$ K \in \mathbb{R}^{L \times d_k} $$ and the values matrix $$ V \in \mathbb{R}^{L \times d_v} $$, and the input $$ X \in \mathbb{R}^{L \times d_{\mathrm{model}}} $$, and the projections are parameter matrices $$ W_{g}^{Q} \in \mathbb{R}^{d_{\mathrm{model}} \times d_{k}} $$, $$ W_{g}^{K} \in \mathbb{R}^{d_{\mathrm{model}} \times d_{k}} $$, $$ W_{g}^{V} \in \mathbb{R}^{d_{\mathrm{model}} \times d_{v}} $$ and $$ W^{O} \in \mathbb{R}^{h d_{v} \times d_{\mathrm{model}}} $$, and the attention head $$ \mathrm{head}_{g} \in \mathbb{R}^{L\times d_{v}}$$. [^5]

In the paper the authors employ $$ h=8 $$ parallel attention layers, or heads. For each of these the authors use $$ d_{k}=d_{v}=d_{\text {model }} / h=64 $$.

<div align='center'>
<figure>
<img src="https://jalammar.github.io/images/t/transformer_multi-headed_self-attention-recap.png" alt="img" style="zoom:75%;" />
<figcaption style="font-size:80%;"> Figure: An illustration for the multi-head attention procedures. (<a href="https://jalammar.github.io/illustrated-transformer/#the-beast-with-many-heads">Source</a>) </figcaption>
</figure>
</div>

#### 3.2.3 Applications of Attention in our Model

The Transformer uses multi-head attention in different ways:

* In "encoder-decoder attention" layer (the third/middle sub-layer in decoder), the queries come from the previous decoder layer, and the memory keys and values come from the output of the encoder. This allows every position in the decoder to attend over all positions in the input sequence. This mimics the typical encoder-decoder attention mechanisms.
* The encoder/decoder contains self-attention layers, which allow each position in the encoder/decoder to attend to all positions in the encoder/decoder up to and including that position. 
* In the decoder, the self-attention layer is only allowed to attend to earlier positions in the output sequence. We implement this inside of scaled dot-product attention by masking out all values (setting to $$-\infty$$) for future positions in the input of the softmax.

In the encoder, source tokens communicate with each other and update their representations; In the decoder, a target token first looks at previously generated target tokens, then at the source tokens, and finally updates its representation. [^6]

### 3.3 Position-wise Feed-Forward Networks

Each encoder and decoder contains a fully connected feed-forward network, which is applied to each position (in the list of vectors each of the size $$ d_{\mathrm{model}} $$) separately and identically. This consists of two linear transformations with a ReLU activation in between.

$$
\operatorname{FFN}(X) = \max(0, X W_1 + b_1)W_2 + b_2
$$

The dimensionality of input and output is $$ d_{\mathrm{model}} = 512 $$, and the inner-layer has dimensionality $$ d_{ff} = 2048 $$.

### 3.4 Embeddings and Softmax

We use embedding layers to convert the input tokens (words) and output tokens (words) to vectors of dimension $$ d_{\mathrm{model}} $$. We share the same weight matrix between the two embedding layers (for encoder and decoder) and the pre-softmax linear transformation, similar to ([Press et al., 2016](https://arxiv.org/abs/1608.05859)). In the embedding layers, we multiply those weights by $$ \sqrt{d_{\mathrm{model}}} $$.

<div align='center'>
<figure>
<img src="https://jalammar.github.io/images/t/transformer_decoder_output_softmax.png" alt="img" style="zoom:70%;" />
<figcaption style="font-size:80%;"> Figure: An illustration for the procedures from the output of the decoder stack to an output word. (<a href="https://jalammar.github.io/illustrated-transformer/#the-final-linear-and-softmax-layer">Source</a>) </figcaption>
</figure>
</div>

The pre-softmax linear transformation is a simple fully connected neural network that projects the vector produced by the stack of decoders, into a much, much larger vector called a logits vector of the output vocabulary size. The softmax layer then turns those scores into probabilities (all positive, all add up to 1.0). The word associated with the highest probability is produced as the output for this time step. [^2]

### 3.5 Positional Encoding

Unlike recurrence and convolution, self-attention operation is permutation invariant. In order for the model to make use of the order of the sequence, we must inject some information about the relative or absolute position of the tokens in the sequence. To this end, we add "positional encodings" to the input embeddings at the bottoms of the encoder and decoder stacks. The positional encodings have the same dimension $$ d_{\mathrm{model}} $$ as the embeddings, so that the two can be summed. There are many choices of positional encodings, learned and fixed ([Gehring et al., 2017](https://arxiv.org/abs/1705.03122)). The authors found that having fixed ones does not hurt the quality.

#### 3.5.1 Criterias

Ideally, the following criteria should be satisfied [^7]:

- It should output a unique encoding for each position.
- The encoding value at a given position should be consistent irrespective of the sequence lengh $$ L $$ or any other factor. The encoding like $$ (\frac{1}{L}, \frac{2}{L}, \cdots, 1) $$ doesn't satisfy this criteria.
- Our model should generalize to longer sequences without any efforts. Its values should be bounded. The encoding like $$ (1, 2, \cdots, L) $$ doesn't satisfy this criteria.
- It must be deterministic.

#### 3.5.2 Sinusoidal Encoding

The encoding proposed by the authors is a simple yet genius technique which satisfies all of those criteria. That is

$$
\mathrm{PE}(i,j) = 
\begin{cases}
\sin\left(\frac{i}{10000^{2j'/d}}\right) & \text{if } j = 2j'\\
\cos\left(\frac{i}{10000^{2j'/d}}\right) & \text{if } j = 2j' + 1\\
\end{cases}
$$

where $$ i = 1, \cdots, L$$ is the position index of the input sequence, and $$ j = 1, \cdots, d_{\mathrm{model}}$$ is the dimension index. Both $$ i $$ and $$ j $$ can inform us the token's order.

The positional encoding matrix $$ \mathrm{PE} \in \mathbb{R}^{L \times d_{\mathrm{model}}} $$ has the same dimension as the input embedding, so it can be added on the input directly. 

<div align='center'>
<figure>
<img src="https://jalammar.github.io/images/t/attention-is-all-you-need-positional-encoding.png" alt="img" style="zoom:80%;" />
<figcaption style="font-size:80%;"> Figure: An example for positional encoding PE with L = 10 and d_{model} = 64. (<a href="https://jalammar.github.io/illustrated-transformer/#representing-the-order-of-the-sequence-using-positional-encoding">Source</a>) </figcaption>
</figure>
</div>

#### 3.5.3 Linear Relationships

This encoding allows the model to easily learn to attend by relative positions, since for any fixed offset $$ k $$, the encoding vector $$ \mathrm{PE}(i+k, \cdot) $$ can be represented as a linear transformation from $$ \mathrm{PE}(i, \cdot) $$, i.e. 

$$
\mathrm{PE}(i+k, \cdot) = T_k \times \mathrm{PE}(i, \cdot),
$$

where $$ \mathrm{PE}(i, \cdot) \in \mathbb{R}^{d_{\mathrm{model}}}, \forall i=1,\cdots,L-k $$ is an encoding vector at position $$ i $$. Note that the linear transformation $$ T_k $$ depends on $$ k, d_{\mathrm{model}}, j $$, but doesn't on $$ i $$. Refer to [^8] for the detailed proof of this transformation.

#### 3.5.4 Other Tips

There are some insightful thoughts from [^7] about this position encoding.

##### Encoding Differences

In addition the linear relationships, another property of sinusoidal position encoding is that the encoding differences between neighboring positions are symmetrical and decays nicely with position gap. 

##### Summation Instead of Concatenation

We sum the word embedding and positional encoding instead of concatenating them. It is natural for us to worry that they may interfere with each other. 

We will find out from the figure that only the first few dimensions of the whole encoding are used to store the positional information. Since the embeddings in the Transformer are trained from scratch, the parameters are probably set in a way that the semantic of words does not get stored in the first few dimensions to avoid interfering with the positional encoding. The final trained Transformer can probably separate the semantic of words from their positional information.

##### Positional Information Doesn't Vanish through Upper Layers

Thanks to the residual connections.

##### Using Both Sine and Cosine

To get the [linear relationships](#353-linear-relationships).

## 4. Why Self-Attention

As the model processes each word (each position in the input sequence), self-attention allows it to look at other positions in the input sequence for clues that can help lead to a better encoding for this word. [^2] Theoretically the self-attention can adopt any attention mechanism (e.g. additive, dot-product, etc.), but just replace the target sequence with the same input sequence. [^4]

### 4.1 Three Aspects

The authors compare three aspects of self-attention layers to the recurrent and convolutional layers commonly used for mapping one variable-length sequence of symbol representations to another sequence of equal length, such as a hidden layer in a typical sequence transduction encoder or decoder. 

One is the total computational complexity per layer. Another is the amount of computation that can be parallelized, as measured by the minimum number of sequential operations required.

The third is the path length between long-range dependencies in the network. Learning long-range dependencies is a key challenge in many sequence transduction tasks. One key factor affecting the ability to learn such dependencies is the length of the paths forward and backward signals have to traverse in the network. The shorter these paths between any combination of positions in the input and output sequences, the easier it is to learn long-range dependencies. ([Hochreiter et al., 2001](https://ieeexplore.ieee.org/document/5264952))

<div align='center'>
<figure>
<img src="https://i.imgur.com/vTDh4uv.png" alt="comparison" style="zoom:100%;" />
<img src="https://i.imgur.com/Yc4rKT4.png" alt="comparison" style="zoom:100%;" />
<figcaption style="font-size:80%;"> Figure: Comparision between CNN, RNN and Self-Attention. (<a href="https://hackmd.io/@YungHuiHsu/Sk94txrBq">Source</a>) </figcaption>
</figure>
</div>

Self-attention layers are usually faster than recurrent and convolutional layers since $$ n $$ is usually smaller than $$ d $$. To improve computational performance for tasks involving very long sequences (very large $$ n $$), self-attention could be restricted to considering only a neighborhood of size $$ r $$ in the input sequence centered around the respective output position. This would increase the maximum path length to $$ O(n/r) $$. 

A single convolutional layer with kernel width $$ k < n $$ does not connect all pairs of input and output positions. Doing so requires a stack of $$ O(n/k) $$ convolutional layers in the case of contiguous kernels, or $$ O(\log_k(n)) $$ in the case of dilated convolutions.

Compared to RNN, self-attention is able to do parallel computing; Compared to CNN, there is no need of deep network for self-attention to look for long sentence.

### 4.2 Interpretation

As side benefit, self-attention could yield more interpretable models. Not only do individual attention heads clearly learn to perform different tasks, many appear to exhibit behavior related to the syntactic and semantic structure of the sentences.

For example,

<div align='center'>
<figure>
<img src="https://i.stack.imgur.com/QzaaI.png" alt="Figure 3" style="zoom:85%;" />
</figure>
</div>

## 5. Training

### 5.3 Optimizer

Vaswani, et al. (2017) used the [Adam optimizer](https://arxiv.org/abs/1412.6980).

### 5.4 Regularization

Vaswani, et al. (2017) employed Residual [Dropout](https://www.jmlr.org/papers/volume15/srivastava14a/srivastava14a.pdf) and Label Smoothing.

<br>

**References:**

[^1]: Vaswani, Ashish, et al. "Attention is all you need." *Advances in neural information processing systems* 30 (2017).

[^2]: Alammar, Jay. "[The Illustrated Transformer.](https://jalammar.github.io/illustrated-transformer/)" *jalammar.github.io*. June 27, 2018.

[^3]: Dontloo. "[Answer for the question 'What exactly are keys, queries, and values in attention mechanisms?'.](https://stats.stackexchange.com/a/424127)" *StackExchange*, Aug 29, 2019.

[^4]: Weng, Lilian. "[Attention? Attention!](https://lilianweng.github.io/posts/2018-06-24-attention/#transformer)" *Lil'Log*. June 24, 2018.

[^5]: Thickstun, John. "[The Transformer Model in Equations.](https://johnthickstun.com/docs/transformers.pdf)"

[^6]: Viota, Lena. "[Sequence to Sequence (seq2seq) and Attention.](https://lena-voita.github.io/nlp_course/seq2seq_and_attention.html#transformer)" *lena-voita.github.io*. April 30, 2022.

[^7]: Kazemnejad, Amirhossein. "[Transformer Architecture: The Positional Encoding.](https://kazemnejad.com/blog/transformer_architecture_positional_encoding/)" *kazemnejad.com*. 2019.

[^8]: Denk, Timo. "[Linear Relationships in the Transformer's Positional Encoding.](https://timodenk.com/blog/linear-relationships-in-the-transformers-positional-encoding/)" *Timo Denk's Blog*. 2019.
