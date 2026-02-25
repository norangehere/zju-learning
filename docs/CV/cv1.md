# Lec.01: Linear Algebra

1. Affine Transformations

      - Affine map = linear map + translation

      $$
      \begin{pmatrix}x'\newline y'\end{pmatrix} = \begin{pmatrix}a&b\newline c&d\end{pmatrix}\cdot\begin{pmatrix}x\newline y\end{pmatrix}+\begin{pmatrix}t_x\newline t_y\end{pmatrix}
      $$

      - Using homogenous coordinates

      $$
      \begin{pmatrix}x'\newline y'\newline 1\end{pmatrix} = \begin{pmatrix}a&b&t_x\newline c&d&t_y\newline 0&0&1\end{pmatrix}\cdot\begin{pmatrix}x\newline y\newline 1\end{pmatrix}
      $$
