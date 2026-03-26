import { useState, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { FormContainer, InputField, Button, ErrorMessage, SuccessMessage } from '../components/Common';

const OTPPage = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const [searchParams] = useSearchParams();

    const mode = searchParams.get('mode') || 'login'; // 'login' or 'signup'
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [name, setName] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!email) {
            setError('Email is required');
            return;
        }

        setLoading(true);
        try {
            await authAPI.sendOTP({ email });
            setOtpSent(true);
            setSuccess('OTP sent to your email!');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!otp) {
            setError('OTP is required');
            return;
        }

        setLoading(true);
        try {
            let response;
            if (mode === 'signup') {
                if (!name) {
                    setError('Name is required for signup');
                    return;
                }
                response = await authAPI.verifyOTPSignup({
                    email,
                    otp,
                    name,
                });
                const { token, user } = response.data;

                // Auto-login after successful OTP signup
                login(token, user, user.role);
                localStorage.setItem('userId', user.id);

                setSuccess('Signup successful! Redirecting to dashboard...');
                setTimeout(() => {
                    navigate('/dashboard');
                }, 1000);
            } else {
                // Login mode
                response = await authAPI.verifyOTPLogin({ email, otp });
                const { token } = response.data;

                // Decode token to get user info
                const tokenParts = token.split('.');
                const payload = JSON.parse(atob(tokenParts[1]));

                login(token, { email, id: payload.id }, payload.role);
                localStorage.setItem('userId', payload.id);

                setSuccess('Login successful! Redirecting...');
                setTimeout(() => {
                    navigate('/dashboard');
                }, 1000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'OTP verification failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <FormContainer
            title={mode === 'signup' ? 'Sign Up via OTP' : 'Login via OTP'}
            subtitle={mode === 'signup' ? 'Create account using OTP' : 'Login using OTP'}
        >
            <ErrorMessage message={error} onClose={() => setError('')} />
            <SuccessMessage message={success} />

            <form onSubmit={otpSent ? handleVerifyOTP : handleSendOTP}>
                {!otpSent ? (
                    <>
                        <InputField
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                        <Button
                            label="Send OTP"
                            type="submit"
                            variant="primary"
                            loading={loading}
                            fullWidth
                        />
                    </>
                ) : (
                    <>
                        {mode === 'signup' && (
                            <InputField
                                label="Full Name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your full name"
                                required
                            />
                        )}

                        <InputField
                            label="OTP"
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                            placeholder="Enter 6-digit OTP"
                            required
                        />

                        <Button
                            label="Verify OTP"
                            type="submit"
                            variant="primary"
                            loading={loading}
                            fullWidth
                        />

                        <Button
                            label="Change Email"
                            type="button"
                            variant="secondary"
                            onClick={() => {
                                setOtpSent(false);
                                setOtp('');
                                setEmail('');
                            }}
                            fullWidth
                        />
                    </>
                )}
            </form>

            <p style={styles.footerText}>
                {mode === 'signup' ? (
                    <>
                        Already have an account?{' '}
                        <a href="/login" style={styles.link}>
                            Log in here
                        </a>
                    </>
                ) : (
                    <>
                        Don't have an account?{' '}
                        <a href="/signup" style={styles.link}>
                            Sign up here
                        </a>
                    </>
                )}
            </p>
        </FormContainer>
    );
};

const styles = {
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

export default OTPPage;
