# Lec.02: Image Formation

## Camera and lens

1. Pinhole camera
   
      - Add a barrier to block off most of the rays, The opening known as the aperture
      - 孔太小一方面亮度不够，另一方面会发生衍射现象diffraction

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20240919105704449.png" alt="image-20240919105704449" style="zoom:50%;" /></div>

1. Lens: $\dfrac{1}{i}+\dfrac{1}{o}=\dfrac{1}{f}$

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20240919110158481.png" alt="image-20240919110158481" style="zoom: 33%;" /></div>

- Magnification: $m=\dfrac{h_i}{h_o}$

3. Field of View: depend on focal length and sensor size
   
      - 长焦会放大远处的物体。焦距越长，视角越窄，适合远摄；焦距越短，视角越宽，适合广角拍摄。
      - FOV also depends on sensor size

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20240919111158448.png" alt="image-20240919111158448" style="zoom: 33%;" /></div>

4. F-number: More convenient to represent aperture as a fraction of focal length
      - $N=\dfrac{f}{D}$

5. Lens Defocus
   
      - From similar triangles: $\dfrac bD=\dfrac{|i^{\prime}-i|}{i^{\prime}}$
      - Blur circle diameter: $b=\dfrac D{i^{\prime}}|i^{\prime}-i|,b\propto D\propto\dfrac1N$
      - 如何认为image是well focused的，只要b的大小小于像素大小即可

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20240919111749495.png" alt="image-20240919111749495" style="zoom: 43%;" /></div>

6. Depth of Field：图像足够聚焦的物体距离的范围

   > 景深和哪些因素有关
   >
   > - o 相机到物体的距离
   > - f 镜头焦距
   > - c 图像中可接受的最大模糊圈直径
   > - N 光圈的F-number

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20240919112331178.png" alt="image-20240919112331178" style="zoom:50%;" /></div>

$$
\begin{aligned}&\bullet c=\frac{f^2(o-o_1)}{No_1(o-f)}, c=\frac{f^2(o_2-o)}{No_2(o-f)}\newline &\bullet\text{ Depth of Field: }o_2-o_1=\frac{2of^2cN(o-f)}{f^4-c^2N^2(o-f)^2}\end{aligned}
$$

7. How to blur the background
   
      - Large aperture
      - Long focal length
      - Near foreground
      - Far Background

## Geometric Image Formation

1. Pin-hole camera model: Perspective Projection

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20240919113302835.png" alt="image-20240919113302835" style="zoom:50%;" /></div>

2. Perspective Projection in homogeneous coordinates

$$
\begin{bmatrix}f & 0 & 0 & 0\newline  0 & f & 0 & 0\newline  0 & 0 & 1 & 0\end{bmatrix}\begin{bmatrix}x\newline  y\newline  z\newline  1\end{bmatrix}=\begin{bmatrix}fx\newline  fy\newline  z\end{bmatrix}\cong\begin{bmatrix}f\frac xz\newline  f\frac yz\newline  1\end{bmatrix}
$$

- Each point has an infinite set of homogeneous coordinates

3. Vanishing points: 三维空间中平行线在照片中会收敛于同一点

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20240919115822058.png" alt="image-20240919115822058" style="zoom:50%;" /><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20240919115842188.png" alt="image-20240919115842188" style="zoom:50%;" /></div>

- The ray from C through v is parallel to the lines
  - v tells us the direction of the lines
  - v may be outside the image frame or at infinity

4. Vanishing lines
   
      - Any set of parallel lines on the plane define a vanishing point
      - The union of all of these vanishing points is the vanishing line
      - Note that different planes define different vanishing lines
        - The direction of the vanishing line tells us the orientation of the plane

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20240919120554009.png" alt="image-20240919120554009" style="zoom:50%;" /><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20240919120719492.png" alt="image-20240919120719492" style="zoom: 50%;" /></div>

> 造成畸变的原因有哪些

5. Perspective distortion

    - 向上倾斜照相机会导致垂直方向收敛
    - 用一个普通的镜头来保持相机的水平，只能捕捉到建筑的底部
    - 外部柱看起来更大
    - 变形不是由于镜头的缺陷

6. Radial distortion

      - Caused by imperfect lenses(透镜)

      - More noticeable for rays that pass through the edge of the lens

        对于通过透镜边缘的光线来说更为明显

      - 广角容易导致桶形畸变

      - 长焦容易导致枕形畸变

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20240919121834128.png" alt="image-20240919121834128" style="zoom:50%;" /></div>

$$
\begin{aligned}&r^{2} = {x_{n}^{\prime}}^{2}+{y_{n}^{\prime}}^{2}\newline &x_{d}^{\prime} = x_{n}^{\prime}(1+\kappa_{1}r^{2}+\kappa_{2}r^{4})\newline &y_{d}^{\prime} = y_{n}^{\prime}(1+\kappa_{1}r^{2}+\kappa_{2}r^{4})\end{aligned}
$$

## Photometric image formation

- Shutter speed controls exposure time

- The pixel value is equal to the integral of the light intensity within the exposure time

像素值等于光强$\times$曝光时间

- Rolliing shutter effect：卷帘快门，逐行曝光，而非global shutter，即理想中的整张照片同时曝光，拍摄结果就可能出现"倾斜"、"摇摆不定"或"部分曝光"等情况，即果冻效应。

- Color spaces: RGB, HSV(Hue色调, Value亮度, Saturation饱和度)
  - HSV比RGB更接近人类对颜色感知，在图像处理中使用比较多
  - 两者之间可以互相转换 

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20240926101717542.png" alt="image-20240926101717542" style="zoom: 67%;" /></div>

- Bayer filter
  - 绿色最多：人眼对绿色光的敏感度最高；绿色是自然界中最常见的颜色之一；绿色通道通常噪声较少


<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20240926102531580.png" alt="image-20240926102531580" style="zoom: 50%;" /></div>

### Shading

- Compute light reflected toward camera at a specific point.

- Inputs:
  - Viewer direction, v
  - Surface normal, n
  - Light direction, I (for each of many lights.)
  - Surface parameters 材质

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20240926102959507.png" alt="image-20240926102959507" style="zoom: 50%;" /></div>

- BRDF(Bidirectional Reflectance Distribution Function)

> 不考

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20240926103225129.png" alt="image-20240926103225129" style="zoom:50%;" /></div>

- Diffuse (Lambertian) Reflection 漫反射

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20240926103640726.png" alt="image-20240926103640726" style="zoom:50%;" /></div>

- Specular reflection 镜面反射

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20240926104001818.png" alt="image-20240926104001818" style="zoom:50%;" /></div>

- Ambient Lighting 环境光

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20240926104231664.png" alt="image-20240926104231664" style="zoom: 50%;" /></div>

- Blinn-Phong Reflection Model

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20240926104256715.png" alt="image-20240926104256715" style="zoom:50%;" /></div>
