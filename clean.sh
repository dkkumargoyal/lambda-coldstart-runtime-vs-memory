#!/bin/bash
declare -a folders=("csharp1" "csharp2" "java" "python2" "python3" "golang" "nodejs6" "nodejs4")

  for folder in "${folders[@]}"
  do
    cd $folder
    pwd
    
    sls remove

    rm -rf .serverless

    cd ..
  done
