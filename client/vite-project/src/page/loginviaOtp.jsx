import { Link } from "react-router-dom"
import "./loginviaOtp.css"

function LoginviaOtp() {
    return (
        <div className="otp-container">
            <div className="otp-card">
                <h1>Login via OTP</h1>
                <p className="otp-subtitle">Enter your email to receive an OTP</p>

                <form className="otp-form">
                    <div className="form-group">
                        <input
                            type="email"
                            placeholder="enter your email"
                            className="form-input"
                        />
                    </div>
                    <button type="submit" className="send-otp-btn">Send OTP</button>
                </form>

                <div className="divider">Already have OTP?</div>

                <form className="otp-verify-form">
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="enter OTP"
                            maxLength="6"
                            className="form-input"
                        />
                    </div>
                    <button type="submit" className="verify-btn">Verify OTP</button>
                </form>

                <Link to="/login" className="back-link">Back to Login</Link>
            </div>
        </div>
    )
}

export default LoginviaOtp