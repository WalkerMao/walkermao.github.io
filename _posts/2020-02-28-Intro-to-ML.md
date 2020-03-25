---
layout: post
title:  "Intro to Statistical Learning"
date: 2020-02-28
categories: ML
comments: true
---

## 1. Basic Assumption

We assume that there is some relationship between $Y$ and $X$ which can be written as $Y = f(X) + \epsilon$. Here $f$ is some fixed but unknown function and $\epsilon$ is a random error term, which is independent of $X$ and has mean zero. 

## 2. Why Estimate $f$ ?

There are two main reasons: prediction and inference.

### 2.1 Prediction

The prediction $\hat{Y} = \hat{f}(X).$ The goal of prediction is to learn a function $f$ such that $f(X)$ is closed to $Y$.

The accuracy of $\hat{Y}$ as a prediction for $Y$ depends on two quantities, which we will call the reducible error (introduced by $$X$$) and the irreducible error (introduced by $\epsilon$). $Y$ is a function of $X$ and $\epsilon$. Consider the expectation of the squared loss:

$$
E(Y-\hat{Y})^2 = E[f(X)+\epsilon-\hat{f}(X)]^2 = E[f(X)-\hat{f}(X)]^2 + \text{Var} (\epsilon).
$$

The first item (expectation) is reducible and the second (variance) is irreducible.                     

### 2.2 Inference

For inference, we want to understand the relationship between $X$ and $Y$, or more specifically, to understand how $Y$ changes as a function of $X_1 , . . . , X_p$. Now $\hat{f}$ cannot be treated as a black box, because we need to know its exact form. 

## 3. How Do We Estimate $f$ ?

### 3.1 Parametric Methods

Parametric methods involve a two-step model-based approach.

1. Select model. We make an assumption about the functional form, or shape of $f$. For example, linear model. 

2. Fit or train the model. 

Advantages compared to non-parametric methods: need less observations, harder to over-fit, more interpretable, easier to do inference.

### 3.2 Non-parametric Methods

Non-parametric methods do not make explicit assumptions about the functional form of $f$. Instead they seek an estimate of $f$ that gets as close to the data points as possible without being too rough or wiggly. 

Advantage compared to parametric methods: flexible. By avoiding the assumption of a particular functional form for $f$, they have the potential to accurately fit a wider range of possible shapes for $f$ compared to parametric method. 

## 4. Evaluating Model Accuracy 

### 4.1 For Regression

Mean absolute error (MAE): $$ \frac{1}{n} \Vert Y - \hat{Y} \Vert_1 = \frac{1}{n} \sum_{i=1}^{n} \vert y_i - \hat{y}_i \vert $$.

Mean squared error (MSE): $$ \frac{1}{n} \| Y - \hat{Y} \| _2^2 = \frac{1}{n} \sum_{i=1}^{n} (y_i - \hat{y}_i)^2 $$.

Root MSE: $$ \sqrt{\frac{1}{n} \| Y - \hat{Y} \| _2^2 }= \sqrt{\frac{1}{n} \sum_{i=1}^{n} (y_i - \hat{y}_i)^2} $$.

MSE is the most commonly used metric. MAE is more robust and less sensitive to outliers or influential points. However, MAE is not differentiable at the point $y_i-\hat{y}_i = 0$, which is not amenable to numerical optimization. 

### 4.2 For Classification

For $K$ classification problem,

Misclassification error:  $$ \text{Loss}(y_i,\hat{y}_i) = \frac{1}{2} \sum_{k=1}^{K} I(y_{ik} \neq  \hat{y}_{ik} ) $$.

Cross entropy loss: $$ \text{Loss}(y_i,\hat{p}_i) = \sum_{k=1}^K -y_{ik} \log \hat{p}_{ik} $$.

In the formula above, $y_i$, $\hat{y}_ {i}$ or $\hat{p}_ i$ is a vector with dimension $K \times 1$; $y_{ik}$, $\hat{y}_ {ik}$ or $$\hat{p}_{ik}$$ is the $k$-th element in the vector $y_i$, $$\hat{y}_i$$ or $$\hat{p}_i$$; $y_{ik}=1$ if the $i$-th observation is of class $k$, and $y_{ik}=0$ otherwise; $$\hat{y}_{ik}=1$$ if the $i$-th observation is classified to be the class $k$ by the model, and $$\hat{y}_{ik}=0$$ otherwise; $$\hat{p}_{ik}$$ is the estimated probability of the $i$-th observation is of class $k$. 

Cross entropy loss for binary classification problem: $ \frac{1}{n} \sum_{i=1}^n \big[ -y_i \log \hat{p}_i - (1-y_i) \log(1-\hat{p}_i) \big]$. 

Cross-entropy is differentiable, and hence more amenable to numerical optimization. 

**ROC & AUC**: If we have the estimated probabilities $$\hat{p}_1, \cdots ,\hat{p}_n$$, then $$\hat{y}_i = \text{sign}(\hat{p}_i > \text{threshold})$$. We can change the threshold from $$1$$ to $$0$$ and plot the TPR (true positive rate) v.s. FPR (false positive rate). The plot is known as ROC (receiver operating characteristic) curve. When the threshold is $$1$$, $$\text{TPR} = \text{FPR} = 0$$. When the threshold is $$0$$, $$\text{TPR} = \text{FPR} = 1$$.  The AUC (area under curve) is the area under the ROC curve. The larger of the AUC, the better of the classification model. 

![Confusion matrix](https://miro.medium.com/max/600/0*UdqpQ0-AHVlN-hF4.gif) <img src="https://miro.medium.com/max/865/0*ysufmKF9prSFhgve.png" alt="ROC" style="zoom: 50%;" />

## 5. Regularization

### 5.1 Overfitting

If a model learned too much noise in the training data, it tends to be overfitting, and the training error is much lower than the test error. Overfitting often happens for flexible models. An overfitted model has low bias but high variance. Regularization discourages learning a more complex or flexible model, so as to reduce overfitting. 

<img src="https://github.com/WalkerMao/Notes/blob/master/Pictures/overfitting.png?raw=true" style="width:70%;height:70%;" alt="Overfitting">

### 5.2 L1 and L2 Norm

L1-norm regularization: $\text{Loss} + \lambda \Vert w \Vert_1$.

L2-norm regularization: $\text{Loss} + \lambda \Vert w \Vert _2^2$.

The hyperparameter $\lambda$ depends the regularization strength. Note: a hyperparameter is a parameter whose value is set before the learning process begins. By contrast, the values of other parameters are derived via training. 

Linear regression with L1-norm is LASSO and L2-norm is ridge regression.

![LASSO and Ridge](https://qph.fs.quoracdn.net/main-qimg-2a88e2acc009fa4de3edeb51e683ca02)

L1-norm shrinks some coefficients to $0$ and produces sparse coefficients, so it can be used to do feature selection. The sparsity makes the model more robust and also more computationally efficient when doing prediction. 

L2-norm encouraging the model to use all of its inputs a little rather than some of its inputs a lot. It is differentiable so it has an analytical solution and can be calculated efficiently when training model. Notice that during gradient descent parameters update, using the L2-norm regularization ultimately means that the parameter is decayed linearly: `W -= lambda * W` towards zero. 

## 6. Trade-off 

### 6.1 Flexibility-Interpretability Trade-off

The flexible models are usually more accurate and less interpretable. For example, linear regression is interpretable but not flexible, and neural network is the opposite. 

[high Interpretability, low Flexibility] Subset Selection (e.g. LASSO), Least Squares, Generalized Additive Models (GAM) (e.g. Trees), Bagging or Boosting, SVM. [low Interpretability, high Flexibility] 

Note: SVM with non-linear kernels is non-linear methods.

### 6.2 Bias-Variance Trade-off

For regression, assume $Y = f+\epsilon,E(\epsilon) = 0$, and $\epsilon$ is independent with $f$ and $\hat{f}$, then we have 

$$\begin{align*}
E[(Y-\hat{f})^2] &= E[(f-\hat{f}+\epsilon)^2] \\
&= E[(f-\hat{f})^2] + E(\epsilon^2) + 2E(f-\hat{f})E(\epsilon) \\ 
&= E(\hat{f}^2) + f^2 - 2fE(\hat{f}) + \text{Var}(\epsilon) + 0\\ 
&= \big[ E(\hat{f}^2) - E^2(\hat{f}) \big] + \big[ E^2(\hat{f}) + f^2 - 2fE(\hat{f}) \big] + \text{Var}(\epsilon) \\
&= \text{Var}(\hat{f}) + [E(\hat{f})-f]^2 + \text{Var}(\epsilon) \\
&= \text{Var}(\hat{f}) + \text{Bias}^2(\hat{f}) + \text{Var}(\epsilon).
\end{align*}$$

**More flexible methods leads to higher variance and lower bias.**

Variance $\text{Var}(\hat{f})$ refers to the amount by which $ \hat{f} $ would change if it is by a different training data set. In general, more flexible statistical methods have higher variance.

Bias $\text{Bias}(\hat{f})$ refers to the error that is introduced by approximating a real-life problem. For example, linear regression assumes that there is a linear relationship between $Y$ and $X$. It is unlikely that any real-life problem truly has such a simple linear relationship, and so performing linear regression will undoubtedly result in some bias in the estimate of $f$. Generally, more flexible methods result in less bias.

Note: It is possible to have a model that has lower variance and lower bias simultaneously. For example, boosting method can reduce both variance and bias. 

## 7. Optimization

The objective function

$$
\text{Obj}(Y, X, \theta) = \frac{1}{n} \sum_{i=1}^n L \big( y_i, f(x_i; \theta) \big) + \Omega \big( f(\cdot;\theta) \big),
$$

where $\theta$ is a vector of dimension $p_\theta \times 1$ that contains the parameters of predictive model $f(\cdot)$, $L(\cdot)$ is the loss function, and $\Omega(\cdot)$ is the regularization term. 

Our objective is to minimize the objective function with respect to $\theta$: $\theta^* = \underset{\theta}{\text{argmin }} \text{Obj}(Y,X,\theta)$.

In the following two sections, I interpret the gradient descent and Newton's method as iteratively minimizing the local Taylor approximation to the objective function.

### 7.1 Gradient Descent

We perform $\theta^{(t)} = \theta^{(t-1)} + \Delta\theta^{(t)}$ iteratively until the objective function converges. Denote $\Delta \theta = \alpha \mathbf{u}$, where $\alpha$ is a non-negative scalar (length of $\Delta\theta$) and $\mathbf{u}$ is a unit vector (direction of $\Delta\theta$).  

By the Taylor polynomial of degree one, 

$$
\text{Obj}(\theta + \alpha\mathbf{u}) \approx \text{Obj}(\theta) + \alpha \mathbf{u}^T \text{Obj}'(\theta) = \text{Obj}(\theta) + \alpha \| \text{Obj}'(\theta) \| \text{cos}(\gamma),
$$

where $\gamma$ is the angle between $\mathbf{u}$ and $\text{Obj}'(\theta)$. 

We want to find the unit vector $\mathbf{u}$ that minimize $\text{Obj}(\theta + \alpha\mathbf{u})$. Obviously, the minimizer $\mathbf{u}$ should have the opposite direction of $\text{Obj}'(\theta)$ that make $\text{cos}(\gamma)=-1$, then we have $$\mathbf{u} = \frac{-\text{Obj}'(\theta)}{\| \text{Obj}'(\theta) \|}$$.

Thus, we have

$$
\theta^{(t)} = \theta^{(t-1)} - \frac{\alpha^{(t-1)}}{\| \text{Obj}'(\theta^{(t-1)}) \|} \text{Obj}'(\theta^{(t-1)}) = \theta^{(t-1)} - \eta^{(t)}\text{Obj}'(\theta^{(t-1)}),
$$

where $$\eta^{(t)} = \frac{\alpha^{(t-1)}}{\| \text{Obj}'(\theta^{(t-1)}) \|}$$ is called the step size or learning rate. 

### 7.2 Newton's Method

We use the Taylor polynomial of degree two to decompose the objective function, 

$$
\text{Obj}(\theta + \Delta\theta) \approx \text{Obj}(\theta) + {\Delta\theta}^T \text{Obj}'(\theta) + \frac{1}{2} {\Delta\theta}^T \text{Obj}''(\theta) \Delta\theta.
$$

$\text{Obj}''(\theta)$ is the **Hessian** matrix that contains all second order partial derivatives:

$$
\mathbf{H} = \text{Obj}''(\theta) = 
\begin{pmatrix}
  \frac{\partial^2 \text{Obj}(\theta)}{\partial \theta_1^2} & \frac{\partial^2 \text{Obj}(\theta)}{\partial \theta_1 \partial\theta_2} & \cdots & \frac{\partial^2 \text{Obj}(\theta)}{\partial \theta_1 \partial\theta_{p_{\theta}}} \\
  \frac{\partial^2 \text{Obj}(\theta)}{\partial \theta_2 \partial \theta_1} & \frac{\partial^2 \text{Obj}(\theta)}{\partial \theta_2^2} & \cdots & 0 \\
  \vdots  & \vdots  & \ddots & \vdots  \\
  \frac{\partial^2 \text{Obj}(\theta)}{\partial \theta_{p_{\theta}} \partial  \theta_1} & \frac{\partial^2 \text{Obj}(\theta)}{\partial \theta_{p_{\theta}} \partial \theta_2} & \cdots & \frac{\partial^2 \text{Obj}(\theta)}{\partial \theta_{p_{\theta}} \partial \theta_{p_{\theta}}}
 \end{pmatrix}.
$$

To find the minimum of the objective $\text{Obj}(\theta + \Delta\theta)$, we take its first derivative and equate it with $0$ and solve for $\Delta\theta$,

$$
\text{Obj}'(\theta) + \text{Obj}''(\theta) \Delta\theta = 0 \implies \Delta\theta = - [\text{Obj}''(\theta)]^{-1} \text{Obj}'(\theta).
$$

Thus, we have 

$$
\theta^{(t)} = \theta^{(t-1)} - \eta^{(t)} \cdot [\text{Obj}''(\theta^{(t-1)})]^{-1} \text{Obj}'(\theta^{(t-1)}),
$$

where $\eta^{(t)}$ is the step size or learning rate.

Computing the inverse of the Hessian matrix is very expensive, so we can try Quasi-Newton methods. 

### 7.3 Proximal Gradient Descent

If the objective function is not differentiable everywhere (e.g. L1 norm), we can use the proximal gradient descent. 

---

Reference: James, Gareth, et al. "Statistical Learning." *An introduction to statistical learning*. Vol. 112. New York: springer, 2013.