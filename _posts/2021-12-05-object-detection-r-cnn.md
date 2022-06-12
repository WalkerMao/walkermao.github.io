---
layout: post
title: "Object Detection: R-CNN"
date: 2021-12-05
categories: CV DL
tags: [Object detection, CNN]
published: true
comments: true
---

The contents in this post are excerpted from the paper "Rich feature hierarchies for accurate object detection and semantic segmentation" [^1], with a little bit modification, as my notes for this great paper.

## 1. Introduction

This method solves the CNN localization problem by operating within the "recognition using regions" paradigm, as argued for by Gu et al. in "[Recognition using regions](https://ieeexplore.ieee.org/abstract/document/5206727/)". At test-time, this method consists of three modules:

1. generates around 2000 category-independent region proposals (by using [selective search](https://link.springer.com/article/10.1007/s11263-013-0620-5) in experiment) for the input image;
2. extracts a fixed-length (4096-dimensional in experiment) feature vector from each proposal using a CNN as a blackbox feature extractor;
2. classifies each region with category-specific linear SVMs. 

This method use a simple technique (affine image warping) to compute a fixed-size CNN input from each region proposal, regardless of the region's shape. 

This method combines region proposals with CNNs, the authors dub it R-CNN: Regions with CNN features.

<div align='center'>
<figure>
<img src="https://www.researchgate.net/profile/Carlos-Ferrin/publication/330093035/figure/fig2/AS:740722319831046@1553613371577/R-CNN-Region-with-Convolutional-Neural-Networks-features-Architecture-Taken-from-9.png" alt="Figure 1: ." style="zoom:70%;" />
<figcaption style="font-size:80%;"> Figure 1: Object detection system overview. (1) takes an input image, (2) extracts around 2000 bottom-up regionproposals, (3) computes features for each proposal using a largeconvolutional neural network (CNN), and then (4) classifies each region using class-specific linear SVMs. (<a href="https://openaccess.thecvf.com/content_cvpr_2014/html/Girshick_Rich_Feature_Hierarchies_2014_CVPR_paper.html">Source</a>) </figcaption>
</figure>
</div>

The authors demonstrate that a simple bounding-box regression method significantly reduces mislocalizations, which are the dominant error mode.

## 2. Object detection with R-CNN

### 2.2 Test-time detection

Given all scored regions in an image, we apply a greedy non-maximum suppression (for each class independently) that rejects a region if it has an intersection-over-union (IoU) overlap with a higher scoring selected region larger than a learned threshold. 

The only class-specific computations are dot products between features and SVM weights and non-maximum suppression.

### 2.3 Training

Since the training data is too large to fit in memory, we adopt the standard hard negative mining method ([a simple explanation](https://www.reddit.com/r/computervision/comments/2ggc5l/comment/ckiuu9i/?utm_source=share&utm_medium=web2x&context=3)).

## Appendix

### B. Positive vs. negative examples and softmax

#### B.1 Positive vs. negative examples

Positive and negative examples (region proposals) are defined differently for fine-tuning the CNN versus training the object detection SVMs.

| Scenario        | IoU of Negative | IoU of Positive                                              |
| --------------- | --------------- | ------------------------------------------------------------ |
| Finetunning CNN | $$ < 0.5 $$     | $$ \geq 0.5 $$ (many jittered examples to avoid overfitting) |
| Training SVMs   | $$ < 0.3 $$     | $$ = 1 $$ (groundtruth)                                      |

Here the IoU refers to the IoU between example (region proposal) and groundtruth.

The fine-tuning data is limited. This scheme introduces many "jittered" examples (those proposals with overlap between 0.5 and 1, but not ground truth), which expands the number of positive examples by approximately 30x. The authors conjecture that this helps avoid overfitting. 

#### B.2 SVMs rather than softmax

After fine-tunning, we train SVMs, rather than simply apply the last layer of the fine-tuned network, which is a 21-way soft-max regression classifier, as the object detector. The authors found that performance on VOC 2007 dropped from 54.2% (SVMs) to 50.9% (softmax) mAP. This performance drop likely arises from a combination of several factors including that the definition of positive examples used in fine-tuning does not emphasize precise localization and the softmax classifier was trained on randomly sampled negative examples rather than on the subset of "hard negatives" used for SVM training.

My understanding: SVMs are suitable for small sample-size, and strict positive/negative samples are enough to train SVMs. In contrast, training CNN needs large sample size, and the jittered examples help avoid overfitting.

### C. Bounding-box regression

After scoring each selective search proposal with a class-specific detection SVM, we predict a new bounding box for the detection using a class-specific bounding-box regressor to improve localization performance.  Our goal is to learn a transformation that maps a proposed box $$P=(P_x, P_y, P_w, P_h)$$ to a groundtruth box $$P=(G_x, G_y, G_w, G_h)$$. We  parameterize the transformation in terms of four functions $$\{d_{\star}(P)=\mathbf{w}_{\star}^{\mathrm{T}} \boldsymbol{\phi}_{5}(P)\}_{\star=x,y,h,w}$$.

Two subtle issues while implementing bounding-box regression:

1.  Regularization is important.
1.  We select training pairs $$(P, Q)$$ such that $$\text{IoU}(P, Q) > 0.6$$. If more than one $$Q$$ satisfy this requirement, we select the $$Q$$ with the largest IoU.



<br>

**Reference:**

[^1]: Girshick, Ross, et al. "Rich feature hierarchies for accurate object detection and semantic segmentation." *Proceedings of the IEEE conference on computer vision and pattern recognition*. 2014.APA