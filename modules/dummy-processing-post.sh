#!/usr/bin/env bash

curl -v \
    -H "Content-Type: application/json" \
    -d "{
            \"name\": \"DummyProcessing\",
            \"description\": \"A dummy processing module for testing. Inputs and outputs numpy array of data, printing and logging some basic information about the data.\",
            \"type\": 2,
            \"dependencies\": [
                \"numpy\"
            ],
            \"implementation\": \"$(basenc --base64url < dummy-processing.py | tr -d '\n')\"
        }" \
    http://localhost:5000/module
