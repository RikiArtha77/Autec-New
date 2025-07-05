<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleSeeder extends Seeder
{
public function run(): void
    {
        Role::insert([
            ['name' => 'user', 'description' => 'Pengguna biasa'],
            ['name' => 'petani', 'description' => 'Petani dengan akses alat'],
            ['name' => 'admin', 'description' => 'Administrator sistem'],
        ]);
    }
}