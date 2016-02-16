<?php

use Stensul\Providers\HelperServiceProvider as Helper;

$appName = env('APP_NAME', false);
$override = array();

if ($appName && file_exists($overrideFile)) {
    $override = include $overrideFile;
    return Helper::arrayMergeRecursiveDistinct($default, $override);
} else {
    return $default;
}
