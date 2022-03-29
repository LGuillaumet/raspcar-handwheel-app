#!/bin/bash


./vcan_script.sh
./start_simulator.sh &
./start_simulator_spa.sh &
./start_main_server.sh &
./start_webinterface_spa.sh &
candump vcan_tx &
candump vcan_rx








