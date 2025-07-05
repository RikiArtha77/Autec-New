<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DemoLiveDataController extends Controller
{
    public function index()
    {
        $now = now();
        $data = [];

        // Ambil nilai "seed" dari detik ke-15 terakhir (tiap 15 detik berubah)
        $seed = floor(time() / 15);

        // Gunakan seed untuk memastikan data berubah setiap 15 detik
        mt_srand($seed);

        // Hasilkan 5 data terakhir dengan timestamp tiap 10 detik mundur
        for ($i = 0; $i < 5; $i++) {
            $data[] = [
                'id' => $i + 1,
                'temperature' => mt_rand(20, 35),
                'humidity' => mt_rand(40, 90),
                'soil_moisture' => mt_rand(30, 70),
                'light' => mt_rand(100, 800),
                'timestamp' => $now->copy()->subSeconds($i * 10)->toDateTimeString(),
            ];
        }

        return response()->json(array_reverse($data));
    }
}
