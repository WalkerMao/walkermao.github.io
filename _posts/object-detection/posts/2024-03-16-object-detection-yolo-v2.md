---
layout: post
title: "Object Detection: YOLO v2"
date: 2024-03-16
categories: CV DL
tags: [Object detection, CNN]
published: true
hidden: true
comments: true
---

The contents in this post are excerpted from the paper "YOLO9000: Better, Faster, Stronger" [^1], with a little bit modification, as my notes for this paper. 

## Abstract

YOLO9000 is a state-of-the-art, real-time object detection system that can detect over 9000 object categories. We propose **a method to jointly train on object detection and classification**. Using this method we train YOLO9000 simultaneously on the COCO detection dataset and the ImageNet classiﬁcation dataset. Our joint training allows YOLO9000 to predict detections for object classes that don't have labelled detection data.

## 1. Introduction

We propose **a new method to harness the large a mount of classfication data and use it to expand the scope of current detection systems**. Our method uses a hierarchical view of object classiﬁcation that allows us to combine distinct datasets together.

We also propose **a joint training algorithm that allows us to train object detectors on both detection and classiﬁcation data**. Our method leverages labeled detection images to learn to precisely localize objects while it uses classiﬁcation images to increase its vocabulary and robustness.

First we improve upon the base YOLO detection system to produce YOLOv2, a state-of-the-art, real-time detector. Then we use our dataset combination method and joint training algorithm to train a model on more than 9000 classes from ImageNet as well as detection data from COCO.

## 2. Better

We focus mainly on improving recall and localization (shortcomings of YOLO) while maintaining classiﬁcation accuracy.

* Batch Normalization. Batch normalization leads to signiﬁcant improvements in convergence while eliminating the need for other forms of regularization. This more than 2% improvement in mAP.
* High Resolution Classiﬁer. Make a transition from pretraining to fine tuning if the datasets are different in some aspects. The original YOLO trains the classiﬁer network at 224 × 224 and increases the resolution to 448 for detection. This means the network has to simultaneously switch to learning object detection and adjust to the new input resolution. For YOLOv2 we ﬁrst ﬁne tune the classiﬁcation network at the full 448 × 448 resolution for 10 epochs on ImageNet. This gives the network time to adjust its ﬁlters to work better on higher resolution input. We then ﬁne tune the resulting network on detection. This gives an increase of almost 4% mAP.
* Convolutional with Anchor Boxes. Recall increases but mAP decreases.
* Dimension Clusters. Instead of choosing priors (anchor box dimensions) by hand, we run k-means clustering on the training set bounding boxes to automatically ﬁnd good priors. We use IOU as the k-means distance metric. This gives much better IOU result.
* Direct Location Prediction.
* Fine-Grained Features. Adding a passthrough layer that brings features from an earlier layer. The passthrough layer concatenates the higher resolution features with the low resolution features by stacking adjacent features into different channels instead of spatial locations.
* Multi-Scale Training [^2]. Since the model only uses convolutional and pooling layers it can be resized on the fly. We want YOLOv2 to be robust to running on images of different sizes so we train this into the model. Every 10 batches our network randomly chooses a new image dimension size and continue training. Note that the YOLOv2 288 × 288 ~ YOLOv2 544 × 544 are the same network with different input image size. The network runs faster at smaller sizes so YOLOv2 offers an easy trade off between speed and accuracy.

## 3. Faster

Darknet-19 has 19 convolutional layers and 5 maxpooling layers.

During training we use standard data augmentation tricks including random crops, rotations, and hue, saturation, and exposure shifts.

## 4. Stronger

### Jointly Training

We propose a mechanism for jointly training on classiﬁcation and detection data. Our method uses images labelled for detection to learn detection-speciﬁc information like bounding box coordinate prediction and objectness as well as how to classify common objects. It uses images with only class labels to expand the number of categories it can detect.

During training we mix images from both detection and classiﬁcation datasets. When our network sees an image labelled for detection we can backpropagate based on the full YOLOv2 loss function. When it sees a classiﬁcation image we only backpropagate loss from the classiﬁcation-speciﬁc parts of the architecture.

### Hierarchical Classiﬁcation

Multi-class: Most approaches to classiﬁcation use a softmax layer across all the possible categories to compute the ﬁnal probability distribution. Using a softmax assumes the classes are mutually exclusive. This presents problems for combining datasets, for example you would not want to combine ImageNet and COCO using this model because the classes "Norfolk terrier" and "dog" are not mutually exclusive.

Multi-label: We could instead use a multi-label model to combine the datasets which does not assume mutual exclusion. However, this approach ignores all the structure we do know about the data, for example that all of the COCO classes are mutually exclusive.

Instead of using multi-class or multi-label, we use hierarchical classiﬁcation. We use WordTree, a hierarchical model of visual concepts. To perform classiﬁcation with WordTree we predict conditional probabilities at every node for the probability of each hyponym of that synset given that synset. For example, at the "terrier" node we predict:

$$
\text{Pr}(\text{Norfolk terrier} \mid \text{terrier});\ \text{Pr}(\text{Yorkshire terrier} \mid \text{terrier});\ \text{Pr}(\text{Bedlington terrier} \mid \text{terrier});\ \dots
$$

If we want to compute the absolute probability for a particular node we simply follow the path through the tree to the root node and multiply to conditional probabilities. So if we want to know if a picture is of a Norfolk terrier we compute:

$$
\text{Pr}(\text{Norfolk terrier}) = \text{Pr}(\text{Norfolk terrier} \mid \text{terrier}) \times \text{Pr}(\text{terrier hunting} \mid \text{dog}) \times \dots \\ \times \text{Pr}(\text{mammal} \mid \text{animal}) \times \text{Pr}(\text{animal} \mid \text{physical object})
$$

<div align='center'>
<figure>
<img src="https://d3i71xaburhd42.cloudfront.net/7d39d69b23424446f0400ef603b2e3e22d0309d6/8-Figure6-1.png" alt="Figure 6: Combining datasets using WordTree hierarchy." style="zoom:90%;" />
<figcaption style="font-size:80%;"> Figure 6: Combining datasets using WordTree hierarchy. </figcaption>
</figure>
</div>

This formulation also works for detection. Now, instead of assuming every image has an object, we use YOLOv2's objectness predictor to give us the value of Pr(physical object). The detector predicts a bounding box and the tree of probabilities. We traverse the tree down, taking the highest conﬁdence path at every split until we reach some threshold and we predict that object class.

## Conclusion

YOLOv2 is state-of-the-art and faster than other detection systems across a variety of detection datasets. Furthermore, it can be run at a variety of image sizes to provide a smooth tradeoff between speed and accuracy.

YOLO9000 is a real-time framework for detection more than 9000 object categories by jointly optimizing detection and classiﬁcation. We use WordTree to combine data from various sources and our joint optimization technique to train simultaneously on ImageNet and COCO. YOLO9000 is a strong step towards closing the dataset size gap between detection and classiﬁcation.

Many of our techniques generalize outside of object detection. Our WordTree representation of ImageNet offers a richer, more detailed output space for image classiﬁcation. Dataset combination using hierarchical classiﬁcation would be useful in the classiﬁcation and segmentation domains. Training techniques like multi-scale training could provide beneﬁt across a variety of visual tasks.

<br>

**Reference:**

[^1]: Redmon, Joseph, and Ali Farhadi. "YOLO9000: better, faster, stronger." *Proceedings of the IEEE conference on computer vision and pattern recognition*. 2017.
[^2]: "[Perform multi-scale training (yolov2)](https://stackoverflow.com/questions/50005852)." *Stack Overflow*. 2018.
