#!/bin/bash
declare -a folders=("nodejs4")

#export AWS_PROFILE=personal

for i in `seq 1 200`;
  do
  for folder in "${folders[@]}"
  do
    cd /home/ec2-user/lambda-coldstart-runtime-vs-memory/$folder
    pwd
    
    sls deploy

    cd ..
  done

  sleep 10

  node invoke-functions.js nodejs4

  sleep 20
done
