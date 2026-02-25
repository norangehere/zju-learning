# 2 Value Estimation

## Monte-Carlo methods

> 基于随机采样和统计的方法

1. 回顾
   $$ V^{\pi}(s)=E[R(s_0)+\gamma R(s_1)+\gamma^2R(s_2)+\cdots|s_0=s,\pi] $$

   $$ =E[G_t|s_0=s,\pi]\approx\dfrac{1}{N}\sum_{i=1}^{N}G_t^i $$

2. 具体实现

      - 对每一回合中时间t步时的状态s

      <div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20240702104038274.png" alt="image-20240702104038274" style="zoom: 33%;" /> </div>

      - 整理为增量更新:

      $$ N(s_t)\leftarrow N(s_t)+1 $$

      $$ V(s_t)\leftarrow V(s_t)+(G_t-V(s_t))/N(s_t) $$

      - 对非平稳环境，即环境动态会随时间发生变化，蒙特卡洛方法可以跟踪一个滑动窗口内的平均值

      $$
      V(s_t)\leftarrow V(s_t)+\alpha(G_t-V(s_t))
      $$

3. 总结：
      - 直接从经验回合进行学习，不需要模拟/搜索
      - 模型无关（model-free），无需环境信息
      - 核心思想简单直白：value = mean return
      - 使用完整回合进行更新：只能应用于有限长度的马尔可夫决策过程，即所有的回合都应有终止状态

## 时序差分

1. 基本特点和定义
      - $$ G_t=R_{t+1}+\gamma R_{t+2}+\cdots+\gamma_{T-1}R_T=R_{t+1}+\gamma V(s_{t+1}) $$ 是 $V^\pi$的有偏估计
      - $$ V(s_t)\leftarrow V(s_t)+\alpha(R_{t+1}+\gamma V(s_{t+1})-V(s_t)) $$
      - 能够直接使用经验回合学习，同样也是模型无关的，结合了自举(bootstrapping)，能从不完整的回合中学习。通过更新当前预测值，使之接近估计出来的累计奖励，而非真实累计奖励，能够在每一步之后进行在线学习，能够应用于无限长度的马尔可夫决策过程

2. 时序差分目标具有更低的方差，这是因为
      - 累计奖励取决于多步随机动作、状态转移和奖励
      - 时序差分取决于单步随机动作、状态转移和奖励

## 资格迹

- 多步时序差分方法 $V(s_t)\leftarrow V(s_t)+\alpha(G_t^n-V(s_t))$

- 资格迹通常使用一个超参数$\lambda\in[0,1]$控制，$\lambda=1$等价于蒙特卡罗，$\lambda=0$等价于时序差分

- 常见的：$TD-\lambda, G_t^n=R_{t+1}+\gamma R_{t+2}+\cdots+\gamma^{n-1}R_{t+n}+\gamma^n V(s_{t+n})=(1-\lambda)\sum_{n=1}^\infty\lambda^{n-1}G_t^n$
    - 前向视角：朝着$G_t^n$方向更新值函数，同时通过观测未来数据计算，只能计算完整回合
    - 后向视角：对每个状态s保持资格迹，更新每个状态s的价值函数，与TD-error和资格迹$E_t(s)$成比例关系

## 表格型时序差分方法

### SARSA

1. 策略评估：

$$
Q(s_t,a_t)\leftarrow Q(s_t,a_t)+\alpha(R_{t+1}+\gamma Q(s_{t+1},a_{t+1})-Q(s_t,a_t))
$$

2. 策略改进：$\epsilon$-greedy

3. on-policy TD control使用当前策略进行动作采样，即SARSA算法中的两个动作A都是由当前策略选择的

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20240702105724678.png" alt="image-20240702105724678" style="zoom:67%;" /> </div>

### Q-learning

1. 状态动作值函数$Q(s,a)\in R$，一种离线策略(off-pilicy)方法
   $$
   Q(s_t,a_t)=\sum_{t=0}^T R(s_t,a_t),a_t \sim \mu(s_t)
   $$
   迭代式：
   $$
   Q(s_t,a_t)=R(s_t,a_t)+\gamma Q(s_{t+1},a_{t+1})
   $$

2. 离线策略：

      - 目标函数$\pi(a_t|s_t)$进行值函数评估
      - 行为策略$\mu(a_t|s_t)$收集数据
      - 离线：平衡探索和利用

3. 具体实现：

 <div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20240702110402180.png" alt="image-20240702110402180" style="zoom:50%;" />
<img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20240702110509621.png" alt="image-20240702110509621" style="zoom:50%;" />
     <img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20240702110611569.png" alt="image-20240702110611569" style="zoom:50%;" /> </div>


4. 定理：Q-learning可以收敛到最优状态-动作值函数
   $$
   Q(s_t,a_t)\rightarrow Q^*(s_t,a_t)
   $$

   > 定理证明 by 收缩算子、无穷范数 （真看不进去）
   >
   > - 定义H算子 
   >   $$
   >   HQ(s_t,a_t)=R_t +\gamma E_{s_{t+1}\sim p(\cdot|s,a)}[\max_{a'}Q(s_{t+1},a_{t+1})]
   >   $$
   >
   > - 最优值函数$Q^*$是$H$的不动点，意味着$Q^*=HQ^*$
   >
   > <div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20240702111114334.png" alt="image-20240702111114334" style="zoom: 50%;" /> </div>
   >
   > - 由数列收敛的柯西定理得证