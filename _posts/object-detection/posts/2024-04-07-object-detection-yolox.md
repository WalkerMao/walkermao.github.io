---
layout: post
title: "Object Detection: YOLOX"
date: 2024-04-07
categories: CV DL
tags: [Object detection, CNN]
published: true
hidden: true
comments: true
---

The contents in this post are excerpted from the paper "YOLOX: Exceeding YOLO Series in 2021" [^1], with a little bit modification, as my notes for this paper.

## 1. Introduction

YOLOX integrates the following advanced detection techniques into YOLO families:

* anchor free manner
* decoupled head
* label assignment strategy SimOTA

## 2. YOLOX

### 2.1. YOLOX-DarkNet53

#### Implementation details

Our training settings are mostly consistent from the baseline to our ﬁnal model:

* train the models for a total of 300 epochs with 5 epochs warm-up on COCO *train2017*.
* use stochastic gradient descent (SGD).
* use a learning rate of $$ lr \times \text{BatchSize}/64 $$ (linear scaling), with a initial $$ lr = 0.01 $$ and the cosine learning rate schedule.
* the batch size is 128 by default to typical 8-GPU devices. Other batch sizes include single GPU training also work well.
* the input size is evenly drawn from 448 to 832 with 32 strides.

#### YOLOv3 baseline

Our baseline adopts the architec-ture of DarkNet53 backbone and an SPP layer, referred to YOLOv3-SPP. We slightly change some training strategies compared to the original YOLOv3 implementation:

* add EMA weights updating.
* add cosine learning rate schedule.
* add IoU loss and IoU-aware branch.
* use BCE Loss for training *cls* and *obj* branch.
* use IoU Loss for training *reg* branch.

These general training tricks are orthogonal to the key improvement of YOLOX, we thus put them on the baseline.

#### Decoupled head

Due to the conﬂict between classiﬁcation and regression tasks, compared to the coupled detection head, the decoupled head for classiﬁcation and localization:

* converges much faster in training.
* gets better performance.

<div align='center'>
<figure>
<img src="https://www.researchgate.net/publication/376618308/figure/fig3/The-built-decoupled-head-and-the-YOLOv3-head-are-shown-in-comparison-15.png" alt="Figure 2" style="zoom:85%;" />
<figcaption style="font-size:80%;"> Figure 2: Illustration of the difference between YOLOv3 head and the proposed decoupled head. For each level of FPNfeature, we ﬁrst adopt a 1 × 1 conv layer to reduce the feature channel to 256 and then add two parallel branches with two3 × 3 conv layers each for classiﬁcation and regression tasks respectively. IoU branch is added on the regression branch. </figcaption>
</figure>
</div>
This increased AP by 1.1%.

Refer to IoU-Net [^2] for the IoU branch.

#### Strong data augmentation

We add Mosaic and MixUp into our augmentation strategies to boost YOLOX's performance. We close the augmentation for the last 15 epochs.

This increased AP by 2.4%.

#### Anchor-free

The anchor mechanism has many known problems:

* anchor priors are domain-speciﬁc and less generalized.

* anchor mechanism increases the complexity of detection heads, as well as the number of predictions for each image.

We reduce the predictions for each location in feature map from 3 to 1 and make them directly predict four box values. Such modiﬁcation reduces the parameters and GFLOPs of the detector and makes it faster, but obtains better performance.

This increased the AP by 0.9% concerning the YOLOv3 baseline.

#### Multi positives

Selecting only ONE positive sample (the center location) for each object ignores other high quality predictions. However, optimizing those high quality predictions may also bring beneﬁcial gradients, which may alleviates the extreme imbalance of positive/negative sampling during training. We simply assigns the center 3×3 area as positives, also named "centersampling" in [FOCS](https://arxiv.org/abs/1904.01355).

This increased AP by 2.1%.

#### SimOTA

Four key insights for an advanced label assignment:

* loss/quality aware.
* center prior.
* dynamic number of positive anchors for each ground-truth (abbreviated as dynamic top-k). The term "anchor" refers to “anchor point" in the context of anchor-free detectors and "grid" in the context of YOLO.
* global view.

OTA label assignment meets all four rules above, but it is very time consuming, thus we simplify it to dynamic top-$$ k $$ strategy, named SimOTA, to get an approximate solution.

Steps in SimOTA:

1. calculates pair-wise matching degree, represented by cost or quality for each prediction-gt pair. in SimOTA, the cost between ground-truth (gt) $$ g_i $$ and prediction $$ p_j $$ is calculated as: $$ c_{ij} = L_{ij}^{\text{cls}} + \lambda L_{ij}^{\text{reg}} $$, where $$ \lambda $$ is a balancing coefﬁcient. $$ L_{ij}^{\text{cls}} $$ and $$ L_{ij}^{\text{reg}} $$ are classiﬁcation loss and regression loss between $$ g_i $$ and $$ p_j $$.
2. for gt $$ g_i $$, select the top $$ k $$ predictions with the least cost within a ﬁxed center region as its positive samples. Noted that the value $$ k $$ varies for different gt. Refer to Dynamic $$ k $$ Estimation strategy in OTA for more details.
3. the corresponding grids of those positive predictions are assigned as positives, while the rest grids are negatives.

[Here](https://www.bilibili.com/video/BV1JW4y1k76c/?share_source=copy_web&vd_source=3d6dfa97ccaa122ba400a8c30c176cbd&t=764) is a good interpretation of SimOTA.

This increased AP by 2.3%.

### 2.2. Other Backbones

#### Model size and data augmentation

The suitable augmentation strategy varies across different size of models. It is better to weaken the augmentation for small models. Speciﬁcally, we remove the MixUp augmentation and weaken the Mosaic (reduce the scale rangefrom $$ [0.1, 2.0] $$ to $$ [0.5, 1.5] $$) when training small models, i.e., YOLOX-S, YOLOX-Tiny, and YOLOX-Nano.

## Conclusion

Equipped with some recent advanced detection techniques:

* decoupled head
* strong data augmentation (Mosaic and MixUp)
* anchor-free
* advanced label assigning strategy (SimOTA)

YOLOX achieves a better trade-off between speed and accuracy than other counterparts across all model sizes.

<br>

**Reference:**

[^1]: Ge, Zheng, et al. "Yolox: Exceeding yolo series in 2021." *arXiv preprint arXiv:2107.08430* (2021).
[^2]: Jiang, Borui, et al. "Acquisition of localization confidence for accurate object detection." *Proceedings of the European conference on computer vision (ECCV)*. 2018.