#!/bin/bash

sudo modprobe vcan

sudo ip link add dev vcan_tx type vcan
sudo ip link set up vcan_tx

sudo ip link add dev vcan_rx type vcan
sudo ip link set up vcan_rx
