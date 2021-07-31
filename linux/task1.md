## 选择题
BBACA
DCBDD

## 描述题
描述提1.请描述Linux系统从开机到登录界面的启动过程？
简述：
1. 开机BIOS自检
2. MBR引导
3. grub引导菜单
4. 加载内核kernel
5. 启动init进程
6. 读取inittab文件，执行rc.sysinit,rc等脚本
7. 启动mingetty，进入系统登陆界面

描述提2.简述解决忘记root密码的方法

进入单用户模式更改一下root密码即可

1. 重启系统

3秒钟内，按一下回车键。此时你会看到如下提示信息：

GNU GRUB version 0.97 .......
CentOS (2.6.32-358.el6.i686)

此时CentOS (2.6.32-358.el6.i686) 这一行是高亮的，即我们选中的就是这一行，这行的意思是Linux版本为CentOS，后面小括号内是内核版本信息。 另外在这个界面里，我们还可以获取一些信息，输入 ‘e’ 会在启动前编辑命令行； 输入 ‘a’ 会在启动前更改内核的一些参数； 输入 ‘c’ 则会进入命令行。而我们要做的是输入 ‘e’.

2. 进入单用户模式

输入 ‘e’ 后，界面变了，显示如下信息：

root (hd0,0)
kernel /vmlinuxz-2.6.32-358.el6.i686 ro root=UUID=......（此处省略）
initrd /initramfs-2.6.32-358.el6.i686.img

暂时你不用管这些都代表什么意思，你只要跟着阿铭做即可。按一下向下的箭头键，选中第二行，输入 ‘e’，出现如下提示：

<_no_dm rhgh quiet

你只需要在后面加一个 “single” 或者 “1” 或者 “s”

<_no_dm rhgh quiet single

然后先按回车然后按 ‘b’，启动后就进入单用户模式。

3. 修改root密码

输入修改root密码的命令 ‘passwd’：

修改后，重启系统

## 操作题

1. 
```shell
mkdir /home/zheng/back && cd /home/zheng/back && touch test1 && touch test2 && mv test2 ../file12 
```

2.
```shell
mkdir /data/oldboy && cd /data/oldboy && vi oldboy.text
```