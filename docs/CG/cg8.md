# Color Theory & Programmable Pipeline

## Color Theory

### What is Color?

- Color is the brain's reaction to a specific visual stimulus
- 观察者的主观感知 subjective sensation experienced by the **observer**
- 取决于光的物理性质、与材料的交互、人类视觉系统和大脑对由此产生的现象的解读

1. Physics of Light

      - Wave Model or Particle Model

      - 通常使用particle model，认为光由光子构成

2. Properties of Light

      - $E=hf$

      - Photon behavior is cyclic and has a repeated pattern

      - $\lambda=\dfrac{c}{f}$

      - Each photon has a wavelength associated with it and the perceived color of light depends on this wavelength

      - 光强取决于present的photon数量

3. Spectral Energy Distribution Curve
      - Human eyes are sensitive to wavelengths in the range 330-770nm

4. Perception of Color
      - spectral sensitivity curves of cones: $r=\int f(x)s(x)dx$

### Color Model

1. RGB
2. CMYK: Cyan/Maagenta/Yellow/Black
3. HSV: Hue/Saturation/Value

## Programming Pipeline

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241106084002338.png" alt="image-20241106084002338" style="zoom: 67%;" /></div>

- Programmable stage: vertex, assembly, fragment 
  - shader

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241106085444212.png" alt="image-20241106085444212" style="zoom: 67%;" /></div>

### GLSL

1. uniform variables: set by the program that can be changed at runtime, but are constant across each execution of the shader

2. attribute variables: properties of a vertex, input of vertex shader
3. varying variables: