import { hooks } from 'customer';
/*
* -- CAMPAIGN CLEANER ---
*/
export default {
  cleanOptions: {
    // Array of classes to clean from final html
    classSelectors: [
      'text-overlay',
      'prevent-overflow',
      'mce-edit-focus',
      'mce-content-body',
      'hubspot-mergetag',
      'is-active',
      'is-inactive',
    ],
    // Array of attributes to clean from final html
    attrSelectors: [
      'aria-multiline',
      'column-id',
      'column',
      'component-id',
      'contenteditable',
      'context',
      'data-column-id',
      'data-key',
      'data-mce-bogus',
      'data-mce-href',
      'data-mce-style',
      'data-medium-element',
      'data-modal',
      'data-module-id',
      'data-params',
      'data-placeholder',
      'data-type',
      'draggable',
      'element-id',
      'id',
      'module-id-instance',
      'module-id',
      'module',
      'role',
      'singleline',
      'spellcheck',
      'truncate',
    ],
    blockSelectors: [
      '.module-toolbar',
      '.text-overlay-toolbox',
      '.st-remove-element',
    ],
  },

  clean(selector) {
    let $canvas = null;
    let $cleanedHtml = null;

    $canvas = $(selector);

    // Clone content
    $cleanedHtml = $canvas.clone(true);

    if (typeof hooks === 'object' && _.has(hooks, 'campaignCleaner.preCleanHook')) {
      $cleanedHtml = hooks.campaignCleaner.preCleanHook($cleanedHtml);
    }

    // Remove attr tags function clean
    const $removeAttr = this.removeDataHtml($cleanedHtml, this.cleanOptions.attrSelectors, 'attr');
    // Function removeDataHtml fail attributes
    if ($removeAttr !== false) {
      $cleanedHtml = $removeAttr;
    }

    // Remove class tags
    const $removeClass = this.removeDataHtml($cleanedHtml, this.cleanOptions.classSelectors, 'class');
    // Function removeDataHtml fail attributes
    if ($removeClass !== false) {
      $cleanedHtml = $removeClass;
    }

    // Remove every element on blockSelectors
    $.each(this.cleanOptions.blockSelectors, (key, selector) => {
      $cleanedHtml.find(selector).remove();
    });

    // Remove wrappers element ( .stx-wrapper )
    $cleanedHtml = Application.utils.removeWrappers($cleanedHtml);

    // replace p tags with spans inside buttons as Outlook button text is not vertically aligned
    this.replacePTags($cleanedHtml);

    // Remove every class starting with "stx-"
    $cleanedHtml.find("[class*=' stx-'], [class^='stx-']").removeClass((index, css) => (css.match(/(^|\s)stx-\S+/g) || []).join(' '));

    // Remove attr class if it's empty.
    $cleanedHtml.find("[class='']").removeAttr('class');

    // Remove attr style if it's empty.
    $cleanedHtml.find("[style='']").removeAttr('style');

    // Remove attr bgcolor if it's empty.
    $cleanedHtml.find("[bgcolor='']").removeAttr('bgcolor');

    // Remove tooltip
    $cleanedHtml.find('.actions-buttons-tooltip').remove();

    // Remove toolbox Tinymce
    $cleanedHtml.find('.text-overlay-toolbox').remove();

    // Convert data-contenteditable-href to href
    $cleanedHtml = Application.utils.removeContentEditableHref($cleanedHtml);

    // Replace data-tag-before
    if ($cleanedHtml.find('[data-tag-before]').length) {
      const $targetDataTag = $cleanedHtml.find('[data-tag-before]');

      $.each($targetDataTag, (key, element) => {
        const tempDataTag = $(element).data('tag-before');
        const $element = $(element);

        // Add tag
        $element.before(tempDataTag);

        // Remove data-tag-before
        $element.removeAttr('data-tag-before');
      });
    }

    // Convert and add data-persist-styles to css property inline in styles attribute
    if ($cleanedHtml.find('[data-persist-styles]').length) {
      const $toPersistArray = $cleanedHtml.find('[data-persist-styles]');
      $.each($toPersistArray, (i, element) => {
        const $element = $(element);
        // Add inline data-saved CSS hacks
        this.addCSSHacks(
          $element,
          Application.utils.objToCss($element.data('persist-styles')),
        );
        $element.removeAttr('data-persist-styles');
      });
    }
    // Remove Comment Divs
    $cleanedHtml = this.removeCommentDivs($cleanedHtml);

    // Skip <% %> Tags
    const linksToReplace = $cleanedHtml.find('a').toArray();
    this.skipTags(linksToReplace);

    $cleanedHtml = this.addMediaQueryHack($cleanedHtml);

    // Convert special chars to html entities ---
    $cleanedHtml = this.encodeHtmlEntities($cleanedHtml);
    // replace data-v attributes, which are set because we are using scoped styles and vue-loader
    return this.charConvert($cleanedHtml.html()).replace(/data-v-[\w]+=""[\s]*/g, '');
  },

  replacePTags($cleanedHtml) {
    const pTags = $cleanedHtml.find('.stx-replace-p-tag');
    $.each(pTags, (i, element) => {
      element.outerHTML = element.outerHTML
        // as this will replace p tags, if the user has included two paragraphps
        // we need to include a br for when the p turn into spans
        .replace(/<br>/g, '')
        .replace(/<\/p><p/g, '</p><br><p')
        .replace(/<p/g, '<span')
        .replace(/<\/p>/g, '</span>');
    });
  },

  replaceDataContentEditableHref($cleanedHtml) {
    // We need to preserve the parent <a> with its children <a> in order to fix a bug with the button click in outlook
    // We Don't use .attr() and .remove() because ESP needs the href like as first attribute of the <a> tag
    // Also if we iterate all tags with a loop, when the parent <a> is modified the childred reference didn't exist
    const $targetContenteditableHref = $cleanedHtml.find('[data-contenteditable-href]');
    if ($targetContenteditableHref.length) {
      const element = $targetContenteditableHref[0];
      const content = element.outerHTML.replace('data-contenteditable-href', 'href');
      element.outerHTML = content;
      this.replaceDataContentEditableHref($cleanedHtml);
    }
  },

  skipTags(links) {
    if (links.length) {
      const element = links[links.length - 1];
      const $element = $(element);
      const href = $element.attr('href');
      if (href) {
        $element.attr('href', href.replace('<%', 'LT%').replace('%>', '%GT'));
      } else {
        $element.replaceWith($element.html());
      }
      links.pop();
      this.skipTags(links);
    }
  },

  // display plain text modal.
  removeDataHtml($html, list, type) {
    if (!$html) {
      return false;
    }

    const $editedHtml = $html;

    // Remove data tags
    for (let i = 0; i < list.length; i++) {
      switch (type) {
        case 'class':
          $editedHtml.find(`.${list[i]}`).removeClass(list[i]);
          break;
        case 'attr':
          $editedHtml.find(`[${list[i]}]`).removeAttr(list[i]);
          break;
      }
    }

    return $editedHtml;
  },

  addCSSHacks($target, newStyles) {
    const originalStyles = $target.attr('style');
    let originalStylesArray = originalStyles.split(';');
    const newStylesArray = newStyles.split(';');

    _.forEachRight(newStylesArray, (style) => {
      const index = originalStylesArray.indexOf(style);
      if (index === -1 && style !== '') {
        // most of these styles are for outlook and they should be before other styles
        originalStylesArray.unshift(style);
      }
    });

    for (let i = 0; i < originalStylesArray.length; i++) {
      originalStylesArray[i] = originalStylesArray[i].replace(' ', '');
    }

    originalStylesArray = originalStylesArray.filter(item => item !== '');
    const stylesToAdd = originalStylesArray.join('; ');
    $target.attr('style', stylesToAdd);
  },

  encodeHtmlEntities($cleanedHtml) {
    const all = $cleanedHtml.find('p, span, div, h1, h2, h3, h4, h5, a, td');

    $.map(all, (el, index) => {
      const textConnvert = this.charConvertHtmlEntities($(el).html());
      if (el.innerText.length > 0) {
        $(el).text(textConnvert);
      }
    });

    return $cleanedHtml;
  },

  removeCommentDivs($cleanedHtml) {
    const all = $cleanedHtml.find('.st-comment');
    $.map(all, (el) => {
      $(el).replaceWith($(el).html());
    });
    return $cleanedHtml;
  },

  charConvertHtmlEntities(str) {
    const codesToChars = {
      '&amp;': '&#38;',
      '&nbsp;': '&#160;',
      '&': '&#38;',
      ';': '&#59;',
      '\\?': '&#63;',
      '=': '&#61;',
      ':': '&#58;',
      '•': '&#8226;',
      ',': '&#44;',
      '"': '&quot;',
      '’': '&rsquo;',
      '‘': '&lsquo;',
      '”': '&rdquo;',
      '“': '&ldquo;',
      '←': '&larr;',
      '→': '&rarr;',
      '↑': '&uarr;',
      '↓': '&darr;',
      '–': '&#8211;',
      '—': '&#8212;',
      '»': '&#187;',
      '£': '&#163;',
      '©': '&#169;',
      '®': '&#174;',
      '℠': '&#8480;',
      '™': '&#8482;',
    };

    const codesToCharsTags = {
      '&quot;': "'",
      '&#039;': "'",
      '<!---->': '',
    };

    const rex = new RegExp('(<[^>]*>)|(&[a-zA-Z0-9#]+;)', 'gm');
    const re = new RegExp(Object.keys(codesToChars).join('|'), 'gi');
    const reTags = new RegExp(Object.keys(codesToCharsTags).join('|'), 'gi');
    const parts = str.split(rex);
    let res = '';

    for (let i = 0; i < parts.length; i++) {
      if (typeof parts[i] !== 'undefined') {
        // only text
        if ($.inArray(parts[i].charAt(0), ['<', '&']) < 0) {
          parts[i] = parts[i].replace(re, matched => matched === '?' ? '&#63;' : codesToChars[matched]);
        } else {
          // tags
          parts[i] = parts[i].replace(reTags, matched => codesToCharsTags[matched]);
        }
        res += parts[i];
      }
    }
    return res;
  },

  /*
  * Convert especial characters
  */
  charConvert(str, inverse) {
    const chars = {
      '©': '&copy;',
      Û: '&#219;',
      '®': '&reg;',
      ž: '&#158;',
      Ü: '&#220;',
      Ÿ: '&#159;',
      Ý: '&#221;',
      $: '&#36;',
      Þ: '&#222;',
      '%': '&#37;',
      '¡': '&#161;',
      ß: '&#223;',
      '¢': '&#162;',
      à: '&#224;',
      '£': '&#163;',
      á: '&#225;',
      À: '&Agrave;',
      '¤': '&#164;',
      â: '&#226;',
      Á: '&Aacute;',
      '¥': '&#165;',
      ã: '&#227;',
      Â: '&Acirc;',
      '¦': '&#166;',
      ä: '&#228;',
      Ã: '&Atilde;',
      '§': '&#167;',
      å: '&#229;',
      Ä: '&Auml;',
      '¨': '&#168;',
      æ: '&#230;',
      Å: '&Aring;',
      '©': '&#169;',
      ç: '&#231;',
      Æ: '&AElig;',
      ª: '&#170;',
      è: '&#232;',
      Ç: '&Ccedil;',
      '«': '&#171;',
      é: '&#233;',
      È: '&Egrave;',
      '¬': '&#172;',
      ê: '&#234;',
      É: '&Eacute;',
      '­': '&#173;',
      ë: '&#235;',
      Ê: '&Ecirc;',
      ì: '&#236;',
      Ë: '&Euml;',
      '¯': '&#175;',
      í: '&#237;',
      Ì: '&Igrave;',
      '°': '&#176;',
      î: '&#238;',
      Í: '&Iacute;',
      '±': '&#177;',
      ï: '&#239;',
      Î: '&Icirc;',
      '²': '&#178;',
      ð: '&#240;',
      Ï: '&Iuml;',
      '³': '&#179;',
      ñ: '&#241;',
      Ð: '&ETH;',
      '´': '&#180;',
      ò: '&#242;',
      Ñ: '&Ntilde;',
      µ: '&#181;',
      ó: '&#243;',
      Õ: '&Otilde;',
      '¶': '&#182;',
      ô: '&#244;',
      Ö: '&Ouml;',
      '·': '&#183;',
      õ: '&#245;',
      Ø: '&Oslash;',
      '¸': '&#184;',
      ö: '&#246;',
      Ù: '&Ugrave;',
      '¹': '&#185;',
      '÷': '&#247;',
      Ú: '&Uacute;',
      º: '&#186;',
      ø: '&#248;',
      Û: '&Ucirc;',
      '»': '&#187;',
      ù: '&#249;',
      Ü: '&Uuml;',
      '@': '&#64;',
      '¼': '&#188;',
      ú: '&#250;',
      Ý: '&Yacute;',
      '½': '&#189;',
      û: '&#251;',
      Þ: '&THORN;',
      '€': '&#128;',
      '¾': '&#190;',
      ü: '&#252',
      ß: '&szlig;',
      '¿': '&#191;',
      ý: '&#253;',
      à: '&agrave;',
      '‚': '&#130;',
      À: '&#192;',
      þ: '&#254;',
      á: '&aacute;',
      ƒ: '&#131;',
      Á: '&#193;',
      ÿ: '&#255;',
      å: '&aring;',
      '„': '&#132;',
      Â: '&#194;',
      æ: '&aelig;',
      '…': '&#133;',
      Ã: '&#195;',
      ç: '&ccedil;',
      '†': '&#134;',
      Ä: '&#196;',
      è: '&egrave;',
      '‡': '&#135;',
      Å: '&#197;',
      é: '&eacute;',
      ˆ: '&#136;',
      Æ: '&#198;',
      ê: '&ecirc;',
      '‰': '&#137;',
      Ç: '&#199;',
      ë: '&euml;',
      Š: '&#138;',
      È: '&#200;',
      ì: '&igrave;',
      '‹': '&#139;',
      É: '&#201;',
      í: '&iacute;',
      Œ: '&#140;',
      Ê: '&#202;',
      î: '&icirc;',
      Ë: '&#203;',
      ï: '&iuml;',
      Ž: '&#142;',
      Ì: '&#204;',
      ð: '&eth;',
      Í: '&#205;',
      ñ: '&ntilde;',
      Î: '&#206;',
      ò: '&ograve;',
      '‘': '&#145;',
      Ï: '&#207;',
      ó: '&oacute;',
      '’': '&#146;',
      Ð: '&#208;',
      ô: '&ocirc;',
      '“': '&#147;',
      Ñ: '&#209;',
      õ: '&otilde;',
      '”': '&#148;',
      Ò: '&#210;',
      ö: '&ouml;',
      '•': '&#149;',
      Ó: '&#211;',
      ø: '&oslash;',
      '–': '&#150;',
      Ô: '&#212;',
      ù: '&ugrave;',
      '—': '&#151;',
      Õ: '&#213;',
      ú: '&uacute;',
      '˜': '&#152;',
      Ö: '&#214;',
      û: '&ucirc;',
      '™': '&trade;',
      '×': '&#215;',
      ý: '&yacute;',
      š: '&#154;',
      Ø: '&#216;',
      þ: '&thorn;',
      '›': '&#155;',
      Ù: '&#217;',
      ÿ: '&yuml;',
      œ: '&#156;',
      Ú: '&#218;',
      '&': '&amp;',
      '&lt;%': 'LT%',
      '%&gt;': '%GT',
      '<': '&lt;',
      '>': '&gt;',
      '£': '&pound;',
      '℠': '&#x2120;',
    };

    $.each(chars, (key, value) => {
      if (inverse) {
        str = str.replace(new RegExp(key, 'g'), value);
      } else {
        str = str.replace(new RegExp(value, 'g'), key);
      }
    });

    return str;
  },
  /**
   * Hack for devices with media queries unsupported
   */
  addMediaQueryHack(htmlStructure) {
    const width = htmlStructure.find('.st-wrapper-table').width() || 600;
    const style = `background-color: transparent; line-height: 1px; height: 1px; min-width: ${width}px;`;
    const styleImage = `max-height: 1px; display: block; width: ${width}px; min-width: ${width}px; border: 0;`;
    const src = `${Application.globals.baseUrl}/_common/images/en_us/spacer.gif`;
    if (!htmlStructure.hasClass('st-hide-hack')) {
      const $hack = $(`<tr>
        <td class="st-hide-hack">
          <table cellpadding="0" cellspacing="0" border="0" align="center" width="${width}">
            <tr>
              <td cellpadding="0" cellspacing="0" border="0" height="1" style="${style}">
                <img src="${src}" height="1" width="${width}" style="${styleImage}"/>
              </td>
            </tr>
          </table>
        </td>
      </tr>`)[0];
      htmlStructure.find('.st-wrapper-table').append($hack);
    }
    return htmlStructure;
  },
};
