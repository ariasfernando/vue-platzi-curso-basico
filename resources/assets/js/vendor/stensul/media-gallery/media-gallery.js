var VueResource = require('vue-resource/dist/vue-resource');
var Vue = require('vue/dist/vue');
Vue.use(VueResource);

(function ($) {
    var mediaGallery = document.getElementById('media-gallery');

    if (mediaGallery !== null) {
        String.prototype.toCapitalize = function() {
            return this.charAt(0).toUpperCase() + this.slice(1);
        }

        Vue.component('vue-image', {
            template: '#image',
            props: ['itemimage'],
            methods: {
                showModal: function (image) {
                    vm.showModal(image);
                },
                setMediaToSelected: function (id) {
                    if (!this.mediaIsSelected(id)) {
                        vm.mediaSelected.push(id);
                    }
                },
                unsetMediaToSelected: function (id) {
                    if (this.mediaIsSelected(id)) {
                        vm.mediaSelected = vm.mediaSelected.filter(media => {
                            return media !== id;
                        });
                    }
                },
                mediaIsSelected: function (id) {
                    let result = false;

                    vm.mediaSelected.map(media => {
                        if (media === id) {
                            result = true;
                        }
                    });

                    return result;
                }
            }
        });

        Vue.component('spinner', {
            template: '#spinner'
        });

        Vue.component('library-item', {
            template: '#library',
            props: ['library'],
            methods: {
                action: function (id, name) {
                    if (vm.mediaSelected.length > 0) {
                        vm.assignMedia(id);
                    } else {
                        vm.getMedia(id, name);
                    }
                }
            }
        });

        Vue.component('library-form', {
            template: '#library-form',
            data: function () {
                return {
                    name: ''
                };
            },
            methods: {
                save: function () {
                    vm.$refs.dropDownButton.click();
                    
                    if (this.name !== '') {
                        var data = new FormData();

                        data.append('name', this.name);


                        vm.$http.post('library', data).then(response => {
                            this.name = '';

                            vm.getLibrary();
                        });
                    }
                }
            }
        });

        Vue.component('media-gallery-modal', {
            template: '#modal',
            props: ['image', 'is-up-modal'],
            computed: {
                name: function () {
                    return this.image.name;
                },
                show: function () {
                    return this.isUpModal;
                }
            },
            methods: {
                removeImage: function () {
                    vm.hideModal();
    
                    vm.removeImage(this.image._id);
                },
                hideModal: function () {
                    vm.hideModal();
                }
            }
        });

        var vm = new Vue({
            el: '#media-gallery',
            http: {
                root: '/package/api',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'Content-Type': 'multipart/form-data'
                }
            },
            data: {
                filesSelected: [],
                dataImage: [],
                libraries: [],
                mediaSelected: [],
                filter: '',
                nameLibrary: '',
                isUpModal: false,
                currentImage: {}
            },
            computed: {
                filteredLibraries: function () {
                    var name = new RegExp(this.filter, 'g');

                    if (this.filter !== '') {
                        return this.libraries.filter(function (item) {
                            return item.name.match(name);
                        });
                    } else {
                        return this.libraries;
                    }

                }
            },
            methods: {
                triggerInput: function (event) {
                    var input = event.target.parentElement.parentElement.querySelector('input[name="image"]');

                    input.click();
                },
                onChangeInput: function (event) {
                    this.filesSelected = [];

                    var files = event.target.files;

                    for (var index = 0; index < files.length; index++) {
                        this.runValidation(files[index], index);
                    }
                },
                uploadImage: function (form) {
                    var data = new FormData(), self = this;

                    Object.keys(form).forEach(function (name) {
                        data.append(name, form[name]);
                    });

                    var id = this.dataImage.length;

                    this.dataImage.unshift({
                        _id: id,
                        name: form.file.name,
                        path: window.URL.createObjectURL(form.file),
                        uploading: true
                    });

                    this.$http.post('media', data, {
                        progress: function (event) {
                            if (event.lengthComputable) {
                                /**
                                 * Here goes the calculation of progress
                                 * event.loaded / event.total * 100;
                                 */
                            }
                        }
                    }).then(function (response) {
                        response = response.body;
                        
                        self.dataImage = self.dataImage.map(function (item, index) {
                            if (item._id === id) {
                                Object.keys(response).forEach(function (name) {
                                    item[name] = response[name];
                                });

                                item.uploading = false;
                            }

                            return item;
                        });
                    }, function (response) {
                        response = response.body;

                        self.dataImage = self.dataImage.map(function (item, index) {
                            if (item._id === id) {
                                item.error = response.error;

                                item.uploading = false;
                            }

                            return item;
                        });
                    });
                },
                removeImage: function (id) {
                    var self = this;

                    var send = true;

                    this.dataImage = this.dataImage.map(function (item, index) {
                        if (item._id === id) {
                            item.uploading = true;

                            if (item.error) {
                                send = false;
                            }
                        }

                        return item;
                    });

                    if (send) {
                        this.$http.delete('media/' + id).then(function () {
                            self.dataImage = self.dataImage.filter(function (item) {
                                return item._id !== id;
                            });
                        });
                    } else {
                        self.dataImage = self.dataImage.filter(function (item) {
                            return item._id !== id;
                        });
                    }
                },
                runValidation: function (file, index) {
                    var self = this;

                    this.fileValidator(file, function (result) {
                        /**
                         * When result is different to True is a message about what failed
                         */
                        if (result === true) {
                            self.uploadImage({
                                file: file
                            });
                        }
                    });
                },
                fileValidator: function (file, callback) {
                    var fileReader = new FileReader();
        
                    var getMimeType = function (signature) {
                        switch (signature) {
                            case '89504E47':
                                return 'image/png';
                            case '47494638':
                                return 'image/gif';
                            case '25504446':
                                return 'application/pdf';
                            case 'FFD8FFDB':
                            case 'FFD8FFE0':
                                return 'image/jpeg';
                            case '504B0304':
                                return 'application/zip';
                            case '49492A00':
                                return 'image/tiff';
                            case '424DF604':
                                return 'image/bmp';
                            default:
                                return 'Unknown filetype';
                        }
                    };
        
                    var validMime = function (mime) {
                        var mimes = [
                            'image/png',
                            'image/gif',
                            'image/jpeg',
                            'image/bmp',
                            'image/tiff'
                        ];
                        
                        if (mimes.indexOf(mime) >= 0) {
                            return true;
                        }
        
                        return mime;
                    };
        
                    fileReader.onloadend = function (event) {
                        if (event.target.readyState === FileReader.DONE) {
                            var uint = new Uint8Array(event.target.result);
        
                            var bytes = [];
        
                            uint.forEach(function (byte) {
                                bytes.push(byte.toString(16));
                            });
        
                            var hex = bytes.join('').toUpperCase();
        
                            callback(validMime(getMimeType(hex)));
                        } 
                    };
        
                    var blob = file.slice(0, 4);
        
                    fileReader.readAsArrayBuffer(blob);
                },
                getMedia: function (id, name) {
                    var options = {
                        params: {}
                    };

                    if (id) {
                        options.params.libraries = [id];
                    }

                    if (name) {
                        this.nameLibrary = '/ ' + name;
                    } else {
                        this.nameLibrary = '';
                    }

                    this.$http.get('media', options).then(response => {
                        this.dataImage = response.body;
                    });
                },
                getLibrary: function () {
                    this.$http.get('library').then(response => {
                        this.libraries = response.body.data.map(item => item);
                    });
                },
                assignMedia: function (id) {
                    if (id && this.mediaSelected.length) {
                        let data = this.mediaSelected.map((value, index) => {
                            return `media[${index}]=${value}`;
                        }).join('&');

                        this.$http.put(`library/${id}/media`, [data], {
                            headers: {
                                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                                'Content-Type': 'application/x-www-form-urlencoded'
                            }
                        }).then(response => {
                            this.mediaSelected = [];
                        });
                    }
                },
                hideModal: function () {
                    this.isUpModal = false;

                    setTimeout(() => {
                        this.currentImage = {};
                    }, 500);
                },
                showModal: function (image) {
                    this.isUpModal = true;

                    this.currentImage = image;
                }
            },
            mounted: function () {
                this.getMedia();

                this.getLibrary();
            }
        });
    }
})(jQuery);