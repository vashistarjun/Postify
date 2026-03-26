import { Link } from "react-router-dom"
import "./signup.css"
//import { useState } from "react";

function Signup() {
   // const [name, SetText] = useState("");
    return (
        <div className="signup-container">
            <div className="signup-card">
                <h1>Create Account</h1>
                <form className="signup-form">
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
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="enter your password"
                            className="form-input"
                        />
                    </div>
                    <button type="submit" className="signup-btn">Sign Up</button>
                </form>
                <div className="divider">or</div>
                <Link to="/signupViaOtp" className="otp-link">Sign Up via OTP</Link>
            </div>
        </div>
    )
}

export default Signup