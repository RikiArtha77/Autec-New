<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use PhpMqtt\Client\MqttClient;
use PhpMqtt\Client\ConnectionSettings;
use Illuminate\Support\Facades\Http; // Laravel HTTP Client
use Illuminate\Support\Facades\Log;   // Untuk logging

class MqttSubscribeCommand extends Command
{
    protected $signature = 'mqtt:subscribe';
    protected $description = 'Subscribe to an MQTT topic and forward data to API';

    public function handle()
    {
        $server   = 'b1dbb0b5e8f24707b0931b29a8599510.s1.eu.hivemq.cloud'; // Dari HiveMQ Cloud
        $port     = 8883; // Atau 1883 jika non-SSL
        $clientId = 'laravel-subscriber-' . uniqid(); // ID unik
        $username = 'hivemq.webclient.1746708815363'; // Dari HiveMQ Cloud
        $password = 'o$6:gs5GEUF43dOP.%kv'; // Dari HiveMQ Cloud
        $topic    = 'esp32/sensordata/all'; // Harus sama dengan yang dipublish ESP32

        // URL API Laravel Anda
        $laravelApiUrl = url('/api/sensor'); // Menggunakan helper url() untuk path relatif

        try {
            $mqtt = new MqttClient($server, $port, $clientId);

            // Konfigurasi Koneksi (terutama untuk SSL/TLS)
            $connectionSettings = (new ConnectionSettings)
                ->setUsername($username)
                ->setPassword($password)
                ->setUseTls(true) // Set true jika menggunakan port SSL (misalnya 8883)
                // ->setTlsSelfSignedAllowed(false) // Jangan izinkan self-signed certs di production
                // ->setTlsVerifyPeer(true) // Verifikasi SSL peer
                // ->setCaFile('/path/to/ca/file.pem') // Jika broker Anda menggunakan CA custom
                ->setKeepAliveInterval(60);
                // Tambahkan konfigurasi SSL lain jika diperlukan oleh HiveMQ Cloud

            $this->info("Connecting to MQTT broker: {$server}:{$port}");
            $mqtt->connect($connectionSettings, true); // true untuk clean session
            $this->info("Connected to MQTT broker.");

            $this->info("Subscribing to topic: {$topic}");
            $mqtt->subscribe($topic, function ($receivedTopic, $message) use ($laravelApiUrl) {
                $this->line("Received message on topic [{$receivedTopic}]: {$message}");
                Log::info("MQTT Message Received: Topic [{$receivedTopic}], Message: {$message}");

                try {
                    $data = json_decode($message, true);

                    if (json_last_error() === JSON_ERROR_NONE && is_array($data)) {
                        // Kirim data ke API Laravel
                        $response = Http::post($laravelApiUrl, $data);

                        if ($response->successful()) {
                            $this->info("Data successfully sent to Laravel API. Response: " . $response->body());
                            Log::info("API POST Success: " . $response->body());
                        } else {
                            $this->error("Failed to send data to Laravel API. Status: " . $response->status() . " Body: " . $response->body());
                            Log::error("API POST Failed: Status " . $response->status() . " Body: " . $response->body());
                        }
                    } else {
                        $this->error("Failed to decode JSON from MQTT message: " . $message);
                        Log::error("MQTT JSON Decode Failed: " . $message);
                    }
                } catch (\Exception $e) {
                    $this->error("Error processing MQTT message or calling API: " . $e->getMessage());
                    Log::error("Error processing MQTT message or calling API: " . $e->getMessage());
                }
            }, 0); // QoS 0

            // Loop untuk menjaga koneksi dan menerima pesan
            // Timeout loop diatur ke nilai tinggi agar terus berjalan,
            // atau Anda bisa menggunakan loop tak terbatas dengan penanganan sinyal untuk keluar.
            $this->info("Listening for messages. Press Ctrl+C to exit.");
            while ($mqtt->isConnected()) {
                try {
                    $mqtt->loop(true); // true untuk blocking loop dengan timeout default
                } catch (\PhpMqtt\Client\Exceptions\MqttClientException $e) {
                    $this->error("MQTT Client Exception: " . $e->getMessage());
                    Log::error("MQTT Client Exception: " . $e->getMessage());
                    // Coba reconnect atau hentikan gracefully
                    $this->error("Attempting to reconnect...");
                    sleep(5); // Tunggu sebelum reconnect
                    // Implementasikan logika reconnect yang lebih baik jika perlu
                    if (!$mqtt->isConnected()) {
                         try {
                            $mqtt->connect($connectionSettings, true);
                            $mqtt->subscribe($topic, function ($receivedTopic, $message) use ($laravelApiUrl) { /* ... (callback yang sama) ... */ }, 0);
                         } catch (\Exception $connErr) {
                             $this->error("Reconnect failed: " . $connErr->getMessage());
                             break; // Keluar dari loop jika reconnect gagal terus menerus
                         }
                    }
                }
            }

            $mqtt->disconnect();
            $this->info("Disconnected from MQTT broker.");

        } catch (\Exception $e) {
            $this->error("Could not connect to MQTT broker or other exception: " . $e->getMessage());
            Log::error("MQTT Connection/General Error: " . $e->getMessage());
            return 1; // Return error code
        }
        return 0; // Return success code
    }
}