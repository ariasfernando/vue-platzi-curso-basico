<?php

namespace Stensul\Services;

use Log;
use Queue;
use Storage;
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
            if($params['gravity'] == "NorthEast"){
                $gravity = ' -gravity East ';
            }
            if($params['gravity'] == "SouthWest"){
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
            throw new ImagineException("Error optimizing image");
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
                if($k == "repage"){
                    $convert_params .= " +{$k} {$v}";
                }else{
                    $convert_params .= " -{$k} {$v}";
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
            return $tmp_file;
        }
        return $layer;
    }
}
