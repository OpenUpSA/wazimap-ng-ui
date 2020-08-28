#!/bin/sh
# Author : ST
# Script follows here:
# nohup bash build_test.sh & nohup bash run_behave.sh &
cd tests
behave
# behave -n "Verify the zoom in and zoom out on map view"
# behave -i tutorial.feature