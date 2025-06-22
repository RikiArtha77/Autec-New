<?php

namespace App\Http\Controllers;

use App\Models\Device;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DeviceController extends Controller
{
    // Menampilkan semua alat milik user yang login
    public function index()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Mengambil semua device milik user termasuk nama user
        $devices = Device::with('user:id,name')->where('user_id', $user->id)->get();

        return response()->json(['devices' => $devices]);
    }

    // Menyimpan alat baru milik user yang login
    public function store(Request $request)
    {
        $request->validate([
            'device_id' => 'required|unique:devices',
            'device_name' => 'required|string',
            'username' => 'required|unique:devices,username',
            'password' => 'required|string|min:6',
        ]);

        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $device = Device::create([
            'device_id' => $request->device_id,
            'device_name' => $request->device_name,
            'username' => $request->username,
            'password' => bcrypt($request->password),
            'user_id' => Auth::id()
        ]);

        return response()->json([
            'message' => 'Device berhasil ditambahkan',
            'device' => $device
        ], 201);
    }
}
