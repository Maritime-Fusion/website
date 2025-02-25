#!/bin/bash

# Script to move all media files from production to staging

echo "=== Moving Media Files to Staging ==="
echo ""

# Define directories
PROD_DIR="/home/jason/maritimefusion/website"
STAGING_DIR="${PROD_DIR}/staging"

# Create staging directory if it doesn't exist
mkdir -p "${STAGING_DIR}"

# Files to move (all images and videos in production that aren't in staging)
# First, let's identify what needs to be moved
echo "Identifying files to move..."

# Files that need to be moved
FILES_TO_MOVE=(
  "cargo.jpg"
  "columbia.png"
  "destroyer.jpg"
  "penn.png"
  "spacex.png"
  "team.png"
  "tesla.png"
  "reactor_1.png"
  "reactor_2.png"
  "reactor_3.png"
  "video.mp4"
  "video_optimized.mp4"
  "video.webm"
)

# Move each file if it exists
for file in "${FILES_TO_MOVE[@]}"; do
  if [ -f "${PROD_DIR}/${file}" ]; then
    echo "Moving ${file} to staging..."
    cp "${PROD_DIR}/${file}" "${STAGING_DIR}/"
    echo "✓ ${file} moved successfully"
  else
    echo "× ${file} not found in production"
  fi
done

echo ""
echo "=== Media Files Move Complete ==="
echo ""
echo "Files have been copied to the staging directory."
echo "You can now edit and test in the staging environment."
echo "When ready, use deploy.sh to deploy from staging to production." 