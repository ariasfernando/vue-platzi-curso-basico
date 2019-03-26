<?php

namespace Stensul\Services;

use Log;
use Cdn;
use Imagine;
use Storage;
use CampaignModel;
use Imagine\Image\ImageInterface;
use League\Flysystem\AdapterInterface;
use Stensul\Jobs\CleanCdnCache;
use HtmlCreator as Html;

class StaticProcessor
{
    protected $campaign;

    private $files = [];

    /**
     * Constructor.
     *
     * @param CampaignModel $campaign
     */
    public function __construct(CampaignModel $campaign)
    {
        $this->campaign = $campaign;
    }

    /**
     * Get campaign model.
     *
     * @return CampaignModel
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

        $campaignPath = trim($this->getCampaign()->getCdnPath(), '/') . '/';
        $emailLayout = $html->getEmailLayout();

        $uploadedFiles = $cloud->allFiles($campaignPath);

        $data = [
            'campaign_id' => $this->getCampaign()->id,
            'cdn' => config('filesystems.disks.cloud'),
            'assets' => [
            ]
        ];

        foreach ($files as $fileType => $fileGroup) {
            foreach ($fileGroup as $file) {
                $path = $campaignPath;
                $path .= ($fileType == 'font') ? $file : 'images' . '/' . basename($file);

                if (strpos($emailLayout, basename($file)) !== false) {
                    if (!in_array($path, $uploadedFiles)) {
                        Log::info(sprintf('[%s] uploading %s: %s', $this->getCampaign()->id, $file, $path));

                        if ($fileType == 'image') {
                            $from = config('filesystems.disks.local:campaigns.root') . DS . $file;
                        } elseif ($fileType == 'module') {
                            $from = config('filesystems.disks.local:modules.root') . DS . $file;
                        } else {
                            $from = config('filesystems.disks.local:public.root') . DS . $file;
                        }

                        $data['assets'][] = [
                            'from' => $from,
                            'to' => $path
                        ];

                        Log::info(sprintf('[%s] queuing url to be flushed in cdn: %s', $this->getCampaign()->id, $path));
                        dispatch(new CleanCdnCache($path, $this->getCampaign()->id));
                    }
                }
            }
        }

        try {
            \AssetManager::deploy(
                $data,
                env('ASSETS_UPLOAD_CONCURRENCY', 10),
                env('ASSETS_UPLOAD_RETRIES', 2)
            );
        } catch (\Exception $exception) {
            Log::error('StaticProcessor error: ' . $exception->getMessage());
            throw $exception;
        }
    }

    /**
     * Copy assets from a campaign.
     *
     * @param CampaignModel $from
     */
    public function copyAssetsFrom(CampaignModel $from)
    {
        $storage = Storage::disk('local:campaigns');
        $assets = [];

        //Get used assets from the body
        if ($from->body_html !== "") {
            $html = new Html($this->getCampaign());

            foreach ($html->imagesRegex($from->body_html) as $item) {
                if (is_array($item) && isset($item[2])) {
                    $assets[parse_url($item[2], PHP_URL_PATH)] = null;
                }
            }

            foreach ($html->backgroundImagesRegex($from->body_html) as $item) {
                if (is_array($item) && isset($item[2])) {
                    $assets[parse_url($item[2], PHP_URL_PATH)] = null;
                }
            }

            foreach ($html->assetsRegex($from->body_html)[0] as $item) {
                if (is_array($item) && isset($item[2])) {
                    $assets[parse_url($item[2], PHP_URL_PATH)] = null;
                }
            }
        }

        // Get assets used from the modules data.
        $modules_data = $from->modules_data;
        foreach ($from->modules_data as $key => $module) {
            // custom modules
            if ($module['type'] == 'custom') {
                if (isset($module['data']['imageSrc'])) {
                    $filename = DS . 'images' . DS . trim($module['data']['imageSrc']);
                    $assets[$filename] = null;
                }

                if (isset($module['data']['rawImage'])) {
                    $filename = DS . 'images' . DS . trim($module['data']['rawImage']);
                    $assets[$filename] = null;
                }

                if (isset($module['data']['images']) && is_array($module['data']['images'])) {
                    foreach ($module['data']['images'] as $key => $image_container) {
                        if (isset($image_container['desktop']) && isset($image_container['desktop']['img'])) {
                            $filename = DS . 'images' . DS . trim($image_container['desktop']['img']);
                            $assets[$filename] = null;
                        }
                        if (isset($image_container['mobile']) && isset($image_container['mobile']['img'])) {
                            $filename = DS . 'images' . DS . trim($image_container['mobile']['img']);
                            $assets[$filename] = null;
                        }
                    }
                }
            } // studio modules
            else {
                if (isset($module['structure']) && isset($module['structure']['rows'])) {
                    foreach ($module['structure']['rows'] as $row_key => $row_value) {
                        if (isset($row_value['columns'])) {
                            foreach ($row_value['columns'] as $column_key => $column_value) {
                                if (isset($column_value['components'])) {
                                    foreach ($column_value['components'] as $component_key => $component_value) {
                                        if (isset($component_value['type']) && ($component_value['type'] === 'image-element')) {
                                            if (isset($component_value['image'])
                                                && isset($component_value['image']['attribute'])) {
                                                if (isset($component_value['image']['attribute']['placeholder'])) {
                                                    $filename = DS . 'images' . DS . trim($component_value['image']['attribute']['placeholder']);
                                                    $assets[$filename] = null;
                                                }

                                                if (isset($component_value['image']['attribute']['placeholderMobile'])) {
                                                    $filename = DS . 'images' . DS . trim($component_value['image']['attribute']['placeholderMobile']);
                                                    $assets[$filename] = null;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                if (isset($module['structure']) && isset($module['structure']['style']['backgroundImage'])) {
                    $filename = DS . 'images' . DS . trim($module['structure']['style']['backgroundImage']);
                    $assets[$filename] = null;
                }
            }
        }

        $assets = array_keys($assets);

        foreach ($assets as $path) {
            if (!preg_match("/^\/images\/campaigns\//", $path)) {
                continue;
            }

            Log::info(
                sprintf(
                    "copying asset %s to campaign [%s] from [%s]",
                    $path,
                    $this->getCampaign()->id,
                    $from->id
                )
            );
            $filename = basename($path);

            // Remove "/images/campaigns/" from $path.
            $path = substr($path, 18);
            $destination = $this->getCampaign()->fsRelativePath() . DS . $filename;

            try {
                if (!$storage->put($destination, $storage->get($path))) {
                    Log::info(
                        sprintf(
                            'Error copying %s to %s',
                            $path,
                            $destination
                        )
                    );
                }
            } catch (\League\Flysystem\FileNotFoundException $exception) {
                Log::info('ErrorException copying file from: ' . $path);
            } catch (\Illuminate\Contracts\Filesystem\FileNotFoundException $exception) {
                Log::info('ErrorException copying file from: ' . $path);
            } catch (\FileNotFoundException $exception) {
                Log::info('FileNotFoundException: ' . $path);
            }
        }

        $this->replaceReferenceId($from);
    }

    /**
     * Replace reference id from a campaign.
     *
     * @param CampaignModel $from
     */
    public function replaceReferenceId(CampaignModel $from)
    {
        $modules_data = $this->getCampaign()->modules_data;
        foreach ($from->modules_data as $key => $module) {
            // custom modules
            if ($module['type'] == 'custom') {
                if (isset($module['data']['imageSrc'])) {
                    $modules_data[$key]['data']['imageSrc'] = str_replace(
                        $from->id,
                        $this->getCampaign()->id,
                        $module['data']['imageSrc']
                    );
                }
                if (isset($module['data']['rawImage'])) {
                    $modules_data[$key]['data']['rawImage'] = str_replace(
                        $from->id,
                        $this->getCampaign()->id,
                        $module['data']['imageSrc']
                    );
                }
            } // studio modules
            else {
                if (isset($module['structure']) && isset($module['structure']['rows'])) {
                    foreach ($module['structure']['rows'] as $row_key => $row_value) {
                        if (isset($row_value['columns'])) {
                            foreach ($row_value['columns'] as $column_key => $column_value) {
                                if (isset($column_value['components'])) {
                                    foreach ($column_value['components'] as $component_key => $component_value) {
                                        if (isset($component_value['type']) && ($component_value['type'] === 'image-element')) {
                                            if (isset($component_value['image']) && isset($component_value['image']['attribute'])) {
                                                if (isset($component_value['image']['attribute']['placeholder'])) {
                                                    $modules_data[$key]['structure']['rows'][$row_key]['columns'][$column_key]['components']
                                                        [$component_key]['image']['attribute']['placeholder'] = str_replace(
                                                            $from->id,
                                                            $this->getCampaign()->id,
                                                            $component_value['image']['attribute']['placeholder']
                                                        );
                                                }
                                                if (isset($component_value['image']['attribute']['placeholderMobile'])) {
                                                    $modules_data[$key]['structure']['rows'][$row_key]['columns'][$column_key]['components']
                                                        [$component_key]['image']['attribute']['placeholderMobile'] = str_replace(
                                                            $from->id,
                                                            $this->getCampaign()->id,
                                                            $component_value['image']['attribute']['placeholderMobile']
                                                        );
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                if (isset($module['structure']) && isset($module['structure']['style']['backgroundImage'])) {
                    $modules_data[$key]['structure']['style']['backgroundImage'] = str_replace(
                        $from->id,
                        $this->getCampaign()->id,
                        $module['structure']['style']['backgroundImage']
                    );
                }
            }
        }

        $this->getCampaign()->modules_data = $modules_data;
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
                    $image = (strpos($blob, public_path()) === false) ?
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
            throw $e;
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

    /**
     * Trim an image verticaly.
     *
     * @param integer height
     * @param string background_image
     *
     * @return array Path or error
     */
    public function trimImage($params)
    {
        $final_height = (isset($params['height']))? $params['height'] : 0;
        $background_image = (isset($params['background_image']))? $params['background_image'] : null;

        list($image, $extension, $options) = $this->getImageObject($background_image);
        $image_width = $image->getSize()->getWidth();
        $image_height = $image->getSize()->getHeight();

        $trim_position = ($image_height - $final_height) / 2;

        $start = new Imagine\Image\Point(0, $trim_position);
        $size  = new Imagine\Image\Box($image_width, $final_height);

        $file_path = $this->getImagePath($extension);

        $storage = Storage::disk('local:campaigns');
        try {
            $storage->put($file_path, $image->crop($start, $size)->get($extension, $options));
        } catch (\Exception $e) {
            $error_msg = sprintf(
                "[%s] image storage for file %s failed.",
                $this->getCampaign()->id,
                $file_path
            );
            Log::warning($error_msg);

            usleep(50000);

            if (!$storage->put($file_path, $image->crop($start, $size)->get($extension, $options))) {
                throw new \Exception($error_msg);
            }
        }
        return [ 'path' => $file_path ];
    }
}
