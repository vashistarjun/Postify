# Frontend Setup & Configuration Guide

## Quick Start

### 1. Install Dependencies
```bash
cd client/vite-project
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Ensure Backend is Running
```bash
# In another terminal, from server directory
cd server
npm install
npm run dev
```

## Configuration

### Backend URL
The frontend expects the backend to be running at `http://localhost:3000/todo`

If your backend is on a different URL, update `src/services/api.js`:
```javascript
const API_URL = 'http://localhost:YOUR_PORT/todo';
```

### CORS Configuration
Make sure your backend has CORS enabled. In `server.js`:
```javascript
app.use(cors());
```

## Port Information

| Service | Port | URL |
|---------|------|-----|
| Frontend (Vite) | 5173 | http://localhost:5173 |
| Backend (Express) | 3000 | http://localhost:3000 |

## How Everything Works Together

### Authentication Flow

```
User → Sign Up/Login Form
    ↓
API Call (Axios)
    ↓
Backend Verification
    ↓
JWT Token Return
    ↓
Store Token in localStorage
    ↓
Decode Token to Extract User ID/Role
    ↓
Update AuthContext
    ↓
Redirect to Dashboard/Admin Dashboard
```

### Protected Route Flow

```
User Visits /dashboard
    ↓
Check AuthContext.isAuthenticated
    ↓ No token
Redirect to /login
    ↓ Token exists but wrong role
Redirect to correct dashboard
    ↓ Token exists + correct role
Show Dashboard
```

### API Request Flow

```
Component calls API function
    ↓
Request Interceptor adds Authorization header
Authorization: Bearer <token>
    ↓
API call sent to backend
    ↓
Response received
    ↓ Status 401
Response Interceptor clears token & redirect to login
    ↓ Status 200
Return data to component
```

## State Management Diagram

```
AuthContext
  ├── user (current user data)
  ├── token (JWT token)
  ├── role (user/admin)
  ├── isAuthenticated (boolean)
  ├── error (error message)
  └── Methods:
      ├── login(token, user, role)
      ├── logout()
      ├── setAuthError(message)
      └── clearError()

localStorage
  ├── authToken
  ├── userRole
  └── userData
```

## Component Tree

```
App
├── BrowserRouter
│   └── AuthProvider
│       ├── Routes
│       │   ├── Home (public)
│       │   ├── Login (public)
│       │   ├── Signup (public)
│       │   ├── OTPPage (public)
│       │   ├── ProtectedRoute (/dashboard)
│       │   │   └── Dashboard
│       │   └── ProtectedRoute (/admin-dashboard)
│       │       └── AdminDashboard
```

## Environment Variables (Optional)

You can create a `.env` file for configuration:
```
VITE_API_URL=http://localhost:3000/todo
```

Then use it in api.js:
```javascript
const API_URL = import.meta.env.VITE_API_URL;
```

## File Upload Configuration

For file uploads to work:

1. Backend must have multer configured
2. Frontend sends FormData with file
3. Ensure Content-Type is set correctly (axios handles this)

Example request:
```javascript
const formData = new FormData();
formData.append('title', 'My Todo');
formData.append('photo', fileObject);
await axios.post('/create-todo', formData);
```

## JWT Token Structure

The JWT token contains:
```javascript
{
  id: "userId",
  iat: timestamp,
  exp: timestamp
}
```

Note: The backend should return the role in the JWT token. If not, you may need to store it separately.

## Testing the Application

### Test User Account
You can create a test account:
- Email: test@example.com
- Password: password123
- Name: Test User

### Test Admin Account
If you have admin creation setup:
- Create a user first
- Change role in database to "admin"

### Test Flow
1. Home → Sign Up → Create account
2. Login page → Sign in
3. Dashboard → Create todo
4. Admin dashboard → View and approve/reject todos

## Troubleshooting

### Issue: "Blank screen"
- Check browser console for errors
- Verify Node.js version (14+)
- Clear browser cache

### Issue: "Cannot connect to backend"
- Ensure backend is running on port 3000
- Check CORS is enabled in backend
- Verify API_URL is correct

### Issue: "Login fails but no error"
- Check backend console for errors
- Verify user exists in database
- Check password is correct

### Issue: "Protected routes not working"
- Check token is in localStorage
- Verify token format: "Bearer <token>"
- Check JWT_SECRET matches between frontend & backend

### Issue: "File upload fails"
- Ensure multer is configured on backend
- Check file size limits
- Verify image format is supported

## Performance Tips

1. **Lazy load pages** using React.lazy() if needed
2. **Debounce search** if implementing search feature
3. **Paginate todos** for large lists
4. **Cache user data** to reduce API calls
5. **Optimize images** before upload

## Security Notes

1. **Never store passwords** in localStorage
2. **JWT tokens expire** - implement refresh token if needed
3. **Validate inputs** on both frontend and backend
4. **Use HTTPS in production**
5. **Set proper CORS** in production
6. **Use environment variables** for sensitive config

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel/Netlify
1. Connect your GitHub repo
2. Set environment variables
3. Build command: `npm run build`
4. Output directory: `dist`

### Manual Deployment
1. Run `npm run build`
2. Copy `dist` folder contents to hosting provider
3. Configure server to serve index.html for SPA routing

## Next Steps

1. ✅ Install dependencies
2. ✅ Start backend server
3. ✅ Start frontend dev server
4. ✅ Test signup/login
5. ✅ Test todo creation
6. ✅ Test admin features
7. Build for production
8. Deploy

## Documentation

- [React Documentation](https://react.dev)
- [React Router Documentation](https://reactrouter.com)
- [Axios Documentation](https://axios-http.com)
- [Vite Documentation](https://vitejs.dev)

## Support

If you encounter issues:
1. Check the troubleshooting section
2. Review component inline comments
3. Check browser console for errors
4. Verify backend is responding correctly
5. Check network tab in DevTools
