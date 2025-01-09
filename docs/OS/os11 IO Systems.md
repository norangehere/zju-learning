# I/O Systems

## Overview

I/O management is a major component of OS design and operation.

- important aspect of computer operation

- I/O devices vary greatly

  IO 设备差异很大，如网卡、鼠标键盘、显示器。

- new types of devices frequently emerge

> 手机的CPU和内存装到电脑上还能用

下图里除了处理器和内存，均是外设。

<div align="center"><img src="https://cdn.hobbitqia.cc/20231215161329.png" alt="img" style="zoom: 25%;" /></div>

## I/O Hardware

Common concepts: signals from I/O devices interface with computer

- **bus** 用来做设备和 CPU 的互连。
- **port**: connection point for device
- **controller**: usually contains processor, microcode, private memory, bus controller, etc

I/O access can use **polling** or **interrupt**.

- polling: IO主动向CPU发请求，CPU中断

> 操作系统空闲的时候在等event(interrupt和exception也算event)
>
> timer interrupt：减少时间片，减到0 schedule

- Some CPU architecture has **dedicated I/O instructions**.

  如 x86 里有 `in`, `out`。

- Devices usually provide registers for data and control I/O of device

  - Registers include data-in/data-out, status, control or command register

- Devices are assigned addresses for registers or on-device memory

  - direct I/O instructions

    扩展性差，现在使用的少。

  - memory-mapped I/O

    把外设映射到内存地址空间，这样就可以用内存访问指令来访问外设。

### Polling

CPU 主动询问设备，是否需要服务。

For each I/O operation:

- busy-wait if device is busy (status register)
  - Cannot accept any command if busy
- send the command to the device controller (command register)
- read status register until it indicates command has been executed
- read execution status, and possibly reset device status

Polling requires busy wait.
busywait 需要锁，会 sleep。所以如果设备很快那么轮询是合理的；如果设备很慢那么会很低效。

> spinlock也有busy waiting
>
> 解决busy waiting: yield -> moving from running to sleeping

解决busy waiting

### Interrupts

Interrupts can avoid **busy-wait**

cpu中call device的线程(t1 for example)进入device的waiting queue，然后cpu切换到其他线程，等device执行完后给cpu发一个interrupt，同时把t1加入cpu的ready queue

- device driver (part of OS) send a command to the controller (on device), and return
- OS can schedule other activities
- device will interrupt the processor when command has been executed
- OS retrieves the result by handling the interrupt

Interrupt-based I/O requires context switch at start and end.
如果中断发生的频率很高，那么上下文切换会浪费很多 CPU 时间。

- 下图虚线中CPU在执行其他线程

<div align="center"><img src="https://cdn.hobbitqia.cc/20231215162531.png" alt="img" style="zoom: 33%;" />

- Interrupt is also used for exceptions
  - protection error for access violation
  - page fault for memory access error
  - software interrupt for system calls
- Multi-CPU systems can process interrupts concurrently
  - sometimes a CPU may be dedicated to handle interrupts
  - interrupts can also have CPU affinity

### SMP IRQ Affinity

- It allows you to restrict or repartition the work load that you server must do so that it can more efficiently do it's job.
  - "balance" out multiple NiCs in a multi-processor machine. By tying a single NIC to a single CPU, you should be able to scale the amount of traffic your server can handle nicely.

### Direct Memory Access

**DMA** transfer data directly between I/O device and memory.

GPU/NPU/TPU等XPU 访问内存也算 DMA，只要不经过 CPU 就算。

- device driver在CPU上跑，所有的controller都是在设备上跑的
- 第2步使用syscall ioctl

<div align="center"><img src="https://cdn.hobbitqia.cc/20231215163421.png" alt="img" style="zoom: 33%;" /></div>

## Application I/O Interface

I/O **system calls** encapsulate(封装) device behaviors in generic classes.

- in Linux, devices can be accessed as **files**; low-level access with **`ioctl`**.

  抽象成file，因为read和write的第一个参数是fd，这样所有内容都可以用read和write读了

Device-driver layer hides differences among I/O controllers from kernel.

<div align="center"><img src="https://cdn.hobbitqia.cc/20231215163648.png" alt="img" style="zoom:33%;" /></div>

Devices vary in many dimensions

<div align="center"><img src="https://cdn.hobbitqia.cc/20231215163807.png" alt="img" style="zoom:33%;" /></div>

设备可以被大致分为：

- Block and Character Devices

  以块为单位访问数据。支持 read, write, seek 操作。可以通过内存映射访问，也有 DMA。

  其中 character I/O 指逐个字节传输（Stream）。

- Network Devices: **socket**

- Clocks and Timers: provide current time, elapsed time, timer.

- memory-mapped file access

Synchronous/Asynchronous I/O

- **Synchronous I/O** includes blocking and non-blocking I/o

  -  **blocking I/O**: process suspended until I/O completed

  -  **non-blocking I/O**: I/O calls return **as much data as available**

-  **Asynchronous I/O**: process runs while I/O executes, 

  -  I/O subsystem signals process when I/O completed via signal or callback

## Kernel I/O Subsystem

- I/O scheduling

- Buffering - store data in memory while transferring between devices.

- Caching: hold a copy of data for fast access.

- Spooling: A spool is a buffer that holds the output (device’s input) if device can serve only one request at a time.

- Device reservation: provides exclusive access to a device.

- OS needs to protect I/O devices.

  - keystrokes can be stolen by a keylogger if keyboard is not protected

    通过键盘输入获取密码

- to protect I/O devices

  - define all I/O instructions to be privileged
    - I/O must be performed via system calls
  - memory-mapped I/O and I/O ports must be protected too

- kernel data structures
  - Kernel keeps state info for I/O components
    - e.g., open file tables, network connections, character device state
  - Some OS uses message passing to implement I/O, e.g., Windows
    - message with I/O information passed from user mode into kernel
    - message modified as it flows through to device driver and back to process

<div align="center"><img src="https://cdn.hobbitqia.cc/20231215164252.png" alt="img" style="zoom: 33%;" /></div>

## I/O Requests to Hardware

- **System resource** access needs to be mapped to hardware

  <div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241204162651181.png" alt="image-20241204162651181" style="zoom: 25%;" /></div>

## Performance

I/O is a major factor in system performance

比如磁盘很慢，开机很耗时间

### Improve Performance

- Reduce number of context switches
- Reduce data copying
- Reduce interrupts by using large transfers, smart controllers, polling
- Use DMA
- Use smarter hardware devices
- Balance CPU, memory, bus, and I/O performance for highest throughput
- Move user-mode processes / daemons to kernel threads

## Linux IO 

1. Device initialization 需要先注册，注册的时候会把设备对应正确的读写操作的函数也给初始化

   - /dev/tty
     - tty_init
     - create /dev/tty file

   <div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241204163150625.png" alt="image-20241204163150625" style="zoom: 33%;" /></div>

2. Device write: Write (echo) to the file reach vfs_write, which eventually calls tty_write

