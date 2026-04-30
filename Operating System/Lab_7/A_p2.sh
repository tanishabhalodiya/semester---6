#!/bin/bash
# 2. Write a shell script to generate mark sheet of a student. Take 3 subjects, calculate, and display 
# total marks, percentage and Class obtained by the student. 

echo "Enter a marks of maths :"
read m1

echo "Enter marks of Science : "
read m2

echo "Enter marks of hindi"
read m3


total = $(echo "$m1 + $m2 + $m3" | bc)
per = $(echo "scale=2; $total / 3" | bc)

if (( $(echo "$percentage >= 75" | bc) )); then
    echo "Class: First class"
    
elif (( $(echo "$percentage >= 60" | bc) )); then
    echo "Class: Second Class"
    
elif (( $(echo "$percentage >= 50" | bc) )); then
    echo "Class: Third Class"
    
elif (( $(echo "$percentage >= 35" | bc) )); then
    echo "Class: Pass Class"
    
else
    echo "Class: Fail"
fi






