import { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export default function SensorDataPage() {
    const [mode, setMode] = useState("live");
    const [deviceId, setDeviceId] = useState("");
    const [data, setData] = useState([]);
    const [devices, setDevices] = useState([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetch("http://localhost:8000/api/devices", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((json) => setDevices(json.devices || []));
    }, []);

    useEffect(() => {
        if (!deviceId) return;

        const fetchData = async () => {
            try {
                const url =
                    mode === "live"
                        ? `/api/sensors/${deviceId}/latest`
                        : `/api/sensors/${deviceId}/history?`;

                const response = await fetch(`http://localhost:8000${url}`);
                const res = await response.json();

                if (mode === "live") {
                    setData(res.data ? [res.data] : []);
                } else {
                    const allData = Array.isArray(res.data) ? res.data : [];
                    const latestTen = allData.slice(0, 10);
                    setData(latestTen);
                }
            } catch (err) {
                console.error("Fetch error:", err);
            }
        };

        fetchData();

        if (mode === "live") {
            const interval = setInterval(fetchData, 5000);
            return () => clearInterval(interval);
        }
    }, [deviceId, mode]);

    return (
        <div className="max-w-6xl mx-auto mt-10 p-6 bg-white/40 backdrop-blur rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
                Data Sensor
            </h2>

            <div className="flex gap-4 mb-6">
                <select
                    className="p-2 border rounded"
                    value={deviceId}
                    onChange={(e) => setDeviceId(e.target.value)}
                >
                    <option value="">Pilih Device</option>
                    {devices.map((d) => (
                        <option key={d.device_id} value={d.device_id}>
                            {d.device_name} ({d.device_id})
                        </option>
                    ))}
                </select>

                <button
                    className={`px-4 py-2 rounded ${
                        mode === "live"
                            ? "bg-green-700 text-white"
                            : "bg-white border border-gray-300"
                    }`}
                    onClick={() => setMode("live")}
                >
                    Real-time
                </button>
                <button
                    className={`px-4 py-2 rounded ${
                        mode === "history"
                            ? "bg-blue-700 text-white"
                            : "bg-white border border-gray-300"
                    }`}
                    onClick={() => setMode("history")}
                >
                    History
                </button>
            </div>

            {mode === "history" && data.length > 0 && (
                <div className="w-full h-64 mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="created_at"
                                tick={{ fontSize: 10 }}
                            />
                            <YAxis domain={[0, 100]} />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="humidity"
                                stroke="#8884d8"
                                name="Humidity"
                            />
                            <Line
                                type="monotone"
                                dataKey="temp"
                                stroke="#82ca9d"
                                name="Temperature"
                            />
                            <Line
                                type="monotone"
                                dataKey="soil_moisture"
                                stroke="#f59e0b"
                                name="Soil Moisture"
                            />
                            <Line
                                type="monotone"
                                dataKey="ldr"
                                stroke="#f43f5e"
                                name="Light"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}

            <table className="w-full bg-white shadow rounded-lg overflow-hidden">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="p-4 text-left">Waktu</th>
                        <th className="p-4 text-left">Temp</th>
                        <th className="p-4 text-left">Humidity</th>
                        <th className="p-4 text-left">Soil</th>
                        <th className="p-4 text-left">LDR</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map((d) => (
                            <tr key={d.created_at}>
                                <td className="p-2">
                                    {new Date(d.created_at).toLocaleString()}
                                </td>
                                <td className="p-2">{d.temp}°C</td>
                                <td className="p-2">{d.humidity}%</td>
                                <td className="p-2">{d.soil_moisture}%</td>
                                <td className="p-2">{d.ldr}%</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center py-4">
                                Tidak ada data
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
