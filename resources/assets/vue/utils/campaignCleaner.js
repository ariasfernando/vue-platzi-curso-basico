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
    ],
    // Array of attributes to clean from final html
    attrSelectors: [
      'data-type',
      'data-params',
      'data-modal',
      'data-medium-element',
      'data-module-id',
      'data-column-id',
      'data-placeholder',
      'contenteditable',
      'spellcheck',
      'aria-multiline',
      'role',
      'truncate',
      'singleline',
      'data-mce-bogus',
      'data-key',
      'data-mce-href',
      'data-mce-style',
      'id',
      'module',
      'context'
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

    // Remove wrappers
    $cleanedHtml = Application.utils.removeWrappers($cleanedHtml);

    // Remove every class starting with "stx-"
    $cleanedHtml.find("[class*=' stx-'], [class^='stx-']").removeClass((index, css) => (css.match(/(^|\s)stx-\S+/g) || []).join(' '));
    
    // Remove attr class if it's empty.
    $cleanedHtml.find("[class='']").removeAttr('class');
    
    // Remove attr style if it's empty.
    $cleanedHtml.find("[style='']").removeAttr('style');
    
    // Remove tooltip
    $cleanedHtml.find('.actions-buttons-tooltip').remove();
    
    // Remove toolbox Tinymce
    $cleanedHtml.find('.text-overlay-toolbox').remove();
    
    // Convert data-contenteditable-href to href
    if ($cleanedHtml.find('[data-contenteditable-href]').length) {
      const $targetContenteditableHref = $cleanedHtml.find('[data-contenteditable-href]');
      
      $.each($targetContenteditableHref, (key, element) => {
        const content = element.outerHTML.replace('data-contenteditable-href', 'href');
        element.outerHTML = content;
      });
    }

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
    };

    // Convert and add data-persist-styles to css property inline in styles attribute
    if ($cleanedHtml.find('[data-persist-styles]').length) {
      const $toPersistArray = $cleanedHtml.find("[data-persist-styles]");
      $.each($toPersistArray, (i, element) => {
        const $element = $(element);
        // Add inline data-saved CSS hacks
        this.addCSSHacks(
          $element,
          Application.utils.objToCss($element.data('persist-styles'))
        );
        $element.removeAttr('data-persist-styles');
      });
    }

    // Skip <% %> Tags
    if ($cleanedHtml.find('a').length) {
      const $links = $cleanedHtml.find('a');
      $.each($links, (i, element) => {
        const $element = $(element);
        const href = $element.attr("href");
        $element.attr("href", href.replace("<%","LT%").replace("%>","%GT"));
      });
    }

    // Convert special chars to html entities ---
    $cleanedHtml = this.encodeHtmlEntities($cleanedHtml);
    return this.charConvert($cleanedHtml.html());
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
      newStyles.replace(';','');
      var originalStyles = $target.attr('style');
      var originalStylesArray = originalStyles.split(';');

      if(!originalStyles.includes(newStyles)){
          originalStylesArray.push(newStyles);
      }

      for (var i = 0; i < originalStylesArray.length; i++) {
          originalStylesArray[i] = originalStylesArray[i].replace(' ','');
      }

      originalStylesArray = originalStylesArray.filter(function(item) {
          return item !== '';
      })
      newStyles = originalStylesArray.join('; ');
      $target.attr('style', newStyles);
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
  }

}; 