<?php

namespace Stensul\Bootstrap;

use Gelf\Publisher;
use Gelf\Transport\UdpTransport;
use Stensul\Handlers\Log\GelfHandler;
use Illuminate\Log\Writer;
use Monolog\Logger as Monolog;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Foundation\Bootstrap\ConfigureLogging as DefaultConfigureLogging;

class ConfigureLogging extends DefaultConfigureLogging
{


    /**
     * Configure the Gelf handlers for the application.
     * Only if LOG_SERVER_HOST exists. This is done to avoid to setup
     * this in dev environment.
     *
     * @param  \Illuminate\Contracts\Foundation\Application  $app
     * @param  \Illuminate\Log\Writer  $log
     * @return void
     */
    protected function configureCentralizedLogger(Application $app, Writer $log)
    {
        if (strlen(env('LOG_SERVER_HOST'))) {
            // use the UDP transport to fire and forget
            $transport = new UdpTransport(env('LOG_SERVER_HOST'), env('LOG_SERVER_PORT'), UdpTransport::CHUNK_SIZE_LAN);
            $log->getMonolog()->pushHandler(new GelfHandler(new Publisher($transport)));
        }
    }


    /**
     * Configure the Monolog handlers for the application.
     * First the ones in the parent and after the created here.
     *
     * @param  \Illuminate\Contracts\Foundation\Application  $app
     * @param  \Illuminate\Log\Writer  $log
     * @return void
     */
    protected function configureHandlers(Application $app, Writer $log)
    {

        parent::configureHandlers($app, $log);
      
        $this->configureCentralizedLogger($app, $log);
    }
}
