import React, { useEffect, useState } from "react";

export default function UserListPage() {
    const [users, setUsers] = useState([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetch("http://localhost:8000/api/admin/users", {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => setUsers(data.data || []))
            .catch((err) => console.error("Gagal memuat data user:", err));
    }, []);

    return (
        <div className="max-w-5xl mx-auto p-6 mt-10 bg-white/40 backdrop-blur rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
                Daftar Akun Terdaftar
            </h2>
            <table className="w-full table-auto bg-white rounded shadow">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-3 text-left">Nama</th>
                        <th className="p-3 text-left">Email</th>
                        <th className="p-3 text-left">Role</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id} className="border-t">
                            <td className="p-3">{user.name}</td>
                            <td className="p-3">{user.email}</td>
                            <td className="p-3">{user.role?.name ?? "-"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
