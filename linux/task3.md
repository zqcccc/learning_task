## 选择题

DBC

## 1.运维环境搭建

1.使用 VM 克隆两台机器,被克隆的机器可以联网

新机器上 `vi /etc/sysconfig/network-scripts/ifcfg-ens33`

IPADDR 改成和原来的机器不一样的，然后保存

```shell
systemctl restart network
```

2.关闭机器的防火墙

参考答案

1.查看防火墙状态

```shell
systemctl status firewalld
```

2.设置防火墙停用状态

```shell
systemctl stop firewalld
```

3.设置防火墙功能失效,开机自动关闭

```shell
systemctl disable firewalld
```

## 2.shell 编程题目

1.编写 shell 脚本，计算 1~100 的和。

```bash
#!/bin/bash
sum=0
i=1
while [ $i -le 100 ] ; do
	sum=$[ sum + i ]
	i=$[ i + 1 ]
done
echo $sum
```

2.编写 shell 脚本，输入一个数字 n 并计算 1~n 的和。

要求：如果输入的数字小于 1，则重新输入，直到输入正确的数字为止。

```bash
#!/bin/bash
while true; do
read -p "请输入一个数字：" Num
if [[ ! $Num =~ ^[0-9]+$ ]];then
    echo "你输入的不是一个正整数！请重新输入！"
    continue;
fi
if [ $Num -lt 1 ];then
    echo "数字不能小于1！请重新输入！"
    continue
else
    break;
fi
done

for i in $(seq 1 $Num)
do
    Sum=$(( $Sum + $i ))
done
echo "从数字1加到${Num}的和为: $Sum"
```

3.编写 shell 脚本，批量建立用户 user_00、user_01...user_99。

要求：所有用户同属于 users 组。

```bash
#! /bin/bash
groupadd users
for i in `seq –w 0 99`;
do
  useradd -g users user_0$i
done
```

4.编写 shell 脚本，批量添加用户 jsj01-jsj09、jsj10-jsj99。

```bash
#! /bin/bash

for((i=1;i<20;i++));
do
if(i<10);then
jsj="jsj0$i";
else
jsj="jsj$i";
fi
useradd $jsj
done
```

5，编写 shell 脚本，要求实现如下功能：当执行一个程序的时候，这个程序会让使用者选择 boy 或者 girl；如果使用者输入 B 或者 b 时，就显示：He is a boy；如果使用者输入 G 或者 g 时，就显示：He is a girl；如果是除了 B/b/G/g 以外的其他字符，就显示：I don’t know。

```bash
#! /bin/bash

echo -n your choice:
read choice
case $choice in
g)echo "She is a girl.";;
G)echo "She is a girl.";;
b)echo "He is a boy.";;
B)echo "He is a boy.";;
*)echo "I don't know.";;
esac
```

6.编写 shell 脚本，实现两个变量之间的加减乘除运算。

```bash
#!/bin/bash
read -p "input number:" a
read -p "input number:" b
read -p "input opt:" c
case $c in
+)let "sum=$a+$b"
;;
-)let "sum=$a-$b"
;;
\*)let "sum=$a*$b"
;;
/)let "sum=$a/$b"
;;
esac
echo $sum
```

7.题目要求:

一个张 xxx.sql 表的大小为 156M, 需要用拆分表的工具将表拆分为 1024KB 的多个文件,请编写 shell 脚本执行这些 sql 文件,完成表的创建和数据的插入。

PS： 我们提 SQL 文件 position_type_info_v2.sql ; 提供拆分表的工具 SQLDumpSplitter.exe

链接：https://pan.baidu.com/s/1Yce1CpFxgseTVd_KDNq5WQ

提取码：ds86

答案:

```bash
#! /bin/bash
mysql -uroot -p123456 visualization</tmp//position_type_info_v2.sql
ls /tmp/SQLDumpSplitterResult | while read line
do
  mysql -uroot -p123456 visualization</tmp/SQLDumpSplitterResult/$line
  echo "正在导入中"
done
```

8.批量建立用户

1）编写 shell 脚本，批量建立用户 user_00, user_01, ... user_100 并且所有用户同属于 users 组：

```bash
#!/bin/bash

group=`cat /etc/group | grep -o users`
if [$group=="users"]
then
    for i in `seq 0 100`
    do
       if [$i < 10]
       then
           useradd -g users user_0$i
       else
           useradd -g users user_$i
       fi
    done
else
    echo "users group not found"
    exit 1
fi
```

2）删除以上脚本批量添加的用户：

```bash
#!/bin/bash

for i in `seq 0 100`
do
    if [ $i < 10 ]
    then
        userdel -r user_0$i
    else
        userdel -r user_$i
    fi
done
```

9.每日生成一个文件

要求：请按照这样的日期格式（xxxx-xx-xx）每日生成一个文件，例如今天生成的文件为）2017-07-05.log， 并且把磁盘的使用情况写到到这个文件中，（不用考虑 cron，仅仅写脚本即可）

```bash
#!/bin/bash

cd /root

s=`date +%F`

file=$s.log

df -h >$file
```

10.写一个猜数字脚本，当用户输入的数字和预设数字（随机生成一个小于 100 的数字）一样时，直接退出，否则让用户一直输入，并且提示用户的数字比预设数字大或者小。

```bash
#!/bin/bash
#定义一个随机数
num=`echo $RANDOM`
#取出这个随机数
n1=$[ $num%100 ]
while
do
    read -p "Please input a number: "n
    if [ $n == $n1 ]
        then
        echo "You are right!!"
        break
    else [ $n -gt $n1 ]
        echo "You guess bigger,Please smaller!"
        continue
    else
        echo "You guess smaller,Please bigger!"
    fi
done
```

11.计日志大小

假如我们需要每小时都去执行你写的脚本。在脚本中实现这样的功能，当时间是 0 点和 12 点时，需要将目录/data/log/下的文件全部清空，注意只能清空文件内容而不能删除文件。而其他时间只需要统计一下每个文件的大小，一个文件一行，输出到一个按日期和时间为名字的日志里。 需要考虑/data/log/目录下的二级、三级、… 等子目录里面的文件。

参考答案:

```bash
#!/bin/bash
d=`date +%H`
t=`date +%y%m%d%H%M`
for file in `find /data/log/ -type f`
do
  if (($d==0)) || (($d==12))
  then
      > $file
  else
      du -sh $file >> /tmp/$t.log
  fi
done
```