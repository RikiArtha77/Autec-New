<?php

namespace App\Http\Controllers;

use App\Models\Device;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DeviceController extends Controller
{
    public function index()
    {
        $devices = Auth::user()->devices;
        return response()->json(['devices' => $devices]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'device_id' => 'required|unique:devices',
            'device_name' => 'nullable|string',
        ]);

        $device = Device::create([
            'device_id' => $request->device_id,
            'device_name' => $request->device_name,
            'user_id' => Auth::id(),
        ]);

        return response()->json(['device' => $device, 'message' => 'Device berhasil ditambahkan']);
    }
}
