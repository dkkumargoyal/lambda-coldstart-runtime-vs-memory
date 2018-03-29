#!/bin/bash
declare -a folders=("csharp2")

#export AWS_PROFILE=personal

for i in `seq 1 10`;
  do
  for folder in "${folders[@]}"
  do
    cd /home/ec2-user/lambda-coldstart-runtime-vs-memory/$folder
    pwd
    
    sls deploy

    cd ..
  done

  sleep 60

  node invoke-functions.js csharp2

  sleep 60
done
