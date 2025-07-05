<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class CheckRole
{
    // Mapping nama ke role_id
    protected array $roleMap = [
        'user' => 1,
        'petani' => 2,
        'admin' => 3,
    ];

    public function handle($request, Closure $next, ...$roles): mixed
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Ubah semua nama role ke role_id
        $mappedRoleIds = array_map(function ($role) {
            return $this->roleMap[$role] ?? null;
        }, $roles);

        // Validasi role_id user
        if (!in_array($user->role_id, $mappedRoleIds)) {
            return response()->json(['message' => 'Akses ditolak'], 403);
        }

        return $next($request);
    }
}
