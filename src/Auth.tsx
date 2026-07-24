import { useState } from "react";
import { supabase } from "./supabaseClient";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSignUp() {
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setMessage("Please enter both an email and password to create an account.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
    });

    setIsLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Account created! Check your email to confirm your account.");
  }

  async function handleLogin() {
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setMessage("Please enter both an email and password.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password,
    });

    setIsLoading(false);

    if (error) {
      setMessage(error.message);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome To Internship Tracker!</h1>
          <p>Log in or create an account to get started</p>
        </div>

        <div className="auth-form">
          <label>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          {message && <p className="auth-message">{message}</p>}

          <button
            type="button"
            className="auth-primary-button"
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Log In"}
          </button>

          <button
            type="button"
            className="auth-secondary-button"
            onClick={handleSignUp}
            disabled={isLoading}
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}