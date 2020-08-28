#!/bin/sh
# Author : ST
# Script follows here:
# nohup bash build_test.sh & nohup bash run_behave.sh &
cd tests
behave
# behave -n "Verify the visibility of the location information of the map"
# behave -i tutorial.feature