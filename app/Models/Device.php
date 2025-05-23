<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Device extends Model
{
    use HasFactory;

    protected $fillable = ['device_id', 'device_name', 'user_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function sensorData()
    {
        return $this->hasMany(SensorData::class, 'id_alat', 'device_id');
    }
}
