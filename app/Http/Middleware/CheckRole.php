<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class CheckRole
{
    public function handle($request, Closure $next, ...$roles)
    {
        $user = Auth::user();

        if (!$user || !in_array($user->role, $roles)) {
            return response()->json(['message' => 'Akses ditolak.'], 403);
        }

        return $next($request);
    }
}
