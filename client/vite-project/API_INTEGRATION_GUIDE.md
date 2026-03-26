# API Integration Guide

This document shows exactly how the frontend integrates with the backend API.

## Authentication Endpoints

### 1. Regular Signup
**Endpoint:** `POST /signup`

**Request:**
```javascript
{
  name: "John Doe",
  email: "john@example.com",
  password: "password123"
}
```

**Response (Success):**
```javascript
{
  success: true,
  message: "user created successfully"
}
```

**Frontend Code:**
```jsx
// src/pages/Signup.jsx
const response = await authAPI.signup({ name, email, password });
```

---

### 2. Regular Login
**Endpoint:** `POST /login`

**Request:**
```javascript
{
  email: "john@example.com",
  password: "password123"
}
```

**Response (Success):**
```javascript
{
  success: true,
  message: "Login successful",
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Frontend Handling:**
```jsx
// src/pages/Login.jsx
const response = await authAPI.login({ email, password });
const { token } = response.data;

// Decode token to get user ID
const tokenParts = token.split('.');
const payload = JSON.parse(atob(tokenParts[1]));

// Store in context and localStorage
login(token, { email, id: payload.id }, 'user');
localStorage.setItem('userId', payload.id);
```

---

### 3. Send OTP
**Endpoint:** `POST /send-otp`

**Request:**
```javascript
{
  email: "john@example.com"
}
```

**Response:**
```javascript
{
  success: true,
  message: "OTP sent to email"
}
```

**Frontend Code:**
```jsx
// src/pages/OTPPage.jsx
await authAPI.sendOTP({ email });
```

---

### 4. Verify OTP & Signup
**Endpoint:** `POST /verify-otp-signup`

**Request:**
```javascript
{
  email: "john@example.com",
  otp: "123456",
  name: "John Doe"
}
```

**Response:**
```javascript
{
  success: true,
  message: "user created successfully"
}
```

---

### 5. Verify OTP & Login
**Endpoint:** `POST /verify-otp-login`

**Request:**
```javascript
{
  email: "john@example.com",
  otp: "123456"
}
```

**Response:**
```javascript
{
  success: true,
  message: "Login successful",
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## Todo Endpoints (User)

### 1. Create Todo
**Endpoint:** `POST /create-todo`

**Headers:**
```javascript
{
  Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  Content-Type: "multipart/form-data" // Added by axios automatically
}
```

**Request (FormData):**
```javascript
formData.append('title', 'My First Todo');
formData.append('description', 'This is a test todo');
formData.append('photo', fileObject); // Optional
```

**Response:**
```javascript
{
  success: true,
  message: "Todo created",
  data: {
    _id: "60d5ec49c1234567890abc",
    title: "My First Todo",
    description: "This is a test todo",
    user: "60d5ec49c1234567890userId",
    status: "pending",
    photo: "photo_url"
  }
}
```

**Frontend Code:**
```jsx
// src/pages/Dashboard.jsx
const formData = new FormData();
formData.append('title', title);
formData.append('description', description);
if (photoFile) {
  formData.append('photo', photoFile);
}
await todoAPI.createTodo(formData);
```

---

### 2. Get User's Todos
**Endpoint:** `GET /get-todo/:userId`

**Headers:**
```javascript
{
  Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```javascript
{
  success: true,
  data: [
    {
      _id: "60d5ec49c1234567890abc",
      title: "Todo 1",
      description: "Description 1",
      user: "60d5ec49c1234567890userId",
      status: "approve", // or "pending", "rejected"
      photo: "photo_url",
      createdAt: "2024-03-18T10:00:00Z",
      updatedAt: "2024-03-18T10:00:00Z"
    }
  ]
}
```

**Frontend Code:**
```jsx
const userId = localStorage.getItem('userId');
const response = await todoAPI.getTodos(userId);
const approvedTodos = response.data.data.filter(
  (todo) => todo.status === 'approve'
);
```

---

### 3. Update Todo
**Endpoint:** `PATCH /update-todo/:id`

**Headers:**
```javascript
{
  Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  Content-Type: "multipart/form-data"
}
```

**Request:**
```javascript
formData.append('title', 'Updated Title');
formData.append('description', 'Updated description');
formData.append('photo', fileObject); // Optional
```

**Response:**
```javascript
{
  success: true,
  message: "Todo updated",
  data: { /* updated todo object */ }
}
```

**Frontend Code:**
```jsx
const formData = new FormData();
formData.append('title', title);
formData.append('description', description);
if (photoFile) {
  formData.append('photo', photoFile);
}
await todoAPI.updateTodo(editingId, formData);
```

---

### 4. Delete Todo
**Endpoint:** `DELETE /delete-todo/:id`

**Headers:**
```javascript
{
  Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```javascript
{
  success: true,
  message: "Todo deleted"
}
```

**Frontend Code:**
```jsx
await todoAPI.deleteTodo(todoId);
```

---

## Admin Endpoints

### 1. Get Pending Todos
**Endpoint:** `GET /pending-todo`

**Headers:**
```javascript
{
  Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  // User must have role: "admin" in JWT
}
```

**Response:**
```javascript
{
  success: true,
  data: [
    {
      _id: "60d5ec49c1234567890abc",
      title: "Pending Todo",
      user: { _id: "userId", email: "user@example.com" },
      status: "pending",
      photo: "url"
    }
  ]
}
```

---

### 2. Get Rejected Todos
**Endpoint:** `GET /rejected-todo`

**Response:**
```javascript
{
  success: true,
  data: [
    {
      _id: "60d5ec49c1234567890abc",
      title: "Rejected Todo",
      status: "rejected",
      /* other fields */
    }
  ]
}
```

---

### 3. Get All Todos
**Endpoint:** `GET /get-all`

**Response:**
```javascript
{
  success: true,
  data: [
    /* all todos in system */
  ]
}
```

---

### 4. Approve Todo
**Endpoint:** `PATCH /approve/:id`

**Request:** (No body required)

**Response:**
```javascript
{
  success: true,
  message: "Todo approved",
  data: {
    /* updated todo with status: "approve" */
  }
}
```

**Frontend Code:**
```jsx
// src/pages/AdminDashboard.jsx
await adminAPI.approveTodo(todoId);
```

---

### 5. Reject Todo
**Endpoint:** `PATCH /reject/:id`

**Request:** (No body required)

**Response:**
```javascript
{
  success: true,
  message: "Todo rejected",
  data: {
    /* updated todo with status: "rejected" */
  }
}
```

**Frontend Code:**
```jsx
await adminAPI.rejectTodo(todoId);
```

---

## Authorization Header Format

All protected endpoints require this header:

```javascript
Authorization: "Bearer <JWT_TOKEN>"
```

**How the frontend adds this automatically:**

```javascript
// In src/services/api.js
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## Error Responses

### 401 Unauthorized
```javascript
{
  success: false,
  message: "need to login first.." // or "access denied. Admin Only"
}
```

**Frontend Handling:**
```javascript
// Automatic redirect in response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### 400 Bad Request
```javascript
{
  success: false,
  message: "Email already exists" // or other validation error
}
```

### 500 Server Error
```javascript
{
  success: false,
  message: "server error"
}
```

**Frontend displays errors:**
```javascript
try {
  // API call
} catch (err) {
  setError(err.response?.data?.message || 'Operation failed');
}
```

---

## Complete Login Flow Example

```javascript
// 1. User submits form
const email = "john@example.com";
const password = "password123";

// 2. Frontend calls API
const response = await authAPI.login({ email, password });

// 3. Backend returns token
const { token } = response.data;
// token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwZDVlYzQ5YzEyMzQ1Njc4OTBhYmMiLCJpYXQiOjE3MDM2NTcyMDB9..."

// 4. Decode token locally
const tokenParts = token.split('.');
const payload = JSON.parse(atob(tokenParts[1]));
// payload = { id: "60d5ec49c1234567890abc", iat: 1703657200 }

// 5. Store in context and localStorage
login(token, { email, id: payload.id }, 'user');
localStorage.setItem('authToken', token);
localStorage.setItem('userRole', 'user');
localStorage.setItem('userId', payload.id);

// 6. On next API call, token is automatically added
await todoAPI.getTodos(payload.id);
// Header sent: Authorization: "Bearer eyJhbGc..."

// 7. Backend verifies token and returns data
```

---

## Testing with Postman/cURL

### Login Example (cURL)
```bash
curl -X POST http://localhost:3000/todo/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Create Todo with Token
```bash
curl -X POST http://localhost:3000/todo/create-todo \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "title=My Todo" \
  -F "description=Todo description" \
  -F "photo=@/path/to/photo.jpg"
```

---

## Key Points

1. **Token Format**: Always `Bearer <token>` (with space)
2. **Content-Type**: Axios handles this automatically
3. **FormData**: Used for file uploads, axios sets correct header
4. **Error Handling**: Check `error.response?.data?.message`
5. **Token Expiry**: Set to 7 days in backend
6. **CORS**: Must be enabled in backend
7. **localStorage**: Token and user data persisted across sessions

---

## Debugging Tips

1. **Check Network Tab** in browser DevTools to see actual requests/responses
2. **Check Console** for JavaScript errors
3. **Check localStorage** to verify token is stored
4. **Verify Token** at jwt.io if you suspect encoding issues
5. **Check Backend Logs** to see what server is receiving
