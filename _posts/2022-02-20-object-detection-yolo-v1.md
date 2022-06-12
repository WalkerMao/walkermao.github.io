---
layout: post
title: "Object Detection: YOLO v1"
date: 2022-02-20
categories: CV DL
tags: [Object detection, CNN]
published: true
comments: true
---

The contents in this post are excerpted from the paper "You Only Look Once: Unified, Real-Time Object Detection" [^1], with a little bit modification, as my notes for this paper.

## Abstract

YOLO is a single neural network predicts bounding boxes and class probabilities directly from full images in one evaluation (you only look once). It can be optimized end-to-end directly on detection performance. 

Compared to state-of-the-art detection systems, YOLO is extremely fast. Furthermore, it makes more localization errors but is less likely to predict false positives on background.

YOLO learns very general representations of objects.

## 1. Introduction

More recent approaches like R-CNN use region proposal methods to first generate potential bounding boxes in an image and then run a classifier on these proposed boxes. After
classification, post-processing is used to refine the bound-
ing boxes, eliminate duplicate detections, and rescore the
boxes based on other objects in the scene. These complex pipelines are slow and hard to optimize because each
individual component must be trained separately.

<div align='center'>
<figure>
<img src="https://www.researchgate.net/profile/Rumin-Zhang/publication/330591711/figure/fig4/AS:999014401069061@1615195002164/The-YOLO-Detection-System-Processing-images-with-YOLO-is-simple-and-straightforward.jpg" alt="Figure 1: The YOLO Detection System." style="zoom:80%;" />
<figcaption style="font-size:80%;"> Figure 1: The YOLO Detection System. Processing images with YOLO is simple and straightforward. Our system (1) resizes the input image to 448 × 448, (2) runs a single convolutional network on the image, and (3) thresholds the resulting detections by the model's confidence. (<a href="https://www.researchgate.net/figure/The-YOLO-Detection-System-Processing-images-with-YOLO-is-simple-and-straightforward_fig4_330591711">Source</a>) </figcaption>
</figure>
</div>

YOLO is refreshingly simple: see Figure 1. A single convolutional network simultaneously predicts multiple bounding boxes and class probabilities for those boxes. YOLO trains on full images and directly optimizes detection performance. This unified model has several benefits over traditional methods of object detection:

First, YOLO is extremely fast. 

Second, YOLO reasons globally about the image when making predictions. Unlike sliding window and region proposal-based techniques, YOLO sees the entire image during training and test time so it implicitly encodes contextual information about classes as well as their appearance. Fast R-CNN, a top detection method, mistakes background patches in an image for objects because it can't see the larger context. YOLO makes less than half the number of background errors compared to Fast R-CNN.

Third, YOLO learns generalizable representations of objects. It is less likely to break down when applied to new domains or unexpected inputs (e.g. trained on natural images and tested on artwork).

As for the drawbacks, YOLO struggles to precisely localize some objects, especially small ones.

## 2. Unified Detection

Our system divides the input image into an $$ S \times S $$ grid. Each grid cell predicts $$ B $$ bounding boxes and confidence scores for those boxes.

Each grid cell predicts $$ B $$ bounding boxes ($$x, y, w, h$$) and confidence scores for those boxes. These confidence scores reflect how confident the model is that the box contains an object and also how accurate it thinks the box is that it predicts. Formally we define confidence as $$ \mathrm{Pr}(\mathrm{Object}) \times \mathrm{IOU}_{\mathrm{pred}}^{\mathrm{truth}} $$. If no object exists in that cell, the confidence scores should be zero. Otherwise we want the confidence score to equal the intersection over union (IOU) between the predicted box and the ground truth.

Each grid cell also predicts $$ C $$ conditional class probabilities, $$ \mathrm{Pr}(\mathrm{Class}_i \mid \mathrm{Object}) $$. These probabilities are conditioned on the grid cell containing an object. We only predict one set of class probabilities per grid cell, regardless of the number of boxes $$ B $$.

At test time we multiply the conditional class probabilities and the individual box confidence predictions,

$$
\mathrm{Pr}(\mathrm{Class}_i \mid \mathrm{Object}) \times \mathrm{Pr}(\mathrm{Object}) \times \mathrm{IOU}_{\mathrm{pred}}^{\mathrm{truth}} = \mathrm{Pr}(\mathrm{Class}_i) \times \mathrm{IOU}_{\mathrm{pred}}^{\mathrm{truth}}
$$

which gives us class-specific confidence scores for each box. hese scores encode both the probability of that class appearing in the box and how well the predicted box fits the object.

<div align='center'>
<figure>
<img src="https://www.researchgate.net/publication/347650835/figure/fig3/AS:1022069898768390@1620691861580/The-You-Only-Look-Once-YOLO-8-model.ppm" alt="Figure 2: The Model." style="zoom:90%;" />
<figcaption style="font-size:80%;"> Figure 2: The Model. (<a href="https://www.researchgate.net/figure/The-You-Only-Look-Once-YOLO-8-model_fig3_347650835">Source</a>) </figcaption>
</figure>
</div>

Our system models detection as a regression problem. It divides the image into an $$ S \times S $$ grid and for each grid cell predicts $$ B $$ bounding boxes, confidence for those boxes, and $$ C $$ class probabilities. These predictions are encoded as an $$ S \times S \times (5B + C) $$ tensor.

For evaluating YOLO on PASCAL VOC, we use $$ S = 7, B = 2 $$.

### 2.1 Network Design

We implement this model as a convolutional neural network. The initial convolutional layers of the network extract features from the image while the fully connected layers predict the output probabilities and coordinates.

<div align='center'>
<figure>
<img src="https://www.researchgate.net/publication/329564805/figure/fig3/AS:702649875845129@1544536193578/Architecture-of-YOLO-CNN.ppm" alt="Architecture of YOLO CNN." style="zoom:110%;" />
<figcaption style="font-size:80%;"> Figure 3: The Architecture. Our detection network has 24 convolutional layers followed by 2 fully connected layers. Alternating 1 × 1 convolutional layers reduce the features space from preceding layers. The final output of our network is the 7 × 7 × 30 tensor of predictions. We pretrain the convolutional layers on the ImageNet classification task at half the resolution (224 × 224 input image) and then double the resolution for detection. (<a href="https://www.researchgate.net/figure/Architecture-of-YOLO-CNN_fig3_329564805">Source</a>) </figcaption>
</figure>
</div>

### 2.2 Training

Our final layer predicts both class probabilities and bounding box coordinates.

We increase the loss from bounding box coordinate predictions and decrease the loss from confidence predictions for boxes that don't contain objects. We use two parameters, $$ \lambda_{\mathrm{coord}} $$ and $$ \lambda_{\mathrm{noobj}}  $$ to accomplish this. We set $$ \lambda_{\mathrm{coord}} = 5 $$ and $$ \lambda_{\mathrm{noobj}} = 0.5 $$.

Our error metric should reflect that small deviations in large boxes matter less than in small boxes. To partially address this we predict the square root of the bounding box width and height instead of the width and height directly.

YOLO predicts multiple bounding boxes per grid cell. At training time we only want one bounding box predictor to be responsible for each object. We assign one predictor to be "responsible" for predicting an object based on which prediction has the highest current IOU with the ground truth. This leads to specialization between the bounding box predictors. Each predictor gets better at predicting certain sizes, aspect ratios, or classes of object, improving overall recall.

During training we optimize the following, multi-part loss function:

$$
\begin{aligned}
& \lambda_{\text {coord }} \sum_{i=0}^{S^{2}} \sum_{j=0}^{B} \mathbb{1}_{i j}^{\text {obj }}\left[\left(x_{i}-\hat{x}_{i}\right)^{2}+\left(y_{i}-\hat{y}_{i}\right)^{2}\right] \\
&+\lambda_{\text {coord }} \sum_{i=0}^{S^{2}} \sum_{j=0}^{B} \mathbb{1}_{i j}^{\text {obj }}\left[\left(\sqrt{w_{i}}-\sqrt{\hat{w}_{i}}\right)^{2}+\left(\sqrt{h_{i}}-\sqrt{\hat{h}_{i}}\right)^{2}\right] \\
&+\sum_{i=0}^{S^{2}} \sum_{j=0}^{B} \mathbb{1}_{i j}^{\text {obj }}\left(C_{i}-\hat{C}_{i}\right)^{2} \\
&+\lambda_{\text {noobj }} \sum_{i=0}^{S^{2}} \sum_{j=0}^{B} \mathbb{1}_{i j}^{\text {noobj }}\left(C_{i}-\hat{C}_{i}\right)^{2} \\
&+\sum_{i=0}^{S^{2}} \mathbb{1}_{i}^{\text {obj }} \sum_{c \in \text { classes }}\left(p_{i}(c)-\hat{p}_{i}(c)\right)^{2}.
\end{aligned}
$$

where $$ \mathbb{1}_{i}^{\text {obj }} $$ denotes if object appears in cell $$ i $$ and $$ \mathbb{1}_{i j}^{\text {obj }} $$ denotes that the $$ j $$ th bounding box predictor in cell $$ i $$ is "responsible" for that prediction.

Note that the loss function only penalizes classification error if an object is present in that grid cell (hence the conditional class probability discussed earlier). It also only penalizes bounding box coordinate error if that predictor is "responsible" for the ground truth box (i.e. has the highest IOU of any predictor in that grid cell).

### 2.3 Inference

The grid design enforces spatial diversity in the bounding box predictions. Often it is clear which grid cell an object falls in to and the network only predicts one box for each object. However, some large objects or objects near the border of multiple cells can be well localized by multiple cells. Non-maximal suppression can be used to fix these multiple detections.

### 2.4 Limitations of YOLO

YOLO imposes strong spatial constraints on bounding box predictions since each grid cell only predicts two boxes and can only have one class. This spatial constraint limits the number of nearby objects that our model can predict. Our model struggles with small objects that appear in groups, such as flocks of birds. Faster R-CNN does better than YOLO in detecting small objects since it generates more anchors (roughly 2000 in total), but it is still not good enough since the height and width of the last feature map are small after pooling layers.

Since our model learns to predict bounding boxes from data, it struggles to generalize to objects in new or unusual aspect ratios or configurations.

Finally, while we train on a loss function that approximates detection performance, our loss function treats errors the same in small bounding boxes versus large bounding boxes. A small error in a large box is generally benign but a small error in a small box has a much greater effect on IOU. Our main source of error is incorrect localizations.

<br>

**Reference:**

[^1]: Redmon, Joseph, et al. "You only look once: Unified, real-time object detection." *Proceedings of the IEEE conference on computer vision and pattern recognition*. 2016.