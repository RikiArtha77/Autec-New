<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\PetaniRequest;
use App\Models\SensorData;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    // Lihat semua user
    public function users()
    {
        $users = User::with('role')->get();
        return response()->json(['data' => $users]);
    }
}
