import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

const LiveDataDemoUser = () => {
    const [data, setData] = useState([]);

    const fetchData = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await axios.get(
                "http://localhost:8000/api/admin/demo-live-data",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                }
            );
            const latestFive = res.data.slice(-5); // hanya ambil 5 data terakhir
            setData(latestFive);
        } catch (err) {
            console.error("Gagal ambil demo data:", err);
            setData([]);
        }
    };

    useEffect(() => {
        fetchData(); // fetch pertama kali
        const interval = setInterval(fetchData, 15000); // fetch setiap 15 detik
        return () => clearInterval(interval); // cleanup
    }, []);

    return (
        <div className="p-4 bg-white rounded-lg shadow space-y-8">
            <h2 className="text-xl font-bold mb-4">Live Data Demo</h2>

            {/* Tabel Data (readonly) */}
            <table className="w-full table-auto border-collapse">
                <thead>
                    <tr className="bg-green-600 text-white text-center">
                        <th className="border p-2">Waktu</th>
                        <th className="border p-2">Suhu (°C)</th>
                        <th className="border p-2">Kelembaban (%)</th>
                        <th className="border p-2">Tanah (%)</th>
                        <th className="border p-2">Cahaya</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row) => (
                        <tr key={row.id} className="text-center">
                            <td className="border p-2">{row.timestamp}</td>
                            <td className="border p-2">{row.temperature}</td>
                            <td className="border p-2">{row.humidity}</td>
                            <td className="border p-2">{row.soil_moisture}</td>
                            <td className="border p-2">{row.light}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Grafik */}
            <div className="mt-10">
                <h3 className="text-lg font-semibold mb-4">Grafik Sensor</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="timestamp" hide />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="temperature"
                            stroke="#ef4444"
                            name="Suhu"
                        />
                        <Line
                            type="monotone"
                            dataKey="humidity"
                            stroke="#3b82f6"
                            name="Kelembaban"
                        />
                        <Line
                            type="monotone"
                            dataKey="soil_moisture"
                            stroke="#10b981"
                            name="Tanah"
                        />
                        <Line
                            type="monotone"
                            dataKey="light"
                            stroke="#facc15"
                            name="Cahaya"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default LiveDataDemoUser;
