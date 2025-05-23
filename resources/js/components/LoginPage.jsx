import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ onLoginSuccess = () => {}, setIsLoggedIn, setRole }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setErrors({});

    try {
      const res = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) setErrors(data.errors);
        else setMessage(data.message || 'Login gagal');
      } else {
        setMessage('Login berhasil!');
        setErrors({});
        localStorage.setItem('token', data.access_token);
        setIsLoggedIn(true);
        setRole(data.user.role);
        onLoginSuccess({
          token: data.access_token,
          user: data.user,
        });
        setForm({ email: '', password: '' });
        navigate('/'); // Arahkan ke halaman utama atau user
      }
    } catch (error) {
      setMessage('Kesalahan jaringan');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white/30 backdrop-blur-lg p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">Login Akun</h2>

        {message && (
          <p className="text-center mb-4 text-sm text-red-600 font-medium">{message}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-800">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={form.email}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-500"
              required
            />
            {errors.email && (
              <small className="text-red-600">{errors.email[0]}</small>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-800">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={form.password}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-500"
              required
            />
            {errors.password && (
              <small className="text-red-600">{errors.password[0]}</small>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 font-semibold"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;