---
layout: post
title:  "Notes on Batch Normalization"
date: 2020-12-28
categories: DL
comments: true

---

This post is the notes on the paper ["Batch normalization: Accelerating deep network training by reducing internal covariate shift"](https://arxiv.org/abs/1502.03167).

## Introduction

For training a neural network, gradient descent (GD) optimizes the parameters $$ \Theta $$ of the network, so as to minimize the loss

$$
\Theta=\arg \min _{\Theta} \frac{1}{N} \sum_{i=1}^{N} \ell\left(\mathrm{x}_{i}, \Theta\right),
$$

where $$ x_{1 \ldots N} $$ is the training data set. With mini-batch gradient descent, the training proceeds in steps, and at each step we consider a mini-batch $$ \mathrm{x}_{1 \ldots m} $$ of size $$ m . $$ The mini-batch is used to approximate the gradient of the loss function with respect to the parameters, by computing

$$
\frac{1}{m} \sum_{i=1}^{m} \frac{\partial \ell\left(\mathrm{x}_{i}, \Theta\right)}{\partial \Theta}.
$$

Using mini-batches of examples, as opposed to one example at a time, is helpful in several ways. First, the gradient of the loss over a mini-batch is an estimate of the gradient over the training set, whose quality improves as the batch size increases. Second, computation over a batch can be much more efficient than $$m$$ computations for individual examples, due to the parallelism afforded by the modern computing platforms.

While the one example SGD and the mini-batch GD is simple and effective,  they  requires careful tuning of the learning rate used in optimization, as well as the initial values for the model parameters. The training is complicated by the fact that the inputs to each layer are affected by the parameters of all preceding layers so that small changes to the network parameters amplify as the network becomes deeper.

The change in the distribution of a layer's inputs presents a problem because the layer need to continuously adapt to the new distribution. We refer to the change in the distributions of internal layer inputs (activations) of a deep network, in the course of training, as **internal covariate shift**. Eliminating it offers a promise of faster training. 

**Batch normalization**:

- reduces internal covariate shift via a normalization step that fixes the means and variances of layer inputs. 
- has a beneficial effect on the gradient flow through the network, by reducing the dependence of gradients on the scale of the parameters or of their initial values. This allows us to use much higher learning rates without the risk of divergence. 
- regularizes the model and reduces the need for dropout. 
- makes it possible to use saturating nonlinearities by preventing the network from getting stuck in the saturated modes.

## Towards Reducing Internal Covariate Shift

We define **internal covariate shift** as the change in the distribution of network activations due to the change in network parameters (weights and biases) during training. 

It has been long known that the network training converges faster if its inputs are whitened i.e., linearly transformed to have **zero means** and **unit variances**, and **decorrelated**. By whitening the inputs to each layer, we would achieve the fixed distributions of inputs that would reduce the internal covariate shift.

If the whitening normalization are interspersed with the optimization steps, then the gradient descent step may attempt to update the parameters in a way that requires the normalization to be updated. If the normalization is not updated during the gradient descent step, then the effect of the gradient step will be reduced by the normalization. 

## Normalization via Mini-Batch Statistics

### Batch Normalizing Transform

Since the full whitening of each layer's inputs is costly and not everywhere differentiable, we make two necessary simplifications. 

The first is that instead of whitening the features in layer inputs and outputs jointly, we will normalize each scalar feature independently, by making it have the mean of $$0$$ and the variance of $$ 1 . $$ For a layer with $$ d $$-dimensional input $$ \mathrm{x}=\left(x^{(1)} \ldots x^{(d)}\right) $$, we will normalize each dimension

$$
\widehat{x}^{(k)}=\frac{x^{(k)}-\mathrm{E}\left[x^{(k)}\right]}{\sqrt{\operatorname{Var}\left[x^{(k)}\right]}},
$$

where the expectation and variance are computed by the training data set. 

The second simplification is that, since we use mini-batch GD, we produce the estimates of the mean and variance of each activation by each mini-batch, rather than that by entire training set.

Note that simply normalizing each input of a layer may change what the layer can represent. For instance, normalizing the inputs of a sigmoid would constrain them to the linear regime of the nonlinearity. To address this, we introduce, for each activation $$ x^{(k)} $$, a pair of parameters $$ \gamma^{(k)}, \beta^{(k)}, $$ which scale and shift the normalized value to get the linear transformation $$\widetilde{x}^{(k)}$$ (denoted as $$y^{(k)}$$ in the original paper):

$$
\widetilde{x}^{(k)} = \gamma^{(k)} \widehat{x}^{(k)}+\beta^{(k)}.
$$

These parameters are learned along with the original model parameters, and restore the representation power of the network. Indeed, by setting $$ \gamma^{(k)}=\sqrt{\operatorname{Var}\left[x^{(k)}\right]} $$ and $$ \beta^{(k)}=\mathrm{E}\left[x^{(k)}\right] $$, we could recover the original activations.

Now let us introduce the first algorithm: batch normalizing transform. Consider a mini-batch $$ \mathcal{B} $$ of size $$ m $$. since the normalization is applied to each activation independently, let us focus on a particular activation $$ x^{(k)} $$ and omit the superscript $$ (k) $$ for clarity. We have $$ m $$ values of this activation in the mini-batch,

$$
\mathcal{B}=\left\{x_{1 \ldots m}\right\}.
$$

Let the normalized values be $$ \widehat{x}_{1 \ldots m} $$, and their linear transformations be $$ \widetilde{x}_{1 \ldots m} $$. We refer to the transform

$$
\mathrm{BN}_{\gamma, \beta}: x_{1 \ldots m} \rightarrow \widetilde{x}_{1 \ldots m},
$$

as the **batch normalizing transform**. As presented in the algorithm below. In the below algorithm, $$ \epsilon $$ is a constant added to the mini-batch variance for numerical stability. 

Below is the algorithm of batch normalizing transform. As mentioned before, we omit the superscript $$ (k) $$ for clarity.

**Algorithm. Batch Normalizing Transform.** Applied to activation $$x$$ over a mini-batch.

[1] Input: Values of $$ x $$ over a mini-batch: $$ \mathcal{B}=\left\{x_{1 \ldots m}\right\} $$; Parameters to be learned: $$ \gamma, \beta $$. 

[2] $$ \mu_{\mathcal{B}} \leftarrow \frac{1}{m} \sum_{i=1}^{m} x_{i} $$, $$ \sigma_{\mathcal{B}}^{2} \leftarrow \frac{1}{m} \sum_{i=1}^{m}\left(x_{i}-\mu_{\mathcal{B}}\right)^{2} $$ // mini-batch mean and variance

[3] for $$i=1,\cdots,m$$, do:

&emsp; $$ \widehat{x}_{i} \leftarrow \frac{x_{i}-\mu_{\mathcal{B}}}{\sqrt{\sigma_{\mathcal{B}}^{2}+\epsilon}} $$ // normalize

&emsp; $$ \widetilde{x}_{i} \leftarrow \gamma \widehat{x}_{i}+\beta \equiv \mathrm{B} \mathrm{N}_{\gamma, \beta}\left(x_{i}\right) $$ // scale and shift

[4] Output: $$ \left\{\widetilde{x}_{i}=\mathrm{B} \mathrm{N}_{\gamma, \beta}\left(x_{i}\right)\right\} $$.

### Training Batch-Normalized Networks

During training we need to backpropagate the gradient of loss $$ \ell $$ through this transformation. For clarity, $$ x \equiv x^{(k)}, \gamma \equiv \gamma^{(k)}, \beta \equiv \beta^{(k)}, \mu_{\mathcal{B}} \equiv \mu_{\mathcal{B}}^{(k)}, \sigma_{\mathcal{B}} \equiv \sigma_{\mathcal{B}}^{(k)} $$ etc.. The gradients:

$$
\begin{aligned} 
\frac{\partial \ell}{\partial \widehat{x}_{i}} &=\frac{\partial \ell}{\partial \widetilde{x}_{i}} \cdot \gamma, \\ \frac{\partial \ell}{\partial \sigma_{\mathcal{B}}^{2}} &=\sum_{i=1}^{m} \frac{\partial \ell}{\partial \widehat{x}_{i}} \cdot\left(x_{i}-\mu_{\mathcal{B}}\right) \cdot \frac{-1}{2}\left(\sigma_{\mathcal{B}}^{2}+\epsilon\right)^{-3 / 2}, \\ \frac{\partial \ell}{\partial \mu_{\mathcal{B}}} &=\left(\sum_{i=1}^{m} \frac{\partial \ell}{\partial \widehat{x}_{i}} \cdot \frac{-1}{\sqrt{\sigma_{\mathcal{B}}^{2}+\epsilon}}\right)+\frac{\partial \ell}{\partial \sigma_{\mathcal{B}}^{2}} \cdot \frac{\sum_{i=1}^{m}-2\left(x_{i}-\mu_{\mathcal{B}}\right)}{m}, \\ \frac{\partial \ell}{\partial x_{i}} &=\frac{\partial \ell}{\partial \widehat{x}_{i}} \cdot \frac{1}{\sqrt{\sigma_{\mathcal{B}}^{2}+\epsilon}}+\frac{\partial \ell}{\partial \sigma_{\mathcal{B}}^{2}} \cdot \frac{2\left(x_{i}-\mu_{\mathcal{B}}\right)}{m}+\frac{\partial \ell}{\partial \mu_{\mathcal{B}}} \cdot \frac{1}{m}, \\ \frac{\partial \ell}{\partial \gamma} &=\sum_{i=1}^{m} \frac{\partial \ell}{\partial \widetilde{x}_{i}} \cdot \widehat{x}_{i}, \\ \frac{\partial \ell}{\partial \beta} &=\sum_{i=1}^{m} \frac{\partial \ell}{\partial \widetilde{x}_{i}}.
\end{aligned}
$$

For a batch-normalized network, any layer that previously received $$x$$ as the input, now receives $$\text{BN}(x)$$.

Once the network has been trained, we use the normalization

$$
\widehat{x}=\frac{x-\mathrm{E}[x]}{\sqrt{\operatorname{Var}[x]+\epsilon}}
$$

using the expectation and variance calculated by entire training set, rather than mini-batch. Say we have $$M$$ mini-batches $$\mathcal{B}_{1 \ldots M}$$, each of size $$m$$, we process these mini-batches, and average over them:

$$
\begin{aligned}
\mathrm{E}[x] & \leftarrow \mathrm{E}_{\mathcal{B}}\left[\mu_{\mathcal{B}}\right] 
= \frac{1}{M} \sum_{l=1}^{M} \mu_{\mathcal{B_l}}, \\
\operatorname{Var}[x] & \leftarrow 
\frac{m}{m-1} \mathrm{E}_{\mathcal{B}} \left[\sigma_{\mathcal{B}}^{2}\right] 
= \frac{m}{m-1} \frac{1}{M} \sum_{l=1}^{M} \sigma_{\mathcal{B_l}}. 
\end{aligned}
$$

## Others

### Batch Normalization Enables Higher Learning Rates

In traditional deep networks, too-high learning rate may result in the gradients that explode or vanish, as well as getting stuck in poor local minima because there is too much "energy" in the optimization and the parameters are bouncing around chaotically, unable to settle in a nice spot in the optimization landscape.

Batch normalization helps address these issues. By normalizing activations throughout the network, it prevents small changes to the parameters from amplifying into larger and suboptimal changes in activations in gradients; for instance, it prevents the training from getting stuck in the saturated regimes of nonlinearities.

Batch normalization also makes training more resilient to the parameter scale. Normally, large learning rates may increase the scale of layer parameters, which then amplify the gradient during backpropagation and lead to the model explosion. However, with Batch normalization, backpropagation through a layer is unaffected by the scale of its parameters. Indeed, for a scalar $$a$$, 

$$
\mathrm{BN}(W \mathrm{u})=\mathrm{BN}((a W) \mathrm{u}),
$$

and we can show that

$$
\begin{aligned}
&\frac{\partial \mathrm{BN}((a W) \mathrm{u})}{\partial \mathrm{u}}=\frac{\partial \mathrm{BN}(W \mathrm{u})}{\partial \mathrm{u}}, \\
&\frac{\partial \mathrm{BN}((a W) \mathrm{u})}{\partial(a W)}=\frac{1}{a} \cdot \frac{\partial \mathrm{BN}(W \mathrm{u})}{\partial W}.
\end{aligned}
$$

The scale does not affect the layer Jacobian nor, consequently, the gradient propagation. 

### Batch Normalization Regularizes the Model 

When training with Batch Normalization, a training example is seen in conjunction with other examples in the mini-batch, and the training network no longer producing deterministic values for a given training example. In our experiments, we found this effect to be advantageous to the generalization of the network. Whereas dropout is typically used to reduce overfitting, in a batch-normalized network we found that it can be either removed or reduced in strength.

<br>

**Reference:**

Ioffe, Sergey, and Christian Szegedy. ["Batch normalization: Accelerating deep network training by reducing internal covariate shift."]((https://arxiv.org/abs/1502.03167)) *arXiv preprint arXiv:1502.03167* (2015).