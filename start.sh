#!/bin/bash
cd /root/.openclaw/workspace/durukanklima
node server.js &
sleep 3
echo "Server should be running on port 3000"