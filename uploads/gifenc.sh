#!/bin/sh
export LD_LIBRARY_PATH=$PWD
palette="/tmp/palette.png"
#./gifenc.sh SampleVideo_1280x720_1mb.mp4 output.gif 720 10
filters="fps=$4,scale=$3:-1:flags=lanczos"

./ffmpeg -v warning -i $1 -vf "$filters,palettegen" -y $palette
./ffmpeg -v warning -i $1 -i $palette -lavfi "$filters [x]; [x][1:v] paletteuse" -y $2
