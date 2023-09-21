#!/usr/bin/env bash

pushd ../modules || exit 2>/dev/null

curl -v \
    -H "Content-Type: application/json" \
    -d "{
            \"name\": \"DummyAnalysis\",
            \"description\": \"A dummy analysis module that inputs a numpy array and outputs a string. Messages are printed and logged.\",
            \"type\": 3,
            \"dependencies\": [
                \"numpy\"
            ],
            \"implementation\": \"$(basenc --base64url < dummy-analysis.py | tr -d '\n')\"
        }" \
    http://localhost:5000/module

popd 2>/dev/null
