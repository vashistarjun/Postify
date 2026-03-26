import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Button } from '../components/Common';

const Home = () => {
    const navigate = useNavigate();
    const { isAuthenticated, role } = useContext(AuthContext);

    if (isAuthenticated) {
        if (role === 'admin') {
            navigate('/admin-dashboard');
        } else {
            navigate('/dashboard');
        }
    }

    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <h1 style={styles.title}>Welcome to Todo App</h1>
                <p style={styles.subtitle}>
                    Manage your todos efficiently and stay organized
                </p>

                <div style={styles.features}>
                    <div style={styles.feature}>
                        <div style={styles.featureIcon}>📝</div>
                        <h3>Create Todos</h3>
                        <p>Easily create and organize your tasks</p>
                    </div>

                    <div style={styles.feature}>
                        <div style={styles.featureIcon}>✅</div>
                        <h3>Track Progress</h3>
                        <p>Monitor approval status of your todos</p>
                    </div>

                    <div style={styles.feature}>
                        <div style={styles.featureIcon}>👨‍💼</div>
                        <h3>Admin Control</h3>
                        <p>Manage and approve/reject todos</p>
                    </div>

                    <div style={styles.feature}>
                        <div style={styles.featureIcon}>🔐</div>
                        <h3>Secure</h3>
                        <p>JWT authentication for secure access</p>
                    </div>
                </div>

                <div style={styles.actions}>
                    <Button
                        label="Browse Todos"
                        onClick={() => navigate('/browse-todos')}
                        variant="outline"
                    />
                    <Button
                        label="Sign Up"
                        onClick={() => navigate('/signup')}
                        variant="primary"
                    />
                    <Button
                        label="Log In"
                        onClick={() => navigate('/login')}
                        variant="secondary"
                    />
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
    },
    content: {
        maxWidth: '900px',
        width: '100%',
        textAlign: 'center',
    },
    title: {
        fontSize: '48px',
        fontWeight: '700',
        color: '#333',
        marginBottom: '15px',
        margin: 0,
    },
    subtitle: {
        fontSize: '20px',
        color: '#666',
        marginBottom: '50px',
        margin: '15px 0 50px 0',
    },
    features: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '30px',
        marginBottom: '50px',
    },
    feature: {
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
    featureIcon: {
        fontSize: '48px',
        marginBottom: '15px',
    },
    actions: {
        display: 'flex',
        gap: '20px',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
};

export default Home;
