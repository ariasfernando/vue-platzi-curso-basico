<?php

namespace Stensul\Models;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;
use Jenssegers\Mongodb\Eloquent\SoftDeletes;

class Module extends Eloquent
{
    use SoftDeletes;

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'modules';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['name', 'key', 'structure', 'status', 'type'];

    /**
     * Default attributes
     *
     * @var array
     */
    protected $attributes = [
        'type' => 'studio',
        'used' => false,
    ];

    protected $appends = ['in_use'];

    /**
     * Scope a query to only include documents with
     * `status` eq 'publish'.
     *
     * @param  \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopePublished($query)
    {
        $query->where('status', '=', 'publish');
        return $query;
    }

    /**
     * Scope a query to only include documents with
     * `status` eq 'draft'.
     *
     * @param  \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeDraft($query)
    {
        $query->where('status', '=', 'draft');
        return $query;
    }

    /**
     * Get campaign count for the module.
     *
     * @return int
     */
    public function getInUseAttribute()
    {
        return \ModuleUsageModel::campaignCount($this->id);
    }
}
