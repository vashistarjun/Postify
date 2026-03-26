# Todo App - Frontend

A complete React frontend for a full-stack Todo application with JWT authentication, OTP verification, and role-based admin dashboard.

## Features

### Authentication
- ✅ Email/Password Signup & Login
- ✅ OTP-based Signup & Login
- ✅ JWT Token Management
- ✅ Persistent Authentication (localStorage)
- ✅ Protected Routes with Role-based Redirection

### Todo Management (Users)
- ✅ Create Todos with Optional Photos
- ✅ View Approved Todos Only
- ✅ Update Own Todos
- ✅ Delete Own Todos

### Admin Features
- ✅ View All Todos
- ✅ View Pending Todos (Approve/Reject)
- ✅ View Rejected Todos
- ✅ Approve/Reject Pending Todos

## Tech Stack

- **React 19.2.0** - Frontend Framework
- **React Router 7.13.1** - Client-side Routing
- **Axios 1.6.0** - HTTP Client with Interceptors
- **Vite 7.3.1** - Build Tool & Dev Server

## Project Structure

```
src/
├── components/
│   └── Common.jsx           # Reusable UI components
├── context/
│   └── AuthContext.jsx      # Authentication state management
├── pages/
│   ├── Home.jsx             # Landing page
│   ├── Login.jsx            # Login page
│   ├── Signup.jsx           # Signup page
│   ├── OTPPage.jsx          # OTP verification page
│   ├── Dashboard.jsx        # User dashboard
│   └── AdminDashboard.jsx   # Admin dashboard
├── routes/
│   └── ProtectedRoute.jsx   # Protected route wrapper
├── services/
│   └── api.js               # Axios configuration & API calls
├── App.jsx                  # Main app component with routing
├── main.jsx                 # Application entry point
└── index.css                # Global styles
```

## Installation & Setup

### Prerequisites
- Node.js 14.x or higher
- npm or yarn

### 1. Install Dependencies
```bash
cd client/vite-project
npm install
```

### 2. Configure Backend URL
Update the API_URL in `src/services/api.js` if your backend is running on a different port:
```javascript
const API_URL = 'http://localhost:3000/todo';
```

### 3. Start Development Server
```bash
npm run dev
```
The app will be available at `http://localhost:5173` (or another available port)

## Key Components

### 1. AuthContext (Context Management)
Manages global authentication state including:
- `user` - Current user data
- `token` - JWT authentication token
- `role` - User role (user/admin)
- `isAuthenticated` - Authentication status
- `login()` - Login function (saves token & user data)
- `logout()` - Logout function (clears all auth data)

### 2. Protected Routes
Wraps protected pages and redirects unauthenticated/unauthorized users:
```jsx
<Route path="/dashboard" element={
  <ProtectedRoute allowedRole="user">
    <Dashboard />
  </ProtectedRoute>
} />
```

### 3. API Service (Axios)
Fully configured with:
- Request interceptors (auto attach JWT token)
- Response interceptors (handle 401 errors)
- Pre-configured API endpoints
- Support for FormData (file uploads)

## API Endpoints Used

### Authentication
- `POST /signup` - Regular signup
- `POST /login` - Regular login
- `POST /send-otp` - Send OTP to email
- `POST /verify-otp-signup` - OTP signup
- `POST /verify-otp-login` - OTP login

### User Todos
- `POST /create-todo` - Create new todo
- `GET /get-todo/:userId` - Get user's approved todos
- `PATCH /update-todo/:id` - Update todo
- `DELETE /delete-todo/:id` - Delete todo

### Admin Todos
- `GET /pending-todo` - Get pending todos
- `GET /rejected-todo` - Get rejected todos
- `GET /get-all` - Get all todos
- `GET /get-todobyId?id=:id` - Get specific todo
- `PATCH /approve/:id` - Approve todo
- `PATCH /reject/:id` - Reject todo

## Authentication Flow

### Login/Signup Flow
1. User submits credentials/OTP
2. API returns JWT token
3. Token decoded to extract user ID and role
4. Token stored in localStorage
5. User redirected to dashboard

### Protected Routes
```
Unauthenticated → /login
Admin User → /admin-dashboard
Regular User → /dashboard
```

## Local Storage

The app stores the following in localStorage:
- `authToken` - JWT token for API requests
- `userRole` - User role (user/admin)
- `userData` - User information (JSON)
- `userId` - User ID for API calls

Clear localStorage to logout (handled automatically by logout function)

## Reusable Components

### Common.jsx Exports:
- `LoadingSpinner` - Loading indicator
- `ErrorMessage` - Error alert display
- `SuccessMessage` - Success notification
- `InputField` - Form input with validation
- `Button` - Styled button component
- `TodoCard` - Todo display card
- `FormContainer` - Form page wrapper

## Error Handling

The app handles errors gracefully:
- **401 Unauthorized** - Auto redirects to login
- **4xx/5xx Errors** - Displays user-friendly messages
- **Network Errors** - Shows connection error messages
- **Form Validation** - Client-side validation with error display

## State Management

Uses React hooks for state management:
- `useState` - Local component state
- `useContext` - Access authentication state
- `useEffect` - Side effects and data fetching
- `useNavigate` - Programmatic navigation

## File Upload Support

The Dashboard supports photo uploads with todos:
- Accepts image files only
- Shows image preview before upload
- Sends as FormData (multipart/form-data)
- Backend handles file storage

## Styling

- Inline styles for component-level styling
- Global styles in index.css
- Responsive design with media queries
- Clean, modern UI with proper spacing

## Development Tips

1. **Token Expired?** - Clear localStorage and login again
2. **CORS Issues?** - Ensure backend is running with CORS enabled
3. **API Calls Failing?** - Check backend URL in api.js
4. **State Not Persisting?** - Check if token is saved in localStorage
5. **Role-based Navigation?** - Verify user role in localStorage

## Build for Production

```bash
npm run build
```
Creates optimized production build in `dist/` folder

## Preview Production Build
```bash
npm run preview
```

## Common Issues & Solutions

### Issue: "Cannot find module 'axios'"
**Solution:** Run `npm install`

### Issue: 401 Unauthorized on API calls
**Solution:** Ensure token is in localStorage and header format is correct: `Bearer <token>`

### Issue: Redirected to login after choosing role
**Solution:** Check if JWT payload contains the correct role field

### Issue: File upload not working
**Solution:** Ensure you're using FormData and sending with `Content-Type: multipart/form-data`

## Future Enhancements

- [ ] Redux for complex state management
- [ ] Form validation library (react-hook-form)
- [ ] UI component library (Material-UI, Chakra)
- [ ] Testing (Jest, React Testing Library)
- [ ] E2E testing (Cypress, Playwright)
- [ ] Pagination for todos list
- [ ] Search/Filter functionality
- [ ] Todo categories/tags
- [ ] Drag-drop reordering
- [ ] Dark mode support

## Support

For issues or questions, check:
1. Backend is running on correct port
2. API endpoints match backend routes
3. JWT token is being sent in Authorization header
4. Role field exists in JWT payload

## License

ISC
