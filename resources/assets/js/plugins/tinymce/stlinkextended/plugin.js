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

    function createLinkList(callback) {
        return function () {
            var linkList = editor.settings.link_list;

            if (typeof linkList == "string") {
                tinymce.util.XHR.send({
                    url: linkList,
                    success: function (text) {
                        callback(tinymce.util.JSON.parse(text));
                    }
                });
            } else if (typeof linkList == "function") {
                linkList(callback);
            } else {
                callback(linkList);
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

    function showDialog (linkList) {

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

        function isOnlyTextSelected(anchorElm) {
            var html = selection.getContent();

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

        selectedElm = selection.getNode();
        anchorElm = dom.getParent(selectedElm, 'a[href]');
        onlyText = isOnlyTextSelected();
        var content = (selectedElm.textContent === selection.getContent()) ? selectedElm.outerHTML : selection.getContent();
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
                label: 'Description',
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
                value: data.title
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
            ],
            onSubmit: function (e) {

                // Force validate url input
                urlValidate($('.mce-link-input .mce-textbox')[0]);

                var validDescription = true;
                // Validate data description format.
                if( $('.mce-container-body .mce-textbox:eq(1)').length ){
                    validDescription = validateDescription($('.mce-container-body .mce-textbox:eq(1)')[0]);
                }

                var href;
                href = data.href;

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
                        "$", "i"
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

                function insertLink() {
                    var linkAttrs = {
                        href: href,
                        target: data.target ? data.target : null,
                        rel: data.rel ? data.rel : null,
                        "class": data["class"] ? data["class"] : null,
                        title: data.title ? data.title : null,
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
                                editor.insertContent(dom.createHTML('a', linkAttrs, (!matches.length) ? dom.encode(data.text) : data.text));
                            } else {
                                editor.insertContent(dom.createHTML('a', linkAttrs, data.text));
                            }
                        } else {
                            editor.execCommand('mceInsertLink', false, linkAttrs);
                        }
                    }
                }

                if (!href) {
                    editor.execCommand('unlink');
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

                    if( !validDescription ){
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
