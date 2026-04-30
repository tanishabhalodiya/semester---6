# 2. To check whether a given number is prime or not. 

#!/bin/bash

echo "Enter a number:"
read num

flag=0

for ((i=2; i<=num/2; i++))
do
    if [ $((num % i)) -eq 0 ]
    then
        flag=1
        break
    fi
done

if [ $num -le 1 ]
then
    echo "Not a Prime number"
elif [ $flag -eq 0 ]
then
    echo "Prime number"
else
    echo "Not a Prime number"
fi
