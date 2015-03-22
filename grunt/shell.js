/**
 * @file
 * Configure grunt shell.
 */

module.exports = {buildFlash: {
    command: function () {
      grunt.config.set("flashIn", 'src/flash/FlashMediaElement.as');
      grunt.config.set("flashOut", 'local-build/flashmediaelement.swf');
      return grunt.config.get("buildFlashCommand");
    }
  },
  buildFlashCDN: {
    command: function () {
      grunt.config.set("flashIn", 'tmp/FlashMediaElement.as');
      grunt.config.set("flashOut", 'local-build/flashmediaelement-cdn.swf');
      return grunt.config.get("buildFlashCommand");
    }
  },
  // Task that compiles flashmediaelement.swf using the free Flex SDK on Linux/Mac.
  // There are a few prerequisite steps involved in running this task.
  //
  // 1) Install the Flex SDK version 4.6 (only needs to be done once)
  //   Download the free flex sdk from http://sourceforge.net/adobe/flexsdk/wiki/Download%20Flex%204.6/
  //   Unzip it to a directory on your local machine (eg: /usr/local/flex_sdk_4.6)
  //   Create a symlink from the install location to this directory
  //   (eg: ln -s /usr/local/flex_sdk_4.6 mediaelement/src/flash)
  //
  // 2) Update the `flexPath` variable below to reflect the name of the symlink you created
  //
  // 3) Build the SWC file (only needs to be done if you have changed something in the FLA file)
  //   Open the FlashMediaElement.fla file in the Flash Professional IDE.
  //   Goto the menu item 'File->Publish Settings'
  //   Click the 'Flash' tab
  //   Make sure the box 'Export SWC' is checked
  //   Click 'Publish'
  //   Quit out of the Flash IDE
  //
  // 4) Run this task from the command line: `grunt shell:buildFlash`
  //
  // Note: There doesn't seem to be an available SWC library that defines the YouTube player API.
  //       Remove the -strict compiler option to see warnings coming from YouTube API calls.
  //
  flexPath: '../flex_sdk_4.6',
  buildFlashCommand: [
    '<%= flexPath %>/bin/mxmlc -strict=false -warnings=true',
    '<%= flashIn %> -o <%= flashOut %>',
    '-library-path+="<%= flexPath %>/lib"',
    '-include-libraries+=src/flash/flashmediaelement.swc',
    '-include-libraries+=src/flash/flashls.swc -use-network=true',
    '-headless-server -static-link-runtime-shared-libraries'
  ].join(" ")
};
