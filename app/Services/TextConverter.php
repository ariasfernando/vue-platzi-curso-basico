<?php

namespace Stensul\Services;

use Html2Text\Html2Text;

/**
 * Converts HTML to formatted plain text.
 */
class TextConverter extends Html2Text
{

    /**
     * Maximum width of the formatted text, in columns.
     *
     * Set this value to 0 (or less) to ignore word wrapping
     * and not constrain text to a fixed-width column.
     *
     * @var int
     */
    protected $width = 110;

    /**
     * List of preg* regular expression patterns to search for,
     * used in conjunction with $replace.
     *
     * @var array
     *
     * @see $replace
     */
    protected $search = array(
        "/\r/", // Non-legal carriage return
        "/[\n\t]+/", // Newlines and tabs
        '/<head[^>]*>.*?<\/head>/i', // <head>
        '/<script[^>]*>.*?<\/script>/i', // <script>s -- which strip_tags supposedly has problems with
        '/<style[^>]*>.*?<\/style>/i', // <style>s -- which strip_tags supposedly has problems with
        '/<br[^>]*>/i', // <br>
        '/<i[^>]*>(.*?)<\/i>/i', // <i>
        '/<em[^>]*>(.*?)<\/em>/i', // <em>
        '/(<ul[^>]*>|<\/ul>)/i', // <ul> and </ul>
        '/(<ol[^>]*>|<\/ol>)/i', // <ol> and </ol>
        '/(<dl[^>]*>|<\/dl>)/i', // <dl> and </dl>
        '/<li[^>]*>(.*?)<\/li>/i', // <li> and </li>
        '/<dd[^>]*>(.*?)<\/dd>/i', // <dd> and </dd>
        '/<dt[^>]*>(.*?)<\/dt>/i', // <dt> and </dt>
        '/<li[^>]*>/i', // <li>
        '/<hr[^>]*>/i', // <hr>
        '/<div[^>]*>/i', // <div>
        '/(<table[^>]*>|<\/table>)/i', // <table> and </table>
        '/(<tr[^>]*>|<\/tr>)/i', // <tr> and </tr>
        '/<td[^>]*>(.*?)<\/td>/i', // <td> and </td>
        '/<span class="_html2text_ignore">.+?<\/span>/i', // <span class="_html2text_ignore">...</span>
        '/<\#noescape>.*<\/\#noescape>/i', // <#noescape>${open()}</#noescape>
    );

    /**
     * List of pattern replacements corresponding to patterns searched.
     *
     * @var array
     *
     * @see $search
     */
    protected $replace = array(
        '', // Non-legal carriage return
        '', // Newlines and tabs
        '', // <head>
        '', // <script>s -- which strip_tags supposedly has problems with
        '', // <style>s -- which strip_tags supposedly has problems with
        "\n", // <br>
        '\\1', // <i>
        '_\\1_', // <em>
        "\n\n", // <ul> and </ul>
        "\n\n", // <ol> and </ol>
        "\n\n", // <dl> and </dl>
        "\t* \\1\n", // <li> and </li>
        "\\1\n", // <dd> and </dd>
        "\t* \\1", // <dt> and </dt>
        "\n\t* ", // <li>
        "\n\n", // <hr>
        "<div>\n", // <div>
        '', // <table> and </table>
        '', // <tr> and </tr>
        '\\1', // <td> and </td>
        '', // <span class="_html2text_ignore">...</span>
        '', // <#noescape>${open()}</#noescape>
    );

    /**
     * List of preg* regular expression patterns to search for,
     * used in conjunction with $entReplace.
     *
     * @var array
     *
     * @see $entReplace
     */
    protected $entSearch = array(
        '/&(nbsp|#160);/i', // Non-breaking space
        '/&(quot|rdquo|ldquo|#8220|#8221|#147|#148);/i',
        // Double quotes
        '/&(apos|rsquo|lsquo|#8216|#8217);/i', // Single quotes
        '/&gt;/i', // Greater-than
        '/&lt;/i', // Less-than
        '/&(copy|#169);/i', // Copyright
        '/&(trade|#8482|#153);/i', // Trademark
        '/&(reg|#174);/i', // Registered
        '/&(mdash|#151|#8212);/i', // mdash
        '/&(ndash|minus|#8211|#8722);/i', // ndash
        '/&(bull|#149|#8226);/i', // Bullet
        '/&(pound|#163);/i', // Pound sign
        '/&(euro|#8364);/i', // Euro sign
        '/&(amp|#38);/i', // Ampersand: see converter()
        '/[ ]{2,}/', // Runs of spaces, post-handling
    );

    /**
     * List of pattern replacements corresponding to patterns searched.
     *
     * @var array
     *
     * @see $entSearch
     */
    protected $entReplace = array(
        ' ', // Non-breaking space
        '"', // Double quotes
        "'", // Single quotes
        '>',
        '<',
        '(c)',
        '(tm)',
        '(R)',
        '--',
        '-',
        '*',
        '£',
        'EUR', // Euro sign. € ?
        '|+|amp|+|', // Ampersand: see converter()
        '', // Runs of spaces, post-handling
    );

    /**
     * List of preg* regular expression patterns to search for
     * and replace using callback function.
     *
     * @var array
     */
    protected $callbackSearch = array(
        '/<(a) [^>]*href=("|\')([^"\']+)\2([^>]*)>(.*?)<\/a>/i', // <a href="">
        '/<(span)( [^>]*)?>(.*?)<\/span>/i', // <span> and </span>,
        '/<(h)[123456]( [^>]*)?>(.*?)<\/h[123456]>/i', // h1 - h6
        '/<(b)( [^>]*)?>(.*?)<\/b>/i', // <b>
        '/<(strong)( [^>]*)?>(.*?)<\/strong>/i', // <strong>
        '/<(th)( [^>]*)?>(.*?)<\/th>/i', // <th> and </th>,
        '/<(p)( [^>]*)?>(.*?)<\/p>/i', // <p> and </p>,
    );

    /**
     * Workhorse function that does actual conversion.
     *
     * @see   \Html2Text\Html2Text\converter
     * @param string Reference to HTML content string
     */
    protected function converter(&$text)
    {
        parent::converter($text);
        $text = preg_replace("/\n\.\n/", "\n", $text);
    }

    /**
     * Helper function called by preg_replace() on link replacement.
     *
     * @see    \Html2Text\Html2Text\buildLinkList
     * @param  string $link         URL of the link
     * @param  string $display      Part of the text to associate number with
     * @param  null   $linkOverride
     * @return string
     */
    protected function buildLinkList($link, $display, $linkOverride = null)
    {
        $linkMethod = ($linkOverride) ? $linkOverride : $this->options['do_links'];

        if ($linkMethod == 'none') {
             return $display;
        }

        // Ignored link types
        if (preg_match('!^(javascript:|mailto:|#)!i', $link)) {
             return $display;
        }

        $linkArray = str_split($link);
        // Ignored link types
        if ($linkArray[0] === '[' || ($linkArray[0] === '$' && $linkArray[1] === '{')) {
             return "$display $link";
        }

        if (preg_match('!^([a-z][a-z0-9.+-]+:)!i', $link)) {
             $url = $link;
        } else {
             $url = $link;
            if (substr($link, 0, 1) != '/') {
                 $url .= '/';
            }
            $url .= "$link";
        }

        if ($linkMethod == 'table') {
            if (($index = array_search($url, $this->linkList)) === false) {
                $index = count($this->linkList);
                $this->linkList[] = $url;
            }

            return $display.' ['.($index + 1).']';
        } elseif ($linkMethod == 'nextline') {
            return $display."\n[".$url.']';
        } else {
            return "$display $url";
        }
    }

    /**
     * Strtoupper multibyte wrapper function with HTML entities handling.
     *
     * @param  string $str Text to convert
     * @return string Converted text
     */
    protected function strtoupper($str)
    {
        $str = html_entity_decode($str, ENT_COMPAT, self::ENCODING);

        if (function_exists('mb_strtoupper')) {
            $str = mb_strtoupper($str, self::ENCODING);
        } else {
            $str = strtoupper($str);
        }

        $str = htmlspecialchars($str, ENT_COMPAT, self::ENCODING);

        return $str;
    }

    /**
     * Strtoupper function with HTML tags and entities handling.
     *
     * @param  string $str Text to convert
     * @return string Converted text
     */
    protected function toupper($str)
    {
        // string can contain HTML tags
        $chunks = preg_split('/(<[^>]*>)/', $str, null, PREG_SPLIT_NO_EMPTY | PREG_SPLIT_DELIM_CAPTURE);

        // convert toupper only the text between HTML tags
        foreach ($chunks as $i => $chunk) {
            if ($chunk[0] != '<') {
                $chunks[$i] = $this->strtoupper($chunk);
            }
        }

        return implode($chunks);
    }

    /**
     * Callback function for preg_replace_callback use.
     *
     * @param array $matches PREG matches
     *
     * @return string
     */
    protected function pregCallback($matches)
    {
        switch (strtolower($matches[1])) {
            case 'b':
            case 'strong':
                return $matches[3];
            case 'th':
                return $this->toupper("\t\t" . $matches[3] . "\n");
            case 'h':
                return $matches[3] . "\n";
            case 'a':
                // override the link method
                $linkOverride = null;
                if (preg_match('/_html2text_link_(\w+)/', $matches[4], $linkOverrideMatch)) {
                    $linkOverride = $linkOverrideMatch[1];
                }
                // Remove spaces in URL (#1487805)
                $url = str_replace(' ', '', $matches[3]);

                $link = $this->buildLinkList($url, $matches[5], $linkOverride);

                return $link."\n";
            case 'p':
                return $matches[3]."\n\n";
            case 'span':
                if (strpos($matches[2], 'class="hr"') !== false) {
                    return "\n";
                }

                return $matches[3];
        }
    }
}
