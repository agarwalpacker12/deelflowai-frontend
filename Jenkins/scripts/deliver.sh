#!/usr/bin/env sh

npm run build

npm start &
sleep 1
echo $! > .pidfile

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


