<?php

if (!class_exists('PHPUnit_Framework_TestCase'))
{
    /**
     * Workaround for Laravel 5.3 and PHPUnit 6 namespaced classes.
     */
    class PHPUnit_Framework_TestCase extends PHPUnit\Framework\TestCase
    {

    }
}
