import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { FormContainer, InputField, Button, ErrorMessage } from '../components/Common';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Email and password are required');
            return;
        }

        setLoading(true);
        try {
            const response = await authAPI.login({ email, password });
            const { token } = response.data;

            // Decode token to get user info (basic decode without jwt library)
            const tokenParts = token.split('.');
            const payload = JSON.parse(atob(tokenParts[1]));

            // Store token and navigate with actual role from JWT
            login(token, { email, id: payload.id }, payload.role);
            localStorage.setItem('userId', payload.id);

            setTimeout(() => {
                navigate('/dashboard');
            }, 500);
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <FormContainer title="Login" subtitle="Sign in to your account">
            <ErrorMessage message={error} onClose={() => setError('')} />

            <form onSubmit={handleLogin}>
                <InputField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                />

                <InputField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                />

                <Button
                    label="Login"
                    type="submit"
                    variant="primary"
                    loading={loading}
                    fullWidth
                />
            </form>

            <div style={styles.divider}>OR</div>

            <Button
                label="Login via OTP"
                onClick={() => navigate('/otp-login')}
                variant="secondary"
                fullWidth
            />

            <p style={styles.footerText}>
                Don't have an account?{' '}
                <a
                    href="/signup"
                    style={styles.link}
                >
                    Sign up here
                </a>
            </p>
        </FormContainer>
    );
};

const styles = {
    divider: {
        textAlign: 'center',
        margin: '25px 0',
        color: '#999',
        fontSize: '14px',
        fontWeight: '600',
    },
    footerText: {
        textAlign: 'center',
        marginTop: '20px',
        color: '#666',
        fontSize: '14px',
    },
    link: {
        color: '#007bff',
        textDecoration: 'none',
        fontWeight: '600',
        cursor: 'pointer',
    },
};

export default Login;
