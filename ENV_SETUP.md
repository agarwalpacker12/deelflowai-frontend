# Environment Variables Setup Guide

## Issue: `VITE_API_URL` showing as `undefined/api`

This happens when environment variables are not set correctly. Follow these steps:

## Solution 1: Create `.env` file (Recommended)

1. **Create a `.env` file** in the `deelflowai-frontend` directory:

```bash
# For local development
VITE_API_URL=http://localhost:8140
```

2. **For dev server (production build):**

```bash
VITE_API_URL=http://dev.deelflowai.com:8140
```

3. **Restart the dev server** after creating/updating the `.env` file:
   ```bash
   npm run dev
   ```

## Solution 2: Use separate host and port

Instead of `VITE_API_URL`, you can use:

```bash
VITE_API_HOST=dev.deelflowai.com
VITE_API_PORT=8140
```

## Solution 3: Set in build command

For production builds, you can set it in the build command:

```bash
VITE_API_URL=http://dev.deelflowai.com:8140 npm run build
```

## Important Notes

1. **Vite environment variables** must start with `VITE_` to be accessible in the frontend code
2. **Restart required**: After creating/updating `.env`, you must restart the dev server
3. **Build-time variables**: Environment variables are embedded at build time, not runtime
4. **`.env` file location**: Must be in the `deelflowai-frontend` root directory (same level as `package.json`)

## Backend Access Issue

### Problem: `dev.deelflowai.com/api/hello` redirects to `dev.deelflowai.com`

**Root Cause**: The backend runs on port **8140**, not port 80. When you access `dev.deelflowai.com/api/hello`, it goes to port 80 (default HTTP), which serves the frontend via Apache.

### Solution: Access backend with port

**Correct URL:**
```
http://dev.deelflowai.com:8140/api/hello
```

**NOT:**
```
http://dev.deelflowai.com/api/hello  ❌ (goes to port 80 - frontend)
```

### Why this happens:

1. **Port 80 (default HTTP)**: Serves the frontend via Apache
2. **Port 8140**: Serves the backend FastAPI application
3. Apache doesn't proxy `/api/*` requests to the backend automatically

### To fix the redirect issue (optional):

If you want `dev.deelflowai.com/api/hello` to work without the port, you need to configure Apache/Nginx to proxy `/api/*` requests to `localhost:8140`. This requires server configuration changes.

## Testing

1. **Test backend directly:**
   ```bash
   curl http://dev.deelflowai.com:8140/api/hello
   ```

2. **Test from frontend:**
   - Make sure `.env` file is set correctly
   - Check browser console for API configuration logs
   - Verify API calls go to the correct URL

