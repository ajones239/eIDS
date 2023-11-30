#!/usr/bin/env bash

pushd ../modules >/dev/null || exit

echo "{
        \"name\": \"TreeBasedAnalysis\",
        \"description\": \"A tree-based analysis module. More description goes here...\",
        \"type\": 3,
        \"dependencies\": [
            \"scikit-learn\",
            \"pandas\",
            \"joblib\",
            \"numpy\"
        ],
        \"implementation\": \"$(basenc --base64url < tree-analysis.py | tr -d '\n')\",
        \"data\": {
            \"dt_model.pkl\": \"$(basenc --base64url < ../models/dt_model.pkl | tr -d '\n')\",
            \"et_model.pkl\": \"$(basenc --base64url < ../models/et_model.pkl | tr -d '\n')\",
            \"rf_model.pkl\": \"$(basenc --base64url < ../models/rf_model.pkl | tr -d '\n')\",
            \"stk_model.pkl\": \"$(basenc --base64url < ../models/stk_model.pkl | tr -d '\n')\",
            \"xg_model.pkl\": \"$(basenc --base64url < ../models/xg_model.pkl | tr -d '\n')\"
        }
    }" > /tmp/tree_analysis_datafile.json

curl \
    -H "Content-Type: application/json" \
    -d @/tmp/tree_analysis_datafile.json \
    http://localhost:5000/module 2> /dev/null | jq .id | sed 's/"//g'

rm /tmp/tree_analysis_datafile.json

popd >/dev/null
