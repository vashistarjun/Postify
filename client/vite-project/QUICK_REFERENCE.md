# Frontend Quick Reference

## File Structure at a Glance

```
src/
├── components/Common.jsx         → All reusable UI components
├── context/AuthContext.jsx       → Authentication state
├── pages/                        → Page components
│   ├── Home.jsx                 → Landing page
│   ├── Login.jsx                → Login form
│   ├── Signup.jsx               → Signup form
│   ├── OTPPage.jsx              → OTP verification (both signup & login)
│   ├── Dashboard.jsx            → User todo management
│   └── AdminDashboard.jsx       → Admin todo management
├── routes/ProtectedRoute.jsx     → Route protection wrapper
├── services/api.js               → Axios configuration & API functions
├── App.jsx                       → Main app with routing
├── main.jsx                      → App entry point with providers
└── index.css                     → Global styles
```

## Component Quick Reference

### AuthContext Methods
```javascript
import { AuthContext } from './context/AuthContext';
const { token, role, login, logout } = useContext(AuthContext);

login(token, userData, role)     // Store auth data
logout()                         // Clear auth data
```

### Common Components (All in src/components/Common.jsx)
```javascript
import {
  LoadingSpinner,    // <LoadingSpinner />
  ErrorMessage,      // <ErrorMessage message="Error" onClose={() => {}} />
  SuccessMessage,    // <SuccessMessage message="Success" />
  InputField,        // <InputField label="Name" value={} onChange={} />
  Button,            // <Button label="Click" onClick={} />
  TodoCard,          // <TodoCard todo={} onEdit={} onDelete={} />
  FormContainer,     // <FormContainer title="Title"> ... </FormContainer>
} from '../components/Common';
```

### ProtectedRoute
```javascript
import ProtectedRoute from './routes/ProtectedRoute';

<Route path="/dashboard" element={
  <ProtectedRoute allowedRole="user">
    <Dashboard />
  </ProtectedRoute>
} />
```

## API Functions Quick Reference

### Authentication
```javascript
import { authAPI } from '../services/api';

authAPI.signup({ name, email, password })
authAPI.login({ email, password })
authAPI.sendOTP({ email })
authAPI.verifyOTPSignup({ email, otp, name })
authAPI.verifyOTPLogin({ email, otp })
```

### Todo Operations
```javascript
import { todoAPI } from '../services/api';

todoAPI.createTodo(formData)          // Create
todoAPI.getTodos(userId)              // Get all approved todos
todoAPI.updateTodo(id, formData)      // Update
todoAPI.deleteTodo(id)                // Delete
```

### Admin Operations
```javascript
import { adminAPI } from '../services/api';

adminAPI.getPendingTodos()            // Pending todos
adminAPI.getRejectedTodos()           // Rejected todos
adminAPI.getAllTodos()                // All todos
adminAPI.getTodoById(id)              // Single todo
adminAPI.approveTodo(id)              // Approve
adminAPI.rejectTodo(id)               // Reject
```

## Common Hooks Usage

### Use Auth Context
```javascript
const { user, token, role, isAuthenticated } = useContext(AuthContext);
```

### Use Navigation
```javascript
const navigate = useNavigate();
navigate('/dashboard');
navigate('/login');
```

### Fetch Data on Mount
```javascript
useEffect(() => {
  fetchData();
}, []); // Empty dependency array = runs once on mount
```

### Cleanup Function
```javascript
useEffect(() => {
  const fetch = async () => { /* ... */ };
  fetch();
  
  return () => {
    // Cleanup if needed
  };
}, [dependency]);
```

## Common Patterns

### Handling Form Submission
```javascript
const [value, setValue] = useState('');
const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    await someApiCall({ value });
    // Success - show message or redirect
  } catch (err) {
    setError(err.response?.data?.message);
  } finally {
    setLoading(false);
  }
};
```

### Protected Navigation
```javascript
if (!token) {
  navigate('/login');
  return;
}
```

### Error Display
```javascript
const [error, setError] = useState('');

<ErrorMessage message={error} onClose={() => setError('')} />
```

### Loading States
```javascript
if (loading) return <LoadingSpinner />;

<Button loading={loading} /> 
```

## localStorage Methods

```javascript
// Save
localStorage.setItem('key', 'value');
localStorage.setItem('authToken', token);

// Get
const value = localStorage.getItem('key');
const token = localStorage.getItem('authToken');

// Remove
localStorage.removeItem('key');
localStorage.clear(); // Remove all

// Check existence
if (localStorage.getItem('key')) { /* ... */ }
```

## Routing Patterns

### Link to Page
```javascript
import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();

navigate('/dashboard');  // Push new route
navigate(-1);           // Go back
navigate('/', { replace: true }); // Replace current in history
```

### Get URL Parameters
```javascript
const [searchParams] = useSearchParams();
const mode = searchParams.get('mode'); // From ?mode=signup
```

## Common Errors & Fixes

| Error | Fix |
|-------|-----|
| Can't find module | Run `npm install` |
| 401 errors | Check token in localStorage |
| Blank page | Check browser console for errors |
| API not connecting | Ensure backend is running on port 3000 |
| Redirect loops | Check role in JWT payload |

## State Update Pattern

```javascript
// Bad - causes stale closures
const [todos, setTodos] = useState([]);
const fetchData = () => {
  setTodos([...todos, newItem]); // todos might be stale
};

// Good - use callback
setTodos(prevTodos => [...prevTodos, newItem]);

// Or fetch fresh data
const fetchData = async () => {
  const response = await api.getTodos();
  setTodos(response.data);
};
```

## Styling Quick Reference

```javascript
// Inline style object
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
  }
};

// Use in JSX
<div style={styles.container}> ... </div>
<div style={{ ...styles.container, color: 'blue' }}> ... </div>
```

## Form Input Pattern

```javascript
const [formData, setFormData] = useState({
  name: '',
  email: '',
});

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: value
  }));
};

// In JSX
<input 
  name="name" 
  value={formData.name} 
  onChange={handleChange} 
/>
```

## List Rendering

```javascript
// Good - with key
{todos.map(todo => (
  <div key={todo._id}>{todo.title}</div>
))}

// Filtering
{todos.filter(t => t.status === 'approve').map(t => (
  <TodoCard key={t._id} todo={t} />
))}
```

## Conditional Rendering

```javascript
// If/else
{isLoading ? <LoadingSpinner /> : <Content />}

// And
{isAuthenticated && <Dashboard />}

// Or
{token || <LoginPage />}

// Switch-like
{status === 'pending' ? (
  <PendingView />
) : status === 'approved' ? (
  <ApprovedView />
) : (
  <RejectedView />
)}
```

## FormData for File Upload

```javascript
const formData = new FormData();
formData.append('title', 'My Todo');
formData.append('photo', fileInput.files[0]);

// Send with axios - axios auto-sets Content-Type
await api.post('/create-todo', formData);
```

## Token Decoding

```javascript
// Decode JWT without library
const token = 'eyJhbGc...';
const tokenParts = token.split('.');
const payload = JSON.parse(atob(tokenParts[1]));
console.log(payload); // { id: '...', iat: 123 }
```

## Common HTTP Status Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | Success | Proceed |
| 201 | Created | Proceed |
| 400 | Bad request | Show error message |
| 401 | Unauthorized | Redirect to login |
| 403 | Forbidden | Redirect to dashboard |
| 404 | Not found | Show not found |
| 500 | Server error | Show error message |

## Debug Tips

```javascript
// Log auth state
const { token, role } = useContext(AuthContext);
console.log('Token:', token);
console.log('Role:', role);

// Log API response
try {
  const res = await api.login(data);
  console.log('Response:', res.data);
} catch (err) {
  console.log('Error:', err.response?.data);
}

// Check localStorage
console.log('Stored:', localStorage.getItem('authToken'));

// Monitor renders
console.log('Component rendered');
```

## Deploy Commands

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Git Commands (if using version control)

```bash
git add .
git commit -m "Add frontend implementation"
git push origin main
```

## NPM Commands

```bash
npm install              # Install dependencies
npm install axios        # Add new package
npm start               # Start dev server (if configured)
npm run dev             # Start dev server (Vite)
npm run build           # Build for production
npm run preview         # Preview production build
npm run lint            # Run linter
```
