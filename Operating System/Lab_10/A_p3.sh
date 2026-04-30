# 3. Which will accept a number n and display first n prime numbers as output? 

#!/bin/bash

echo "Enter value of n:"
read n

count=0
num=2

echo "First $n prime numbers are:"

while [ $count -lt $n ]
do
    flag=0

    for ((i=2; i<=num/2; i++))
    do
        if [ $((num % i)) -eq 0 ]
        then
            flag=1
            break
        fi
    done

    if [ $flag -eq 0 ]
    then
        echo -n "$num "
        count=$((count + 1))
    fi

    num=$((num + 1))
done
