#!/usr/bin/env bash

pushd ../modules >/dev/null || exit

curl \
    -H "Content-Type: application/json" \
    -d "{
            \"name\": \"NICCapture\",
            \"description\": \"This module captures network traffic on all interfaces. It assumes necessary permissions on the host system (same permissions needed to run Wireshark). It outputs a path (as a string) to a pcap file with a 5 second capture if one is available, otherwise None.\",
            \"type\": 1,
            \"dependencies\": [
                \"pyshark\"
            ],
            \"implementation\": \"$(basenc --base64url < nic-capture.py | tr -d '\n')\"
        }" \
    http://localhost:5000/module 2> /dev/null | jq .id | sed 's/"//g'

popd >/dev/null
