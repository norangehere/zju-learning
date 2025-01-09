# Processes

## Concept

- Process: **a unit of resource allocation and protection**

- **A process is a program in execution**

- Thread: unit of execution

- A running system consists of multiple processes

- Process = 前两项在 ELF 中，堆和栈是运行时的信息在 ELF 之外

  ELF编译完成后，里面的.data段就不会变了

  - code (text): initially stored on disk in an executable file
  - data section: global variables
  - program counter: 指向下一条要执行的指令，运行时产生
  - processor's registers
  - a stack 更快 函数内的临时变量在stack
  - a heap: malloc的在heap

## The Stack

- The runtime stack is
  - Items can be pushed or popped
  - The items are called activation records(stack frames)

> **Simple Stack**
>
> <div align="center"><img src="https://cdn.hobbitqia.cc/20231010163732.png" alt="img" style="zoom: 23%;" /></div>

- Any function needs to have some state so it can run

  - Parameters passed to it by whatever function called it

  - Local variables

  - The address of the instruction that should be executed once the function 

    returns: the return address

  - The value that it will return

- 栈从上（高地址）往下（低地址），堆从下往上。如果碰面就发生了溢出(overflow)。

> **2 processes for the same program**
>
> <div align="center"><img src="https://cdn.hobbitqia.cc/20231011204707.png" alt="img" style="zoom: 33%;" /></div>

## Process Control Block(PCB)

- process metadata

- Information associated with each process(also called task control block)
- **Each process has and only has a PCB**, PCB存在内存
  - allocate a PCB on new process creation
  - free PCB on termination
- Process state: running, waiting, new, ready, terminated ...

- Program counter: location of instruction to next execute
- CPU registers: contents of all process-centric registers
- CPU scheduling information: priorities, scheduling queue pointers
- Memory-management information: memory allocated to the process
- Accounting information: CPU used, clock time elapsed since start, time limits
- I/O status information: I/O devices allocated to process, list of open files

<div align="center"><img src="https://cdn.hobbitqia.cc/20231010164638.png" alt="img" style="zoom:33%;" /></div>

用结构体`task_struct`，所有可用块用链表连在一起

## Process State

<div align="center"><img src="https://cdn.hobbitqia.cc/20231010164518.png" alt="img" style="zoom: 40%;" /></div>

### 1. Process Creation

- A process may create new processes, becoming a parent

- process tree

<div align="center"><img src="https://cdn.hobbitqia.cc/20231010165405.png" alt="img" style="zoom: 33%;" /></div>

- `pid` and `ppid`(parent process id)

- The child may inherit/share some of the resources of its parent, or may have entirely new ones 子进程继承父进程的资源（如打开的文件）
- A parent can also pass input to a child

- Upon creation of a child, the parent can either
  - continue execution, or
  - wait for the child’s completion
- The child could be either
  - a clone of the parent (**i.e.**, have a copy of the address space), or
  - be an entirely new program

#### 1.1 The `fork()` System Call

- `fork()` creates a new process
- child is a copy of the parent, but `pid`, `ppid`  are different and resource utilization is set to 0
- return child's `pid` to the parent, and 0 to the child
  - `getpid()`, `getppid()`
- Both processes continue execution after the call to fork()

> What does the following code print?
>
> ```c
> int a = 12;
> pid = fork();
> if (pid) { // PARENT
>         // ask the OS to put me in waiting
>         sleep(10);
>         fprintf(stdout,”a = %d\n”,a);
>     while (1);
> } else { // CHILD
>         a += 3;
>         while (1);
> }
> ```
>
> The answer should be 12.
> `fork` 之后变量的值相同，但并不是同一个变量。（相当于一份拷贝）
>
> <div align="center"><img src="https://cdn.hobbitqia.cc/20231011211326.png" alt="img" style="zoom: 25%;" /><img src="https://cdn.hobbitqia.cc/20231011211428.png" alt="img" style="zoom: 25%;" /></div>

> How many times does this code print "hello"?
>
> ```c
> pid1 = fork();
> printf("hello\n");
> pid2 = fork();
> printf("hello\n");
> ```
>
> The answer should be `6` times.

> How many processes does this C program create?
>
> Typical C coding style: call fork() and if its return value is non-zero and do the if clause
>
> ```c
> int main (int argc, char *arg[])
> {
>  fork (); // 2 
>  if (fork ()) { // 4
>      fork (); // 2 parents fork, 2 childs don't fork, so 4+2=6
>  }
>  fork ();  // 12
> }
> ```
>
> The answer should be 12.

- Address space
  - Child duplicate of parent
  - Child has a program loaded into it
- `strace`无法追踪到`fork()`

- Pros:
  - 简洁：不需要参数
  - 分工：`fork`搭起骨架、`exec`赋予灵魂
  - 联系：保持进程和进程之间的关系
- Cons:
  - 复杂：两个系统调用
  - 性能差
  - 安全问题

#### 1.2 The `execve()` System Call

`execve()` system call used after a `fork()` to replace the process’ memory space with a new program.
`execve()` 会把之前的进程资源全部丢掉(相当于直接抹掉后面的所有代码)，再 load 新的 binary，映射新的内存，分的新的堆和栈，常接在 `fork()` 后面使用。

**execve之后的代码不会执行**

> Demo
>
> ```c
> if (fork()==0) { // run ls
> 	char *const argv[] = {"ls", "-l", "/tmp/", NULL};
> 	execv("/bin/ls", argv);
> }
> ```

### 2. Process Terminations

A process terminates itself with the `exit()` system call.
调用 exit 后终止进程，释放资源。

- This call takes as argument an integer that is called the process’s exit/return/error code.
- All resources of a process are deallocated by the OS.
  `exit` 终止之后会把资源都释放。
- A process can cause the termination of another process.
  - Using something called “signals” and the `kill()` system call
- A parent can wait for a child to complete.
  - `wait()` blocks until any child completes.
  - `waitpid()` blocks until a specific child completes, can be non-blocking with `WNOHANG ` options


#### 2.1 Processes and Signals

A process can receive signals. And each signal causes a default behavior in the process.
**e.g.** 当我们想要终止一个程序时，我们可以敲入 `Ctrl+C`，这相当于对当前进程发送了 `SIGINT` 信号，就会终止当前进程。

Manipulating Signals

- Each signal causes a default behavior in the process

- The `signal()` system call allows a process to specify what action to do on a signal
  我们可以修改有些信号的处理程序。
- Signals like `SIGKILL` and `SIGSTOP` cannot be ignored or handled by the user, for security reasons

#### 2.2 Zombie

- When a child process terminates

  - remain as a zombie in an undead state

  - until it is reaped(garbage collected) by the OS 一个进程结束了，但依然还在占用资源

- child无法自己释放自己的PCB
- A zombie lingers on until
  - its parent has called `wait()` for the child
  - or its parent dies

- Getting rid of zombies
  - child exit时会发送SIGCHLD信号给parent，parent可以添加一个对SIGCHLD的handler并在其中call `wait()`

#### 2.3 Orphans

- An orphan process is one whose parent has died
- the orphan is adopted by the process with pid 1
- pid 1 会收养 orphan，因此孤儿进程不会成为 zombie。（pid 1 进程一定会回收子进程）

- 创建一个与当前进程的父进程完全无关的进程：先 `fork()` 一个进程，随后杀死自己，那么当前进程的子进程就会被 pid 1 收养，就脱离了原来的父进程。

### 3. Process Scheduling

- Maintain scheduling queues of processes
  - Ready queue: all processes residing in main memory, ready and waiting to execute 只有一个ready queue，且不为空，因为idle一直在里面
  - Wait queue: processes waiting for an event 很多个等待队列，一个被等待的事件对应一个等待队列。当我们这个事件到来之时，我们从事件对应的队列选择一个进程。
  - Processes migrate among the various queues.

- 插入一个新的进程，直接通过链表插入，之后减去偏移量后强制类型转换为`task_struct`

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241009164250949.png" alt="image-20241009164250949" style="zoom: 30%;" /></div>

首先从 ready queue 中拿一个进程去 CPU，

- 如果到时间了（过了一个时间片），就直接把自己放到 ready queue;
- 如果要等待 I/O 事件，就把自己放进 wait queue，等待 I/O 事件发生后再把自己唤醒，放回 ready queue.
- 创建子进程之后子进程放到 ready queue 中，如果调用了 `wait`，那么父进程等待子进程终止后，进入 ready queue.

#### 3.1  CPU Switch From Process to Process (在这里内容是寄存器)

1. A context switch occurs when the CPU switches from one process to another

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241009165334135.png" alt="image-20241009165334135" style="zoom:32%;" /></div>

2. save old state, load state for the new state
3. context of a process represented in the PCB
4. context-switch time is overhead 系统在切换时不做useful work
5. 调用`switch_to`的函数会将return address设置为下一行
   - switch中只保存部分寄存器，因为caller寄存器会在调用的时候由调用者保存，只用保存callee即可
   - 这些寄存器保存到PCB中作为cpu_context
6. 内核运行时的内存分布
   - kernel态的stack比user态在高地址多了pt_regs,同时kernel栈大小无限
   - task_struct里的pc存的是kernel space，pt_regs里的pc存的是user space

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241009171618053.png" alt="image-20241009171618053" style="zoom: 67%;" /></div>

7. context_switch中涉及寄存器的保存等等是privileged instruction，因此要在kernel mode。对于两个user mode的线程如下。进入kernel mode的时候要先保存user context，存到kernel的栈上，存在`pt_regs`区域。

> When and where are the context (regs) been saved?
>
> - When: In `context_switch`, more specifically, in cpu_switch_to
> - Where: In PCB, more specifically, in cpu_context
> - All regs are running kernel code, termed kernel context

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241009172139670.png" alt="image-20241009172139670" style="zoom: 67%;" /></div>

8. How does `fork()` return new_pid to parent and zero to child
   - 对parent，相当于一个`syscall`
   - 对child，通过`pt_regs`, `pt_regs[0]=0`。注意到此时子进程的 `pc`（ARM 里的 `pc` 类似于 RISC-V 里的 `ra`，存储返回地址）被设置为了 `ret_from_fork`（调用 `ret_to_user`，再调用 `kernel_exit`），`sp` 被设置为了 `pt_regs`.
   - 返回两个值，通过两个user context

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241030173451257.png" alt="image-20241030173451257" style="zoom: 40%;" /><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241030173603843.png" alt="image-20241030173603843" style="zoom:80%;" /></div>

- When does child process start to run and from where?
  - When forked, child is READY à context switch to RUN
  - After context switch, run from ret_to_fork
  - ret_from_fork -> ret_to_user -> kernel_exit who restores the 
