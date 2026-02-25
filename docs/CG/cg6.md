# Viewing in 2D & 3D

## 2D Viewing

1. world is infinite but screen is finite.
2. 通过appropriate transformation可以得到通过screen看到的window

### Window

1. rectangular region, specified by a center `(xCenter, yCenter)` and size `windowSize	`
2. Screen referred to as Viewport is a discrete matrix of pixels specified by size `screenSize (in pixels)`
3. Mapping the 2D world seen in the window onto the viewport is 2D viewing transformation, also called window-to-viewport transformation.
   
      -  注意对image，x轴正向朝右，y轴正向朝下，而2D world中y轴正向朝上，因此在缩放时要加一个负号

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241023082718628.png" alt="image-20241023082718628" style="zoom:50%;" /><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241023082928371.png" alt="image-20241023082928371" style="zoom:50%;" /><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241023082954229.png" alt="image-20241023082954229" style="zoom:50%;" /><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241023083006043.png" alt="image-20241023083006043" style="zoom:50%;" /></div>

4. Aspect Ratio: 保高/保宽

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241023083410091.png" alt="image-20241023083410091" style="zoom: 60%;" /></div>

5. OpenGL Commands

       1. `gluOrtho2D( left, right, bottom, top ) `: Creates a matrix for projecting 2D coordinates onto the screen

       2. `glViewport(x, y, width, height)`: Define a rectangle of pixels onto which the final image is mapped.

               - `(x, y)` specifies the lower-left corner of the viewport.

               - `(width, height)` specifies the size of the viewport rectangle.

6. Modeling v.s. Viewing
   
      - Modeling变换改变了world中放置的物体，会改变场景
      - Viewing变换仅仅移动了相机，不改变场景

## 3D Viewing

> To display a 3D world onto a 2D screen	
>
> - Specification becomes complicated because there are many parameters to control
>
> - Additional task of reducing dimensions from 3D to 2D (projection)
>
> - 3D viewing is analogous(类似) to taking a picture with a camera

1. PRP: Projection Reference Point = Eye Position

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241023085403993.png" alt="image-20241023085403993" style="zoom: 50%;" /></div>

2. Persepective Projection: Foreshortening depends on distance from viewer 不能用来测量	

3. Engineering Viewing, Parallel Projection: DOP, Direction of Projection = Eye position at infinity

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241023090056922.png" alt="image-20241023090056922" style="zoom:50%;" /></div>

4. Oblique Projection(斜平行)
   
      - Projectors make an arbitrary angle with the projection plane	
      - Angles in planes parallel to the projection plane are preserved

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241023090648765.png" alt="image-20241023090648765" style="zoom: 50%;" /></div>

5. View Specification

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241023090904523.png" alt="image-20241023090904523" style="zoom: 60%;" /></div>

- 通过一个绝对的upVector进行正交化得到一个和viewDirection垂直的向量

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241023091145228.png" alt="image-20241023091145228" style="zoom: 67%;" /></div>

6. world-to-view transformation or view orientation matrix: 将世界坐标系变换到相机坐标系

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241023091852623.png" alt="image-20241023091852623" style="zoom: 60%;" /></div>

7. Perspective Projection
      - prp: projection reference point or cop: center of projection

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241023092205744.png" alt="image-20241023092205744" style="zoom:60%;" /></div>

8. View Window

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241023092345942.png" alt="image-20241023092345942" style="zoom:60%;" /></div>

9. Perspective Viewing

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241023092408118.png" alt="image-20241023092408118" style="zoom:65%;" /></div>

10. Parallel Viewing

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241023092440059.png" alt="image-20241023092440059" style="zoom:60%;" /></div>

11. View Volume: 在此以外的内容看不到，不用考虑

    - Perspective projection

      <div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241023092539196.png" alt="image-20241023092539196" style="zoom:50%;" /></div>

    - Parallel projection

      <div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241023092730773.png" alt="image-20241023092730773" style="zoom:50%;" /></div>

### Complete View Specification

1. Specification in world coordinates	
   
      - position of viewing (**vrp**), direction of viewing(-**n**),
      - up direction for viewing (**upVector**)	

2. Specification in view coordinates	
   
      - view window : center (**cx, cy**), **width** and **height**,	
      - **prp** : distance from the view plane,
      - front clipping plane : distance from view plane
      - back clipping plane : distance from view plane

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241023093047136.png" alt="image-20241023093047136" style="zoom: 50%;" /></div>