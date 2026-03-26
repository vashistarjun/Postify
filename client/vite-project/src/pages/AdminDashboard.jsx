import { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import {
    LoadingSpinner,
    ErrorMessage,
    SuccessMessage,
    Button,
    TodoCard,
} from '../components/Common';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { logout, token, role } = useContext(AuthContext);

    const [activeTab, setActiveTab] = useState('pending'); // pending, rejected, all
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchTodos = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            let response;
            if (activeTab === 'pending') {
                response = await adminAPI.getPendingTodos();
            } else if (activeTab === 'rejected') {
                response = await adminAPI.getRejectedTodos();
            } else {
                response = await adminAPI.getAllTodos();
            }
            setTodos(response.data.data || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch todos');
            setTodos([]);
        } finally {
            setLoading(false);
        }
    }, [activeTab]);

    useEffect(() => {
        if (!token || role !== 'admin') {
            navigate('/login');
            return;
        }
        fetchTodos();
    }, [token, role, activeTab, navigate, fetchTodos]);

    const handleApproveTodo = async (id) => {
        try {
            await adminAPI.approveTodo(id);
            setSuccess('Todo approved successfully!');
            fetchTodos();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to approve todo');
        }
    };

    const handleRejectTodo = async (id) => {
        try {
            await adminAPI.rejectTodo(id);
            setSuccess('Todo rejected successfully!');
            fetchTodos();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reject todo');
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>Admin Dashboard</h1>
                <Button
                    label="Logout"
                    onClick={() => {
                        logout();
                        navigate('/login');
                    }}
                    variant="secondary"
                />
            </header>

            <main style={styles.main}>
                <ErrorMessage message={error} onClose={() => setError('')} />
                <SuccessMessage message={success} onClose={() => setSuccess('')} />

                <div style={styles.tabs}>
                    <button
                        style={{
                            ...styles.tab,
                            ...styles[activeTab === 'pending' ? 'tabActive' : 'tabInactive'],
                        }}
                        onClick={() => setActiveTab('pending')}
                    >
                        Pending Todos
                    </button>
                    <button
                        style={{
                            ...styles.tab,
                            ...styles[activeTab === 'rejected' ? 'tabActive' : 'tabInactive'],
                        }}
                        onClick={() => setActiveTab('rejected')}
                    >
                        Rejected Todos
                    </button>
                    <button
                        style={{
                            ...styles.tab,
                            ...styles[activeTab === 'all' ? 'tabActive' : 'tabInactive'],
                        }}
                        onClick={() => setActiveTab('all')}
                    >
                        All Todos
                    </button>
                </div>

                {todos.length === 0 ? (
                    <div style={styles.emptyState}>
                        <p>
                            No {activeTab === 'pending' ? 'pending' : activeTab === 'rejected' ? 'rejected' : ''} todos found.
                        </p>
                    </div>
                ) : (
                    <div style={styles.todosList}>
                        {todos.map((todo) => (
                            <TodoCard
                                key={todo._id}
                                todo={todo}
                                onApprove={handleApproveTodo}
                                onReject={handleRejectTodo}
                                isAdmin={true}
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
    main: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px',
    },
    tabs: {
        display: 'flex',
        gap: '10px',
        marginBottom: '30px',
        borderBottom: '1px solid #ddd',
    },
    tab: {
        padding: '12px 24px',
        fontSize: '16px',
        fontWeight: '600',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.3s',
        backgroundColor: 'transparent',
    },
    tabActive: {
        color: '#007bff',
        borderBottom: '2px solid #007bff',
    },
    tabInactive: {
        color: '#666',
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

export default AdminDashboard;
