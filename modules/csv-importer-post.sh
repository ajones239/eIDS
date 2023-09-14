#!/usr/bin/env bash

curl -v \
    -H "Content-Type: application/json" \
    -d "{
            \"name\": \"CSVImporter\",
            \"description\": \"A generic input parsing module for parsing CSV files. This module converts the data argument of addInput to a numpy array, assuming all values are data (no header).\",
            \"type\": 1,
            \"dependencies\": [
                {
                    \"package\": \"numpy\",
                    \"modules\": [\"numpy\"]
                }
            ],
            \"implementation\": \"$(basenc --base64url < csv-importer.py | tr -d '\n')\"
        }" \
    http://localhost:5000/module
