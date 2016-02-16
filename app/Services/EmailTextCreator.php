<?php

namespace Stensul\Services;

use Stensul\Services\TextConverter;

class EmailTextCreator
{
    public static $line_break = "\n";
    public static $module_break = "\n";

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
     * @return string
     */
    public function createTextVersion()
    {
        $plain_text = '';

        $line_break = self::$line_break;
        $module_break = self::$module_break;

        $email_title = (isset($this->campaign['title'])) ? $this->campaign['title'] : '';

        $plain_text = $email_title.$line_break.$module_break;

        $box_counter = 0;

        foreach ($this->campaign['modules_data'] as $module) {
            switch ($module['type']) {
                case 'hero_image':
                    if (isset($module['data']['image0']['title'])) {
                        $hero_title = str_replace(
                            ['</p>', '<br>', '<br/>', '<p>'],
                            [$line_break, $line_break, $line_break, ''],
                            $module['data']['image0']['title']
                        );
                        $plain_text .= trim(strip_tags($hero_title)) . $line_break;
                    }

                    $tracking_code = (isset($module['tracking'])) ?
                        '?' . $module['tracking']['params'] . $module['tracking']['placement'] . $line_break : "";

                    $plain_text .= $module['data']['image0']['destination_url'] . $tracking_code;
                    $plain_text .= $module_break;
                    break;

                case 'thin_ad_block':
                    $plain_text .= 'Advertisement'.$line_break;
                    $plain_text .= $module['data']['image0']['destination_url'].$line_break;
                    $plain_text .= $module_break;
                    break;

                case 'two_column_media_with_ad':
                    $tracking_code = isset($module['tracking']) ?
                        '?' . $module['tracking']['params'] . $module['tracking']['placement']
                        . $box_counter . $line_break : "";

                    $plain_text .= trim(strip_tags($this->replaceTags($module['data']['text0']))).$line_break;
                    $plain_text .= trim(strip_tags($this->replaceTags($module['data']['text1']))).$line_break;
                    $plain_text .= $module['data']['image0']['destination_url'].$tracking_code;

                    $plain_text .= $line_break;

                    $plain_text .= 'Advertisement'.$line_break;
                    $plain_text .= $module['data']['image1']['destination_url'] . $line_break;

                    $plain_text .= $module_break;
                    ++$box_counter;
                    break;

                case 'two_column_media':
                    $tracking_code = (isset($module['tracking'])) ? '?' . $module['tracking']['params'] .
                        $module['tracking']['placement'] . $box_counter . $line_break : "";
                    $plain_text .= $module['data']['image0']['destination_url'].$tracking_code;
                    ++$box_counter;

                    $plain_text .= $line_break;
                    
                    $plain_text .= $module['data']['image1']['destination_url'].$tracking_code;
                    ++$box_counter;

                    $plain_text .= $module_break;
                    break;
                case 'two_column_media_with_text':
                    $tracking_code = (isset($module['tracking'])) ? '?' . $module['tracking']['params'] .
                        $module['tracking']['placement'] . $box_counter . $line_break : "";

                    $plain_text .= trim(strip_tags($this->replaceTags($module['data']['text0']))).$line_break;
                    $plain_text .= trim(strip_tags($this->replaceTags($module['data']['text1']))).$line_break;
                    $plain_text .= $module['data']['image0']['destination_url'].$tracking_code;
                    ++$box_counter;

                    $plain_text .= $line_break;

                    $plain_text .= trim(strip_tags($this->replaceTags($module['data']['text2']))).$line_break;
                    $plain_text .= trim(strip_tags($this->replaceTags($module['data']['text3']))).$line_break;
                    $plain_text .= $module['data']['image1']['destination_url'].$tracking_code;
                    ++$box_counter;

                    $plain_text .= $module_break;
                    break;

                case 'line_of_text':
                    $plain_text .= strtoupper(trim(strip_tags($this->replaceTags($module['data']['text0']))))
                        . $line_break;
                    $plain_text .= $module_break;
                    break;

                case 'spacer_white':
                    // Nothing to do
                    break;

                case 'thin_gray_line_separator':
                    // Nothing to do
                    break;

                default:
                    $plain_text .= $this->defaultHtml2TextConverter($module);
                    $plain_text .= $module_break;

                    break;
            }
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
        $moduleHtml = \View::make($modulePath);
        $moduleHtml->with('params', $params);
        $moduleHtml->with('module', $module);
        $moduleHtml->render();
        $htmlToText = new TextConverter($moduleHtml, array('do_links' => 'inline'));

        return $htmlToText->getText();
    }
}
