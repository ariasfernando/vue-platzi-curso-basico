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
}
