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

# Add .htaccess file to dist folder
HTACCESS_CONTENT='
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
'

echo "📝 Creating .htaccess file in $SOURCE_DIST..."
echo "$HTACCESS_CONTENT" > "$SOURCE_DIST/.htaccess"

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