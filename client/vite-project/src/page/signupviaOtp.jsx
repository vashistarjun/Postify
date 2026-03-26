import { Link } from "react-router-dom"
import "./signupviaOtp.css"

function SignupviaOtp() {
    return (
        <div className="otp-container">
            <div className="otp-card signup-otp">
                <h1>Sign Up via OTP</h1>
                <p className="otp-subtitle">Enter your email to receive an OTP</p>

                <form className="otp-form">
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="enter your name"
                            className="form-input"
                        />
                    </div>
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

                <Link to="/signup" className="back-link">Back to Sign Up</Link>
            </div>
        </div>
    )
}

export default SignupviaOtp