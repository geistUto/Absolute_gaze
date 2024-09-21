import { useState } from 'react';
import { useRouter } from 'next/router';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!otpSent && !isLogin && !isForgotPassword) {
            // Send OTP for signup
            const otpResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/geists/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (otpResponse.ok) {
                setOtpSent(true);
            } else {
                console.error('Failed to send OTP');
            }
        } else if (isForgotPassword) {
            // Handle forgot password
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/geists/auth/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                setOtpSent(true);
            } else {
                console.error('Failed to send reset link');
            }
        } else if (otpSent && !isLogin) {
            // Verify OTP for signup
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/geists/auth/verify-otp?email=${email}&otp=${otp}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                 body: JSON.stringify({ email, otp }),
            });

            if (response.ok) {
                const data = await response.json();
                // Store JWT token2
                localStorage.setItem('token', data.data);
                // Redirect to mind snippets upload page
                router.push('/snippets');
            } else {
                console.error('OTP verification failed');
            }
        } else {
            // Handle login
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/geists/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                // Store JWT token
                localStorage.setItem('token', data.data);
                // Redirect to mind snippets upload page
                router.push('/snippets');
            } else {
                console.error('Authentication failed');
            }
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>{isLogin ? 'Login' : isForgotPassword ? 'Forgot Password' : 'Sign Up'}</h2>
            <form onSubmit={handleSubmit}>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                {(!otpSent || isLogin) && !isForgotPassword && (
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>
                )}
                {!isLogin && otpSent && !isForgotPassword && (
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>OTP:</label>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>
                )}
                <button type="submit" style={styles.button}>
                    {isLogin ? 'Login' : isForgotPassword ? 'Send Reset Link' : otpSent ? 'Verify OTP & Sign Up' : 'Sign Up'}
                </button>
            </form>
            <p style={styles.switchText}>
                {isLogin ? 'No account?' : 'Already have an account?'}
                <button
                    onClick={() => {
                        setIsLogin(!isLogin);
                        setOtpSent(false);
                        setIsForgotPassword(false);
                    }}
                    style={styles.switchButton}
                >
                    {isLogin ? 'Sign Up' : 'Login'}
                </button>
            </p>
            {isLogin && (
                <p style={styles.forgotText}>
                    Forgot Password?
                    <button
                        onClick={() => {
                            setIsForgotPassword(true);
                            setOtpSent(false);
                        }}
                        style={styles.forgotButton}
                    >
                        Reset Password
                    </button>
                </p>
            )}
        </div>
    );
};

const styles = {
    container: {
        backgroundColor: 'black',
        color: 'white',
        padding: '2rem',
        maxWidth: '400px',
        margin: 'auto',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
    heading: {
        textAlign: 'center',
        marginBottom: '1.5rem',
    },
    inputGroup: {
        marginBottom: '1rem',
    },
    label: {
        display: 'block',
        marginBottom: '0.5rem',
    },
    input: {
        width: '100%',
        padding: '0.5rem',
        borderRadius: '4px',
        border: '1px solid #ccc',
        backgroundColor: '#222',
        color: 'white',
    },
    button: {
        width: '100%',
        padding: '0.75rem',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginTop: '1rem',
    },
    switchText: {
        textAlign: 'center',
        marginTop: '1rem',
    },
    switchButton: {
        backgroundColor: 'transparent',
        color: '#007bff',
        border: 'none',
        cursor: 'pointer',
        padding: '0',
        marginLeft: '0.5rem',
    },
    forgotText: {
        textAlign: 'center',
        marginTop: '0.5rem',
    },
    forgotButton: {
        backgroundColor: 'transparent',
        color: '#007bff',
        border: 'none',
        cursor: 'pointer',
        padding: '0',
        marginLeft: '0.5rem',
    },
};

export default Auth;
