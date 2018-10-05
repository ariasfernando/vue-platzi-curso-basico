<?php

namespace Stensul\Services;

use MongoDB\BSON\ObjectID as ObjectID;

use ModuleModel;
use LibraryModel as Library;
use Stensul\Exceptions\ModelKeyManagerException;

class ModelKeyManager
{
    /**
     * Standarize a module or library key, add a suffix if it already exists.
     *
     * @param Model $model Model instance.
     * @param string $name Name to convert to a standard unique key.
     * @param int $suffix_max Maximum number to use for a random suffix.
     * @throws Stensul\Exceptions\ModelKeyManagerException
     *
     * @return string Available key.
     */
    public static function getStandardKey($model, $name, $suffix_max = 999999)
    {
        if (empty($name)) {
            $name = 'untitled';
        }

        $key = preg_replace(['/[^a-z0-9 _]/i', '/\s+/'], ['', '_'], strtolower($name));

        // Don't check DB for custom modules, append '_custom' to the normalized module name.
        if (is_a($model, 'ModuleModel') && $model->type !== 'studio') {
            return $key . '_custom';
        }

        $original_key = trim($key, '_');
        $max_tries = 50;

        for ($n = 0; $n < $max_tries; $n++) {
            if ($model::withTrashed()->where('key', $key)->first()) {
                $key = $original_key . '_' . mt_rand(1, $suffix_max);
            } else {
                return $key;
            }
        }

        throw new ModelKeyManagerException;
    }
}
