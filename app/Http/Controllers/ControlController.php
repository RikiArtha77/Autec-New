<?php

// app/Http/Controllers/ControlController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use PhpMqtt\Client\MqttClient;
use PhpMqtt\Client\ConnectionSettings;
use PhpMqtt\Client\Exceptions\MqttClientException;

class ControlController extends Controller
{
    public function sendCommand(Request $request)
    {
        $request->validate([
            'code' => 'required|in:1,2,3',
        ]);

        $code = $request->input('code');

        $server   = 'b1dbb0b5e8f24707b0931b29a8599510.s1.eu.hivemq.cloud';
        $port     = 8883;
        $clientId = 'laravel-publisher-';
        $username = 'hivemq.webclient.1746708815363';
        $password = 'o$6:gs5GEUF43dOP.%kv';

        try {
            $connectionSettings = (new ConnectionSettings)
                ->setUsername($username)
                ->setPassword($password)
                ->setUseTls(true); // Penting untuk HiveMQ

            $mqtt = new MqttClient($server, $port, $clientId, MqttClient::MQTT_3_1_1);
            $mqtt->connect($connectionSettings, true);
            $mqtt->publish('data/control', $code, 0);
            $mqtt->disconnect();

            return response()->json([
                'status' => 'sent',
                'code' => $code
            ]);
        } catch (MqttClientException $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
