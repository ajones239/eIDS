#!/usr/bin/env bash

if [[ $(docker ps -a | grep mongodb) ]]; then
    docker rm mongodb --force
fi

docker run -d \
    --name mongodb \
    -p 127.0.0.1:27017:27017 \
    mongo:latest

