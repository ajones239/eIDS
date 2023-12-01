#!/usr/bin/env bash

pushd ../modules >/dev/null || exit

curl \
    -H "Content-Type: application/json" \
    -d "{
            \"name\": \"DataGrapher\",
            \"description\": \"A tracks statistics for analysis modules.\",
            \"type\": 2,
            \"dependencies\": [
            ],
            \"implementation\": \"$(basenc --base64url < data_grapher.py | tr -d '\n')\"
        }" \
    http://localhost:5000/module 2> /dev/null | jq .id | sed 's/"//g'

popd >/dev/null
