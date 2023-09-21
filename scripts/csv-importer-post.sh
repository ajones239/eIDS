#!/usr/bin/env bash

pushd ../modules || exit 2>/dev/null

curl -v \
    -H "Content-Type: application/json" \
    -d "{
            \"name\": \"CSVImporter\",
            \"description\": \"A basic input parsing module for parsing CSV files. This module expects the argument of addInput to be the base64 encoded contents of a CSV file. This module converts the data argument of addInput to a numpy array, assuming all values are data (no header in the CSV file).\",
            \"type\": 1,
            \"dependencies\": [
                \"numpy\"
            ],
            \"implementation\": \"$(basenc --base64url < csv-importer.py | tr -d '\n')\"
        }" \
    http://localhost:5000/module

popd 2>/dev/null
