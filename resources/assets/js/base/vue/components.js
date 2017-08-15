/*
| ==================================================================
|  Vue Components
| ==================================================================
|
| This file contains all the vue components.
|
| @todo: move components to individual files and configure vueify.
|
| ------------------------------------------------------------------
*/

Vue.component('dashboard', {
    template: '#dashboard-template',
    created: function() {
        this.updateCampaigns();
    },
    data: function() {
        return {
            campaigns: {
                current: [],
                finished: [],
                template: []
            },
            terms: [],
            tags: [],
            pagination: {
                current: {
                    page: 1,
                    sortBy: '',
                    direction: ''
                },
                finished: {
                    page: 1,
                    sortBy: '',
                    direction: ''
                },
                template: {
                    page: 1,
                    sortBy: '',
                    direction: ''
                }
            },
            search: '',
            showLoading: {
                current: false,
                finished: false,
                template: false
            },
            last_uploads: {}
        }
    },
    props: ['config', 'proofConfig'],
    computed: {
        canSearch: function() {
            return this.checkTagLimit();
        }
    },
    methods: {
        addSearchTag: function(tag) {
            if (this.checkTagLimit() && tag.length > 0 && this.getIndex(this.tags, tag) < 0) {
                this.search = '';
                this.tags.push(tag);
                this.resetPage();
                this.updateCampaigns();
            }
        },
        addSearchTerm: function(term) {
            if (this.checkTagLimit() && term.length > 0 && this.getIndex(this.terms, term) < 0) {
                this.search = '';
                this.terms.push(term);
                this.resetPage();
                this.updateCampaigns();
            }
        },
        applySort: function(sortKey, direction, type, resetPage) {
            this.pagination[type].sortBy = sortKey;
            this.pagination[type].direction = direction;
            if (resetPage) {
                this.pagination[type].page = 1;
            }
            this.fetchCampaigns(type);
        },
        changePage: function(page, type) {
            this.pagination[type].page = page;
            this.fetchCampaigns(type);
        },
        checkTagLimit: function() {
            return (this.config.search_settings.max_tags == 0
                || parseInt(this.tags.length + this.terms.length) < this.config.search_settings.max_tags);
        },
        fetchCampaigns: function(type) {
            this.showLoading[type] = true;
            var data = {
                direction: this.pagination[type].direction,
                page: this.pagination[type].page,
                tags: this.tags,
                terms: this.terms,
                sort: this.pagination[type].sortBy
            };
            $.getJSON(Application.globals.baseUrl + '/dashboard/campaigns/' + type, data, function(campaigns) {
                this.campaigns[type] = campaigns;
                this.showLoading[type] = false;
            }.bind(this));
        },
        getIndex: function(data, value) {
            return data.map(function (data) { return data; }).indexOf(value);
        },
        removeSearchTag: function(tag) {
            var index = this.getIndex(this.tags, tag);
            this.tags.splice(index, 1);
            this.resetPage();
            this.updateCampaigns();
        },
        removeSearchTerm: function(term) {
            var index = this.getIndex(this.terms, term);
            this.terms.splice(index, 1);
            this.resetPage();
            this.updateCampaigns();
        },
        resetPage: function() {
            this.pagination.current.page = 1;
            this.pagination.finished.page = 1;
            this.pagination.template.page = 1;
        },
        updateCampaigns: function() {
            this.fetchCampaigns('current');
            this.fetchCampaigns('finished');
            this.fetchCampaigns('template');
        }
    }
});

Vue.component('pagination', {
    template: '#pagination-template',
    props: {
        currentPage: {
            type: Number,
            default: 1
        },
        lastPage: {
            type: Number,
            default: 0
        },
        maxPages: {
            type: Number
        }
    },
    computed: {
        pages: function() {
            var pages = [];
            if (this.lastPage <= 1) {
                return pages;
            }
            if (this.lastPage <= this.maxPages) {
                for (i = 1; i <= this.lastPage; i++) {
                    pages.push(i);
                }
            } else {
                var numAdjacents = Math.floor((this.maxPages - 3) / 2);
                if (this.currentPage + numAdjacents > this.lastPage) {
                    var slidingStart = this.lastPage - this.maxPages + 2;
                } else {
                    var slidingStart = this.currentPage - numAdjacents;
                }
                if (slidingStart < 2) {
                    slidingStart = 2;
                }
                var slidingEnd = slidingStart + this.maxPages - 3;
                if (slidingEnd >= this.lastPage) {
                    slidingEnd = this.lastPage - 1;
                }
                pages.push(1);
                if (slidingStart > 2) {
                    pages.push('...');
                }
                for ($i = slidingStart; $i <= slidingEnd; $i++) {
                    pages.push($i);
                }
                if (slidingEnd < this.lastPage - 1) {
                    pages.push('...');
                }
                pages.push(this.lastPage);
            }
            return pages;
        }
    },
    methods: {
        changePage: function(page) {
            if (page !== this.currentPage && page !== '...') {
                this.$emit('change-page', page);
            }
        }
    }
});

Vue.component('campaign-tag', {
    template: '#campaign-tag-template',
    props: {
        highlighted: {
            type: Boolean,
            default: false
        },
        tag: {
            type: String,
            required: true
        }
    },
    methods: {
        addTag: function(tag) {
            this.$emit('add-search-tag', tag);
        }
    }
});

Vue.component('column-sort', {
    template: '#column-sort-template',
    computed: {
        sortClass: function() {
            return {
                'glyphicon-triangle-bottom': this.sort === this.field,
                'glyphicon-triangle-top': this.sort === this.field ? this.reverse : false
            }
        }
    },
    props: ['field', 'title', 'sort', 'reverse'],
    methods: {
        sortBy: function(field) {
            this.$emit('change-sort', field);
        }
    }
});

Vue.component('draft-emails', {
    template: '#draft-emails-template',
    mixins: [ dashboardTableMixin, proofMixin ]
});

Vue.component('templates-campaigns', {
    template: '#templates-campaigns-template',
    mixins: [ dashboardTableMixin ]
});

Vue.component('finished-emails', {
    template: '#finished-emails-template',
    mixins: [ dashboardTableMixin, proofMixin ],
    data: function() {
        return {
            last_uploads: {},
        }
    },
    props: {
        showPlaintext: {
            type: Number
        },
        enableDownload: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        isUploaded: function(campaign) {
            if (campaign.uploads.length) {
                var campaign_date = new Date(campaign.updated_at);
                var upload_date = new Date(campaign.uploads[0].updated_at);
                if (upload_date.getTime() >= campaign_date.getTime()) {
                    return true;
                }
            }
            return false;
        }
    }
});

Vue.component('campaign-search', {
    template: '#campaign-search-template',
    data: function() {
        return {
            timer: null
        }
    },
    props: {
        canSearch: {
            type: Boolean
        },
        enabled: {
            type: Boolean
        },
            limit: {
                type: Number
            },
        search: {
            type: String
        },
            showLimitMessage: {
                type: Boolean
            },
        tags: {
            type: Array
        },
        terms: {
            type: Array
        }
    },
    methods: {
        addSearchTerm: function(event) {
            this.$emit('add-search-term', this.search);
            var $el = $(".search-key");
            $el.autocomplete("close");
        },
        removeSearchTag: function(tag) {
            this.$emit('remove-search-tag', tag);
        },
        removeSearchTerm: function(term) {
            this.$emit('remove-search-term', term);
        }
    },
    mounted: function () {
        var $el = $(".search-key");
        var _this = this;
        $el.autocomplete({
            source: $el.data('tags'),
            select: function(event,ui){
                    _this.$emit('add-search-tag', ui.item.value);
                $el.autocomplete("close");
                return false;
            }
        });
    }
});

Vue.component('modal', {
    template: '#modal-template',
    props: {
        size: {
            type: String,
            default: 'sm'
        }
    }
});

// WIP: It will be implemented later
Vue.component('proof-modal', {
    template: '#proof-modal-template',
    created: function () {
        this.fetchUsers();
    },
    data: function() {
        return {
            users: []
        }
    },
    props: {
        showModal: {
            type: Boolean,
            default: false
        },
        campaignId: {
            type: String
        }
    },
    methods: {
        closeProofModal: function() {
            this.showModal = false;
            this.$emit('close-proof-modal');
        },
        fetchUsers: function() {
            var data = {};
            $.getJSON(Application.globals.baseUrl + '/proof/users', data, function(users) {
                this.users = users;
                console.log(this.users);
            }.bind(this));
        }
    }
});
