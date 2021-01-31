---
layout: post
title:  "Image Histograms"
date: 2021-01-31
categories: CV
comments: true
published: true
hidden: false
---

## Image Grayscale Histograms

Histograms measure the frequency of brightness within the image: how many times does a particular pixel value appear in an image. A histogram shows the contrast, brightness, intensity distribution etc. of that image. 

<div align='center'>
<img src="https://opencv-python-tutroals.readthedocs.io/en/latest/_images/histogram_sample.jpg" alt="Histogram Example" style="zoom:120%;" />
</div>

The pixel intensity is a single value for a grayscale image, or three values for a color image. The histogram above is drawn for grayscale image, not color image. 

### High & Low Key; Over & Under Exposure

The region where most of the brightness values are present is called the "tonal range".

<div align='center'>
<img src="https://cdn.cambridgeincolour.com/images/tutorials/hist_examplehist.png" alt="Example Histogram" style="zoom:100%;" />
</div>

Images where most of the tones occur in the shadows are called "low key," whereas with "high key" images most of the tones are in the highlights. Most cameras will produce midtone-centric histograms when in an automatic exposure mode. 

<div align='center'>
<img src="https://cdn.cambridgeincolour.com/images/tutorials/hist_lowkey.jpg" alt="Low Key Image" style="zoom:80%;" /><img src="https://cdn.cambridgeincolour.com/images/tutorials/hist_lowkey_auto.jpg" alt="img" style="zoom:80%;" />
</div>
<div align='center'>
<img src="https://cdn.cambridgeincolour.com/images/tutorials/hist_lowkey_hist.png" alt="Low Key Histogram" style="zoom:80%;" /><img src="https://cdn.cambridgeincolour.com/images/tutorials/hist_lowkey_auto_hist.png" alt="Low Key Histogram" style="zoom:80%;" />
</div>
<div style="line-height:50%;">
    <br>
</div>
<div align='center'>
<img src="https://cdn.cambridgeincolour.com/images/tutorials/hist_highkey.jpg" alt="High Key Image" style="zoom:80%;" /><img src="https://cdn.cambridgeincolour.com/images/tutorials/hist_highkey_auto.jpg" alt="img" style="zoom:80%;" />
</div>
<div align='center'>
<img src="https://cdn.cambridgeincolour.com/images/tutorials/hist_highkey_hist.png" alt="High Key Histogram" style="zoom:80%;" /><img src="https://cdn.cambridgeincolour.com/images/tutorials/hist_highkey_hist_auto.png" alt="High Key Histogram" style="zoom:80%;" />
</div>

### Contrast

Contrast is a measure of the difference in brightness between light and dark areas in a scene. 

Root mean square (RMS) contrast is defined as the standard deviation of the pixel intensities: 

$$
\sqrt{\frac{1}{W H} \sum_{i=0}^{W-1} \sum_{j=0}^{H-1}\left(I_{i j}-\bar{I}\right)^{2}}
$$

where intensities $$ I_{i j} $$ are the $$ i $$-th $$ j $$-th element of the two-dimensional image of size $$ W $$ by $$ H $$. $$ \bar{I} $$ is the average intensity of all pixel values in the image. The image $$ I $$ is assumed to have its pixel intensities normalized in the range $$[0,1]$$. 

Broad histograms reflect a scene with significant contrast, whereas narrow histograms reflect less contrast. Contrast can have a significant visual impact on an image by emphasizing texture. 

<div align='center'>
<img src="https://cdn.cambridgeincolour.com/images/tutorials/hist_lowcont.jpg" alt="img" style="zoom:80%;" /> <img src="https://cdn.cambridgeincolour.com/images/tutorials/hist_highcont.jpg" alt="img" style="zoom:80%;" />
</div>
<div align='center'>
<img src="https://cdn.cambridgeincolour.com/images/tutorials/hist_lowcont_hist.png" alt="img" style="zoom:80%;" /> <img src="https://cdn.cambridgeincolour.com/images/tutorials/hist_highcont_hist.png" alt="img" style="zoom:80%;" /> 
</div>

Contrast can also vary for different regions within the same image due to both subject matter and lighting.

<div align='center'>
<img src="https://cdn.cambridgeincolour.com/images/tutorials/hist_norm2.jpg" alt="img" style="zoom:80%;" /> <img src="../pictures/image-histograms-seperated.png" alt="image-histograms-seperated" style="zoom: 50%;" />
</div>

### Histogram Equalization

Histogram equalization usually increases the contrast of our images, especially when the usable data of the image is represented by close contrast values. Through this adjustment, the intensities can be better distributed on the histogram. Histogram equalization accomplishes this by effectively **spreading out the most frequent intensity values**.

<div align='center'>
<img src="https://upload.wikimedia.org/wikipedia/commons/c/ca/Histogrammeinebnung.png" alt="Histogram equalization" style="zoom:45%;" />
</div>

Let $$f$$ be a given image represented as a matrix of integer pixel intensities ranging from $$0$$ to $$L-1$$. $$L$$ is the number of possible intensity values, often $$256$$. Let $$p_f(k) $$ denote the probability density function (PDF) of the normalized histogram of $$f$$ with a bin for each possible intensity $$k$$. So

$$
p_f(k) = \frac{\text{Number of pixels with intensity }  k}{\text{Total number of pixels}}, \quad k=0,1, \cdots, L-1.
$$

The corresponding cumulative distribution function (CDF) is 

$$
F_f(l) = \sum_{k=0}^{l} p_f(k).
$$

The histogram equalized image $ g $ will be defined by

$$
g_{i, j} = T_f(f_{i,j}) = \text{floor}\left((L-1) F_f(f_{i,j}) \right) = \text{floor}\left((L-1) \sum_{k=0}^{f_{i, j}} p_f(k)\right)
$$

where $$T_f(\cdot)$$ is the transformation function of the histogram equalization of $$f$$, and $$\text{floor}()$$ rounds down to the nearest integer. Note that the transformation function $$T_f(\cdot)$$ is proportional to the CDF $$F_f(\cdot)$$ of $$f$$.

The derivation of the transformation function is [provided here](http://www.math.uci.edu/icamp/courses/math77c/demos/hist_eq.pdf).

The method is useful in images with backgrounds and foregrounds that are both bright or both dark. In particular, the method can lead to better views of bone structure in X-ray images, and to better detail in photographs that are over or under-exposed. Histogram equalization often produces unrealistic effects in photographs; however it is very useful for scientific images like thermal, satellite or X-ray images. 

<div align='center'>
<figure>
<img src="https://docs.opencv.org/master/histeq_numpy1.jpg" alt="histeq_numpy1.jpg" style="zoom:100%;" /> <br>
<img src="https://docs.opencv.org/master/histeq_numpy2.jpg" alt="histeq_numpy2.jpg" style="zoom:100%;" />
<figcaption style="font-size: 80%;"> Figure. Image before and after histogram equalization. </figcaption>
</figure>
</div>

A key advantage of the method is that it is a fairly straightforward technique and an invertible operator. So in theory, if the histogram equalization function is known, then the original histogram can be recovered. The calculation is not computationally intensive. A disadvantage of the method is that it is indiscriminate. It may increase the contrast of background noise, while decreasing the usable signal.

## AHE and CLAHE

Ordinary histogram equalization uses the same transformation derived from the image histogram to transform all pixels. This works well when the distribution of pixel values is similar throughout the image. However, when the image contains regions that are significantly lighter or darker than most of the image, the contrast in those regions will not be sufficiently enhanced.

Adaptive histogram equalization (AHE) improves on this by transforming each pixel with a transformation function derived from a neighborhood region, as in the figure below. The derivation of the transformation functions from the histograms is exactly the same as for ordinary histogram equalization. 

<div align='center'>
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/AHE-neighbourhoods.svg/300px-AHE-neighbourhoods.svg.png" alt="AHE-neighbourhoods.svg" style="zoom:80%;" />
</div>

Ordinary AHE tends to overamplify the contrast in near-constant regions of the image, since the histogram in such regions is highly concentrated. As a result, AHE may cause noise to be amplified in near-constant regions. **Contrast Limited AHE** (**CLAHE**) is a variant of adaptive histogram equalization in which the contrast amplification is limited, so as to reduce this problem of noise amplification.

In CLAHE, the contrast amplification in the vicinity of a given pixel value is given by the slope of the transformation function. In another word, the larger of the slope, the larger of the contrast amplification. The slope of the transformation function is proportional to the slope of the neighborhood CDF and therefore to the value of the histogram at that pixel value. CLAHE limits the amplification by clipping the histogram at a predefined limit before computing the CDF. This limits the slope of the CDF and therefore of the transformation function. The value at which the histogram is clipped, the so-called clip limit, depends on the normalization of the histogram and thereby on the size of the neighborhood region. 

It is advantageous not to discard the part of the histogram that exceeds the clip limit but to redistribute it equally among all histogram bins, as shown below.

<div align='center'>
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Clahe-redist.svg/300px-Clahe-redist.svg.png" alt="Clahe-redist.svg" style="zoom:100%;" />
</div>

The redistribution will push some bins over the clip limit again (region shaded green in the figure). If this is undesirable, the redistribution procedure can be repeated recursively until the excess is negligible.

<br>

**References:**

[Camera Histograms: Tones & Contrast](https://www.cambridgeincolour.com/tutorials/histograms1.htm)

[Wikipedia: Histogram equalization](https://en.wikipedia.org/wiki/Histogram_equalization)

[UCI Math 77C - Image Processing: Histogram Equalization](http://www.math.uci.edu/icamp/courses/math77c/demos/hist_eq.pdf)

[OpenCV Tutorial - Histograms - 2: Histogram Equalization](https://docs.opencv.org/master/d5/daf/tutorial_py_histogram_equalization.html)

[Wikipedia: Adaptive histogram equalization](https://en.wikipedia.org/wiki/Adaptive_histogram_equalization)