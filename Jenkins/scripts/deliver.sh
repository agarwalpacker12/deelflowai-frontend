#!/usr/bin/env sh

# Exit immediately if a command exits with a non-zero status
set -e

# Build the React app
npm run build

# Start the app in the background
npm start &
sleep 1
echo $! > .pidfile

echo "Running as user: $(whoami)"

# Define paths
SOURCE_DIST="./dist"  # or "./build" if you're using React's default
TARGET_DIR="/var/www/html"
TARGET_DIST="$TARGET_DIR/dist"

# Remove old dist folder
if [ -d "$TARGET_DIST" ]; then
  echo "🧹 Removing old dist folder from $TARGET_DIR..."
  sudo rm -rf "$TARGET_DIST"
fi

# Copy new dist folder
echo "📦 Copying new dist folder to $TARGET_DIR..."
sudo cp -r "$SOURCE_DIST" "$TARGET_DIR"

# Set permissions
echo "🔧 Setting permissions..."
sudo chown -R www-data:www-data "$TARGET_DIST"
sudo chmod -R 755 "$TARGET_DIST"

echo "✅ Deployment complete."
echo 'Now...'
echo 'Visit http://dev.deelflowai.com/ to see your Node.js/React application in action.'


