#!/bin/sh
# Author : ST
# Script follows here:
# nohup bash build_test.sh & nohup bash run_behave.sh &
cd tests
behave
# behave -n 'Verify the sub categories of water under the category of population are displayed'
# behave -i tutorial.feature