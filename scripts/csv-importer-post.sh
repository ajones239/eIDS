#!/usr/bin/env bash

pushd ../modules >/dev/null || exit

curl \
    -H "Content-Type: application/json" \
    -d "{
            \"name\": \"CSVImporter\",
            \"description\": \"A basic input parsing module for parsing CSV files. This module expects the argument of addInput to be the base64 encoded contents of a CSV file. This module converts the data argument of addInput to a pandas dataframe.\",
            \"type\": 1,
            \"dependencies\": [
                \"pandas\"
            ],
            \"implementation\": \"$(basenc --base64url < csv-importer.py | tr -d '\n')\"
        }" \
    http://localhost:5000/module 2> /dev/null | jq .id | sed 's/"//g'

popd >/dev/null
