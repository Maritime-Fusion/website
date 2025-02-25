#!/bin/bash

# Check if FFmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "FFmpeg is not installed. Please install it first."
    echo "On macOS: brew install ffmpeg"
    echo "On Ubuntu: sudo apt install ffmpeg"
    exit 1
fi

# Check if input file is provided
if [ -z "$1" ]; then
    echo "Usage: ./optimize-video.sh input_video.mp4"
    exit 1
fi

INPUT_FILE="$1"
FILENAME=$(basename -- "$INPUT_FILE")
FILENAME_NOEXT="${FILENAME%.*}"

# Get video width using ffprobe
WIDTH=$(ffprobe -v error -select_streams v:0 -show_entries stream=width -of csv=p=0 "$INPUT_FILE")

# Calculate scale value - if width > 1920, scale to 1920, otherwise keep original width
if [ "$WIDTH" -gt 1920 ]; then
    SCALE="1920:-2"
else
    SCALE="${WIDTH}:-2"
fi

# Create MP4 version (H.264)
echo "Creating optimized MP4 version..."
ffmpeg -i "$INPUT_FILE" -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k -movflags +faststart -vf "scale=$SCALE" "${FILENAME_NOEXT}_optimized.mp4"

# Create WebM version (VP9)
echo "Creating WebM version..."
ffmpeg -i "$INPUT_FILE" -c:v libvpx-vp9 -crf 30 -b:v 0 -c:a libopus -b:a 96k -vf "scale=$SCALE" "${FILENAME_NOEXT}.webm"

echo "Done! Optimized videos created:"
echo "- ${FILENAME_NOEXT}_optimized.mp4"
echo "- ${FILENAME_NOEXT}.webm"
echo ""
echo "Place these files in your website directory and update the video sources in your HTML if needed." 