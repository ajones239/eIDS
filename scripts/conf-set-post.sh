#!/usr/bin/env bash

curl -v \
    -H "Content-Type: application/json" \
    -d "{
            \"name\": \"cs0\",
            \"description\": \"desc\",
            \"modules\": [
                {
                    \"id\": \"$1\",
                    \"level\": 0
                },
                {
                    \"id\":\"$2\",
                    \"level\": 1
                },
                {
                    \"id\":\"$3\",
                    \"level\": 2
                },
                {
                    \"id\":\"$4\",
                    \"level\": 3
                }
            ],
            \"connections\": [
                {
                    \"out\": \"$1\",
                    \"in\": \"$2\"
                },
                {
                    \"out\": \"$2\",
                    \"in\": \"$3\"
                },
                {
                    \"out\": \"$3\",
                    \"in\": \"$4\"
                }
            ],
            \"actionConditions\": [
                {
                    \"actionModule\": \"$4\",
                    \"operator\": \"=\",
                    \"value\": \"Normal\"
                }
            ]
    }" http://localhost:5000/configuration
