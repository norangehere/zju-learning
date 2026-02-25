# LearnOpenGL

## 入门

### 基本内容

1. 输入控制

```c++
void processInput(GLFWwindow *window)
{
    if(glfwGetKey(window, GLFW_KEY_ESCAPE) == GLFW_PRESS)
        glfwSetWindowShouldClose(window, true);
}

while (!glfwWindowShouldClose(window))
{
    processInput(window);

    glfwSwapBuffers(window);
    glfwPollEvents();
}
```

2. 图元包括: `GL_POINTS`, `GL_TRIANGLES`, `GL_LINE_STRIP`

3. 使用glGenBuffers函数生成一个带有缓冲ID的VBO(Vertex Buffer Objects)对象

    ```C++
    unsigned int VBO;
    glGenBuffers(1, &VBO);
    ```

   顶点缓冲对象的缓冲类型是GL_ARRAY_BUFFER。OpenGL允许我们同时绑定多个缓冲，只要它们是不同的缓冲类型。我们可以使用glBindBuffer函数把新创建的缓冲绑定到GL_ARRAY_BUFFER目标上：

    ```c++
    glBindBuffer(GL_ARRAY_BUFFER, VBO);  
    ```

   从这一刻起，我们使用的任何（在GL_ARRAY_BUFFER目标上的）缓冲调用都会用来配置当前绑定的缓冲(VBO)。然后我们可以调用glBufferData函数，它会把之前定义的顶点数据复制到缓冲的内存中：

    ```c++
    glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);
    ```

   glBufferData是一个专门用来把用户定义的数据复制到当前绑定缓冲的函数。它的第一个参数是目标缓冲的类型：顶点缓冲对象当前绑定到GL_ARRAY_BUFFER目标上。第二个参数指定传输数据的大小(以字节为单位)；用一个简单的`sizeof`计算出顶点数据大小就行。第三个参数是我们希望发送的实际数据。

   第四个参数指定了我们希望显卡如何管理给定的数据。它有三种形式：

      - GL_STATIC_DRAW ：数据不会或几乎不会改变。
      - GL_DYNAMIC_DRAW：数据会被改变很多。
      - GL_STREAM_DRAW ：数据每次绘制时都会改变。

   三角形的位置数据不会改变，每次渲染调用时都保持原样，所以它的使用类型最好是GL_STATIC_DRAW。如果，比如说一个缓冲中的数据将频繁被改变，那么使用的类型就是GL_DYNAMIC_DRAW或GL_STREAM_DRAW，这样就能确保显卡把数据放在能够高速写入的内存部分。

4. `gl_Position`是`vec4`类型的

5. 编译着色器

    ```c++
    const char *vertexShaderSource = "#version 330 core\n"
        "layout (location = 0) in vec3 aPos;\n"
        "void main()\n"
        "{\n"
        "   gl_Position = vec4(aPos.x, aPos.y, aPos.z, 1.0);\n"
        "}\0";
    unsigned int vertexShader;
    vertexShader = glCreateShader(GL_VERTEX_SHADER);
    glShaderSource(vertexShader, 1, &vertexShaderSource, NULL);
    glCompileShader(vertexShader);
    ```

6. 片段着色器

    ```c++
    unsigned int fragmentShader;
    fragmentShader = glCreateShader(GL_FRAGMENT_SHADER);
    glShaderSource(fragmentShader, 1, &fragmentShaderSource, NULL);
    glCompileShader(fragmentShader);
    ```

7. 着色器程序

    ```c++
    unsigned int shaderProgram;
    shaderProgram = glCreateProgram();
    glAttachShader(shaderProgram, vertexShader);
    glAttachShader(shaderProgram, fragmentShader);
    glLinkProgram(shaderProgram);
    // 在glUseProgram函数调用之后，每个着色器调用和渲染调用都会使用这个程序对象
    glUseProgram(shaderProgram);
    // 在把着色器对象链接到程序对象以后，记得删除着色器对象，我们不再需要它们了
    glDeleteShader(vertexShader);
    glDeleteShader(fragmentShader);
    ```

8. 链接顶点属性

    ```c++
    glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 3 * sizeof(float), (void*)0);
    glEnableVertexAttribArray(0);
    ```

    - 第一个参数指定我们要配置的顶点属性。`layout(location = 0)`定义了position顶点属性的位置值(Location)吗？它可以把顶点属性的位置值设置为`0`。因为我们希望把数据传递到这一个顶点属性中，所以这里我们传入`0`。
    - 第二个参数指定顶点属性的大小。顶点属性是一个`vec3`，它由3个值组成，所以大小是3。
    - 第三个参数指定数据的类型。
    - 如果我们设置为GL_TRUE，所有数据都会被映射到0（对于有符号型signed数据是-1）到1之间。我们把它设置为GL_FALSE。
    - 第五个参数叫做步长(Stride)，它告诉我们在连续的顶点属性组之间的间隔。由于下个组位置数据在3个`float`之后，我们把步长设置为`3 * sizeof(float)`。要注意的是由于我们知道这个数组是紧密排列的（在两个顶点属性之间没有空隙）我们也可以设置为0来让OpenGL决定具体步长是多少（只有当数值是紧密排列时才可用）。一旦我们有更多的顶点属性，我们就必须更小心地定义每个顶点属性之间的间隔，我们在后面会看到更多的例子（译注: 这个参数的意思简单说就是从这个属性第二次出现的地方到整个数组0位置之间有多少字节）。
    - 最后一个参数的类型是`void*`，所以需要我们进行这个奇怪的强制类型转换。它表示位置数据在缓冲中起始位置的偏移量(Offset)。

9. 顶点数组对象

    ```c++
    // ..:: 初始化代码（只运行一次 (除非你的物体频繁改变)） :: ..
    // 1. 绑定VAO
    glBindVertexArray(VAO);
    // 2. 把顶点数组复制到缓冲中供OpenGL使用
    glBindBuffer(GL_ARRAY_BUFFER, VBO);
    glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);
    // 3. 设置顶点属性指针
    glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 3 * sizeof(float), (void*)0);
    glEnableVertexAttribArray(0);
    
    // ..:: 绘制代码（渲染循环中） :: ..
    // 4. 绘制物体
    glUseProgram(shaderProgram);
    glBindVertexArray(VAO);
    someOpenGLFunctionThatDrawsOurTriangle();
    ```

10. `glDrawArrays(GL_TRIANGLES, 0, 3);`

11. 元素缓冲对象，索引绘制

    ```c++
    float vertices[] = {
        0.5f, 0.5f, 0.0f,   // 右上角
        0.5f, -0.5f, 0.0f,  // 右下角
        -0.5f, -0.5f, 0.0f, // 左下角
        -0.5f, 0.5f, 0.0f   // 左上角
    };
    
    unsigned int indices[] = {
        // 注意索引从0开始! 这样可以由下标代表顶点组合成矩形
    
        0, 1, 3, // 第一个三角形
        1, 2, 3  // 第二个三角形
    };
    
    unsigned int EBO;
    glGenBuffers(1, &EBO);
    glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, EBO);
    glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(indices), indices, GL_STATIC_DRAW);
    
    glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, EBO);
    glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_INT, 0);
    ```

       - 第二个参数是我们打算绘制顶点的个数，这里填6，也就是说我们一共需要绘制6个顶点。第三个参数是索引的类型，这里是GL_UNSIGNED_INT。最后一个参数里我们可以指定EBO中的偏移量（或者传递一个索引数组，但是这是当你不在使用索引缓冲对象的时候），但是我们会在这里填写0。

12. 最后

       <div align="center"><img src="https://learnopengl-cn.github.io/img/01/04/vertex_array_objects_ebo.png" alt="img"  /></div>

    ```c++
    // ..:: 初始化代码 :: ..
    // 1. 绑定顶点数组对象
    glBindVertexArray(VAO);
    // 2. 把我们的顶点数组复制到一个顶点缓冲中，供OpenGL使用
    glBindBuffer(GL_ARRAY_BUFFER, VBO);
    glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);
    // 3. 复制我们的索引数组到一个索引缓冲中，供OpenGL使用
    glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, EBO);
    glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(indices), indices, GL_STATIC_DRAW);
    // 4. 设定顶点属性指针
    glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 3 * sizeof(float), (void*)0);
    glEnableVertexAttribArray(0);
    
    [...]
    
    // ..:: 绘制代码（渲染循环中） :: ..
    glUseProgram(shaderProgram);
    glBindVertexArray(VAO);
    glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_INT, 0);
    glBindVertexArray(0);
    ```

### 着色器

1. 向量：大多数时候使用`vecn`，float足够了，使用`.x`、`.y`、`.z`和`.w`来获取它们的第1、2、3、4个分量

   | 类型    | 含义                            |
   | :------ | :------------------------------ |
   | `vecn`  | 包含`n`个float分量的默认向量    |
   | `bvecn` | 包含`n`个bool分量的向量         |
   | `ivecn` | 包含`n`个int分量的向量          |
   | `uvecn` | 包含`n`个unsigned int分量的向量 |
   | `dvecn` | 包含`n`个double分量的向量       |

      - 重组：

        ```c++
        vec2 someVec;
        vec4 differentVec = someVec.xyxx;
        vec3 anotherVec = differentVec.zyw;
        vec4 otherVec = someVec.xxxx + anotherVec.yxzy;
        ```

2. 输入与输出

      - 顶点着色器

        ```c++
        #version 330 core
        layout (location = 0) in vec3 aPos; // 位置变量的属性位置值为0
        
        out vec4 vertexColor; // 为片段着色器指定一个颜色输出
        
        void main()
        {
            gl_Position = vec4(aPos, 1.0); // 注意我们如何把一个vec3作为vec4的构造器的参数
            vertexColor = vec4(0.5, 0.0, 0.0, 1.0); // 把输出变量设置为暗红色
        }
        ```

      - 片段着色器

        ```c++
        #version 330 core
        layout (location = 0) in vec3 aPos; // 位置变量的属性位置值为0
        
        out vec4 vertexColor; // 为片段着色器指定一个颜色输出
        
        void main()
        {
            gl_Position = vec4(aPos, 1.0); // 注意我们如何把一个vec3作为vec4的构造器的参数
            vertexColor = vec4(0.5, 0.0, 0.0, 1.0); // 把输出变量设置为暗红色
        }
        ```

3. Uniform

    ```c++
    uniform vec4 ourColor; 
    
    float timeValue = glfwGetTime();
    float greenValue = (sin(timeValue) / 2.0f) + 0.5f;
    // 返回-1就代表没有找到这个位置值
    int vertexColorLocation = glGetUniformLocation(shaderProgram, "ourColor");
    glUseProgram(shaderProgram);
    // 查询uniform地址不要求你之前使用过着色器程序，但是更新一个uniform之前你必须先使用程序（调用glUseProgram)，因为它是在当前激活的着色器程序中设置uniform的
    glUniform4f(vertexColorLocation, 0.0f, greenValue, 0.0f, 1.0f);
   ```

4. 更多属性

    ```c++
    float vertices[] = {
        // 位置              // 颜色
            0.5f, -0.5f, 0.0f,  1.0f, 0.0f, 0.0f,   // 右下
        -0.5f, -0.5f, 0.0f,  0.0f, 1.0f, 0.0f,   // 左下
            0.0f,  0.5f, 0.0f,  0.0f, 0.0f, 1.0f    // 顶部
    };
    
    #version 330 core
    layout (location = 0) in vec3 aPos;   // 位置变量的属性位置值为 0 
    layout (location = 1) in vec3 aColor; // 颜色变量的属性位置值为 1
    
    out vec3 ourColor; // 向片段着色器输出一个颜色
    
    void main()
    {
        gl_Position = vec4(aPos, 1.0);
        ourColor = aColor; // 将ourColor设置为我们从顶点数据那里得到的输入颜色
    }
    
    #version 330 core
    out vec4 FragColor;  
    in vec3 ourColor;
    
    void main()
    {
        FragColor = vec4(ourColor, 1.0);
    }
    
    // 位置属性
    glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 6 * sizeof(float), (void*)0);
    glEnableVertexAttribArray(0);
    // 颜色属性
    glVertexAttribPointer(1, 3, GL_FLOAT, GL_FALSE, 6 * sizeof(float), (void*)(3* sizeof(float)));
    glEnableVertexAttribArray(1);
    ```


### 纹理

1. 每个顶点关联一个纹理坐标，表示从纹理哪一部分采样，其余进行线性插值

2. 默认纹理坐标范围(0,0)到(1,1)。设在范围外默认是重复纹理图像，但还有其他选择

   | 环绕方式           | 描述                                                         |
   | :----------------- | :----------------------------------------------------------- |
   | GL_REPEAT          | 对纹理的默认行为。重复纹理图像。                             |
   | GL_MIRRORED_REPEAT | 和GL_REPEAT一样，但每次重复图片是镜像放置的。                |
   | GL_CLAMP_TO_EDGE   | 纹理坐标会被约束在0到1之间，超出的部分会重复纹理坐标的边缘，产生一种边缘被拉伸的效果。 |
   | GL_CLAMP_TO_BORDER | 超出的坐标为用户指定的边缘颜色。                             |

3. 上述选项可以对单独一个坐标轴设置(2D s,t 3D s,t,r)

    ```c
    // 纹理目标、设置的选项与应用的纹理轴、环绕方式
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_MIRRORED_REPEAT);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_MIRRORED_REPEAT);
    float borderColor[] = { 1.0f, 1.0f, 0.0f, 1.0f };
    glTexParameterfv(GL_TEXTURE_2D, GL_TEXTURE_BORDER_COLOR, borderColor);
    ```

4. 纹理过滤

      - `GL_NEAREST` 邻近过滤，选中心点最接近纹理坐标的像素

      - `GL_LINEAR` 线性过滤，线性插值，更加平滑

      - 在纹理被缩小的时候使用邻近过滤，被放大时使用线性过滤

        ```c++
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
        ```

5. 多级渐远纹理：距观察者的距离超过一定的阈值，OpenGL会使用不同的多级渐远纹理，即最适合物体的距离的那个 `glGenerateMipmap` 

   切换多级渐远纹理级别时你也可以在两个不同多级渐远纹理级别之间使用NEAREST和LINEAR过滤

| 过滤方式                  | 描述                                                         |
| :------------------------ | :----------------------------------------------------------- |
| GL_NEAREST_MIPMAP_NEAREST | 使用最邻近的多级渐远纹理来匹配像素大小，并使用邻近插值进行纹理采样 |
| GL_LINEAR_MIPMAP_NEAREST  | 使用最邻近的多级渐远纹理级别，并使用线性插值进行采样         |
| GL_NEAREST_MIPMAP_LINEAR  | 在两个最匹配像素大小的多级渐远纹理之间进行线性插值，使用邻近插值进行采样 |
| GL_LINEAR_MIPMAP_LINEAR   | 在两个邻近的多级渐远纹理之间使用线性插值，并使用线性插值进行采样 |

同样可以用一样的函数设置

```c++
glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR_MIPMAP_LINEAR);
glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
```

6. 加载与创建纹理

**stb_image.h**

```c++
int width, height, nrChannels;
unsigned char *data = stbi_load("container.jpg", &width, &height, &nrChannels, 0);
// 读取对应文件并将宽度高度颜色通道数填充到对应变量
```

7. 生成纹理

    ```c++
    unsigned int texture;
    glGenTextures(1, &texture); // 第一个参数是生成纹理的数量
    glBindTexture(GL_TEXTURE_2D, texture);
    glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, width, height, 0, GL_RGB, GL_UNSIGNED_BYTE, data);
    // target, 0代表多级渐远纹理的基本级别，纹理储存格式使用RGB，最终纹理的宽度，高度，总应该是0，原图的格式，类型，图像数据
    glGenerateMipmap(GL_TEXTURE_2D);
    stbi_image_free(data);
    ```

> example
>
> ```c++
> unsigned int texture;
> glGenTextures(1, &texture);
> glBindTexture(GL_TEXTURE_2D, texture);
> // 为当前绑定的纹理对象设置环绕、过滤方式
> glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);   
> glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);
> glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
> glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
> // 加载并生成纹理
> int width, height, nrChannels;
> unsigned char *data = stbi_load("container.jpg", &width, &height, &nrChannels, 0);
> if (data)
> {
>     glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, width, height, 0, GL_RGB, GL_UNSIGNED_BYTE, data);
>     glGenerateMipmap(GL_TEXTURE_2D);
> }
> else
> {
>     std::cout << "Failed to load texture" << std::endl;
> }
> stbi_image_free(data);
> ```

8. 应用纹理

    <div align="center"><img src="https://learnopengl-cn.github.io/img/01/06/vertex_attribute_pointer_interleaved_textures.png" alt="img" style="zoom: 80%;" /></div>

    - 声明一个`uniform sampler2D`把一个纹理添加到片段着色器中
    - 使用GLSL内建的texture函数来采样纹理的颜色，它第一个参数是纹理采样器，第二个参数是对应的纹理坐标 `FragColor = texture(ourTexture, TexCoord);`
    - 纹理颜色和顶点颜色混合 `FragColor = texture(ourTexture, TexCoord) * vec4(ourColor, 1.0);`

9. 绑定纹理之前需要先激活纹理单元

    ```c++
    glActiveTexture(GL_TEXTURE0); 
    glBindTexture(GL_TEXTURE_2D, texture);
    ```

10. OpenGL要求y轴`0.0`坐标是在图片的底部的，但是图片的y轴`0.0`坐标通常在顶部，可以通过以下命令在图像加载时帮助我们翻转y轴

    ```c++
    stbi_set_flip_vertically_on_load(true);
    ```

### 变换

1. example

    ```c++
    glm::mat4 trans;
    trans = glm::translate(trans, glm::vec3(1.0f, 1.0f, 0.0f));
    // 首先，我们把箱子在每个轴都缩放到0.5倍，然后沿z轴旋转90度。
    trans = glm::rotate(trans, glm::radians(90.0f), glm::vec3(0.0, 0.0, 1.0));
    trans = glm::scale(trans, glm::vec3(0.5, 0.5, 0.5));
    ```

2. 着色器修改

    ```c++
    #version 330 core
    layout (location = 0) in vec3 aPos;
    layout (location = 1) in vec2 aTexCoord;
    
    out vec2 TexCoord;
    
    uniform mat4 transform;
    
    void main()
    {
        gl_Position = transform * vec4(aPos, 1.0f);
        TexCoord = vec2(aTexCoord.x, 1.0 - aTexCoord.y);
    }
    ```

3. 变换矩阵传递给着色器

    ```c++
    unsigned int transformLoc = glGetUniformLocation(ourShader.ID, "transform");
    // 位置值、发送矩阵数、是否进行转置，一般不需要、矩阵数据
    glUniformMatrix4fv(transformLoc, 1, GL_FALSE, glm::value_ptr(trans));
    ```

### 坐标系统

> 5个不同的坐标系统：
>
> - 局部空间(Local Space，或者称为物体空间(Object Space))
> - 世界空间(World Space)
> - 观察空间(View Space，或者称为视觉空间(Eye Space))
> - 裁剪空间(Clip Space)
> - 屏幕空间(Screen Space)

<div align="center"><img src="https://learnopengl-cn.github.io/img/01/08/coordinate_systems.png" alt="coordinate_systems" style="zoom: 67%;" /></div>

1. 正射投影：前两个参数指定了平截头体的左右坐标，第三和第四参数指定了平截头体的底部和顶部。通过这四个参数我们定义了近平面和远平面的大小，然后第五和第六个参数则定义了近平面和远平面的距离。

    ```c++
    glm::ortho(0.0f, 800.0f, 0.0f, 600.0f, 0.1f, 100.0f);
    ```

2. 透视投影：离观察者越远的顶点坐标w分量越大，距离观察者越远顶点坐标就会越小.

    ```c++
    // fov, 宽高比，近平面，远平面
    glm::mat4 proj = glm::perspective(glm::radians(45.0f), (float)width/(float)height, 0.1f, 100.0f);
    ```

    <div align="center"><img src="https://learnopengl-cn.github.io/img/01/08/perspective_frustum.png" alt=" perspective_frustum" style="zoom: 80%;" /></div>

3. z-buffer

    ```c++
    glEnable(GL_DEPTH_TEST);
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    ```

### 摄像机

> 不要忘记正z轴是从屏幕指向你的，如果我们希望摄像机向后移动，我们就沿着z轴的正方向移动。

1. 摄像机方向

    ```c++
    glm::vec3 cameraTarget = glm::vec3(0.0f, 0.0f, 0.0f);
    glm::vec3 cameraDirection = glm::normalize(cameraPos - cameraTarget);
    ```

2. 右向量：代表摄像机空间的x轴的正方向。为获取右向量我们需要先使用一个小技巧：先定义一个**上向量**(Up Vector)。接下来把上向量和第二步得到的方向向量进行叉乘。两个向量叉乘的结果会同时垂直于两向量，因此我们会得到指向x轴正方向的那个向量

    ```c++
    glm::vec3 up = glm::vec3(0.0f, 1.0f, 0.0f); 
    glm::vec3 cameraRight = glm::normalize(glm::cross(up, cameraDirection));
    ```

3. 上轴：把右向量和方向向量进行叉乘，获取一个指向摄像机的正y轴向量

    ```c++
    glm::vec3 cameraUp = glm::cross(cameraDirection, cameraRight);
    ```

4. LookAt矩阵：注意，位置向量P是相反的，因为我们最终希望把世界平移到与我们自身移动的相反方向
   
$$
LookAt = \begin{bmatrix} \color{red}{R_x} & \color{red}{R_y} & \color{red}{R_z} & 0 \newline \color{green}{U_x} & \color{green}{U_y} & \color{green}{U_z} & 0 \newline \color{blue}{D_x} & \color{blue}{D_y} & \color{blue}{D_z} & 0 \newline 0 & 0 & 0  & 1 \end{bmatrix} * \begin{bmatrix} 1 & 0 & 0 & -\color{purple}{P_x} \newline 0 & 1 & 0 & -\color{purple}{P_y} \newline 0 & 0 & 1 & -\color{purple}{P_z} \newline 0 & 0 & 0  & 1 \end{bmatrix}
$$

5. 我们要做的只是定义一个摄像机位置，一个目标位置和一个表示世界空间中的上向量的向量

    ```c++
    glm::mat4 view;
    view = glm::lookAt(glm::vec3(0.0f, 0.0f, 3.0f), 
                glm::vec3(0.0f, 0.0f, 0.0f), 
                glm::vec3(0.0f, 1.0f, 0.0f));
    ```

6. 自由移动

    ```c++
    glm::vec3 cameraPos   = glm::vec3(0.0f, 0.0f,  3.0f);
    glm::vec3 cameraFront = glm::vec3(0.0f, 0.0f, -1.0f);
    glm::vec3 cameraUp    = glm::vec3(0.0f, 1.0f,  0.0f);
    view = glm::lookAt(cameraPos, cameraPos + cameraFront, cameraUp);
    ```

7. 根据按键移动。如果我们希望向左右移动，我们使用叉乘来创建一个**右向量**(Right Vector)，并沿着它相应移动就可以了。这样就创建了使用摄像机时熟悉的横移(Strafe)效果。

    ```c++
    void processInput(GLFWwindow *window)
    {
        ...
        float cameraSpeed = 0.05f; // adjust accordingly
        if (glfwGetKey(window, GLFW_KEY_W) == GLFW_PRESS)
            cameraPos += cameraSpeed * cameraFront;
        if (glfwGetKey(window, GLFW_KEY_S) == GLFW_PRESS)
            cameraPos -= cameraSpeed * cameraFront;
        if (glfwGetKey(window, GLFW_KEY_A) == GLFW_PRESS)
            cameraPos -= glm::normalize(glm::cross(cameraFront, cameraUp)) * cameraSpeed;
        if (glfwGetKey(window, GLFW_KEY_D) == GLFW_PRESS)
            cameraPos += glm::normalize(glm::cross(cameraFront, cameraUp)) * cameraSpeed;
    }
    ```

8. 欧拉角：包括俯仰角(Pitch), 偏航角(Yaw), 滚转角(Roll)

    <div align="center"><img src="https://learnopengl-cn.github.io/img/01/09/camera_pitch_yaw_roll.png" alt="img" style="zoom:50%;" /></div>

    ```c++
    direction.x = cos(glm::radians(pitch)) * cos(glm::radians(yaw));
    direction.y = sin(glm::radians(pitch));
    direction.z = cos(glm::radians(pitch)) * sin(glm::radians(yaw));
    ```

9. 鼠标输入

    ```c++
    glfwSetInputMode(window, GLFW_CURSOR, GLFW_CURSOR_DISABLED); // 不显示光标
    void mouse_callback(GLFWwindow* window, double xpos, double ypos); // 监听鼠标事件
    glfwSetCursorPosCallback(window, mouse_callback); // 注册回调函数
    ```

10. 加入限制

    ```c++
    if(pitch > 89.0f)
      pitch =  89.0f;
    if(pitch < -89.0f)
      pitch = -89.0f;
    ```

    刚进入屏幕时，获取并设置为初始位置，优化体验

    ```c++
    if(firstMouse) // 这个bool变量初始时是设定为true的
    {
        lastX = xpos;
        lastY = ypos;
        firstMouse = false;
    }
    ```

11. 鼠标缩放

    ```c++
    void scroll_callback(GLFWwindow* window, double xoffset, double yoffset)
    {
      if(fov >= 1.0f && fov <= 45.0f)
        fov -= yoffset;
      if(fov <= 1.0f)
        fov = 1.0f;
      if(fov >= 45.0f)
        fov = 45.0f;
    }
    
    // 更新透视投影矩阵
    projection = glm::perspective(glm::radians(fov), 800.0f / 600.0f, 0.1f, 100.0f);
    //注册回调函数
    glfwSetScrollCallback(window, scroll_callback);
    ```

## 光照

### 颜色

1. 为灯单独创建一套着色器，使得其不受影响

    ```c++
    #version 330 core
    out vec4 FragColor;
    
    void main()
    {
        FragColor = vec4(1.0); // 将向量的四个分量全部设置为1.0
    }
    ```

### 基础光照

1. Phong Lighting Model: 由环境光照(Ambient),漫反射(Diffuse)和镜面光照(Specular)三部分构成

2. 环境光照：简单实现，我们用光的颜色乘以一个很小的环境因子再乘以物体颜色

3. 漫反射光照：需要加入法向量normal

    ```c++
    // 下面仅为计算部分，不包含定义
    vec3 norm = normalize(Normal);
    vec3 lightDir = normalize(lightPos - FragPos);
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = diff * lightColor;
    vec3 result = (ambient + diffuse) * objectColor;
    FragColor = vec4(result, 1.0);
    ```

4. 把法向量也转换为世界空间坐标，使用法线矩阵，为模型矩阵左上角3x3部分的逆矩阵的转置矩阵

5. 镜面光照：这个32是高光的反光度(Shininess)。一个物体的反光度越高，反射光的能力越强，散射得越少，高光点就会越小。

    ```c++
    float specularStrength = 0.5;
    vec3 viewDir = normalize(viewPos - FragPos);
    vec3 reflectDir = reflect(-lightDir, norm);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32);
    vec3 specular = specularStrength * spec * lightColor;
    vec3 result = (ambient + diffuse + specular) * objectColor;
    FragColor = vec4(result, 1.0);
    ```

### 光照贴图

漫反射贴图 Diffuse Map

镜面光贴图 Specular Map

### 投光物

1. 平行光：只需要一个方向向量

2. 衰减：随着光线传播距离的增长逐渐削减光的强度通常叫做衰减(Attenuation)。需要使用常数项、一次项和二次项。下表第一列是采用对应公式时光源可以覆盖的距离

    <div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241209204841529.png" alt="image-20241209204841529" style="zoom:67%;" /></div>

      - 实现

      ```c++
      struct Light {
          vec3 position;  

          vec3 ambient;
          vec3 diffuse;
          vec3 specular;

          float constant;
          float linear;
          float quadratic;
      };

        float distance    = length(light.position - FragPos);
        float attenuation = 1.0 / (light.constant + light.linear * distance + 
                        light.quadratic * (distance * distance));
        ```

1. 聚光：它只朝一个特定方向而不是所有方向照射光线。这样的结果就是只有在聚光方向的特定半径内的物体才会被照亮，其它的物体都会保持黑暗。OpenGL中聚光是用一个世界空间位置、一个方向和一个切光角(Cutoff Angle)来表示的，这里的切光角是圆锥的锥角
      - `LightDir`：从片段指向光源的向量。
      - `SpotDir`：聚光所指向的方向。
      - `Phi`：指定了聚光半径的切光角。落在这个角度之外的物体都不会被这个聚光所照亮。
      - `Theta`：LightDir向量和SpotDir向量之间的夹角。在聚光内部的话值应该比值小。

2. 平滑/软化边缘

    ```c++
    float theta     = dot(lightDir, normalize(-light.direction));
    float epsilon   = light.cutOff - light.outerCutOff;
    float intensity = clamp((theta - light.outerCutOff) / epsilon, 0.0, 1.0);    
    ```

