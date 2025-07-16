#!/bin/bash
cd /tmp/kavia/workspace/code-generation/tik-tac-toe-645dc8d2/Tik_tac_toe_Web_Application
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

