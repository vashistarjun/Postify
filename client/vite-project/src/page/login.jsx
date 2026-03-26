import { Link } from "react-router-dom"
import "./login.css"

function Login() {
    return (
        <div className="login-container">
            <div className="login-card">
                <h1>Login</h1>
                <form className="login-form">
                    <div className="form-group">
                        <input
                            type="email"
                            placeholder="enter your email"
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="enter your password"
                            className="form-input"
                        />
                    </div>
                    <button type="submit" className="login-btn">Login</button>
                </form>
                <div className="divider">or</div>
                <Link to="/LoginViaOtp" className="otp-link">Login via OTP</Link>
            </div>
        </div>
    )
}
export default Login