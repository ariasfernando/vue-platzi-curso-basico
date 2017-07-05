<?php

namespace Stensul\Models;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class Comment extends Eloquent
{
    protected $table = 'comments';

    protected $fillable = [
        'proof_id',
        'user_id',
        'content',
        'decision'
    ];

    /**
     * Proof.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function proof()
    {
        return $this->belongsTo('Stensul\Models\Proof');
    }
}
