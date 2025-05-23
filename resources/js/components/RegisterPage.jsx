import React, { useState } from 'react';

const RegisterPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'user'
  });
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setErrors({});

    try {
      const res = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setMessage(data.message || 'Gagal registrasi');
        }
      } else {
        setMessage('Registrasi berhasil! Silakan login.');
        setForm({
          name: '',
          email: '',
          password: '',
          password_confirmation: ''
        });
      }
    } catch (err) {
      setMessage('Kesalahan jaringan');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white/30 backdrop-blur-lg p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">Register Akun</h2>

        {message && (
          <p className="text-center mb-4 text-sm text-red-600 font-medium">{message}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-800">Nama</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-500"
              required
            />
            {errors.name && (
              <small className="text-red-600">{errors.name[0]}</small>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800">Email</label>
            <input
              type="email"
              name="email"
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
            <label className="block text-sm font-medium text-gray-800">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-500"
              required
            />
            {errors.password && (
              <small className="text-red-600">{errors.password[0]}</small>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800">Konfirmasi Password</label>
            <input
              type="password"
              name="password_confirmation"
              value={form.password_confirmation}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-500"
              required
            />
            {errors.password_confirmation && (
              <small className="text-red-600">{errors.password_confirmation[0]}</small>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800">Role</label>
                <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-500"
                    required
                >
                    <option value="user">User</option>
                    <option value="petani">Petani</option>
                </select>
                {errors.role && (
                    <small className="text-red-600">{errors.role[0]}</small>
                )}
            </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 font-semibold"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;