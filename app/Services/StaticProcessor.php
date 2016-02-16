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

        // get email template
        $html = new Html($this->getCampaign());

        $files = [];

        $files['image'] = $local->allFiles($this->getCampaign()->fsRelativePath());
        $files['common'] = $public->allFiles('_common');
        $files['font'] = $public->allFiles('fonts');

        foreach ($files as $fileType => $fileGroup) {
            foreach ($fileGroup as $file) {
                $path = trim($this->getCampaign()->getCdnPath(), DS) . DS;
                $path .= ($fileType == 'font') ? $file : 'images' . DS . basename($file);

                if (strpos($html->getEmailLayout(), basename($file)) !== false) {
                    if (!$cloud->exists($path)) {
                        Log::info(sprintf('[%s] uploading %s: %s', $this->getCampaign()->id, $file, $path));

                        if ($fileType == 'image') {
                            $cloud->put($path, $local->get($file), AdapterInterface::VISIBILITY_PUBLIC);
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
                list($type, $blob) = explode(';', $blob);
                list(, $blob) = explode(',', $blob);
                list(, $extension) = explode('/', $type);
                $blob = base64_decode($blob);
                $image = Imagine::load($blob);
            } else {
                $image = Imagine::open($blob);
                $extension = pathinfo($blob)["extension"];
            }
        } catch (Imagine\Exception\Exception $e) {
            Log::warning(
                sprintf(
                    "[%s] image open %s failed.",
                    $this->getCampaign()->id,
                    $blob
                )
            );
            return ["error" => "URL_DENY"];
        }

        switch ($extension) {
            case (\Config::get("image.force_conversion_jpg", false) || in_array($extension, ['jpg', 'jpeg', 'pjpeg', 'pjpg'])):
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
}
