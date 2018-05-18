<?php
namespace Stensul\Exceptions;

use Exception;

class PermissionDeniedException extends Exception
{
    protected $message = 'Permission denied.';
}
