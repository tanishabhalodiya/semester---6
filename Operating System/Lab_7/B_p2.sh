#!/bin/bash
# 2. To check if a number is positive, negative, or zero, and check for even/odd if positive. 

echo "Enter a number:"
read num

if [ $num -gt 0 ]
then
    echo "Number is Positive"

    if [ $((num % 2)) -eq 0 ]
    then
        echo "And it is Even"
    else
        echo "And it is Odd"
    fi

elif [ $num -lt 0 ]
then
    echo "Number is Negative"
else
    echo "Number is Zero"
fi

# with bc
