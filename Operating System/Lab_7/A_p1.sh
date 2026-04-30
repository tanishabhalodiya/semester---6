# 1. To check given year is Leap year or not. [If a year can be divisible by 4 but not divisible by 100 then 
# it is leap year but if it is divisible by 400 then it is leap year] 

#!/bin/bash

echo "Enter a year:"
read y

if [ $((y % 4)) -eq 0 ]
then

    if [ $((y % 100)) -ne 0 ]
    then
    
        echo "$y is a Leap Year"
        
    else
    
        if [ $((y % 400)) -eq 0 ]
        then
        
            echo "$y is a Leap Year"
            
        else
            echo "$y is NOT a Leap Year"
        fi
        
    fi
    
else
    echo "$y is NOT a Leap Year"
fi