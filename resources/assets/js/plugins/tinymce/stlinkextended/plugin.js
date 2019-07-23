/**
 * plugin.js
 *
 * currently, stlinkextended plugin is mounted always even if link option is disabled in editor settings
 * for this reason is why if (linkButton) is in several parts of the code
 */

/*global tinymce:true */

tinymce.PluginManager.add('stlinkextended', function (editor) {
    if(!stLinksExtended.running){
        $('body').on('mouseup', function(){
            stLinksExtended.checkLinkButton();
        });
        stLinksExtended.running = true;
    }
    var linkButton = null;
    var selected_color = null;

    function isLink(elementSelection) {

        var foundElement = 0;

        var endParent = editor.dom.doc.activeElement;

        var currentElement = elementSelection;

        function findLinkInParents(element) {
            if(!element instanceof HTMLElement)
                return -1;
            
            if(element === endParent)
                return -1;

            if(element.parentNode instanceof HTMLAnchorElement)
                return 1;

            currentElement = element.parentNode;
            return 0;
            
        }

        while(foundElement === 0) {
            foundElement = findLinkInParents(currentElement);
        }

        return foundElement > 0 ;


    }

    function createLinkList(callback) {
        return function () {
            var linkList = editor.settings.link_list;
            var targetIsLink = isLink(editor.selection.getEnd());
            if (typeof linkList == "string") {
                tinymce.util.XHR.send({
                    url: linkList,
                    success: function (text) {
                        callback(tinymce.util.JSON.parse(text), targetIsLink);
                    }
                });
            } else if (typeof linkList == "function") {
                linkList(callback);
            } else {
                callback(linkList, targetIsLink);
            }
        };
    }

    function buildListItems(inputList, itemCallback, startItems) {
        function appendItems(values, output) {
            output = output || [];

            tinymce.each(values, function (item) {
                var menuItem = { text: item.text || item.title };

                if (item.menu) {
                    menuItem.menu = appendItems(item.menu);
                } else {
                    menuItem.value = item.value;

                    if (itemCallback) {
                        itemCallback(menuItem);
                    }
                }

                output.push(menuItem);
            });

            return output;
        }

        return appendItems(inputList, startItems || []);
    }

    function showDialog (linkList, isLink) {

        if (linkButton) {
            var textSelection = editor.selection.getContent({format : 'text'});

        /* in case link button is fired with keyboard shortcut, we check if there is or not a text selection */
        if (!textSelection || $.trim( editor.selection.getContent({format : 'text'})) == '') {
            /* if there is no selection, and link button is not active (meaning that there is no link in current cursor position)
            finish function here */
                if (linkButton.active() == false) {
                    return false;
                }
            }
        }

        var data = {}, selection = editor.selection, dom = editor.dom, selectedElm, anchorElm, initialText;
        var win, onlyText, textListCtrl, linkListCtrl, tagListCtrl, relListCtrl, targetListCtrl, classListCtrl, colorsListCtrl, linkTitleCtrl, value, dataDescCtrl;

        function linkListChangeHandler(e) {
            var textCtrl = win.find('#text');

            if (!textCtrl.value() || (e.lastControl && textCtrl.value() == e.lastControl.text())) {
                textCtrl.value(e.control.text());
            }

            win.find('#href').value(e.control.value());
        }

        function buildAnchorListControl(url) {
            var anchorList = [];

            tinymce.each(editor.dom.select('a:not([href])'), function (anchor) {
                var id = anchor.name || anchor.id;

                if (id) {
                    anchorList.push({
                        text: id,
                        value: '#' + id,
                        selected: url.indexOf('#' + id) != -1
                    });
                }
            });

            if (anchorList.length) {
                anchorList.unshift({ text: 'None', value: '' });

                return {
                    name: 'anchor',
                    type: 'listbox',
                    label: 'Anchors',
                    values: anchorList,
                    onselect: linkListChangeHandler
                };
            }
        }

        function updateText() {
            if (!initialText && data.text.length === 0 && onlyText) {
                this.parent().parent().find('#text')[0].value(this.value());
            }
        }



        function urlChange(e) {
            var meta = e.meta || {};

            if (linkListCtrl) {
                linkListCtrl.value(editor.convertURL(this.value(), 'href'));
            }

            tinymce.each(e.meta, function (value, key) {
                win.find('#' + key).value(value);
            });

            if (!meta.text) {
                updateText.call(this);
            }

            data.href = this.value();
        }

        function updateTitle(e) {
            data.title = this.value();
        }


        function getColorList(color_list) {
            var list = color_list.link_colors_list;
            // Chek if palette from library is enabled
            if(Object.prototype.hasOwnProperty.call(color_list, 'textcolor_from_library')){
                var JsonList =  JSON.parse(vm.$store.state.campaign.campaign.library_config.colorPalettes)[Object.prototype.hasOwnProperty.call(color_list, 'palette_name') ? color_list.palette_name : 'default'];
                list = _.chunk(JsonList,2).map(function (item) {
                    return { text : '#' + item[0], value: '#' + item[0] };
                });
            }
            return list;
        }

        function urlValidate(e) {
            var href = e.value;
            var matches = [];

            // Check if value is a script tag
            if (editor.settings.tag_list) {
                matches = editor.settings.tag_list.filter(function (tag) {
                    return tag.value == win.find('#href').value();
                });
            }

            // Validate only urls
            if (!matches.length && href.length > 0) {
                if (href.indexOf('@') > 0
                    && href.indexOf('//') == -1
                    && href.indexOf('mailto:') == -1
                    && editor.settings.autocomplete_mailto != false) {
                    href = 'mailto:' + href;
                } else if (href.indexOf('http://') == -1
                    && href.indexOf('https://') == -1
                    && href.indexOf('mailto:') == -1
                    && editor.settings.autocomplete_http != false) {
                    href = 'http://' + href;
                }
            }

            e.value = href;
            data.href = href;
        }
        function getSelectionContent() {
            selectedElm = selection.getNode();
            return (selectedElm.textContent === selection.getContent()) ? selectedElm.outerHTML : selection.getContent();
          }

          function validateDescription(target){
              var description = target.value;
              return validateNoSpaces( description );
          }

          function validateNoSpaces( value ){
              if( !value ){
                  return true;
              }

              if( value.indexOf(" ") >= 0 ){
                  return false;
              }

              return true;
        }

        function getSelectionContent() {
          selectedElm = selection.getNode();
          return (selectedElm.textContent === selection.getContent()) ? selectedElm.outerHTML : selection.getContent();
        }

        function mceInsertLink(linkAttrs){
          // when an HTML is intented to be inserted, the "text" isn't founded.
          // for that reason, we use the editor selection to insert the link executing the mceInsertLink.
          // and instead of using formatLinkContent, we check again the link_format.
          if(editor.settings.link_format.bold)
            editor.formatter.apply('bold');
          if(editor.settings.link_format.underline)
            editor.formatter.apply('underline');
          editor.execCommand('mceInsertLink', false, linkAttrs);
          setTimeout(function(){editor.selection.collapse()},100);
        }
        function mceUnLink(){
            editor.execCommand('unlink');
            if(editor.settings.link_format.bold)
                editor.formatter.remove('bold');
            if(editor.settings.link_format.underline)
                editor.formatter.remove('underline');
            editor.selection.getNode().style.color = null;
        }

        function isOnlyTextSelected(anchorElm) {
            var html = getSelectionContent();

            // Partial html and not a fully selected anchor element
            if (/</.test(html) && (!/^<a [^>]+>[^<]+<\/a>$/.test(html) || html.indexOf('href=') == -1)) {
                return false;
            }

            if (anchorElm) {
                var nodes = anchorElm.childNodes, i;

                if (nodes.length === 0) {
                    return false;
                }

                for (i = nodes.length - 1; i >= 0; i--) {
                    if (nodes[i].nodeType != 3) {
                        return false;
                    }
                }
            }

            return true;
        }

        function getGammaTitle() {
            var title = 'Mask';
            if (Application.globals.maskLinksTitle !== '') {
                title = _.capitalize(Application.globals.maskLinksTitle + ' tag');
            }
            return title;
        }

        function hasStyle(styleObject, name) {
            var has = false;
            for (var i in styleObject) {
                if (styleObject[i].name) {
                    if (styleObject[i].name == name) {
                        has = true;
                    }
                }
            }
            return has;
        }

        function getColor(defaultColor) {
            var hexColor = defaultColor ? defaultColor.toUpperCase() : defaultColor;
            if (!hexColor) {
                var nodeSpan = editor.selection.getNode();
                var $parentEl = $(nodeSpan).parents().filter(function () {
                    return $(this).css('color');
                });
                var selectionColor = new tinyMCE.util.Color($parentEl.css('color'));
                hexColor = selectionColor.toHex().toUpperCase();
            }
            return hexColor;
        }

        selectedElm = selection.getNode();
        anchorElm = dom.getParent(selectedElm, 'a[href]');
        onlyText = isOnlyTextSelected();
        var content = getSelectionContent();
        data.text = initialText = anchorElm ? (anchorElm.innerText || anchorElm.textContent) : content;
        data.href = anchorElm ? dom.getAttrib(anchorElm, 'href') : '';
        data.dataDescription = anchorElm ? dom.getAttrib(anchorElm, 'data-description') : '';

        data.style = [];

        if (anchorElm) {
            data.target = dom.getAttrib(anchorElm, 'target');
        } else if (editor.settings.default_link_target) {
            data.target = editor.settings.default_link_target;
        }

        if ((value = dom.getAttrib(anchorElm, 'rel'))) {
            data.rel = value;
        }

        if ((value = dom.getAttrib(anchorElm, 'class'))) {
            data['class'] = value;
        }

        if ((value = dom.getAttrib(anchorElm, 'title'))) {
            data.title = value;
        } else if (editor.settings.link_title) {
            data.title = "";
        }

        if (editor.settings.link_text_to_display !== false && onlyText) {
            textListCtrl = {
                name: 'text',
                type: 'textbox',
                size: 40,
                label: 'Text to display',
                onchange: function () {
                    data.text = this.value();
                }
            };
        }

        if (linkList) {
            linkListCtrl = {
                type: 'listbox',
                label: 'Link list',
                values: buildListItems(
                    linkList,
                    function (item) {
                  item.value = editor.convertURL(item.value || item.url, 'href');
                },
                [{ text: 'None', value: '' }]
                ),
                onselect: linkListChangeHandler,
                value: editor.convertURL(data.href, 'href'),
                onPostRender: function () {
                    /*eslint consistent-this:0*/
                    linkListCtrl = this;
                }
            };
        }

        if (editor.settings.tag_list) {
            tagListCtrl = {
                type: 'listbox',
                label: 'AMP Scripts',
                values: buildListItems(
                    editor.settings.tag_list,
                    function (item) {
                        item.value = item.value;
                    },
                    [{ text: 'Select', value: '' }]
                    ),
                onselect: function (e) {
                    win.find('#href').value(e.control.value());
                },
                onPostRender: function () {
                    tagListCtrl = this;
                }
            };
        }

        if (editor.settings.data_description) {
            dataDescCtrl = {
                name: 'data_description',
                type: 'textbox',
                size: 40,
                label: getGammaTitle(),
                value: data.dataDescription || '',
                onfocusout: function (e) {
                    validateDescription(e.target);
                }
            };
        }

        if (editor.settings.target_list !== false) {
            if (!editor.settings.target_list) {
                editor.settings.target_list = [
                    { text: 'None', value: '' },
                    { text: 'New window', value: '_blank' }
                ];
            }

            targetListCtrl = {
                name: 'target',
                type: 'listbox',
                label: 'Target',
                values: buildListItems(editor.settings.target_list)
            };
        }

        if (editor.settings.rel_list) {
            relListCtrl = {
                name: 'rel',
                type: 'listbox',
                label: 'Rel',
                values: buildListItems(editor.settings.rel_list)
            };
        }

        if (editor.settings.link_color_palette) {
            var colorList = getColorList(editor.settings.link_color_palette);
            var defaultColor = Object.prototype.hasOwnProperty.call(editor.settings, 'link_fixed_color') ? editor.settings.link_fixed_color : null;
            colorsListCtrl = {
                name: 'color',
                type: 'buttongroup',
                label: 'Link color',
                classes: 'modal-link-colors',
                items: colorList,
                onPostRender: function () {
                    selected_color = null;
                    var $element = this.$el;
                    if ($element.find('button').length > 0) {
                        $element.find('button').each(function (index, button) {
                            $(button).css('background-color', $(button).text()).data('color', $(button).text());
                            $(button).attr('title', $(button).text()).data('color', $(button).text());
                            if (getColor(defaultColor) === $(button).text().toUpperCase()){
                                $(button).addClass('selected');
                                selected_color = $(button).text().toUpperCase();
                            }
                            if (Application.utils.isTooDark($(button).text(), 200)) {
                                $(button).css('color', '#FFFFFF');
                            } else {
                                $(button).css('color', '#000000');
                            }

                            $(button).on('click', function (event) {
                                var self = this;
                                $element.find('.selected').removeClass('selected');
                                $(this).addClass('selected');
                                data.style = data.style || [];
                                if (!hasStyle(data.style, 'color')) {
                                    data.style.push({
                                        name: 'color',
                                        value: $(self).data('color')
                                    });
                                } else {
                                    data.style = data.style.map(function (item) {
                                        if (item.name == 'color') {
                                            item.value = $(self).data('color');
                                        }
                                        return item;
                                    });
                                }
                                selected_color = data.style[0].value;
                            });
                        });
                        if (data.style) {
                            $.each(data.style, function (index, style) {
                                if (style.name === 'color') {
                                    $element.find('button:contains("' + style.value.toUpperCase() + '")').addClass('selected');
                                }
                            });
                        }
                    }
                }
            };
        }

        if (editor.settings.link_class_list) {
            classListCtrl = {
                name: 'class',
                type: 'listbox',
                label: 'Class',
                values: buildListItems(
                    editor.settings.link_class_list,
                    function (item) {
                        if (item.value) {
                            item.textStyle = function () {
                                return editor.formatter.getCssText({ inline: 'a', classes: [item.value] });
                            };
                        }
                    }
                    )
            };
        }
        if (editor.settings.link_title !== false) {
            linkTitleCtrl = {
                name: 'title',
                type: 'textbox',
                label: 'Title',
                value: data.title,
                onkeyup: updateTitle,
            };
        }

        win = editor.windowManager.open({
            title: 'Insert link',
            data: data,
            body: [
                {
                    name: 'href',
                    type: 'filepicker',
                    classes: 'link-input',
                    filetype: 'file',
                    size: 40,
                    autofocus: true,
                    label: 'Url',
                    onchange: urlChange,
                    onkeyup: updateText,
                    onfocusout: function (e) {
                        urlValidate(e.target);
                    }
                },
                textListCtrl,
                linkTitleCtrl,
                buildAnchorListControl(data.href),
                linkListCtrl,
                tagListCtrl,
                relListCtrl,
                targetListCtrl,
                classListCtrl,
                dataDescCtrl,
                colorsListCtrl,
            ],
            onSubmit: function (e) {

                // Force validate url input
                urlValidate($('.mce-link-input .mce-textbox')[0]);

                var validDescription = true;
                // Validate data description format.
                if(win.find('#data_description').length){
                    validDescription = validateDescription(win.find('#data_description').value);
                }

                var href, title;
                href = data.href;
                title = data.title;

                var dataDescription = e.data.data_description || undefined;

                // Validate an url
                function validateUrl(url) {
                    var pattern = new RegExp(
                        "^" +
                        "(?:(?:https?://|ftps?://|mailto:))" +
                        "(?:\\S+(?::\\S*)?@)?" +
                        "(?:" +
                        "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
                        "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
                        "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
                        "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
                        "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
                        "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
                        "|" +
                        "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
                        "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
                        "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
                        "\\.?" +
                        ")" +
                        "(?::\\d{2,5})?" +
                        "(?:[/?#]\\S*)?" +
                        "$" +
                        "|" +
                        "^tel:" , "i"
                        );
                    return (pattern.test(url));
                }

                // Delay confirm since onSubmit will move focus
                function delayedConfirm(message, callback) {
                    var rng = editor.selection.getRng();

                    window.setTimeout(function () {
                        editor.windowManager.confirm(message, function (state) {
                            editor.selection.setRng(rng);
                            callback(state);
                        });
                    }, 0);
                }
                function formatLinkContent(content) {
                    var formattedContent = content;
                    // Apply Link Format
                    if (editor.settings.link_format) {
                        var relations = {
                            bold: 'strong',
                            underline: 'u',
                        };

                        _.forOwn(editor.settings.link_format, function(value, key){
                            if (value) {
                                formattedContent = dom.createHTML(relations[key], false, formattedContent);
                            }
                        });
                    }

                    // Apply link fixed color
                    if ((editor.settings.link_color_palette && selected_color) || (editor.settings.link_force_color && editor.settings.link_fixed_color && /^#[0-9A-F]{6}$/i.test(editor.settings.link_fixed_color))) {
                        var wrapper = document.createElement('span');
                        wrapper.innerHTML = (typeof formattedContent === 'object') ? formattedContent.outerHTML : formattedContent;

                        // if has html tags and has only one html element and if span, add style
                        if (wrapper.childElementCount === 1 && wrapper.childNodes[0].nodeName === "SPAN") {
                            wrapper.firstChild.style.color = editor.settings.link_color_palette &&  selected_color ? selected_color : editor.settings.link_fixed_color;
                            // return inner span to avoid span duplication
                            formattedContent = wrapper.innerHTML;
                        }

                        // else, add color to wrapper and return
                        wrapper.style.color = editor.settings.link_color_palette &&  selected_color ? selected_color : editor.settings.link_fixed_color;
                        // force color in inner spans that have a color
                        var spans = wrapper.getElementsByTagName('span');
                        _.each(spans, function(span){
                            if (span.style.color) {
                                span.style.color = editor.settings.link_color_palette &&  selected_color ? selected_color : editor.settings.link_fixed_color;
                            }
                        });
                        formattedContent = wrapper.outerHTML;
                    }

                    return formattedContent;
                }

                function insertLink() {

                    var title = data.title ? data.title : null;
                    if(editor.settings.link_title && data.title === ''){
                         title = "";
                    }

                    var linkAttrs = {
                        href: href,
                        target: data.target ? data.target : null,
                        rel: data.rel ? data.rel : null,
                        "class": data["class"] ? data["class"] : null,
                        title: title,
                        "data-mce-href": href
                    };

                    if (dataDescription) {
                        linkAttrs["data-description"] = dataDescription;
                    }
                    if (anchorElm) {
                        editor.focus();

                        if (onlyText && data.text != initialText) {
                            if ("innerText" in anchorElm) {
                                anchorElm.innerText = data.text;
                            } else {
                                anchorElm.textContent = data.text;
                            }
                        }

                        dom.setAttribs(anchorElm, linkAttrs);
                        anchorElm.href = linkAttrs.href;

                        if(editor.settings.link_color_palette && selected_color) {
                            anchorElm.style.color = selected_color;
                            $(anchorElm).children().each(function (index, item) {
                                $(item).css('color', selected_color);
                            });
                        }

                        selection.select(anchorElm);
                        editor.undoManager.add();
                    } else {
                                              if (onlyText) {

                            var matches = [];

                            if (editor.settings.tag_list) {
                                matches = editor.settings.tag_list.filter(function (tag) {
                                    return tag.value == win.find('#href').value();
                                });
                                // Encode only urls
                                editor.insertContent(dom.createHTML('a', linkAttrs, (!matches.length) ? formatLinkContent(dom.encode(data.text)) : formatLinkContent(data.text)));
                            } else {
                                editor.insertContent(dom.createHTML('a', linkAttrs, formatLinkContent(data.text)));
                            }
                        } else {
                            mceInsertLink(linkAttrs);
                        }
                    }
                }

                if (!href && isLink) {
                    mceUnLink();
                    return;
                }

                // Validate the inserted url
                if (editor.settings.link_validate_url !== 'disabled') {
                    var matches = [];

                    if (editor.settings.tag_list) {
                        matches = editor.settings.tag_list.filter(function (tag) {
                            return tag.value == win.find('#href').value();
                        });
                    }

                    // Validate only urls
                    if ((editor.settings.link_validate_url === 'url' || editor.settings.link_validate_url === 'urlAndDestination')
                        && !matches.length
                        && !validateUrl(href)) {
                        $('.mce-link-input #errorMessage').remove();

                        if (Application.utils.validate.messages.url){
                            errorMessage = Application.utils.validate.messages.url;
                        }
                        $('.mce-link-input .mce-textbox')
                            .css('cssText', 'border-color: red')
                            .focus();

                        $('.mce-link-input').append("<span id='errorMessage' class='is-danger' style='display:inherit; position:fixed'>Please, enter a valid URL.</span>");

                        return false;
                    }

                    if(editor.settings.data_description && !validDescription ){
                        var noSpacesAllowTxt = 'Spaces are not allow.';
                        $('.mce-container-body .mce-textbox:eq(1)')
                            .addClass('error')
                            .focus();
                        win.find('#data_description')[0].tooltip().text(noSpacesAllowTxt).show();
                        // Fix tooltip position.
                        $(".mce-tooltip:contains("+noSpacesAllowTxt+")").css("top","+=40");
                        return false;
                    }


                    // validateUrlExists
                    if(Application.globals.validateUrlExists && editor.settings.link_validate_url === 'urlAndDestination') {
                        var $input = $('.mce-link-input .mce-textbox');
                        var urlValidated = false;
                        var dataUrlValidated = $input.data("url-validated")
                        // Update modal styles.
                        $input.closest(".mce-abs-layout-item").css("height","100%");
                        $input.closest(".mce-container.mce-abs-layout-item").css("height","100%");
                        $input.closest(".mce-abs-layout").css("height","100%");
                        $input.closest(".mce-container-body").css("height","100%");

                        if(dataUrlValidated){
                            $.each(dataUrlValidated,function(index,validation){
                                if( validation.url == $input.val() ){
                                    urlValidated = true;
                                }
                            });
                        }

                        if( !urlValidated ){
                            Application.helpers.validateUrlExist({
                                $target: $input,
                                onProcess: function(){
                                    // Disable submit button
                                    $('.mce-link-input .mce-textbox').parents(".mce-panel").find(".mce-btn.mce-first button")
                                        .attr("disabled","disabled")
                                        .css("opacity", 0.6);
                                },
                                onFinish: function(resultsArr){
                                    // Enable submit button
                                    $('.mce-link-input .mce-textbox').parents(".mce-panel").find(".mce-btn.mce-first button")
                                        .removeAttr("disabled")
                                        .css("opacity", 1);
                                    // Check if some url doesn't exist
                                    var validated = true;
                                    if(resultsArr){
                                        $.each(resultsArr,function(index,validationData){
                                            if( !validationData.isValid ){
                                                validated = false;
                                            }
                                        });
                                    }

                                    // Submit form if every url was validated
                                    if(validated){
                                       $('.mce-link-input .mce-textbox').parents(".mce-panel").find(".mce-btn.mce-first button").click();
                                    }
                                }
                            });

                            return false;
                        }

                    }
                }

                $('.mce-link-input .mce-textbox').removeAttr('style');

                insertLink();

                /* After submitting, tinymce releases the selection, so we have to disable link button */
               linkButton.disabled(true);
            }
        });
    }

    editor.addButton('link', {
        icon: 'link',
        tooltip: 'Insert/edit link',
        shortcut: 'Meta+K',
        onclick: createLinkList(showDialog),
        stateSelector: 'a[href]',
        onPostRender : function() {
            linkButton = this;
            stLinksExtended.buttons[editor.id] = this;
         },
        disabled:true
    });

    editor.addButton('unlink', {
        icon: 'unlink',
        tooltip: 'Remove link',
        cmd: 'unlink',
        stateSelector: 'a[href]'
    });

    editor.addShortcut('Meta+K', '', createLinkList(showDialog));
    editor.addCommand('mceLink', createLinkList(showDialog));

    this.showDialog = showDialog;

    editor.addMenuItem('link', {
        icon: 'link',
        text: 'Insert/edit link',
        shortcut: 'Meta+K',
        onclick: createLinkList(showDialog),
        stateSelector: 'a[href]',
        context: 'insert',
        prependToContext: true
    });

  });

  var stLinksExtended = {
    running: false,
    buttons: {},
    checkLinkButton: function() {
        /* Enable or disable the link button, depending on whether or not you have a text selection */
        var editor = tinymce.activeEditor;
        if (editor && editor.buttons.link) {
            var textSelection = editor.selection.getContent({format : 'text'});
            var linkButton = stLinksExtended.buttons[editor.id];

            if (linkButton) {
                /* If there is no selection, disable the button */
                if (!textSelection || $.trim( textSelection ) == '') {
                    /* But, if button is active, it means that already has a link added,
                    so we have to enable the button, even if there is no selection made */
                    if (stLinksExtended.buttons[editor.id].active()) {
                        linkButton.disabled(false);
                    } else {
                        linkButton.disabled(true);
                    }
                } else {
                    /* If there is a selection, enable de button */
                    linkButton.disabled(false);
                }
            }
        }
    }
  };
