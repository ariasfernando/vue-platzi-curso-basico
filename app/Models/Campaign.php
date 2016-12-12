<?php

namespace Stensul\Models;

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
        'user_id',
        'user_email',
        'email_sent_history',
        'tags',
        'template'
    ];

    protected $appends = ['api', 'library_config'];

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
        'user_id' => null,
        'user_email' => null,
        'email_sent_history' => [],
        'tags' => [],
        'template' => false
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
     * User.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo('Stensul\Models\User');
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
     * @return array
     */
    public function getLibraryConfig($property = false)
    {
        $response = \Config::get("view.libraries.".$this->library, []);

        if ($property) {
            $response = (isset($response[$property]))? $response[$property] : [];
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
     * Get a list of campaign configuration, prioritizing library values over default values
     */
    public function getLibraryConfigAttribute()
    {
        return array_merge(
            \Config::get('campaign'),
            \Config::get('view.libraries.' . $this->attributes['library'])
        );
    }
}
