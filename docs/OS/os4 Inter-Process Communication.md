# Inter-Process Communication

## Reasons for cooperating processes

- Information sharing
- Computation speedup
- Modularity
- Convenience

## IPC Communication Models

<div align="center"><img src="https://cdn.hobbitqia.cc/20231011225958.png" alt="img" style="zoom: 33%;" /></div>

- Most OSes implement both models

- **Message-passing**

  需要内核空间支持

  - useful for exchanging small amounts of data
  - simple to implement in the OS
  - sometimes cumbersome for the user as code is sprinkled with send/recv operations
  - high-overhead: one syscall per communication operation

- **Shared memory**

  非内核空间

  - low-overhead: a few syscalls initially, and then none
  - more convenient for the user since we’re used to simply reading/writing from/to RAM
  - more difficult to implement in the OS

### Shared Memory

- Processes need to establish a shared memory region
  - One process creates a shared memory segment
  - Processes can then “attach” it to their **address spaces**

- Processes communicate by reading/writing to the shared memory region
  - They are responsible for not stepping on each other’s toes
  - The OS is not involved at all

> <div align="center"><img src="https://cdn.hobbitqia.cc/20231011230419.png" alt="img" style="zoom: 33%;" /><img src="https://cdn.hobbitqia.cc/20231024103056.png" alt="img" style="zoom:33%;" /></div>
>
> `ipcs -a` 可以查看当前 IPC 的状态。
>
> - Question: How do processes find out the ID of the shared memory segment?
>   - Better solution: one could use message-passing to communicate the id!

存在问题：不安全。任何人拿到 `share_id` 都可以把共享内存 attach 到自己进程上，可以观察到其他进程的数据、甚至做 DOS 攻击。

### Message Passing

1. Two fundamental operations:

- send: to send a message (i.e., some bytes)
- recv: to receive a message (i.e., some bytes)

If processes P and Q wish to communicate they

- establish a communication “link” between them

  This “link” is an abstraction that can be implemented in many ways (even with shared memory!!)

- place calls to `send()` and `recv()`

- optionally shutdown the communication “link”

2. Implementing Message-Passing

Implementation of communication link

- Physical:

  - Shared memory
  - Hardware bus
  - Network

- Logical:

  - Direct or indirect

    - Direct

      有一个 P 和 Q，直接发信息。如果有 n 个进程，需要建立 $C^2_n$ 个连接。每对之间仅存在一个link，link通常是bi-directional的

    - Indirect

      - 有一个 mailbox，发信息相当于发给一个 mailbox。Each mailbox has a unique id. 如果有多个进程，我们需要确定是由哪个进程接收信息。
        - 多个进程接收时，有以下solution
          - 一个link最多只允许与两个process建立联系
          - 同时间只允许有一个process执行receive操作
          - Allow the system to select arbitrarily the receiver 

      - Processes can communicate only if they share a mailbox
      - Each pair of processes may share several communication links 允许系统任意选择接收机

  - Synchronous or asynchronous

    - Synchronous: Blocking is considered synchronous

      即我们发信息，如果接收者没收到信息，发送者就堵塞着不走；我们收信息，如果发送者没有发送信息，接送者就堵塞着不走。

    - Asynchronous: Non-blocking is considered asynchronous

      - **Non-blocking send** -- the sender sends the message and continue

        **Non-blocking receive** -- the receiver receives a valid message, or null message

    - 异步效率更高，同步时效性更高。
  
  - Automatic or explicit buffering
  
    - Zero capacity - no messages are queued on a link. Sender must wait for receiver.
    - Bounded capacity - finite length of n messages. Sender must wait if link full.X
    - Unbounded capacity - infinite length. Sender never waits.

### Pipes

1. Ordinary Pipes：没有名字，只能通过 `fork()` 来传播。 Ordinary pipes are unidirectional
   - Producer writes to one end (the **write-end** of the pipe)
   - Consumer reads from the other end (the **read-end** of the pipe)

<div align="center"><img src="https://cdn.hobbitqia.cc/20231031094344.png" alt="img" style="zoom: 43%;" /></div>

注意 `fd[0]` 是 read-end，`fd[1]` 是 write-end（对于双方都是）

Windows calls these **anonymous pipes**

2. Named Pipes
   - communication是双向的
   - 不需要parent-child relationship
   - 多个进程间可以使用named pipes 进行通信

3. In UNIX, a pipe is **mono-directional**.
   要实现两个方向一定需要两个 pipe。
   
   > - The command “ls | grep foo” creates two processes that communicate via a pipe
   >   - The ls process writes on the write-end
   >   - The grep process reads on the read-end

### Client-Server Communication

广义上的 IPC，因为是跑在两个物理机器上的交互。

- Sockets

- RPCs(**Remote Procedure Calls**)

  所有的交互都是和 stub 通信，stub 会和远端的 server 通信。 存在网络问题，如丢包。

- Java RMI

  RPC in Java
