#!/bin/bash
#
# This is a simple script that compiles mediaelement.swf using the free Flex SDK on Linux/Mac.
#
# There are a few prerequisite steps involved in running a command line build of the mejs SWF file
#
# 1) Install the Flex SDK version 4.6 (only needs to be done once)
#   Download the free flex sdk from http://sourceforge.net/adobe/flexsdk/wiki/Download%20Flex%204.6/
#   Unzip it to a directory on your local machine (eg; /usr/local/flex_sdk_4.6)
#   Create a symlink from the install location to this directory
#   (eg; ln -s /usr/local/flex_sdk_4.6 mediaelement/src/flash)
#
# 2) Update the FLEXVER variable below to reflect the name of the symlink you created
#
# 3) Build the SWC file (only needs to be done if you have changed something in the FLA file)
#   Open the FlashMediaElement.fla file in the Flash Professional IDE.
#   Goto the menu item 'File->Publish Settings'
#   Click the 'Flash' tab
#   Make sure the box 'Export SWC' is checked
#   Click 'Publish'
#   Quit out of the Flash IDE
#
# 4) Run this script from the command line (eg; ./build.sh)
#
# Note: There doesn't seem to be an available SWC library that defines the YouTube player API.
#       Remove the -strict compiler option to see warnings coming from YouTube API calls.
#
####################
FLEXPATH=../../../../flex_sdk_4.6
#FLEXPATH=../../../apache_flex_sdk
#FLEXPATH=../../../AIRSDK_Compiler

## flash/mediaelement.swf - debug
## $FLEXPATH/bin/mxmlc -debug=true -strict=false -warnings=true ./FlashMediaElement.as -o ../../build/flashmediaelement-debug.swf -library-path+="$FLEXPATH/lib" -include-libraries+=./flashmediaelement.swc -include-libraries+=./flashls.swc -use-network=true -headless-server -static-link-runtime-shared-libraries
##
## flash/mediaelement.swf - non-debug
$FLEXPATH/bin/mxmlc -strict=false -warnings=true ./FlashMediaElement.as -o ../../build/flashmediaelement.swf -library-path+="$FLEXPATH/lib" -include-libraries+=./flashmediaelement.swc -include-libraries+=./flashls.swc -use-network=true -headless-server -static-link-runtime-shared-libraries
##
