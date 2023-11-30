#!/usr/bin/env bash
#
pushd ../modules >/dev/null || exit

curl \
    -H "Content-Type: application/json" \
    -d "{
            \"name\": \"DiscordAlert\",
            \"description\": \"A module that writes to a Discord channel when an attack is detected.\",
            \"type\": 4,
            \"dependencies\": [
            ],
            \"implementation\": \"$(basenc --base64url < discord-alert.py | tr -d '\n')\",
            \"data\": {
                \"webhook_url\": \"${DISCORD_WEBHOOK_URL}\"
            }
        }" \
    http://localhost:5000/module 2> /dev/null | jq .id | sed 's/"//g'

popd >/dev/null
