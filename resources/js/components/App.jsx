import React, { useState, useEffect } from "react";
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import HomePage from "./HomePage";
import DevicePage from "./DevicePage";
import SensorData from "./SensorData";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import LiveDataEditor from "./AdminPage/LiveDataEditor";
import PermohonanPage from "./AdminPage/PermohonanPage";
import UserListPage from "./AdminPage/UserListPage";
import LiveDataDemoUser from "./LiveDataDemoUser";
import RequestPetaniForm from "./RequestPetaniForm";
import axios from "axios";

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        axios
            .get("/api/user", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                setIsLoggedIn(true);
                setRole(res.data.role_id);
            })
            .catch(() => {
                setIsLoggedIn(false);
                setRole(null);
            });
    }, []);

    const handleLogout = () => {
        axios
            .post(
                "/api/logout",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            )
            .finally(() => {
                localStorage.removeItem("token");
                setIsLoggedIn(false);
                setRole(null);
                navigate("/");
            });
    };

    return (
        <div
            className="flex flex-col min-h-screen bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/pertanian.jpg')" }}
        >
            {/* Navbar */}
            <nav className="fixed top-0 left-0 w-full h-16 backdrop-blur-md bg-white/30 shadow-md px-6 flex justify-between items-center z-50">
                <div className="flex items-center space-x-2">
                    <img src="/Logo.png" alt="Logo" className="h-8 w-8" />
                    <span className="text-lg font-semibold">Autec</span>
                </div>

                <div className="space-x-6">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `hover:text-gray-300 ${isActive ? "font-bold" : ""}`
                        }
                    >
                        Home
                    </NavLink>

                    {/* Petani Menu */}
                    {isLoggedIn && role === 2 && (
                        <>
                            <NavLink
                                to="/device"
                                className={({ isActive }) =>
                                    `hover:text-gray-300 ${
                                        isActive ? "font-bold" : ""
                                    }`
                                }
                            >
                                Devices
                            </NavLink>
                            <NavLink
                                to="/sensor"
                                className={({ isActive }) =>
                                    `hover:text-gray-300 ${
                                        isActive ? "font-bold" : ""
                                    }`
                                }
                            >
                                SensorData
                            </NavLink>
                        </>
                    )}

                    {/* Admin Menu */}
                    {isLoggedIn && role === 3 && (
                        <>
                            <NavLink
                                to="/admin/users"
                                className={({ isActive }) =>
                                    `hover:text-gray-300 ${
                                        isActive ? "font-bold" : ""
                                    }`
                                }
                            >
                                Akun
                            </NavLink>
                            <NavLink
                                to="/admin/permohonan"
                                className={({ isActive }) =>
                                    `hover:text-gray-300 ${
                                        isActive ? "font-bold" : ""
                                    }`
                                }
                            >
                                Permohonan
                            </NavLink>
                            <NavLink
                                to="/admin/live-data"
                                className={({ isActive }) =>
                                    `hover:text-gray-300 ${
                                        isActive ? "font-bold" : ""
                                    }`
                                }
                            >
                                Live Data
                            </NavLink>
                        </>
                    )}

                    {/* User Biasa */}
                    {isLoggedIn && role === 1 && (
                        <>
                            <NavLink
                                to="/user/live-data-demo"
                                className={({ isActive }) =>
                                    `hover:text-gray-300 ${
                                        isActive ? "font-bold" : ""
                                    }`
                                }
                            >
                                Live Data Demo
                            </NavLink>
                            <NavLink
                                to="/user/permohonan-petani"
                                className={({ isActive }) =>
                                    `hover:text-gray-300 ${
                                        isActive ? "font-bold" : ""
                                    }`
                                }
                            >
                                Menjadi Petani
                            </NavLink>
                        </>
                    )}

                    {/* Login/Register */}
                    {!isLoggedIn && (
                        <>
                            <NavLink
                                to="/login"
                                className={({ isActive }) =>
                                    `hover:text-gray-300 ${
                                        isActive ? "font-bold" : ""
                                    }`
                                }
                            >
                                Login
                            </NavLink>
                            <NavLink
                                to="/register"
                                className={({ isActive }) =>
                                    `hover:text-gray-300 ${
                                        isActive ? "font-bold" : ""
                                    }`
                                }
                            >
                                Register
                            </NavLink>
                        </>
                    )}
                </div>

                {isLoggedIn && (
                    <button
                        onClick={handleLogout}
                        className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200"
                    >
                        Logout
                    </button>
                )}
            </nav>

            {/* Routes */}
            <main className="flex-grow mt-16 p-4">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route
                        path="/login"
                        element={
                            <LoginPage
                                setIsLoggedIn={setIsLoggedIn}
                                setRole={setRole}
                            />
                        }
                    />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Petani */}
                    <Route
                        path="/device"
                        element={
                            isLoggedIn && (role === 1 || role === 2) ? (
                                <DevicePage />
                            ) : (
                                <HomePage />
                            )
                        }
                    />
                    <Route
                        path="/sensor"
                        element={
                            isLoggedIn && role === 2 ? (
                                <SensorData />
                            ) : (
                                <HomePage />
                            )
                        }
                    />

                    {/* Admin */}
                    <Route
                        path="/admin/live-data"
                        element={
                            isLoggedIn && role === 3 ? (
                                <LiveDataEditor />
                            ) : (
                                <HomePage />
                            )
                        }
                    />
                    <Route
                        path="/admin/permohonan"
                        element={
                            isLoggedIn && role === 3 ? (
                                <PermohonanPage />
                            ) : (
                                <HomePage />
                            )
                        }
                    />
                    <Route
                        path="/admin/users"
                        element={
                            isLoggedIn && role === 3 ? (
                                <UserListPage />
                            ) : (
                                <HomePage />
                            )
                        }
                    />

                    {/* User */}
                    <Route
                        path="/user/live-data-demo"
                        element={
                            isLoggedIn && role === 1 ? (
                                <LiveDataDemoUser />
                            ) : (
                                <HomePage />
                            )
                        }
                    />
                    <Route
                        path="/user/permohonan-petani"
                        element={
                            isLoggedIn && role === 1 ? (
                                <RequestPetaniForm />
                            ) : (
                                <HomePage />
                            )
                        }
                    />
                </Routes>
            </main>

            {/* Footer */}
            <footer className="bg-green-600 text-white text-center p-4 w-full">
                <p>&copy; 2025 AgroTech. Semua Hak Dilindungi.</p>
            </footer>
        </div>
    );
};

export default App;
