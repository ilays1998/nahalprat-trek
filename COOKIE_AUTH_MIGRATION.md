# Cookie-Based Authentication Migration

## Overview
The application has been migrated from localStorage token-based authentication to HttpOnly cookie-based authentication. Additionally, authentication is now only required for booking-related pages, allowing public access to informational pages.

## Changes Made

### Backend Changes

#### 1. Configuration (`backend/config.py`)
- Added JWT cookie configuration:
  - `JWT_TOKEN_LOCATION = ['cookies']` - Tokens stored in cookies instead of headers
  - `JWT_COOKIE_SECURE = False` - Set to True in production with HTTPS
  - `JWT_COOKIE_CSRF_PROTECT = False` - CSRF protection disabled for simplicity
  - `JWT_COOKIE_SAMESITE = 'Lax'` - Cookie security setting
  - `JWT_ACCESS_COOKIE_NAME = 'access_token_cookie'` - Cookie name
  - Token expiry increased to 7 days for better user experience

#### 2. CORS Configuration (`backend/app.py`)
- Added `expose_headers=['Set-Cookie']` to CORS configuration
- Maintained `supports_credentials=True` for cookie support

#### 3. Authentication Routes (`backend/routes/auth.py`)
- **Google OAuth callback**: Now sets JWT token as HttpOnly cookie instead of URL parameter
- **Email login**: Returns user data in JSON and sets JWT cookie in response headers
- **New logout endpoint**: `POST /api/auth/logout` - Clears authentication cookie
- Token expiry increased to 7 days for all login methods

#### 4. Contact Route (`backend/routes/contact.py`)
- Removed `@jwt_required()` decorator - contact form now works without authentication
- Contact page is now publicly accessible

### Frontend Changes

#### 1. App Routing (`frontend/src/App.js`)
- **Public routes** (no authentication required):
  - `/` - Home page
  - `/packages` - Trek packages information
  - `/gallery` - Photo gallery
  - `/contact` - Contact form
  
- **Protected routes** (authentication required):
  - `/booking` - Booking form (requires login)
  - `/mybooking` - User bookings management (requires login)

#### 2. Authentication Context (`frontend/src/contexts/AuthContext.js`)
- Removed all localStorage token management
- Removed `token` state variable
- All API calls now use `credentials: 'include'` to send cookies
- `fetchUserInfo()` - Now relies on cookie authentication
- `loginEmail()` - Cookie is set by backend, no longer stores token
- `handleAuthCallback()` - Simplified, just fetches user info (cookie already set)
- `logout()` - Calls backend logout endpoint to clear cookie

#### 3. Auth Callback Component (`frontend/src/components/auth/AuthCallback.js`)
- Simplified to only handle redirect after OAuth login
- No longer parses token from URL (cookie is already set by backend)

#### 4. Entity Services (`frontend/src/entities/all.js`)
- Removed `getAuthHeaders()` function and localStorage token usage
- All `apiCall()` requests now include `credentials: 'include'`
- Removed Authorization header logic (cookies handled automatically)

#### 5. Contact Page (`frontend/src/pages/contact.js`)
- Removed `token` dependency from `useAuth()`
- Updated fetch call to use `credentials: 'include'`
- Contact form now works without authentication

## Security Improvements

1. **HttpOnly Cookies**: Tokens stored in HttpOnly cookies are not accessible via JavaScript, protecting against XSS attacks
2. **No localStorage**: Tokens are no longer exposed in localStorage
3. **Automatic Cookie Handling**: Browsers handle cookie security automatically
4. **7-day Token Expiry**: Improved user experience while maintaining security

## Migration Notes

### For Development
- Ensure CORS is properly configured for your development URLs
- `JWT_COOKIE_SECURE` should be `False` for local development (HTTP)

### For Production
- Set `JWT_COOKIE_SECURE=True` in environment variables (requires HTTPS)
- Consider enabling `JWT_COOKIE_CSRF_PROTECT` for additional security
- Update `CORS_ORIGINS` to include only production domains

## Testing Checklist

- [ ] Can access home page without login
- [ ] Can access packages page without login
- [ ] Can access gallery page without login
- [ ] Can access contact page without login
- [ ] Can submit contact form without login
- [ ] Redirected to login when accessing /booking without authentication
- [ ] Redirected to login when accessing /mybooking without authentication
- [ ] Google OAuth login sets cookie and redirects correctly
- [ ] Email/password login sets cookie and works correctly
- [ ] Can access /booking after login
- [ ] Can access /mybooking after login
- [ ] Logout clears cookie and requires re-authentication for protected pages
- [ ] Cookie persists across browser refresh (7-day expiry)

## Environment Variables

Make sure these are set in your `.env` file:

```env
# JWT Configuration
JWT_SECRET_KEY=your-secret-key-here
JWT_COOKIE_SECURE=False  # Set to True in production with HTTPS

# CORS Origins (comma-separated)
CORS_ORIGINS=http://localhost:3000,http://localhost:5001

# Other existing variables...
```

## Rollback Plan

If issues occur, previous token-based auth can be restored by:
1. Reverting changes to `backend/config.py` (remove cookie configuration)
2. Reverting changes to `backend/routes/auth.py` (restore token responses)
3. Reverting changes to `frontend/src/contexts/AuthContext.js` (restore localStorage)
4. Reverting changes to `frontend/src/entities/all.js` (restore Authorization headers)
5. Reverting changes to `frontend/src/App.js` (restore ProtectedRoute for all pages)

## Additional Notes

- The `user_login` table in the database remains unchanged and continues to track login history
- All booking and trek date functionality remains the same
- Admin features continue to work as before
- Email notifications are unaffected by this change
