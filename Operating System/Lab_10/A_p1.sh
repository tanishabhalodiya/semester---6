# 1. To find the value of one number raised to the power of another.  
#!/bin/bash

echo "Enter base number:"
read base

echo "Enter power:"
read power

result=1

for ((i=1; i<=power; i++))
do
    result=$((result * base))
done

echo "$base raised to power $power is: $result"
