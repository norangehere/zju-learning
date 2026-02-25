> overall 期末
>
> - 40 x 1.5 选择
> - 5 x 2 填空
> - 3-4 大题 memory(hard), synchronization, scheduling

1. multi-programming, time-sharing
2. OS events: interrupts and exceptions
3. Timer: modifying the timer is done via privileged instructions
3. **Released the first Linux prototypes in late 1991**

## Main OS Services

1. Process Management
   - a process is a program in execution
2. Memory Management
   - keep track of memory use
3. Storage Management
   - operate file-system management
4. I/O Management
   - device-driver interface
5. Protection and Security
   - 控制进程对由操作系统定义的资源的访问的机制
   - 防御系统的内部和外部攻击

## Processs

1. Linkder Load



1. **OS is a resource abstractor and a resource allocator**
   - define a set of logical resources and a set of well-defined operations
   - decides who gets what resource and when
2. bootloader
3. OS waits until an event occurs
4. modern OSes allows multi-programming
   - Time-Sharing: Multi-programming with rapid context-switching
5. Furthermore, there is no memory protection within the kernel
   - segmentation fault
6. For instance, only the OS can:

   - Directly access I/O devices (printer, disk, etc.)
   - Manipulate memory management state 操作内存管理状态
   - Manipulate protected control registers
   - Execute the halt instruction that shuts down the processor
   
7. **MS-DOS had only one mode**, because it was written for the Intel 8088(1979), which had no mode bit

8. **OS Events**
   - The kernel defines a handler for each event type
   - Once the system is booted, all entries to the kernel occur as the result of an event
   - The OS can be seen as a huge event handler

9. A system call is a special kind of trap

10. To make sure that an interrupt will occur reasonably soon, we can use a timer
    - The timer interrupts the computer regularly
