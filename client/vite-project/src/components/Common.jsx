// Common Loading Spinner Component
export const LoadingSpinner = () => {
  return (
    <div style={styles.spinnerContainer}>
      <div style={styles.spinner}></div>
      <p style={styles.loadingText}>Loading...</p>
    </div>
  );
};

// Common Error Message Component
export const ErrorMessage = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div style={styles.errorAlert}>
      <span style={styles.errorText}>{message}</span>
      {onClose && (
        <button onClick={onClose} style={styles.closeBtn}>
          ✕
        </button>
      )}
    </div>
  );
};

// Success Message Component
export const SuccessMessage = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div style={styles.successAlert}>
      <span style={styles.successText}>{message}</span>
      {onClose && (
        <button onClick={onClose} style={styles.closeBtn}>
          ✕
        </button>
      )}
    </div>
  );
};

// Input Field Component
export const InputField = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
}) => {
  return (
    <div style={styles.formGroup}>
      <label style={styles.label}>
        {label}
        {required && <span style={styles.required}>*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          ...styles.input,
          borderColor: error ? '#dc3545' : '#ddd',
        }}
      />
      {error && <span style={styles.errorText}>{error}</span>}
    </div>
  );
};

// Button Component
export const Button = ({
  label,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth = false,
}) => {
  const buttonStyle = {
    ...styles.button,
    ...styles[`button${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled ? 0.6 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
  };

  return (
    <button
      style={buttonStyle}
      onClick={onClick}
      type={type}
      disabled={disabled || loading}
    >
      {loading ? 'Loading...' : label}
    </button>
  );
};

// Todo Card Component
export const TodoCard = ({
  todo,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  isAdmin = false,
}) => {
  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h3 style={styles.cardTitle}>{todo.title}</h3>
        <span
          style={{
            ...styles.badge,
            backgroundColor:
              todo.status === 'approve'
                ? '#28a745'
                : todo.status === 'rejected'
                ? '#dc3545'
                : '#ffc107',
          }}
        >
          {todo.status}
        </span>
      </div>

      {todo.description && (
        <p style={styles.cardDescription}>{todo.description}</p>
      )}

      {todo.photo && (
        <img src={todo.photo} alt="todo" style={styles.cardImage} />
      )}

      <div style={styles.cardActions}>
        {!isAdmin && (
          <>
            <button
              onClick={() => onEdit(todo)}
              style={styles.actionBtn}
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(todo._id)}
              style={{ ...styles.actionBtn, backgroundColor: '#dc3545' }}
            >
              Delete
            </button>
          </>
        )}

        {isAdmin && todo.status === 'pending' && (
          <>
            <button
              onClick={() => onApprove(todo._id)}
              style={{
                ...styles.actionBtn,
                backgroundColor: '#28a745',
              }}
            >
              Approve
            </button>
            <button
              onClick={() => onReject(todo._id)}
              style={{
                ...styles.actionBtn,
                backgroundColor: '#dc3545',
              }}
            >
              Reject
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// Form Container Component
export const FormContainer = ({ children, title, subtitle }) => {
  return (
    <div style={styles.formContainer}>
      <div style={styles.formBox}>
        <h1 style={styles.formTitle}>{title}</h1>
        {subtitle && <p style={styles.formSubtitle}>{subtitle}</p>}
        {children}
      </div>
    </div>
  );
};

// Styles Object
const styles = {
  spinnerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f8f9fa',
  },
  spinner: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    border: '4px solid #e0e0e0',
    borderTop: '4px solid #007bff',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    marginTop: '20px',
    fontSize: '18px',
    color: '#333',
  },
  errorAlert: {
    backgroundColor: '#f8d7da',
    boundary: '1px solid #f5c6cb',
    color: '#721c24',
    padding: '12px 20px',
    borderRadius: '4px',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  successAlert: {
    backgroundColor: '#d4edda',
    boundary: '1px solid #c3e6cb',
    color: '#155724',
    padding: '12px 20px',
    borderRadius: '4px',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: {
    color: '#dc3545',
    fontSize: '14px',
    marginTop: '5px',
  },
  successText: {
    color: '#155724',
    fontSize: '14px',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    padding: 0,
    color: 'inherit',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '500',
    color: '#333',
  },
  required: {
    color: '#dc3545',
    marginLeft: '4px',
  },
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s',
  },
  button: {
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    marginRight: '10px',
  },
  buttonPrimary: {
    backgroundColor: '#007bff',
    color: '#fff',
  },
  buttonSecondary: {
    backgroundColor: '#6c757d',
    color: '#fff',
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    color: '#007bff',
    border: '2px solid #007bff',
  },
  buttonDanger: {
    backgroundColor: '#dc3545',
    color: '#fff',
  },
  card: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#333',
    margin: 0,
  },
  badge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#fff',
    textTransform: 'capitalize',
  },
  cardDescription: {
    color: '#666',
    marginBottom: '15px',
    lineHeight: '1.6',
  },
  cardImage: {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '4px',
    marginBottom: '15px',
    maxHeight: '300px',
  },
  cardActions: {
    display: 'flex',
    gap: '10px',
    marginTop: '15px',
  },
  actionBtn: {
    padding: '8px 16px',
    fontSize: '14px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  formContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    padding: '20px',
  },
  formBox: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '500px',
  },
  formTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#333',
    marginBottom: '10px',
    marginTop: 0,
  },
  formSubtitle: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '25px',
    margin: 0,
  },
};

// Add CSS animation for spinner
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
document.head.appendChild(style);
