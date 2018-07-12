<?php

namespace Stensul\Models;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;
use CampaignModel as Campaign;

class Proof extends Eloquent
{
    const STATUS_PROCESSED = 'processed';
    const STATUS_FAILED = 'failed';
    const STATUS_DELETED = 'deleted';

    protected $table = 'proofs';

    protected $fillable = [
        'campaign_id',
        'requestor',
        'token',
        'status',
        'reviewers',
        'notified'
    ];

    protected $defaults = [
        'notified' => false
    ];

    /**
     * Validate if a given user can access to the proof
     *
     * @param  [string]  $user_id
     * @return [boolean]
     */
    public function userCanAccess($user_id)
    {
        $ids = array_column($this->attributes['reviewers'], 'user_id');
        return $user_id === $this->attributes['requestor']
            || in_array($user_id, $ids) || User::find($user_id)->can('edit_proof');
    }

    /**
     * Campaign.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function campaign()
    {
        return $this->belongsTo(Campaign::class, 'campaign_id');
    }

    /**
     * Comments.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function comments()
    {
        return $this->hasMany('Stensul\Models\Comment');
    }
}
