#!/usr/bin/env bash

curl -v \
    -H "Content-Type: application/json" \
    -d "{
            \"name\": \"DummyAnalysis\",
            \"description\": \"A dummy analysis module that inputs a numpy array and outputs a string. Messages are printed and logged.\",
            \"type\": 1,
            \"dependencies\": [
                \"numpy\"
            ],
            \"implementation\": \"$(basenc --base64url < dummy-analysis.py | tr -d '\n')\"
        }" \
    http://localhost:5000/module
