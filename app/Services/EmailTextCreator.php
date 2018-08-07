<?php

namespace Stensul\Services;

use StensulLocale;
use TextConverter;
use CampaignModel;

class EmailTextCreator
{
    public static $line_break = "\n";
    public static $module_break = "\n\n";

    protected $campaign;

    /**
     * Create text email version.
     *
     * @param \Stensul\Models\Campaign $campaign
     */
    public function __construct(CampaignModel $campaign)
    {
        $this->campaign = $campaign;
    }

    /**
     * Create text version.
     *
     * @return string
     */
    public function createTextVersion()
    {
        $plain_text = isset($this->campaign['title']) ?? $this->campaign['title'] . self::$line_break;

        $plain_text .= trim(self::htmlToText($this->campaign->body_html));
        $plain_text = $this->replaceTags($plain_text);

        return $plain_text;
    }

    /**
     * Return a view path according to campaign_format
     *
     * @return string or false
     */
    public function getModulesPath()
    {
        return 'modules';
    }

    /**
     * Replace html and data tags.
     *
     * @param string $text
     *
     * @return string
     */
    private function replaceTags($text)
    {
        $search = array(
            '/<br[^>]*>/i',
            '/<div[^>]*>/i',
            '/&nbsp;/',
            '/\[DATE-SUBMITTED\]/'
        );
        $replace = array(
            "\n",
            "\n",
            ' ',
            date('Y-m-d')
        );

        return  preg_replace($search, $replace, $text);
    }

    /**
     * Default HTML2Text converter.
     *
     * @param string $module
     */
    protected function defaultHtml2TextConverter($module)
    {
        $params = [
            'campaign_data' => $this->campaign
        ];

        $modulePath = $this->getModulesPath($module['file_parent']) . '.' . $module['module_id']
            . '.template';
        if (!\view::exists($modulePath)) {
            $modulePath = $this->getModulesPath($module['file_parent']) . '.' . $module['module_id'];
        }

        $moduleHtml = \View::make($modulePath)
            ->with('params', $params)
            ->with('module_params', $module)
            ->render();

        return self::htmlToText($moduleHtml);
    }

    /**
     * Convert html to text
     *
     * @param  string $html
     * @return string
     */
    public static function htmlToText($html)
    {
        $htmlToText = new TextConverter($html, array('do_links' => 'inline'));

        return $htmlToText->getText();
    }

    /**
     * Get txt module version.
     *
     * @param array $module module data
     * @return string
     */
    protected function getTxtByTpl($module)
    {
        $params = [
            'campaign_data' => $this->campaign
        ];
        $modulePath = $this->getModulesPath($module['file_parent']) . '.' . $module['module_id'] . '.text';
        $moduleText = \View::make($modulePath)
            ->with('module', $module)
            ->with('params', $params)
            ->render();

        return $moduleText;
    }
}
