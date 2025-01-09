# Synchronization

## Race Condition

Several processes (or threads) access and manipulate the same data concurrently and the outcome of the execution depends on the particular order in which the access takes place, is called a race-condition 

如多个进程并行地写数据，结果取决于写的先后顺序

- 单个call也可能出现race condition

### Critical Section

1. General structure of process

<div align="center"><img src="https://cdn.hobbitqia.cc/20231107100813.png" alt="img" style="zoom:33%;" /></div>

每个process都有critical section segment

同时间内critical section只能有一个进程。每个进程必须在entry section获取critical section的访问权限，之后permission在exit section释放

2. Critical Section Handling in OS

- Single-core system: preventing interrupts
- Multiple-processor: preventing interrupts are not feasible (depending on if kernel is preemptive or non-preemptive)
  - Preemptive – allows preemption of process when running in kernel mode
  - Non-preemptive – runs until exits kernel mode, blocks, or voluntarily yields CPU

3. Solution: `Three Requirements`

   <mark>**Mutual Exclusion(互斥访问)、Progress(空闲让进)、Bounded waiting(有限等待)**</mark>

   - Mutual Exclusion（互斥访问）
     - 在同一时刻，最多只有一个线程可以执行临界区
   - Progress（空闲让进）
     - 当没有线程在执行临界区代码时，必须在申请进入临界区的线程中选择一个线程，允许其执行临界区代码，保证程序执行的进展
   - Bounded waiting（有限等待）
     - 当一个进程申请进入临界区后，必须在有限的时间内获得许可并进入临界区，不能无限等待
     - prevent starvation

4. Peterson's Solution

Peterson’s solution solves *two-processes/threads* synchronization (Only works for two processes case)

- It assumes that LOAD and STORE are atomic
  - atomic: execution cannot be interrupted
- Two processes share two variables
  - `boolean flag[2]`: whether a process is ready to enter the critical section
  - `int turn`: whose turn it is to enter the critical section

<div align="center"><img src="https://cdn.hobbitqia.cc/20231107101358.png" alt="img" style="zoom: 33%;" /></div>

验证三个条件

- Mutual exclusion

  - P0 enters CS:
    - Either `flag[1]=false` or `turn=0`
    - Now prove P1 will not be able to enter CS
  - Case 1: `flag[1]=false` -> P1 is out CS
  - Case 2: `flag[1]=true`, `turn=1` -> P0 is looping, contradicts with P0 is in CS
  - Case 3: `flag[1]=true`, `turn=0` -> P1 is looping

- Process requirement

  <div align="center"><img src="https://cdn.hobbitqia.cc/20231107102048.png" alt="img" style="zoom: 25%;" /></div>

- Bounded waiting: Whether P0 enters CS depends on P1; Whether P1 enters CS depends on P0; P0 will enter CS after one limited entry P1

Peterson’s Solution is not guaranteed to work on modern architectures.

- Only works for two processes case

- It assumes that LOAD and STORE are atomic

- Instruction reorder

  指令会乱序执行。

> <div align="center"><img src="https://cdn.hobbitqia.cc/20231107102733.png" alt="img" style="zoom: 25%;" /><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241022154100673.png" alt="image-20241022154100673" style="zoom: 50%;" /></div>
>
> 100 is the expected output.
> 但是线程 2 的代码可能被乱序，两条指令交换顺序，这样输出就可能变成 0。

## Hardware Support for Synchronization

Many systems provide hardware support for critical section code

- Uniprocessors: disable interrupts
- Solutions:
  - **Memory barriers**
  - Hardware instructions
    - **test-and-set**: either test memory word and set value
    - **compare-and-swap**: compare and swap contents of two memory words
  - **Atomic variables**

1. **Memory Barriers**

**Memory model** are the memory guarantees a computer architecture makes to application programs, may be either:

- **Strongly ordered** – where a memory modification of one processor is immediately visible to all other processors. 一个内存的修改要立刻被所有的 processors 看到。

- **Weakly ordered** – where a memory modification of one processor may not be immediately visible to all other processors.

A **memory barrier** is an instruction that forces any change in memory to be propagated (made visible) to all other processors.

> 添加memory barrier使之前代码不会出错
>
> <div align="center"><img src="https://cdn.hobbitqia.cc/20231107103903.png" alt="img" style="zoom: 25%;" /></div>

2. **Hardware Instructions**

Special hardware instructions that allow us to either test-and-modify the content of a word, or two swap the contents of two words atomically (uninterruptable)

- test-and-set instruction

  - defined as below, but atomically

  ```c
  bool test_set (bool *target)
  {
      bool rv = *target;
      *target = TRUE;
      return rv:
  }
  ```

  - example: lock为true时会进入死循环，false时进入CS。有可能不满足bounded-waiting

  ```c
  bool lock = FALSE
  do {
      while (test_set(&lock)); // busy wait
      critical section
      lock = FALSE;
      remainder section 
  } while (TRUE);
  ```

  - 达不到bounded waiting的要求
  
  <div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241023162247687.png" alt="image-20241023162247687" style="zoom: 67%;" /></div>
  
  - 改进
  
  <div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241023162352116.png" alt="image-20241023162352116" style="zoom: 67%;" /></div>

- **Compare-and-Swap Instruction **实现了

  - Definition: Executed atomically, the swap takes place only under this condition.

  ```c
  int compare_and_swap(int *value, int expected, int new_value)
  {
   int temp = *value;
   if (*value == expected)
   	*value = new_value;
   return temp;
  }
  ```

  - Shared integer lock initialized to 0

  ```c
  while (true)
  {
   while (compare_and_swap(&lock, 0, 1) != 0)
  	 ; /* do nothing */
   /* critical section */
   lock = 0;
   /* remainder section */
  }
  ```

  - in practice: ARM64

  <div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241023163716550.png" alt="image-20241023163716550" style="zoom: 67%;" /></div>

- **Atomic Variables**

  -  provide atomic (uninterruptible) updates on basic data types such as integers and booleans

    - **increment(&sequence);** for example

      ```c
      void increment(atomic_int *v) {
          int temp;
          do {
          	temp = *v;
      	} while (temp != (compare_and_swap(v,temp,temp+1));
      }
      ```

## Mutex Locks

1. Calls to **acquire()** and **release()** must be atomic

2. this solution requires **busy waiting**, this lock therefore called a **spinlock**

```c
bool locked = false;
acquire() {
	while (compare_and_swap(&locked, false, true))
		; //busy waiting
}
release() {
	locked = false;
}
```

问题：如果一个进程有时间片，但是拿不到锁，一直 spin，会浪费 CPU 时间。

3. reduce **busy waiting**: yield -> moving from running to sleeping

```c
void init() {
 	flag = 0;
}
void lock() {
 	while (test_set(&flag, 1) == 1)
 		yield(); // give up the CPU
}
void unlock() {
 	flag = 0;
}
```

add a queue, when the lock is locked, change process’s state to `SLEEP`, add to the queue, and call `schedule()`

## Semaphore

1. two types
   - **Counting semaphore** – integer value can range over an unrestricted domain
   - **Binary semaphore** – integer value can range only between 0 and 1
     - 和mutex lock一样

2. `wait()` and `signal()` (Originally called P() and V() Dutch)

   - `wait()` 想拿到这个 semaphore，如果拿不到，就一直等待。

     ```c
     wait(S) { 
         while (S <= 0) ; // busy wait
         S--;
     }
     ```

   - `signal()` 释放 semaphore。

     ```c++
     signal(S) { 
         S++;
     }
     ```
     

3. data structure of waiting queue

```c
typedef struct { 
	int value; 
	struct list_head * waiting_queue; 
} semaphore;
```

4. two operations
   - block:把当前的进程 sleep，放到 waiting queue 里面。
   - wakeup:从 waiting queue 里面拿出一个进程，放到 ready queue 里面。
5. implementation

```c
wait(semaphore *S) {
	S->value--;
	if (S->value < 0) {
		add this process to S->list;
		block();
	}
}

signal(semaphore *S) {
	S->value++;
	if (S->value <= 0) {
		remove a proc.P from S->list;
		wakeup(P);
	}
}
```

- 需要进行原子保护，否则多进程同时signal就会出问题，通过spinlock实现
- 关于busy waiting: binary的有，counting的没有。cs里无busy waiting（没有拿到 semaphore 就会 sleep，还没有走到 critical section），只有 `wait` 和 `signal` 里需要 busy waiting 

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241023170003284.png" alt="image-20241023170003284" style="zoom:60%;" /></div>

> **Summary: Comparison between mutex and semaphore**
>
> - Mutex or spinlock
>   - Pros: no blocking
>   - Cons: Waste CPU on looping
>   - Good for short critical section
> - Semaphore
>   - Pros: no looping
>   - Cons: context switch is time-consuming
>   - Good for long critical section

6. in practice
   - 21与22行互换会导致持锁sleep，极大降低效率
   - spinlock保证操作原子性

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241023170426555.png" alt="image-20241023170426555" style="zoom: 60%;" /><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241023171207201.png" alt="image-20241023171207201" style="zoom:67%;" /></div>

## Deadlock and Starvation

1. deadlock: two or more processes are waiting indefinitely for an event that can be caused by only one of the waiting processes.

2. starvation: indefinite blocking, a process may **never be** removed from the semaphore’s waiting queue

3. dealock一定导致starvation

## Priority Inversion

1. 高优先级等低优先级（锁先被低优先级拿到），但是低优先级的进程拿不到 CPU，就无法释放锁，高优先级一直等待锁

2. solution: priority inheritance, 

3. temporary assign the highest priority of waiting process ($P_H$) to the process holding the lock ($P_L$) 

   如果低优先级的进程拿到了锁，而且这个锁上有高优先级的进程在等，就提高低优先级的进程的优先级，继承锁的优先级（取决于在这个锁上等待的进程的最高的优先级）。

## Linux Synchronization

2.6 以前的版本的 kernel 中通过禁用中断来实现一些短的 critical section；2.6 及之后的版本的 kernel 是抢占式的。

Linux 提供：

- Atomic integers
- Spinlocks
- Semaphores,在 `linux/include/linux/semaphore.h` 中，`down()` 是 lock（如果要进入 sleep，它会先释放锁再睡眠，唤醒之后会立刻重新获得锁），`up()` 是 unlock。 
- Reader-writer locks

## POSIX Synchronization

POSIX API provides

- mutex locks
- semaphores
- condition variable

### Mutex Locks

- Creating and initializing the lock

  ```c
  #include <pthread.h>
  pthread_mutex_t mutex;
  /* create and initialize the mutex lock */
  pthread_mutex_init(&mutex, NULL);
  ```

- Acquiring and releasing the lock

  ```c
  /* acquire the mutex lock */
  pthread_mutex_lock(&mutex);
  /* critical section */
  /* release the mutex lock */
  pthread_mutex_unlock(&mutex);
  ```

### Semaphores

Named semaphores can be used by **unrelated** processes, unnamed cannot.
`sem_open(), sem_init(), sem_wait(), sem_post()`

#### Unamed Semaphores

- Creating an initializing the semaphore:

  ```c
  #include <semaphore.h>
  sem_t sem;
  /* Create the semaphore and initialize it to 1 */
  sem_init(&sem, 0, 1);
  ```

- Acquiring and releasing the semaphore:

  ```c
  /* acquire the semaphore */
  sem_wait(&sem);
  /* critical section */
  /* release the semaphore */
  sem_post(&sem);
  ```

#### Named Semaphores

- Creating an initializing the semaphore:

  ```c
  #include <semaphore.h>
  sem_t *sem;
  /* Create the semaphore and initialize it to 1 */
  sem = sem_open("SEM", O_CREAT, 0666, 1);
  ```

- Another process can access the semaphore by referring to its name **SEM**.

- Acquiring and releasing the semaphore:

  ```c
  /* acquire the semaphore */
  sem_wait(sem);
  /* critical section */
  /* release the semaphore */
  sem_post(sem);
  ```

### Condition Variable

When should we use condition variables?

<div align="center"><img src="https://cdn.hobbitqia.cc/20231107121112.png" alt="img" style="zoom: 30%;" /></div>

Operations supported by a condition variable are:

- `wait(condition, lock)`: release lock, put thread to sleep until condition is signaled; when thread wakes up again, re-acquire lock before returning.

  等待一个条件（先放锁然后睡眠，等待被唤醒，被唤醒之后重新获得锁）。

- `signal(condition, lock)`: if any threads are waiting on condition, wake up one of them. Caller must hold lock, which must be the same as the lock used in the wait call.

  唤醒一个等待线程。

- `broadcast(condition, lock)`: same as signal, except wake up all waiting threads.

  唤醒所有的等待线程。

```c
pthread_mutex_t mutex; 
pthread_cond_t cond_var;
pthread_mutex_init(&mutex, NULL); 
pthread_cond_init(&cond_var, NULL);
// Thread waiting for the condition a == b to become true:
pthread_mutex_lock(&mutex);
while(a != b)                               // 一般要重复尝试，所以用 while 而不是 if
    pthread_cond_wait(&cond_var, &mutex);   // release lock when wait, acquire lock when being signaled
pthread_mutex_unlock(&mutex);
// Thread signaling another thread waiting on the condition variable:
pthread_mutex_lock(&mutex);
a = b;
pthread_cond_signal(&cond_var);
pthread_mutex_unlock(&mutex);
```

- usage scenarios

<div align="center"><img src="https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/image-20241023173747411.png" alt="image-20241023173747411" style="zoom:50%;" /></div>

- Condition variable can wake up all threads, semaphore can only wake up one by one.

- Sometimes we only care if the queue is empty or not, while don’t care the queue length.

  有的时候我们不关心等待队列的长度，那么 semaphore 的 val 就没有用处了。

- Mutex is used to guarantee that operations are atomic.

## Examples

### Bounded-buffer problem

就考到这难度

1. 定义

Two processes, the producer and the consumer share n buffers

- the producer generates data, puts it into the buffer.

  - the producer won’t try to add data into the buffer if it is full.

    当 buffer 满的时候，生产者不能再放数据，应该 sleep。

- the consumer consumes data by removing it from the buffer.

  - the consumer won’t try to remove data from an empty buffer.

    当 buffer 空的时候，消费者不能再取数据，应该 sleep。

2. Solution: n个buffer，每个放一个item。semaphore **mutex** 初始置为1，互斥保护。还需要两个 semaphore，分别是full-slots和empty-slots，分别初始为0和N

- The producer process

  ```c
  do {
      //produce an item
      ...
      wait(empty-slots);      // 把 empty-slots 减一（初始为 N）
      wait(mutex);
      //add the item to the buffer
      ...
      signal(mutex);
      signal(full-slots);
  } while (TRUE)
  ```

  这里`wait()`的顺序不能调换：如果先`wait(mutex)`，那么`wait(empty-slots)`之后，如果 buffer 空了，那么这个时候就会带着 mutex 休眠，这样另一个进程也拿不到这个锁了。

  同时也不能先`signal(full-slots)`，否则实际buffer还没添加内容，就加1了

- The consumer process

  ```c
  do {
      wait(full-slots);           // 把 full-slots 减一（初始为 0）
      wait(mutex);
      //remove an item from the buffer
      ...
      signal(mutex);
      signal(empty-slots);
  } while (TRUE)
  ```

### Readers-writers problem

1. 定义

A data set is shared among a number of concurrent processes

- readers: only read the data set; they do not perform any updates
- writers: can both read and write

多个 reader 可以共享，即同时读；但只能有一个 write 访问数据（写和读也不共享）。

2. Solution

- semaphore *mutex* initialized to 1
- semaphore *write* initialized to 1
- integer *readcount* initialized to 0

3. Code(Reader first)

- The writer process

  ```c
  The writer process
  do {
      wait(write);
      //write the shared data
      ....
      signal(write);
  } while (TRUE);
  ```

- The reader process

  ```c
  do {
      wait(mutex);
      readcount++;
      if (readcount == 1) 
          wait(write);
      signal(mutex)
  
      //reading data
      ...
      wait(mutex);
      readcount--;
      if (readcount == 0) 
          signal(write);
      signal(mutex);
  } while(TRUE);
  ```

  mutex 用来保护`readcount`。这里如果count是1，就获得`write`的锁来保护这个read。假设writer拿到了锁，来了5个reader，那么第一个会sleep在write上，剩下4个reader会sleep在mutex上，因为这时候第一个reader还没`signal(mutex)`，在一进来就在`wait(mutex)`了。

  4. Two variations of readers-writers problem

     - Reader first

       如果有 reader holds data，writer 永远拿不到锁，要等所有的 reader 结束。

     - Writer first

       如果 write ready 了，他就会尽可能早地进行写操作。如果有 reader hold data，那么需要等待 ready writer 结束后再读。

### Dining-philosophers problem

1. Philosophers spend their lives thinking and eating, they sit in a round table, but don’t interact with each other.

<div align="center"><img src="https://cdn.hobbitqia.cc/20231109205206.png" alt="img" style="zoom: 26%;" /></div>

每次只能拿一根筷子，但是要拿到两只筷子才能吃饭。例如如果每个人都先拿自己右边的筷子，再准备拿左边的筷子，就会卡死

2. Solution(assuming 5 philosophers): semaphore chopstick[5] initialized to 1

- Philosopher i

  ```c
  do {
      wait(chopstick[i]);
      wait(chopstick[(i+1)%5]);
      eat
      signal(chopstick[i]);
      signal(chopstick[(i+1)%5]);
      think
  } while(TRUE);
  ```

- Another solution: only odd philosophers start left-hand first, and even philosophers start right-hand first. This does not deadlock.

