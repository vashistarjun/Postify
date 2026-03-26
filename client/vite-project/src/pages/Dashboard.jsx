import { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { todoAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import {
    LoadingSpinner,
    ErrorMessage,
    SuccessMessage,
    InputField,
    Button,
    TodoCard,
} from '../components/Common';

const Dashboard = () => {
    const navigate = useNavigate();
    const { logout, token } = useContext(AuthContext);

    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Form states
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [photo, setPhoto] = useState(null);
    const [photoFile, setPhotoFile] = useState(null);
    const [formLoading, setFormLoading] = useState(false);

    const userId = localStorage.getItem('userId');

    const fetchTodos = useCallback(async () => {
        setLoading(true);
        try {
            const response = await todoAPI.getTodos(userId);
            // Filter only approved todos
            const approvedTodos = response.data.data?.filter(
                (todo) => todo.status === 'approve'
            ) || [];
            setTodos(approvedTodos);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch todos');
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        if (!token || !userId) {
            navigate('/login');
            return;
        }
        fetchTodos();
    }, [token, userId, navigate, fetchTodos]);

    const handleAddTodo = () => {
        setEditingId(null);
        setTitle('');
        setDescription('');
        setPhoto(null);
        setPhotoFile(null);
        setShowForm(true);
    };

    const handleEditTodo = (todo) => {
        setEditingId(todo._id);
        setTitle(todo.title);
        setDescription(todo.description || '');
        setPhoto(todo.photo || null);
        setPhotoFile(null);
        setShowForm(true);
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setPhotoFile(file);
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhoto(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!title.trim()) {
            setError('Title is required');
            return;
        }

        setFormLoading(true);
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            if (photoFile) {
                formData.append('photo', photoFile);
            }

            if (editingId) {
                await todoAPI.updateTodo(editingId, formData);
                setSuccess('Todo updated successfully!');
            } else {
                await todoAPI.createTodo(formData);
                setSuccess('Todo created successfully!');
            }

            setShowForm(false);
            fetchTodos();
        } catch (err) {
            setError(err.response?.data?.message || 'Operation failed');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDeleteTodo = async (id) => {
        if (window.confirm('Are you sure you want to delete this todo?')) {
            try {
                await todoAPI.deleteTodo(id);
                setSuccess('Todo deleted successfully!');
                fetchTodos();
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to delete todo');
            }
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>My Todos</h1>
                <div style={styles.headerActions}>
                    <Button label="Add Todo" onClick={handleAddTodo} variant="primary" />
                    <Button
                        label="Logout"
                        onClick={() => {
                            logout();
                            navigate('/login');
                        }}
                        variant="secondary"
                    />
                </div>
            </header>

            <main style={styles.main}>
                <ErrorMessage message={error} onClose={() => setError('')} />
                <SuccessMessage message={success} onClose={() => setSuccess('')} />

                {showForm && (
                    <div style={styles.formSection}>
                        <h2 style={styles.formTitle}>
                            {editingId ? 'Edit Todo' : 'Create New Todo'}
                        </h2>
                        <form onSubmit={handleSubmitForm}>
                            <InputField
                                label="Title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter todo title"
                                required
                            />

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Enter todo description (optional)"
                                    style={styles.textarea}
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Photo</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoChange}
                                    style={styles.fileInput}
                                />
                            </div>

                            {photo && (
                                <div style={styles.photoPreview}>
                                    <img src={photo} alt="Preview" style={styles.previewImage} />
                                </div>
                            )}

                            <div style={styles.formActions}>
                                <Button
                                    label={editingId ? 'Update' : 'Create'}
                                    type="submit"
                                    variant="primary"
                                    loading={formLoading}
                                />
                                <Button
                                    label="Cancel"
                                    type="button"
                                    variant="secondary"
                                    onClick={() => setShowForm(false)}
                                />
                            </div>
                        </form>
                    </div>
                )}

                {todos.length === 0 ? (
                    <div style={styles.emptyState}>
                        <p>No approved todos yet. Create one to get started!</p>
                    </div>
                ) : (
                    <div style={styles.todosList}>
                        {todos.map((todo) => (
                            <TodoCard
                                key={todo._id}
                                todo={todo}
                                onEdit={handleEditTodo}
                                onDelete={handleDeleteTodo}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
    },
    header: {
        backgroundColor: '#fff',
        padding: '20px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: '28px',
        fontWeight: '700',
        color: '#333',
        margin: 0,
    },
    headerActions: {
        display: 'flex',
        gap: '10px',
    },
    main: {
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '40px 20px',
    },
    formSection: {
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        marginBottom: '30px',
    },
    formTitle: {
        fontSize: '20px',
        fontWeight: '600',
        marginBottom: '20px',
        color: '#333',
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
    textarea: {
        width: '100%',
        padding: '12px',
        fontSize: '16px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontFamily: 'inherit',
        boxSizing: 'border-box',
        minHeight: '120px',
        resize: 'vertical',
    },
    fileInput: {
        display: 'block',
        marginTop: '8px',
    },
    photoPreview: {
        marginBottom: '20px',
        textAlign: 'center',
    },
    previewImage: {
        maxWidth: '100%',
        maxHeight: '300px',
        borderRadius: '4px',
    },
    formActions: {
        display: 'flex',
        gap: '10px',
    },
    emptyState: {
        textAlign: 'center',
        padding: '40px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        color: '#666',
    },
    todosList: {
        display: 'grid',
        gap: '20px',
    },
};

export default Dashboard;
