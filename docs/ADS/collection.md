## 1 AVL, Splay, Amortized Analysis

![](image-20240420151142158.png)

![image-20240420153752941](image-20240420153752941.png)

> - push，cost为1
> - pop，若B不为空，cost为1，若B为空，则cost为$2|S_A|+1$，因为需要把A中所有都从A中pop出来，push进B，因此选D，这样对每一个pop操作，$c_i+\phi_{i+1}-\phi_i$都一样

<img src="image-20240422090443341.png" alt="image-20240422090443341" style="zoom:50%;" />

<img src="image-20240422092305597.png" alt="image-20240422092305597" style="zoom:50%;" />

> 注意看选项，有细微区别

## 2 Red-Black Tree, B+ Tree

<img src="image-20240422092124257.png" alt="image-20240422092124257" style="zoom:50%;" />

> 定义中$n_0=1$，因此empty应对应高度-1，在此基础才可以运用公式
>
> Fib: $F_0=0,F_1=1,F_2=1,F_3=2$

## 3 倒排索引

![image-20240419231948896](image-20240419231948896.png)

<img src="image-20240420151159137.png" alt="image-20240420151159137" style="zoom:50%;" />

![image-20240421001803539](image-20240421001803539.png)

## 4 Leftist Heap, Skew Heap

![image-20240420180936253](image-20240420180936253.png)

![image-20240421000639438](image-20240421000639438.png)

![image-20240422214552953](image-20240422214552953.png)

> 选D，看加粗部分

<img src="image-20240422214915109.png" alt="image-20240422214915109" style="zoom:67%;" />

> A worst-case是$O(N)$

## 5 Binomial Queue



## 6 Backtracking

![image-20240420134518998](image-20240420134518998.png)

> **Answer**
>
> 考虑在当前情况下，两方能赢连线有几种
>
> <img src="image-20240420144926150.png" alt="image-20240420144926150" style="zoom: 50%;" />
>
> 这里画出来的是最终情况下，若赢对应赢的方式，因此3-3=0

## 7 分治

![image-20240420140353189](image-20240420140353189.png)

![image-20240422214659161](image-20240422214659161.png)

## 8 Dynamic Programming

![image-20240420235301170](image-20240420235301170.png)

![image-20240421001014285](image-20240421001014285.png)

## 10 P & NP

<img src="images/image-20240618223636190.png" alt="image-20240618223636190" style="zoom:67%;" />

## 12 Local Search

<img src="images/image-20240619001453755.png" alt="image-20240619001453755" style="zoom:50%;" />

Greedy是不断前进，最后达到解。而local search是不断修改值，选择一个最佳的解。求出的每一个解都是最终的解。