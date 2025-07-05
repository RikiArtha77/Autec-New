<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PetaniRequest;

class PetaniRequestController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'alasan' => 'required|string|max:1000',
        ]);

        $user = $request->user();

        // Cek jika sudah pernah mengajukan dan belum diproses
        if ($user->petaniRequest && $user->petaniRequest->status === 'pending') {
            return response()->json(['message' => 'Permohonan Anda masih dalam proses.'], 400);
        }

        $requestPetani = PetaniRequest::create([
            'user_id' => $user->id,
            'alasan'  => $request->alasan,
            'status'  => 'pending',
        ]);

        return response()->json([
            'message' => 'Permohonan berhasil dikirim.',
            'data' => $requestPetani,
        ]);
    }

    // Admin-only: Melihat semua permohonan
    public function index(Request $request)
    {
        // Hanya admin (role_id = 3) yang boleh akses
        if ($request->user()->role_id !== 3) {
            return response()->json(['message' => 'Akses ditolak'], 403);
        }

        // Ambil semua permohonan menjadi petani dengan relasi user
        $requests = PetaniRequest::with('user')->latest()->get();

        return response()->json(['data' => $requests]);
    }

    // Admin-only: Update status permohonan
    public function updateStatus(Request $request, $id)
    {
        // Cek apakah user bukan admin (role_id = 3)
        if ($request->user()->role_id !== 3) {
            return response()->json(['message' => 'Akses ditolak'], 403);
        }

        // Validasi input status
        $request->validate([
            'status' => 'required|in:approved,rejected',
        ]);

        // Cari permohonan berdasarkan ID
        $permohonan = PetaniRequest::find($id);
        if (!$permohonan) {
            return response()->json(['message' => 'Permohonan tidak ditemukan'], 404);
        }

        // Update status permohonan
        $permohonan->status = $request->status;
        $permohonan->save();

        // Jika disetujui, ubah role user menjadi 'petani' (role_id = 2)
        if ($request->status === 'approved') {
            $permohonan->user->update(['role_id' => 2]);
        }

        return response()->json(['message' => 'Status permohonan diperbarui.']);
    }

    public function check(Request $request)
    {
        $user = $request->user();

        $requests = $user->petaniRequests()->latest()->get();

        return response()->json([
            'count' => $requests->count(),
            'data' => $requests,
        ]);
    }

    public function myRequest(Request $request)
    {
        $user = $request->user();

        $requests = PetaniRequest::where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'message' => 'Data permohonan Anda berhasil diambil.',
            'data' => $requests,
        ]);
    }
}