#!/bin/bash
# Package fitforg source code into a downloadable zip.
# Excludes node_modules, .next, .git, dev logs — keeps only what
# the user needs to push to GitHub and deploy to Vercel.

set -e

PROJECT_DIR="/home/z/my-project"
OUTPUT_ZIP="$PROJECT_DIR/download/fitforg-source.zip"

# Make sure download dir exists
mkdir -p "$PROJECT_DIR/download"

# Remove any old zip
rm -f "$OUTPUT_ZIP"

# Create the zip — exclude heavy/dev folders, keep source + public + config + docs
cd "$PROJECT_DIR"
zip -r "$OUTPUT_ZIP" . \
  -x "node_modules/*" \
  -x ".next/*" \
  -x ".git/*" \
  -x ".jdk/*" \
  -x ".android-sdk/*" \
  -x ".zscripts/*" \
  -x "download/*" \
  -x "upload/*" \
  -x "skills/*" \
  -x "examples/*" \
  -x "mini-services/*" \
  -x "tests/*" \
  -x "android-apk/*" \
  -x "db/*" \
  -x "dev.log*" \
  -x "server.log" \
  -x "bun.lock" \
  -x ".DS_Store" \
  -x "*.tsbuildinfo" \
  -x "next-env.d.ts" \
  >/dev/null

# Show result
echo "✓ Packaged: $OUTPUT_ZIP"
echo "  Size: $(du -h "$OUTPUT_ZIP" | cut -f1)"
echo "  Files: $(unzip -l "$OUTPUT_ZIP" | tail -1 | awk '{print $2}')"
