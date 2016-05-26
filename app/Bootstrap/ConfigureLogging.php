<?php

namespace Stensul\Bootstrap;

use Gelf\Publisher;
use Gelf\Transport\UdpTransport;
use Stensul\Handlers\Log\GelfHandler;
use Illuminate\Log\Writer;
use Monolog\Logger as Monolog;
use Stensul\Adapters\LogTest;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Foundation\Bootstrap\ConfigureLogging as DefaultConfigureLogging;

class ConfigureLogging extends DefaultConfigureLogging
{



    protected function configureCentralizedLogger(Application $app, Writer $log)
    {
        if (strlen(env('LOG_SERVER_HOST'))) {
            // we use the UDP transport to fire and forget
            $transport = new UdpTransport(env('LOG_SERVER_HOST'), env('LOG_SERVER_PORT'), UdpTransport::CHUNK_SIZE_LAN);
            
            $log->getMonolog()->pushHandler(new GelfHandler(new Publisher($transport)));

        }

    }


    protected function configureHandlers(Application $app, Writer $log)
    {

        parent::configureHandlers($app, $log);
      
        $this->configureCentralizedLogger($app, $log);

    }
}
