<?php

use Stensul\Providers\HelperServiceProvider as Helper;

$override = array();

if (file_exists($overrideFile)) {
    $override = include $overrideFile;
    return Helper::arrayMergeRecursiveDistinct($default, $override);
} else {
    return $default;
}
