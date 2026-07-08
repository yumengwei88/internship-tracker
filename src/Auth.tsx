import { useState } from "react";
import { supabase } from "./supabaseClient";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignUp() {
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      alert("Please enter both an email and password.");
      return;
    }

    const { error } = await supabase.auth.signUp({
      email: trimmedEmail,
      password: password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Account created! Check your email to confirm your account.");
  }

  async function handleLogin() {
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      alert("Please enter both an email and password.");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password: password,
    });

    if (error) {
      alert(error.message);
      return;
    }
  }

  return (
    <div className="auth-container">
      <h1>Personal Internship Tracker</h1>
      <p>Log in or create an account to track your applications.</p>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />

      <div className="auth-buttons">
        <button type="button" onClick={handleLogin}>
          Log In
        </button>

        <button type="button" onClick={handleSignUp}>
          Sign Up
        </button>
      </div>
    </div>
  );
}