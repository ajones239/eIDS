#!/usr/bin/env bash

pushd ../modules >/dev/null || exit

curl \
    -H "Content-Type: application/json" \
    -d "{
            \"name\": \"LabelStripper\",
            \"description\": \"A module that drops label column from dataframes.\",
            \"type\": 2,
            \"dependencies\": [
                \"pandas\"
            ],
            \"implementation\": \"$(basenc --base64url < strip-labels.py | tr -d '\n')\"
        }" \
    http://localhost:5000/module 2> /dev/null | jq .id | sed 's/"//g'

popd >/dev/null
