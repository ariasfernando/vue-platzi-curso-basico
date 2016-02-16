<?php

namespace Stensul\Providers\MongoDb;

use MongoClient;

class Connection extends \Jenssegers\Mongodb\Connection
{

    protected static $maxTries = 5;

    /**
     * Create a new MongoClient connection.
     *
     * @param  string  $dsn
     * @param  array   $config
     * @param  array   $options
     * @return MongoClient
     */
    protected function createConnection($dsn, array $config, array $options)
    {
        $currentTry = 1;
        $client = false;
 
        do {
            try {
                usleep(round(log10($currentTry) * 1000000));
                $currentTry++;
                $client = parent::createConnection($dsn, $config, $options);
                break;
            } catch (\MongoConnectionException $e) {
                \Log::warning(sprintf(
                    "Error connecting to MongoDb, attempt %d, max attempts: %d",
                    $currentTry - 1,
                    self::$maxTries
                ));
            }

        } while ($currentTry <= self::$maxTries);

        if (isset($e)) {
            throw $e;
        }

        return $client;
    }
}
