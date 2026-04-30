#!/bin/bash
# 1. To enter basic salary of an employee and calculate Gross salary according to given conditions Basic 
# Salary >= 10000 : DA = 80% of basic salary, HRA = 20% of basic salary + DA Basic Salary >= 20000 : 
# DA = 90% of basic salary, HRA = 25% of basic salary + DA Basic Salary >= 30000 : DA = 95% of basic 
# salary, HRA = 30% of basic salary + DA. 

echo "Enter Basic Salary:"
read basic

if [ $basic -ge 30000 ]; then
    da=$(echo "0.95 * $basic" | bc)
    hra=$(echo "0.30 * $basic" | bc)
elif [ $basic -ge 20000 ]; then
    da=$(echo "0.90 * $basic" | bc)
    hra=$(echo "0.25 * $basic" | bc)
elif [ $basic -ge 10000 ]; then
    da=$(echo "0.80 * $basic" | bc)
    hra=$(echo "0.20 * $basic" | bc)
else
    da=0
    hra=0
fi

gross=$(echo "$basic + $da + $hra" | bc)

echo "---------------------------"
echo "Basic Salary : $basic"
echo "DA           : $da"
echo "HRA          : $hra"
echo "Gross Salary : $gross"
echo "---------------------------"
