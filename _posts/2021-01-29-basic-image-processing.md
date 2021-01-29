### Image Histograms

Histograms measure the frequency of brightness within the image: how many times does a particular pixel value appear in an image.  A histogram shows the contrast, brightness, intensity distribution etc. of that image. 

<img src="https://opencv-python-tutroals.readthedocs.io/en/latest/_images/histogram_sample.jpg" alt="Histogram Example" style="zoom:120%;" />

Note that, this histogram is drawn for grayscale image, not color image. 

#### High & Low Key; Over & Under Exposure; Contrast

The region where most of the brightness values are present is called the "tonal range".

<img src="https://cdn.cambridgeincolour.com/images/tutorials/hist_examplehist.png" alt="Example Histogram" style="zoom:100%;" />

Images where most of the tones occur in the shadows are called "low key," whereas with "high key" images most of the tones are in the highlights. Most cameras will produce midtone-centric histograms when in an automatic exposure mode. 

<div align='center'>
<img src="https://cdn.cambridgeincolour.com/images/tutorials/hist_lowkey.jpg" alt="Low Key Image" style="zoom:80%;" /> <img src="https://cdn.cambridgeincolour.com/images/tutorials/hist_lowkey_auto.jpg" alt="img" style="zoom:80%;" />
</div>
<div align='center'>
<img src="https://cdn.cambridgeincolour.com/images/tutorials/hist_lowkey_hist.png" alt="Low Key Histogram" style="zoom:80%;" /> <img src="https://cdn.cambridgeincolour.com/images/tutorials/hist_lowkey_auto_hist.png" alt="Low Key Histogram" style="zoom:80%;" />
</div>

<div align='center'>
<img src="https://cdn.cambridgeincolour.com/images/tutorials/hist_highkey.jpg" alt="High Key Image" style="zoom:80%;" /> <img src="https://cdn.cambridgeincolour.com/images/tutorials/hist_highkey_auto.jpg" alt="img" style="zoom:80%;" />
</div>
<div align='center'>
<img src="https://cdn.cambridgeincolour.com/images/tutorials/hist_highkey_hist.png" alt="High Key Histogram" style="zoom:80%;" /> <img src="https://cdn.cambridgeincolour.com/images/tutorials/hist_highkey_hist_auto.png" alt="High Key Histogram" style="zoom:80%;" />
</div>

Contrast is a measure of the difference in brightness between light and dark areas in a scene. Broad histograms reflect a scene with significant contrast, whereas narrow histograms reflect less contrast. Contrast can have a significant visual impact on an image by emphasizing texture. 

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

#### Histogram Equalization

Histogram equalization usually increases the contrast of our images, especially when the usable data of the image is represented by close contrast values. Through this adjustment, the intensities can be better distributed on the histogram. Histogram equalization accomplishes this by effectively **spreading out the most frequent intensity values**.

<img src="https://upload.wikimedia.org/wikipedia/commons/c/ca/Histogrammeinebnung.png" alt="Histogram equalization" style="zoom:45%;" />

The method is useful in images with backgrounds and foregrounds that are both bright or both dark. In particular, the method can lead to better views of bone structure in x-ray images, and to better detail in photographs that are over or under-exposed. Histogram equalization often produces unrealistic effects in photographs; however it is very useful for scientific images like thermal, satellite or x-ray images.

A key advantage of the method is that it is a fairly straightforward technique and an invertible operator. So in theory, if the histogram equalization function is known, then the original histogram can be recovered. The calculation is not computationally intensive. A disadvantage of the method is that it is indiscriminate. It may increase the contrast of background noise, while decreasing the usable signal.







**References:**

[Camera Histograms: Tones & Contrast](https://www.cambridgeincolour.com/tutorials/histograms1.htm)

[Wikipedia: Histogram equalization](https://en.wikipedia.org/wiki/Histogram_equalization)

