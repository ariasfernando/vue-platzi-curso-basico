<?php

namespace Stensul\Models;

use MongoDB\BSON\ObjectID as ObjectID;
use Jenssegers\Mongodb\Eloquent\Model as Eloquent;
use Jenssegers\Mongodb\Eloquent\SoftDeletes;

class Campaign extends Eloquent
{
    use SoftDeletes;

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'campaigns';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'campaign_name',
        'locale',
        'modules_data',
        'body_html',
        'plain_text',
        'processed',
        'status',
        'library',
        'published_at',
        'cdn_path',
        'created_by',
        'updated_by',
        'deleted_by',
        'favorite_by',
        'locked_by',
        'email_sent_history',
        'campaign_preheader',
        'tags',
        'template',
        'locked',
        'favorite',
        'campaign_settings',
        'auto_save',
        'parent_campaign_id',
        'proof_id'
    ];

    protected $appends = ['api', 'library_config', 'uploads', 'can_be_processed', 'has_active_proof', 'proof_token'];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [];

    protected $dates = ['deleted_at', 'published_at'];

    protected $defaults = array(
        'campaign_name' => 'Untitled Campaign',
        'locale' => 'en_us',
        'modules_data' => [],
        'body_html' => '',
        'plain_text' => '',
        'processed' => 0,
        'status' => 1,
        'library' => "default",
        'cdn_path' => null,
        'created_by' => [],
        'updated_by' => [],
        'deleted_by' => [],
        'favorite_by' => [],
        'locked_by' => null,
        'email_sent_history' => [],
        'campaign_preheader' => '',
        'tags' => [],
        'template' => false,
        'locked' => false,
        'favorite' => false,
        'campaign_settings' => [],
        'auto_save' => null,
        'parent_campaign_id' => null,
        'proof_id' => null
    );

    /**
     * Constructor.
     *
     * @param array $attributes
     */
    public function __construct(array $attributes = [])
    {
        $this->setRawAttributes($this->defaults, true);
        parent::__construct($attributes);
    }

    /**
     * Favorite by user.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function favorite_user()
    {
        return $this->belongsToMany('Stensul\Models\User', null, null, 'favorite_by');
    }

    /**
     * User.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo('Stensul\Models\User');
    }

    /**
     * Proofs.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function proofs()
    {
        return $this->hasMany('Stensul\Models\Proof');
    }

    /**
     * returns the relative url for the campaign from the base url with the form
     * /<ObjectID>/<locale>/.
     *
     * @return string the relative url of the campaign assets
     */
    public function fsRelativePath()
    {
        return '/' . implode('/', [$this->id, $this->locale]);
    }

    /**
     * Returns campaign url.
     *
     * @return string
     */
    public function url()
    {
        return rtrim(\Config::get('app.url'), '/') . '/images/campaigns' . $this->fsRelativePath();
    }

    /**
     * Get CDN path.
     *
     * @param bool $absolute
     *
     * @return string
     */
    public function getCdnPath($absolute = false)
    {
        $parts = [];

        if ($absolute) {
            $parts[] = \Config::get('cdn.host');
        }

        $parts[] = $this->cdn_path;
        $parts[] = $this->locale;

        return implode('/', $parts);
    }

    /**
     * Get Library Config.
     *
     * @param string $property
     *
     * @return mixed Array or scalar value.
     */
    public function getLibraryConfig($property = false)
    {
        $library = Library::find($this->library);

        if (!empty($library->config)) {
            $response = $library->config;
        } else {
            $response = \Config::get("view.libraries." . $this->library, []);
        }

        if ($property) {
            $response = isset($response[$property]) ? $response[$property] : '';
        }

        return $response;
    }

    /**
     * Scope a query to only include documents with
     * `processed` eq 0.
     *
     * @param  array $visibility; the user group
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeEdited($query, array $visibility = [])
    {
        $query->where('processed', '=', 0, 'AND')
            ->where('status', '!=', 2);

        if (count($visibility) !== 0) {
            $query->whereIn('library', $visibility);
        }

        return $query;
    }

    /**
     * Scope a query to only include documents with
     * `processed` eq 1.
     *
     * @param  array $visibility; the user group
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeProcessed($query, array $visibility = [])
    {
        $query->where('processed', '=', 1, 'AND')
            ->where('status', '!=', 2);

        if (count($visibility) !== 0) {
            $query->whereIn('library', $visibility);
        }

        return $query;
    }

    /**
     * Get a list of api drivers by library
     *
     * @return array
     */
    public function getApiAttribute()
    {
        $data = [];
        $api_list = \Helper::getApiDrivers($this->attributes['library']);
        if (count($api_list)) {
            foreach ($api_list as $api) {
                $data[] = [
                    'driver' => $api,
                    'title' => \Config::get("api.{$api}.title"),
                    'class' => \Config::get("api.{$api}.class")
                ];
            }
        }
        return $data;
    }

    /**
     * Get a list of library configuration
     */
    public function getLibraryConfigAttribute()
    {
        $libraryConfig = [];
        if (Library::find($this->attributes['library'])) {
            $libraryConfig = Library::find($this->attributes['library'])->config;
        }
        return $libraryConfig;
    }

    /**
     * Get last proof.
     *
     * @return \Illuminate\Database\Eloquent\Model
     */
    public function getLastProof()
    {
        return Proof::whereCampaignId(new ObjectId($this->_id))->orderBy('created_at', 'DESC')->first();
    }

    /**
     * Get the current proof for this campaign
     *
     * @return \Illuminate\Database\Eloquent\Model or false
     */
    public function getProof()
    {
        error_log($this->proof_id);
        if (isset($this->proof_id)) {
            return Proof::find($this->proof_id);
        }

        return false;
    }

    public function getProofTokenAttribute()
    {
        $proof = $this->getProof();

        return ($proof) ? $proof->token : '';
    }

    /**
     * Check if the campaign has an active proof
     *
     * @SuppressWarnings(PHPMD.BooleanGetMethodName)
     * @return boolean
     */
    public function getHasActiveProofAttribute()
    {
        $proof = $this->getProof();

        return ($proof && $proof->status !== Proof::STATUS_DELETED);
    }

    /**
     * Get uploads attribute.
     *
     * @return json
     */
    public function getUploadsAttribute()
    {
        return Upload::where('campaign_id', $this->attributes['_id'])
            ->orderBy('updated_at', 'desc')
            ->get();
    }

    /**
     * Check if the campaign could be processed or not.
     *
     * @SuppressWarnings("BooleanGetMethodName")
     * @return boolean
     */
    public function getCanBeProcessedAttribute()
    {
        if (config('proof.status')) {
            $proof = $this->getProof();
            if ($proof) {
                if (config('proof.required_reviews')) {
                    foreach ($proof['reviewers'] as $reviewer) {
                        /*
                         * If a required reviewer haven't provided a decision or reject it,
                         * the campaign cannot be completed
                         */
                        if (isset($reviewer['required']) && $reviewer['required'] &&
                            (!isset($reviewer['decision']) || $reviewer['decision'] === 'reject'
                                || $reviewer['decision'] === 'reject-with-comments')) {
                            return false;
                        }
                    }
                }
            }
        }

        return true;
    }
}
