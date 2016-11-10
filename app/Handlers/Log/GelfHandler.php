<?php

namespace Stensul\Handlers\Log;

use Monolog\Handler\GelfHandler as MonologGelfHandler;
use Stensul\Formatters\GelfMessageFormatter;

/**
 * {@inheritDoc}
 */
class GelfHandler extends MonologGelfHandler
{

    /**
     * {@inheritDoc}
     */
    protected function getDefaultFormatter()
    {
        return new GelfMessageFormatter();
    }
}
