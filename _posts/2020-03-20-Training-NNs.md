---
layout: post
title:  "Training Neural Networks"
date: 2020-03-20
categories: DL
comments: true
---

## Optimization

The goal of the training procedure is to learn parameters $W^{[l]}$ and $b^{[l]}$ for each layer $l$ that minimize the loss function plus regularization term.

### Loss Function 

For regression problem, **L2 loss** is most commonly used:

$$
L(\hat{y}_i, y_i) = (y_i - \hat{y}_i)^2, \text{ or } L(\hat{y}, y) = \| \hat{y} - y \|_2^2.
$$

For $K$-class classification problem, we usually use **cross-entropy loss** function:
$$
L(\hat{p}_i, y_i) = -\sum_{k=1}^{K} \mathbf{1}(y_i \text{ in class } k)\log(\hat{p}_{ik}),
$$

where $$\hat{p}_{ik}$$ is the estimated probability of $y_i$ belongs to class $k$. The estimated probabilities $\hat{p}_{ik}$ by softmax function is $$\frac{e^{z_{ik}}}{\sum _{k=1}^{K}e^{z_{ik}}}$$. 

For binary classification, the cross-entropy is

$$
L(\hat{p}_i, y_i) = -y_i\log(\hat{p}_i) - (1-y_i)\log(1-\hat{p}_i),
$$

where $y_i\in\{0,1\}$, $\hat{p}_i$ is the estimated probability of $y_i=1$. 

### Initialization

If the weights in a network start too small/large, then the signal shrinks/grows as it passes through each layer until it is too tiny/massive to be useful, because it may lead to vanishing or exploding gradients. 

The appropriate initialization should have the following rules of thumb: 

1. The mean of the activations should be zero;
2. The variance of the activations should stay the same across every layer.

**Xavier** initialization: For every layer $l$: 

$$
W^{[l]} \sim N(0,1/n^{[l-1]}),\ b^{[l]}=0.
$$

### Backpropagation

We use GD or SGD to optimize the objective function $\text{Obj}(w)$. For weight, we have $w_t=w_{t-1} - \eta \frac{\partial\ \text{Obj}(w_{t-1})}{\partial\ w_{t-1}}$, where $\eta$ is the step-size (learning rate).

The solution to computing the gradient is an algorithm called error **backpropagation**, which use the chain rules in calculus. (Note: the regularization term is not considered in the pictures below.) 

<div style="text-align: center"> <img src="/pictures/backpropagation.png" alt="backpropagation" style="zoom: 40%;" /> </div> 

Now let's take an example. Say there is a feed forward neural network for regression, as shown in the picture below. 

<div style="text-align: center"> <img src="/pictures/neural_network_example_2.png" alt="Grid Search and Random Search" style="zoom:40%;" /> </div>

Suppose the activation function $$\sigma(\cdot)$$ for hidden layer is sigmoid, and there is no activation function for output layer. Denote the input vector as $$x\in\mathbb{R}^{p}$$, the target as $$y\in\mathbb{R}$$, the output scalar as $$\hat{y}\in\mathbb{R}$$, the weights of hidden layer as $W\in\mathbb{R}^{p \times q}$, the weights of output layer as $$V\in\mathbb{R}^{q}$$, the loss function as $$L(\hat{y},y)=(\hat{y}-y)^2$$. This network can be expressed mathematically as

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

Goodfellow, Ian, Yoshua Bengio, and Aaron Courville. [*Deep learning*](http://www.deeplearningbook.org/). MIT press, 2016.

[CS231n Convolutional Neural Networks for Visual Recognition](http://cs231n.github.io/).