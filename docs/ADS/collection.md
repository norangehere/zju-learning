## 1 AVL, Splay, Amortized Analysis

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20240420151142158.png" style="zoom:67%;" /><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20240420153752941.png" alt="image-20240420153752941" style="zoom:67%;" /></div>

> - push，cost为1
> - pop，若B不为空，cost为1，若B为空，则cost为$2|S_A|+1$，因为需要把A中所有都从A中pop出来，push进B，因此选D，这样对每一个pop操作，$c_i+\phi_{i+1}-\phi_i$都一样

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20240422090443341.png" alt="image-20240422090443341" style="zoom:50%;" /><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20240422092305597.png" alt="image-20240422092305597" style="zoom:50%;" /></div>

> 注意看选项，有细微区别

## 2 Red-Black Tree, B+ Tree

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20240422092124257.png" alt="image-20240422092124257" style="zoom:50%;" /></div>

> 定义中$n_0=1$，因此empty应对应高度-1，在此基础才可以运用公式
>
> Fib: $F_0=0,F_1=1,F_2=1,F_3=2$

## 3 倒排索引

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20240419231948896.png" alt="image-20240419231948896" style="zoom:50%;" /> </div>

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20240420151159137.png" alt="image-20240420151159137" style="zoom:50%;" /></div>

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20240421001803539.png" alt="image-20240421001803539" style="zoom:50%;" /></div>

## 4 Leftist Heap, Skew Heap

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20240420180936253.png" alt="image-20240420180936253" style="zoom:50%;" /></div>

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20240421000639438.png" alt="image-20240421000639438" style="zoom:80%;" /></div>

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20240422214552953.png" alt="image-20240422214552953" style="zoom:67%;" /></div>

> 选D，看加粗部分

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20240422214915109.png" alt="image-20240422214915109" style="zoom:67%;" /></div>

> A worst-case是$O(N)$

## 5 Binomial Queue



## 6 Backtracking

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20240420134518998.png" alt="image-20240420134518998" style="zoom: 60%;" /></div>

> **Answer**
>
> 考虑在当前情况下，两方能赢连线有几种
>
> <div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20240420144926150.png" alt="image-20240420144926150" style="zoom: 50%;" /></div>
>
> 这里画出来的是最终情况下，若赢对应赢的方式，因此3-3=0

## 7 分治

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20240420140353189.png" alt="image-20240420140353189" style="zoom:67%;" /></div>

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20240422214659161.png" alt="image-20240422214659161" style="zoom:67%;" /></div>

## 8 Dynamic Programming

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20240420235301170.png" alt="image-20240420235301170" style="zoom:80%;" /></div>

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20240421001014285.png" alt="image-20240421001014285" style="zoom:80%;" /></div>

## 10 P & NP

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20240618223636190.png" alt="image-20240618223636190" style="zoom:67%;" /></div>

## 12 Local Search

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20240619001453755.png" alt="image-20240619001453755" style="zoom:50%;" /></div>

Greedy是不断前进，最后达到解。而local search是不断修改值，选择一个最佳的解。求出的每一个解都是最终的解。



> 后面摆了qwq