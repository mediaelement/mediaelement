# Script to compile the swf files using Flex without Grunt
#
# To compile the swf files, you have to download the Flex SDK version 4.6 (only needs to be done once)
#   Download the free flex sdk from http://sourceforge.net/adobe/flexsdk/wiki/Download%20Flex%204.6/
#   Unzip it to a directory on your local machine (eg: /usr/local/flex_sdk_4.6)
#   Create a symlink from the install location to this directory
#   (eg: ln -s /usr/local/flex_sdk_4.6 mediaelement/src/flash)
#
# If you do not have the required player global swc file, you will have to download and add it in flex:
#   https://helpx.adobe.com/flash-player/kb/archived-flash-player-versions.html
#   The file must be placed in flex_sdk_4.6/frameworks/libs/player/10.1/playerglobal.swc

flex_path="./src/flash/flex_sdk_4.6"
target_version="10.1"
builds[0]="-define+=CONFIG::cdnBuild,true -define+=CONFIG::debugBuild,true -o local-build/flashmediaelement-debug.swf"
builds[1]="-define+=CONFIG::cdnBuild,true -define+=CONFIG::debugBuild,false -o local-build/flashmediaelement-cdn.swf"
builds[2]="-define+=CONFIG::cdnBuild,false -define+=CONFIG::debugBuild,false -o local-build/flashmediaelement.swf"

for i in 0 1 2; do
	$flex_path/bin/mxmlc -strict=false -compiler.debug -warnings=true src/flash/FlashMediaElement.as ${builds[i]} -library-path+=$flex_path/lib -include-libraries+=src/flash/flashmediaelement.swc -include-libraries+=src/flash/flashls.swc -use-network=true -source-path src/flash -target-player $target_version -headless-server -static-link-runtime-shared-libraries
done
