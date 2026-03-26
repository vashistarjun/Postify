import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { FormContainer, InputField, Button, ErrorMessage, SuccessMessage } from '../components/Common';

const Signup = () => {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!name || !email || !password || !confirmPassword) {
            setError('All fields are required');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            await authAPI.signup({ name, email, password });
            setSuccess('Signup successful! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <FormContainer title="Sign Up" subtitle="Create a new account">
            <ErrorMessage message={error} onClose={() => setError('')} />
            <SuccessMessage message={success} />

            <form onSubmit={handleSignup}>
                <InputField
                    label="Full Name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                />

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

                <InputField
                    label="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                />

                <Button
                    label="Create Account"
                    type="submit"
                    variant="primary"
                    loading={loading}
                    fullWidth
                />
            </form>

            <div style={styles.divider}>OR</div>

            <Button
                label="Sign Up via OTP"
                onClick={() => navigate('/otp-signup')}
                variant="secondary"
                fullWidth
            />

            <p style={styles.footerText}>
                Already have an account?{' '}
                <a href="/login" style={styles.link}>
                    Log in here
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

export default Signup;
