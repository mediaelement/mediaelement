import sys
import os

me_filename = 'mediaelement'
mep_filename = 'mediaelementplayer'
combined_filename = 'mediaelement-and-player'

# BUILD MediaElement (single file)

me_files = []
me_files.append('me-namespace.js')
me_files.append('me-utility.js')
me_files.append('me-plugindetector.js')
me_files.append('me-featuredetection.js')
me_files.append('me-mediaelements.js')
me_files.append('me-shim.js')

code = ''

for item in me_files:
	src_file = open('js/' + item,'r')
	code += src_file.read() + "\n"

tmp_file = open('../build/' + me_filename + '.js','w')
tmp_file.write(code)
tmp_file.close()

# BUILD MediaElementPlayer (single file)

mep_files = []
mep_files.append('mep-player.js')
mep_files.append('mep-feature-playpause.js')
mep_files.append('mep-feature-progress.js')
mep_files.append('mep-feature-time.js')
mep_files.append('mep-feature-volume.js')
mep_files.append('mep-feature-fullscreen.js')
mep_files.append('mep-feature-tracks.js')

code = ''

for item in mep_files:
	src_file = open('js/' + item,'r')
	code += src_file.read() + "\n"

tmp_file = open('../build/' + mep_filename + '.js','w')
tmp_file.write(code)
tmp_file.close()

# MINIFY both scripts

os.system("java -jar yuicompressor-2.4.2.jar ../build/" + me_filename + ".js -o ../build/" + me_filename + ".min.js --charset utf-8 -v")
os.system("java -jar yuicompressor-2.4.2.jar ../build/" + mep_filename + ".js -o ../build/" + mep_filename + ".min.js --charset utf-8 -v")

# COMBINE into single script

code = ''
src_file = open('../build/' + me_filename + '.js','r')
code += src_file.read() + "\n"
src_file = open('../build/' + mep_filename + '.js','r')
code += src_file.read() + "\n"

tmp_file = open('../build/' + combined_filename + '.js','w')
tmp_file.write(code)
tmp_file.close()

code = ''
src_file = open('../build/' + me_filename + '.min.js','r')
code += src_file.read() + "\n"
src_file = open('../build/' + mep_filename + '.min.js','r')
code += src_file.read() + "\n"

tmp_file = open('../build/' + combined_filename + '.min.js','w')
tmp_file.write(code)
tmp_file.close()


# MINIFY CSS
src_file = open('css/mediaelementplayer.css','r')
tmp_file = open('../build/mediaelementplayer.css','w')
tmp_file.write(src_file.read())
tmp_file.close()
os.system("java -jar yuicompressor-2.4.2.jar ../build/mediaelementplayer.css -o ../build/mediaelementplayer.min.css --charset utf-8 -v")
