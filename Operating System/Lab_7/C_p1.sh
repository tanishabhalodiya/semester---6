#!/bin/bash

echo "Enter first number:"
read a
echo "Enter second number:"
read b

if [ $(echo "$a == $b" | bc) -eq 1 ]
then

    echo "Both numbers are EQUAL"
    
else

    echo "Numbers are NOT equal"

    if [ $(echo "$a > $b" | bc) -eq 1 ]
    then
        echo "Largest number is: $a"
    else
        echo "Largest number is: $b"
    fi
fi
