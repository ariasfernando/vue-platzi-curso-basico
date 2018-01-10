/**
 * plugin.js
 */

/*global tinymce:true */

tinymce.PluginManager.add('stlinkextended', function (editor) {
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

    function showDialog(linkList) {
        var data = {}, selection = editor.selection, dom = editor.dom, selectedElm, anchorElm, initialText;
        var win, onlyText, textListCtrl, linkListCtrl, tagListCtrl, relListCtrl, targetListCtrl, classListCtrl, linkTitleCtrl, value;

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
                if (href.indexOf('@') > 0 && href.indexOf('//') == -1 && href.indexOf('mailto:') == -1) {
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

        data.text = initialText = anchorElm ? (anchorElm.innerText || anchorElm.textContent) : selection.getContent({ format: 'text' });
        data.href = anchorElm ? dom.getAttrib(anchorElm, 'href') : '';

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
                    tooltip: 'Insert a valid url',
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
                classListCtrl
            ],
            onSubmit: function (e) {

                // Force validate url input
                urlValidate($('.mce-link-input .mce-textbox')[0]);

                var href;
                href = data.href;

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
                            }
                            // Encode only urls
                            editor.insertContent(dom.createHTML('a', linkAttrs, (!matches.length) ? dom.encode(data.text) : data.text));
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
                if (editor.settings.link_validate_url) {
                    var matches = [];

                    if (editor.settings.tag_list) {
                        matches = editor.settings.tag_list.filter(function (tag) {
                            return tag.value == win.find('#href').value();
                        });
                    }

                    // Validate only urls
                    if (!matches.length && !validateUrl(href)) {
                        var errorMessage = 'Entered URL is invalid or incomplete.';
                        if (Application.utils.validate.messages.url){
                            errorMessage = Application.utils.validate.messages.url;
                        }
                        $('.mce-link-input .mce-textbox')
                            .css('cssText', 'border-color: red')
                            .focus();
                        win.find('#href')[0].tooltip().text(errorMessage).show();
                        return false;
                    }

                    // validateUrlExists
                    if(Application.globals.validateUrlExists) {
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
            }
        });
    }

    editor.addButton('link', {
        icon: 'link',
        tooltip: 'Insert/edit link',
        shortcut: 'Meta+K',
        onclick: createLinkList(showDialog),
        stateSelector: 'a[href]'
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
