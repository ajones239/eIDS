#!/usr/bin/env bash
#
pushd ../modules >/dev/null || exit

curl \
    -H "Content-Type: application/json" \
    -d "{
            \"name\": \"DummyAction\",
            \"description\": \"A dummy action module that writes a string to a file in /tmp/eIDS/out.\",
            \"type\": 4,
            \"dependencies\": [
            ],
            \"implementation\": \"$(basenc --base64url < dummy-action.py | tr -d '\n')\"
        }" \
    http://localhost:5000/module 2> /dev/null | jq .id | sed 's/"//g'

popd >/dev/null
