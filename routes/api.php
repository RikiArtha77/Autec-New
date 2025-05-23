<?php

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

    // Route Device (lihat dan simpan device milik user yang login)
    Route::get('/devices', [DeviceController::class, 'index']);
    Route::post('/devices', [DeviceController::class, 'store']);
});

// Route khusus petani
Route::middleware(['auth:sanctum', CheckRole::class . ':petani'])->group(function () {
    Route::post('/control', [ControlController::class, 'sendCommand']);
});

// // Route khusus user biasa
Route::middleware(['auth:sanctum', CheckRole::class . ':user'])->group(function () {
    Route::get('/', function () {
    return view('welcome');
    });
});

Route::get('/sensor', [SensorDataController::class, 'index']);
Route::post('/sensor', [SensorDataController::class, 'store']);
