<?php

namespace Stensul\Services\Api;

/*
|--------------------------------------------------------------------------
| ApiImageConnector interface
|--------------------------------------------------------------------------
|
| This interface have the mandatory structure to implement in api image, add new methods on demand.
|
*/

interface ApiImageConnector
{

    /**
     * Get public images
     *
     * @param Array $options
     *
     * @return Array
     */
    public function getPublicImages();

    /**
     * Transform the response data usign the image transformer
     *
     * @param Array $data
     *
     * @return Array
     */
    public function imageTransform($data = []);

    /**
     * Return a cache key
     *
     * @return String
     */
    public function getCacheKey();
}
