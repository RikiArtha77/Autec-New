import React, { useState, useEffect } from "react";
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import HomePage from "./HomePage";
import DevicePage from "./DevicePage";
import SensorData from "./SensorData";
import axios from "axios";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState(null); // 'user' atau 'petani'
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        axios
            .get("/api/user", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                setIsLoggedIn(true);
                setRole(res.data.role);
            })
            .catch(() => {
                setIsLoggedIn(false);
                setRole(null);
            });
    }, []);

    const handleLogout = () => {
        axios
            .post("/api/logout", {}, { withCredentials: true })
            .then(() => {
                localStorage.removeItem("token"); // Hapus token dari localStorage
                setIsLoggedIn(false);
                setRole(null);
                navigate("/"); // Arahkan ke homepage
            })
            .catch(() => {
                localStorage.removeItem("token"); // Tetap hapus token jika error
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

                    {isLoggedIn && role === "petani" && (
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

                    {isLoggedIn && role === "user" && (
                        <NavLink
                            to="/device"
                            className={({ isActive }) =>
                                `hover:text-gray-300 ${
                                    isActive ? "font-bold" : ""
                                }`
                            }
                        >
                            Device
                        </NavLink>
                    )}

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

            {/* Main content */}
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
                    <Route
                        path="/device"
                        element={
                            isLoggedIn && role === "petani" ? (
                                <DevicePage />
                            ) : (
                                <HomePage />
                            )
                        }
                    />
                    <Route
                        path="/sensor"
                        element={
                            isLoggedIn && role === "petani" ? (
                                <SensorData />
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
