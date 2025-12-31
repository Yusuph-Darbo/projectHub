import { useState } from "react";
import "../styles/global.css";
import "./Register.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export default function Register() {
  const [mode, setMode] = useState("register");
  const isLogin = mode === "login";

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (isLogin) {
      console.log("Logging in with", {
        email: formData.email,
        password: formData.password,
      });
    } else {
      console.log("Registering user", formData);
    }
  }

  function handleClick() {
    setMode((prev) => (prev === "login" ? "register" : "login"));
    setFormData({ fullName: "", email: "", password: "", confirmPassword: "" });
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="icon-container">
          <FontAwesomeIcon icon={faLock} />
        </div>

        <h1>{isLogin ? "Welcome back" : "Create Account"}</h1>
        <p className="subtitle">
          {isLogin
            ? "Enter your credentials to access your account"
            : "Enter your details to create your account"}
        </p>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="input-group">
              <label htmlFor="fullName">Name</label>
              <div className="input-wrapper">
                <FontAwesomeIcon icon={faUser} className="input-icon" />
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          )}

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <FontAwesomeIcon icon={faLock} className="input-icon" />
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {!isLogin && (
            <div className="input-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-wrapper">
                <FontAwesomeIcon icon={faLock} className="input-icon" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          )}

          <button type="submit" className="sign-up-btn">
            {isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <p className="account-text">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={handleClick} className="link">
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </p>

        <div className="divider">
          <span>Or continue with</span>
        </div>

        <div className="social-buttons">
          <button className="social-btn google-btn">
            <FcGoogle className="social-icon" />
            Google
          </button>

          <button className="social-btn github-btn">
            <FaGithub className="social-icon" />
            GitHub
          </button>
        </div>
      </div>
    </div>
  );
}
