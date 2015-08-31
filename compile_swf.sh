# Script to compile the swf file using Flex withour Grunt
#
# To compile the swf file, you have to download the Flex SDK version 4.6 (only needs to be done once)
#   Download the free flex sdk from http://sourceforge.net/adobe/flexsdk/wiki/Download%20Flex%204.6/
#   Unzip it to a directory on your local machine (eg: /usr/local/flex_sdk_4.6)
#   Create a symlink from the install location to this directory
#   (eg: ln -s /usr/local/flex_sdk_4.6 mediaelement/src/flash)
#
# If you do not have the required player global swc file, you will have to download and add it in flex:
#   https://helpx.adobe.com/flash-player/kb/archived-flash-player-versions.html
#   The file must be placed in flex_sdk_4.6/frameworks/libs/player/11.1/playerglobal.swc

flex_path="./src/flash/flex_sdk_4.6"
target_version="10.1"

$flex_path/bin/mxmlc -strict=false -compiler.debug -warnings=true "src/flash/FlashMediaElement.as" -o local-build/flashmediaelement-cdn.swf -define+=CONFIG::cdnBuild,true -library-path+="$flex_path/lib" -include-libraries+=src/flash/flashmediaelement.swc -include-libraries+=src/flash/flashls.swc -use-network=true -source-path src/flash -target-player $target_version -headless-server -static-link-runtime-shared-libraries

$flex_path/bin/mxmlc -strict=false -compiler.debug -warnings=true "src/flash/FlashMediaElement.as" -o local-build/flashmediaelement.swf -define+=CONFIG::cdnBuild,false -library-path+="$flex_path/lib" -include-libraries+=src/flash/flashmediaelement.swc -include-libraries+=src/flash/flashls.swc -use-network=true -source-path src/flash -target-player $target_version -headless-server -static-link-runtime-shared-libraries
