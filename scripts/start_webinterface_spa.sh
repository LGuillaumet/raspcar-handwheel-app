#!/bin/bash

cd /home/pi/Documents/raspcar-handwheel-app/react-build
http-server --port 3000 -a 0.0.0.0
chromium-browser --start-fullscreen http://localhost:3000