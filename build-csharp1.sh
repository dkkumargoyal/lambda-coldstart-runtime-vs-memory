#!/bin/bash
declare -a folders=("csharp1")

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

  node invoke-functions.js csharp1

  sleep 60
done
