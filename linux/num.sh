#!/bin/bash
# while true; do
# read -p "请输入一个数字：" Num
# if [[ ! $Num =~ ^[0-9]+$ ]];then
#     echo "你输入的不是一个正整数！请重新输入！"
#     continue;
# fi
# if [ $Num -lt 1 ];then
#     echo "数字不能小于1！请重新输入！"
#     continue
# else
#     break;
# fi
# done

# for i in $(seq 1 $Num)
# do
#     Sum=$(( $Sum + $i ))
# done
# echo "从数字1加到${Num}的和为: $Sum"

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
