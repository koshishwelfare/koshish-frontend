# Centralized Configuration Setup

This document summarizes the centralized configuration system implemented across all Koshish applications.

## Overview

All applications now use centralized configuration management instead of directly accessing environment variables. This improves maintainability, consistency, and environment management.

---

## Backend Configuration

### Main Config File: `config.js`

**Location**: `koshishbackend/config.js`

Exports a unified `config` object with the following sections:

```javascript
config = {
  server: { port, nodeEnv },
  database: { mongodbUri },
  jwt: { secret, expiresIn },
  cloudinary: { cloudName, apiKey, apiSecret },
  email: { smtp: {...}, isConfigured },
  auth: { teacher, coordinator, cocircular },
  cors: { origin, credentials },
  frontend: { studentUrl, adminUrl }
}
```

### Backend Files Updated

All backend files now import and use the centralized config:

1. **`server.js`** - Uses `config.server.port` and `config.cors`
2. **`config/cloudinary.js`** - Uses `config.cloudinary.*`
3. **`config/connectMongodb.js`** - Uses `config.database.mongodbUri`
4. **`config/jwtSecret.js`** - Uses `config.jwt.secret`
5. **`utils/mailer.js`** - Uses `config.email.smtp.*` and `config.email.isConfigured`
6. **`utils/authToken.js`** - Uses `config.jwt.expiresIn`
7. **`middleware/authentication/coordinatorLogin.js`** - Uses `config.auth.coordinator.*`
8. **`middleware/authentication/teacherLogin.js`** - Uses `config.auth.teacher.*`

### Backend Environment Variables Template

**File**: `.env-template`

```
# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/koshish

# JWT Configuration
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=koshish
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email/SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com

# Authentication Credentials
TEACHER_USERNAME=teacher@example.com
TEACHER_PASSWORD=teacher123
TEACHER_NOTIFY_EMAIL=teacher-notify@example.com

COORDINATOR_USERNAME=coordinator@example.com
COORDINATER_PASSWORD=coordinator123
COORDINATOR_NOTIFY_EMAIL=coordinator-notify@example.com

COCICULAR_USERNAME=cocirculer@example.com
COCICULAR_PASSWORD=cocirculer123

# CORS Configuration
CORS_ORIGIN=true

# Frontend URLs
STUDENT_FRONTEND_URL=http://localhost:5173
ADMIN_FRONTEND_URL=http://localhost:5174
```

---

## Frontend Configuration

### Admin Panel Config: `Adminpannel/src/config/config.js`

```javascript
config = {
  api: { baseUrl, timeout },
  app: { name, version, environment },
  features: { enableAnalytics, enableErrorTracking },
  storage: { tokenKey, userKey, cacheDuration },
};
```

### Student Portal Config: `koshish/src/config/config.js`

```javascript
config = {
  api: { baseUrl, timeout },
  app: { name, version, environment },
  features: { enableAnalytics, enableErrorTracking },
  storage: { tokenKey, userKey, cacheDuration },
};
```

### Frontend Environment Variables

Both frontends use:

```
# Backend API Configuration
VITE_BACKEND_URL=http://localhost:5000

# API Configuration
VITE_API_TIMEOUT=10000

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_TRACKING=true

# Cache Configuration
VITE_CACHE_DURATION=3600000
```

---

## Usage Instructions

### Backend

To use the centralized config in backend files:

```javascript
import config from "./config.js";

// Access configuration
const port = config.server.port;
const mongoUrl = config.database.mongodbUri;
```

### Frontend

To use the centralized config in frontend files:

```javascript
import config from "@/config/config.js";

// Access configuration
const apiUrl = config.api.baseUrl;
const timeout = config.api.timeout;
```

**Note**: Frontend utilities already receive `backendURL` as a parameter, allowing flexible API URL usage across contexts.

---

## Benefits

✅ **Single Source of Truth** - All configuration in one place
✅ **Type Safety** - Centralized config structure
✅ **Consistency** - Same pattern across all applications
✅ **Easy Validation** - Production config validation built-in
✅ **Better Security** - Sensitive data properly managed
✅ **Scalability** - Easy to add new configuration options

---

## Next Steps

1. Copy `.env-template` to `.env` in koshishbackend and populate with actual values
2. Update frontend `.env` files to match the new structure
3. Test all applications to ensure config is properly loaded
4. Monitor logs to confirm no `process.env` references remain
