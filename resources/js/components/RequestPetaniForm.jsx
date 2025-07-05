import React, { useState, useEffect } from "react";

const RequestPetaniForm = () => {
    const [permohonanList, setPermohonanList] = useState([]);
    const [alasan, setAlasan] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const token = localStorage.getItem("token");

    const fetchPermohonan = async () => {
        try {
            const res = await fetch(
                "http://localhost:8000/api/permohonan-petani/my-request",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                }
            );

            const data = await res.json();
            if (res.ok && Array.isArray(data.data)) {
                setPermohonanList(data.data);
            }
        } catch (err) {
            console.error("Gagal mengambil permohonan:", err);
        }
    };

    useEffect(() => {
        fetchPermohonan();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (!alasan.trim()) {
            setError("Alasan tidak boleh kosong.");
            return;
        }

        try {
            const res = await fetch(
                "http://localhost:8000/api/permohonan-petani",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ alasan: alasan.trim() }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                setMessage(data.message || "Permohonan gagal dikirim");
                return;
            }

            setMessage("Permohonan berhasil dikirim. Tunggu konfirmasi admin.");
            setAlasan("");
            fetchPermohonan(); // Refresh list permohonan
        } catch (error) {
            setMessage("Terjadi kesalahan saat mengirim permohonan.");
        }
    };

    // Format tanggal ke tampilan lokal Indonesia
    const formatTanggal = (isoDateString) => {
        const date = new Date(isoDateString);
        return date.toLocaleString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="max-w-xl mx-auto bg-white/40 backdrop-blur p-6 mt-16 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
                Permohonan Menjadi Petani
            </h2>

            {/* Riwayat Permohonan Sebelumnya */}
            {permohonanList.length > 0 && (
                <div className="space-y-4 mb-6">
                    <h3 className="text-lg font-semibold text-gray-700">
                        Riwayat Permohonan Anda:
                    </h3>
                    {permohonanList.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white p-4 rounded shadow text-sm"
                        >
                            <p className="font-medium text-gray-700">Alasan:</p>
                            <p className="italic text-gray-800 mb-1">
                                {item.alasan}
                            </p>

                            <p className="text-gray-600">
                                Tanggal:{" "}
                                <span className="font-medium">
                                    {formatTanggal(item.created_at)}
                                </span>
                            </p>

                            <p>
                                Status:{" "}
                                <span className="capitalize font-semibold text-blue-700">
                                    {item.status}
                                </span>
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Form Pengajuan Baru */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                    placeholder="Tuliskan alasan Anda ingin menjadi petani..."
                    value={alasan}
                    onChange={(e) => setAlasan(e.target.value)}
                    className="w-full h-32 px-4 py-2 border rounded-md"
                ></textarea>

                {error && (
                    <p className="text-red-600 text-sm font-medium text-center">
                        {error}
                    </p>
                )}

                <div className="flex justify-center">
                    <button
                        type="submit"
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-semibold"
                    >
                        Kirim Permohonan
                    </button>
                </div>
            </form>

            {message && (
                <p className="text-center mt-4 text-sm text-blue-700 font-medium">
                    {message}
                </p>
            )}
        </div>
    );
};

export default RequestPetaniForm;
