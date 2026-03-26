import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, LoadingSpinner, ErrorMessage } from '../components/Common';

const BrowseTodos = () => {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchAllTodos();
    }, []);

    const fetchAllTodos = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:3000/todo/get-all');
            setTodos(response.data.data || []);
        } catch (err) {
            setError('Failed to fetch todos. Please try again.');
            console.error('Error fetching todos:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Browse All Todos</h1>
                <p style={styles.subtitle}>Explore todos shared by the community</p>
                <div style={styles.actions}>
                    <Button
                        label="Back to Home"
                        onClick={() => navigate('/')}
                        variant="secondary"
                    />
                    <Button
                        label="Sign Up to Create"
                        onClick={() => navigate('/signup')}
                        variant="primary"
                    />
                </div>
            </div>

            <ErrorMessage message={error} onClose={() => setError('')} />

            <div style={styles.todosContainer}>
                {todos.length === 0 ? (
                    <div style={styles.emptyState}>
                        <h3>No todos found</h3>
                        <p>Be the first to create a todo!</p>
                        <Button
                            label="Sign Up Now"
                            onClick={() => navigate('/signup')}
                            variant="primary"
                        />
                    </div>
                ) : (
                    todos.map((todo) => (
                        <div key={todo._id} style={styles.todoCard}>
                            <h3 style={styles.todoTitle}>{todo.title}</h3>
                            <p style={styles.todoDescription}>{todo.description}</p>
                            {todo.photo && (
                                <img
                                    src={`http://localhost:3000/${todo.photo}`}
                                    alt="Todo"
                                    style={styles.todoImage}
                                />
                            )}
                            <div style={styles.todoMeta}>
                                <span style={styles.userInfo}>
                                    By: {todo.user?.name || 'Anonymous'}
                                </span>
                                <span style={styles.statusBadge}>
                                    Status: {todo.status || 'Pending'}
                                </span>
                                <span style={styles.date}>
                                    Created: {new Date(todo.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        padding: '20px',
    },
    header: {
        textAlign: 'center',
        marginBottom: '30px',
    },
    title: {
        fontSize: '36px',
        fontWeight: '700',
        color: '#333',
        marginBottom: '10px',
    },
    subtitle: {
        fontSize: '18px',
        color: '#666',
        marginBottom: '20px',
    },
    actions: {
        display: 'flex',
        gap: '15px',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    todosContainer: {
        maxWidth: '800px',
        margin: '0 auto',
    },
    todoCard: {
        backgroundColor: '#fff',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    todoTitle: {
        fontSize: '24px',
        fontWeight: '600',
        color: '#333',
        marginBottom: '10px',
    },
    todoDescription: {
        color: '#666',
        lineHeight: '1.6',
        marginBottom: '15px',
    },
    todoImage: {
        maxWidth: '100%',
        height: 'auto',
        borderRadius: '4px',
        marginBottom: '15px',
        maxHeight: '300px',
    },
    todoMeta: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '14px',
        color: '#888',
        flexWrap: 'wrap',
        gap: '10px',
    },
    userInfo: {
        fontWeight: '500',
        color: '#555',
    },
    statusBadge: {
        backgroundColor: '#e9ecef',
        padding: '4px 8px',
        borderRadius: '4px',
        fontWeight: '500',
        textTransform: 'capitalize',
    },
    date: {
        fontStyle: 'italic',
    },
    emptyState: {
        textAlign: 'center',
        padding: '50px 20px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
};

export default BrowseTodos;