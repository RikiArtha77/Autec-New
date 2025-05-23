import { useEffect, useState } from "react";

function DeviceTableRow({ device, onToggle }) {
  const { device_name, location, humidity = '-', status = false } = device;

  return (
    <tr className="border-b last:border-none">
      <td className="p-4 text-gray-800 font-medium">{device_name}</td>
      <td className="p-4 text-gray-800">{location || '-'}</td>
      <td className="p-4 text-gray-800">{humidity}%</td>
      <td className={`p-4 font-medium ${status ? 'text-green-600' : 'text-red-600'}`}>{status ? "Aktif" : "Mati"}</td>
      <td className="p-4">
        <button
          onClick={() => onToggle(device)}
          className={`px-4 py-2 text-white text-sm font-semibold rounded transition-all ${status ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
        >
          {status ? "Matikan" : "Nyalakan"}
        </button>
      </td>
    </tr>
  );
}

export default function DeviceList() {
  const [devices, setDevices] = useState([]);
  const [newDeviceId, setNewDeviceId] = useState('');
  const [newDeviceName, setNewDeviceName] = useState('');
  const [message, setMessage] = useState('');

  const token = localStorage.getItem("token");

  // Ambil data dari API
  useEffect(() => {
    fetch("http://localhost:8000/api/devices", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setDevices(data.devices || []))
      .catch((err) => console.error("Gagal mengambil data", err));
  }, []);

  // Fungsi tambah device
  const handleAddDevice = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await fetch("http://localhost:8000/api/devices", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          device_id: newDeviceId,
          device_name: newDeviceName,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setDevices([...devices, data.device]);
        setNewDeviceId('');
        setNewDeviceName('');
        setMessage('Alat berhasil ditambahkan');
      } else {
        setMessage(data.message || 'Gagal menambahkan alat');
      }
    } catch (error) {
      setMessage('Kesalahan jaringan');
    }
  };

  const handleToggle = (device) => {
    // Tambahkan fitur toggle status ke backend jika diperlukan
    alert(`Toggle status untuk ${device.device_name}`);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white/40 backdrop-blur rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">Daftar Alat Anda</h2>

      {message && <p className="text-center text-green-600 mb-4">{message}</p>}

      <form onSubmit={handleAddDevice} className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="ID Alat (device_id)"
          value={newDeviceId}
          onChange={(e) => setNewDeviceId(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-md"
          required
        />
        <input
          type="text"
          placeholder="Nama Alat"
          value={newDeviceName}
          onChange={(e) => setNewDeviceName(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-md"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Tambah Alat
        </button>
      </form>

      <table className="w-full bg-white shadow rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-4 text-left">Nama Alat</th>
            <th className="p-4 text-left">Lokasi</th>
            <th className="p-4 text-left">Kelembaban</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-left">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {devices.length === 0 ? (
            <tr>
              <td colSpan="5" className="p-4 text-center text-gray-600">Belum ada alat terdaftar</td>
            </tr>
          ) : (
            devices.map((device) => (
              <DeviceTableRow key={device.device_id} device={device} onToggle={handleToggle} />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}