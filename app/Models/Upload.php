<?php

namespace Stensul\Models;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;
use CampaignModel as Campaign;

class Upload extends Eloquent
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'upload';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'api',
        'campaign_id',
        'user_id',
        'ip',
        'original_filename',
        'filename',
        'path',
        'folder_id',
        'subject',
        'preheader'
    ];

    protected $defaults = array(
        'api' => '',
        'campaign_id' => null,
        'user_id' => null,
        'ip' => '',
        'original_filename' => '',
        'filename' => '',
        'path' => '',
        'folder_id' => null,
        'subject' => '',
        'preheader' => ''
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
     * Adds a sufix to the filename.
     * @param  string $filename; the filename to version
     * @return string; the new filename with the sufix
     */
    public static function versioningFilename($filename)
    {
        $filename = str_replace(['.html', '.htm'], '', $filename);
        $previous = self::fileExists($filename);
        if (count($previous)) {
            list($filename,) = explode('.', $filename);
            $filename.= '-v' . count($previous);
        }
        return $filename  . '.html';
    }

    /**
     * Check if filename exists.
     * @param  string $filename; the filename to search
     * @return int; if the filename doesn't exist, it returns 0, in any other case it returns the amount of repetitions
     */
    public static function fileExists($filename)
    {
        $filename = str_replace(['.html', '.htm'], '', $filename);
        $previous = Upload::where('original_filename', 'like', $filename)
            ->orderBy('updated_at', 'desc')
            ->get()->toArray();

        return $previous;
    }

    /**
     * Check if the name belongs to a locked campaign.
     *
     * @param  string $filename
     * @return bool
     */
    public static function lockedName($filename)
    {
        $filename = str_replace(['.html', '.htm'], '', $filename);
        $uploads = Upload::where('original_filename', $filename)
            ->get();
        foreach ($uploads as $upload) {
            $campaign = Campaign::find($upload->campaign_id);
            if ($campaign && $campaign->locked) {
                return true;
            }
        }
        return false;
    }
}
