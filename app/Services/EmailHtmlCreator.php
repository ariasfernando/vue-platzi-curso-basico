<?php

namespace Stensul\Services;

use Cdn;
use URL;
use View;
use StensulLocale;
use Storage;
use League\Flysystem\AdapterInterface;
use Stensul\Services\EmailTextCreator as Text;
use Stensul\Providers\HelperServiceProvider as Helper;

class EmailHtmlCreator
{
    const FORMAT_TEXT = 'text';
    const FORMAT_HTML = 'html';

    const ASSETS_VERION = 'v1';

    protected $body;
    protected $campaign;

    public static $HTML_FILENAME = 'index.html';
    public static $VIEW_IN_BROWSER_TAG = '[VIEW_IN_BROWSER_LINK]';
    public static $EMAIL_LAYOUT = 'base.layouts.email';

    /**
     * Create an HTML template.
     *
     * @param \Sensul\Models\Campaign $campaign
     * @param array                   $options
     */
    public function __construct(\Stensul\Models\Campaign $campaign, $options = [])
    {
        $this->campaign = $campaign;

        isset($options['format']) ? $this->format = $options['format'] : null;
    }

    /**
     * Create text version.
     *
     * @return string
     */
    public function createTextVersion()
    {
        $text = new Text(array('modules' => $this->campaign['modules_data']));

        return $text->createTextVersion();
    }

    /**
     * Get Campaign.
     *
     * @return \Stensul\Models\Campaign
     */
    public function getCampaign()
    {
        return $this->campaign;
    }

    /**
     * Get Email layout.
     *
     * @return \Illuminate\View\View
     */
    public function getEmailLayout()
    {
        $email_layout = Helper::validateView(self::$EMAIL_LAYOUT);
        
        return \View::make(
            $email_layout
        )
                ->with(
                    'params',
                    [
                        'title' => $this->getCampaign()->campaign_name,
                        'body_html' => $this->getCampaign()->body_html,
                        'campaign_data' => $this->getCampaign()
                    ]
                )
                ->render();
    }

    /**
     * Create HTML body.
     *
     * @return string
     */
    public function createHtmlBody()
    {
        // Initialize locale
        StenuslLocale::init($this->getCampaign()->locale);

        $this->body = $this->getEmailLayout();

        $this->body = $this->replaceViewInBrowserLink();

        if (!env('CDN_UPLOAD_PRETEND', false)) {
            $this->body = $this->replaceImagesPath();
            $this->body = $this->replaceFontPath();
        }

        $this->getCampaign()->body_html = $this->body;
        $this->getCampaign()->save();

        return $this->body;
    }

    /**
     * Store HTML in CDN.
     *
     * @return string
     */
    public function storeHtmlInCdn()
    {
        $storage = Storage::disk('cloud');
        $cdn_path = trim($this->getCampaign()->getCdnPath(), DS).DS.self::$HTML_FILENAME;

        $this->body = $this->stripHtmlComments();

        $storage->put($cdn_path, $this->body, AdapterInterface::VISIBILITY_PUBLIC);

        Cdn::disk()->delete('/'.$cdn_path);

        return $cdn_path;
    }

    /**
     * Replace "View in browser" link.
     *
     * @return string
     */
    public function replaceViewInBrowserLink()
    {
        $view_in_browser_link = trim($this->getCampaign()->getCdnPath(true), DS).DS.self::$HTML_FILENAME;

        return str_replace(self::$VIEW_IN_BROWSER_TAG, $view_in_browser_link, $this->body);
    }

    /**
     * Replace images url from img tag.
     *
     * @return \Illuminate\View\View|string
     */
    public function replaceImageTagSrc($body = null)
    {
        if (is_null($body)) {
            $body = $this->body;
        }

        $regexp = "<img\s[^>]*src=([\"\']??)([^\" >]*?)\\1[^>]*>";
        preg_match_all("/$regexp/siU", $body, $matches, PREG_SET_ORDER);

        $cdn_path = $this->getCampaign()->getCdnPath(true);

        if ($matches) {
            foreach ($matches as $match) {
                $url = trim($match[2]);

                // get the image basename
                $basename = basename(parse_url($url, PHP_URL_PATH));

                // append cdn prefix
                $cdn_url = rtrim($cdn_path, DS).DS.'images'.DS.$basename;

                // replace the url in body
                $body = str_replace($url, $cdn_url, $body);
            }
        }

        return $body;
    }

    /**
     * Replace images url from outlook image tag.
     *
     * @return \Illuminate\View\View|string
     */
    public function replaceImageOutlookSrc($body = null)
    {
        if (is_null($body)) {
            $body = $this->body;
        }

        $regexp = "<v\:fill\s[^>]*src=([\"\']??)([^\" >]*?)\\1[^>]*>";
        preg_match_all("/$regexp/siU", $body, $matches, PREG_SET_ORDER);

        $cdn_path = $this->getCampaign()->getCdnPath(true);

        if ($matches) {
            foreach ($matches as $match) {
                $url = trim($match[2]);

                // get the image basename
                $basename = basename(parse_url($url, PHP_URL_PATH));

                // append cdn prefix
                $cdn_url = rtrim($cdn_path, DS).DS.'images'.DS.$basename;

                // replace the url in body
                $body = str_replace($url, $cdn_url, $body);
            }
        }

        return $body;
    }

    /**
     * Replace images url from css background.
     *
     * @return \Illuminate\View\View|string
     */
    public function replaceImageCssUrl($body = null)
    {
        if (is_null($body)) {
            $body = $this->body;
        }

        $cdn_path = $this->getCampaign()->getCdnPath(true);

        $image_extensions = array('jpg', 'pjpg', 'jpeg', 'gif', 'png',  'webp', 'bmp', 'tiff');

        $matches = $this->assetsRegex($body);

        if ($matches) {
            foreach ($matches[0] as $match) {
                $url = parse_url(trim($match));
                $extension = pathinfo($url['path'])['extension'];
                $basename = basename($url['path']);

                if (in_array(strtolower($extension), $image_extensions)) {
                    // append cdn prefix
                    $cdn_url = rtrim($cdn_path, DS).DS.'images'.DS.$basename;

                    // replace the url in body
                    $body = str_replace(trim($match), $cdn_url, $body);
                }
            }
        }

        return $body;
    }

    /**
     * Replace images path.
     *
     * @return \Illuminate\View\View|string
     */
    public function replaceImagesPath()
    {
        $body = $this->body;

        $body = $this->replaceImageTagSrc($body);
        $body = $this->replaceImageOutlookSrc($body);
        $body = $this->replaceImageCssUrl($body);

        return $body;
    }

    /**
     * Create a regex for search url in css
     *
     * @return array
     */
    protected function assetsRegex($body = null)
    {
        if (is_null($body)) {
            $body = $this->body;
        }
        $regexp = "/url\\s*\\(\\s*(\\\"|\\'|&quot;|)\\K(?!\\s[\"\\']?(?:https?:\\/\\/|ftp:\\/\\/))"
            . "(?:[^\\\\\\\\]|\\\\\\\\.)*?(?=\\1\\s*\\))/mi";
        preg_match_all($regexp, $body, $matches);
        return $matches;
    }

    /**
     * Replace font path.
     *
     * @return \Illuminate\View\View|string
     */
    public function replaceFontPath()
    {
        $body = $this->body;

        $cdn_path = $this->getCampaign()->getCdnPath(true);

        $font_extensions = array('eot', 'woff', 'ttf', 'svg');

        $matches = $this->assetsRegex($body);

        if ($matches) {
            foreach ($matches[0] as $match) {
                $url = parse_url(trim($match));
                $extension = pathinfo($url['path'])['extension'];
                $basename = basename($url['path']);
                $fragment = (isset($url['fragment'])) ? '#'.$url['fragment'] : '';

                if (in_array(strtolower($extension), $font_extensions)) {
                    // append cdn prefix
                    $cdn_url = rtrim($cdn_path, DS).DS.'fonts'.DS.$basename.$fragment;

                    // replace the url in body
                    $body = str_replace(trim($match), $cdn_url, $body);
                }
            }
        }

        return $body;
    }

    /**
     * Strip HTML comments.
     *
     * @return \Illuminate\View\View|string
     */
    public function stripHtmlComments()
    {
        $regex = array(
            //description, search, replace
            array('Footer', '/<!-- FOOTER -->.*?<!-- FOOTER -->/is', ''),
            array(
                'View email in a web browser ',
                '/<!-- VIEW IN BROWSER -->.*?<!-- VIEW IN BROWSER ENDS -->/is',
                '&nbsp;'
            ),
        );

        $body = $this->body;
        foreach ($regex as $r) {
            $count = 0;
            $body = preg_replace($r[1], $r[2], $body, -1, $count);
        }

        return $body;
    }

    /**
     * Sets the html body, useful for testing.
     *
     * @param string $body
     */
    public function setBody($body)
    {
        $this->body = $body;
    }
}
