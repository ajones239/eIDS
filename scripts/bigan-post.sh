#!/usr/bin/env bash

pushd ../modules >/dev/null || exit

echo "{
        \"name\": \"BiGANAnalysis\",
        \"description\": \"A BiGAN-based analysis module. More description goes here...\",
        \"type\": 3,
        \"dependencies\": [
            \"pandas\",
            \"joblib\",
            \"keras\",
            \"tensorflow\",
            \"numpy\"
        ],
        \"implementation\": \"$(basenc --base64url < bigan_analysis.py | tr -d '\n')\",
        \"data\": {
            \"BiGAN_bigan.hdf5\": \"$(basenc --base64url < ../models/BiGAN_bigan.hdf5 | tr -d '\n')\",
            \"BiGAN_discriminator_focal.hdf5\": \"$(basenc --base64url < ../models/BiGAN_discriminator_focal.hdf5 | tr -d '\n')\",
            \"BiGAN_encoder.hdf5\": \"$(basenc --base64url < ../models/BiGAN_encoder.hdf5 | tr -d '\n')\",
            \"column_transformer.joblib\": \"$(basenc --base64url < ../models/column_transformer.joblib | tr -d '\n')\",
            \"min_max_scaler.joblib\": \"$(basenc --base64url < ../models/min_max_scaler.joblib | tr -d '\n')\"
        }
    }" > /tmp/bigan_analysis_datafile.json

curl \
    -H "Content-Type: application/json" \
    -d @/tmp/bigan_analysis_datafile.json \
    http://localhost:5000/module 2> /dev/null | jq .id | sed 's/"//g'

rm /tmp/bigan_analysis_datafile.json

popd >/dev/null
