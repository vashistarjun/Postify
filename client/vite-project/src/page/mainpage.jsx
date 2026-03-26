import { Link } from "react-router-dom"
import "./mainpage.css"

function MainPage() {
    return (
        <div className="mainpage-container">
            <div className="mainpage-content">
                <h1 className="mainpage-title">Welcome to Todo App</h1>
                <p className="mainpage-subtitle">Manage your tasks efficiently</p>

                <div className="button-group">
                    <Link to="/signup" className="nav-button signup-btn-nav">
                        Create Account
                    </Link>
                    <Link to="/login" className="nav-button login-btn-nav">
                        Login
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default MainPage