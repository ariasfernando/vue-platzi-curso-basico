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
        $plain_text = (isset($this->campaign['title'])) ? $this->campaign['title'] . self::$line_break : '';

        foreach ($this->campaign['modules_data'] as $module) {
            switch ($module['type']) {
                case 'header_image':
                    $text_module = $this->defaultHtml2TextConverter($module);
                    $text_module = trim(str_replace("\n\n", "\n", $text_module));
                    $plain_text .= $text_module;
                    $plain_text .= self::$module_break;
                    break;
                case 'example_module_name':
                    // Custom module text content
                    break;

                default:
                    $plain_text .= trim($this->defaultHtml2TextConverter($module));
                    $plain_text .= self::$module_break;
                    break;
            }
            $plain_text .= self::$module_break;
        }
        $plain_text = $this->replaceTags($plain_text);

        return $plain_text;
    }

    /**
     * Return a view path according to campaign_format
     *
     * @param  string $file_parent
     * @return string or false
     */
    public function getModulesPath($file_parent)
    {
        $path = false;
        if (\Config::get('view.campaign_format') == 'libraries') {
            $path = $file_parent . '.';
            $path .= strpos($file_parent, 'base') === false ? $this->campaign['library'] . '.' : '';
            $path .= 'modules';
        } else {
            $path = $file_parent . '.modules';
        }
        return $path;
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
        $modulePath = $this->getModulesPath($module['file_parent']) . '.' . $module['type'];
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
        $modulePath = $this->getModulesPath($module['file_parent']) . '.text.' . $module['type'];
        $moduleText = \View::make($modulePath)
            ->with('module', $module)
            ->render();

        return $moduleText;
    }
}
