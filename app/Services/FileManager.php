<?php

namespace Stensul\Services;

use Log;
use Cdn;
use Storage;
use League\Flysystem\AdapterInterface;

class FileManager
{

    private $files = [];

    /**
     * @param object $file
     *
     * @return array Path or error.
     */
    public static function saveFont($file)
    {
        $storage = Storage::disk('local:fonts');
        $file_path = $file->getClientOriginalName();

        try {
            $success = $storage->put($file_path, $file);
        } catch (Exception $e) {
            Log::warning(
                sprintf(
                    "[%s] font storage for file %s failed. Attempting one more time",
                    $this->getCampaign()->id,
                    $file_path
                )
            );

            usleep(50000);
            $success = $storage->put($file_path, $file);
        }

        if ($success) {
            $response['path'] = $file_path;
        } else {
            $response['error'] = 'CANVAS_UPLOAD_ERROR';
        }

        return $response;
    }
}
