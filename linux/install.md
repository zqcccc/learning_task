1.linux下tomcat 服务的启动、关闭命令？

```
/usr/tomcat/bin/startup.sh

/usr/tomcat/bin/shutdown.sh
```

2.查看tomcat的进程命令
```
ps -f | grep tomcat
```


3.查看linux默认网关命令：
```
netstat -rn
```


4.如何查看某个进程占用的多大内存
```
ps -aux | grep 进程名
```


5.如何查看占用端口8080的进程？
```
lsof -i:端口号

netstat -tunlp | grep 端口号
```

6.启动 MySQL 数据库服务的命令是
```
service mysqld start
```

2.操作题


1.修改testuser用户，要求 uid:4321，主组：root，辅组：nobody，登录用户名:test，家目录:/home/test 且家数据迁移
```
usermod testuser -u 4321 -g root -G nobody -md /home/test -l test && rm /home/testuser/** /home/test
```


2.增加urergrp组，GID号为6000
```
groupadd -g 6000 urergrp
```
3.新增user1用户，UID号为6000，密码为空，并将其附属组加入usergrp组中
```
useradd -u 6000 -G usergrp user1
```
4.新增user2用户，密码为password，将用户的附属组加入root和usergrp组，用户的主目录为/user2目录
```
useradd -md /user2 -G root,usergrp user2
echo password | passwd --stdin user2
```
6.新增user3用户，不为用户建立并初始化宿主目录，用户不允许登录到系统的shell
```
useradd -M -s /sbin/nologin user3
```


5.设置用户的密码期限

1)设置user1用户，在下此登录时必须强制更改密码
```
chage -d 0 user1
```


2)设置user2用户，密码30必须更改密码，账号在2025年10月10日过期
```
chage -d 30 -E 2017-10-10 user2
```



6.新建目录/var/www/user1，并设置如下权限

将此目录的所有者设置为user1，并设置读写执行权限

将此目录的组设置为usergrp，并设置读执行权限

将其他用户的权限设置为只读
```
mkdir /var/www/user1
chown user1:usergrp /var/www/user1
chmod 754 /var/www/user1
```



7.临时修改 PATH
```
export PATH=$PATH:/可执行文件目录
```


8.永久修改 PATH

echo 'export PATH="$PATH:/somebin"' >> /etc/profile



9.安装nginx 

1）下载

nginx下载地址:  http://nginx.org/download/nginx-1.20.0.tar.gz
```
wget http://nginx.org/download/nginx-1.20.0.tar.gz
tar zxvf nginx-1.20.0.tar.gz
```
pcre下载地址: https://ftp.pcre.org/pub/pcre/pcre-8.44.tar.bz2
```
wget https://ftp.pcre.org/pub/pcre/pcre-8.44.tar.bz2 --no-check-certificate
yum install -y bzip2 
tar xvf pcre-8.44.tar.bz2
```
2）编译
```
#安装依赖
yum -y install gcc zlib zlib-devel pcre-devel openssl openssl-devel
yum install -y gcc-c++

#编译安装pcre
cd pcre-8.44
./configure
make && make install

#生成Makefile
cd ../nginx-1.20.0
./configure --prefix=/usr/local/nginx --with-http_stub_status_module --with-http_ssl_module --with-pcre=../pcre-8.44

# 编译安装
make 
make install

#安装位置
usr/local/nginx
```
3）启动nginx

4）停止nginx

5）重新载入配置文件
```
# 启动
/usr/local/nginx/sbin/nginx
# 停止 Nginx
/usr/local/nginx/sbin/nginx -s stop
# 重新载入配置文件
/usr/local/nginx/sbin/nginx -s reload
```




10.安装redis

1）下载

地址：https://download.redis.io/releases/redis-6.2.2.tar.gz

2）编译

3）启动测试

```
#下载
wget https://download.redis.io/releases/redis-6.2.2.tar.gz
#解压
tar zxvf redis-6.2.2.tar.gz 
#跳转
cd redis-6.2.2
#编译
make
#创建文件
mkdir /usr/local/redis
mkdir /usr/local/redis/bin
mkdir /usr/local/redis/conf
#移动文件
mv redis.conf /usr/local/redis/conf
mv src/redis-benchmark /usr/local/redis/bin
mv src/redis-check-aof /usr/local/redis/bin
mv src/redis-check-rdb /usr/local/redis/bin
mv src/redis-cli /usr/local/redis/bin
mv src/redis-sentinel /usr/local/redis/bin
mv src/redis-server /usr/local/redis/bin
mv src/redis-trib.rb /usr/local/redis/bin
#跳转bin文件
cd /usr/local/redis/bin
#不占用窗口启动redis 
./redis-server ../conf/redis.conf  &
./redis-cli 
#测试
set aa aa
get aa
```


