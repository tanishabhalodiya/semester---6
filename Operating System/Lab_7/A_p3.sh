#!/bin/bash
# 3. To find a largest number from 3 numbers. 

echo "Enter first number:"
read a
echo "Enter second number:"
read b
echo "Enter third number:"
read c

if [ $a -gt $b ]
then

    if [ $a -gt $c ]
    then
        echo "Largest number is: $a"
        
    else
        echo "Largest number is: $c"
    fi

else

    if [ $b -gt $c ]
    then
        echo "Largest number is: $b"
        
    else
        echo "Largest number is: $c"
    fi
fi
