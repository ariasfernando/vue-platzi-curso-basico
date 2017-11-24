<?php

namespace Stensul\Services;

use Log;
use Queue;
use Storage;
use Imagine\Image\ImageInterface;
use Symfony\Component\Process\Process;
use Folklore\Image\Exception\Exception as ImagineException;
use Folklore\Image\Facades\Image as ImageDriver;

class ImageProcessor extends ImageDriver
{
    /**
     * Composite a gif image
     *
     * @param  string $blob
     * @param  string $layer
     * @param  string $geometry
     * @return string
     */
    public static function compositeGif($blob, $layer, $size, $position, $params = [])
    {
        $layer = self::prepareLayer($layer);
        $gravity = '';
        if (!empty($params['gravity'])) {
            if ($params['gravity'] == "NorthEast") {
                $gravity = ' -gravity East ';
            }
            if ($params['gravity'] == "SouthWest") {
                $gravity = ' -gravity South ';
            }
        }
        $command = \Config::get('image.convert_base_path') . sprintf(" +dither - -coalesce null: \( %s -resize %s ".$gravity." -set page %s \)"
            . " -layers composite -layers optimize -", $layer, $size, $position);

        $process = new Process($command, null, null, $blob);
        $process->run();

        if (!$process->isSuccessful()) {
            \Log::error($process->getErrorOutput());
            throw new ImagineException("Error optimazing image");
        }

        return $process->getOutput();
    }

    /**
     * Composite an image
     *
     * @param  string $blob
     * @param  string $layer
     * @param  string $geometry
     * @return string
     */
    public static function compositeImage($blob, $layer, $geometry)
    {
        $layer = self::prepareLayer($layer);
        $convert_params = ' - ' . $layer . ' -geometry ' . $geometry;
        if (!empty($params['gravity'])) {
            $convert_params .= ' -gravity '. $params['gravity'];
        }
        $convert_params .= ' -composite -';
        $command = \Config::get('image.convert_base_path') . $convert_params;
        $process = new Process($command, null, null, $blob);
        $process->run();

        if (!$process->isSuccessful()) {
            \Log::error($process->getErrorOutput());
            throw new ImagineException("Error optimazing image");
        }

        return $process->getOutput();
    }

    /**
     * Convert an image
     *
     * @param  string $blob
     * @param  array  $options
     * @return string
     */
    public static function convert($blob, $options = [])
    {
        $convert_params = ' -';

        if (count($options)) {
            foreach ($options as $k => $v) {
                if (strlen($v) > 0) {
                    if ($k == "repage") {
                        $convert_params .= " +{$k} {$v}";
                    } else {
                        $convert_params .= " -{$k} {$v}";
                    }
                } else {
                    $convert_params .= " -{$k}";
                }
            }
        }

        $convert_params .= ' -';

        $command = \Config::get('image.convert_base_path') . $convert_params;
        $process = new Process($command, null, null, $blob);
        $process->run();

        if (!$process->isSuccessful()) {
            \Log::error($process->getErrorOutput());
            throw new ImagineException("Error optimazing image");
        }

        return $process->getOutput();
    }

    /**
     * Optimize assets.
     *
     * @param string $path
     *
     * @return queue.
     */
    public static function optimize($blob)
    {
        $command_base = \Config::get('image.convert_base_path');
        $process = new Process($command_base .  ' - -layers Optimize -', null, null, $blob);
        $process->run();

        if (!$process->isSuccessful()) {
            \Log::error($process->getErrorOutput());
            throw new ImagineException("Error optimazing image");
        }

        return $process->getOutput();
    }

    /**
     * Prepare layer in order to allow the use of base64 images.
     */
    private static function prepareLayer($layer)
    {
        if (strpos($layer, ';base64') !== false) {
            $temp = explode(',', $layer);
            $layer = base64_decode(end($temp));
            $tmp_file = tempnam(sys_get_temp_dir(), 'convert-');
            file_put_contents($tmp_file, $layer);
            return "ephemeral:{$tmp_file}";
        }
        return $layer;
    }

    /**
     * Get image object
     * @param string $blob
     * @param string $storage_disk
     *
     * @return array data image or error.
     */
    protected function getImageObject($blob, $storage_disk)
    {
        $extension = null;

        try {
            if (!filter_var($blob, FILTER_VALIDATE_URL)) {
                if ((strpos($blob, ';base64') !== false)) {
                    list($type, $blob) = explode(';', $blob);
                    list(, $blob) = explode(',', $blob);
                    list(, $extension) = explode('/', $type);
                    $blob = base64_decode($blob);
                    $image = Self::load($blob);
                } else {
                    $storage = Storage::disk($storage_disk);
                    $image = (strpos($blob, public_path()) === false)?
                        Self::load($storage->get($blob)) :
                        Self::open($blob);
                    $extension = pathinfo($blob)["extension"];
                }
            } else {
                $image = Self::open($blob);
                $extension = pathinfo($blob)["extension"];
            }
        } catch (\Exception $e) {
            $error_msg =sprintf(
                "Image open %s failed.",
                $blob
            );
            Log::warning($error_msg);
            throw new \Exception($error_msg);
        }

        switch ($extension) {
            case (\Config::get("image.force_conversion_jpg", false)
                || in_array($extension, ['jpg', 'jpeg', 'pjpeg', 'pjpg'])):
                $options = [ 'jpeg_quality' => 100 ];
                $extension = 'jpg';
                break;
            case 'png':
                $options = [ 'png_compression_level' => 9 ];
                break;
            case 'gif':
                $options = [
                    'animated'=> true
                ];
                break;
            default:
                return ["error" => "EXTENSION_DENY"];
        }

        $options['resolution-units'] = ImageInterface::RESOLUTION_PIXELSPERINCH;
        $options['resolution-x'] = 900;
        $options['resolution-y'] = 900;

        if (\Config::get("image.driver", "imagick") != "gd") {
            $options['resampling-filter'] = ImageInterface::FILTER_LANCZOS;
        }

        return [ $image, $extension, $options ];
    }

    /**
     * Get the image name
     * @param string $extension
     * @param string $extension
     *
     * @return array Name or error.
     */
    private function getImageName($extension = "jpg")
    {
        return uniqid().'-'.microtime(true).'.'.$extension;
    }

    /**
     * Save image
     * @param string $blob
     * @param string $storage_disk
     * @param string $path
     *
     * @return array Path or error.
     */
    public function saveImage($blob, $storage_disk, $path = null)
    {

        list($image, $extension, $options) = $this->getImageObject($blob, $storage_disk);

        $storage = Storage::disk($storage_disk);
        $file_path = ($path ? DS . $path : '') . DS .$this->getImageName($extension);

        try {
            $success = $storage->put($file_path, $image->get($extension, $options));
        } catch (Exception $e) {
            Log::warning(
                sprintf(
                    "Image storage for file %s failed. Attempting one more time",
                    $this->getCampaign()->id,
                    $file_path
                )
            );

            usleep(50000);
            $success = $storage->put($file_path, $image->get($extension, $options));
        }

        if ($success) {
            $response['path'] = $file_path;
        } else {
            $response['error'] = 'CANVAS_UPLOAD_ERROR';
        }

        return $response;
    }
}
