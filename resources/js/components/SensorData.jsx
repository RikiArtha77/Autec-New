import { useState, useEffect } from "react";

function DeviceTableRow({ id_alat, temp, humidity, soil_moisture, ldr, created_at }) {
  const [showControlOptions, setShowControlOptions] = useState(false);
  const [controlStatusMessage, setControlStatusMessage] = useState("");

  const getSoilStatus = (soilValue) => {
    if (soilValue > 3000) {
      return { text: "Kering", color: "text-red-600", ledColor: "Merah" };
    } else if (soilValue <= 1500) {
      return { text: "Basah", color: "text-blue-600", ledColor: "Kuning" };
    } else {
      return { text: "Ideal", color: "text-green-600", ledColor: "Hijau" };
    }
  };

  const soilStatus = getSoilStatus(soil_moisture);

  const handleSendControlCommand = async (command) => {
    setControlStatusMessage("Mengirim perintah...");
    setShowControlOptions(false); // Tutup pilihan setelah diklik

    // URL API Laravel untuk kontrol LED
    const controlApiUrl = "http://127.0.0.1:8000/api/control-led"; 

    try {
      const response = await fetch(controlApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ 
          command: command.toString(), // Kirim command sebagai string '0', '1', '2', atau '3'
          // id_alat: id_alat // Aktifkan jika API Anda memerlukan id_alat
        }),
      });

      const result = await response.json();

      if (result.success) {
        setControlStatusMessage(`Perintah "${getLedName(command)}" berhasil dikirim.`);
        // Anda bisa juga memperbarui status LED di UI React jika API mengembalikan status baru
        // Atau biarkan ESP32 yang mengupdate statusnya sendiri via MQTT data update
      } else {
        setControlStatusMessage(`Gagal: ${result.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error sending control command:", error);
      setControlStatusMessage("Error jaringan saat mengirim perintah.");
    } finally {
      setTimeout(() => setControlStatusMessage(""), 3000); // Hapus pesan setelah 3 detik
    }
  };

  const getLedName = (command) => {
    if (command === "1") return "Merah";
    if (command === "2") return "Kuning"; // Sesuai logika ESP32
    if (command === "3") return "Hijau";  // Sesuai logika ESP32
    if (command === "0") return "Mati";
    return "Unknown";
  };

  return (
    <tr className="border-b last:border-none">
      <td className="p-4 text-gray-800 font-medium">{id_alat}</td>
      <td className="p-4 text-gray-800">{new Date(created_at).toLocaleString()}</td>
      <td className="p-4 text-gray-800">{humidity}%</td>
      <td className="p-4 text-gray-800">{temp}°C</td>
      <td className="p-4 text-gray-800">{soil_moisture}</td>
      <td className="p-4 text-gray-800">{ldr}</td>
      <td className={`p-4 font-medium ${soilStatus.color}`}>
        {soilStatus.text} (LED: {soilStatus.ledColor})
      </td>
      <td className="p-4 relative"> {/* Tambahkan relative untuk positioning dropdown */}
        <button
          onClick={() => setShowControlOptions(!showControlOptions)}
          className={`px-4 py-2 text-white text-sm font-semibold rounded transition-all bg-gray-500 hover:bg-gray-600`}
        >
          Kontrol LED
        </button>
        {showControlOptions && (
          <div className="absolute z-10 right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); handleSendControlCommand("1"); }}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-100 hover:text-red-700"
            >
              Nyalakan Merah
            </a>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); handleSendControlCommand("2"); }}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-100 hover:text-yellow-700"
            >
              Nyalakan Kuning
            </a>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); handleSendControlCommand("3"); }}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-100 hover:text-green-700"
            >
              Nyalakan Hijau
            </a>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); handleSendControlCommand("0"); }}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
            >
              Matikan Semua
            </a>
          </div>
        )}
        {controlStatusMessage && <p className="text-xs text-gray-600 mt-1">{controlStatusMessage}</p>}
      </td>
    </tr>
  );
}

// Komponen DeviceList tetap sama seperti sebelumnya, tidak perlu diubah untuk fungsionalitas ini.
export default function DeviceList() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl = "http://127.0.0.1:8000/api/sensor";
    const fetchData = async () => {
      setError(null);
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result.success && result.data) {
          setDevices(result.data);
        } else {
          if (!result.data) {
            setDevices([]);
          } else {
            throw new Error(result.message || "Gagal mengambil data dari API.");
          }
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching data:", err);
      } finally {
        // Hanya set loading ke false pada load awal
        if (loading) setLoading(false);
      }
    };

    fetchData();

    const intervalId = setInterval(() => {
      console.log("Fetching new data...");
      fetchData();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [loading]); // Tambahkan loading sebagai dependency agar setLoading(false) di finally dieksekusi dengan benar

  if (loading && devices.length === 0) {
    return <div className="text-center p-10">Memuat data sensor...</div>;
  }
  
  return (
    <div className="flex flex-col items-center justify-center text-center p-10 backdrop-blur-lg bg-transparent max-w-6xl w-full mx-auto mt-16 rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Monitoring Sensor ESP32</h1>
      {error && <p className="text-sm text-red-500 mb-4">Gagal memperbarui data: {error}. Menampilkan data terakhir.</p>}
      
      <div className="w-full overflow-x-auto">
        <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-4 text-left text-sm font-semibold text-gray-700">ID Alat</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Waktu Terdata</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Kelembaban Udara (%)</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Suhu (°C)</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Kelembaban Tanah</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Cahaya (LDR)</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Status Tanah (LED)</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Aksi Kontrol LED</th> {/* Judul kolom diubah */}
            </tr>
          </thead>
          <tbody>
            {devices.length > 0 ? (
              devices.map((device) => (
                <DeviceTableRow key={device.id || device.id_alat + device.created_at} {...device} />
              ))
            ) : (
              <tr>
                <td colSpan="8" className="p-4 text-center text-gray-500">
                  {loading ? "Memuat data sensor..." : "Tidak ada data sensor yang tersedia."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}