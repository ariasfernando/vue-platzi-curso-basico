<?php

namespace Stensul\Handlers\Log;

use Monolog\Handler\GelfHandler as MonologGelfHandler;
use Stensul\Formatters\GelfMessageFormatter;

class GelfHandler extends MonologGelfHandler
{

    protected function getDefaultFormatter()
    {
        return new GelfMessageFormatter();
    }
}
