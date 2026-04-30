#!/bin/bash

echo "Enter side 1:"
read a
echo "Enter side 2:"
read b
echo "Enter side 3:"
read c

# Check for valid triangle
if [ $((a + b)) -gt $c ] && [ $((a + c)) -gt $b ] && [ $((b + c)) -gt $a ]
then
    echo "Triangle is VALID"

    # Check for equilateral
    if [ $a -eq $b ] && [ $b -eq $c ]
    then
        echo "Triangle is EQUILATERAL"
    else
        # Check for isosceles
        if [ $a -eq $b ] || [ $a -eq $c ] || [ $b -eq $c ]
        then
            echo "Triangle is ISOSCELES"
        else
            echo "Triangle is SCALENE"
        fi
    fi

else
    echo "Triangle is NOT valid"
fi



#!/bin/bash

echo "Enter side 1:"
read a
echo "Enter side 2:"
read b
echo "Enter side 3:"
read c

# Check for valid triangle
if [ $(echo "$a + $b > $c" | bc) -eq 1 ] && [ $(echo "$a + $c > $b" | bc) -eq 1 ] && [ $(echo "$b + $c > $a" | bc) -eq 1 ]
then
    echo "Triangle is VALID"

    # Check for equilateral
    if [ $(echo "$a == $b" | bc) -eq 1 ] && [ $(echo "$b == $c" | bc) -eq 1 ]
    then
        echo "Triangle is EQUILATERAL"
    else
        # Check for isosceles
        if [ $(echo "$a == $b" | bc) -eq 1 ] || [ $(echo "$a == $c" | bc) -eq 1 ] || [ $(echo "$b == $c" | bc) -eq 1 ]
        then
            echo "Triangle is ISOSCELES"
        else
            echo "Triangle is SCALENE"
        fi
    fi

else
    echo "Triangle is NOT valid"
fi
