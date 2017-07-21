<?php
namespace Stensul\Exceptions;

use Exception;

class ModelKeyManagerException extends Exception
{
    protected $message = 'Maximum amount of iterations reached. Couldn\'t genereate a random key.';
}
