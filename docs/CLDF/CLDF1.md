# Chapter 1 Logic and Digital System

## Digital & Computer Systems

1. 通过一系列离散输入和离散中间信息（如：门），生成一系列离散输出

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20240102190721247.png" alt="image-20240102190721247" style="zoom:50%;" /></div>

2. 数字电路：输出在限定范围内可取连续值

## Types of Digital Systems

1. No state present(不存在状态): combinational logic system, output=Function(input) 组合逻辑电路

2. State present: 时序电路

- state updated at discrete times -> synchronous sequential system 通常随系统时钟
- state updated at any time -> asynchronous（异步） sequential systeam

3. state = Function(state,input)

4. output = Function(state) or Function(state,input)

- `e.g`：digital computer: synchronous,组频

- `beyond`：embedded systems（嵌入式系统）：计算机作为一种内部器件包含在其他产品之中

  - analog signal，need A-to-D(digital) and D-to-A
  - analog signal- continuous voltage- sample（采样）- digital voltage - DAC - discrete voltage - signal conditioning - continuous voltage

  <div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20240102191102098.png" alt="image-20240102191102098" style="zoom:50%;" /></div>

## Information representation

在数字系统中，值离散变化

1. - analog: continuous in value and time

   <div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20240102191540320.png" alt="image-20240102191540320" style="zoom:33%;" /></div>

   - digital: asynchronous 异步: discrete in value,continuous in time; synchronous 同步: discrete in value and time

2. 高低电平

   <div align="center"><img src="https://note.isshikih.top/cour_note/D2QD_DigitalDesign/img/1.png" alt="img" style="zoom: 33%;" /></div>

   - 值得注意的是，在输入和输出中，高低电位接受范围不同，可以发现输入判定范围更大，即**宽进严出**，其目的是为了提高电路在噪音影响下正常表现的能力
   - 同时，图中 HIGH 接受范围和 LOW 接受范围之间存在一段区域称为**未定义**的，或**浮动的**，若输出电平在该区间，那么其认定值将是随机的

   <div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20240104113944978.png" alt="image-20240104113944978" style="zoom:50%;" /></div>

   - 噪音容限是指加到正常输入值上、且不会在电路的输出产生不可预料变化的最大外部噪音电压。
     - **关门电平 $V _{OFF}$ **指使输出电压刚好达到输出转折至额定电平值时的最高输入低电平电压
     - **开门电平 $V _{ON}$** 指使输出电压刚好达到输出转折跃迁至另一状态额定电平值时的最低输入高电平电压
     - 低电平噪声容限：$V _{nL}=V _{OFF} - V _{oL}$
     - 高电平噪声容限：$V _{nH}=V _{oH} - V _{ON}$

3. 二进制抗干扰能力强

4. dynamic RAM: capacitor charge (电容)

5. K($2^{10}$)-M-G-T 每个相差 $2^{10}$

6. - numeric：必须表达一定范围内数字，支持简单且普遍计算，和二进制数值本身有较大关联
   - non-numeric binary codes: e.g.：color， 相对灵活，不需要适配普遍的运算法则，和二进制数值本身未必有关系
     - 灵活性指保证编码映射关系唯一情况下都可以称为合法编码

7. - `'one hot' code 独热码` : you can represent 4 elements in radix r=2 with n=4 digits:`0001,0010,0100,1000`,each digit represents specific element。 只有一位非零
   - `one cold code 独冷码` 与 one hot 对应
   - 好处：决定或改变状态机目前状态成本相对较低，易设计与检测非法行为
   - 缺点：信息表示率较低，非法状态多有效状态少

8. 以下两种表示 0-9 时对称数字互为反码

   - Excess3 Code:余 3 码，即编码为数字加 3，0011 表示 0，0100 表示 1 $\cdots$
     - 3 来自$\frac{16-10}{2}$，也就是 8421 码容量减去需要表示的数量（即 0-9）再除 2，因此这样十进制下能进位两个数在余三码下相加也能进位
     - 但实际上，编码做运算多数情况下没有意义
   - 8，4，-2，-1 Code：后两位分别代表-2，-1

9. Binary Coded Decimal（BCD）：use 8，4，2，1 code，but only represent 0-9

   - example: 13 -> 0001 | 0011
   - application: good for direct interaction to people,like elevator,air conditioner
   - to correct the digit,subtract 10 by adding 6 modulo 16
   - `eg`:13-> 1101 +6 -> 10011 -> 0001 | 0011

10. 用二进制为非数字元素编码（如字符串）,此时可能有编码未被用到，如下图的 100

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20240102193213213.png" alt="image-20240102193213213" style="zoom:50%;" /></div>

10. ASCII: 0 30,A 41,a 61 (in 16 进制)

11. `PARITY BIT Error-Detection Codes`(奇偶检错码)：添加一位（n+1）：odd/even parity：使 n+1 位加起来一共有奇/偶个 1，加在最左侧

12. ASCII 码的传输差错检测与校正：接收方测到一个校验错误就立刻回送 NAK（否认）控制字符；若没检测到错误，就回送 ACK（承认）控制字符。发送端收到 NAK 就立刻重复发送

13. Gray Code：相邻状态只有一位码不一样，渐变过程时不会出现突然变化

- Application: Optical Shaft Encoder，dark represents 0，white represents 1

- 如果传感器位置出现偏移，不在同一直线，用 Gray Code 不会出现错误
  
  <div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image.png" alt="Alt text" style="zoom:50%;" /></div>
