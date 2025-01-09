# Security and Protection

## Security is deeply rooted in OS

- OS concept
  - Resource abstractor and allocator
  - Allocation needs control, which is security
- CPU introduced privileged mode
  - Kernel mode vs user mode
- Memory introduced partition and paging for memory isolation
  - Partition - Base and limit
  - Paging - Page table
- IO introduced access control list
  - Permission control

> 为什么一个process无法访问另一个process的内存，因为有page table

1. provide a protection system to computer system resource

2. a computer system must be protected against
   - Unauthorized access by users and
   - Malicious access to system including viruses, worms etc...

3. What are the vulnerabilities

   - Physical vulnerabilities (e.g., computer can be stolen)

   - Natural vulnerabilities (e.g., earthquake)

   - Hardware and Software vulnerabilities (e.g., failures)

   - Media vulnerabilities (e.g., hard disks can be stolen)

   - Communication vulnerabilities (e.g., wires can be tapped)

   - Human vulnerabilities (e.g., insiders)

     Poorly chosen passwords

     Software bugs (non reliability of software)- buffer overflow attacks

## System security evaluation criteria

1. TCSEC(Trusted Computer System Evaluation Criteria)
   - by DoD in 1983
   - Four division 由上往下安全程度增加
     - D-Minimal protection
     - C-Discretionary protection
     - B-Mandatory protection
     - A-Verified protection

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241224142345157.png" alt="image-20241224142345157" style="zoom: 67%;" /></div>

2. ITSEC (Information Technology Security Evaluation Criteria)

3. CC (Common Criteria) 通用标准

4. GB17859 国标

## Concepts in system security

- 可信基(Trusted Computing Base)
  - 为实现计算机系统安全保护的所有安全保护机制的集合
  - 包括软件、硬件和固件(硬件上的软件)
- 攻击面(Attacking Surface)
  - 一个组件被其他组件攻击的所有方法的集合
  - 可能来自上层、同层和底层
- 防御纵深(Defense in-depth)
  - 为系统设置多道防线，为防御增加冗余，以进一步提高攻击难度

- Threat Model
  - Hack -> software
  - Shack -> Limited Hardware
  - Lab -> Unlimited

1. TCB = set of components (hardware, software) that you trust your secrets with

   - TCB越大，越难保证安全
   - TCB should be as simple as possible

   > if you type your password on a keyboard, you are trusting:
   >
   > - the keyboard manufacturer
   > - your computer manufacturer
   > - your operating system
   > - the password library
   > - the application that is checking the password

2. TCB in layered systems
   - Higher levels depend on lower levels, but lower levels do not depend on higher levels
   - Since a component almost always depends upon its lower levels for security, the TCB  usually includes all lower levels.

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241224142715805.png" alt="image-20241224142715805" style="zoom: 67%;" /></div>

3. The attack surface is the number of all possible points, or attack vectors, where an unauthorized user can access a system and extract data. 

   越小越好保护

4. Defense in-depth: multiple layers of security controls (defense) are placed throughout an information technology (IT) system. 

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241224143350841.png" alt="image-20241224143350841" style="zoom: 67%;" /></div>

## Protection - Access Control

1. Access control is an essential element of security that determines who is allowed to access certain data, apps, and resources—and in what circumstances.

### Authentication

Authentication(认证): 验证某个发起访问请求的主体的身份

- 包括知道什么、有什么、是什么
- 进程与用户之间如何绑定？
  - 每个进程的PCB/cred中均包含了uid字段
  - 每个进程都来自于父进程，继承了父进程的uid
  - 用户在登录后运行的第一个进程（shell），初始化uid字段
  - 在Windows下，窗口管理器会扮演类似shell的角色

### Authorization

Authorization(授权)：授予某个身份一定的权限以访问特定的对象

1. Authorization matrix 对象与实体的关系

- Objects = things that can be accessed
- Subjects = things that can do the accessing (users or programs)

2. Role-Based Access Control(RBAC) **基于角色的访问控制**,将用户（人）与角色解耦的访问控制方法

- 用户通过拥有一个或多个角色，间接地拥有权限,"用户-角色"，以及"角色-权限"，一般都是多对多的关系
- 优势：更直观、效率更高、角色与权限之间的关系比较稳定，而用户和角色之间的关系变化相对频繁

3. **POSIX的文件权限**

- 将用户分为三类

  - 文件拥有者、文件拥有组、其他用户组
  - 每个文件只需要用9个bit即可：3种权限（读-写-执行） x 3 类用户

- 何时检查用户权限？

  - 每次打开文件时，进行权限检查和授权
    - open()包含可读/可写的参数，OS根据用户组进行检查
    - 引入fd，记录本次打开权限（授权），作为后续操作的参数

  - 每次操作文件时，根据fd信息进行检查

4. **最小特权级原则：setuid 机制**

- passwd命令如何工作

- 运行 passwd 时使用 root 身份（RBAC的思想）

  - 如何保证用户提权为root后只能运行passwd？
    - 在passwd的inode中增加一个SUID位，使得用户仅在执行该程序时才会被提权，执行完后恢复，从而将进程提权的时间降至最小

  - passwd程序本身的逻辑会保证某一个用户只能修改其自身的密码

- 风险：通常以root身份执行，拥有的权限远超过必要

  - 必要权限：用户能够读写 /etc/passwd 文件中的某一行
  - 实际权限：用户能够访问整个 /etc/passwd 文件，用户（短暂地）拥有root用户的权限

5. Capability(权能)

   - 提供细粒度控制进程的权限 初衷：解决root用户权限过高的问题

   - System needs a **fine-grained** access control

   - 基本的思想是把root的能力拆分，分为几十个小的能力，称为capability

     - 不允许传递，而是在创建进程的时候，与该进程相绑定

   - Linux: 在内核操作中进行权限检查

     - 问题：**CAP_SYS_ADMIN** 占据了1/3的 permission checks

     <div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241224151352350.png" alt="image-20241224151352350" style="zoom:33%;" /></div>

   > **fd与Capability的类似之处**
   >
   > - 文件描述符 fd 可以看做是一类 Capability
   >   - 用户不能伪造 fd，必须通过内核打开文件
   >   - fd 只是一个指向保存在内核中数据结构的"指针"
   >   - 拥有 fd 就拥有了访问对应文件的权限
   >   - 一个文件可以对应不同 fd，相应的权限可以不同
   >
   > - fd 也可以在不同进程之间传递
   >   - 父进程可以传递给子进程（回顾pipe）
   >   - 非父子进程之间可以通过 sendmsg 传递 fd

### Auditing

Auditing: record what users and programs are doing for later analysis

1. **Reference monitor**
   - 是实现访问控制的一种方式
   - 主体必须通过引用（reference）的方式间接访问对象
   - Reference monitor 位于主体和对象之间，进行检查
   - 负责
     - Authentication：确定发起请求实体的身份，**认证**
     - Authorization：确定实体确实拥有访问资源的权限，**授权**
   - 引用监视器机制必须保证其不可被绕过(Non-bypassable)。

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241224152340669.png" alt="image-20241224152340669" style="zoom:50%;" /></div>

2. 自主访问控制（DAC: Discretionary Access Control）
   - 指一个对象的拥有者有权限决定该对象是否可以被其他人访问
3. 强制访问控制（MAC: Mandatory Access Control）
   - 由"系统"增加一些强制的、不可改变的规则

4. MAC与DAC可以结合，此时MAC的优先级更高

## Security

1. 通过内核漏洞

   - 篡改已有代码

   - 注入新的代码

   - 或者跳到用户代码，比如 jump-to-user

   系统控制能力大

   - 可执行新代码

   - 危害大

2. Code injection attack

   - 内核代码注入防护

     - 保护已有代码W^X

     - 硬件支持，杜绝注入：数据不可执行、特权不可执行

   - 通过内核页表来实现

     - 在内核页表设置相应的保护位，实现保护

     - 多数Android设备, 包含Google Pixel

   - 通过隔离环境保护内核页表 **避免bypass**

     - 通过隔离环境，避免内核漏洞影响
     - 硬件支持可信执行环境
     - 实现了纵深防御defense-in-depth

3. code reuse attack

   - Existing code snippet, called *gadget*

   - By changing control data to chain them together

     - Changing return address, termed ROP attack

     - Changing function pointer, termed as JOP attack

   1. Return-oriented programming: Attacker has full control of return address on stack

      > A very simple ROP chain that calculates 0xe+ 0x24−0x2d.  
      >
      > 如果计算出0赋给uid，就得到了root
      >
      > - Result is in the eax register
      >
      > <div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241224153356462.png" alt="image-20241224153356462" style="zoom: 25%;" /></div>

   2. Jump-oriented programming: Corrupt function pointer

      > Following example will leak stack pointer
      >
      > <div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241224154310819.png" alt="image-20241224154310819" style="zoom: 67%;" /></div>

   - 保护返回地址: Stack canary, Randomization, Shadow stack

4. 内核数据攻击

   - 控制数据被保护后，攻击者提出非控制数据攻击
     - 返回地址和函数指针以外的数据
     - 影响关键的安全特性
     - 仅利用非控制数据攻击做到内核提权-2017
   - 非控制数据防护
     - 种类繁杂，难以实行统一有效保护
     - 主流操作系统均缺乏对数据攻击的有效防护

   <div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241224154842379.png" alt="image-20241224154842379" style="zoom:67%;" /></div>