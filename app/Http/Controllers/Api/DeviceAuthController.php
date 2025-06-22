<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Device;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class DeviceAuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required',
            'password' => 'required',
        ]);

        $device = Device::where('username', $request->username)->first();

        if (!$device || !Hash::check($request->password, $device->password)) {
            return response()->json(['success' => false, 'message' => 'Login gagal'], 401);
        }

        return response()->json(['success' => true, 'message' => 'Login berhasil']);
    }
}
