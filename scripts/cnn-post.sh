#!/usr/bin/env bash

pushd ../modules >/dev/null || exit

echo "{
        \"name\": \"CNNAnalysis\",
        \"description\": \"A CNN-based analysis module. More description goes here...\",
        \"type\": 3,
        \"dependencies\": [
            \"scikit-learn\",
            \"pillow\",
            \"keras\",
            \"urllib\",
            \"tab2img\",
            \"numpy\"
        ],
        \"implementation\": \"$(basenc --base64url < cnn_analysis.py | tr -d '\n')\",
        \"data\": {
            \"converter.pkl\": \"$(basenc --base64url < ../models/converter.pkl | tr -d '\n')\",
            \"resnet.h5_url\": \"http://localhost/resnet.h5\"
        }
    }" > /tmp/cnn_analysis_datafile.json

curl \
    -H "Content-Type: application/json" \
    -d @/tmp/cnn_analysis_datafile.json \
    http://localhost:5000/module 2> /dev/null | jq .id | sed 's/"//g'

rm /tmp/cnn_analysis_datafile.json

popd >/dev/null
