# Lec.08: Depth estimation and 3D reconstruction

## Depth estimation

### Stereo matching

1. Given $X_L$, its match in the other image $X_R$ must lie on the epipolar line

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241107102701325.png" alt="image-20241107102701325" style="zoom:50%;" /></div>

2. Basic stereo matching algorithm: 
   
      - For each pixel in the first image
        - Find corresponding epipolar line in the right image
        - Search along epipolar line and pick the best match

3. Simplest Case: Parallel images: 相机同高度，镜头角度一样，focal length相同

    <div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241107103503735.png" alt="image-20241107103503735" style="zoom:50%;" /></div>

       - $x_2-x_1$= the disparity of pixel $(x_1,y_1)$
       - depth from disparity: Note that x and x’ are image coordinates relative to the image centers, respectively. Disparity is inversely proportional to depth.

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241107103617421.png" alt="image-20241107103617421" style="zoom:50%;" /></div>

4. Stereo image rectification：假设拍摄的时候两个相机不平行，先进行reproject使得两个相机水平
   
      - Reproject image planes onto a common plane parallel to the line between camera centers
      - 使用两个3x3的单应矩阵

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241107104408094.png" alt="image-20241107104408094" style="zoom:50%;" /></div>

5. Basic stereo matching algorithm: Best match minimizes the dissimilarity
6. Popular matching scores

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241107104503632.png" alt="image-20241107104503632" style="zoom:50%;" /></div>

7. Window size

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241107105012611.png" alt="image-20241107105012611" style="zoom:50%;" /></div>

> 本部分以下不考

8. Stereo as energy minimization。

    <div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241107105252512.png" alt="image-20241107105252512" style="zoom:50%;" /></div>

      - match cost: $E_d(d)=\sum\limits_{(x,y)\in I}C(x,y,d(x,y))$
      - smoothness cost: $E_s(d)=\sum\limits_{(p,q)\in\epsilon}V(d_p,d_q)$

    <div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241107105645725.png" alt="image-20241107105645725" style="zoom:50%;" /></div>

      - can minimize this independently per scanline using DP
        - 但DP只能处理1D的，不能处理2D的

9. Steps

      1. Calibrate cameras

      2. Rectify images

      3. Compute disparity

      4. Estimate depth

10. optimal baseline

       - too small: large depth error
       - too large: difficult search problem

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241107110113135.png" alt="image-20241107110113135" style="zoom:50%;" /></div>

11.  What will cause errors
       - 相机标定误差
       - 图片分辨率低
       - occlusion 遮挡
       - 亮度不一致
       - textureless regions

12.  Active stereo with structured light 主动式的立体匹配
       - simplifies the correspondence problem 通过结构光降低匹配难度，提高纹理丰富度

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241107111038459.png" alt="image-20241107111038459" style="zoom: 67%;" /></div>

### Multi-view stereo

1. Advantages
   
      - Can match windows using more than 1 neighbor, giving a **stronger constraint**
      - If you have lots of potential neighbors, can **choose** **the best subset** of neighbors to match per reference image
      - Can reconstruct a depth map for each reference frame, and the merge into a **complete 3D model**

2. basic idea: Correct depth gives consistent projections while incorrect depth gives inconsistent projections. 

   Compute the error for each depth value for each point in the reference image. Find the depth value that gives the smallest error

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241107112126106.png" alt="image-20241107112126106" style="zoom: 45%;" /><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241107112211904.png" alt="image-20241107112211904" style="zoom:45%;" />
<img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241107112345077.png" alt="image-20241107112345077" style="zoom: 67%;" /></div>

3. Plane-Sweep（不考）: Project each plane to neighbors views (via homography) and compare pixel values

   <div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241107112731176.png" alt="image-20241107112731176" style="zoom:67%;" /></div>

4. Cost volume is a 3D array that stores the errors of all pixels at all depths

5. Patch Match: an efficient algorithm

      - 假设：随机初始化中会产生一部分good guess，neighbor的变换是相似的

      - Steps

        1. random initialization: Each pixel is given a random patch offset as initialization

        2. propagation: Each pixels checks if the offsets from neighboring patches give a better matching patch. If so, adopt neighbor’s patch offset. 将当前像素的匹配偏移量传播给邻近像素，如果邻近像素的匹配效果更好，则更新其偏移量。

        3. local search: Each pixels searches for better patch offsets within a concentric radius around the current offset. 在当前偏移量周围进行随机搜索，寻找更好的匹配。

           The search radius starts with the size of the image and is halved each time until it is 1

        4. Go to Step 2 until converge

        <div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241107113736728.png" alt="image-20241107113736728" style="zoom:50%;" /></div>

## 3D reconstruction

1. pipeline
   
      - Compute depth map per image
      - Fuse the depth maps into a 3D surface
      - Texture mapping

### 3D representations

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241107114512604.png" alt="image-20241107114512604" style="zoom:50%;" /></div>

1. point cloud: 只有点，no surface
2. volume
   
      - occupancy volume: $V_{ijk}=1$ if occupied, 0 if empty
      - SDF(Signed Distance Function) volume: The distance of a point to the shape boundary. The distance is defined by a metric, usually the Euclidean distance
        - Truncated Signed Distance Function **(TSDF)**: Truncation SDF’s distance value to [−1, 1]

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241107114939305.png" alt="image-20241107114939305" style="zoom:50%;" /></div>

1. mesh: A polygon mesh with vertices and edges, usually triangle mesh

### 3D surface reconstruction

- depth maps -> occupancy volume
  - Poisson reconstruction

- occupancy volume -> mesh
  - Marching cubes

- construct a volume: good for denoising, easier to be converted to mesh

#### Poisson reconstrucition

> 不考细节

1. convert depth map to point cloud

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241107115238764.png" alt="image-20241107115238764" style="zoom:67%;" /></div>

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241107115303066.png" alt="image-20241107115303066" style="zoom: 67%;" /></div>

2. 计算每个点的法向量: variancee最小的方向

3. represent surface by indicator(occupancy) function

    - gradient relationship: 构造出的表面在对应点的梯度应该尽可能和每个点的法向量一致，优化问题
    - represent the oriented points by a vector field $\vec{V}$
    - find the function whose gradient best approximates $\vec{V}$ by minimizing

    $$
    \min_{\chi}\|\nabla\chi-\vec{V}\|
    $$

#### Marching cubes

> **Marching Squares(2D)**
>
> For each grid cell with a sign change 只有当一个格子四个顶点颜色不同，才存在边界。对应边界就在两端颜色不同的地方。
>
> - Create one vertex on each grid edge with a sign change.
> - Connect vertices by lines.
>   - Lines should not intersect
>   - Use a pre-computed look-up table
> - Location of the vertex can be determined by linear interpolation of SDF values.
>
> <div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241107120209172.png" alt="image-20241107120209172" style="zoom:45%;" /><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241107120318318.png" alt="image-20241107120318318" style="zoom:60%;" /></div>

 三维情况类似

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241107120416723.png" alt="image-20241107120416723" style="zoom: 67%;" /></div>

### Texture mapping

- add color to 3D surface
- Each triangle vertices is assigned a 2D coordinate $(u,v)$ in the texture image 

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241107121040581.png" alt="image-20241107121040581" style="zoom:50%;" /></div>

## Neural Scene Representations

1. Implict Neural Representations

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241107121730880.png" alt="image-20241107121730880" style="zoom:50%;" /></div>

2. Neural Radiance Fields (NeRF) 不同角度颜色不完全相同 Representing scenes as continuous density and color fields 生成神经辐射场

   <div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241107121914583.png" alt="image-20241107121914583" style="zoom:67%;" />
   <img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241107122441406.png" alt="image-20241107122441406" style="zoom:67%;" /></div>

- Limitations：Poor surface reconstruction quality 表面刻画不好