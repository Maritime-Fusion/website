# Maritime Fusion - Staging Environment

This directory contains the staging environment for the Maritime Fusion website.

## Simplified Workflow

1. Make all changes and updates in this staging directory
2. Test your changes locally by opening `staging/index.html` in your browser
3. If you need to include a video:
   - Simply place your video file as `video.mp4` in this directory
   - The deployment script will automatically optimize it
4. When ready to deploy to production, run the deployment script from the root directory:

```bash
./deploy.sh
```

## What the Deploy Script Does

The deployment script automatically:
1. Checks for `video.mp4` in the staging directory
2. If found, optimizes it to create `video_optimized.mp4` and `video.webm`
3. Copies all files from staging to the production (top-level) directory
4. Preserves important files like CNAME and LICENSE

No manual video optimization needed - everything is handled in one command!
