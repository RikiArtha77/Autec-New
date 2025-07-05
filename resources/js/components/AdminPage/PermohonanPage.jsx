import React, { useEffect, useState } from "react";

export default function PermohonanPage() {
    const [permohonan, setPermohonan] = useState([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetch("http://localhost:8000/api/admin/permohonan-petani", {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => setPermohonan(data.data || []))
            .catch((err) => console.error("Gagal memuat permohonan:", err));
    }, []);

    const handleUpdateStatus = (id, status) => {
        fetch(`http://localhost:8000/api/admin/permohonan-petani/${id}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status }),
        })
            .then((res) => res.json())
            .then(() => {
                setPermohonan((prev) =>
                    prev.map((p) => (p.id === id ? { ...p, status } : p))
                );
            });
    };

    return (
        <div className="max-w-5xl mx-auto p-6 mt-10 bg-white/40 backdrop-blur rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
                Permohonan Menjadi Petani
            </h2>
            <table className="w-full table-auto bg-white rounded shadow">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-3 text-left">Nama</th>
                        <th className="p-3 text-left">Email</th>
                        <th className="p-3 text-left">Status</th>
                        <th className="p-3 text-left">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {permohonan.map((p) => (
                        <tr key={p.id} className="border-t">
                            <td className="p-3">{p.user?.name ?? "-"}</td>
                            <td className="p-3">{p.user?.email ?? "-"}</td>
                            <td className="p-3 capitalize">{p.status}</td>
                            <td className="p-3 flex gap-2">
                                <button
                                    onClick={() =>
                                        handleUpdateStatus(p.id, "approved")
                                    }
                                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                                >
                                    Setujui
                                </button>
                                <button
                                    onClick={() =>
                                        handleUpdateStatus(p.id, "rejected")
                                    }
                                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                >
                                    Tolak
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
