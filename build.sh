#!/bin/bash
declare -a folders=("csharp1" "csharp2" "java" "python2" "python3" "golang" "nodejs6" "nodejs4")

#export AWS_PROFILE=personal

for i in `seq 1 200`;
  do
  for folder in "${folders[@]}"
  do
    cd $folder
    pwd
    
    sls deploy

    cd ..
  done

  sleep 60

  node invoke-functions.js

  sleep 60
done
