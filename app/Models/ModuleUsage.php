<?php

namespace Stensul\Models;

use MongoDB\BSON\ObjectID;
use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class ModuleUsage extends Eloquent
{

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'modules_usage';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'module_id',
        'campaign_id',
    ];

    /**
     * Override create method to ignore duplicates.
     *
     * @param array $attributes
     * @return void
     * @throws Exception
     */
    public static function create(array $attributes = [])
    {
        try {
            return static::query()->create($attributes);
        } catch (\MongoDB\Driver\Exception\BulkWriteException $e) {
            if ($e->getCode() === 11000) {
                // Ignore duplicates.
            } else {
                throw $e;
            }
        }
    }

    /**
     * Campaign relationship
     *
     * @return \Illuminate\Database\Eloquent\Relations\hasOne
     */
    public function campaign()
    {
        return $this->hasOne('CampaignModel', '_id', 'campaign_id');
    }

    /**
     * Module relationship
     *
     * @return \Illuminate\Database\Eloquent\Relations\hasOne
     */
    public function module()
    {
        return $this->hasOne('ModuleModel', '_id', 'module_id');
    }

    /**
     * Count how many campaigns use the given module.
     *
     * @param string $module_id Module id
     * @return int
     */
    public function scopeCampaignCount($query, $module_id)
    {
        $query->where('module_id', '=', new ObjectId($module_id))->count();
        return $query->count();
    }
}
