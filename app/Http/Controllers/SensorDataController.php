<?php

namespace App\Http\Controllers; // Sesuaikan namespace jika Anda memindahkannya ke App\Http\Controllers\Api

use Illuminate\Http\Request;
use App\Models\SensorData;
use Illuminate\Support\Facades\Validator; // Tambahkan ini untuk validasi
use Illuminate\Support\Facades\Log;

class SensorDataController extends Controller // Pastikan extends Controller
{
    public function store(Request $request)
    {
        // Validasi input data yang diterima
        $validator = Validator::make($request->all(), [
            'id_alat' => 'required|string|max:255',
            'temp' => 'required|numeric',
            'humidity' => 'required|numeric',
            'soil_moisture' => 'required|numeric',
            'ldr' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal.',
                'errors' => $validator->errors()
            ], 422); // Unprocessable Entity
        }

        $validatedData = $validator->validated();

        try {
            // Menggunakan updateOrCreate:
            // Argumen pertama: kondisi untuk mencari data (berdasarkan id_alat)
            // Argumen kedua: data yang akan di-update atau dibuat jika tidak ditemukan
            $sensorData = SensorData::updateOrCreate(
                ['id_alat' => $validatedData['id_alat']], // Kunci untuk mencari
                [ // Data untuk di-update atau dibuat
                    'temp' => $validatedData['temp'],
                    'humidity' => $validatedData['humidity'],
                    'soil_moisture' => $validatedData['soil_moisture'],
                    'ldr' => $validatedData['ldr'],
                ]
            );

            // Cek apakah data baru dibuat atau diupdate untuk pesan respons
            if ($sensorData->wasRecentlyCreated) {
                $message = 'Data sensor baru berhasil disimpan.';
                $statusCode = 201; // Created
            } else {
                $message = 'Data sensor berhasil diperbarui.';
                $statusCode = 200; // OK
            }

            return response()->json([
                'success' => true,
                'message' => $message,
                'data' => $sensorData
            ], $statusCode);

        } catch (\Exception $e) {
            Log::error('Gagal menyimpan atau memperbarui data sensor: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan pada server saat memproses data sensor.',
                // 'error_detail' => $e->getMessage() // Sebaiknya jangan tampilkan detail error di produksi
            ], 500); // Internal Server Error
        }
    }

    public function index()
    {
        $sensorData = SensorData::orderBy('created_at', 'desc')->get();
        
        return response()->json([
            'success' => true,
            'message' => 'Daftar semua data sensor berhasil diambil.',
            'data' => $sensorData
        ], 200);
    }
}