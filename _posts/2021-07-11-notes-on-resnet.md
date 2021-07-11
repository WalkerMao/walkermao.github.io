---
layout: post
title: "Notes on ResNet"
date: 2021-07-11
categories: DL
comments: true
published: true
hidden: false

---

## Notes on "Deep residual learning for image recognition"

The following sections are mainly experted from Professor He's famous paper "Deep residual learning for image recognition"[^1].

### Introduction

With Batch Normalization that largely addressed the notorious problem of vanishing/exploding gradients, the deeper networks are able to start converging. However, a degradation problem has been exposed: **with the network depth increasing, accuracy gets saturated and then degrades rapidly**. Unexpectedly, such degradation is not caused by overfitting, and adding more layers to a suitably deep model leads to higher training error. 

<div align='center'>
<figure>
<img src="https://d3i71xaburhd42.cloudfront.net/2c03df8b48bf3fa39054345bafabfeff15bfd11d/1-Figure1-1.png" alt="Figure 1" style="zoom:100%;" />
<figcaption style="font-size:80%;"> Figure 1. Training error (left) and test error (right) on CIFAR-10 with 20-layer and 56-layer plain networks. The deeper network has higher training error, and thus test error. Similar phenomena on ImageNet is presented in Fig. 4. (<a href="https://www.semanticscholar.org/paper/Deep-Residual-Learning-for-Image-Recognition-He-Zhang/2c03df8b48bf3fa39054345bafabfeff15bfd11d">Source</a>) </figcaption>
</figure>
</div>

The degradation (of training accuracy) indicates that not all systems are similarly easy to optimize. We can consider a deep network as a shallower architecture and its deeper counterpart that adds more layers onto it. If the added layers are just identity mapping, then the deep network should outputs the same result as the shallower one. That means the deep network should works at least not worse than its shallower counterpart. But experiments show that our current solvers on hand are tended to let the deeper counterpart turn result worse than its previous shallower counterpart. Here are two possible causes:

- If identity mappings are optimal, the solvers might have difficulties in approximating identity mappings by multiple nonlinear layers.
- For plain networks, a empirical evidence show that the correlation of layer gradients decreases with the order $$\frac{1}{2^L}$$, where $$L$$ is the number of layers. Decreasing correlation means more white noise gradient feedbacks. (The empirical decreasing order in ResNet is $$\frac{1}{\sqrt{L}}$$) [^2]
- The irreversible information loss caused by ReLU. [^3]

In the paper, the authors address the degradation problem by introducing a deep residual learning framework. Instead of hoping each few stacked layers directly fit a
desired underlying mapping, the authors explicitly let these layers fit a residual mapping. Formally, denoting the desired underlying mapping as $ \mathcal{H}(\mathbf{x}) $, we let the stacked nonlinear layers fit another mapping of $ \mathcal{F}(\mathbf{x}):=\mathcal{H}(\mathbf{x})-\mathbf{x} . $ The original mapping is recast into $ \mathcal{F}(\mathbf{x})+\mathbf{x} $. We hypothesize that **it is easier to optimize the residual mapping than to optimizet he original, unreferenced mapping**. To the extreme, if an identity mapping were optimal, **it would be easier to fit the residual of zero than to fit an identity mapping by a stack of nonlinear layers**. 

<div align='center'>
<figure>
<img src="https://d3i71xaburhd42.cloudfront.net/2c03df8b48bf3fa39054345bafabfeff15bfd11d/2-Figure2-1.png" alt="Figure 2. Residual learning: a building block." style="zoom:100%;" />
<figcaption style="font-size:80%;"> Figure 2. Residual learning: a building block. (<a href="https://www.semanticscholar.org/paper/Deep-Residual-Learning-for-Image-Recognition-He-Zhang/2c03df8b48bf3fa39054345bafabfeff15bfd11d">Source</a>) </figcaption>
</figure>
</div>
The formulation of $$ \mathcal{F}(\mathbf{x})+\mathbf{x} $$ can be realized by feedforward neural networks with "shortcut connections" (Fig. 2). Shortcut connections are those skipping one or more layers. In our case, the shortcut connections simply perform identity mapping, and their outputs are added to the outputs of the stacked layers (Fig. 2). Identity shortcut connections add neither extra parameter nor computational complexity. The entire network can still be trained end-to-end by SGD with backpropagation, and can be easily implemented using common libraries (e.g., Caffe) without modifying the solvers.

### Deep Residual Learning

#### Residual Learning

#### Identity Mapping by Shortcuts

The authors adopt residual learning to every few stacked layers. A building block is shown in Fig. 2. Formally, a building block defined as:

$$
\mathbf{y}=\mathcal{F}\left(\mathbf{x},\left\{W_{i}\right\}\right)+\mathbf{x}. \tag{1}
$$

Here $ \mathrm{x} $ and $ \mathrm{y} $ are the input and output vectors of the layers considered. The function $ \mathcal{F}\left(\mathbf{x},\left\{W_{i}\right\}\right) $ represents the residual mapping to be learned. For the example in Fig. 2 that has two layers, $ \mathcal{F}=W_{2} \sigma\left(W_{1} \mathbf{x}\right) $ in which $ \sigma $ denotes ReLU and the biases are omitted for simplifying notations. We adopt the second nonlinearity after the addition (i.e., $ \sigma(\mathbf{y}) $, see Fig. 2).

The dimensions of $ \mathbf{x} $ and $ \mathcal{F} $ must be equal in Eqn.(1). If this is not the case $ (e . g . $, when changing the input/output channels), we can perform a linear projection $ W_{s} $ by the shortcut connections to match the dimensions:
$$
\mathbf{y}=\mathcal{F}\left(\mathbf{x},\left\{W_{i}\right\}\right)+W_{s} \mathbf{x}. \tag{2}
$$
We can also use a square matrix $ W_{s} $ in Eqn.(2). But the authors showed by experiments that the identity mapping is sufficient for addressing the degradation problem and is economical, and thus $ W_{s} $ is only used when matching dimensions. 

The form of the residual function $ \mathcal{F} $ is flexible. Experiments in the paper involve a function $ \mathcal{F} $ that has two or three layers (Fig. 5), while more layers are possible. But if $ \mathcal{F} $ has only a single layer, Eqn.(1) is similar to a linear layer: $ \mathbf{y}=W_{1} \mathbf{x}+\mathbf{x} $. 

Also note that although the above notations are about fully-connected layers for simplicity, they are applicable to convolutional layers. The function $ \mathcal{F}\left(\mathbf{x},\left\{W_{i}\right\}\right) $ can represent multiple convolutional layers. The element-wise addition is performed on two feature maps, channel by channel.

#### Network Architectures

In a CNN, the identity shortcuts (Eqn.(1)) can be directly used when the input and output are of the same dimensions. However, through the forward pass in a CNN, convolutional layers are usually deeper for depth and smaller for width and height. 

As for increasing the depth of $ \mathbf{x} $ to match the depth of $ \mathcal{F} $, we consider three options: (A) The shortcut still performs identity mapping, with extra zero entries padded for increasing depth. This option introduces no extra parameter; (B) The projection shortcut (done by 1×1 convolutions) in Eqn.(2) is used to increase dimensions, and other shortcuts are identity; (C) all shortcuts are projections. 

Experiments showed that (B) is slightly better than (A). The authors argue that this is because the zero-padded dimensions in (A) indeed have no residual learning. (C) is marginally better than (B), and the authors attribute this to the extra parameters introduced by many projection shortcuts. But the small differences among (A)/(B)/(C) indicate that projection shortcuts are not essential for addressing the degradation problem. The authors dropped option (C) in further experiments to reduce memory/time complexity and model sizes. Identity shortcuts are particularly important for not increasing the complexity of the bottleneck architectures.

Then, as for decreasing the width and height of $ \mathbf{x} $ to match that of $ \mathcal{F} $, we apply 1×1 convolutions with stride larger than 1 on each feature map in $ \mathbf{x} $.

<br>

**References:**

[^1]: He, Kaiming, et al. "Deep residual learning for image recognition." *Proceedings of the IEEE conference on computer vision and pattern recognition*. 2016.

[^2]: Balduzzi, David, et al. "The shattered gradients problem: If resnets are the answer, then what is the question?." *International Conference on Machine Learning*. PMLR, 2017.

[^3]: Sandler, Mark, et al. "Mobilenetv2: Inverted residuals and linear bottlenecks." *Proceedings of the IEEE conference on computer vision and pattern recognition*. 2018.

