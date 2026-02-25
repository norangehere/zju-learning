# Geometric Transformations

## Transformation

> As all objects are eventually represented using points, it is sufficient to know how to transform points.

1. Translation: a rigid body transformation, translation or shift vector $(T_x,T_y,T_z)$

2. Scaling: Scale factor $(S_x,S_y,S_z),x\rightarrow x*S_x$
   
      - 缩放是以原点为中心的缩放，缩放前后物体中心会变化，除非物体中心在原点。是对整个空间的缩放
      - 不改变中心的缩放：将中心先移动到原点再缩放再平移回去

3. Rotation: also a rigid body transformation

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241009083340875.png" alt="image-20241009083340875" style="zoom:50%;" /></div>

   - rotate around $(x_r,y_r)$:先平移将参考点移动到原点，再旋转，再平移回去

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241009083732693.png" alt="image-20241009083732693" style="zoom:50%;" /></div>

1. Shearing: produce shape distortions
   
      - shearing in x-direction: $x\rightarrow x+ay,y\rightarrow y,z\rightarrow z$

2. General Linear Transformation: 用矩阵统一表示上述变换
   
      - homogeneous coordinates: $(x,y,z,w)$ represents $(x/w,y/w,z/w)$ in Cartesian coordinates

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241009084935784.png" alt="image-20241009084935784" style="zoom:50%;" /></div>

1. Matrix Notations and Representations
   
      - column vector $P_h$ represents point $P(x,y,z)$
      - a transformation is represented by a $4\times 4$ matrix $M$
      - 可以用一个矩阵来表示要完成的变换（因为每次变换矩阵相乘也是相同规模的）

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241009085253407.png" alt="image-20241009085253407" style="zoom:50%;" />
    <img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241009085307971.png" alt="image-20241009085307971" style="zoom:50%;" />
</div>

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241009085346004.png" alt="image-20241009085346004" style="zoom:50%;" />
<img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241009085446084.png" alt="image-20241009085446084" style="zoom:50%;" />
<img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241009085528689.png" alt="image-20241009085528689" style="zoom:50%;" /></div>

- 注意以y为转轴时的符号

1. Rotation about an arbitrary axis

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241009090632276.png" alt="image-20241009090632276" style="zoom:50%;" /><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241009090705392.png" alt="image-20241009090705392" style="zoom:60%;" /></div>

8. Quaternion:四元数

## Transformations in OpenGL

1. The transformation matrices appear in reverse order to that in which the transformations are applied. In OpenGL, the transformation specified most recently is the one applied first.

2. Matrix Stacks
   
      - `glPushMatrix(void);`
      - `glPopMatrix(void);`

## Non-linear tranformation

- No Distortion
- Barrel Distortion
- Pincushion Distortion

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241023001732702.png" alt="image-20241023001732702" style="zoom: 80%;" /></div>