<?php

namespace Stensul\Services;

use Stensul\Services\TextConverter;

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
    public function __construct(\Stensul\Models\Campaign $campaign)
    {
        $this->campaign = $campaign;
    }

    /**
     * Create text version.
     *
     * @param array $modules Modules data
     * @return string
     */
    public function createTextVersion($modules)
    {
        $plain_text = '';

        $email_title = (isset($this->campaign['title'])) ? $this->campaign['title'] : '';

        $plain_text = $email_title.self::$line_break;

        foreach ($modules as $module) {
            if (\view::exists($module['file_parent'] . '.modules.text.' . $module['type'])) {
                $plain_text .= $this->getTxtByTpl($module);
            } else {
                $plain_text .= trim($this->defaultHtml2TextConverter($module));
            }
            $plain_text .= self::$module_break;
        }
        $plain_text = $this->replaceTags($plain_text);

        return $plain_text;
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
        $modulePath = $module['file_parent'] . '.modules.' . $module['type'];
        $moduleHtml = \View::make($modulePath)
            ->with('params', $params)
            ->with('module', $module)
            ->render();

        return $this->htmlToText($moduleHtml);
    }

    /**
     * Convert html to text
     *
     * @param  string $html
     * @return string
     */
    public function htmlToText($html)
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
        $modulePath = $module['file_parent'] . '.modules.txt_version.' . $module['type'];
        $moduleText = \View::make($modulePath)
            ->with('module', $module)
            ->render();

        return $moduleText;
    }
}
