#!/bin/bash

#install zip
yum update
yum -y install zip

dotnet restore

#create deployment package
dotnet lambda package --configuration release --framework netcoreapp1.0 --output-package bin/release/netcoreapp1.0/deploy-package.zip
