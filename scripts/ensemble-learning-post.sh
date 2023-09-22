#!/usr/bin/env bash

pushd ../modules >/dev/null || exit

echo "{
        \"name\": \"EnsembleAnalysis\",
        \"description\": \"An ensemble-based analys module. More description goes here...\",
        \"type\": 3,
        \"dependencies\": [
            \"sklearn\",
            \"joblib\",
            \"numpy\"
        ],
        \"implementation\": \"$(basenc --base64url < ensemble_analysis.py | tr -d '\n')\",
        \"data\": {
            \"dt_hpo.pkl\": \"$(basenc --base64url < ../models/dt_hpo.pkl | tr -d '\n')\",
            \"et_hpo.pkl\": \"$(basenc --base64url < ../models/et_hpo.pkl | tr -d '\n')\",
            \"rf_hpo.pkl\": \"$(basenc --base64url < ../models/rf_hpo.pkl | tr -d '\n')\",
            \"xg_hpo.pkl\": \"$(basenc --base64url < ../models/xg_hpo.pkl | tr -d '\n')\",
            \"stack.pkl\": \"$(basenc --base64url < ../models/stack.pkl | tr -d '\n')\"
        }
    }" > ensemble_analysis_datafile.json

curl \
    -H "Content-Type: application/json" \
    -d @ensemble_analysis_datafile.json \
    http://localhost:5000/module 2> /dev/null | jq .id | sed 's/"//g'

rm ensemble_analysis_datafile.json

popd >/dev/null
