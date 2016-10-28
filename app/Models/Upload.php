<?php

namespace Stensul\Models;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

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
        $previous = Upload::where('original_filename', '=', $filename)
            ->orderBy('updated_at', 'desc')
            ->get()->toArray();
        if (count($previous)) {
            list($filename,) = explode('.', $filename);
            $filename.= '-v' . count($previous);
        }
        return $filename  . '.html';
    }
}
