<?php

namespace Stensul\Services;

use Log;
use Cdn;
use Imagine;
use Storage;
use Imagine\Image\ImageInterface;
use League\Flysystem\AdapterInterface;
use Stensul\Services\EmailHtmlCreator as Html;

class StaticProcessor
{
    protected $campaign;

    private $files = [];

    /**
     * Constructor.
     *
     * @param \Stensul\Models\Campaign $campaign
     */
    public function __construct(\Stensul\Models\Campaign $campaign)
    {
        $this->campaign = $campaign;
    }

    /**
     * Get campaign model.
     *
     * @return \Stensul\Models\Campaign
     */
    public function getCampaign()
    {
        return $this->campaign;
    }

    /**
     * Store assets in CDN.
     */
    public function storeAssetsInCdn()
    {
        $local = Storage::disk('local:campaigns');
        $public = Storage::disk('local:public');
        $cloud = Storage::disk('cloud');
        $module = Storage::disk('local:modules');

        // get email template
        $html = new Html($this->getCampaign());

        $files = [];

        $files['image'] = $local->allFiles($this->getCampaign()->fsRelativePath());
        $files['common'] = $public->allFiles('_common');
        $files['font'] = $public->allFiles('fonts');
        $files['module'] = $module->allFiles();

        foreach ($files as $fileType => $fileGroup) {
            foreach ($fileGroup as $file) {
                $path = trim($this->getCampaign()->getCdnPath(), DS) . DS;
                $path .= ($fileType == 'font') ? $file : 'images' . DS . basename($file);

                if (strpos($html->getEmailLayout(), basename($file)) !== false) {
                    if (!$cloud->exists($path)) {
                        Log::info(sprintf('[%s] uploading %s: %s', $this->getCampaign()->id, $file, $path));

                        if ($fileType == 'image') {
                            $cloud->put($path, $local->get($file), AdapterInterface::VISIBILITY_PUBLIC);
                        } elseif ($fileType == 'module') {
                            $cloud->put($path, $module->get($file), AdapterInterface::VISIBILITY_PUBLIC);
                        } else {
                            $cloud->put($path, $public->get($file), AdapterInterface::VISIBILITY_PUBLIC);
                        }

                        // clean cache
                        $this->cleanCdnCache($path);
                    }
                }
            }
        }

        // clean cache
        $this->cleanCdnCache();
    }

    /**
     * Clean CDN cache.
     *
     * @param string $file
     */
    protected function cleanCdnCache($file = null)
    {
        if (strlen($file)) {
            $file = ($file[0] != '/') ? '/'.$file : $file;
            Log::info(sprintf('[%s] queuing url to be flushed in cdn: %s', $this->getCampaign()->id, $file));
            $this->files[] = $file;
        }

        // queue files or flush cache
        if (count($this->files) > 8 || $file == null) {
            // flush cache
            Log::info(sprintf('[%s] flushing cache', $this->getCampaign()->id));
            Cdn::disk()->delete($this->files);
            // clean queue
            $this->files = [];
        }
    }

    /**
     * Copy assets from a campaign.
     *
     * @param \Stensul\Models\Campaign $from
     */
    public function copyAssetsFrom(\Stensul\Models\Campaign $from)
    {
        $storage = Storage::disk('local:campaigns');
        $files = $storage->allFiles($from->fsRelativePath());

        foreach ($files as $file) {
            Log::info(
                sprintf(
                    "copying asset %s to campaign [%s] from [%s]",
                    $file,
                    $this->getCampaign()->id,
                    $from->id
                )
            );

            $storage->put($this->getCampaign()->fsRelativePath() . DS . basename($file), $storage->get($file));
        }

        $this->replaceReferenceId($from);
    }

    /**
     * Replace reference id from a campaign.
     *
     * @param \Stensul\Models\Campaign $from
     */
    public function replaceReferenceId(\Stensul\Models\Campaign $from)
    {
        $modules = $this->getCampaign()->modules_data;

        $key = 0;
        // iterate trought all modules
        foreach ($modules as $module) {
            if (isset($module['data']) && is_array($module['data'])) {
                // iterate trought all data
                foreach ($module['data'] as $name => $data) {
                    if (is_array($data) && isset($data['path'])) {
                        $modules[$key]['data'][$name]['path'] =
                            str_replace($from->id, $this->getCampaign()->id, $data['path']);
                    }
                }
            }
            ++$key;
        }
        $this->getCampaign()->modules_data = $modules;
        $this->getCampaign()->save();
    }


    /**
     * @param string $blob
     *
     * @return array data image or error.
     */
    protected function getImageObject($blob)
    {
        $extension = null;

        try {
            if (!filter_var($blob, FILTER_VALIDATE_URL)) {
                if ((strpos($blob, ';base64') !== false)) {
                    list($type, $blob) = explode(';', $blob);
                    list(, $blob) = explode(',', $blob);
                    list(, $extension) = explode('/', $type);
                    $blob = base64_decode($blob);
                    $image = Imagine::load($blob);
                } else {
                    $storage = Storage::disk('local:campaigns');
                    $image = (strpos($blob, public_path()) === false)?
                        Imagine::load($storage->get($blob)) :
                        Imagine::open($blob);
                    $extension = pathinfo($blob)["extension"];
                }
            } else {
                $image = Imagine::open($blob);
                $extension = pathinfo($blob)["extension"];
            }
        } catch (\Exception $e) {
            $error_msg =sprintf(
                "[%s] image open %s failed.",
                $this->getCampaign()->id,
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
     * Get the image path
     * @param string $extension
     * @return array Path or error.
     */
    private function getImagePath($extension = "jpg")
    {
        $name = uniqid().'-'.microtime(true).'.'.$extension;
        return $this->getCampaign()->fsRelativePath() . DS . $name;
    }

    /**
     * @param string $blob
     *
     * @return array Path or error.
     */
    public function saveImage($blob)
    {

        list($image, $extension, $options) = $this->getImageObject($blob);

        $storage = Storage::disk('local:campaigns');
        $file_path = $this->getImagePath($extension);

        try {
            $success = $storage->put($file_path, $image->get($extension, $options));
        } catch (Exception $e) {
            Log::warning(
                sprintf(
                    "[%s] image storage for file %s failed. Attempting one more time",
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

    /**
     * Resize an image
     * @param  string  $url
     * @param  integer $width
     * @param  integer $height
     * @return string
     */
    public function resizeImage($blob, $width = 645, $height = null)
    {
        if ($blob) {
            list($image, $extension, $options) = $this->getImageObject($blob);

            $old_width = $image->getSize()->getWidth();
            $old_height = $image->getSize()->getHeight();

            if ((!is_null($width) && $old_width > $width ) || ( !is_null($height) && $old_height > $height )) {
                $new_width = (!is_null($width))? $width : ($height * $old_width) / $old_height;
                $new_height = (!is_null($height))? $height : ($width * $old_height) / $old_width;

                $storage = Storage::disk('local:campaigns');
                $file_path = $this->getImagePath($extension);

                $size = new \Imagine\Image\Box($new_width, $new_height);

                try {
                    $success = $storage->put($file_path, $image->resize($size)->get($extension, $options));
                } catch (Exception $e) {
                    Log::warning(
                        sprintf(
                            "[%s] image storage for file %s failed. Attempting one more time",
                            $this->getCampaign()->id,
                            $file_path
                        )
                    );

                    usleep(50000);
                    $success = $storage->put($file_path, $image->resize($size)->get($extension, $options));
                }
            } else {
                return $this->saveImage($blob);
            }
        }

        if ($success) {
            $response['path'] = $file_path;
        } else {
            $response['error'] = 'CANVAS_UPLOAD_ERROR';
        }

        return $response;
    }

    /**
     * @param string $gif
     * @param string $layer
     * @return array Path or error.
     */
    public function mergeGif($gif, $layer)
    {

        list($image, $extension, $options) = $this->getImageObject($gif);
        list($layer_image,,) = $this->getImageObject($layer);

        $image->layers()->coalesce();

        foreach ($image->layers() as $frame) {
            $topLeft = new Imagine\Image\Point(0, 0);
            $frame->paste($layer_image, $topLeft);
        }

        $storage = Storage::disk('local:campaigns');
        $file_path = $this->getImagePath($extension);

        try {
            $success = $storage->put($file_path, $image->get($extension, $options));
        } catch (Exception $e) {
            Log::warning(
                sprintf(
                    "[%s] image storage for file %s failed. Attempting one more time",
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

    /**
     * Create a custom merge from a background image and layers.
     *
     * @param string $image
     * @param string $layer
     * @return array Path or error.
     */
    public function customMerge($options)
    {
        $background_path = (isset($options['background_path']))? $options['background_path'] : null;
        $layers = (isset($options['layers']))? $options['layers'] : [];

        if (!is_null($background_path)) {
            list($background_image, $background_extension, $background_options) = $this->getImageObject($background_path);
            $blob = $background_image->get($background_extension, $background_options);

            if (isset($options['background']) && count($options['background'])) {
                $options['background']['extension'] = $background_extension;
                $settings = $this->convertSettings($background_image, $options['background']);
                $blob = Imagine::convert($blob, $settings);
            }

            foreach ($layers as $layer) {
                $layer_path = (isset($layer['path'])) ? $layer['path'] : null;
                $layer_top = (isset($layer['top'])) ? $layer['top'] : 0;
                $layer_left = (isset($layer['left'])) ? $layer['left'] : 0;

                if (!is_null($layer_path)) {
                    if ((strpos($layer_path, ';base64') === false) &&
                        (strpos($layer_path, public_path()) === false)) {
                        $layer_path = public_path() . $layer_path;
                    }
                    if (isset($layer['width'])) {
                        $layer_width = $layer['width'];
                        $size = sprintf('%dx', $layer_width);
                    } else {
                        list($layer_image,,) = $this->getImageObject($layer_path);
                        $size = sprintf('%dx', $layer_image->getSize()->getWidth());
                    }

                    $position = sprintf('+%d+%d', $layer_left, $layer_top);
                    $params = [];
                    if (isset($layer['gravity'])) {
                        $params['gravity'] = $layer['gravity'];
                    }
                    if ($background_extension == "gif") {
                        $blob = Imagine::compositeGif(
                            $blob,
                            $layer_path,
                            $size,
                            $position,
                            $params
                        );
                    } else {
                        $blob = Imagine::compositeImage(
                            $blob,
                            $layer_path,
                            $size.$position,
                            $params
                        );
                    }
                }
            }

            $storage = Storage::disk('local:campaigns');
            $file_path = $this->getImagePath($background_extension);

            try {
                $success = $storage->put($file_path, $blob);
            } catch (Exception $e) {
                Log::warning(
                    sprintf(
                        "[%s] image storage for file %s failed. Attempting one more time",
                        $this->getCampaign()->id,
                        $file_path
                    )
                );

                usleep(50000);
                $success = $storage->put($file_path, $blob);
            }
        }

        if (isset($success)) {
            $response['path'] = $file_path;
        } else {
            $response['error'] = 'CANVAS_UPLOAD_ERROR';
        }

        return $response;
    }

    /**
     * Prepare any ImageMagick setting.
     *
     * E.g: offsetx and offsety are used to add space around the image,
     * and should be translated as an 'extent' command which depends
     * on the image size.
     *
     * @param  object $image
     * @param  array  $settings
     * @return array
     */
    public function convertSettings($image, $settings)
    {
        $data = [];

        if (count($settings)) {
            $width = $image->getSize()->getWidth();
            $height = $image->getSize()->getHeight();
            if (isset($settings['offsetx']) || isset($settings['offsety'])) {
                // Only apply this when we need to extend a gif or png image
                if ($settings['extension'] === 'gif' || $settings['extension'] === 'png') {
                    $data['repage'] = '';
                    $data['background'] = 'none';
                }
            }
            $extension = $settings['extension'];
            unset($settings['extension']);
            foreach ($settings as $command => $value) {
                switch ($command) {
                    // Extents an image width in a given amount of pixels.
                    // Use gravity to choose left (East) or right (West)
                    case 'offsetx':
                        $data['extent'] = ($width + $value) . 'x' . $height;
                        break;
                    // Extents an image height in a given amount of pixels
                    // Use gravity to choose top (South) or bottom (North)
                    case 'offsety':
                        $data['extent'] = $width . 'x' . ($height + $value);
                        break;
                    // Resize an image.
                    // Set width to make the resize in a proportional way.
                    // Or set resize to specify an exact XXXxYYY.
                    case 'resize':
                    case 'width':
                        if ($extension === 'gif') {
                            // If we want to resize a gif, we should set -coalesce before
                            $data['coalesce'] = '';
                        }
                        $data['resize'] = $value;
                        break;
                    // Any other command is used as it was received
                    default:
                        $data[$command] = $value;
                        break;
                }
            }
        }

        return $data;
    }
}
