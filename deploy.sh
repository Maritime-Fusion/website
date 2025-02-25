#!/bin/bash

# Maritime Fusion Deployment Tool
# This script handles both video optimization and deployment from staging to production

echo "=== Maritime Fusion Deployment Tool ==="

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Define staging and production directories
STAGING_DIR="${SCRIPT_DIR}/staging"
PROD_DIR="${SCRIPT_DIR}"
BACKUP_DIR="${SCRIPT_DIR}/backup_$(date +%Y%m%d_%H%M%S)"

# Check if staging directory exists
if [ ! -d "$STAGING_DIR" ]; then
    echo "Error: Staging directory not found!"
    exit 1
fi

# Step 1: Create a backup of production files
echo "Creating backup of production files..."
mkdir -p "${BACKUP_DIR}"

# Backup important production files
find "${PROD_DIR}" -maxdepth 1 -type f \( -name "*.html" -o -name "*.css" -o -name "*.js" -o -name "*.jpg" -o -name "*.png" -o -name "*.mp4" -o -name "*.webm" \) -exec cp {} "${BACKUP_DIR}/" \;

echo "Backup created at: ${BACKUP_DIR}"

# Step 2: Check for and optimize video if it exists
VIDEO_FILE="${STAGING_DIR}/video.mp4"
if [ -f "$VIDEO_FILE" ]; then
    echo "Video file found. Optimizing video..."
    
    # Make sure the optimization script is executable
    chmod +x "${STAGING_DIR}/optimize-video.sh"
    
    # Run the optimization script
    cd "${STAGING_DIR}"
    ./optimize-video.sh video.mp4
    
    if [ $? -eq 0 ]; then
        echo "Video optimization completed successfully."
    else
        echo "Warning: Video optimization may have encountered issues."
        echo "Continuing with deployment..."
    fi
    
    # Return to original directory
    cd "${SCRIPT_DIR}"
else
    echo "No video.mp4 found in staging. Skipping video optimization."
fi

# Step 3: Deploy from staging to production
echo "Moving files from staging to production..."

# Copy all files from staging to production, excluding certain files/directories
rsync -av --exclude=".git/" \
         --exclude="deploy.sh" \
         --exclude="README.md" \
         --exclude="CNAME" \
         --exclude="LICENSE" \
         --exclude="staging/" \
         --exclude="backup_*/" \
         "$STAGING_DIR/" "$PROD_DIR/"

echo ""
echo "=== Deployment Complete ==="
echo "Files successfully copied from staging to production!"
echo ""
echo "To view changes, open index.html in your browser."
echo ""
echo "If you need to restore from backup, files are available at: ${BACKUP_DIR}" 