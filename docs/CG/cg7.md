# Hidden Surface Removal & Antialiasing

## Hidden Surface Removal

### Related OpenGL Functions

1. `glEnable/ glDisable(GL_CULL_FACE);`
2. `glCullFace(mode);`
3. `glutInitDisplayMode(...| GLUT_DEPTH);`
4. `glEnable(GL_DEPTH_TEST);`

### Visible Surface Determination

1. Goal
   
      - Given: a set of 3D objects and view specification
      - Determine: those parts of the objects that are visible when viewed along the direction of projection

2. Approaches: object space algorithm and image space algorithm

3. Object Precision Algorithm

   ```c
   for (each object in the world) {
       determine the parts of the object whose view is unobstructed by other parts or any other object;
       draw those parts;
   }
   ```

4. Image Precision Algorithm

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241030081743419.png" alt="image-20241030081743419" style="zoom:50%;" /></div>

5. Back-face Culling: elimination of back-faces

      - 在封闭多边形表面 like surface of a polyhedral volume or a solid polyhedron 很显然地我们看不到背面的部分
      - back face: part of the object surface facing away from the eye
      - Algorithm
        - 找到eye-vector/normal和面之间的角度
        - 如果这个角度在0°~90°，则为背面，剔除

        <div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241030082256102.png" alt="image-20241030082256102" style="zoom:50%;" /></div>

      - 处理不了的情况：

    <div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241030082345595.png" alt="image-20241030082345595" style="zoom:50%;" /><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241030082403142.png" alt="image-20241030082403142" style="zoom: 67%;" /></div>

6. Painter's Algorithm: draw back to front

      - Failure case: 排不出序

      <div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241030082925992.png" alt="image-20241030082925992" style="zoom:50%;" /></div>

      - Warnock's Area Subdivision

        - Start with whole image
        - If one of the easy cases is satisfied, draw what's in front
          - front polygon covers the whole window or
          - there is at most one polygon in the window.
        - Otherwise, subdivide region into 4 windows and repeat 
        - If region is single pixel, choose surface with smallest depth
        - Advantages:
          - No over-rendering 不会重复绘制
          - Anti-aliases well. Go deeper to get sub-pixel information
        - Disadvantages: 不同情况运行效率差距大
          - Tests are quite complex and slow 
          - Not amenable for hardware implementation 不适合做硬件实现

        <div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241030083250075.png" alt="image-20241030083250075" style="zoom: 60%;" /></div>

7. Z-buffer Algorithm

      - 除了一个frame buffer存color值，还需要一个一样size的z-buffer存储depth(z) value

      <div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241030083600767.png" alt="image-20241030083600767" style="zoom:50%;" /></div>

      - Code

      ```c
      for ( j=0; j<SCREEN HEIGHT; j++ )
      for ( i=0; i<SCREEN WIDTH; i++ )
      {
          WriteToFrameBuffer(i, j, BackgroundColor);
          WriteToZBuffer(i, j, MAX);
      }
      for ( each polygon )
      for ( each pixel in polygon's projection )
      {
          z = polygon's z value at (i, j) ;
          if( z< ReadFromZBuffer(i, j) ) {
              WriteToFrameBuffer(i, j, polygon's color at (i, j));
              WriteToZBuffer(i, j, z);
          }
      }
      ```

      - Related OpenGL Functions

      <div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241030085628343.png" alt="image-20241030085628343" style="zoom: 67%;" /></div>

8. BSP Tree: 对画家算法很有效，帮助找到前后顺序。树可以预先计算

      - Very efficient for a static group of 3D polygons as seen from an arbitrary viewpoint

      - Correct order for Painter's algorithm is determined by a traversal of the binary tree of polygons

        <div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241030090529523.png" alt="image-20241030090529523" style="zoom:50%;" /><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/16e255bf8e200f806c7a7e0a2865a170.png" alt="img" style="zoom:50%;" /></div>

      - Pros

        - simple, elegant scheme
        - only write to framebuffer

      - Cons

        - 需要较为繁琐的预处理过程，适用于静态场景
        - splitting会增大场景中多边形数量

9. k-d Tree

10. Ray Casting

## Aliasing

1. Aliasing是由于display设备的离散性，如用一些有限性采样连续信号，如果采样不充分，信息就会丢失
2. 影响：jagged edges(锯齿), incorrectly rendered fine details, small objects might miss(有些细节没采样到)

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241030092703824.png" alt="image-20241030092703824" style="zoom:50%;" /></div>

### Anti-aliasing

1. Super-sampling：增加采样率
2. 低通滤波：滤去高频部分
3. Area sampling: Intensity of the boundary pixels is adjusted depending on the percent of the pixel area covered by the primitive.