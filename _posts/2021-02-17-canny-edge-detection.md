---
layout: post
title:  "Canny Edge Detection"
date: 2021-02-17
categories: CV
tags: [Traditional CV]
comments: true
published: true
hidden: false

---

## Image Edge Basis

### Goal and Motivation for Edge Detection

The goal of edge detection is to identify sudden changes (discontinuities) in an image. Intuitively, most semantic and shape information from the image can be encoded in the edges, and the edges are more compact than original pixels. The edges help us extract information, recognize objects, and recover the geometry and viewpoint of an image.

### Origin of Edges 

There are four possible sources of edges in an image: surface normal discontinuity (surface changes direction sharply), depth discontinuity (one surface behind another), surface color discontinuity (single surface changes color), illumination discontinuity (shadows/lighting). These discontinuities are demonstrated in the plot below.

<div align='center'>
<figure>
<img src="https://miro.medium.com/max/637/1*ujB8H3EkxMFVtmLUBSdDfQ.png" alt="Four-possible-sources-of-edges" style="zoom:100%;" />
<figcaption style="font-size: 80%;"> Figure. Four possible sources of edges in an image. (<a href="https://cs.stanford.edu/people/eroberts/courses/soco/projects/1997-98/computer-vision/edges.html">Source</a>)</figcaption>
</figure>
</div>

## Image Gradients

An edge in an image is an image contour across which the image's brightness or hue changes abruptly. We define an edge as a rapid place of change in the image intensity function, i.e. edges occur in an image when the magnitude of the gradient (first derivative) is high, as shown below. 

<div align='center'>
<figure>
<img src="https://ai.stanford.edu/~syyeung/cvweb/Pictures1/edgedetection.png" alt="Edge Detection" style="zoom:30%;" />
<figcaption style="font-size: 80%;"> Figure. An image with intensity function and first derivative. (<a href="https://ai.stanford.edu/~syyeung/cvweb/tutorial1.html">Source</a>)</figcaption>
</figure>
</div>

### Discrete Derivatives

There are three main types of derivatives that can be applied on pixels. Their formulas and corresponding filters (convoluting the filter with the image gives the derivatives) are:

$$
\begin{aligned}
&\text {Backward: } & f^{\prime}(x) &= f(x)-f(x-1) &\rightarrow & \ [0,1,-1], \\
&\text {Forward: } & f^{\prime}(x) &= f(x)-f(x+1) &\rightarrow & \ [-1,1,0], \\
&\text {Central: } & f^{\prime}(x) &= f(x+1)-f(x-1) &\rightarrow & \ \frac{1}{2}[1,0,-1].
\end{aligned}
$$

The 2D gradient $ (\nabla f) $ can be calculated as follows:

$$
\begin{aligned}
\nabla f(x, y) &=\left[\begin{array}{l}
\frac{\partial f(x, y)}{\partial x} \\
\frac{\partial f(x, y)}{\partial y}
\end{array}\right] 
= \left[\begin{array}{l}
f_{x} \\
f_{y}
\end{array}\right].
\end{aligned}
$$

We can also calculate the magnitude and the angle of the gradient:

$$
\begin{aligned}
& \mid\nabla f(x, y)\mid = \sqrt{f_{x}^{2}+f_{y}^{2}}, \\
& \theta =\tan ^{-1}\left(f_{y} / f_{x}\right).
\end{aligned}
$$

The gradient vectors point toward the direction of the most rapid increase in intensity.

<div align='center'>
<figure>
<img src="https://miro.medium.com/max/1650/1*p9U2BnfbT9cwFQnNWfyLxg.png" alt="Image for post" style="zoom:60%;" />
<figcaption style="font-size: 80%;"> Figure. The gradient vector directions. (<a href="https://jeheonpark93.medium.com/vc-edge-detection-4dec1b0be8e5">Source</a>)</figcaption>
</figure>
</div>

## Noise Reduction

If there is excessive noise in an image, the partial derivatives will not be effective for identifying the edges, as shown below. In order to properly extract edge locations, the noise removal should be preceded before the computing image gradients.

<div align='center'>
<figure>
<img src="https://ai.stanford.edu/~syyeung/cvweb/Pictures1/noise.png" alt="The derivative of an edge in a noisy image." style="zoom: 23%;" />
<figcaption style="font-size: 80%;"> Figure. Computed derivatives of a noisy image. (<a href="https://medium.com/jun-devpblog/cv-3-gradient-and-laplacian-filter-difference-of-gaussians-dog-7c22e4a9d6cc">Source</a>)</figcaption>
</figure>
</div>

### Derivative of Gaussian Filter

We can apply the Gaussian smoothing before computing image gradients.

<div align='center'>
<figure>
<img src="https://miro.medium.com/max/3175/1*2roG-Ul5AfTD3riXE-aCKA.png" alt="Image for post" style="zoom:40%;" />
<figcaption style="font-size: 80%;"> Figure. Proper approach to locate edges in a noisy image with Gaussian and Derivative Filters. (<a href="https://medium.com/jun-devpblog/cv-3-gradient-and-laplacian-filter-difference-of-gaussians-dog-7c22e4a9d6cc">Source</a>)</figcaption>
</figure>
</div>

Let $ f $ and $ h $ be an image and a filter, respectively. Note that one characteristic of convolution is that the derivative of convolved image $ (h * f) $ is equivalent to convolving image $ f $ with the differentiated filter $ \nabla h $.

$$
\frac{\partial}{\partial x}(h * f)=\left(\frac{\partial}{\partial x} h\right) * f
$$

Using this, we can simplify one operation in previous figure. This time, we first compute the differentiated filter $ \nabla h $ and convolve it with the image $f$, and this yields the same result as that is previous figure.

<div align='center'>
<figure>
<img src="https://miro.medium.com/max/1155/1*ySk0VvShNkgECSha4LKuAg.png" alt="Image for post" style="zoom:53%;" />
<figcaption style="font-size: 80%;"> Figure. Simplified approach to locate edges in a noisy image with the derivative of Gaussian filter. (<a href="https://medium.com/jun-devpblog/cv-3-gradient-and-laplacian-filter-difference-of-gaussians-dog-7c22e4a9d6cc">Source</a>)</figcaption>
</figure>
</div>

Smoothing removes noise but blurs edges. Smoothing with different kernel sizes can detect edges at different scales.

### Sobel Filter

This algorithm utilizes two $3 \times 3 $ kernels which, once convolved with the image, approximate the $ x $ and $ y $ derivatives of the original image.

$$
h_{x}=\left[\begin{array}{ccc}
1 & 0 & -1 \\
2 & 0 & -2 \\
1 & 0 & -1
\end{array}\right], \quad h_{y}=\left[\begin{array}{ccc}
1 & 2 & 1 \\
0 & 0 & 0 \\
-1 & -2 & -1
\end{array}\right].
$$

These matrices represent the result of smoothing and differentiation

$$
h_{x}=\left[\begin{array}{lll}
1 & 0 & -1 \\
2 & 0 & -2 \\
1 & 0 & -1
\end{array}\right]=\left[\begin{array}{l}
1 \\
2 \\
1
\end{array}\right]\left[\begin{array}{lll}
1 & 0 & -1
\end{array}\right].
$$

The Sobel filter can also be thought of as $3 \times 3$ approximations to first derivative of Gaussian kernels. This approximation enables the Sobel operator to be computed quite quickly, while Gaussian derivatives might be more accurate.

The Sobel Filter has many problems, including poor localization. The Sobel Filter also favors horizontal and vertical edges over oblique edges

## Canny Edge Detector

The Canny edge Detector has five algorithmic steps:

1. Suppress noise and compute gradients: Filter image with derivative of Gaussian or Sobel filter;
2. Compute gradient magnitude and direction;
3. Non-maximum suppression: Thin wide "edges" down to single pixel width;
4. Hysteresis thresholding: Use two thresholds to find weak and strong edges;
5. Connectivity analysis to detect edges: Keep strong edges and connect weak edges with them.

### Suppress Noise and Compute Gradients

We can both suppress noise and compute the graidents in the x and y directions using methods
like derivative of Gaussian filter or Sobel filter.

### Compute Gradient Magnitude and Direction

$$
\begin{aligned}
& \mid\nabla f(x, y)\mid = \sqrt{f_{x}^{2}+f_{y}^{2}}, \\
& \theta =\tan ^{-1}\left(f_{y} / f_{x}\right).
\end{aligned}
$$

### Non-Maximum Suppression

<div align='center'>
<figure>
<img src="https://image1.slideserve.com/2231035/the-canny-edge-detector3-n.jpg" alt="img" style="zoom:70%;" />
<figcaption style="font-size: 80%;"> Figure. Undesirable thick edges. </figcaption>
</figure>
</div>

The solution is to check if a pixel is local maximum along gradient direction. Basically, if the pixel is not the largest of the three pixels in the direction and opposite the direction of its gradient, then the gradient of this pixel is set to $0$.

### Hysteresis Thresholding

All remaining pixels are subjected to hysteresis thresholding. This part uses two values, for the high and low thresholds. Every pixel with a intensity gradient magnitude above the high threshold is marked as a strong edge. Every pixel below the low threshold is set to non-edge. Every pixel between the two thresholds is marked as a weak edge. 

### Connectivity Analysis

The final step is connecting the edges. All strong edge pixels are edges. For weak edge pixels, only the weak edge pixels that are linked to strong edge pixels are edges. The part uses BFS (breadth-first search) or DFS (depth-first search) to find all the edges.

<div align='center'>
<figure>
<img src="https://docs.opencv.org/master/hysteresis.jpg" alt="hysteresis.jpg" style="zoom:75%;" />
<figcaption style="font-size: 80%;"> Figure. Pixel A is a strong edge, while B and C are weak edges. C is a edge after connectivity analysis but B is not. (<a href="https://docs.opencv.org/master/da/d22/tutorial_py_canny.html">Source</a>) </figcaption>
</figure>
</div>

<br>

**References:**

[CS131 - Computer Vision: Lecture 5](https://github.com/StanfordVL/cs131_notes/blob/master/lecture05/lecture05.pdf)

[CS131 - Computer Vision: Lecture 6](https://github.com/StanfordVL/cs131_notes/blob/master/lecture06/lecture06.pdf)

[CS 543/ECE 549 - Computer Vision: Edge detection](https://slazebni.cs.illinois.edu/spring19/lec07_edge.pdf)

[OpenCV-Python Tutorials: Canny Edge Detection](https://docs.opencv.org/master/da/d22/tutorial_py_canny.html)

[Gradient and Laplacian Filter, Difference of Gaussians (DOG)](https://medium.com/jun-devpblog/cv-3-gradient-and-laplacian-filter-difference-of-gaussians-dog-7c22e4a9d6cc)