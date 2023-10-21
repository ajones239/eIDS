#!/usr/bin/env bash

pushd ../modules >/dev/null || exit

curl \
    -H "Content-Type: application/json" \
    -d "{
        \"name\": \"Pcap2Csv\",
        \"description\": \"This module takes a single string as input which should be the path to a pcap file. It outputs a pandas dataframe that should match the CICIDS-2017 dataset except there is no label column. The mapping of pcap file to dataframe is one to one.\",
        \"type\": 2,
        \"dependencies\": [
            \"pandas\"
        ],
        \"implementation\": \"$(basenc --base64url < pcap2csv.py | tr -d '\n')\",
        \"data\": {
            \"cicflowmeter_url\": \"http://localhost/cicflowmeter.zip\"
        }
    }" \
    http://localhost:5000/module 2> /dev/null | jq .id | sed 's/"//g'

popd >/dev/null
