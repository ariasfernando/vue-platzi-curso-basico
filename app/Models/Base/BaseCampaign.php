<?php
namespace Stensul\Models\Base;

use Stensul\Models\Campaign ;
use zz\Html\HTMLMinify;
use WyriHaximus\HtmlCompress\Factory as HTMLCompressor;

class BaseCampaign extends Campaign
{
    protected $fillable = [
        'campaign_name',
        'lower_campaign_name',
        'locale',
        'modules_data',
        'body_html',
        'plain_text',
        'processed',
        'status',
        'library',
        'library_name',
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
        'gamma_html',
        'gamma_text',
        'tracking',
        'internal'
    ];

    protected $defaults = [
        'campaign_name' => '',
        'lower_campaign_name' => '',
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
        'proof_id' => null,
        'gamma_html' => '',
        'gamma_text' => '',
        'tracking'
    ];

    protected $appends = ['api', 'library_config', 'uploads', 'can_be_processed', 'has_active_proof', 'proof_token', 'body_html_minified', 'gamma_html_minified'];

    public function getBodyHtmlMinifiedAttribute()
    {
        $parser = HTMLCompressor::construct();
        return isset($this->attributes['body_html']) ? $parser->compress(HTMLMinify::minify($this->attributes['body_html'], [
            'optimizationLevel' => HTMLMinify::OPTIMIZATION_ADVANCED,
            'removeComment' => false,
        ])) : '';
    }

}
