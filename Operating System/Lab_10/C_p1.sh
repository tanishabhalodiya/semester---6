# 1. To find factors of the given number 
#!/bin/bash

echo "Enter a number:"
read num

echo "Factors of $num are:"

for ((i=1; i<=num; i++))
do
    if [ $((num % i)) -eq 0 ]
    then
        echo -n "$i "
    fi
done
