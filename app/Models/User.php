<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
// Jika pakai sanctum untuk API token
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    // Field yang boleh diisi massal (fillable)
    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
    ];

    // Field yang disembunyikan di output JSON
    protected $hidden = [
        'password',
        'remember_token',
    ];

    // Cast otomatis tipe data
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    // Relasi 1 User punya banyak Device
    public function devices()
    {
        return $this->hasMany(Device::class);
    }

    public function petaniRequest()
    {
        return $this->hasOne(PetaniRequest::class);
    }

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function petaniRequests()
    {
        return $this->hasMany(PetaniRequest::class);
    }
}
