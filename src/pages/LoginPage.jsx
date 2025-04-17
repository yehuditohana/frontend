import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { loginUser } from "../api/loginAPI";

const LoginPage = () => {
  const { login } = useUser();
  const navigate = useNavigate();

  const emailRef = useRef();
  const errRef = useRef();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  useEffect(() => {
    setError("");
  }, [form]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userData = await loginUser(form.email, form.password);


      const token = userData?.token || "";

      login({
        email: userData.email,
        name: userData.username,
        id: userData.userId,
        sessionNumber: userData.sessionNumber, 
      });

      setForm({ email: "", password: "" });
      navigate("/");
    } catch (err) {
      setError(
        err?.message || "אירעה שגיאה כללית"
      );
      errRef.current?.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-blue-800 mb-3">התחברות 🔐</h2>
        <p
          ref={errRef}
          className={error ? "text-red-500 text-sm mb-2" : "sr-only"}
          aria-live="assertive"
        >
          {error}
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input
              name="email"
              ref={emailRef}
              onChange={handleChange}
              value={form.email}
              type="email"
              placeholder="אימייל"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <div>
            <input
              name="password"
              onChange={handleChange}
              value={form.password}
              type="password"
              placeholder="סיסמה"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md font-semibold transition"
            disabled={loading}
          >
            {loading ? "מתחבר..." : "התחבר"}
          </button>
        </form>

        <div className="text-sm text-gray-600 mt-3">
          אין לך חשבון עדיין?
          <Link
            to="/register"
            className="text-blue-600 hover:text-blue-800 font-semibold mr-1"
          >
            הירשם כאן
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;