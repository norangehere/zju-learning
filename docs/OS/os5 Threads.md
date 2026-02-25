# Threads

- Multiple **execution units** with a process
- 栈和pc不能共享

<div align="center"><img src="https://cdn.hobbitqia.cc/20231031101720.png" alt="img" style="zoom: 33%;" /></div>

## Definition

- **A thread is a basic unit of execution within a process.**
  
  - Each thread has its own
    - thread ID
    - program counter
    - register set
    - **Stack**
- It shares the following with other threads within the same process
  - code section
  - data section
  - the heap (dynamically allocated memory): 通过指针访问，不在cache里比较慢
  - open files and signals

- **Concurrency: A multi-threaded process can do multiple things at once**

- Advantages of Threads

  - Economy

    - **Creating a thread is cheap**

      如果已经有了一个线程，那么我们创建新的线程只需要给它分配一个栈。Code，data，heap 都已经在内存里分配好了。

    - Context switching between threads is cheap

      Cache is hot, no need to cache flush.  

  - Resource Sharing  Threads naturally share memory

    不需要 IPC。

    - Having concurrent activities in the same address space is very powerful

  - Responsiveness

  如在 web server 中，一个线程在等待 I/O，当有请求来时就再分配一个线程去处理。（进程也可以，但是代价更大）

  - **Scalability**

    - multi-core machine

- Drawbacks of Threads

  - **weak isolation** between threads

    如果有一个线程出错，那么整个进程都会出错。 lead to process-based concurrency

  - thread间没有隔离，保护措施不够

- Typical challenges of multi-threaded programming

  - Deal with data dependency and synchronization
  - Dividing activities among threads
  - Balancing load among threads
  - Split data among threads
  - Testing and debugging

## User Threads vs. Kernel Threads

如果内核不知道你这个 user thread，完全在 user space 执行，就是 user space-based thread; 如果内核知道你这个 user thread，就是 kernel-based thread。

- Many-to-One Model

  - 优点：multi-threading is efficient and low-overhead.
  - 缺点：内核只有一个线程，无法发挥 multi-core 的优势；一旦一个线程被阻塞，其他线程也会被阻塞。

  <div align="center"><img src="https://cdn.hobbitqia.cc/20231031103409.png" alt="img" style="zoom:33%;" /></div>

- One-to-One Model

  把线程的管理变得很简单，管理很简洁，现在 Linux，Windows 都是这种模型。硬件便宜了

  缺点：**overhead**大

  <div align="center"><img src="https://cdn.hobbitqia.cc/20231031103523.png" alt="img" style="zoom:33%;" /></div>

- Many-to-Many Model

  m to n 线程，折中。缺点是太复杂。

  <div align="center"><img src="https://cdn.hobbitqia.cc/20231031103647.png" alt="img" style="zoom:33%;" /></div>

- Two-Level Model

可以选择 many to many 或者 one to one。

<div align="center"><img src="https://cdn.hobbitqia.cc/20231031103741.png" alt="img" style="zoom:33%;" /></div>

1. implementation

   - Java Threads / Kernel Threads: In modern JVMs, application threads are *mapped* to kernel threads

     <div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241022134950935.png" alt="image-20241022134950935" style="zoom:50%;" /></div>

## Threading Issues

1. Semantics of `fork()` and `exec()`

如果一个线程调用了 `fork()`，可能发生两种情况：只复制调用线程，或者复制所有线程。

Some OSes provide both options. In Linux the first option above is used

因为大部分时候 `fork` 之后会接 `exec`，抹掉所有的数据，因此直接复制调用线程就可以了。

2. Signals

- multiple options: signal给调用线程/所有线程/certain线程/指定一个线程接收所有signal

- Linux实现：提供多个接口自己选 dealing with threads and signals is tricky but well understood with many tutorials on the matter and man pages


3. Safe Thread Cancellation

- 可能出现问题：取消了一个正在工作的线程
- two approach
  - Asynchronous cancellation：立即终止
    - problem: 可能会导致inconsistent state或synchronization problem，Absolutely terrible bugs lurking in the shadows
  - Deferred cancellation: A thread periodically checks whether it should terminate 线程会自己进行周期性检查，如果取消掉不会影响系统的稳定性，就把自己取消掉。
    - problem: the code is cumbersome due to multiple cancellation points
- Invoking thread cancellation requests cancellation, but actual cancellation depends on thread state

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241022135606658.png" alt="image-20241022135606658" style="zoom: 33%;" /></div>

## Linux Threads

In Linux, a thread is also called a light-weight process (LWP)

The `clone()` syscall is used to create a thread or a process

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241022141424657.png" alt="image-20241022141424657" style="zoom: 67%;" /></div>

TCB 用来存储线程的信息，Linux 并不区分 PCB 和 TCB，都是用 `task_struct` 来表示。

- single-threaded process vs multi-threaded process.
  - 共享内容：通过指针指对应结构体

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241022142033544.png" alt="image-20241022142033544" style="zoom: 33%;" /></div>

- PID 如果和 LWP 相同，说明这个进程只有这一个线程。如果不相同，说明进程有多个线程，此时进程的 PID 是主线程的 LWP。

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241022142808428.png" alt="image-20241022142808428" style="zoom:45%;" /></div>

- A process is
  - either a single thread + an address space, PID is thread ID
  - or multiple threads + an address space, PID is the leading thread ID

- Threads with Process – What is shared
  - `mm_struct` is shared, `task_struct`, `pid`, `stack` and `comm` are not shared.

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241022142625695.png" alt="image-20241022142625695" style="zoom: 67%;" /><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241022142630493.png" alt="image-20241022142630493" style="zoom:50%;" /></div>

- One task in Linux
  - Same task_struct (PCB) means same thread
    - One user thread maps to one kernel thread
    - But actually, they are the same thread
  - Can be executed in user space: User code, user space stack
  - Can be executed in kernel space: Kernel code, kernel space stack

例如我们使用了一个系统调用，线程切换到内核模式，相当于是用户线程对应的内核线程在执行，此时就使用内核空间的栈。

- example

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241022144552903.png" alt="image-20241022144552903" style="zoom:50%;" /></div>

