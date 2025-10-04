# Production Cookie Authentication Fix

## Problem
The `/api/auth/me` endpoint was returning **401 Unauthorized** in production, but working fine locally.

### Root Cause
Cross-origin cookie authentication in production requires specific cookie settings:

**Before (Incorrect):**
```python
JWT_COOKIE_SECURE = False  # ❌ Cookies not sent over HTTPS
JWT_COOKIE_SAMESITE = 'Lax'  # ❌ Blocks cross-origin requests
```

**After (Correct):**
```python
JWT_COOKIE_SECURE = True  # ✅ Required for HTTPS
JWT_COOKIE_SAMESITE = 'None'  # ✅ Allows cross-origin cookies
```

## The Fix

### What Changed in `config.py`:
1. **Auto-detection of production environment** - checks if URLs start with `https://`
2. **`JWT_COOKIE_SECURE = True`** in production - ensures cookies are only sent over HTTPS
3. **`JWT_COOKIE_SAMESITE = 'None'`** in production - allows cross-origin cookie transmission
4. **`JWT_COOKIE_SAMESITE = 'Lax'`** in development - more secure for same-origin local testing

### Why This Works:

| Setting | Local (HTTP) | Production (HTTPS) |
|---------|-------------|-------------------|
| `JWT_COOKIE_SECURE` | `False` | `True` |
| `JWT_COOKIE_SAMESITE` | `Lax` | `None` |
| Cross-origin cookies | ❌ Not needed | ✅ Required |

## Deployment Steps

1. **Commit the changes:**
   ```bash
   git add backend/config.py
   git commit -m "Fix: Enable cross-origin cookies for production authentication"
   git push
   ```

2. **Redeploy on Render** - the changes will auto-deploy

3. **Test the fix:**
   - Clear browser cookies for your production site
   - Log in again via Google OAuth or email/password
   - Verify that `/api/auth/me` now returns user data instead of 401

## Technical Details

### Cookie Requirements for Cross-Origin Authentication:

When frontend (`https://nahalprat-frontend.onrender.com`) and backend (`https://nahalprat-backend.onrender.com`) are on different domains:

1. **Secure flag** - Browser requires `Secure=true` for cookies with `SameSite=None`
2. **SameSite=None** - Tells browser to send cookies with cross-origin requests
3. **CORS credentials** - `credentials: true` in fetch requests (already configured)
4. **CORS headers** - `Access-Control-Allow-Credentials: true` (already configured in Flask-CORS)

### Why It Worked Locally:

Local development uses `http://localhost` for both frontend and backend, which:
- Same origin (same domain) - no cross-origin issues
- `SameSite=Lax` is sufficient for same-origin requests
- `Secure=false` is allowed for HTTP

## Verification

After deploying, check the Set-Cookie header in production:
```
Set-Cookie: access_token_cookie=<token>; Path=/; SameSite=None; Secure; HttpOnly
```

Key flags:
- ✅ `SameSite=None` - allows cross-origin
- ✅ `Secure` - required for HTTPS
- ✅ `HttpOnly` - prevents JavaScript access (security)

## Related Documentation
- [MDN: SameSite Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite)
- [Flask-JWT-Extended Cookie Configuration](https://flask-jwt-extended.readthedocs.io/en/stable/options/#cookie-options)
