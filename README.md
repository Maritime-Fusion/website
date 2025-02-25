# Maritime Fusion Website

This repository contains the code for the Maritime Fusion website.

## Development Workflow

We use a staging-to-production workflow to safely develop and deploy changes:

1. **Staging Environment**: All development work happens in the `staging/` directory
2. **Production Environment**: The root directory serves as the production environment

## Getting Started

If you're starting fresh or want to move existing files to staging:

```bash
# Move all media files from production to staging
./move-to-staging.sh
```

## Development Process

1. Make all changes in the `staging/` directory
2. Test your changes by opening `staging/index.html` in your browser
3. When ready to deploy:

```bash
# Deploy from staging to production
./deploy.sh
```

## Features

- **Automatic Video Optimization**: Place your video as `video.mp4` in staging, and it will be automatically optimized during deployment
- **Automatic Backups**: The deploy script creates a backup of production files before deployment
- **Safe Testing**: Test all changes in staging before affecting the live site

## File Structure

```
maritimefusion/website/
├── index.html              # Production site
├── styles.css              # Production styles
├── sketch.js               # Production JavaScript
├── *.png, *.jpg            # Production images
├── deploy.sh               # Deployment script
├── move-to-staging.sh      # Script to move files to staging
├── staging/                # Staging environment
│   ├── index.html          # Staging site
│   ├── styles.css          # Staging styles
│   ├── sketch.js           # Staging JavaScript
│   ├── *.png, *.jpg        # Staging images
│   ├── optimize-video.sh   # Video optimization script
│   └── README.md           # Staging-specific instructions
└── backup_*/               # Automatic backups (created during deployment)
```
