#!/bin/bash
# My first script

git add .
echo "git added"
msg="..."
if [ $# -eq 0 ]; then
    msg="..."
else
    msg=$1
fi
git commit -am "$msg"
echo "git commit"
git push -u origin master
echo "git pushed"