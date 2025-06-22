<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SensorData;
use App\Models\Device;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class SensorDataController extends Controller
{
    public function store(Request $request)
    {
        // Validasi input
        $validator = Validator::make($request->all(), [
            'id_alat' => 'required|string|exists:devices,device_id',
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
            ], 422);
        }

        try {
            $data = $validator->validated();

            $sensorData = SensorData::create([
                'id_alat' => $data['id_alat'],
                'temp' => $data['temp'],
                'humidity' => $data['humidity'],
                'soil_moisture' => $data['soil_moisture'],
                'ldr' => $data['ldr'],
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Data sensor berhasil disimpan.',
                'data' => $sensorData
            ], 201);

        } catch (\Exception $e) {
            Log::error('Gagal menyimpan data sensor: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan data sensor.',
            ], 500);
        }
    }

    public function index(Request $request)
    {
        $query = SensorData::orderBy('created_at', 'desc');

        // Opsional: filter berdasarkan ID alat
        if ($request->has('device_id')) {
            $query->where('id_alat', $request->device_id);
        }

        return response()->json([
            'success' => true,
            'message' => 'Data sensor berhasil diambil.',
            'data' => $query->get()
        ]);
    }
    public function latest($device_id)
    {
        $device = Device::where('device_id', $device_id)->firstOrFail();
        $data = SensorData::where('id_alat', $device->device_id)->latest()->first();

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    public function history(Request $request, $device_id)
    {
        $device = Device::where('device_id', $device_id)->firstOrFail();
        $query = SensorData::where('id_alat', $device->device_id)->orderBy('created_at', 'desc');

        if ($request->has('from') && $request->has('to')) {
            $query->whereBetween('created_at', [$request->from, $request->to]);
        }

        return response()->json([
            'success' => true,
            'data' => $query->get(),
        ]);
    }
}