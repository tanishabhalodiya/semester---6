# 4. To find first n Fibonacci numbers like: 0 1, 1, 2, 3, 5, 13, … 

#!/bin/bash

echo "Enter value of n:"
read n

a=0
b=1

echo "Fibonacci series:"

for ((i=1; i<=n; i++))
do
    echo -n "$a "
    c=$((a + b))
    a=$b
    b=$c
done
