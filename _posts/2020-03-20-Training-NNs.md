---
layout: post
title:  "Training Neural Networks"
date: 2020-03-20
categories: DL
comments: true
---

## Optimization

Given a neural network, the goal of the training procedure is to learn parameters $W^{[l]}$ and $b^{[l]}$ for each layer $l$ that minimize the loss function plus regularization term. 

We first assume there are $n^{[l-1]}$ hidden units in the hidden layer $l-1$ and $n^{[l]}$ units in the layer $l$. Denote the output of the layer $$l-1$$ (it is also the input of the layer $$l$$) as $a^{[l-1]} \in \mathbb{R}^{n^{[l-1]}}$. In the layer $$l$$, denote the weight matrix as $W^{[l]} \in \mathbb{R}^{n^{[l]}\times n^{[l-1]}}$, bias vector as $b^{[l]}\in\mathbb{R}^{n^{[l]}}$, activation function as $$\sigma^{[l]}(\cdot)$$, then the output of the layer $$l$$ is 

$$
a^{[l]} = \sigma^{[l]}(W^{[l]} a^{[l-1]} + b^{[l]}) \in \mathbb{R}^{n^{[l]}}.
$$

### Loss Function 

The observations for target variable are $$y=(y_1,y_2,\cdots,y_n)^T\in\mathbb{R}^n$$, and the corresponding predictions are $$\hat{y}=(\hat{y}_1, \hat{y}_2, \cdots, \hat{y}_n)^T \in \mathbb{R}^n$$.

For regression problems, the **L2 loss** is most commonly used:

$$
L(\hat{y}_i, y_i) = (y_i - \hat{y}_i)^2, \text{ or } L(\hat{y}, y) = \| \hat{y} - y \|_2^2.
$$

For $K$-class classification problems, we usually use **cross-entropy loss** function:

$$
L(\hat{p}_i, y_i) = -\sum_{k=1}^{K} \mathbf{1}(y_i \text{ in class } k)\log(\hat{p}_{ik}),
$$

where $$\hat{p}_{ik}$$ is the estimated probability of $y_i$ belongs to class $k$, and $$\mathbf{1}(\cdot)$$ is the indicator function. The estimated probabilities $\hat{p}_{ik}$ by softmax function is $$\frac{e^{z_{ik}}}{\sum _{k=1}^{K}e^{z_{ik}}}$$. 

For binary classification, the cross-entropy loss is

$$
L(\hat{p}_i, y_i) = -y_i\log(\hat{p}_i) - (1-y_i)\log(1-\hat{p}_i),
$$

where $y_i\in\{0,1\}$, $\hat{p}_i$ is the estimated probability of $y_i=1$. 

### Initialization

If the weights in a network start too small/large, then the backpropagated gradient signal shrinks/grows as it passes through and it may lead to vanishing/exploding gradients, and that can result in divergence/slow-down in the training of the network.

The appropriate initialization that follows the rules below guarantees no exploding/vanishing (either forward or backward) signal.

1. The mean (expectation) of the activations should be same and be zero. i.e. $$E(a^{[l-1]}) = E(a^{[l]})=0$$;
2. The variance of the activations should stay the same across every layer. i.e. $$\text{Var}(a^{[l-1]}) = \text{Var}(a^{[l]})$$.

#### Xavier Initialization

Xavier initialization was introduced by Glorot Xavier, and it works for activation functions like sigmoid, tanh and linear etc.. 

That is, for every layer $l$, we initialize 

$$
W^{[l]} \sim N\left(0,\frac{1}{n^{[l-1]}}\right) \text{ or } N\left(0,\frac{2}{n^{[l-1]} + n^{[l]}}\right), \ b^{[l]}=0.
$$

We first derive the Xavier initialization through the forward propagation. Now the purpose of the initialization is to avoid the vanishing or exploding of the forward propagated signal.

Based on some assumptions (assume the activation function is tanh. etc.), we can show that 

$$
\text{Var}(a^{[l]}) = n^{[l-1]} \text{Var}(W^{[l]}) \cdot \text{Var}(a^{[l-1]}).
$$

It follows that setting $$\text{Var}(W^{[l]}) = 1/n^{[l-1]}$$ leads to $$\text{Var}(a^{[l-1]}) = \text{Var}(a^{[l]})$$. 

At every layer, we can link this layer's variance to the input layer’s variance:
$$
\begin{align}
\text{Var}(a^{[l]}) &= n^{[l-1]} \text{Var}(W^{[l]}) \cdot \text{Var}(a^{[l-1]}) \\
&= n^{[l-1]} \text{Var}(W^{[l]}) \cdot n^{[l-2]} \text{Var}(W^{[l-1]}) \cdot \text{Var}(a^{[l-2]}) \\
&= \cdots \\
&= \left[ \prod_{s=1}^l n^{[s-1]} \text{Var}(W^{[s]}) \right] \cdot \text{Var}(x).
\end{align}
$$

Then we have the following three cases:

$$
\begin{align}

&\text{For all } s=1,\cdots,l, \\

&n^{[s-1]} \text{Var}(W^{[s]}) 
\begin{cases}
<1 \implies \text{Var}(a^{[l]}) \ll \text{Var}(x); \\
=1 \implies \text{Var}(a^{[l]}) = \text{Var}(x); \\
>1 \implies \text{Var}(a^{[l]}) \gg \text{Var}(x). \\
\end{cases}

\end{align}
$$

Since the mean is zero (i.e. $$E(a^{[l]})=0$$), low variance (i.e. $$\text{Var}(a^{[l]})$$ is small) means that the activations $$a^{[l]}$$ would be very close to zero (forward signal vanishing), and high variance means that the activations would be very large in absolute value (forward signal exploding).

Throughout the justification, we worked on activations computed during the forward propagation, and we conclude that, to avoid the vanishing or exploding of the forward propagated signal, we initialize 

$$
\text{Var}(W^{[l]}) = \frac{1}{n^{[l-1]}}.
$$

The same result can be derived for the backpropagated gradients. Doing so, you will see that in order to avoid the vanishing or exploding gradient problem, we should initialize 

$$
\text{Var}(W^{[l]}) = \frac{1}{n^{[l]}}.
$$

As a compromise, we can roughly took the harmonic mean of the two:

$$
\text{Var}(W^{[l]}) = \frac{2}{n^{[l-1]} + n^{[l]}}.
$$

#### He Initialization

He initialization was introduced by Kaiming He, and it works for activation functions like ReLU and leaky ReLU etc..

That is, for every layer $l$, we initialize 

$$
W^{[l]} \sim N\left(0,\frac{2}{n^{[l-1]}}\right), \ b^{[l]}=0.
$$

For activation functions like ReLU and leaky ReLU etc., this initialization avoid the vanishing or exploding of both the forward propagated signal and backpropagated gradients.

### Backpropagation

We usually use gradient descent to optimize the objective function $\text{Obj}(w)$. For weight, we have $w_t=w_{t-1} - \eta \frac{\partial\ \text{Obj}(w_{t-1})}{\partial\ w_{t-1}}$, where $\eta$ is the step-size (learning rate).

The solution to computing the gradient is an algorithm called error **backpropagation**, which use the chain rules in calculus. (Note: the regularization term is not considered in the pictures below.) 

<div style="text-align: center"> <img src="/pictures/backpropagation.png" alt="backpropagation" style="zoom: 40%;" /> </div> 

Here let's take an example. Say there is a feed forward neural network for regression, as shown in the picture below. 

<div style="text-align: center"> <img src="/pictures/neural_network_example_2.png" alt="Grid Search and Random Search" style="zoom:25%;" /> </div>

Suppose the activation function $$\sigma(\cdot)$$ for hidden layer is sigmoid, and the activation function for output layer is identity function. Denote the input vector as $$x\in\mathbb{R}^{p}$$, the target as $$y\in\mathbb{R}$$, the output scalar as $$\hat{y}\in\mathbb{R}$$, the weights of hidden layer as $W\in\mathbb{R}^{p \times q}$, the weights of output layer as $$V\in\mathbb{R}^{q}$$, the loss function as $$L(\hat{y},y)=(\hat{y}-y)^2$$. This network can be expressed mathematically as

$$
\hat{y} = \sigma(x^TW) \cdot V,
$$

where $$x$$ is the input of the hidden layer, $$\sigma(x^TW)$$ is the output of the hidden layer and is also the input of the output layer, and $$\hat{y}$$ is the output of the output layer. 

Denote $$w_r\in\mathbb{R}^p$$ as the $$r$$-th column vector of $$W$$, $$v_r\in\mathbb{R}$$ as the $r$-th entry of $$V$$, and $$\mathbf{1}$$ as an all ones vector. We have $$W = (w_1,w_2,\cdots,w_q)$$ and $$V=(v_1,v_2,\cdots,v_q)^T$$, then the network can be expressed in summation form as

$$
\hat{y} = \sigma(x^TW) \cdot V = \Big( \sigma(x^Tw_1), \cdots, \sigma(x^Tw_q) \Big) \cdot V = \sum_{r=1}^q \sigma(x^Tw_r) v_r.
$$

Now let's compute the gradients for $$v_r$$ and $$w_r$$:

$$
\begin{align}
& \frac{\partial L(\hat{y},y)}{\partial v_r} = \frac{\partial L(\hat{y},y)}{\partial \hat{y}} \frac{\partial \hat{y}}{\partial v_r} = 2(\hat{y}-y) \cdot \sigma(w_r^Tx), \\
& \frac{\partial L(\hat{y},y)}{\partial w_r} = \frac{\partial L(\hat{y},y)}{\partial \hat{y}} \frac{\partial \hat{y}}{\partial \sigma(x^Tw_r)} \frac{\partial \sigma(x^Tw_r)}{x^Tw_r} \frac{\partial x^Tw_r}{w_r} = 2(\hat{y}-y) v_r \cdot \sigma(x^Tw_r) [1 - \sigma(x^Tw_r)] \cdot x.
\end{align}
$$

Or directly the gradients for $$V$$ and $$W$$:

$$
\begin{align}
& \frac{\partial L(\hat{y},y)}{\partial V} = \frac{\partial L(\hat{y},y)}{\partial \hat{y}} \frac{\partial \hat{y}}{\partial V} = 2(\hat{y}-y) \cdot \sigma(W^Tx), \\
& \frac{\partial L(\hat{y},y)}{\partial W} = \frac{\partial L(\hat{y},y)}{\partial \hat{y}} \frac{\partial \hat{y}}{\partial \sigma(x^TW)} \frac{\partial \sigma(x^TW)}{x^TW} \frac{\partial x^TW}{W} = 2(\hat{y}-y) x \cdot \big[ V^T \odot \sigma(x^TW) \odot [\mathbf{1} - \sigma(x^TW)] \big].
\end{align}
$$

## Hyperparameters Tuning

The most common hyperparameters in Neural Networks include:

- the number of neurons (width)

- the number of layers (depth)

- the initial learning rate

- learning rate decay schedule (such as the decay constant)

- regularization strength (L2 penalty, dropout strength)

### Number of Neurons

Here are 3 rule-of-thumb methods for determining an acceptable number of neurons to use in the hidden layers [[Reference](https://www.heatonresearch.com/2017/06/01/hidden-layers.html)]. The number of hidden neurons should be: 

- between the size of the input layer and the size of the output layer.
- 2/3 the size of the input layer, plus the size of the output layer.
- less than twice the size of the input layer.

### Use a Single Validation Set

In practice, we prefer one validation fold to cross-validation. In most cases a single validation set of respectable size substantially simplifies the code base, without the need for cross-validation with multiple folds.

### Hyperparameter Ranges

Search for learning rate and regularization strength on log scale. For example, a typical sampling of the learning rate would look as follows: `learning_rate = 10 ** uniform(-6, 1)`. That is, we are generating a random number from a uniform distribution, but then raising it to the power of $$10$$. 

### Prefer Random Search

We prefer random search to grid search. As argued by Bergstra and Bengio in [Random Search for Hyper-Parameter Optimization](http://www.jmlr.org/papers/volume13/bergstra12a/bergstra12a.pdf), "randomly chosen trials are more efficient for hyper-parameter optimization than trials on a grid". As it turns out, this is also usually easier to implement. 

<div style="text-align: center"> <img src="/pictures/gridsearchbad.jpeg" alt="Grid Search and Random Search" style="zoom:50%;" /> </div>

## Regularization

We usually need to regularize the weight parameters, but It is not common to regularize the bias parameters because they do not interact with the data through multiplicative interactions, and therefore do not have the interpretation of controlling the influence of a data dimension on the final objective. 

### Why Don't Control Depth

Why we don't control the depth of networks to avoid overfitting?

In practice, it is always better to use the following methods to control overfitting instead of controlling the depth. In terms of optimization of objective, compared to shallow NNs, the deeper NNs contain significantly more local minima, but these minima turn out to be much better than that of shallow NNs in terms of their actual loss. Since Neural Networks are non-convex, it is hard to study these properties mathematically. 

Additionally, the final loss of a shallower network can have a higher variance in practice, it may due to the number of minimas is small. Sometimes we get a good minima, and sometimes we get a very bad one, and it relies on the random initialization. However, for a deep network, all solutions are about equally as good, and rely less on the luck of random initialization. 

In conclusion, you should use as big of a neural network as your computational budget allows, and use other regularization techniques to control overfitting. 

### L1 regularization

L1 regularization is another relatively common form of regularization, where for each weight $w$ we add the term $$λ \| w \|_1$$ to the objective.

The L1 regularization has the intriguing property that it leads the weight vectors to become sparse during optimization (i.e. very close to exactly zero). In other words, neurons with L1 regularization end up using only a sparse subset of their most important inputs and become nearly invariant to the "noisy" inputs. 

### L2 regularization

L2 regularization is perhaps the most common form of regularization. It can be implemented by penalizing the squared magnitude of all parameters directly in the objective. That is, for every weight $w$ in the network, we add the term $$\frac{1}{2}λ\|w\|_2^2$$ to the objective, where $λ$ is the regularization strength. (It is common to see the factor of $\frac{1}{2
}$ in front because then the gradient of this term with respect to the parameter $w$ is simply $λw$ instead of $2λw$.) 

The L2 regularization has the intuitive interpretation of heavily penalizing peaky weight vectors and preferring diffuse weight vectors. Due to multiplicative interactions between weights and inputs this has the appealing property of encouraging the network to use all of its inputs a little rather than some of its inputs a lot. Lastly, notice that during gradient descent parameter update, using the L2 regularization ultimately means that every weight is decayed linearly: `W += -lambda * W` towards zero. 

In comparison, final weight vectors from L2 regularization are usually diffuse, small numbers. In practice, if you are not concerned with explicit feature selection, L2 regularization can be expected to give superior performance over L1. 

It is possible to combine the L1 regularization with the L2 regularization: $$λ_1 \| w \|_1 + λ_2 \| w \|_2^2$$ (this is called [Elastic net regularization](http://web.stanford.edu/~hastie/Papers/B67.2 (2005) 301-320 Zou & Hastie.pdf)). 

### Max Norm Constraints

Another form of regularization is to enforce an absolute upper bound on the magnitude of the weight vector for every neuron and use projected gradient descent to enforce the constraint. In practice, this corresponds to performing the parameter update as normal, and then enforcing the constraint by clamping the weight vector $w$ of every neuron to satisfy $$\|w\|_2<c$$. Typical values of $c$ are on orders of 3 or 4. Some people report improvements when using this form of regularization. One of its appealing properties is that network cannot "explode" even when the learning rates are set too high because the updates are always bounded.  

### Dropout

Dropout is an extremely effective, simple and recently introduced regularization technique by Srivastava et al. in [Dropout: A Simple Way to Prevent Neural Networks from Overfitting](http://www.cs.toronto.edu/~rsalakhu/papers/srivastava14a.pdf) that complements the other methods (L1, L2, maxnorm). While training, dropout is implemented by only keeping a neuron active with some probability $$p$$ (a hyperparameter), or setting it to zero otherwise. 

<div style="text-align: center"> <img src="/pictures/dropout.jpeg" alt="Dropout" style="zoom:50%;" /> </div>

---

**References**:

Goodfellow, Ian, Yoshua Bengio, and Aaron Courville. Deep learning. MIT press, 2016.

Glorot, Xavier, and Yoshua Bengio. "Understanding the difficulty of training deep feedforward neural networks." *Proceedings of the thirteenth international conference on artificial intelligence and statistics*. 2010. 

He, Kaiming, et al. "Delving deep into rectifiers: Surpassing human-level performance on imagenet classification." *Proceedings of the IEEE international conference on computer vision*. 2015.

Katanforoosh & Kunin, "[Initializing neural networks](https://www.deeplearning.ai/ai-notes/initialization/)", deeplearning.ai, 2019.

[CS231n Convolutional Neural Networks for Visual Recognition](http://cs231n.github.io/).