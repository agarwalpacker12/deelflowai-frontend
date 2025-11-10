# Nginx Configuration for DeelFlowAI Frontend

## Problem
The `/login` route (and other frontend routes) are being redirected to `/api/` with a 301 redirect. This is because nginx is not properly configured to serve the React SPA.

## Solution
Update the nginx configuration on the server to:
1. Serve the React app for all routes that don't start with `/api`
2. Proxy `/api` requests to the backend (port 8140)
3. Handle client-side routing by serving `index.html` for all non-API routes

## Installation Steps

### 1. Copy the Configuration File
Copy the `nginx.conf` file to your server:
```bash
# On the server
sudo cp nginx.conf /etc/nginx/sites-available/deelflowai-frontend
```

### 2. Create Symbolic Link (if not exists)
```bash
sudo ln -s /etc/nginx/sites-available/deelflowai-frontend /etc/nginx/sites-enabled/
```

### 3. Update the Configuration
Edit the configuration file to match your server setup:
```bash
sudo nano /etc/nginx/sites-available/deelflowai-frontend
```

**Important settings to update:**
- `root`: Path to your built React app (usually `/var/www/deelflowai-frontend/dist`)
- `server_name`: Your domain name
- `proxy_pass`: Backend URL (currently set to `http://localhost:8140`)

### 4. Test Configuration
```bash
sudo nginx -t
```

### 5. Reload Nginx
```bash
sudo systemctl reload nginx
# or
sudo service nginx reload
```

## Key Configuration Points

### API Proxy
```nginx
location /api/ {
    proxy_pass http://localhost:8140;
    # ... other proxy settings
}
```
This proxies all `/api/*` requests to the backend server.

### React Router Support
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```
This is **critical** - it ensures that routes like `/login`, `/register`, etc. are served by `index.html`, allowing React Router to handle client-side routing.

### Static Assets
```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    try_files $uri =404;
}
```
This serves static assets with long-term caching.

## Troubleshooting

### Check Nginx Error Logs
```bash
sudo tail -f /var/log/nginx/error.log
```

### Check Nginx Access Logs
```bash
sudo tail -f /var/log/nginx/access.log
```

### Verify Backend is Running
```bash
curl http://localhost:8140/api/health
```

### Test Frontend Routes
```bash
# Should return HTML (index.html), not redirect
curl -I http://dev.deelflowai.com/login

# Should return JSON (API response), not redirect
curl -I http://dev.deelflowai.com/api/health
```

## Common Issues

### Issue: Still getting 301 redirects
**Solution**: Clear browser cache or test with `curl -I` to see actual server response. Make sure nginx was reloaded after configuration changes.

### Issue: 404 errors on frontend routes
**Solution**: Ensure `try_files $uri $uri/ /index.html;` is in the root location block and that `index.html` exists in the root directory.

### Issue: API requests not working
**Solution**: Verify backend is running on port 8140 and check proxy_pass URL in nginx config.

### Issue: CORS errors
**Solution**: The configuration includes CORS headers, but you may need to adjust them based on your backend CORS settings.

## Verification

After updating the configuration, test these URLs:

1. **Frontend Routes** (should serve index.html):
   - `http://dev.deelflowai.com/` → Should serve React app
   - `http://dev.deelflowai.com/login` → Should serve React app (not redirect)
   - `http://dev.deelflowai.com/register` → Should serve React app
   - `http://dev.deelflowai.com/app/dashboard` → Should serve React app

2. **API Routes** (should proxy to backend):
   - `http://dev.deelflowai.com/api/health` → Should return API response
   - `http://dev.deelflowai.com/api/auth/login` → Should proxy to backend

3. **Static Assets** (should serve files):
   - `http://dev.deelflowai.com/assets/index.js` → Should serve JavaScript file
   - `http://dev.deelflowai.com/favicon.ico` → Should serve favicon

## Additional Notes

- The configuration assumes the React app is built and located in `/var/www/deelflowai-frontend/dist`
- The backend is running on `localhost:8140`
- All non-API routes will be handled by React Router
- API routes are proxied to the backend without modification

