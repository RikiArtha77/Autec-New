<?php

use App\Http\Controllers\Api\DeviceAuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SensorDataController;
use App\Http\Controllers\ControlController;
use App\Http\Controllers\DeviceController;
use App\Http\Middleware\CheckRole;
use App\Http\Controllers\PetaniRequestController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\DemoLiveDataController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/device-login', [DeviceAuthController::class, 'login']);
Route::get('/sensors/{device_id}/latest', [SensorDataController::class, 'latest']);
Route::get('/sensors/{device_id}/history', [SensorDataController::class, 'history']);
Route::get('/sensor', [SensorDataController::class, 'index']);
Route::post('/sensor', [SensorDataController::class, 'store']);


// Route admin,petani,user
Route::middleware(['auth:sanctum','check.role:admin,petani,user'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::get('/admin/demo-live-data', [DemoLiveDataController::class, 'index']);
});

// Route petani
Route::middleware(['auth:sanctum','check.role:petani'])->group(function () {
    Route::get('/devices', [DeviceController::class, 'index']);
    Route::post('/devices', [DeviceController::class, 'store']);
});

// Route user biasa
Route::middleware(['auth:sanctum','check.role:user'])->group(function () {
    Route::post('/permohonan-petani', [PetaniRequestController::class, 'store']);
    Route::get('/permohonan-petani/check', [PetaniRequestController::class, 'check']);
    Route::get('/permohonan-petani/my-request', [PetaniRequestController::class, 'myRequest']);
    Route::get('/', fn() => response()->json(['message' => 'Selamat datang, user!']));
});

// Route admin
Route::middleware(['auth:sanctum','check.role:admin'])->group(function () {
    Route::get('/admin/permohonan-petani', [PetaniRequestController::class, 'index']);
    Route::patch('/admin/permohonan-petani/{id}', [PetaniRequestController::class, 'updateStatus']);
    Route::get('/admin/users', [AdminController::class, 'users']);
});

Route::middleware('auth:sanctum')->get('/permohonan-petani/my-request', [PetaniRequestController::class, 'myRequest']);
