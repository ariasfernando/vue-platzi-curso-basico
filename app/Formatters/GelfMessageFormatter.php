<?php

namespace Stensul\Formatters;

use Auth;
use Monolog\Formatter\GelfMessageFormatter as MonologGelfMessageFormatter;

/**
 * {@inheritDoc}
 */
class GelfMessageFormatter extends MonologGelfMessageFormatter
{

    public function __construct($systemName = null, $extraPrefix = null, $contextPrefix = '')
    {
        parent::__construct('U.u');

        $this->systemName = $systemName ?: gethostname();

        $this->extraPrefix = $extraPrefix;
        $this->contextPrefix = $contextPrefix;
    }


    /**
     * Add stensul own information that will help us to spot the problem
     * easily.
     * @param  array  $record the exception record as is
     * @return array         return the record to the parent class so it can be logged
     */
    public function format(array $record)
    {
        $record['extra']['com.stensul.environment'] = strtolower(env('APP_ENV'));
        $record['extra']['com.stensul.application'] = strtolower(env('APP_NAME'));
        $record['extra']['com.stensul.sapi'] = strtolower(php_sapi_name());

        if (Auth::check()) {
            $record['extra']['com.stensul.user.id'] = Auth::id();
        }

        return parent::format($record);
    }
}
