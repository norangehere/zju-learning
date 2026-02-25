# Introduction to OpenGL

> Three stages
>
> - Define Objects in World Space
> - Set Modeling and Viewing Transformations
> - Render the Scene

## How OpenGL Works

- OpenGL is a state machine

- Give orders to set the current state of any one of its internal variables, or to query its current status
- The current state won't change until you explicitly specify a new value
- Each of the system's state variables has a default value

1. OpenGL Primitives

      - GL_POINTS
      - GL_LINES
      - GL_LINE_STRIP
      - GL_LINE_LOOP

      - GL_TRIANGLES
      - GL_QUADS
      - GL_POLYGON
      - GL_TRIANGLE_STRIP
      - GL_TRIANGLE_FAN
      - GL_QUAD_STRIP

> **Sample**
>
> <div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20240922163320794.png" alt="image-20240922163320794" style="zoom: 67%;" /><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20240922163337206.png" alt="image-20240922163337206" style="zoom:67%;" /><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20240922163424525.png" alt="image-20240922163424525" style="zoom:67%;" />
> </div>

1. Command Syntax
   
      - All command names begin with `gl`
      - Constant names are in all uppercase
      - Data types begin with GL
        - `GLfloat onevertex[3]`
      - Most commands end in two characters that determine the data type of expected arguments
        - `glVertex3f`
  
2. `glVertex`

      - `glVertex2f( x, y );`
      - `glVertex3f( x, y, z );`
      - `glVertex4f( x, y, z, w );`
      - `glVertex3fv( a ); // with a[0], a[1], a[2]`

3. building objects from vertices: Specify a primitive mode, and enclose a set of vertices in a glBegin / glEnd block
4. colors
   
      - defined as RGB components from 0.0 to 1.0
      - for background
        - `glClearColor(0.0,0.0,0.0) //black`
        - `glClear(GL_COLOR_BUFFER_BIT)`
      - for objects
        - `glColor3f(1.0,1.0,1.0)`

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20240922164124859.png" alt="image-20240922164124859" style="zoom:67%;" /></div>

1. Polygon Display Modes

      - `glPolygonMode( GLenum face, GLenum mode );`
        - Faces: GL_FRONT / GL_BACK / GL_FRONT_AND_BACK`
        - Modes: GL_FILL / GL_LINE / GL_POINT
        - By default, both the front and back face are drawn filled
      - `glFrontFace( GLenum mode ); `定义多边形的前面方向
        - GL_CCW (default) / GL_CW 默认逆时针
      - `glCullFace( Glenum mode ); `指定要剔除（不渲染）的多边形面
        - GL_FRONT / GL_BACK
      - You must enable and disable culling with `glEnable( GL_CULL_FACE )` or `glDisable( GL_CULL_FACE );` 启用或禁用剔除

2. Drawing Other Objects

      - cylinders, cones and more complex surfaces called NURBS
      - spheres and cubes

3. Structure of GLUT-based Programs

      - rely on user-defined callback functions

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20240922164612416.png" alt="image-20240922164612416" style="zoom:67%;" /></div>

1. Double buffer/Tripple buffer: 隐藏绘图的过程，back buffer画好后与front buffer交换，直接让用户看到画好的
2.  More GLUT
    
        - Additional GLUT fucntions
          - `glutPositionwindow(int x,int y)`
          - `glutReshapewindow(int w,int h)`
        - Additional callback functions

3.  Reshape Callback/Mouse Callback/Keyboard Callback/Idle Callback/Menu Callback