#!/bin/bash
declare -a folders=("python3")

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

  node invoke-functions.js python3

  sleep 20
done
