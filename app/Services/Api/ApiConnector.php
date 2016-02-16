<?php

namespace Stensul\Services\Api;

/*
|--------------------------------------------------------------------------
| ApiConnector interface
|--------------------------------------------------------------------------
|
| This interface have the mandatory structure to implement in api, add new methods on demand.
|
*/

interface ApiConnector
{
    /**
     * Upload an email.
     *
     * @param $campaign
     * @param $name
     *
     * @return string path prefix
     */
    public function uploadEmail($campaign = null, $name = null);
}
