<?php

use App\Http\Controllers\Api\DeviceAuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SensorDataController;
use App\Http\Controllers\ControlController;
use App\Http\Controllers\DeviceController;
use App\Http\Middleware\CheckRole;

// Route Public (tanpa autentikasi)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Route yang butuh autentikasi
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/user', [AuthController::class, 'user']);

    // Device milik user
    Route::get('/devices', [DeviceController::class, 'index']);
    Route::post('/devices', [DeviceController::class, 'store']);
});

// Route untuk login alat
Route::middleware(['auth:sanctum', CheckRole::class . ':petani'])->group(function () {
    Route::post('/control', [ControlController::class, 'sendCommand']);
});

// Route user biasa
Route::middleware(['auth:sanctum', CheckRole::class . ':user'])->group(function () {
    Route::get('/', function () {
        return view('welcome');
    });
});

// Route sensor data (umum)
Route::get('/sensor', [SensorDataController::class, 'index']);
Route::post('/sensor', [SensorDataController::class, 'store']);
Route::get('/sensors/{device_id}/latest', [SensorDataController::class, 'latest']);
Route::get('/sensors/{device_id}/history', [SensorDataController::class, 'history']);
Route::post('/device-login', [DeviceAuthController::class, 'login']);